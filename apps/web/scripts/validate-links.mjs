// Reference validator - run via `pnpm run validate:links`.
// Checks:
// - every static <Term id="..."> resolves to a glossary folder
// - every glossary `related: [...]` id resolves to a glossary folder
// - every applications[].modules id resolves to a module id
// - every application/module/spike href resolves to an Astro page route
// - every static <Link to="/..."> resolves to an Astro page route
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const PAGES = join(SRC, "pages");
const GLOSSARY = join(SRC, "data", "glossary");
const APPLICATIONS = join(SRC, "data", "applications.ts");
const MODULES = join(SRC, "data", "modules.ts");
const SPIKES = join(SRC, "data", "spikes.ts");

const SOURCE_EXTS = new Set([".astro", ".ts", ".tsx"]);
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

const errors = [];
const warnings = [];

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

function walk(dir, predicate = () => true) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".astro" || name === "dist") continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      out.push(...walk(path, predicate));
    } else if (predicate(path)) {
      out.push(path);
    }
  }
  return out;
}

function parseFrontmatterBlock(raw) {
  const match = raw.match(FRONTMATTER_RE);
  return match?.[1] ?? "";
}

function quotedStrings(raw) {
  return [...raw.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
}

function parseRelatedIds(frontmatter) {
  const match = frontmatter.match(/^related:\s*\[([^\]]*)\]\s*$/m);
  return match ? quotedStrings(match[1]) : [];
}

function normalizeRoute(route) {
  const withoutHash = route.split("#")[0].split("?")[0];
  if (!withoutHash || withoutHash === "/") return "/";
  return withoutHash.replace(/\/+$/, "");
}

function routeFromAstroPage(file) {
  let path = relative(PAGES, file).split(sep).join("/");
  path = path.replace(/\.astro$/, "");
  if (path === "index") return "/";
  if (path.endsWith("/index")) path = path.slice(0, -"/index".length);
  if (path.includes("[")) return null;
  return normalizeRoute(`/${path}`);
}

function lineNumber(raw, index) {
  return raw.slice(0, index).split("\n").length;
}

function fileLabel(file) {
  return relative(ROOT, file).split(sep).join("/");
}

function validateStaticHrefs(file, raw, routeSet) {
  for (const match of raw.matchAll(/\bhref:\s*["'](\/[^"']+)["']/g)) {
    const href = normalizeRoute(match[1]);
    if (!routeSet.has(href)) {
      errors.push(
        `${fileLabel(file)}:${lineNumber(raw, match.index)}: href "${match[1]}" has no Astro page`,
      );
    }
  }
}

const glossaryIds = new Set(
  readdirSync(GLOSSARY).filter(
    (name) => !name.startsWith("_") && !name.startsWith(".") && isDirectory(join(GLOSSARY, name)),
  ),
);

const sourceFiles = walk(SRC, (file) => SOURCE_EXTS.has(extname(file)));

for (const file of sourceFiles) {
  const raw = read(file);
  for (const match of raw.matchAll(/<Term\b[^>]*\bid\s*=\s*["']([^"']+)["']/g)) {
    const id = match[1];
    if (!glossaryIds.has(id)) {
      errors.push(
        `${fileLabel(file)}:${lineNumber(raw, match.index)}: <Term id="${id}"> has no glossary folder`,
      );
    }
  }

  for (const match of raw.matchAll(/<Term\b[^>]*\bid\s*=\s*{[^}]+}/g)) {
    warnings.push(
      `${fileLabel(file)}:${lineNumber(raw, match.index)}: dynamic <Term id={...}> not validated`,
    );
  }
}

for (const id of glossaryIds) {
  for (const locale of ["en", "ko"]) {
    const file = join(GLOSSARY, id, `${locale}.md`);
    let raw;
    try {
      raw = read(file);
    } catch {
      continue;
    }
    const frontmatter = parseFrontmatterBlock(raw);
    for (const rel of parseRelatedIds(frontmatter)) {
      if (!glossaryIds.has(rel)) {
        errors.push(`${fileLabel(file)}: related id "${rel}" has no glossary folder`);
      }
    }
  }
}

const modulesRaw = read(MODULES);
const moduleIds = new Set();
for (const match of modulesRaw.matchAll(/\bid:\s*["']([^"']+)["']/g)) {
  moduleIds.add(match[1]);
}

const routeSet = new Set();
for (const file of walk(PAGES, (entry) => extname(entry) === ".astro")) {
  const route = routeFromAstroPage(file);
  if (route) routeSet.add(route);
}

validateStaticHrefs(APPLICATIONS, read(APPLICATIONS), routeSet);
validateStaticHrefs(MODULES, modulesRaw, routeSet);
validateStaticHrefs(SPIKES, read(SPIKES), routeSet);

const applicationsRaw = read(APPLICATIONS);
for (const match of applicationsRaw.matchAll(/\bmodules:\s*\[([\s\S]*?)\]/g)) {
  for (const id of quotedStrings(match[1])) {
    if (!moduleIds.has(id)) {
      errors.push(
        `${fileLabel(APPLICATIONS)}:${lineNumber(applicationsRaw, match.index)}: module id "${id}" is not in modules.ts`,
      );
    }
  }
}

for (const file of sourceFiles) {
  const raw = read(file);
  for (const match of raw.matchAll(/<Link\b[^>]*\bto\s*=\s*["'](\/[^"']+)["']/g)) {
    const route = normalizeRoute(match[1]);
    if (!routeSet.has(route)) {
      errors.push(
        `${fileLabel(file)}:${lineNumber(raw, match.index)}: <Link to="${match[1]}"> has no Astro page`,
      );
    }
  }
}

if (warnings.length) {
  console.warn("\n[links] warnings:");
  for (const warning of warnings) console.warn("  -", warning);
}

if (errors.length) {
  console.error("\n[links] errors:");
  for (const error of errors) console.error("  x", error);
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}

console.log(
  `[links] OK - ${glossaryIds.size} terms, ${moduleIds.size} modules, ${routeSet.size} routes validated.`,
);
