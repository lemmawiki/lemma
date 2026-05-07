import yaml from "js-yaml";
import order from "./_order.json";

export type Locale = "en" | "ko";
export const LOCALES: readonly Locale[] = ["en", "ko"] as const;

export interface LocaleView {
  term: string;
  body: string;
  flag?: string;
}

export interface GlossaryEntry {
  id: string;
  related: string[];
  locales: Partial<Record<Locale, LocaleView>>;
}

interface Frontmatter {
  term?: string;
  flag?: string;
  related?: string[];
}

const files = import.meta.glob("./*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parse(raw: string): { fm: Frontmatter; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw.trim() };
  const fm = (yaml.load(m[1]) as Frontmatter | null) ?? {};
  return { fm, body: m[2].trim() };
}

function buildIndex(): Record<string, GlossaryEntry> {
  const idx: Record<string, GlossaryEntry> = {};
  for (const [path, raw] of Object.entries(files)) {
    const m = path.match(/^\.\/([^/]+)\/([a-z]{2})\.md$/);
    if (!m) continue;
    const id = m[1];
    const locale = m[2] as Locale;
    if (!LOCALES.includes(locale)) continue;
    const { fm, body } = parse(raw);
    if (!fm.term || !body) {
      if (import.meta.env.DEV) {
        console.warn(`[glossary] ${id}/${locale}.md is missing term or body`);
      }
      continue;
    }
    if (!idx[id]) idx[id] = { id, related: fm.related ?? [], locales: {} };
    if (fm.related && idx[id].related.length === 0) idx[id].related = fm.related;
    idx[id].locales[locale] = {
      term: fm.term,
      body,
      flag: fm.flag?.trim() || undefined,
    };
  }
  return idx;
}

export const glossaryById: Record<string, GlossaryEntry> = buildIndex();

// Stable display order (pedagogical, not alphabetical).
export const glossary: GlossaryEntry[] = (order as string[])
  .map((id) => glossaryById[id])
  .filter((e): e is GlossaryEntry => Boolean(e));
