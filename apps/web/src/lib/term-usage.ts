// Reverse-index — which content pages use a given glossary term.
//
// Each Term-id reference in an MDX body counts. Result is computed
// once per build by scanning the pages collection; consumers (glossary
// pages, JSON-LD reverse links) read from the cached map.

import { getCollection } from "astro:content";
import { routeFromEntryId, type Lang } from "./route-from-entry";

export interface TermUsage {
  /** Page URL (with lang prefix). */
  url: string;
  /** Page kind — modules | applications | journeys | hubs. */
  kind: string;
  /** Display title pulled from frontmatter. */
  title: string;
  /** Which language's body cites the term. */
  lang: Lang;
}

const TERM_RE = /<Term\s+[^>]*id=["']([^"']+)["']/g;

let cache: Promise<Map<string, TermUsage[]>> | null = null;

/** Map glossary id → list of pages that reference it. Memoized for the
 *  build. Pages are deduplicated by (kind, slug, lang) — multiple
 *  references on the same page count once. */
export async function getTermUsage(): Promise<Map<string, TermUsage[]>> {
  if (cache) return cache;
  cache = (async () => {
    const entries = await getCollection("pages");
    const map = new Map<string, Map<string, TermUsage>>();
    for (const entry of entries) {
      const route = routeFromEntryId(entry.id);
      if (!route || !route.routePath) continue;
      const seen = new Set<string>();
      for (const match of (entry.body ?? "").matchAll(TERM_RE)) {
        const termId = match[1];
        if (seen.has(termId)) continue;
        seen.add(termId);
        const bucket = map.get(termId) ?? new Map<string, TermUsage>();
        const key = `${route.kind}|${route.slug}|${route.lang}`;
        if (!bucket.has(key)) {
          bucket.set(key, {
            url: route.url,
            kind: route.kind,
            title: entry.data.title,
            lang: route.lang,
          });
        }
        map.set(termId, bucket);
      }
    }
    const out = new Map<string, TermUsage[]>();
    for (const [termId, bucket] of map) {
      // Stable order: lang asc, then kind, then slug — deterministic build.
      const list = [...bucket.values()].sort((a, b) =>
        a.lang === b.lang ? a.url.localeCompare(b.url) : a.lang.localeCompare(b.lang),
      );
      out.set(termId, list);
    }
    return out;
  })();
  return cache;
}
