#!/usr/bin/env node

// SEED — single-file HTML export per page.
//
// "Knowledge that depends on a server isn't yours." A Lemma seed is a single
// .html file you can email, USB-stick, archive, read on a plane. Open it in
// any browser, no internet, the prose works fully and most widgets work too.
//
// How it composes:
//   1. Astro is configured (`build.inlineStylesheets: "always"`) to fold all
//      CSS into <style> tags at build time. CSS done.
//   2. This script walks `dist/` after `astro build`, finds each public page,
//      reads its HTML, inlines every <script src="..."> referenced from the
//      `_astro/` chunk directory directly into the page.
//   3. Astro hydration loads widget components via dynamic import. We rewrite
//      those import URLs to inline data: URIs so the islands hydrate offline.
//   4. Output: dist-seeds/<lang>/<kind>/<slug>.html
//
// Honest caveat: a few hot-path dynamic imports (e.g. font CSS from Google,
// remote OG images) stay as remote URLs. Without internet they degrade
// gracefully — text uses fallback fonts, OG image just doesn't show. The
// math reads, the widgets respond.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), "..");
const DIST = resolve(ROOT, "dist");
const OUT = resolve(ROOT, "dist-seeds");

if (!existsSync(DIST)) {
  console.error(`[seeds] no dist/ — run \`pnpm build\` first.`);
  process.exit(1);
}

// Pages we seed. Hubs (home, graph) are heavy listings whose value lies in the
// graph navigation, not as static archive — skip. Same for sitemaps + corpus
// JSON + favicon-style assets.
function shouldSeed(htmlPath) {
  const rel = relative(DIST, htmlPath).replace(/\\/g, "/");
  if (!rel.endsWith("/index.html")) return false;
  // Locale-prefixed paths only.
  if (!rel.startsWith("en/") && !rel.startsWith("ko/")) return false;
  // Skip the locale root index (it's a hub listing, mostly redundant).
  if (rel === "en/index.html" || rel === "ko/index.html") return false;
  // Skip the graph hub.
  if (rel.endsWith("/graph/index.html")) return false;
  return true;
}

async function readDir(p) {
  try {
    return await readdir(p, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function* walk(dir) {
  for (const ent of await readDir(dir)) {
    const full = resolve(dir, ent.name);
    if (ent.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// ---- Asset cache ----------------------------------------------------------

const assetCache = new Map(); // path -> {body, mime}

function mimeFor(path) {
  if (path.endsWith(".js")) return "application/javascript";
  if (path.endsWith(".css")) return "text/css";
  if (path.endsWith(".woff2")) return "font/woff2";
  if (path.endsWith(".woff")) return "font/woff";
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

async function loadAsset(distRelPath) {
  if (assetCache.has(distRelPath)) return assetCache.get(distRelPath);
  const full = resolve(DIST, distRelPath.replace(/^\//, ""));
  try {
    const body = await readFile(full);
    const mime = mimeFor(full);
    const entry = { body, mime, path: full };
    assetCache.set(distRelPath, entry);
    return entry;
  } catch {
    return null;
  }
}

// ---- HTML transforms ------------------------------------------------------

// Inline a <script src="/_astro/...js"> as <script type="module">…</script>.
//
// Sequential await is intentional — assetCache and importedAssets are mutated
// during processing, and parallel work would just thrash the cache. The whole
// build runs ~ once per page in O(seconds) anyway.
async function inlineEntryScripts(html) {
  const re = /<script\b([^>]*?)\bsrc=["'](\/_astro\/[^"']+\.js)["']([^>]*)><\/script>/gi;
  const matches = [...html.matchAll(re)];
  let out = html;
  for (const m of matches) {
    const [full, before, src, after] = m;
    // eslint-disable-next-line no-await-in-loop
    const asset = await loadAsset(src);
    if (!asset) continue;
    const isModule = /\btype=["']module["']/.test(before + after);
    let code = asset.body.toString("utf8");
    // Rewrite relative imports inside this code: dynamic imports + static
    // imports that point at other /_astro/*.js files. We turn them into
    // data: URIs so the file works offline.
    // eslint-disable-next-line no-await-in-loop
    code = await rewriteImports(code);
    const tag = isModule ? `<script type="module">${code}</script>` : `<script>${code}</script>`;
    out = out.replace(full, tag);
  }
  return out;
}

const importedAssets = new Map(); // src -> dataURI (memoized per build)

async function rewriteImports(jsCode) {
  // Static & dynamic imports targeting /_astro/*.{js,mjs}
  // Patterns (whitespace between keyword and quote may be missing in minified
  // code, e.g. `from"./foo.js"`):
  //   import "..."     →  static
  //   import("...")    →  dynamic
  //   from "..."       →  any
  // We only rewrite chunks under /_astro/ (built artifacts).
  const reFrom = /(from\s*|import\s*\(\s*|import\s+)["']([^"']+\.m?js)["']/g;
  const out = await replaceAsync(jsCode, reFrom, async (full, prefix, src) => {
    // Resolve relative paths against /_astro/ since these chunks live there.
    let abs = src;
    if (src.startsWith("./") || src.startsWith("../")) {
      // Strip the leading ./ then resolve under /_astro/
      abs = "/_astro/" + src.replace(/^\.\.?\//, "");
    } else if (!src.startsWith("/")) {
      // Bare specifier (e.g. astro:scripts) — leave alone.
      return full;
    }
    if (!abs.startsWith("/_astro/")) return full;
    let dataUri = importedAssets.get(abs);
    if (!dataUri) {
      const asset = await loadAsset(abs);
      if (!asset) return full;
      // Recurse: child chunks may also import siblings.
      const childCode = await rewriteImports(asset.body.toString("utf8"));
      dataUri = `data:application/javascript;charset=utf-8,${encodeURIComponent(childCode)}`;
      importedAssets.set(abs, dataUri);
    }
    return `${prefix}"${dataUri}"`;
  });
  return out;
}

// Async-aware string replacer.
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    promises.push(asyncFn(match, ...args));
    return match;
  });
  const data = await Promise.all(promises);
  let i = 0;
  return str.replace(regex, () => data[i++]);
}

// Inline `<link rel="stylesheet">` (in case any survived inlineStylesheets).
async function inlineStylesheets(html) {
  const re =
    /<link\b[^>]*?\brel=["']stylesheet["'][^>]*?\bhref=["'](\/_astro\/[^"']+\.css)["'][^>]*?>/gi;
  const matches = [...html.matchAll(re)];
  let out = html;
  for (const m of matches) {
    const [full, href] = m;
    // eslint-disable-next-line no-await-in-loop
    const asset = await loadAsset(href);
    if (!asset) continue;
    out = out.replace(full, `<style>${asset.body.toString("utf8")}</style>`);
  }
  return out;
}

// Strip the prefetch / preload hints — they reference network paths the seed
// no longer relies on.
function stripPrefetch(html) {
  return html.replace(
    /<link\b[^>]*?\brel=["'](?:prefetch|preload|modulepreload)["'][^>]*?\/?>\s*/gi,
    "",
  );
}

// astro-island elements have component-url + renderer-url attributes pointing
// at /_astro/ chunks. The hydration JS does `import(componentUrl)` at runtime;
// when the page is opened off file://, those resolve incorrectly. Rewrite to
// data: URIs so islands hydrate offline.
async function rewriteIslandAttrs(html) {
  const re = /(\bcomponent-url|\brenderer-url|\bbefore-hydration-url)=["'](\/[^"']+)["']/g;
  const seen = new Map();
  return await replaceAsync(html, re, async (full, attr, src) => {
    if (!src.startsWith("/_astro/")) return full;
    if (seen.has(src)) return `${attr}="${seen.get(src)}"`;
    const asset = await loadAsset(src);
    if (!asset) return full;
    const code = await rewriteImports(asset.body.toString("utf8"));
    const dataUri = `data:application/javascript;charset=utf-8,${encodeURIComponent(code)}`;
    seen.set(src, dataUri);
    return `${attr}="${dataUri}"`;
  });
}

// Annotate the seed with a small banner identifying it.
function addSeedBanner(html, source) {
  const banner = `<!-- Lemma SEED · single-file export of ${source}\n     Generated ${new Date().toISOString()}\n     CC BY 4.0 (content) · MIT (code) -->\n`;
  return banner + html;
}

// ---- Main ----------------------------------------------------------------

async function processOne(htmlPath) {
  const rel = relative(DIST, htmlPath);
  const raw = await readFile(htmlPath, "utf8");
  let html = raw;
  html = stripPrefetch(html);
  html = await inlineStylesheets(html);
  html = await inlineEntryScripts(html);
  html = await rewriteIslandAttrs(html);
  html = addSeedBanner(html, rel);

  // Output: dist-seeds/<rel without /index.html>/<flat>.html
  // e.g. en/modules/log/index.html  →  dist-seeds/en/modules/log.html
  const flat = rel.replace(/\/index\.html$/, ".html");
  const outPath = resolve(OUT, flat);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
  return outPath;
}

const seeds = [];
for await (const f of walk(DIST)) {
  if (shouldSeed(f)) seeds.push(f);
}

console.log(`[seeds] found ${seeds.length} pages to seed`);
let totalBytes = 0;
let count = 0;
for (const f of seeds) {
  // eslint-disable-next-line no-await-in-loop
  const out = await processOne(f);
  // eslint-disable-next-line no-await-in-loop
  const sz = (await stat(out)).size;
  totalBytes += sz;
  count++;
  if (count <= 3 || count === seeds.length) {
    console.log(`[seeds]  ${relative(ROOT, out)}  ${(sz / 1024).toFixed(1)} KB`);
  }
}
console.log(
  `[seeds] OK — ${count} seeds, ${(totalBytes / 1024 / 1024).toFixed(2)} MB total, avg ${(
    totalBytes /
    count /
    1024
  ).toFixed(1)} KB`,
);
