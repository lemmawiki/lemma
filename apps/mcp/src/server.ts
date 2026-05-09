#!/usr/bin/env node

// Lemma MCP server.
//
// Exposes the Lemma corpus to AI agents via the Model Context Protocol. The
// corpus JSON is built by `apps/web` at build time (the /lemma-corpus.json
// endpoint) and copied into ./corpus/ during this package's build.
//
// Tools exposed:
//   lemma_list           — list everything in a kind (modules/applications/...)
//   lemma_get_module     — fetch one module's full content (en + ko)
//   lemma_get_application— fetch one application
//   lemma_get_journey    — fetch one journey + its days
//   lemma_glossary       — fetch one glossary term, or search terms
//   lemma_search         — full-text search across all page bodies
//   lemma_compute        — fetch the metadata of a named executable formula

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// ---- Corpus types (mirror of the build-time schema) -----------------------

interface Locales {
  en: string;
  ko: string;
}

interface CorpusModule {
  id: string;
  href: string;
  status: string;
  title: Locales;
  hook: Locales;
}

interface CorpusApplication {
  id: string;
  href: string;
  pillar: string;
  pillar_label: Locales;
  modules: string[];
  status: string;
  title: Locales;
  hook: Locales;
}

interface CorpusJourneyDay {
  day: number;
  page: string;
  kind: string;
  why: Locales;
}

interface CorpusJourney {
  id: string;
  title: Locales;
  hook: Locales;
  tagline: Locales;
  duration: number;
  destination: Locales;
  days: CorpusJourneyDay[];
}

interface CorpusGlossaryEntry {
  id: string;
  related: string[];
  locales: Partial<Record<"en" | "ko", { term: string; body: string; flag?: string }>>;
}

interface CorpusComputeVar {
  value: number;
  range: [number, number];
  step?: number;
  label: Locales;
}

interface CorpusCompute {
  formula: string;
  vars: Record<string, CorpusComputeVar>;
  caption?: Locales;
}

interface CorpusPage {
  kind: "modules" | "applications" | "journeys" | "hubs";
  slug: string;
  lang: "en" | "ko";
  url: string;
  title: string;
  description?: string;
  body: string;
}

interface Corpus {
  schema_version: string;
  generated_at: string;
  site: string;
  counts: Record<string, number>;
  modules: CorpusModule[];
  applications: CorpusApplication[];
  journeys: CorpusJourney[];
  computes: Record<string, CorpusCompute>;
  glossary: CorpusGlossaryEntry[];
  pages: CorpusPage[];
}

// ---- Load corpus ----------------------------------------------------------

function loadCorpus(): Corpus {
  const here = dirname(fileURLToPath(import.meta.url));
  // Try the published location first (./corpus/ next to dist/), then the dev
  // location (../corpus/) for local `pnpm dev` flows.
  const candidates = [
    resolve(here, "..", "corpus", "lemma-corpus.json"),
    resolve(here, "..", "..", "corpus", "lemma-corpus.json"),
  ];
  for (const path of candidates) {
    try {
      const raw = readFileSync(path, "utf8");
      return JSON.parse(raw) as Corpus;
    } catch {
      // try next
    }
  }
  throw new Error(
    `Could not find lemma-corpus.json. Run \`pnpm --filter @lemmawiki/mcp build\` first. Searched: ${candidates.join(", ")}`,
  );
}

const corpus = loadCorpus();

// ---- Helpers --------------------------------------------------------------

function pickLang(arg: unknown): "en" | "ko" {
  return arg === "ko" ? "ko" : "en";
}

function localizeBody(page: CorpusPage): string {
  // Strip MDX import statements + JSX comments to keep the prose clean for LLMs.
  return page.body
    .replace(/^import\s[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreBody(query: string, body: string): number {
  const q = tokenize(query);
  if (q.length === 0) return 0;
  const b = tokenize(body);
  if (b.length === 0) return 0;
  const bSet = new Set(b);
  let hits = 0;
  for (const t of q) if (bSet.has(t)) hits++;
  // Crude but good enough — rank by fraction of query terms hit, divided by
  // log(body length) to keep short pages from ranking too high.
  return hits / q.length / Math.log10(Math.max(b.length, 10));
}

// ---- Tools ----------------------------------------------------------------

const TOOLS: Tool[] = [
  {
    name: "lemma_list",
    description:
      "List items in the Lemma corpus by kind. Use this first to discover what's available.",
    inputSchema: {
      type: "object",
      properties: {
        kind: {
          type: "string",
          enum: ["modules", "applications", "journeys", "glossary", "computes"],
          description: "Which kind of item to list.",
        },
        lang: {
          type: "string",
          enum: ["en", "ko"],
          default: "en",
        },
      },
      required: ["kind"],
    },
  },
  {
    name: "lemma_get_module",
    description:
      "Fetch a single Lemma module's full prose, hook, and title. A module is a piece of math (e.g. 'log', 'entropy', 'derivatives') that's reused across applications.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Module id, e.g. 'log' or 'entropy'." },
        lang: { type: "string", enum: ["en", "ko"], default: "en" },
      },
      required: ["id"],
    },
  },
  {
    name: "lemma_get_application",
    description:
      "Fetch a single Lemma application's full prose, hook, and the modules it consumes. An application starts from a real-world question (e.g. 'bitcoin-pizza', 'projectile-motion').",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Application id, e.g. 'bitcoin-pizza'." },
        lang: { type: "string", enum: ["en", "ko"], default: "en" },
      },
      required: ["id"],
    },
  },
  {
    name: "lemma_get_journey",
    description:
      "Fetch a curated reading path through the graph, with day-by-day notes. Use when the user asks 'where do I start?' or 'how do I learn X?'.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Journey id, e.g. 'to-bitcoin' or 'to-backprop'.",
        },
        lang: { type: "string", enum: ["en", "ko"], default: "en" },
      },
      required: ["id"],
    },
  },
  {
    name: "lemma_glossary",
    description:
      "Look up a Lemma glossary term by id (returns full definition and counterpart language), or omit id to list all terms.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Term id, e.g. 'entropy', 'logarithm'. Omit to list all.",
        },
        lang: { type: "string", enum: ["en", "ko"], default: "en" },
      },
    },
  },
  {
    name: "lemma_search",
    description:
      "Full-text search across all Lemma page bodies. Returns ranked list of matching pages with snippets. Use when the user's question doesn't match a known module/application id.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search query." },
        lang: { type: "string", enum: ["en", "ko"], default: "en" },
        limit: { type: "integer", default: 5, minimum: 1, maximum: 20 },
      },
      required: ["query"],
    },
  },
  {
    name: "lemma_compute",
    description:
      "Fetch the metadata of a named executable formula on Lemma (e.g. 'bitcoin-pizza-future-value', 'entropy-four-outcomes'). Useful for understanding what variables a formula takes and what it computes.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Compute id." },
        lang: { type: "string", enum: ["en", "ko"], default: "en" },
      },
      required: ["id"],
    },
  },
];

// ---- Tool handlers --------------------------------------------------------

function toolList(args: { kind: string; lang?: string }): unknown {
  const lang = pickLang(args.lang);
  switch (args.kind) {
    case "modules":
      return corpus.modules.map((m) => ({
        id: m.id,
        title: m.title[lang],
        hook: m.hook[lang],
        url: `${corpus.site}/${lang}${m.href}/`,
      }));
    case "applications":
      return corpus.applications.map((a) => ({
        id: a.id,
        pillar: a.pillar_label[lang],
        modules: a.modules,
        title: a.title[lang],
        hook: a.hook[lang],
        url: `${corpus.site}/${lang}${a.href}/`,
      }));
    case "journeys":
      return corpus.journeys.map((j) => ({
        id: j.id,
        title: j.title[lang],
        tagline: j.tagline[lang],
        duration_days: j.duration,
        destination: j.destination[lang],
        url: `${corpus.site}/${lang}/journey/${j.id}/`,
      }));
    case "glossary":
      return corpus.glossary.map((g) => ({
        id: g.id,
        term: g.locales[lang]?.term ?? g.id,
        related: g.related,
      }));
    case "computes":
      return Object.entries(corpus.computes).map(([id, c]) => ({
        id,
        formula: c.formula,
        vars: Object.keys(c.vars),
      }));
    default:
      return { error: `unknown kind: ${args.kind}` };
  }
}

function findPage(kind: CorpusPage["kind"], slug: string, lang: "en" | "ko"): CorpusPage | null {
  return corpus.pages.find((p) => p.kind === kind && p.slug === slug && p.lang === lang) ?? null;
}

function toolGetModule(args: { id: string; lang?: string }): unknown {
  const lang = pickLang(args.lang);
  const meta = corpus.modules.find((m) => m.id === args.id);
  if (!meta) return { error: `unknown module: ${args.id}` };
  const page = findPage("modules", args.id, lang);
  return {
    id: meta.id,
    url: `${corpus.site}/${lang}${meta.href}/`,
    title: meta.title[lang],
    hook: meta.hook[lang],
    body: page ? localizeBody(page) : null,
    consumed_by: corpus.applications
      .filter((a) => a.modules.includes(meta.id))
      .map((a) => ({ id: a.id, title: a.title[lang] })),
  };
}

function toolGetApplication(args: { id: string; lang?: string }): unknown {
  const lang = pickLang(args.lang);
  const meta = corpus.applications.find((a) => a.id === args.id);
  if (!meta) return { error: `unknown application: ${args.id}` };
  const page = findPage("applications", args.id, lang);
  return {
    id: meta.id,
    url: `${corpus.site}/${lang}${meta.href}/`,
    pillar: meta.pillar_label[lang],
    modules: meta.modules,
    title: meta.title[lang],
    hook: meta.hook[lang],
    body: page ? localizeBody(page) : null,
  };
}

function toolGetJourney(args: { id: string; lang?: string }): unknown {
  const lang = pickLang(args.lang);
  const j = corpus.journeys.find((x) => x.id === args.id);
  if (!j) return { error: `unknown journey: ${args.id}` };
  return {
    id: j.id,
    url: `${corpus.site}/${lang}/journey/${j.id}/`,
    title: j.title[lang],
    tagline: j.tagline[lang],
    hook: j.hook[lang],
    duration_days: j.duration,
    destination: j.destination[lang],
    days: j.days.map((d) => ({
      day: d.day,
      page: `${corpus.site}/${lang}${d.page}/`,
      kind: d.kind,
      why: d.why[lang],
    })),
  };
}

function toolGlossary(args: { id?: string; lang?: string }): unknown {
  const lang = pickLang(args.lang);
  if (!args.id) {
    return corpus.glossary.map((g) => ({
      id: g.id,
      term: g.locales[lang]?.term ?? g.id,
    }));
  }
  const g = corpus.glossary.find((x) => x.id === args.id);
  if (!g) return { error: `unknown term: ${args.id}` };
  const view = g.locales[lang] ?? g.locales.en ?? null;
  const counter = lang === "en" ? g.locales.ko : g.locales.en;
  return {
    id: g.id,
    term: view?.term ?? g.id,
    body: view?.body ?? "",
    flag: view?.flag,
    counterpart_lang: lang === "en" ? "ko" : "en",
    counterpart_term: counter?.term,
    related: g.related,
  };
}

function toolSearch(args: { query: string; lang?: string; limit?: number }): unknown {
  const lang = pickLang(args.lang);
  const limit = args.limit ?? 5;
  const candidates = corpus.pages.filter((p) => p.lang === lang);
  const ranked = candidates
    .map((p) => ({ page: p, score: scoreBody(args.query, p.body) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return ranked.map(({ page, score }) => {
    const body = localizeBody(page);
    // Snippet: first 320 chars containing any query term, or just first 320.
    const q = tokenize(args.query);
    let snippet = body.slice(0, 320);
    for (const term of q) {
      const i = body.toLowerCase().indexOf(term);
      if (i >= 0) {
        const start = Math.max(0, i - 80);
        snippet = body.slice(start, start + 320);
        break;
      }
    }
    return {
      kind: page.kind,
      slug: page.slug,
      title: page.title,
      url: `${corpus.site}${page.url}/`,
      score: Number(score.toFixed(4)),
      snippet: snippet.trim() + (body.length > snippet.length ? "…" : ""),
    };
  });
}

function toolCompute(args: { id: string; lang?: string }): unknown {
  const lang = pickLang(args.lang);
  const c = corpus.computes[args.id];
  if (!c) return { error: `unknown compute: ${args.id}` };
  return {
    id: args.id,
    formula: c.formula,
    vars: Object.fromEntries(
      Object.entries(c.vars).map(([k, v]) => [
        k,
        {
          value: v.value,
          range: v.range,
          step: v.step,
          label: v.label[lang],
        },
      ]),
    ),
    caption: c.caption?.[lang],
  };
}

// ---- Server wire-up -------------------------------------------------------

const server = new Server({ name: "lemma", version: "0.1.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result: unknown;
  try {
    switch (name) {
      case "lemma_list":
        result = toolList(args as { kind: string; lang?: string });
        break;
      case "lemma_get_module":
        result = toolGetModule(args as { id: string; lang?: string });
        break;
      case "lemma_get_application":
        result = toolGetApplication(args as { id: string; lang?: string });
        break;
      case "lemma_get_journey":
        result = toolGetJourney(args as { id: string; lang?: string });
        break;
      case "lemma_glossary":
        result = toolGlossary(args as { id?: string; lang?: string });
        break;
      case "lemma_search":
        result = toolSearch(args as { query: string; lang?: string; limit?: number });
        break;
      case "lemma_compute":
        result = toolCompute(args as { id: string; lang?: string });
        break;
      default:
        result = { error: `unknown tool: ${name}` };
    }
  } catch (err) {
    result = { error: err instanceof Error ? err.message : String(err) };
  }
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
