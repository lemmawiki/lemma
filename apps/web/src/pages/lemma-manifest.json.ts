// Lemma manifest — the slim index of everything.
//
// Lists every page, registry entry, and glossary term with enough metadata
// for a consumer (MCP server, search index, link-checker) to know what
// exists and where to fetch it. Bodies live in per-page sidecars
// (`<page-url>.json`); this endpoint never carries prose, keeping it small
// and cheap to refresh.
//
// Replaces the hand-rolled `lemma-corpus.json` — that endpoint duplicated
// fields from `data/*` and hard-coded URL patterns, so every new content
// kind silently disappeared from external integrations until someone
// remembered to add it here. The manifest derives everything from the
// content collection + registries, automatically.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { applications, applicationByHref, PILLAR_LABEL, type Pillar } from "../data/applications";
import { modules } from "../data/modules";
import { journeys } from "../data/journeys";
import { computes } from "../data/computes";
import { glossary } from "../data/glossary";
import { provenance } from "../data/provenance";
import { proofs } from "../data/proofs";

interface PageEntry {
  kind: "modules" | "applications" | "journeys" | "hubs";
  id: string;
  lang: "en" | "ko";
  url: string;
  sidecar: string;
  title: string;
  description?: string;
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, "") ?? "https://lemma.wiki";
  const entries = await getCollection("pages");

  const pages: PageEntry[] = entries
    .map((entry): PageEntry | null => {
      const parts = entry.id.split("/");
      if (parts.length < 2) return null;
      const lang = parts.pop() as "en" | "ko";
      if (lang !== "en" && lang !== "ko") return null;
      const kind = parts[0] as PageEntry["kind"];
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

      // Relative paths only — consumers (MCP, integrations) prepend their own
      // base. That way one manifest serves prod, staging, and local dev.
      const url = routePath ? `/${lang}/${routePath}` : `/${lang}/`;
      const sidecar = routePath ? `${url}.json` : "";

      return {
        kind,
        id: slug,
        lang,
        url,
        sidecar,
        title: entry.data.title,
        description: entry.data.description ?? undefined,
      };
    })
    .filter((p): p is PageEntry => p !== null);

  const payload = {
    schema_version: "2.0",
    generated_at: new Date().toISOString(),
    site: baseUrl,
    counts: {
      pages: pages.length,
      modules: modules.length,
      applications: applications.length,
      journeys: journeys.length,
      glossary: glossary.length,
      computes: Object.keys(computes).length,
      proofs: proofs.length,
      provenance: provenance.length,
    },
    pages,
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
      pillar: a.pillar as Pillar,
      pillar_label: PILLAR_LABEL[a.pillar as Pillar],
      modules: a.modules,
      status: a.status,
      title: a.title,
      hook: a.hook,
    })),
    journeys: journeys.map((j) => ({
      id: j.id,
      title: j.title,
      tagline: j.tagline,
      hook: j.hook,
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
    proofs: proofs.map((p) => ({
      id: p.id,
      module: p.module,
      statement: p.statement,
      mathlib: p.mathlib,
    })),
    provenance: provenance.map((p) => ({
      concept: p.concept,
      year: p.year,
      yearLabel: p.yearLabel,
      who: p.who,
      where: p.where,
      oneLiner: p.oneLiner,
      source: p.source,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
};
