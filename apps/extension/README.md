# Lemma — Deconstruct (Chrome extension)

> Read the open web with Lemma's glossary as an ambient layer.

When you encounter "compound interest", "logarithm", "엔트로피", or
"elliptic curve" on a Hacker News thread, a Bloomberg article, or a Reddit
post, the extension underlines the phrase and links to Lemma's deconstruction
of the concept — the same one-line gloss the Lemma site uses, plus a deep
link to the module that demands it.

This is the Lemma manifesto inverted: instead of a curated page introducing a
concept, the wild article triggers the lookup.

## Install (load unpacked)

1. Build the corpus snapshot (only once, or after adding glossary entries):

   ```sh
   pnpm install
   pnpm --filter @lemma/extension run build:corpus
   ```

   This writes `apps/extension/corpus.json` (~96 entries) by reading
   `apps/web/src/data/glossary/`.

2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the `apps/extension/` directory.

The extension is ready. Visit any page with math/finance/ML content (try
Wikipedia's [Compound interest](https://en.wikipedia.org/wiki/Compound_interest)
page) and watch the highlights appear. Click any underlined phrase for the
one-line deconstruction and a deep link to Lemma.

## Toggle

Click the extension icon (or pin it to the toolbar). The popup has a single
**Highlight terms** checkbox. Reload pages after toggling.

## Matching strategy

- Multi-word phrases ("compound interest", "elliptic curve", "bag of words")
  always match.
- ASCII single words must be **6 characters or longer** ("logarithm" yes,
  "log" no). This keeps the open web from being papered over with false
  positives.
- Korean phrases match without word-boundary, since Korean has none.
- Per-page cap: 200 highlights, longest phrase wins on overlap.

## Files

| Path                       | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `manifest.json`            | Manifest v3, `<all_urls>` content script, `corpus.json` web-accessible. |
| `content.js`               | Walks the page DOM, tags matches, renders the popover.                  |
| `content.css`              | Subtle terra-cotta underline + popover style.                           |
| `popup.html` / `popup.js`  | Toolbar popup with on/off toggle.                                       |
| `corpus.json`              | Slim snapshot of the Lemma glossary (built from the web app).           |
| `scripts/build-corpus.mjs` | Regenerator. Run after adding glossary entries.                         |

## Limitations (today)

- No icon assets. Chrome shows the default puzzle-piece. (Plan: add 16/32/48/128
  PNGs derived from Lemma's wordmark.)
- No locale-specific filter — Korean phrases highlight on English pages and
  vice versa. (Plan: read `<html lang>` and bias matching, but keep the
  cross-lingual link in the popover.)
- Static snapshot; doesn't auto-refresh. Rerun `build:corpus` after editing
  the glossary.
- No rich link preview from Lemma's compute/journey/dialect registries — only
  the glossary one-liner. (Plan: extend the snapshot once it earns its weight.)

## Why this exists

The Lemma site can teach a curious learner who already came looking for the
math. The extension reaches the moment _before_ that decision: the mid-paragraph
"189% CAGR" or "Shannon entropy" that the reader scrolls past because the
words feel familiar. The underline is the question mark.

If clicking the underline does not make the reader understand something they
could not understand before, the extension fails the manifesto bar — same as
any page.
