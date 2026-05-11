#!/usr/bin/env node

// Lemma MCP server.
//
// Thin adapter over lemma.wiki's machine-readable surface. No vendored
// corpus: the manifest + per-page JSON sidecars are fetched at runtime
// from the canonical site and held in an in-memory cache. Set
// `LEMMA_BASE_URL` to point at a different origin (default
// https://lemma.wiki) — useful for local development against
// http://localhost:4321.
//
// Tools (unchanged surface from v0.1):
//   lemma_list, lemma_get_module, lemma_get_application, lemma_get_journey,
//   lemma_glossary, lemma_search, lemma_compute

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

// ---- Types — only the fields tools actually read --------------------------

type Lang = "en" | "ko";
type L = Record<Lang, string>;
type Kind = "modules" | "applications" | "journeys" | "hubs";

interface Manifest {
  site: string;
  pages: Array<{ kind: Kind; id: string; lang: Lang; url: string; sidecar: string; title: string }>;
  modules: Array<{ id: string; href: string; title: L; hook: L }>;
  applications: Array<{
    id: string;
    href: string;
    pillar_label: L;
    modules: string[];
    title: L;
    hook: L;
  }>;
  journeys: Array<{
    id: string;
    title: L;
    tagline: L;
    hook: L;
    duration: number;
    destination: L;
    days: Array<{ day: number; page: string; kind: string; why: L }>;
  }>;
  computes: Record<
    string,
    {
      formula: string;
      vars: Record<string, { value: number; range: [number, number]; step?: number; label: L }>;
      caption?: L;
    }
  >;
  glossary: Array<{
    id: string;
    related: string[];
    locales: Partial<Record<Lang, { term: string; body: string; flag?: string }>>;
  }>;
}

interface Sidecar {
  kind: string;
  id: string;
  lang: Lang;
  url: string;
  title: string;
  body: string;
}

// ---- Fetch + cache --------------------------------------------------------

const BASE_URL = (process.env.LEMMA_BASE_URL ?? "https://lemma.wiki").replace(/\/$/, "");

let manifestPromise: Promise<Manifest> | null = null;
const sidecarCache = new Map<string, Promise<Sidecar | null>>();

async function loadManifest(): Promise<Manifest> {
  if (!manifestPromise) {
    manifestPromise = fetch(`${BASE_URL}/lemma-manifest.json`).then(async (r) => {
      if (!r.ok) throw new Error(`manifest fetch failed: ${r.status} ${r.statusText}`);
      return (await r.json()) as Manifest;
    });
  }
  return manifestPromise;
}

async function loadSidecar(url: string): Promise<Sidecar | null> {
  let cached = sidecarCache.get(url);
  if (!cached) {
    cached = fetch(url).then(async (r) => {
      if (!r.ok) return null;
      return (await r.json()) as Sidecar;
    });
    sidecarCache.set(url, cached);
  }
  return cached;
}

async function findSidecar(kind: Kind, id: string, lang: Lang): Promise<Sidecar | null> {
  const m = await loadManifest();
  const page = m.pages.find((p) => p.kind === kind && p.id === id && p.lang === lang);
  if (!page) return null;
  return loadSidecar(`${BASE_URL}${page.sidecar}`);
}

// ---- Body helpers ---------------------------------------------------------

function stripMdx(body: string): string {
  return body
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
  return hits / q.length / Math.log10(Math.max(b.length, 10));
}

function pickLang(arg: unknown): Lang {
  return arg === "ko" ? "ko" : "en";
}

// ---- Tools ----------------------------------------------------------------

const LANG = { type: "string", enum: ["en", "ko"], default: "en" };
const KIND_ID: Tool["inputSchema"] = {
  type: "object",
  properties: { id: { type: "string" }, lang: LANG },
  required: ["id"],
};

const TOOLS: Tool[] = [
  {
    name: "lemma_list",
    description: "List items in the Lemma corpus by kind. Call first to discover what's available.",
    inputSchema: {
      type: "object",
      properties: {
        kind: {
          type: "string",
          enum: ["modules", "applications", "journeys", "glossary", "computes"],
        },
        lang: LANG,
      },
      required: ["kind"],
    },
  },
  {
    name: "lemma_get_module",
    description:
      "Fetch a Lemma module's full prose, hook, and title. A module is a piece of math (log, entropy, derivatives) reused across applications.",
    inputSchema: KIND_ID,
  },
  {
    name: "lemma_get_application",
    description:
      "Fetch a Lemma application's full prose, hook, and the modules it consumes. An application starts from a real-world question.",
    inputSchema: KIND_ID,
  },
  {
    name: "lemma_get_journey",
    description:
      "Fetch a curated reading path through the Lemma graph, with day-by-day notes. Use when the user asks 'where do I start?'.",
    inputSchema: KIND_ID,
  },
  {
    name: "lemma_glossary",
    description:
      "Look up a Lemma glossary term by id (returns full definition and counterpart language), or omit id to list all terms.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, lang: LANG } },
  },
  {
    name: "lemma_search",
    description:
      "Full-text search across all Lemma page bodies. Returns ranked list of matching pages with snippets.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        lang: LANG,
        limit: { type: "integer", default: 5, minimum: 1, maximum: 20 },
      },
      required: ["query"],
    },
  },
  {
    name: "lemma_compute",
    description:
      "Fetch the metadata of a named executable formula on Lemma (e.g. 'bitcoin-pizza-future-value').",
    inputSchema: KIND_ID,
  },
];

// ---- Handlers -------------------------------------------------------------

async function toolList(args: { kind: string; lang?: string }): Promise<unknown> {
  const m = await loadManifest();
  const lang = pickLang(args.lang);
  switch (args.kind) {
    case "modules":
      return m.modules.map((x) => ({
        id: x.id,
        title: x.title[lang],
        hook: x.hook[lang],
        url: `${BASE_URL}/${lang}${x.href}`,
      }));
    case "applications":
      return m.applications.map((x) => ({
        id: x.id,
        pillar: x.pillar_label[lang],
        modules: x.modules,
        title: x.title[lang],
        hook: x.hook[lang],
        url: `${BASE_URL}/${lang}${x.href}`,
      }));
    case "journeys":
      return m.journeys.map((x) => ({
        id: x.id,
        title: x.title[lang],
        tagline: x.tagline[lang],
        duration_days: x.duration,
        destination: x.destination[lang],
        url: `${BASE_URL}/${lang}/journey/${x.id}`,
      }));
    case "glossary":
      return m.glossary.map((x) => ({
        id: x.id,
        term: x.locales[lang]?.term ?? x.id,
        related: x.related,
      }));
    case "computes":
      return Object.entries(m.computes).map(([id, c]) => ({
        id,
        formula: c.formula,
        vars: Object.keys(c.vars),
      }));
    default:
      return { error: `unknown kind: ${args.kind}` };
  }
}

async function toolGetModule(args: { id: string; lang?: string }): Promise<unknown> {
  const m = await loadManifest();
  const lang = pickLang(args.lang);
  const meta = m.modules.find((x) => x.id === args.id);
  if (!meta) return { error: `unknown module: ${args.id}` };
  const sidecar = await findSidecar("modules", args.id, lang);
  return {
    id: meta.id,
    url: `${BASE_URL}/${lang}${meta.href}`,
    title: meta.title[lang],
    hook: meta.hook[lang],
    body: sidecar ? stripMdx(sidecar.body) : null,
    consumed_by: m.applications
      .filter((a) => a.modules.includes(meta.id))
      .map((a) => ({ id: a.id, title: a.title[lang] })),
  };
}

async function toolGetApplication(args: { id: string; lang?: string }): Promise<unknown> {
  const m = await loadManifest();
  const lang = pickLang(args.lang);
  const meta = m.applications.find((x) => x.id === args.id);
  if (!meta) return { error: `unknown application: ${args.id}` };
  const sidecar = await findSidecar("applications", args.id, lang);
  return {
    id: meta.id,
    url: `${BASE_URL}/${lang}${meta.href}`,
    pillar: meta.pillar_label[lang],
    modules: meta.modules,
    title: meta.title[lang],
    hook: meta.hook[lang],
    body: sidecar ? stripMdx(sidecar.body) : null,
  };
}

async function toolGetJourney(args: { id: string; lang?: string }): Promise<unknown> {
  const m = await loadManifest();
  const lang = pickLang(args.lang);
  const j = m.journeys.find((x) => x.id === args.id);
  if (!j) return { error: `unknown journey: ${args.id}` };
  return {
    id: j.id,
    url: `${BASE_URL}/${lang}/journey/${j.id}`,
    title: j.title[lang],
    tagline: j.tagline[lang],
    hook: j.hook[lang],
    duration_days: j.duration,
    destination: j.destination[lang],
    days: j.days.map((d) => ({
      day: d.day,
      page: `${BASE_URL}/${lang}${d.page}`,
      kind: d.kind,
      why: d.why[lang],
    })),
  };
}

async function toolGlossary(args: { id?: string; lang?: string }): Promise<unknown> {
  const m = await loadManifest();
  const lang = pickLang(args.lang);
  if (!args.id) {
    return m.glossary.map((g) => ({ id: g.id, term: g.locales[lang]?.term ?? g.id }));
  }
  const g = m.glossary.find((x) => x.id === args.id);
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

async function toolSearch(args: {
  query: string;
  lang?: string;
  limit?: number;
}): Promise<unknown> {
  const m = await loadManifest();
  const lang = pickLang(args.lang);
  const limit = args.limit ?? 5;

  // Fetch every sidecar for the chosen language. Cache makes repeats free.
  const sidecars = await Promise.all(
    m.pages.filter((p) => p.lang === lang).map((p) => loadSidecar(`${BASE_URL}${p.sidecar}`)),
  );
  const ranked = sidecars
    .filter((s): s is Sidecar => s !== null)
    .map((s) => ({ s, score: scoreBody(args.query, s.body) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.map(({ s, score }) => {
    const body = stripMdx(s.body);
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
      kind: s.kind,
      slug: s.id,
      title: s.title,
      url: `${BASE_URL}${s.url}`,
      score: Number(score.toFixed(4)),
      snippet: snippet.trim() + (body.length > snippet.length ? "…" : ""),
    };
  });
}

async function toolCompute(args: { id: string; lang?: string }): Promise<unknown> {
  const m = await loadManifest();
  const lang = pickLang(args.lang);
  const c = m.computes[args.id];
  if (!c) return { error: `unknown compute: ${args.id}` };
  return {
    id: args.id,
    formula: c.formula,
    vars: Object.fromEntries(
      Object.entries(c.vars).map(([k, v]) => [
        k,
        { value: v.value, range: v.range, step: v.step, label: v.label[lang] },
      ]),
    ),
    caption: c.caption?.[lang],
  };
}

// ---- Server wire-up -------------------------------------------------------

const server = new Server({ name: "lemma", version: "0.2.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

type Args = Record<string, unknown>;
const HANDLERS: Record<string, (a: Args) => Promise<unknown>> = {
  lemma_list: (a) => toolList(a as Parameters<typeof toolList>[0]),
  lemma_get_module: (a) => toolGetModule(a as Parameters<typeof toolGetModule>[0]),
  lemma_get_application: (a) => toolGetApplication(a as Parameters<typeof toolGetApplication>[0]),
  lemma_get_journey: (a) => toolGetJourney(a as Parameters<typeof toolGetJourney>[0]),
  lemma_glossary: (a) => toolGlossary(a as Parameters<typeof toolGlossary>[0]),
  lemma_search: (a) => toolSearch(a as Parameters<typeof toolSearch>[0]),
  lemma_compute: (a) => toolCompute(a as Parameters<typeof toolCompute>[0]),
};

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const handler = HANDLERS[name];
  let result: unknown;
  try {
    result = handler ? await handler(args ?? {}) : { error: `unknown tool: ${name}` };
  } catch (err) {
    result = { error: err instanceof Error ? err.message : String(err) };
  }
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
