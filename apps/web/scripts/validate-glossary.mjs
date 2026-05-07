// Glossary validator — run via `npm run validate:glossary`.
// Checks: every term folder has every required locale; frontmatter has
// `term`; body is non-empty; every `related: [...]` resolves.
//
// To support a new locale (e.g. ja), add it to REQUIRED_LOCALES.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "src", "data", "glossary");
const REQUIRED_LOCALES = ["en", "ko"];
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

const errors = [];
const warnings = [];

function parse(raw) {
  const m = raw.match(FRONTMATTER_RE);
  if (!m) return { fm: {}, body: raw.trim() };
  return { fm: yaml.load(m[1]) ?? {}, body: m[2].trim() };
}

const order = JSON.parse(readFileSync(join(ROOT, "_order.json"), "utf8"));
const ids = new Set();
const dirEntries = readdirSync(ROOT).filter(
  (n) => !n.startsWith("_") && !n.startsWith(".") && statSync(join(ROOT, n)).isDirectory(),
);

for (const id of dirEntries) {
  ids.add(id);
  const folder = join(ROOT, id);
  for (const locale of REQUIRED_LOCALES) {
    const file = join(folder, `${locale}.md`);
    let raw;
    try {
      raw = readFileSync(file, "utf8");
    } catch {
      errors.push(`${id}/${locale}.md missing`);
      continue;
    }
    const { fm, body } = parse(raw);
    if (!fm.term) errors.push(`${id}/${locale}.md: missing 'term' in frontmatter`);
    if (!body) errors.push(`${id}/${locale}.md: empty body`);
    if (fm.related && !Array.isArray(fm.related)) {
      errors.push(`${id}/${locale}.md: 'related' must be an array`);
    }
  }
}

// Check related: [] references resolve.
for (const id of ids) {
  for (const locale of REQUIRED_LOCALES) {
    const file = join(ROOT, id, `${locale}.md`);
    let raw;
    try {
      raw = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const { fm } = parse(raw);
    for (const rel of fm.related ?? []) {
      if (!ids.has(rel)) {
        errors.push(`${id}/${locale}.md: 'related: [${rel}]' does not resolve to a term folder`);
      }
    }
  }
}

// Order file vs folders.
for (const id of order) {
  if (!ids.has(id)) errors.push(`_order.json references unknown id '${id}'`);
}
for (const id of ids) {
  if (!order.includes(id))
    warnings.push(`${id} not in _order.json (will be hidden from glossary list)`);
}

if (warnings.length) {
  console.warn("\n[glossary] warnings:");
  for (const w of warnings) console.warn("  •", w);
}

if (errors.length) {
  console.error("\n[glossary] errors:");
  for (const e of errors) console.error("  ✗", e);
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}

console.log(`[glossary] OK — ${ids.size} terms × ${REQUIRED_LOCALES.length} locales validated.`);
