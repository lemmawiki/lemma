<div align="center">
  <a href="https://lemma.wiki">
    <img src="brand/mark.svg" alt="Lemma — the Tangent" width="72" />
  </a>

  <h1>Lemma</h1>

  <p>
    <strong>An interactive math textbook built backwards.</strong><br />
    We start with the question. The math comes after.
  </p>

  <p>
    <a href="https://lemma.wiki">lemma.wiki</a>
    &nbsp;·&nbsp;
    <a href="./README.ko.md">한국어 버전</a>
    &nbsp;·&nbsp;
    <a href="./brand/README.md">brand kit</a>
  </p>
</div>

---

## The problem

Math education is broken in a specific, diagnosable way. Three failures, stacked:

**1. Definition first, motivation never.**
School hands you the formula for the integral before telling you it was invented to compute the area under a curve. You learn the _procedure_ and miss the _question_. Most people who "took calculus" cannot tell you why anyone wanted calculus in the first place. This is not a learning failure. It is a teaching failure.

**2. Watching is not learning.**
The internet has filled with beautiful math videos. They are inspiring and almost completely useless for building skill. You finish a 3Blue1Brown video feeling enlightened and cannot solve a single problem on the topic. Passive visualization creates the _illusion_ of understanding while the actual neural pathway — pencil, paper, struggle — never forms.

**3. The Korean ↔ English vocabulary gap is sabotage.**
Anyone working in math, ML, or CS across these two languages knows: "회귀" ≠ obviously "regression," "행렬식" ≠ obviously "determinant," "경사하강" ≠ obviously "gradient descent." Sometimes one Korean word maps to two English concepts and you don't know which one you have. Reading papers becomes translation. Collaboration breaks. No one fixes this because no one owns it.

These are not separate problems. They reinforce each other. A learner who cannot motivate their own study, cannot turn watching into doing, and cannot translate their vocabulary across languages will quit. Most do.

## The thesis

We reject the three patterns that produce these failures.

| Standard approach                         | Our approach                                             |
| ----------------------------------------- | -------------------------------------------------------- |
| Definition → example → application        | **Application → intuition → definition**                 |
| Watch a video, feel smart                 | **Watch, then solve by hand. No exception.**             |
| One language assumed (usually English)    | **Bilingual at the term level. Hover for the original.** |
| Linear curriculum, prerequisites enforced | **Modular graph. Start anywhere. Backfill on demand.**   |
| One presentation for everyone             | **Two modes: math → code, or code → math**               |
| Career path as motivation                 | **Curiosity as motivation. No "Become an X."**           |

Each row is a deliberate inversion of how math is normally taught online. We believe the conventional method is wrong on every row.

## The pedagogy

Five principles. Non-negotiable.

**P1 — Application before abstraction.**
Every topic begins with a real, specific question someone actually asks. _Why is the 3-body problem unsolvable? How does ChatGPT pick the next word? Why do casinos always win?_ The math is built as the answer. If we cannot find a compelling question, we do not teach the topic.

**P2 — Visual to understand. Hand-solving to verify.**
Manipulation, animation, and interactive widgets build intuition. Then problems on paper convert intuition into skill. Both are required. We will not ship a topic that has only one. The visual without the problem is entertainment. The problem without the visual is hazing.

**P3 — Two doors, one room.**
Every concept has two entry points. _General mode_ goes math → code, for those who learned the theory and want to see it run. _Code mode_ goes code → math, for programmers who skipped or forgot the foundation. Identical destination, identical problem set. Different on-ramp.

**P4 — Modular, not sequential.**
There is no Stage 1 you must finish before Stage 2. Every topic is a node in a graph with explicit dependencies. Encounter a missing prerequisite, click the link, fill the gap, return. The system enforces depth on demand, not depth in advance.

**P5 — Bilingual at the term level. No knowledge gaps.**
Korean and English are first-class. Every technical term carries its counterpart on hover. We are not a translated site — we treat the vocabulary gap as the central learning surface.

The same applies to _concepts_. The page is the room; the reader should never have to leave it to look something up. Anything beyond post-secondary common knowledge gets a brief inline gloss or a glossary backlink. The decision rule is "would a smart 18-year-old need help here?" If yes — link it. If you cannot give a one-line gloss, you do not understand it well enough yet. The audience is 18+, technical-curious, but not pre-credentialed in any specific domain.

## The system

Three layers. Each does one thing.

**Applications** — _the entry points._
Specific, concrete, often fun. Each application is self-contained: it shows what is being built, why it matters, the math required, the code that runs it, and the problems that prove you understood. No application is a survey. Every application produces a working artifact.

**Modules** — _the shared math._
Vectors, derivatives, distributions, logarithms. These are not curriculum. They are tools that applications consume. The same "vectors" module serves graphics (positions), physics (velocities), ML (features), and finance (portfolios). Built once. Reused everywhere.

**Glossary** — _the dictionary._
Short, dry, exhaustive. One concept per entry. Cross-referenced relentlessly. Both languages, always linked. The glossary is deliberately not entertaining. It is the load-bearing structure underneath everything else.

## The four pillars

Every application sits under one of four themes. Each theme owns a different question about reality.

| Pillar       | Asks                                | Reveals                              |
| ------------ | ----------------------------------- | ------------------------------------ |
| **Graphics** | How is space described?             | Linear algebra, geometry, light      |
| **Physics**  | How does change happen over time?   | Calculus, ODEs, conservation         |
| **ML / DL**  | How do we learn from data?          | Optimization, probability, gradients |
| **Finance**  | How do we decide under uncertainty? | Probability, statistics, risk        |

The fundamental concepts — vectors, derivatives, distributions, logarithms — appear in all four. That is the design. Math is one thing; the application chooses which face you see first.

We do not add a fifth pillar to look comprehensive. Four is the budget.

## What this is not

We name what we refuse, because the refusals define the project as much as the inclusions.

- **Not a curriculum.** No "Become an ML Engineer in 6 months." Career-path framing flatters the learner and rushes the math. We refuse it.
- **Not a video site.** Animations exist. They serve the problem, not the other way around. If a topic can be learned without an animation, no animation.
- **Not a survey.** We choose depth in narrow places over breadth everywhere. Most of math will be missing for most of this project's life. We will say so.
- **Not a replacement for teachers, textbooks, or universities.** We are the third place — where you sit alone, after class, and try to actually understand it.
- **Not language-neutral.** We pick a side: bilingual Korean and English, with the gap between them as the central feature.

## Status

Proof-of-system stage. As of May 2026, Lemma has five live applications across all four pillars, three shared modules, and every module is consumed by at least one application. The graph is no longer an aspiration: finance, graphics, ML, and physics all have working entry points with widgets, code mode, exercises, and bilingual glossary support.

Still early. Most of math is missing. But the central promises of this manifesto now have running examples: application before abstraction, visual intuition plus hand-solving, two modes, a modular graph, and term-level bilingual backfill.

If this manifesto resonates, the most useful contribution right now is not code — it is challenging the manifesto itself. Open an issue. Tell us what is wrong here, what is missing, what is too soft.

## Contributing

The bar is one question:
_Does this make a curious learner understand something they could not understand before?_

Yes — it belongs.
No — it does not, regardless of how polished it is.

We will not accept content that is correct but inert. We will not accept content that is exciting but empty. The two together, or nothing.

## License

**Content** (text, diagrams, problems, translations): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
**Code** (widgets, infrastructure, tooling): [MIT](https://opensource.org/licenses/MIT)

Both permissive. The point is for this to spread.
