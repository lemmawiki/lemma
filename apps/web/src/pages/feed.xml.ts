// /feed.xml — RSS 2.0 feed of Lemma's daily picks (English).
//
// Korean variant lives at /feed.ko.xml. A 14-day rolling window of
// "today's pick" rotations — 14 × 4 = 56 items at most. Each item has
// a stable per-day guid so feed readers dedupe correctly.

import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { dateForDayIndex, picksForRecentDays, dayIndex } from "../lib/today-pick";

const FEED_DAYS = 14;
const SITE = "https://lemma.wiki";

export const GET: APIRoute = () => {
  const entries = picksForRecentDays(FEED_DAYS, "en");
  return rss({
    title: "Lemma — Today's Pick",
    description: "One application, one module, one shape, one journey — rotated daily.",
    site: SITE,
    customData: "<language>en-US</language>",
    items: entries.map((e) => {
      const dayPart = parseInt(e.id.split(":")[0], 10);
      const pubDate = dateForDayIndex(Number.isNaN(dayPart) ? dayIndex() : dayPart);
      return {
        title: `${e.label} · ${e.title}`,
        link: `${SITE}${e.url}`,
        description: e.description,
        pubDate,
        categories: [e.kind, e.label],
        customData: `<guid isPermaLink="false">lemma:${e.id}</guid>`,
      };
    }),
  });
};
