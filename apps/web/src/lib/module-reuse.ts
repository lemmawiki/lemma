// Module reuse — which applications consume a given module, grouped by pillar.
//
// The user has been hand-writing "this module is used in X, Y, Z apps"
// prose at the end of every module page (commits 4f092ef, 60bd007,
// 8edf2d1, 1c6e91c, ab36725, 3a2c65f, b59f28b, ...). That information
// is already in applications.ts via the `modules: string[]` field.
// This helper inverts the index once so the <CrossPillarReuse> MDX
// component can render it from data.

import { applications, PILLAR_LABEL, type Pillar } from "../data/applications";
import { modules } from "../data/modules";
import type { Lang } from "./route-from-entry";

export interface ConsumerApp {
  id: string;
  title: string;
  hook: string;
  href: string;
}

export interface ConsumersByPillar {
  pillar: Pillar;
  label: string;
  apps: ConsumerApp[];
}

/** For a given module id, return its applications grouped by pillar.
 *  Pillars are ordered with the most-occupied first; within each pillar
 *  apps stay in applications.ts order for stable rendering. */
export function consumersByPillar(moduleId: string, lang: Lang): ConsumersByPillar[] {
  const consumers = applications.filter((a) => a.modules.includes(moduleId));
  const map = new Map<Pillar, ConsumerApp[]>();
  for (const a of consumers) {
    const list = map.get(a.pillar) ?? [];
    list.push({
      id: a.id,
      title: a.title[lang] ?? a.title.en,
      hook: a.hook[lang] ?? a.hook.en,
      href: `/${lang}${a.href}`,
    });
    map.set(a.pillar, list);
  }
  return [...map.entries()]
    .map(([pillar, apps]) => ({
      pillar,
      label: PILLAR_LABEL[pillar][lang] ?? PILLAR_LABEL[pillar].en,
      apps,
    }))
    .sort((a, b) => b.apps.length - a.apps.length);
}

/** Whether a module is consumed at all. Used to decide whether the
 *  <CrossPillarReuse> panel should render anything. */
export function hasConsumers(moduleId: string): boolean {
  return applications.some((a) => a.modules.includes(moduleId));
}

/** Convenience: module title in a given language. */
export function moduleTitle(moduleId: string, lang: Lang): string {
  const m = modules.find((x) => x.id === moduleId);
  return m ? (m.title[lang] ?? m.title.en) : moduleId;
}
