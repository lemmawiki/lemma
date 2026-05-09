# @lemmawiki/mcp

[Model Context Protocol](https://modelcontextprotocol.io) server for the
[Lemma](https://lemma.wiki) corpus. AI agents (Claude Desktop, Cursor, any
MCP-compatible host) can query Lemma's modules, applications, journeys, and
glossary terms as grounded ground truth — bilingual (en + ko), structured,
and derived directly from the same content that ships to lemma.wiki.

## Why

Lemma's prose is opinionated, citable, and clears a one-sentence bar: _does
this make a curious learner understand something they could not understand
before?_ When that prose is exposed to LLMs as a structured corpus, they can
answer math questions by quoting Lemma instead of hallucinating. The corpus
is small but reliable — exactly the shape modern grounding wants.

## Tools

| Tool                    | What it does                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `lemma_list`            | List items in a kind (`modules`, `applications`, `journeys`, `glossary`, `computes`). |
| `lemma_get_module`      | Fetch a module's full prose, hook, title, and which applications consume it.          |
| `lemma_get_application` | Fetch an application's full prose, hook, pillar, and the modules it relies on.        |
| `lemma_get_journey`     | Fetch a curated reading path with day-by-day notes.                                   |
| `lemma_glossary`        | Look up a term (or list all terms) with bilingual definitions.                        |
| `lemma_search`          | Full-text search across all page bodies. Returns ranked snippets.                     |
| `lemma_compute`         | Fetch the metadata of a named executable formula on Lemma.                            |

Every tool accepts `lang: "en" | "ko"` (default `"en"`).

## Install + use (Claude Desktop)

```bash
pnpm install -g @lemmawiki/mcp
```

Then add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "lemma": {
      "command": "lemma-mcp"
    }
  }
}
```

Restart Claude Desktop. Now ask Claude things like:

- "Look up Lemma's definition of entropy."
- "What journey does Lemma recommend for someone learning backprop?"
- "Search Lemma for 'log scale' and summarize the matches."

Claude will call the tools, get Lemma's structured prose back, and answer
with citations — no hallucination on the math because the answer is
provably from the Lemma corpus.

## Build from source

```bash
git clone https://github.com/lemmawiki/lemma
cd lemma
pnpm install
pnpm --filter @lemmawiki/mcp build
```

This builds the `lemma-web` site (which emits `dist/lemma-corpus.json`),
copies the corpus into `apps/mcp/corpus/`, then compiles the TypeScript
server into `apps/mcp/dist/`.

To run locally:

```bash
node apps/mcp/dist/server.js
```

The server speaks MCP over stdio, so this is mainly useful when wiring up a
host like Claude Desktop or Cursor. For development, `pnpm --filter
@lemmawiki/mcp dev` builds and runs in one step.

## Corpus schema

The corpus JSON has a stable schema_version (1.0.0). The top-level shape:

```ts
{
  schema_version: "1.0.0",
  generated_at: ISO 8601 string,
  site: "https://lemma.wiki",
  counts: { modules, applications, journeys, glossary_terms, computes, pages },
  modules:      [{ id, href, status, title:{en,ko}, hook:{en,ko} }, …],
  applications: [{ id, href, pillar, pillar_label:{en,ko}, modules, status, title, hook }, …],
  journeys:     [{ id, title, hook, tagline, duration, destination, days:[…] }, …],
  computes:     { [id]: { formula, vars, caption } },
  glossary:     [{ id, related, locales:{en,ko} }, …],
  pages:        [{ kind, slug, lang, url, title, description, body }, …]
}
```

All bilingual fields are objects keyed by `"en"` and `"ko"`. `body` is raw
MDX with the import statements stripped.

## License

MIT (code) · CC BY 4.0 (Lemma content; corpus inherits this).
