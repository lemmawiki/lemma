// Per-page JSON sidecar.
//
// Every content page emits a sibling JSON at `<page-url>.json`:
//
//   /en/modules/log              → /en/modules/log.json
//   /ko/finance/bitcoin-pizza    → /ko/finance/bitcoin-pizza.json
//   /en/journey/to-bitcoin       → /en/journey/to-bitcoin.json
//
// This is the canonical machine-readable surface for the page — same data
// that renders the HTML, exposed as structured JSON. The MCP server (and
// any other integration) fetches these instead of vending a stale snapshot.
//
// Shape is deliberately page-scoped: each sidecar is *one* page, *one*
// language. Aggregation happens at the manifest level (lemma-manifest.json)
// or at the consumer.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { applications, applicationByHref, PILLAR_LABEL } from "../../data/applications";
import { modules, moduleByHref } from "../../data/modules";
import { journeys } from "../../data/journeys";

export async function getStaticPaths() {
  const entries = await getCollection("pages");
  return entries
    .map((entry) => {
      const parts = entry.id.split("/");
      if (parts.length < 2) return null;
      const lang = parts.pop() as "en" | "ko";
      if (lang !== "en" && lang !== "ko") return null;
      const kind = parts[0];
      const slug = parts.slice(1).join("/");

      let routePath: string;
      if (kind === "modules") {
        routePath = `modules/${slug}`;
      } else if (kind === "applications") {
        const app = Object.values(applicationByHref).find((a) => a.id === slug);
        routePath = app ? app.href.replace(/^\//, "") : `applications/${slug}`;
      } else if (kind === "journeys") {
        routePath = `journey/${slug}`;
      } else if (kind === "hubs") {
        routePath = slug === "home" ? "" : slug;
      } else {
        routePath = `${kind}/${slug}`;
      }

      // The hub at lang root (routePath === "") has no slug — sidecar at /en/.json
      // is ambiguous. Skip; hubs are listed in the manifest only.
      if (!routePath) return null;

      return {
        params: { lang, slug: routePath },
        props: { entry, kind, slug },
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

type EntryProps = {
  entry: Awaited<ReturnType<typeof getCollection<"pages">>>[number];
  kind: string;
  slug: string;
};

export const GET: APIRoute = ({ params, props }) => {
  const { entry, kind, slug } = props as EntryProps;
  const lang = (params.lang as "en" | "ko") ?? "en";

  // Build the canonical page URL (mirrors the .astro routing).
  let pageUrl: string;
  if (kind === "modules") {
    pageUrl = `/${lang}/modules/${slug}`;
  } else if (kind === "applications") {
    const app = applications.find((a) => a.id === slug);
    pageUrl = app ? `/${lang}${app.href}` : `/${lang}/applications/${slug}`;
  } else if (kind === "journeys") {
    pageUrl = `/${lang}/journey/${slug}`;
  } else {
    pageUrl = `/${lang}/${slug}`;
  }

  // Registry overlay — pulls extra metadata for known kinds. Keeps the
  // sidecar self-contained so consumers don't have to join against other
  // endpoints for typical reads.
  const overlay: Record<string, unknown> = {};
  if (kind === "modules") {
    const meta = moduleByHref[`/modules/${slug}`];
    if (meta) {
      overlay.title = meta.title[lang] ?? meta.title.en;
      overlay.hook = meta.hook[lang] ?? meta.hook.en;
      overlay.status = meta.status;
      overlay.consumed_by = applications
        .filter((a) => a.modules.includes(slug))
        .map((a) => ({
          id: a.id,
          title: a.title[lang] ?? a.title.en,
          pillar: a.pillar,
          url: `/${lang}${a.href}`,
        }));
    }
  } else if (kind === "applications") {
    const meta = applications.find((a) => a.id === slug);
    if (meta) {
      overlay.title = meta.title[lang] ?? meta.title.en;
      overlay.hook = meta.hook[lang] ?? meta.hook.en;
      overlay.pillar = meta.pillar;
      overlay.pillar_label = PILLAR_LABEL[meta.pillar][lang];
      overlay.modules = meta.modules.map((id) => {
        const m = modules.find((x) => x.id === id);
        return {
          id,
          title: m ? (m.title[lang] ?? m.title.en) : id,
          url: `/${lang}/modules/${id}`,
        };
      });
      overlay.status = meta.status;
    }
  } else if (kind === "journeys") {
    const meta = journeys.find((j) => j.id === slug);
    if (meta) {
      overlay.title = meta.title[lang] ?? meta.title.en;
      overlay.hook = meta.hook[lang] ?? meta.hook.en;
      overlay.tagline = meta.tagline[lang] ?? meta.tagline.en;
      overlay.duration = meta.duration;
      overlay.destination = meta.destination[lang] ?? meta.destination.en;
      overlay.days = meta.days.map((d) => ({
        day: d.day,
        page: `/${lang}${d.page}`,
        kind: d.kind,
        why: d.why[lang] ?? d.why.en,
      }));
    }
  }

  const payload = {
    schema_version: "2.0",
    kind,
    id: slug,
    lang,
    url: pageUrl,
    // Frontmatter title falls back when no registry overlay (e.g. hubs).
    title: overlay.title ?? entry.data.title,
    description: entry.data.description ?? null,
    // Raw MDX body. Consumers (MCP, search) strip imports/JSX as needed.
    body: entry.body ?? "",
    ...overlay,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
};
