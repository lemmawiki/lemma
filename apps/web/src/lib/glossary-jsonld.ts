// schema.org DefinedTerm builder for a glossary entry.
//
// Each /<lang>/glossary/<id> page advertises itself as a DefinedTerm so
// search engines (Google rich results), LLM crawlers, and any structured-
// data consumer can ingest Lemma's bilingual term definitions as a
// first-class web resource — not just MCP-only JSON.

import { glossaryById, type GlossaryEntry } from "../data/glossary";
import { provenance } from "../data/provenance";
import type { Lang } from "./route-from-entry";
import type { TermUsage } from "./term-usage";

export interface GlossaryJsonLdInput {
  id: string;
  lang: Lang;
  url: string;
  usage: TermUsage[];
}

export function buildGlossaryJsonLd(input: GlossaryJsonLdInput): Record<string, unknown> | null {
  const { id, lang, url, usage } = input;
  const entry = glossaryById[id];
  if (!entry) return null;

  const counterpartLang: Lang = lang === "en" ? "ko" : "en";
  const view = entry.locales[lang] ?? entry.locales.en;
  const counter = entry.locales[counterpartLang];

  // Provenance: only if a year/who exists for this concept.
  const prov = provenance.find((p) => p.concept === id);

  const ld: Record<string, unknown> = {
    "@context": ["https://schema.org", { lemma: "https://lemma.wiki/ns#" }],
    "@type": "DefinedTerm",
    "@id": url,
    url,
    inLanguage: lang,
    name: view?.term ?? id,
    termCode: id,
    description: view?.body ?? "",
    inDefinedTermSet: `/${lang}/glossary/`,
    "lemma:id": id,
  };

  if (counter?.term) {
    ld.alternateName = counter.term;
    ld["lemma:counterpartLang"] = counterpartLang;
  }

  if (view?.flag) ld["lemma:flag"] = view.flag;

  if (entry.related.length > 0) {
    ld["lemma:related"] = entry.related.map((relId) => ({
      "@type": "DefinedTerm",
      "@id": `/${lang}/glossary/${relId}`,
      name: glossaryById[relId]?.locales[lang]?.term ?? relId,
    }));
  }

  if (prov) {
    ld["lemma:provenance"] = {
      "@type": "CreativeWork",
      dateCreated: String(prov.year),
      creator: prov.who,
      locationCreated: prov.where,
      abstract: prov.oneLiner[lang] ?? prov.oneLiner.en,
      ...(prov.source ? { sameAs: prov.source } : {}),
    };
  }

  if (usage.length > 0) {
    ld["lemma:usedOn"] = usage
      .filter((u) => u.lang === lang)
      .map((u) => ({
        "@type": "Article",
        "@id": u.url,
        name: u.title,
        "lemma:kind": u.kind,
      }));
  }

  return ld;
}

export function getGlossaryEntries(): GlossaryEntry[] {
  return Object.values(glossaryById);
}
