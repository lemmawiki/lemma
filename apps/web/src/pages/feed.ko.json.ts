// /feed.ko.json — Korean variant of the JSON Feed.

import type { APIRoute } from "astro";
import { dateForDayIndex, picksForRecentDays, dayIndex } from "../lib/today-pick";

const FEED_DAYS = 14;
const SITE = "https://lemma.wiki";

export const GET: APIRoute = () => {
  const entries = picksForRecentDays(FEED_DAYS, "ko");
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Lemma — 오늘의 한 줌",
    home_page_url: SITE,
    feed_url: `${SITE}/feed.ko.json`,
    language: "ko-KR",
    description: "응용, 모듈, 골격, 여정 — 매일 한 줌씩, 날짜 결정적으로 회전.",
    items: entries.map((e) => {
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
