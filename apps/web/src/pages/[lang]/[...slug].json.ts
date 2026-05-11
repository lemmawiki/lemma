// Per-page JSON sidecar — schema.org JSON-LD shape.
//
// Every content page emits a sibling JSON at `<page-url>.json`:
//
//   /en/modules/log              → /en/modules/log.json
//   /ko/finance/bitcoin-pizza    → /ko/finance/bitcoin-pizza.json
//   /en/journey/to-bitcoin       → /en/journey/to-bitcoin.json
//
// Shape is produced by `lib/page-jsonld.ts`, the single source of truth
// the HTML route also calls — the two surfaces can never disagree.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildPageJsonLd } from "../../lib/page-jsonld";
import { routeFromEntryId, type Lang } from "../../lib/route-from-entry";

export async function getStaticPaths() {
  const entries = await getCollection("pages");
  return entries
    .map((entry) => {
      const route = routeFromEntryId(entry.id);
      if (!route) return null;
      // Hubs at lang root have no slug — sidecar at /en/.json is ambiguous.
      // Hubs are listed in the manifest only.
      if (!route.routePath) return null;
      return {
        params: { lang: route.lang, slug: route.routePath },
        props: { entry, kind: route.kind, slug: route.slug },
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
  const lang = (params.lang as Lang) ?? "en";
  const route = routeFromEntryId(entry.id);
  const url = route?.url ?? `/${lang}/${kind}/${slug}`;

  const ld = buildPageJsonLd({
    kind,
    slug,
    lang,
    url,
    title: entry.data.title,
    description: entry.data.description ?? null,
    body: entry.body ?? "",
    includeBody: true,
  });

  return new Response(JSON.stringify(ld, null, 2), {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
};
