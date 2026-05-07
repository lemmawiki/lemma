# AGENTS.md

First stop for any AI agent working on Lemma. The user-facing manifesto lives
in [README.md](README.md) (and [README.ko.md](README.ko.md)); contributor
patterns live in [CONTRIBUTING.md](CONTRIBUTING.md). This file is the index.

## What Lemma is

An interactive, bilingual (en/ko) math textbook built backwards:
**application before abstraction**. Every page starts with a real-world
question and only introduces math because the question demands it.

The bar is one sentence:

> Does this make a curious learner understand something they could not
> understand before?

Yes → it ships. No → it doesn't, however polished.

## What to read first

- [README.md](README.md) — manifesto, principles, the bar
- [CONTRIBUTING.md](CONTRIBUTING.md) — content + code patterns, no-gaps rule
- [apps/web/](apps/web/) — Astro 5 app, React islands, all current content

## Project conventions

- **Bilingual at term level.** Every prose page has en + ko surfaces; every
  glossary entry has `en.md` and `ko.md`.
- **No knowledge gaps.** Audience baseline: post-secondary, 18+. Backlink
  anything beyond that with `<Term id="…">…</Term>`.
- **Two doors.** Application pages have a general/code mode toggle. Code
  mode adds Python snippets that complete the prose, not duplicate it.
- **Modular graph, not a sequence.** Modules (e.g. `the logarithm`) are
  reused across applications (e.g. `bitcoin pizza`); they are tools, not
  curriculum stages.
- **Astro + React islands.** `.astro` files are routes; React only mounts
  where interactivity exists. See [apps/web/src/layouts/Base.astro](apps/web/src/layouts/Base.astro).

## Toolchain

- **pnpm** workspace (`pnpm-workspace.yaml` lists `apps/*`). Pinned via
  `packageManager` in [package.json](package.json).
- **oxlint** (linter) + **oxfmt** (formatter) — both at the repo root,
  config in [.oxlintrc.json](.oxlintrc.json). Run on the whole repo.
- **lefthook** — git hooks pinned in [lefthook.yml](lefthook.yml).
  Pre-commit runs oxfmt + oxlint on staged files (auto-fix and re-stage);
  pre-push runs `astro check`.
- **Astro 6**, **TypeScript 6**, **React 19** — all on latest.

## Build & verify

All commands run from the repo root.

```sh
pnpm install                # installs both workspaces, runs lefthook install
pnpm run dev                # http://localhost:4321
pnpm run build              # validate glossary + astro check + astro build
pnpm run lint               # oxlint
pnpm run lint:fix           # oxlint --fix
pnpm run fmt                # oxfmt
pnpm run fmt:check          # oxfmt --check
pnpm run validate:glossary  # glossary structure + cross-refs
```

## Skills

Project skills live in [.agents/skills/](.agents/skills/) (canonical).
For Claude Code, [.claude/skills/](.claude/skills/) symlinks to the same path.

- **content** — committee for content design, manifesto bar, arc structure,
  exercise rubric. Use when planning, drafting, or reviewing a page.
- **translate** — Korean ↔ English translation, QA, triage. Use when adding
  the counterpart locale, or when prose feels like calque.

To use Claude Code skills locally without committing local-only state, the
`.claude/skills` entry is the only thing under `.claude/` we track — the rest
of `.claude/` (launch.json, settings.local.json, etc.) is gitignored.
