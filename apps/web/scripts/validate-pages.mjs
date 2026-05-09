#!/usr/bin/env node
// Parity check for the page content collection.
//
// Walks src/content/pages/** and asserts that every page directory containing
// at least one .mdx file contains BOTH `en.mdx` and `ko.mdx`. Catches "the
// translator forgot the counterpart" before it reaches a build error or, worse,
// a 404 in production.
//
// Run via `pnpm run validate:pages` (added to package.json).
//
// Exit codes:
//   0 — all good
//   1 — missing locales found

import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PAGES_DIR = join(ROOT, "src/content/pages");
const REQUIRED_LOCALES = ["en", "ko"];

function* walkDirs(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    yield full;
    yield* walkDirs(full);
  }
}

const missing = [];
const skipped = [];

for (const dir of walkDirs(PAGES_DIR)) {
  // Find direct-child .mdx files
  const files = readdirSync(dir);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  if (mdxFiles.length === 0) continue; // not a leaf page directory

  const locales = new Set(mdxFiles.map((f) => f.replace(/\.(mdx|md)$/, "")));
  const missingLocales = REQUIRED_LOCALES.filter((l) => !locales.has(l));
  const extraLocales = [...locales].filter((l) => !REQUIRED_LOCALES.includes(l));

  if (missingLocales.length > 0) {
    missing.push({ dir: relative(ROOT, dir), missing: missingLocales });
  }
  if (extraLocales.length > 0) {
    skipped.push({ dir: relative(ROOT, dir), found: extraLocales });
  }
}

if (missing.length === 0 && skipped.length === 0) {
  console.log(`[validate:pages] all page directories have ${REQUIRED_LOCALES.join(" + ")} ✓`);
  process.exit(0);
}

if (missing.length > 0) {
  console.error("[validate:pages] missing locale(s):");
  for (const m of missing) console.error(`  ${m.dir} — missing ${m.missing.join(", ")}`);
}
if (skipped.length > 0) {
  console.warn("[validate:pages] unexpected non-en/ko locale files:");
  for (const s of skipped) console.warn(`  ${s.dir} — found ${s.found.join(", ")}`);
}

if (missing.length > 0) process.exit(1);
process.exit(0);
