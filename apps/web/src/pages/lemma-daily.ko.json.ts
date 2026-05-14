// /lemma-daily.ko.json — Korean variant of today's pick.

import type { APIRoute } from "astro";
import { dayIndex, picksForDay } from "../lib/today-pick";

const SITE = "https://lemma.wiki";

export const GET: APIRoute = () => {
  const now = new Date();
  const picks = picksForDay(now, "ko");
  const payload = {
    schema_version: "1.0",
    generated_at: now.toISOString(),
    day_index: dayIndex(now),
    site: SITE,
    lang: "ko",
    picks: picks.map((p) => ({
      kind: p.kind,
      id: p.id,
      label: p.label,
      title: p.title,
      description: p.description,
      url: `${SITE}${p.url}`,
    })),
  };
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
