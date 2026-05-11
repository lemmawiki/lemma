# @lemmawiki/mcp

[Model Context Protocol](https://modelcontextprotocol.io) server for the
[Lemma](https://lemma.wiki) corpus. AI agents (Claude Desktop, Cursor, any
MCP-compatible host) can query Lemma's modules, applications, journeys, and
glossary terms as grounded ground truth — bilingual (en + ko), structured,
and **fetched live from lemma.wiki**.

## Why

Lemma's prose is opinionated, citable, and clears a one-sentence bar: _does
this make a curious learner understand something they could not understand
before?_ When that prose is exposed to LLMs as a structured corpus, they can
answer math questions by quoting Lemma instead of hallucinating. The corpus
is small but reliable — exactly the shape modern grounding wants.

Starting with v0.2, the server is a thin adapter over a canonical, web-owned
source of truth (`https://lemma.wiki/lemma-manifest.json` + per-page sidecars
at `<page-url>.json`). There is no vendored snapshot inside the package — every
fetch hits the live site. Set `LEMMA_BASE_URL` to point at a different origin
(e.g. a staging deploy or a local `http://localhost:4321`).

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

## Configuration

| Env var          | Default              | Purpose                                   |
| ---------------- | -------------------- | ----------------------------------------- |
| `LEMMA_BASE_URL` | `https://lemma.wiki` | Origin to fetch manifest + sidecars from. |

To run the server against a local dev site:

```bash
LEMMA_BASE_URL=http://localhost:4321 lemma-mcp
```

## Build from source

```bash
git clone https://github.com/lemmawiki/lemma
cd lemma
pnpm install
pnpm --filter @lemmawiki/mcp build
```

This compiles the TypeScript server into `apps/mcp/dist/`. No corpus snapshot
is generated or shipped — the server fetches everything it needs at runtime.

To run locally:

```bash
node apps/mcp/dist/server.js
```

The server speaks MCP over stdio, so this is mainly useful when wiring up a
host like Claude Desktop or Cursor. For development, `pnpm --filter
@lemmawiki/mcp dev` runs the TypeScript directly via `tsx`.

## External surface

The MCP server is just one consumer of Lemma's machine-readable web surface.
Anything that can `fetch` JSON can use the same endpoints:

| URL pattern                                    | What it carries                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| `/lemma-manifest.json`                         | Slim index — every page URL, every registry entry, no bodies. ~250 KB. |
| `/sitemap.xml` (and per-locale sub-sitemaps)   | Standard sitemap of every reachable HTML page.                         |
| `<page-url>.json`, e.g. `/en/modules/log.json` | One page's full body + frontmatter + registry overlay.                 |

Schema version `2.0`. Bilingual fields are objects keyed by `"en"` and
`"ko"`. Bodies are raw MDX. Cache-friendly (`Cache-Control: max-age=300`).

## License

MIT (code) · CC BY 4.0 (Lemma content; corpus inherits this).
