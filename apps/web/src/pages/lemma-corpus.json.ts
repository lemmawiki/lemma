// Build-time corpus export.
//
// Static site emits /lemma-corpus.json at the end of `pnpm build`. The MCP
// package (apps/mcp) consumes this file as the source of truth for what AI
// agents can query: every module, application, journey, glossary term, and
// compute, with full bilingual prose and structured metadata.
//
// Schema kept stable so external consumers (LLMs, integrations) can rely on
// it. Bumping the major version of `schema_version` is a breaking change.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { modules } from "../data/modules";
import { applications, PILLAR_LABEL } from "../data/applications";
import { journeys } from "../data/journeys";
import { computes } from "../data/computes";
import { glossary } from "../data/glossary";

interface CorpusPage {
  kind: "modules" | "applications" | "journeys" | "hubs";
  slug: string;
  lang: "en" | "ko";
  url: string;
  title: string;
  description?: string;
  body: string;
}

export const GET: APIRoute = async () => {
  const entries = await getCollection("pages");

  const pages: CorpusPage[] = entries
    .map((entry) => {
      const parts = entry.id.split("/");
      if (parts.length < 3) return null;
      const lang = parts[parts.length - 1];
      if (lang !== "en" && lang !== "ko") return null;
      const kind = parts[0] as CorpusPage["kind"];
      const slug = parts.slice(1, -1).join("/");

      // Reconstruct the public URL the page lives at.
      let url = "";
      if (kind === "modules") url = `/${lang}/modules/${slug}`;
      else if (kind === "applications") {
        const app = applications.find((a) => a.id === slug);
        url = app ? `/${lang}${app.href}` : `/${lang}/applications/${slug}`;
      } else if (kind === "journeys") url = `/${lang}/journey/${slug}`;
      else if (kind === "hubs") url = slug === "home" ? `/${lang}/` : `/${lang}/${slug}`;

      return {
        kind,
        slug,
        lang,
        url,
        title: entry.data.title,
        description: entry.data.description,
        body: entry.body ?? "",
      } as CorpusPage;
    })
    .filter((p): p is CorpusPage => p !== null);

  const corpus = {
    schema_version: "1.0.0",
    generated_at: new Date().toISOString(),
    site: "https://lemma.wiki",
    counts: {
      modules: modules.length,
      applications: applications.length,
      journeys: journeys.length,
      glossary_terms: glossary.length,
      computes: Object.keys(computes).length,
      pages: pages.length,
    },
    modules: modules.map((m) => ({
      id: m.id,
      href: m.href,
      status: m.status,
      title: m.title,
      hook: m.hook,
    })),
    applications: applications.map((a) => ({
      id: a.id,
      href: a.href,
      pillar: a.pillar,
      pillar_label: PILLAR_LABEL[a.pillar],
      modules: a.modules,
      status: a.status,
      title: a.title,
      hook: a.hook,
    })),
    journeys: journeys.map((j) => ({
      id: j.id,
      title: j.title,
      hook: j.hook,
      tagline: j.tagline,
      duration: j.duration,
      destination: j.destination,
      days: j.days.map((d) => ({
        day: d.day,
        page: d.page,
        kind: d.kind,
        why: d.why,
      })),
    })),
    computes: Object.fromEntries(
      Object.entries(computes).map(([id, c]) => [
        id,
        {
          formula: c.formula,
          vars: Object.fromEntries(
            Object.entries(c.vars).map(([k, v]) => [
              k,
              {
                value: v.value,
                range: v.range,
                step: v.step,
                label: v.label,
              },
            ]),
          ),
          caption: c.caption,
        },
      ]),
    ),
    glossary: glossary.map((g) => ({
      id: g.id,
      related: g.related,
      locales: g.locales,
    })),
    pages,
  };

  return new Response(JSON.stringify(corpus, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};
