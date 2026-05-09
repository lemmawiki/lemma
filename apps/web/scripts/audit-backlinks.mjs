// Backlink-omission audit — run via `pnpm run audit:backlinks`.
// Scans the MDX content collection (the canonical content surface since
// commit 8e209a9) and lists places where a glossary term appears as plain
// prose but isn't wrapped in <Term>. Advisory; not part of the build
// pipeline. Output: apps/web/audits/backlink-candidates.md.
//
// Redaction order (false-positive control). Each pass blanks a region with
// equal-length whitespace so line/column in the source survive:
//   1. frontmatter (--- ... ---)
//   2. import / export blocks (multi-line)
//   3. {/* JSX comments */}
//   4. ``` fenced code blocks ``` and `inline code`
//   5. markdown headings (`# …`, `## …`, …) — title surface, exempt
//   6. <Term ...>…</Term>          — already wrapped (children too)
//   7. <Formula ...>…</Formula>    — math symbols, not prose
//   8. <CodeBlock /> and any self-closing JSX widget tag
//   9. JSX attribute values        — name="…", name='…', name={…}
//      (catches kicker="…", title="…", tag="…", lang="…", n={1}, …)
//
// Matching:
//   - term.en — case-insensitive, \b-bounded
//   - term.ko — case-sensitive substring (Korean has no word boundaries)
//
// What stays in scope: prose inside <Hook>, <Lede>, <Pin>, <Arc>, <ArcRow>
// bodies, <Exercise> prompts, <Solution> answers, <Counterexample>,
// <WhyNotTaught>, and bare paragraphs. That's where a missing <Term> wrap
// matters; everything else is intentionally exempt.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const CONTENT = join(SRC, "content", "pages");
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

function walkMdx(root, out = []) {
  for (const name of readdirSync(root)) {
    const p = join(root, name);
    if (isDirectory(p)) walkMdx(p, out);
    else if (p.endsWith(".mdx")) out.push(p);
  }
  return out;
}

function blankOut(s) {
  // Preserve newlines so line numbers in the cleaned string match the source.
  return s.replace(/[^\n]/g, " ");
}

function redact(raw) {
  let s = raw;
  // 1. Frontmatter — first --- ... --- block at the top.
  s = s.replace(/^---\n[\s\S]*?\n---\n?/, blankOut);
  // 2. import / export blocks. Multi-line braces handled greedily up to the
  //    next "from" plus quoted source plus optional semicolon, OR a one-line
  //    statement. We blank the whole line range either way.
  s = s.replace(/^[ \t]*import\b[\s\S]*?from[ \t]+["'][^"']+["'];?[ \t]*$/gm, blankOut);
  s = s.replace(/^[ \t]*export\b[^\n]*$/gm, blankOut);
  // 3. JSX comments {/* ... */}
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, blankOut);
  // 4. Fenced code (``` ... ```) and inline code (`...`).
  s = s.replace(/```[\s\S]*?```/g, blankOut);
  s = s.replace(/`[^`\n]+`/g, blankOut);
  // 5. Markdown headings — `# …`, `## …`, etc. (title surface).
  s = s.replace(/^#{1,6}[ \t]+[^\n]*$/gm, blankOut);
  // 6. <Term ...>...</Term> — including children, since the wrapped text is
  //    already a backlink and shouldn't recur as a candidate.
  s = s.replace(/<Term\b[\s\S]*?<\/Term>/g, blankOut);
  // 7. <Formula ...>...</Formula> — math/symbols, not natural prose.
  s = s.replace(/<Formula\b[\s\S]*?<\/Formula>/g, blankOut);
  // 8. Self-closing JSX widget tags: <CodeBlock />, <ReliabilityDiagram />,
  //    <ScoreCooker />, etc. The opening tag carries no children; attributes
  //    are caught by step 9 anyway, but blanking the whole tag keeps things
  //    tidy.
  s = s.replace(/<[A-Z][\w]*\b[^>]*\/>/g, blankOut);
  // 9. JSX attribute values: name="...", name='...', name={short}.
  //    Catches kicker="...", title="...", tag="...", lang="...", n={1}, etc.
  s = s.replace(/\b([a-zA-Z][\w-]*)=("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\{[^{}]*\})/g, blankOut);
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
const mdxFiles = walkMdx(CONTENT).sort();

for (const file of mdxFiles) {
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
lines.push(
  "Places in `src/content/pages/**/*.mdx` where a glossary term appears as plain prose and is not",
);
lines.push(
  "wrapped in `<Term>`. Many will be intentional: re-mention of a term already wrapped earlier in",
);
lines.push(
  "the same paragraph, plurals or conjugations not in the canonical form, or non-technical use of a",
);
lines.push(
  "word that happens to share spelling with a term. This is an audit checklist, not a blocker.",
);
lines.push("");
lines.push(
  "Exempt by construction: frontmatter, imports, JSX comments, fenced/inline code, markdown",
);
lines.push(
  "headings, `<Term>` children, `<Formula>` bodies, self-closing widget tags, and JSX attribute",
);
lines.push("values (kicker, title, tag, lang, …).");
lines.push("");
lines.push(
  `Generated by \`pnpm run audit:backlinks\`. ${glossary.length} terms scanned across ${mdxFiles.length} MDX files.`,
);
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
  `[backlinks] ${candidates.length} candidate(s) across ${byFile.size} file(s) in ${mdxFiles.length} MDX file(s).`,
);
console.log(`[backlinks] report → ${relative(process.cwd(), REPORT)}`);
