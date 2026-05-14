// /feed.ko.xml — Korean variant of the RSS feed.

import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { dateForDayIndex, picksForRecentDays, dayIndex } from "../lib/today-pick";

const FEED_DAYS = 14;
const SITE = "https://lemma.wiki";

export const GET: APIRoute = () => {
  const entries = picksForRecentDays(FEED_DAYS, "ko");
  return rss({
    title: "Lemma — 오늘의 한 줌",
    description: "응용, 모듈, 골격, 여정 — 매일 한 줌씩, 날짜 결정적으로 회전.",
    site: SITE,
    customData: "<language>ko-KR</language>",
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
