// /lemma-daily.json — today's pick, as a flat JSON document.
//
// Lighter than /feed.json (which carries 14 days). Mobile apps, Slack
// bots, email-digest cron jobs hit this once a day and get exactly
// today's 4 picks: one application, one module, one shape, one journey.
// Korean variant: /lemma-daily.ko.json.

import type { APIRoute } from "astro";
import { dayIndex, picksForDay } from "../lib/today-pick";

const SITE = "https://lemma.wiki";

export const GET: APIRoute = () => {
  const now = new Date();
  const picks = picksForDay(now, "en");
  const payload = {
    schema_version: "1.0",
    generated_at: now.toISOString(),
    day_index: dayIndex(now),
    site: SITE,
    lang: "en",
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
