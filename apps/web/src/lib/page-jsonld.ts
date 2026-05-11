// Schema.org JSON-LD builder — single source of truth for page metadata.
//
// Both the HTML route (`[lang]/[...slug].astro` → emits a
// `<script type="application/ld+json">` in <head>) and the per-page sidecar
// (`[lang]/[...slug].json.ts` → serves the same JSON at `<page>.json`)
// call this. The two surfaces can never disagree about a page's structured
// metadata because they read it from the same function.
//
// Lemma-specific extensions live under a namespaced `lemma:` prefix
// declared in `@context`. Consumers that only understand standard
// schema.org still get name/headline/description/articleBody; richer
// consumers (MCP, Lemma's own integrations) read the extensions.

import { applications, PILLAR_LABEL } from "../data/applications";
import { modules } from "../data/modules";
import { journeys } from "../data/journeys";
import type { Lang } from "./route-from-entry";

export interface JsonLdInput {
  kind: string;
  slug: string;
  lang: Lang;
  /** Canonical URL of the page (no trailing slash, includes lang prefix). */
  url: string;
  /** Frontmatter title — used as fallback when no registry entry matches. */
  title: string;
  description?: string | null;
  /** Raw MDX body. The page route can pass an empty string when the sidecar
   *  carries the body and the HTML embedding doesn't need to repeat it. */
  body: string;
  /** Whether to include the full `articleBody`. False on HTML embeds keeps
   *  the inline JSON-LD tiny; true on the sidecar serves the full prose. */
  includeBody: boolean;
}

export function buildPageJsonLd(input: JsonLdInput): Record<string, unknown> {
  const { kind, slug, lang, url, title, description, body, includeBody } = input;

  const ld: Record<string, unknown> = {
    "@context": ["https://schema.org", { lemma: "https://lemma.wiki/ns#" }],
    "@type": "Article",
    "@id": url,
    url,
    inLanguage: lang,
    name: title,
    headline: title,
    description: description ?? null,
    "lemma:kind": kind,
    "lemma:id": slug,
  };

  if (includeBody) ld.articleBody = body;

  if (kind === "modules") {
    const meta = modules.find((m) => m.id === slug);
    if (meta) {
      ld.name = meta.title[lang] ?? meta.title.en;
      ld.headline = meta.title[lang] ?? meta.title.en;
      ld.abstract = meta.hook[lang] ?? meta.hook.en;
      ld["lemma:status"] = meta.status;
      ld["lemma:consumedBy"] = applications
        .filter((a) => a.modules.includes(slug))
        .map((a) => ({
          "@type": "Article",
          "@id": `/${lang}${a.href}`,
          name: a.title[lang] ?? a.title.en,
          "lemma:pillar": a.pillar,
        }));
    }
  } else if (kind === "applications") {
    const meta = applications.find((a) => a.id === slug);
    if (meta) {
      ld.name = meta.title[lang] ?? meta.title.en;
      ld.headline = meta.title[lang] ?? meta.title.en;
      ld.abstract = meta.hook[lang] ?? meta.hook.en;
      ld["lemma:pillar"] = meta.pillar;
      ld["lemma:pillarLabel"] = PILLAR_LABEL[meta.pillar][lang];
      ld["lemma:status"] = meta.status;
      ld["lemma:modules"] = meta.modules.map((id) => {
        const m = modules.find((x) => x.id === id);
        return {
          "@type": "Article",
          "@id": `/${lang}/modules/${id}`,
          name: m ? (m.title[lang] ?? m.title.en) : id,
        };
      });
    }
  } else if (kind === "journeys") {
    const meta = journeys.find((j) => j.id === slug);
    if (meta) {
      ld["@type"] = "Course";
      ld.name = meta.title[lang] ?? meta.title.en;
      ld.headline = meta.title[lang] ?? meta.title.en;
      ld.abstract = meta.hook[lang] ?? meta.hook.en;
      ld.alternativeHeadline = meta.tagline[lang] ?? meta.tagline.en;
      ld.timeRequired = `P${meta.duration}D`;
      ld["lemma:destination"] = meta.destination[lang] ?? meta.destination.en;
      ld["lemma:days"] = meta.days.map((d) => ({
        "@type": "CourseInstance",
        "lemma:day": d.day,
        "lemma:pageRef": `/${lang}${d.page}`,
        "lemma:kind": d.kind,
        description: d.why[lang] ?? d.why.en,
      }));
    }
  }

  return ld;
}
