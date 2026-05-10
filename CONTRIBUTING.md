# Contributing to Lemma

This document covers patterns we want to keep. Read [`README.md`](./README.md) first for the _why_; this is the _how_.

---

## Project layout

```
math/
├── README.md, README.ko.md       Manifesto. Bilingual — keep both in sync.
├── CONTRIBUTING.md               This file.
├── apps/
│   └── web/                      The interactive textbook (Vite + React + TS).
│       ├── src/
│       │   ├── App.tsx           Page composition.
│       │   ├── components/       Term, Exercise, widgets.
│       │   ├── context/          App-level state (language, mode).
│       │   ├── data/glossary/    Bilingual term dictionary — see below.
│       │   └── lib/              Pure functions (finance.ts, etc.).
│       ├── scripts/              Validation, codegen.
│       └── …
└── .claude/launch.json           Dev server config.
```

## Running locally

```sh
cd apps/web
npm install
npm run dev               # Vite at http://localhost:5173
npm run validate:glossary # Validate the term dictionary
npm run build             # Production build (runs validator first)
```

---

## The "no gaps" principle

Lemma's audience is **post-secondary, 18+**. We assume:

- High-school algebra, basic geometry, light statistics.
- General computer literacy (a programmer who has touched a terminal).
- **Not**: any specific math, ML, or finance coursework.

Anything beyond that line must be either:

1. **Backlinked via `<Term id="...">`** — preferred for concepts that recur or stand alone (e.g. `float32`, `log_softmax`, `gradient`, `Stirling's approximation`).
2. **Inline-glossed** — a brief parenthetical for one-off mentions where a glossary card would be overkill (e.g. _"Buffett's Berkshire (his investment company): ~20%"_).

The decision rule:

> _Would a smart 18-year-old who finished high school but never studied this domain need help here?_

If yes → link or gloss. **If you cannot give a one-line gloss, you don't understand the concept well enough yet — go learn it before shipping.**

A reader should never have to leave the page to look something up. The page is the room (per the manifesto). The glossary entry is the doorway in the wall.

### What to backlink

- All technical terms (e.g. `float32`, `log_softmax`, `gradient`, `slide rule`, `logsumexp`).
- Named tools, frameworks, vehicles (`PyTorch`, `SPY`, `numpy`).
- Math operations beyond high-school (`Stirling's approximation`, `n-th root`, `CAGR`).
- Cross-language mappings where the words look unrelated (`반감기` ↔ `halving`).
- UI specifics that have a particular meaning in your prose. If you say "drag the **terracotta** handle," either give it a swatch in the UI or just say "drag handle **a**." Color names are _not_ universal; a reader who can't see color, or sees it differently, must still be able to follow.

### What NOT to backlink

- Pop-culture references (Apollo, Manhattan, Papa John's, Bitcoin Pizza Day).
- Common-knowledge math (×, +, fractions, percentages).
- Words used in their everyday English/Korean meaning.
- Brand names whose meaning doesn't matter beyond "a company / a thing" (NVIDIA, Tesla — unless their _behavior_ is the lesson).

### Code in prose is encouraged

Code names like `float32`, `log_softmax`, `np.log` are concrete and raise good questions. Use them — but link them. A `<Term id="float32"><span className="mono">float32</span></Term> ` keeps the monospace styling and adds a hover that explains what it actually is. The pattern: wrap the styled span with `<Term>`, not the other way around.

---

## The glossary system

Every technical term in Lemma lives in **one place**: `apps/web/src/data/glossary/`. The Term component (used inline in prose like `<Term id="logarithm">log</Term>`) and the page-level glossary panel both read from this single source.

This is load-bearing for the manifesto's bilingual thesis. The "term gap" between Korean and English is the central feature, not a translation chore. It is also the load-bearing primitive of the no-gaps principle above.

### File layout

**One folder per term. One Markdown file per locale, inside.**

```
src/data/glossary/
├── _order.json              # display order for the glossary panel
├── index.ts                 # loader (do not edit unless reworking the system)
├── exponent/
│   ├── en.md
│   └── ko.md
├── halving/
│   ├── en.md
│   └── ko.md
└── …
```

**Why this layout, not one big JSON file?**

- A _concept_ is the unit. Editing one term touches one folder.
- Translators open `halving/ko.md` and see only Korean — no JSON escaping, no parallel sections.
- Adding a new locale (`ja`, `zh`) is a file drop, not a schema migration.
- Markdown bodies grow gracefully (KaTeX, code, links) without changing the file format.

### File format

Each `*.md` file is YAML frontmatter + Markdown body.

```markdown
---
term: halving
flag: |
  Korean '반감기' is overloaded — also means radioactive half-life.
  Bitcoin sense: discrete event. Physics sense: continuous decay constant.
related: [bitcoin]
---

In Bitcoin: every ~4 years (every 210,000 blocks), the reward for
mining a block halves. Built-in disinflation.
```

**Frontmatter fields**
| field | required | purpose |
|---|---|---|
| `term` | **yes** | The word as displayed in this locale (e.g. `반감기`, `halving`). |
| `flag` | optional | Cross-locale gotcha as it appears to _this locale's reader_. Use `\|` for multi-line. |
| `related` | optional | List of other term ids. Validator checks they resolve. |

**Body** is plain Markdown. For Phase 1 it renders as plain text. KaTeX, wikilinks, and rich rendering arrive in Phase 2 (see § "Future").

### Adding a new term

1. Create `src/data/glossary/<my-term-id>/`.
2. Add `en.md` and `ko.md` with frontmatter + body.
3. Add `"my-term-id"` to `_order.json` at the position you want it shown in the glossary panel.
4. `npm run validate:glossary` — must pass.
5. Reference it inline: `<Term id="my-term-id">my term</Term>` (children are optional; if omitted, the locale's `term` field is used).

### Editing an existing term

Open the locale you want to change. Don't worry about the other locale unless the meaning has shifted — when it has, update both. The validator does **not** check semantic parity (impossible), only structural completeness.

### Adding a new locale (e.g. `ja`)

1. Add `ja` to `LOCALES` in `src/data/glossary/index.ts`.
2. Add `ja` to `REQUIRED_LOCALES` in `scripts/validate-glossary.mjs`.
3. Add a `ja` literal to the `Language` type in `src/context/AppContext.tsx`.
4. Drop `ja.md` files into every term folder.
5. Add a JA toggle button in `App.tsx`'s `Header`.
6. `npm run validate:glossary` will tell you which files are still missing.

The Term component reads by locale key (`entry.locales[language]`), so no component code changes.

### Validation

`npm run validate:glossary` enforces:

- Every term folder has every required locale.
- Every `*.md` parses; `term` is non-empty; body is non-empty.
- Every `related: [...]` reference resolves to an actual term folder.
- `_order.json` references only existing terms.

It runs automatically in `npm run build`. Add it to CI before any production deploy.

---

## Code style

### Bilingual prose (outside the glossary)

Long-form prose (Hook, Arc, Exercises) currently uses `pick(language, en, ko)` from `context/AppContext.tsx`:

```tsx
{
  pick(language, "How much?", "얼마?");
}
```

This is intentional and minimal. We will migrate to a real i18n stack (likely i18next) when:

- We have ≥3 application pages, **or**
- We add a third locale.

Until then, `pick` calls are honest about being ad hoc.

### Components vs widgets

- `components/` — reusable primitives (Term, Exercise, ModeToggle).
- `components/widgets/` — interactive math widgets (PizzaSlider, ThreeDoors). Each widget is one file. Widgets read state from props or local `useState`; they don't import from page-level files.
- Pages live as inline functions in `App.tsx` until V1 ships. After V1, split into `pages/`.

### Math + finance helpers

Pure functions go in `lib/`. They are the canonical math the page is teaching — code mode displays exactly these. Keep them small and untyped beyond `number`.

### Math notation in prose

Math is rendered with **KaTeX** at build time via `remark-math` + `rehype-katex`. The source you write inside delimiters is **standard LaTeX** (the KaTeX-renderable subset).

- **Inline:** `$x^2 + y^2 = r^2$`
- **Block:** `$$\int_0^t v(s)\,ds$$` on its own line
- **Currency in prose:** escape as `\$100`, otherwise it opens a math span
- **Korean labels inside math:** wrap in `\text{...}` — `$g_{\text{달}} \approx 1.62$`
- **No Unicode-typed math.** Use `$\theta$` not `θ`, `$\sqrt{x}$` not `√x`, `$\frac{1}{2}$` not `½`, `$\hat{y}$` not `ŷ`, `$\dot{x}$` not `ẋ`
- **Function names need `\`:** `$\cos\theta$` not `$cos θ$`. Same for `\sin`, `\tan`, `\log`, `\ln`, `\exp`, `\min`, `\max`, `\lim`, etc. Without the backslash they render as italic juxtaposed letters.
- **No `<Formula>` component.** It was retired in favour of standard `$...$`. If you see it in old content, rewrite.

KaTeX support reference: <https://katex.org/docs/supported.html>. If KaTeX warns at build time about your math, fix the source — don't suppress.

---

## Manifesto bar

Every PR is judged against one question (see [`README.md`](./README.md#contributing)):

> _Does this make a curious learner understand something they could not understand before?_

Yes — it belongs.
No — it does not, regardless of how polished it is.

We will not accept content that is correct but inert. We will not accept content that is exciting but empty.

---

## Future (not in V1)

These are deferred until they pull weight:

- **KaTeX in glossary bodies.** Page MDX is already wired (see _Math notation in prose_). Glossary `.md` files still go through a different loader; phase 2 is to pipe them through `unified` + `remark-math` + `rehype-katex` + `rehype-sanitize` and render via `dangerouslySetInnerHTML` in `Term`. Sanitization happens at build time.
- **Wikilinks** (`[[term-id]]`) between glossary entries. Custom remark plugin emits `<a data-term-id>` that the popover binds to navigate.
- **i18next migration.** Converts `pick(language, en, ko)` to `t('namespace:key')` with extracted JSON catalogs.
- **Per-application pages.** Each application gets its own route; modules (this glossary) stay shared.
- **Module dependency graph.** Click an unfamiliar term → jump to its module. Backfill on demand, not in advance.
