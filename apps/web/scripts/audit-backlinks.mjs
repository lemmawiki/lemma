// Backlink-omission audit - run via `pnpm run audit:backlinks`.
// Scans apps/web/src/views/*.tsx and lists places where a glossary term
// appears as plain text but isn't wrapped in <Term>. Advisory; not part of
// the build pipeline. Output: apps/web/audits/backlink-candidates.md.
//
// Redaction order (false-positive control). All passes blank a region with
// equal-length whitespace, so line/column in the source survive.
//   1. imports / exports / line and block comments
//   2. <Term ...>...</Term>             (already-wrapped — the whole block)
//   3. <Code .../>, <Code>...</Code>    (rendered code)
//   4. <span className={MONO}>...</span> (inline code)
//   5. <h1..h6>, <div className={KICKER}> (titles & kickers — exempt)
//   6. JSX attribute values              (className=, style=, etc.)
//   7. *Narrow* JSX expressions: {ident}, {ident.ident}, {ident[N]}, {N}
//      (anything with parens / commas / quotes / <  is preserved — those
//       are usually pick(language, ...), <>jsx</>, etc.)
//
// Matching:
//   - term.en — case-insensitive, \b-bounded
//   - term.ko — case-sensitive substring (Korean has no word boundaries)
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const VIEWS = join(SRC, "views");
const GLOSSARY = join(SRC, "data", "glossary");
const REPORT_DIR = join(ROOT, "audits");
const REPORT = join(REPORT_DIR, "backlink-candidates.md");

function read(file) {
  return readFileSync(file, "utf8");
}

function isDirectory(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function loadGlossary() {
  const terms = [];
  for (const id of readdirSync(GLOSSARY)) {
    if (id.startsWith("_") || id.startsWith(".")) continue;
    const dir = join(GLOSSARY, id);
    if (!isDirectory(dir)) continue;
    const labels = {};
    for (const locale of ["en", "ko"]) {
      const file = join(dir, `${locale}.md`);
      let raw;
      try {
        raw = read(file);
      } catch {
        continue;
      }
      const m = raw.match(/^---\n([\s\S]*?)\n---/);
      if (!m) continue;
      const fm = yaml.load(m[1]);
      if (fm?.term) labels[locale] = fm.term;
    }
    terms.push({ id, en: labels.en, ko: labels.ko });
  }
  return terms;
}

function blankOut(s) {
  // Preserve newlines so line numbers in the cleaned string match the source.
  return s.replace(/[^\n]/g, " ");
}

function redact(raw) {
  let s = raw;
  // 1. imports / exports / line and block comments
  s = s.replace(/^[ \t]*(?:import|export)[^\n]*$/gm, blankOut);
  s = s.replace(/\/\/[^\n]*/g, blankOut);
  s = s.replace(/\/\*[\s\S]*?\*\//g, blankOut);
  // 2. <Term>...</Term> — children too, since wrapped text isn't a candidate
  s = s.replace(/<Term\b[\s\S]*?<\/Term>/g, blankOut);
  // 3. <Code ... /> and <Code>...</Code>
  s = s.replace(/<Code\b[^>]*\/>/g, blankOut);
  s = s.replace(/<Code\b[\s\S]*?<\/Code>/g, blankOut);
  // 4. <span className={MONO}>...</span> — inline code
  s = s.replace(/<span\b[^>]*className=\{MONO\}[^>]*>[\s\S]*?<\/span>/g, blankOut);
  // 5. headings + meta kickers
  s = s.replace(/<h[1-6]\b[\s\S]*?<\/h[1-6]>/g, blankOut);
  s = s.replace(/<div\b[^>]*className=\{KICKER\}[^>]*>[\s\S]*?<\/div>/g, blankOut);
  // 5b. Exercise `tag={{ en: "...", ko: "..." }}` — short label, not prose.
  //     `prompt` and `solution` carry JSX bodies and are intentionally kept.
  s = s.replace(/\btag=\{\{[\s\S]*?\}\}/g, blankOut);
  // 6. JSX attribute values: name="..." | name='...' | name={short}
  //    The {} variant is restricted to a single, brace-free body so we don't
  //    eat into JSX children (those use balanced braces).
  s = s.replace(/\b([a-zA-Z][\w-]*)=("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\{[^{}]*\})/g, blankOut);
  // 7. Narrow JSX expressions only — bare identifier paths or numbers.
  //    Anything containing parens / commas / strings / `<` is preserved.
  s = s.replace(/\{[ \t]*[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*|\[\d+\])*[ \t]*\}/g, blankOut);
  s = s.replace(/\{[ \t]*\d+(?:\.\d+)?[ \t]*\}/g, blankOut);
  return s;
}

function lineColumn(raw, index) {
  const before = raw.slice(0, index);
  const newlines = before.split("\n");
  return { line: newlines.length, column: newlines[newlines.length - 1].length + 1 };
}

function snippet(raw, index, len) {
  const radius = 60;
  const start = Math.max(0, index - radius);
  const end = Math.min(raw.length, index + len + radius);
  let s = raw.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) s = "…" + s;
  if (end < raw.length) s = s + "…";
  return s;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const glossary = loadGlossary();
const candidates = [];

const viewFiles = readdirSync(VIEWS)
  .filter((f) => extname(f) === ".tsx" && !f.endsWith("-island.tsx"))
  .map((f) => join(VIEWS, f));

for (const file of viewFiles) {
  const raw = read(file);
  const cleaned = redact(raw);

  for (const term of glossary) {
    if (term.en) {
      const re = new RegExp(`\\b${escapeRegex(term.en)}\\b`, "gi");
      let match;
      while ((match = re.exec(cleaned))) {
        const { line, column } = lineColumn(cleaned, match.index);
        candidates.push({
          file,
          line,
          column,
          index: match.index,
          term_id: term.id,
          locale: "en",
          match: raw.slice(match.index, match.index + match[0].length),
          snippet: snippet(raw, match.index, match[0].length),
        });
      }
    }
    if (term.ko) {
      const re = new RegExp(escapeRegex(term.ko), "g");
      let match;
      while ((match = re.exec(cleaned))) {
        const { line, column } = lineColumn(cleaned, match.index);
        candidates.push({
          file,
          line,
          column,
          index: match.index,
          term_id: term.id,
          locale: "ko",
          match: raw.slice(match.index, match.index + match[0].length),
          snippet: snippet(raw, match.index, match[0].length),
        });
      }
    }
  }
}

candidates.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column);

const byFile = new Map();
for (const c of candidates) {
  const key = relative(ROOT, c.file).split("\\").join("/");
  if (!byFile.has(key)) byFile.set(key, []);
  byFile.get(key).push(c);
}

const lines = [];
lines.push("# Backlink candidates — manual review");
lines.push("");
lines.push("Places in `src/views/*.tsx` where a glossary term appears as plain text and");
lines.push("is not wrapped in `<Term>`. Many will be intentional: re-mention of a term");
lines.push("already wrapped in the same paragraph, plurals or conjugations not in the");
lines.push("canonical form, or non-technical use of a word that happens to share spelling");
lines.push("with a term. This is an audit checklist, not a blocker.");
lines.push("");
lines.push(`Generated by \`pnpm run audit:backlinks\`. ${glossary.length} terms scanned.`);
lines.push(`Total candidates: **${candidates.length}** across ${byFile.size} file(s).`);
lines.push("");
lines.push("> This report is a local build artifact and is not committed by default.");
lines.push("> See `apps/web/audits/.gitignore`. When the candidate list is small enough");
lines.push("> to act as a baseline, commit it; suppressed entries can be tracked from there.");
lines.push("");

if (candidates.length === 0) {
  lines.push("✓ No candidates.");
} else {
  for (const [file, items] of byFile) {
    lines.push(`## \`${file}\` — ${items.length}`);
    lines.push("");
    for (const c of items) {
      lines.push(
        `- **L${c.line}:${c.column}** · term: \`${c.term_id}\` · locale: \`${c.locale}\` · match: \`${c.match}\``,
      );
      lines.push(`  > ${c.snippet}`);
      lines.push("");
    }
  }
}

mkdirSync(REPORT_DIR, { recursive: true });
writeFileSync(REPORT, lines.join("\n"));

console.log(
  `[backlinks] ${candidates.length} candidate(s) across ${byFile.size} file(s) in ${viewFiles.length} view(s).`,
);
console.log(`[backlinks] report → ${relative(process.cwd(), REPORT)}`);
