// Single source of truth for how a content-collection entry maps to a URL.
//
// Three Astro routes — the HTML page (`[lang]/[...slug].astro`), the
// per-page JSON sidecar (`[lang]/[...slug].json.ts`), and the manifest
// (`lemma-manifest.json.ts`) — all need to know *what URL* an entry lives
// at. Before this helper existed, each file held its own `if (kind ===
// "modules") ...` ladder, which is exactly the shadow-schema critique
// the MCP issue called out. New content kinds had to be added to every
// file, or they silently disappeared from one of them.
//
// Add a new content kind here, once. Every consumer follows.
//
// Entry id convention (Astro content collection): `<kind>/<slug>/<lang>`
//   modules/log/en
//   applications/bitcoin-pizza/ko
//   journeys/to-bitcoin/en
//   hubs/home/en      → renders at /<lang>/         (slug is "")
//   hubs/graph/en     → renders at /<lang>/graph

import { applicationByHref } from "../data/applications";

export type Lang = "en" | "ko";
export type Kind = "modules" | "applications" | "journeys" | "hubs";

export interface EntryRoute {
  kind: Kind;
  slug: string;
  lang: Lang;
  /** Path segment after the locale prefix, with no leading slash.
   *  "modules/log", "finance/bitcoin-pizza", "journey/to-bitcoin",
   *  "" for the language root, "graph" for the graph hub. */
  routePath: string;
  /** Full URL path including the locale prefix: "/en/modules/log".
   *  Hubs at the language root return "/en/". */
  url: string;
}

/** Parse `<kind>/<slug>/<lang>` and compute the entry's URL. Returns null
 *  when the id doesn't match the expected shape or the lang is unknown. */
export function routeFromEntryId(entryId: string): EntryRoute | null {
  const parts = entryId.split("/");
  if (parts.length < 2) return null;
  const lang = parts.pop() as Lang;
  if (lang !== "en" && lang !== "ko") return null;
  const kind = parts[0] as Kind;
  const slug = parts.slice(1).join("/");

  let routePath: string;
  switch (kind) {
    case "modules":
      routePath = `modules/${slug}`;
      break;
    case "applications": {
      // Applications live under pillar-prefixed paths (e.g. /finance/...) —
      // recover the canonical href from the applications registry.
      const app = Object.values(applicationByHref).find((a) => a.id === slug);
      routePath = app ? app.href.replace(/^\//, "") : `applications/${slug}`;
      break;
    }
    case "journeys":
      routePath = `journey/${slug}`;
      break;
    case "hubs":
      routePath = slug === "home" ? "" : slug;
      break;
    default:
      routePath = `${kind}/${slug}`;
  }

  const url = routePath ? `/${lang}/${routePath}` : `/${lang}/`;
  return { kind, slug, lang, routePath, url };
}
