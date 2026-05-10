---
name: read
description: For cold-reading a Lemma page as a zero-context reader and surfacing defects across four axes — fact, fluency, interest, awkwardness. Use when the user says "read this", "give feedback on this page", "is this boring?", "fact-check this", "QA before I ship", or otherwise hands you finished-looking content and asks how it lands. Different lens from `content` (author), `translate` (bilingual), and `professor` (real-user) — this is the simulated cold-reader lens.
---

# Read

Lemma's bar is _does this make a curious learner understand something they
could not understand before?_ The other skills get a page _to_ that bar:
`content` from the author's seat, `translate` from the bilingual seat,
`professor` from a real user's seat. This skill takes the cold reader's
seat — loads the page with no narrative about what it's "supposed" to do,
reads it once front-to-back, and reports where it falls.

The simulation is the work. If you arrive at a page already knowing its
argument, you can't tell where a real reader gets confused, bored, or
unconvinced. Strip the context. Read like someone who clicked a link.

## When to use

- "read this and tell me what's wrong"
- "is this boring?"
- "fact-check §2"
- "does the hook land?"
- "QA this draft before I ship"
- After `content` has produced a draft, before merging.

If the friction is _learning_ the material, hand off to `professor` (real
user as reader). If it's translation parity specifically, `translate` is
closer. This skill is for the read pass that catches what neither of those
do — the in-between defects a fresh reader would notice but the author has
gone blind to.

## The four axes

Every read produces a defect list along four axes. Don't rank the axes
against each other — a fact bug and a boring paragraph are both
ship-blockers, just for different reasons.

### 1. Fact

The math has to actually work. Cold readers will check.

- **Equations.** Expand by hand in scratch before reading on. If the page
  says "12.4%", compute 12.4%. Not "looks right".
- **Worked examples.** Run the arithmetic. If the page claims 30
  doublings of $0.41 reach $1B, check it (it's ~30.4 — does the page
  hide the half?).
- **Domain claims.** Dates, prices, named events, attributions.
  ("Bitcoin pizza, May 22 2010, 10000 BTC for $41" — verify the trio.)
- **Code mode.** Does the snippet do what the prose claims? Trace it
  line by line, or run it.
- **Internal consistency.** Does the pin summarize what the arc actually
  delivered? Does §3 use a value §2 didn't establish? Does the hook's
  promise get kept?

### 2. Fluency

Does each sentence read naturally in its language?

- **English.** Direct, slightly literary, occasionally aphoristic. No
  textbook voice ("we will now…"), no corporate hedge ("it should be
  noted…"), no AI-generated marble ("delve into the fascinating world
  of…").
- **Korean.** `~다` declarative throughout prose. No `~합니다`. No calque
  from English clause order. Sentence rhythm in Korean shapes, not
  shadowed English. (See `translate` for the calque catalogue.)
- **Both.** Cut anything that restates the previous sentence. Cut hedges
  unless the hedge is load-bearing (a real approximation, not author
  uncertainty).

### 3. Interest

Does the page earn the reader's attention paragraph by paragraph?

- **Hook.** Read just the hook, then ask: do I want to know the answer?
  If no, the hook is a header dressed up — not a hook.
- **Arc.** Each numbered section should deliver a turn — a discovery,
  a payoff, a reframe. A section that only _informs_ is a section the
  reader will skim. Mark it.
- **Deletable paragraphs.** Note any paragraph that could be removed
  with no loss to the load-bearing idea. They almost always exist;
  finding them is a primary read goal.
- **Pin.** Read it cold, without re-reading the page first. Is it
  memorable on its own? Could you quote it tomorrow?
- **Exercises.** Are they the prescribed mix (read-the-graph, no-calc,
  write-the-equation, evil one), or six of the same problem?

### 4. Awkwardness

Where the prose works but doesn't sing.

- **Translated calque.** Korean shaped by English clause order, or
  English shaped by Korean honorific patterns. (See `translate`.)
- **Register drift.** Formal where the page is otherwise vivid; vivid
  where the page is otherwise precise. Pick a register per section
  and stay in it.
- **Term inconsistency.** Same concept named two different ways on
  the same page. Pick one and unify (and check the glossary entry
  agrees).
- **Notation drift.** `log` vs `로그`, `e^x` vs `exp(x)`, `n` vs `N`
  for the same quantity. Math notation is part of the prose; it has
  to be consistent within a page.

## Reading discipline

How to actually read cold:

1. **Forget what you know about the page.** If you wrote it, this is
   harder. The simulation is worth doing anyway. Open the file as if
   you've never seen it.
2. **Read once, end to end, no jumping back.** Real readers get one
   pass. Your friction in that pass _is_ the data. If you go back to
   re-check §1 after reading §3, you've contaminated the read.
3. **Track in scratch.** As you read, note line + friction in
   shorthand: `L42: claim feels off`, `L78: deletable`, `L102: this
is a header not a hook`. Don't pause to investigate yet — you're
   recording the reader's experience.
4. **Verify in a second pass.** Once you've read end to end, go back
   and resolve the fact-axis items: compute the math, look up the
   date, run the snippet. The reading and the verifying are separate
   passes; mixing them destroys the cold-read.
5. **Then judge the deletables.** With the whole page in mind, decide
   which "could be removed" notes are real defects and which set up
   something later that you couldn't see at the time.

## Output format

A defect list, grouped by axis, with `file:line` for every entry. One
sentence of diagnosis. Suggested fix only if it's obvious — otherwise
flag and let the author decide.

```
[FACT]   apps/web/src/views/bitcoin-pizza.tsx:128
  Pin claims "30 doublings"; arc §3 derived 30.4. The 30 reads
  authoritative without the half. Either round explicitly in the
  arc, or restate the half in the pin.

[FLUENCY-ko] apps/web/src/views/bitcoin-pizza.tsx:204
  "이 모듈은 X 에서 소비된다" — passive calque. Native: "이 모듈은
  X 에서 쓰인다."

[INTEREST] apps/web/src/views/bitcoin-pizza.tsx:88-94
  §1 paragraph 2 restates paragraph 1 with different verbs.
  Skippable on first read, doesn't set up anything later. Cut.

[AWKWARDNESS] apps/web/src/views/bitcoin-pizza.tsx:152
  Korean sentence mixes `log` and `로그` for the same operation.
  Pick one (the glossary uses `로그`).
```

End with a one-line verdict:

- **Passes** — defects minor, none ship-blocking.
- **Surgical** — handful of targeted fixes will get it past the bar.
- **Structural** — too many defects on the fact axis (math doesn't
  work) or the interest axis (arc doesn't deliver). Hand back to
  `content` for rework before another read pass.

## Bilingual reads

If the page has both `en` and `ko` surfaces:

- Read each in isolation, in its own pass. Don't read `en` then check
  `ko` against it — that biases the `ko` read toward translation
  parity rather than native-voice quality.
- Compare the two _verdicts_, not the two _texts_. If `en` passes
  and `ko` needs structural work, that's a `translate` handoff, not
  a content rework.
- Term-id resolution is a fact-axis check, not a fluency one — every
  `<Term id="x">` in prose must resolve in both glossaries. Run
  `npm run validate:glossary --prefix apps/web` if anything looks off.

## What to avoid

- **Vibes-only feedback.** "This could be punchier" without a line
  reference is noise. If you can't cite the paragraph, you had a
  feeling — not a defect.
- **Rewriting wholesale.** You're a reader, not a co-author. Propose
  targeted fixes; the author owns the prose.
- **Defending the page.** If §3 lost you, say so — even if §3 is the
  cleverest part. Reader confusion at the cleverest part is exactly
  the failure worth surfacing.
- **Faking the cold read.** If you've been editing this page for
  three turns, say so in the report header ("not a true cold read")
  so the user can weight your verdict.
- **Skimming.** Readers don't skim Lemma's prose; if you skim, you
  can't tell what bores them. Read every line.
- **Over-flagging.** A read that lists 40 defects is a read with no
  signal. Cap at the 8–12 that actually move the page.

## Relation to other skills

| Skill       | Lens                         | When                                                |
| ----------- | ---------------------------- | --------------------------------------------------- |
| `content`   | Author / committee           | Planning, drafting, structural review.              |
| `translate` | Bilingual authoring + QA     | Adding the counterpart locale or fixing calque.     |
| `professor` | Real user as reader          | Live teaching session; user's friction is the data. |
| `read`      | Simulated cold reader (this) | Post-draft QA; cheapest pass before merging.        |

`read` is the cheapest review available — runs in one agent's turn,
no human-in-the-loop. Use it before handing to `professor` (which costs
the user's time) or merging (which costs every future reader's time).
