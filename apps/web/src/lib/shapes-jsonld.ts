// schema.org HowTo JSON-LD for a Lemma shape.
//
// Shapes are procedural skeletons that appear under different names
// across multiple Lemma pages. The JSON-LD shape that fits this best
// is HowTo — schema.org's vocabulary for step-by-step procedures.
// Google renders HowTo as a stepwise rich result; LLM crawlers
// recognise it; Lemma surfaces as authoritative on procedural
// "find the minimum" / "equilibrium" / "compression" queries.

import { applications } from "../data/applications";
import { shapeById, type ShapeMeta } from "../data/shapes";
import type { Lang } from "./route-from-entry";

export interface ShapeJsonLdInput {
  id: string;
  lang: Lang;
  url: string;
}

export function buildShapeJsonLd(input: ShapeJsonLdInput): Record<string, unknown> | null {
  const { id, lang, url } = input;
  const shape: ShapeMeta | undefined = shapeById[id];
  if (!shape) return null;

  const ld: Record<string, unknown> = {
    "@context": ["https://schema.org", { lemma: "https://lemma.wiki/ns#" }],
    "@type": "HowTo",
    "@id": url,
    url,
    inLanguage: lang,
    name: shape.title[lang] ?? shape.title.en,
    description: shape.hook[lang] ?? shape.hook.en,
    step: shape.skeleton.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name[lang] ?? step.name.en,
      text: step.gloss[lang] ?? step.gloss.en,
    })),
    "lemma:id": id,
    "lemma:instances": shape.instances.map((inst) => {
      const app = applications.find((a) => a.id === inst.page);
      const href = app ? `/${lang}${app.href}` : `/${lang}/applications/${inst.page}`;
      return {
        "@type": "Article",
        "@id": href,
        name: app ? (app.title[lang] ?? app.title.en) : inst.page,
        "lemma:pillar": app?.pillar,
        "lemma:objective": inst.objective[lang] ?? inst.objective.en,
        "lemma:stop": inst.stop[lang] ?? inst.stop.en,
      };
    }),
    "lemma:modules": shape.modules,
  };

  if (shape.journey) ld["lemma:journey"] = `/${lang}/journey/${shape.journey}`;

  return ld;
}
