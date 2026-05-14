// /feed.json — JSON Feed 1.1 (https://www.jsonfeed.org) variant of the
// daily picks feed. Easier to consume than RSS from JavaScript-side
// integrations (mobile apps, Slack bots) without an XML parser.
// Korean variant lives at /feed.ko.json.

import type { APIRoute } from "astro";
import { dateForDayIndex, picksForRecentDays, dayIndex } from "../lib/today-pick";

const FEED_DAYS = 14;
const SITE = "https://lemma.wiki";

interface JsonFeedItem {
  id: string;
  url: string;
  title: string;
  content_text: string;
  date_published: string;
  tags: string[];
}

export const GET: APIRoute = () => {
  const entries = picksForRecentDays(FEED_DAYS, "en");
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Lemma — Today's Pick",
    home_page_url: SITE,
    feed_url: `${SITE}/feed.json`,
    language: "en-US",
    description: "One application, one module, one shape, one journey — rotated daily.",
    items: entries.map((e): JsonFeedItem => {
      const dayPart = parseInt(e.id.split(":")[0], 10);
      const pubDate = dateForDayIndex(Number.isNaN(dayPart) ? dayIndex() : dayPart);
      return {
        id: `lemma:${e.id}`,
        url: `${SITE}${e.url}`,
        title: `${e.label} · ${e.title}`,
        content_text: e.description,
        date_published: pubDate.toISOString(),
        tags: [e.kind, e.label],
      };
    }),
  };
  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
};
