#!/usr/bin/env node

// scripts/audit.mjs — Lemma self-audit. Prints health + gap report.
//
// Counts content across all five axes, then surfaces gaps that the
// manifesto cares about: modules without proofs, modules without
// provenance, glossary terms without dialect mapping, orphan modules
// (no consumer), shapes with fewer than three instances. The report
// is observation-only — no fixes, no exits non-zero on gaps. Authors
// read the output to decide what to fill next.
//
// Run via `pnpm audit`.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

// Use a tiny TS source parser — we only need ids and a few obvious arrays.
function readSource(p) {
  return readFileSync(join(ROOT, p), "utf8");
}

function extractIds(src, propertyName = "id") {
  // Match `propertyName: "value"` inside object literals.
  const re = new RegExp(`\\b${propertyName}:\\s*"([^"]+)"`, "g");
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) out.push(m[1]);
  return out;
}

function extractStatusedIds(src) {
  // Return ids of entries whose `status` field is "available".
  const re = /\{\s*id:\s*"([^"]+)"[\s\S]*?status:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[2] === "available") out.push(m[1]);
  }
  return out;
}

function extractApplicationConsumers(src) {
  // Return a map module-id → list of application ids that include it
  // in their `modules: [...]` field.
  const blockRe = /\{\s*id:\s*"([^"]+)"[\s\S]*?modules:\s*\[([^\]]*)\][\s\S]*?\}/g;
  const map = new Map();
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const appId = m[1];
    const modulesInline = m[2];
    const modIds = [...modulesInline.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    for (const mid of modIds) {
      const list = map.get(mid) ?? [];
      list.push(appId);
      map.set(mid, list);
    }
  }
  return map;
}

function dirs(p) {
  return readdirSync(join(ROOT, p))
    .filter((n) => {
      try {
        return statSync(join(ROOT, p, n)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort();
}

// ---------------- collect ----------------

const modulesSrc = readSource("src/data/modules.ts");
const applicationsSrc = readSource("src/data/applications.ts");
const journeysSrc = readSource("src/data/journeys.ts");
const shapesSrc = readSource("src/data/shapes.ts");
const provenanceSrc = readSource("src/data/provenance.ts");
const dialectsSrc = readSource("src/data/dialects.ts");
const proofsSrc = readSource("src/data/proofs.ts");
const spikesSrc = readSource("src/data/spikes.ts");

const moduleIds = extractStatusedIds(modulesSrc);
const applicationIds = extractStatusedIds(applicationsSrc);
const journeyIds = extractIds(journeysSrc);
const shapeIds = extractIds(shapesSrc);
const provenanceConcepts = extractIds(provenanceSrc, "concept");
const dialectConcepts = extractIds(dialectsSrc, "concept");
const proofIds = extractIds(proofsSrc);
const spikeIds = extractIds(spikesSrc);

const glossaryIds = dirs("src/data/glossary");
const consumersByModule = extractApplicationConsumers(applicationsSrc);

// ---------------- analyse ----------------

const orphanModules = moduleIds.filter((id) => !consumersByModule.has(id));
const modulesWithoutProof = moduleIds.filter((id) => !proofsSrc.includes(`module: "${id}"`));
void proofIds;
const modulesWithoutProvenance = moduleIds.filter((id) => !provenanceConcepts.includes(id));
const termsWithoutDialect = glossaryIds.filter((id) => !dialectConcepts.includes(id));

// Shape instance counts. shapes.ts has `instances: [...]` arrays; count
// `page:` occurrences inside each shape block.
const shapeBlockRe = /id:\s*"([^"]+)"[\s\S]*?instances:\s*\[([\s\S]*?)\]/g;
const shapeInstanceCounts = new Map();
let sm;
while ((sm = shapeBlockRe.exec(shapesSrc)) !== null) {
  const sid = sm[1];
  const count = [...sm[2].matchAll(/page:\s*"/g)].length;
  shapeInstanceCounts.set(sid, count);
}
const shapesUnderThree = [...shapeInstanceCounts.entries()].filter(([, n]) => n < 3);

// ---------------- report ----------------

const C = {
  ok: "\x1b[32m✓\x1b[0m",
  warn: "\x1b[33m⚠\x1b[0m",
  info: "\x1b[36mℹ\x1b[0m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
};

function header(title) {
  console.log(`\n${title}`);
  console.log("─".repeat(title.length));
}

header("Lemma · self-audit");

console.log(`${C.ok}  ${moduleIds.length} modules`);
console.log(`${C.ok}  ${applicationIds.length} applications`);
console.log(`${C.ok}  ${journeyIds.length} journeys`);
console.log(`${C.ok}  ${shapeIds.length} shapes`);
console.log(`${C.ok}  ${glossaryIds.length} glossary terms`);
console.log(`${C.ok}  ${provenanceConcepts.length} provenance entries`);
console.log(`${C.ok}  ${dialectConcepts.length} dialect concepts`);
console.log(`${C.ok}  ${proofIds.length} Lean proofs`);
console.log(
  spikeIds.length === 0
    ? `${C.info}  ${spikeIds.length} spikes — registry dormant`
    : `${C.ok}  ${spikeIds.length} spikes`,
);

header("Gaps");

if (orphanModules.length === 0) {
  console.log(`${C.ok}  every module is consumed by ≥1 application`);
} else {
  console.log(
    `${C.warn}  ${orphanModules.length} module${orphanModules.length === 1 ? "" : "s"} with no consumer:`,
  );
  for (const id of orphanModules) console.log(`        · ${id}`);
}

if (modulesWithoutProof.length === 0) {
  console.log(`${C.ok}  every module has a Lean proof`);
} else {
  console.log(
    `${C.warn}  ${modulesWithoutProof.length} module${modulesWithoutProof.length === 1 ? "" : "s"} without a Lean proof:`,
  );
  for (const id of modulesWithoutProof) console.log(`        · ${id}`);
}

if (modulesWithoutProvenance.length === 0) {
  console.log(`${C.ok}  every module has a provenance entry`);
} else {
  console.log(
    `${C.warn}  ${modulesWithoutProvenance.length} module${modulesWithoutProvenance.length === 1 ? "" : "s"} without provenance:`,
  );
  for (const id of modulesWithoutProvenance) console.log(`        · ${id}`);
}

if (shapesUnderThree.length === 0) {
  console.log(`${C.ok}  every shape has ≥3 instances`);
} else {
  console.log(
    `${C.warn}  ${shapesUnderThree.length} shape${shapesUnderThree.length === 1 ? "" : "s"} under threshold:`,
  );
  for (const [id, n] of shapesUnderThree)
    console.log(`        · ${id} (${n} instance${n === 1 ? "" : "s"})`);
}

if (termsWithoutDialect.length === 0) {
  console.log(`${C.ok}  every glossary term has a dialect mapping`);
} else {
  const ratio = `${termsWithoutDialect.length}/${glossaryIds.length}`;
  console.log(
    `${C.info}  ${ratio} glossary terms without dialect mapping ${C.dim}(advisory — most terms don't need one)${C.reset}`,
  );
}

header("Suggestions");

const ideas = [];
if (modulesWithoutProvenance.length > 0) {
  ideas.push(`add provenance for one missing module: ${modulesWithoutProvenance[0]}`);
}
if (modulesWithoutProof.length > 0) {
  ideas.push(`write a Lean proof for one missing module: ${modulesWithoutProof[0]}`);
}
if (spikeIds.length === 0) {
  ideas.push("activate the spikes registry with the first experimental page");
}
if (orphanModules.length > 0) {
  ideas.push(`add an application that consumes ${orphanModules[0]}`);
}
if (ideas.length === 0) {
  console.log(`${C.ok}  nothing pressing — pick the next module to deepen.`);
} else {
  for (const idea of ideas) console.log(`     ${C.info} ${idea}`);
}
console.log();
