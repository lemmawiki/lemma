// Build a slim corpus snapshot for the Lemma extension.
//
// Reads the workspace's glossary (apps/web/src/data/glossary/*) plus the page
// MDX bodies, then emits apps/extension/corpus.json with one entry per glossary
// term:
//
//   { id, en: { term, oneLiner }, ko: { term, oneLiner }, url }
//
// `url` is the path of the first module (or, failing that, application) that
// uses the term via <Term id="…">. If nothing uses it, falls back to /graph.
//
// Run from apps/extension/: `node scripts/build-corpus.mjs`

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", "..", "..");
const glossaryDir = join(repo, "apps", "web", "src", "data", "glossary");
const pagesDir = join(repo, "apps", "web", "src", "content", "pages");
const out = join(here, "..", "corpus.json");

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw.trim() };
  const fm = yaml.load(m[1]) ?? {};
  return { fm, body: m[2].trim() };
}

function loadGlossary() {
  const entries = {};
  for (const id of readdirSync(glossaryDir)) {
    const dir = join(glossaryDir, id);
    if (!statSync(dir).isDirectory()) continue;
    for (const lang of ["en", "ko"]) {
      const file = join(dir, `${lang}.md`);
      try {
        const raw = readFileSync(file, "utf8");
        const { fm, body } = parseFrontmatter(raw);
        if (!fm.term || !body) continue;
        entries[id] ??= { id, en: null, ko: null, url: null };
        entries[id][lang] = { term: String(fm.term), oneLiner: body.split("\n")[0].trim() };
      } catch {
        // Missing language file — skip.
      }
    }
  }
  return entries;
}

function walk(dir) {
  const acc = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) acc.push(...walk(full));
    else if (name.endsWith(".mdx")) acc.push(full);
  }
  return acc;
}

// Direct slug → module dir map for glossary ids whose canonical home doesn't
// match by name (e.g. "logarithm" lives in modules/log).
const directModule = {
  logarithm: "log",
  exponent: "log",
  base: "log",
  "common-log": "log",
  "natural-log": "log",
  "log-axis": "log",
  "compound-interest": "log",
  "rule-of-72": "log",
  "discrete-log": "bezout",
  derivative: "derivatives",
  "bezier-curve": "parametric-curves",
  "control-point": "parametric-curves",
  "de-casteljau": "parametric-curves",
  "parametrized-curve": "parametric-curves",
};

const appsRegPath = join(repo, "apps", "web", "src", "data", "applications.ts");
const appsReg = readFileSync(appsRegPath, "utf8");

function findUrl(id, mdxFiles) {
  // (1) Explicit alias to a module dir.
  if (directModule[id]) return `/en/modules/${directModule[id]}`;

  // (2) Module dir with the same id.
  for (const p of mdxFiles) {
    const rel = p.slice(pagesDir.length + 1);
    const m = rel.match(/^modules\/([^/]+)\/en\.mdx$/);
    if (m && m[1] === id) return `/en/modules/${id}`;
  }

  // (3) First module/application page that uses <Term id="...">.
  const re = new RegExp(`<Term[^>]*\\bid=["']${id}["']`);
  const ranked = mdxFiles
    .map((p) => {
      const rel = p.slice(pagesDir.length + 1);
      const kind = rel.split("/")[0];
      const slug = rel.split("/").slice(1, -1).join("/");
      const lang = rel.endsWith("/en.mdx") ? "en" : rel.endsWith("/ko.mdx") ? "ko" : null;
      const score = kind === "modules" ? 0 : kind === "applications" ? 1 : 2;
      return { p, kind, slug, lang, score };
    })
    .filter((x) => x.lang === "en")
    .sort((a, b) => a.score - b.score);
  for (const { p, kind, slug } of ranked) {
    const raw = readFileSync(p, "utf8");
    if (!re.test(raw)) continue;
    if (kind === "modules") return `/en/modules/${slug}`;
    if (kind === "applications") {
      const m = appsReg.match(
        new RegExp(`id:\\s*["']${slug}["'][\\s\\S]*?href:\\s*["']([^"']+)["']`),
      );
      if (m) return `/en${m[1]}`;
      return `/en/applications/${slug}`;
    }
  }
  return `/en/graph`;
}

const entries = loadGlossary();
const mdxFiles = walk(pagesDir);
const list = Object.values(entries)
  .filter((e) => e.en && e.ko)
  .map((e) => ({ ...e, url: findUrl(e.id, mdxFiles) }))
  .sort((a, b) => a.id.localeCompare(b.id));

const corpus = {
  schema_version: "0.1",
  generated_at: new Date().toISOString(),
  site: "https://lemma.wiki",
  count: list.length,
  entries: list,
};

writeFileSync(out, JSON.stringify(corpus, null, 2) + "\n");
console.log(`wrote ${out} — ${list.length} entries`);
