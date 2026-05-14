// Today's pick — date-deterministic rotation across the four content axes.
//
// The home page features one application, one module, one shape, and one
// journey. Same calendar day → same picks (no refresh shuffle). This
// helper centralises the rotation logic so the home view (React) and the
// feed endpoints (server-rendered XML / JSON) agree on what "today" is.

import { applications, PILLAR_LABEL } from "../data/applications";
import { modules } from "../data/modules";
import { shapes } from "../data/shapes";
import { journeys } from "../data/journeys";
import type { Lang } from "./route-from-entry";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Days since the Unix epoch — the integer that seeds rotation. */
export function dayIndex(date: Date = new Date()): number {
  return Math.floor(date.getTime() / MS_PER_DAY);
}

/** Pick item N (rotated by salt + dayIndex) from the list. */
function pickFor<T>(items: readonly T[], dayIdx: number, salt: number): T | null {
  if (items.length === 0) return null;
  return items[(dayIdx + salt) % items.length] ?? null;
}

export interface PickEntry {
  kind: "application" | "module" | "shape" | "journey";
  id: string;
  url: string;
  title: string;
  description: string;
  /** Extra category-specific label (pillar for apps, etc.) used by feed
   *  readers as a tag/category. */
  label: string;
}

/** The four picks for a given day, in a given language. */
export function picksForDay(date: Date, lang: Lang): PickEntry[] {
  const idx = dayIndex(date);
  const liveApps = applications.filter((a) => a.status === "available");
  const liveModules = modules.filter((m) => m.status === "available");

  const out: PickEntry[] = [];

  const app = pickFor(liveApps, idx, 0);
  if (app) {
    out.push({
      kind: "application",
      id: app.id,
      url: `/${lang}${app.href}`,
      title: app.title[lang] ?? app.title.en,
      description: app.hook[lang] ?? app.hook.en,
      label: PILLAR_LABEL[app.pillar][lang] ?? PILLAR_LABEL[app.pillar].en,
    });
  }

  const mod = pickFor(liveModules, idx, 1);
  if (mod) {
    out.push({
      kind: "module",
      id: mod.id,
      url: `/${lang}${mod.href}`,
      title: mod.title[lang] ?? mod.title.en,
      description: mod.hook[lang] ?? mod.hook.en,
      label: lang === "ko" ? "모듈" : "module",
    });
  }

  const shape = pickFor(shapes, idx, 2);
  if (shape) {
    out.push({
      kind: "shape",
      id: shape.id,
      url: `/${lang}/shapes/${shape.id}`,
      title: shape.title[lang] ?? shape.title.en,
      description: shape.hook[lang] ?? shape.hook.en,
      label: lang === "ko" ? "골격" : "shape",
    });
  }

  const journey = pickFor(journeys, idx, 3);
  if (journey) {
    out.push({
      kind: "journey",
      id: journey.id,
      url: `/${lang}/journey/${journey.id}`,
      title: journey.title[lang] ?? journey.title.en,
      description: journey.tagline[lang] ?? journey.tagline.en,
      label: lang === "ko" ? `여정 · ${journey.duration}일` : `journey · ${journey.duration} days`,
    });
  }

  return out;
}

/** Picks for each of the last N days (newest first). Used by the feeds
 *  so subscribers see a rolling window rather than a single day's snapshot. */
export function picksForRecentDays(days: number, lang: Lang, now: Date = new Date()): PickEntry[] {
  const out: PickEntry[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - i * MS_PER_DAY);
    const picks = picksForDay(d, lang);
    // Annotate each entry with the day it was picked, encoded into the
    // id field so consumers (feed readers) can stable-guid by day.
    for (const p of picks) {
      out.push({ ...p, id: `${dayIndex(d)}:${p.kind}:${p.id}` });
    }
  }
  return out;
}

/** Midnight UTC for a given dayIndex — used to compute pubDate from a guid. */
export function dateForDayIndex(idx: number): Date {
  return new Date(idx * MS_PER_DAY);
}
