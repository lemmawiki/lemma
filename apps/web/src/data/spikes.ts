// Spikes: experimental pages that test whether Lemma's grammar can carry a
// new kind of content before it becomes a published module or application.
// Visually distinct from modules / applications on the home page (dashed
// border, spike label) so visitors know what they're looking at.

import type { Locale } from "./glossary";

export interface SpikeMeta {
  id: string;
  href: string;
  title: Record<Locale, string>;
  hook: Record<Locale, string>;
  testing: Record<Locale, string>;
}

export const spikes: SpikeMeta[] = [];
