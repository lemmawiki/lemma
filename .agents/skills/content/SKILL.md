---
name: content
description: For writing or reviewing content for Lemma — applies the manifesto bar, the arc structure (hook → widget → numbered arc → pin → exercises → glossary), the Term backlink rule, and two-doors discipline. Use when planning a new module or application, drafting prose, or reviewing a draft for ship-readiness.
---

# Content

Lemma is a textbook built backwards: application before abstraction, real
question first, math second. This skill is for getting content past the bar.

## The bar (the only one)

> Does this make a curious learner understand something they could not
> understand before?

- Yes → it ships
- No → it doesn't, however polished

If a page is well-written but the reader walks away knowing the same thing they
already knew, the page failed. Beautiful prose that *restates* understanding is
worse than rough prose that *creates* it.

## Page structure (the arc)

Every application page follows this skeleton:

1. **Hook** — a real-world question that the math is needed to answer
   ("What annual rate turns $41 into $1B in 16 years?"). One vivid paragraph.
   No math yet — the math has to be *missed* before it's introduced.
2. **Widget** — an interactive thing that makes the question tangible. The
   reader must be able to push values around and watch what happens.
3. **Arc** — numbered sections (1, 2, 3 …), each building on the previous.
   The numbering is not decorative; it gives readers a way to talk about
   the page ("the proof in §2") and forces a single load-bearing idea per
   section.
4. **Pin** — a boxed conclusion that crystallizes the whole page in 1–3
   sentences. Memorable. Short. The thing the reader will quote later.
5. **Exercises** — 5–7 problems with reveal-able solutions. Cover this mix:
   - *read the graph* — uses the widget, no formula
   - *compute by hand* / *no calculator* — forces understanding, not lookup
   - *write the equation* — translation from English to math
   - *the evil one* — catches a likely misconception or breaks an
     approximation in a way the reader will remember
6. **Glossary** — page-scoped, auto-populated from `<Term>` usage on the page.
   Don't list everything — only what was actually used.

Module pages (e.g. `the logarithm`) follow the same shape but the hook is the
identity that does all the work, and the arc shows it consumed by applications.

## No knowledge gaps

Audience: post-secondary, 18+, smart, technical. Decision rule:

> Would a smart 18-year-old developer *need help here*?

If yes, backlink it. Wrap the term in `<Term id="…">…</Term>` so it gets a
glossary entry and the hover-counterpart treatment.

**Backlink:**
- Domain-specific things: `float32`, `log_softmax`, `SPY`, `CAGR`, `slide-rule`
- Anything you'd otherwise gloss with "(see Wikipedia)"
- Library functions and concepts that aren't universally known

**Don't backlink:**
- High-school basics: `function`, `variable`, `multiplication`, `derivative`
- General programming literacy: `for loop`, `array`, `string`

The baseline is post-secondary, not zero. Backlinking everything is as bad as
backlinking nothing — both signal "I don't know who I'm writing for."

## Two doors

- **General mode**: prose only. Accessible to anyone meeting the baseline,
  even if they never write code.
- **Code mode**: prose + Python snippets that *complete* the prose. The code
  is itself a teaching surface — function names and return values reinforce
  the equation. Don't duplicate the prose in comments.

When code mode is off, the page must still answer every question on its own.

## Bilingual at the term level

- Every prose page has en + ko sources
- Every `<Term id="x">` has `src/data/glossary/x/en.md` and `…/ko.md`
- Korean is not a translation of English. Both should read native — the same
  insight in two voices.

For Korean register and translation triage, switch to the `translate` skill.

## Committee pattern (review)

For any non-trivial new page, spawn parallel subagents with different lenses
(use the Agent tool with `Explore` for read-only review, or
`general-purpose` for review + edits):

- **Manifesto auditor** — does the page pass the bar? Where exactly does the
  reader gain the new understanding? Quote the sentence.
- **Beginner's eye** — where would a smart 18-year-old stumble? Is every
  unfamiliar term backlinked? Is the hook actually a hook, or just a header?
- **Mathematician's eye** — are the equations right? Is notation consistent
  across the page (`log` vs `ln`, `e^x` vs `exp(x)`)? Are any
  approximations stated (`Stirling`, `Rule of 72`) and any of their
  break-points called out?
- **Copy editor** — is any sentence load-bearing without earning its weight?
  Cut prose that restates the previous sentence. Cut hedges.
- **Korean reader** — is the ko.* prose native, or English-shaped? (Hand to
  the `translate` skill if so.)

Synthesize their feedback into a single revision pass. Don't merge advice
mechanically — pick the right intervention.

## Anti-patterns

- **The textbook voice.** "We will now consider…", "Let us define…". Cut.
- **Front-loading definitions.** A term defined before the reader needs it
  is a term forgotten. Define on demand, in the prose, with `<Term>`.
- **Decorative interactivity.** A widget that doesn't change the reader's
  understanding when they push it is dead weight. If the widget can be
  replaced by a static screenshot, replace it.
- **Symmetric exercises.** Six "compute X" problems is one problem six times.
  The mix exists for a reason.
- **Polished filler.** A page that reads beautifully and teaches nothing
  is the worst failure mode. Every paragraph must be doing work.
