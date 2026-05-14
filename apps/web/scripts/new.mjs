#!/usr/bin/env node

// scripts/new.mjs — scaffold a new content entry.
//
// Saves the repetition of "add an entry to data/<kind>.ts + create
// {en,ko}.mdx + write Hook/Arc boilerplate" that happens on every
// new module / application / glossary term. Subcommands:
//
//   pnpm new module    <id>
//   pnpm new app       <id> --pillar=<finance|physics|graphics|ml> [--modules=log,vectors]
//   pnpm new term      <id>
//
// The tool is conservative: it never overwrites an existing file
// (so it's safe to re-run), and it appends entries to the .ts
// registries by inserting before the closing `];`. After scaffold
// the registry still typechecks because the entry uses the same
// shape as existing ones.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, ".."); // apps/web

const PILLARS = ["finance", "physics", "graphics", "ml"];

const COLOURS = [
  "#1e6da6",
  "#9a3a1e",
  "#3a8c4a",
  "#7a4e9a",
  "#c97a1e",
  "#1e9a8c",
  "#8a2c2c",
  "#5a6a8a",
  "#a83b80",
];

function bail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      const [k, v] = arg.slice(2).split("=");
      flags[k] = v ?? true;
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function readFile(p) {
  return readFileSync(p, "utf8");
}

function writeIfMissing(p, content, label) {
  if (existsSync(p)) {
    console.log(`  skip  ${label}: already exists`);
    return false;
  }
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log(`  ✓     ${label}`);
  return true;
}

function pickColour(id) {
  // Deterministic: stable colour per id. Authors edit later if they want.
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return COLOURS[Math.abs(h) % COLOURS.length];
}

// ---------------- new module ----------------

function newModule(id) {
  if (!/^[a-z][a-z0-9-]*$/.test(id)) bail(`bad module id "${id}" — use kebab-case`);

  const modulesPath = join(ROOT, "src/data/modules.ts");
  const src = readFile(modulesPath);
  if (src.includes(`id: "${id}"`)) bail(`module "${id}" already in modules.ts`);

  const color = pickColour(id);
  const entry = `  {
    id: "${id}",
    href: "/modules/${id}",
    status: "available",
    color: "${color}",
    title: { en: "TODO ${id}", ko: "TODO ${id}" },
    hook: {
      en: "TODO — one sentence that earns the module: a real question this tool answers, not its definition.",
      ko: "TODO — 한 문장으로 이 모듈을 *번다*: 정의가 아니라 *이 도구가 답하는 질문*.",
    },
  },
`;

  // Insert before the final "];" of the array literal.
  const closing = src.lastIndexOf("];");
  if (closing < 0) bail("modules.ts: cannot find array closing");
  const updated = src.slice(0, closing) + entry + src.slice(closing);
  writeFileSync(modulesPath, updated);
  console.log(`  ✓     data/modules.ts (entry inserted)`);

  // Content files.
  const dir = join(ROOT, "src/content/pages/modules", id);
  writeIfMissing(join(dir, "en.mdx"), moduleMdx(id, "en"), `content/modules/${id}/en.mdx`);
  writeIfMissing(join(dir, "ko.mdx"), moduleMdx(id, "ko"), `content/modules/${id}/ko.mdx`);

  console.log("\nnext steps:");
  console.log(`  1. fill in title + hook in data/modules.ts`);
  console.log(`  2. write the Hook + first Arc in content/pages/modules/${id}/{en,ko}.mdx`);
  console.log(`  3. (optional) add provenance to data/provenance.ts`);
  console.log(`  4. (optional) add Lean proof of the central identity to data/proofs.ts`);
  console.log(`  5. preview: http://localhost:4321/en/modules/${id}`);
}

function moduleMdx(id, lang) {
  const ko = lang === "ko";
  return `---
title: ${ko ? "TODO " + id + " · Lemma" : "TODO " + id + " · Lemma"}
description: ${ko ? "TODO — 한 줄 정의" : "TODO — one-line definition"}
breadcrumb:
  parent: ${ko ? "그래프" : "graph"}
  parent_path: /graph
  current: ${ko ? "모듈 · " + id : "module · " + id}
---

import {
  CodeBlock, Term, Exercise, Solution, ToolSpec, Proof, CrossPillarReuse } from "@/components/mdx";
import Hook from "@/components/page/hook.astro";
import Lede from "@/components/page/lede.astro";
import Arc from "@/components/page/arc.astro";
import ArcRow from "@/components/page/arc-row.astro";
import Pin from "@/components/page/pin.astro";
import Exercises from "@/components/page/exercises.astro";
import PageFooter from "@/components/page/page-footer.astro";

<Hook kicker="${ko ? "도입 · TODO 후크" : "the hook · TODO kicker"}">

# ${ko ? "TODO — 이 모듈이 답하는 질문 한 줄" : "TODO — the question this module answers, in one line"}

${
  ko
    ? "TODO — 그 질문을 *읽는 사람이 진짜로 묻고 있는* 모양으로 풀어쓴 한 단락. 정의 *아님*. 실세계 어디서 이게 나타나는지 1-2개 예. 마지막 줄에 *이 모듈이 줄 답의 모양*을 한 줄로."
    : "TODO — unpack the question into a paragraph that **the reader is actually asking**. Not a definition. Cite 1–2 places this shape appears in the world. End with one line of the form *the answer this module gives*."
}

<Lede>
  ${ko ? "TODO — 위 한 단락을 두 줄로 압축. 페이지 절반 읽고 친구한테 한 줄로 설명할 때 쓸 문장." : "TODO — compress the above into one sentence. The line a reader will use to explain the page to a friend halfway through."}
</Lede>

</Hook>

<ToolSpec>
  <Fragment slot="definition">
    ${ko ? "TODO — 정의." : "TODO — definition."}
  </Fragment>
  <Fragment slot="applies">
    ${ko ? "TODO — 어디서 적용되는가." : "TODO — when it applies."}
  </Fragment>
  <Fragment slot="breaks">
    ${ko ? "TODO — 어디서 깨지는가." : "TODO — when it breaks."}
  </Fragment>
</ToolSpec>

<Arc kicker="${ko ? "흐름" : "the arc"}">

<ArcRow n={1} title="${ko ? "TODO — 첫 단계 제목" : "TODO — first arc title"}">

${ko ? "TODO — 첫 arc 본문." : "TODO — first arc body."}

</ArcRow>

</Arc>

<Pin>
  ${ko ? "TODO — 한 문장 요약 (이 페이지 *전체* 의 압축)." : "TODO — one-sentence pin (the entire page, compressed)."}
</Pin>

<CrossPillarReuse module="${id}" />

<PageFooter>
  ${ko ? "TODO — footer prose." : "TODO — footer prose."}
</PageFooter>
`;
}

// ---------------- new application ----------------

function newApplication(id, flags) {
  if (!/^[a-z][a-z0-9-]*$/.test(id)) bail(`bad application id "${id}"`);
  const pillar = flags.pillar;
  if (!pillar || !PILLARS.includes(pillar)) {
    bail(`--pillar=<${PILLARS.join("|")}> required`);
  }
  const modulesList = (flags.modules ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (modulesList.length === 0) {
    console.log("note: no --modules=a,b given; entry inserted with empty modules list");
  }

  const appsPath = join(ROOT, "src/data/applications.ts");
  const src = readFile(appsPath);
  if (src.includes(`id: "${id}"`)) bail(`application "${id}" already in applications.ts`);

  const modulesStr =
    modulesList.length === 0 ? "[]" : `[${modulesList.map((m) => `"${m}"`).join(", ")}]`;
  const entry = `  {
    id: "${id}",
    href: "/${pillar}/${id}",
    pillar: "${pillar}",
    modules: ${modulesStr},
    status: "available",
    title: { en: "TODO ${id}", ko: "TODO ${id}" },
    hook: {
      en: "TODO — the real-world question. One paragraph. Specific. Datable to a real event when possible.",
      ko: "TODO — 실세계 질문. 한 단락. 구체적으로. 가능하면 실제 사건의 날짜와 함께.",
    },
  },
`;

  const closing = src.lastIndexOf("];");
  if (closing < 0) bail("applications.ts: cannot find array closing");
  const updated = src.slice(0, closing) + entry + src.slice(closing);
  writeFileSync(appsPath, updated);
  console.log(
    `  ✓     data/applications.ts (entry inserted, pillar=${pillar}, modules=${modulesStr})`,
  );

  const dir = join(ROOT, "src/content/pages/applications", id);
  writeIfMissing(
    join(dir, "en.mdx"),
    applicationMdx(id, pillar, "en"),
    `content/applications/${id}/en.mdx`,
  );
  writeIfMissing(
    join(dir, "ko.mdx"),
    applicationMdx(id, pillar, "ko"),
    `content/applications/${id}/ko.mdx`,
  );

  console.log("\nnext steps:");
  console.log(`  1. fill in title + hook in data/applications.ts`);
  console.log(`  2. write the Hook + first Arc in content/pages/applications/${id}/{en,ko}.mdx`);
  console.log(`  3. preview: http://localhost:4321/en/${pillar}/${id}`);
}

function applicationMdx(id, pillar, lang) {
  const ko = lang === "ko";
  return `---
title: TODO ${id} · Lemma
description: ${ko ? "TODO — 한 줄 후크" : "TODO — one-line hook"}
breadcrumb:
  parent: ${ko ? "그래프" : "graph"}
  parent_path: /graph
  current: ${pillar} · ${id}
---

import {
  CodeBlock, Term, Exercise, Solution, Counterexample, WhyNotTaught } from "@/components/mdx";
import Hook from "@/components/page/hook.astro";
import Lede from "@/components/page/lede.astro";
import Arc from "@/components/page/arc.astro";
import ArcRow from "@/components/page/arc-row.astro";
import Pin from "@/components/page/pin.astro";
import Exercises from "@/components/page/exercises.astro";
import PageFooter from "@/components/page/page-footer.astro";

<Hook kicker="${ko ? "도입 · TODO" : "the hook · TODO"}">

# ${ko ? "TODO — 이 페이지가 답하는 *진짜 세상의* 질문" : "TODO — the real-world question this page answers"}

${
  ko
    ? "TODO — 그 질문이 *언제, 어디서, 왜* 떠올랐는지 한 단락. 구체적으로. 누가 이 질문을 처음 던졌는지 — 그게 본문의 frame."
    : "TODO — when, where, why this question arose. One paragraph. Specific. Who first asked it — that's the frame for the page."
}

<Lede>
  ${ko ? "TODO — 한두 줄. 이 페이지의 *약속*. 다 읽고 나면 뭘 알게 되는지." : "TODO — one or two lines. The promise. What the reader will know after reading."}
</Lede>

</Hook>

<Arc kicker="${ko ? "흐름" : "the arc"}">

<ArcRow n={1} title="${ko ? "TODO — 첫 단계 제목" : "TODO — first arc title"}">

${ko ? "TODO — 첫 arc 본문." : "TODO — first arc body."}

</ArcRow>

</Arc>

<Pin>
  ${ko ? "TODO — 한 문장 요약." : "TODO — one-sentence pin."}
</Pin>

<WhyNotTaught>
  ${ko ? "TODO — 왜 학교는 이걸 이런 식으로 안 가르치는가." : "TODO — why most textbooks don't teach this this way."}
</WhyNotTaught>

<PageFooter>
  ${ko ? "TODO — footer prose." : "TODO — footer prose."}
</PageFooter>
`;
}

// ---------------- new glossary term ----------------

function newTerm(id) {
  if (!/^[a-z][a-z0-9-]*$/.test(id)) bail(`bad term id "${id}"`);
  const dir = join(ROOT, "src/data/glossary", id);
  if (existsSync(dir)) bail(`term "${id}" already exists`);

  const orderPath = join(ROOT, "src/data/glossary/_order.json");
  const order = JSON.parse(readFile(orderPath));
  if (order.includes(id)) bail(`term "${id}" already in _order.json`);

  writeIfMissing(
    join(dir, "en.md"),
    `---
term: ${id}
related: []
---

TODO — one-sentence definition for ${id}. Lemma's house style: the *load-bearing* meaning, not the textbook one. Short.
`,
    `data/glossary/${id}/en.md`,
  );
  writeIfMissing(
    join(dir, "ko.md"),
    `---
term: TODO-${id}
related: []
---

TODO — ${id} 의 한 문장 정의. Lemma 스타일: *떠받침이 되는* 의미만, 교과서 정의 아님. 짧게.
`,
    `data/glossary/${id}/ko.md`,
  );

  // Append to _order.json so the index picks it up in pedagogical order.
  order.push(id);
  writeFileSync(orderPath, JSON.stringify(order, null, 2) + "\n");
  console.log(`  ✓     data/glossary/_order.json (id appended)`);

  console.log("\nnext steps:");
  console.log(`  1. fill in term + body in glossary/${id}/{en,ko}.md`);
  console.log(`  2. set related: [...] for cross-links`);
  console.log(`  3. (optional) reorder in _order.json for pedagogical placement`);
  console.log(`  4. preview: http://localhost:4321/en/glossary/${id}`);
}

// ---------------- dispatch ----------------

const argv = process.argv.slice(2);
const sub = argv.shift();
const { positional, flags } = parseArgs(argv);
const id = positional[0];

switch (sub) {
  case "module":
    if (!id) bail("usage: pnpm new module <id>");
    newModule(id);
    break;
  case "app":
  case "application":
    if (!id)
      bail("usage: pnpm new app <id> --pillar=<finance|physics|graphics|ml> [--modules=a,b]");
    newApplication(id, flags);
    break;
  case "term":
  case "glossary":
    if (!id) bail("usage: pnpm new term <id>");
    newTerm(id);
    break;
  default:
    console.error("usage: pnpm new <module|app|term> <id> [flags]");
    console.error("");
    console.error("examples:");
    console.error("  pnpm new module convex-optimization");
    console.error("  pnpm new app option-pricing --pillar=finance --modules=log,distributions");
    console.error("  pnpm new term convex-set");
    process.exit(1);
}
