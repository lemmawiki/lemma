---
name: translate
description: For translating between Korean and English in Lemma, QA-ing existing translations, or triaging which prose needs rework. Use when adding the counterpart locale to new content, when reviewing for awkward calque, or when the user flags translation quality.
---

# Translate

Lemma is bilingual at the term level. Korean is not a translation — it is a
native voice carrying the same insight. This skill is for getting the
counterpart locale past the same content bar.

## Register

- Technical but readable, with mild literary flair where the prose calls for
  it. The hook is allowed to be vivid.
- Use `~다` / `~이다` declarative throughout prose. No `~합니다` (the
  textbook-formal tone is wrong here — it signals school, not curiosity).
- Avoid academic stiffness. Avoid corporate Korean.
- The English voice is direct, slightly literary, occasionally aphoristic
  ("Logs aren't just inverse exponents. They are the bullshit detector for
  any story told in compounding."). The Korean must match that energy with
  Korean rhythms — not imitate the clause structure.

## Pitfalls (real examples from this repo)

Direct calque from English produces awkward Korean. Some patterns to watch:

| Calque (avoid) | Native (prefer) |
|---|---|
| `이 모듈은 X 가 소비한다` | `이 모듈은 X 에서 쓰인다` |
| `당시 약 $41 을 보냈다` | `당시 약 $41 어치 — 를 보냈다` |
| `결과가 주어지면 단계 수를 센다` | `결과를 주면 몇 번 곱했는지를 센다` |
| `미쳐가던 천문학자들의 시대` | `속이 타들어 가던 천문학자들의 시대였다` |
| `더하기 같음 / 곱하기 같음` | `덧셈으로 같은 양 / 곱셈으로 같은 비율` |

## Math notation stays in source form

- `log₁₀`, not `로그₁₀`
- `e`, not `자연상수` (the term `e` itself is taught; don't translate it)
- `Σ`, `∫`, function names — Latin / symbolic
- The exception: when the symbol *is* the Korean term being defined, define it
  via the glossary, not by translating in prose

## Term policy

When an English term has a settled Korean form, use it: `복리` (compound),
`로그` (log), `지수` (exponent), `거듭제곱근` (n-th root), `밑` (base).

When it doesn't, keep the English: `float32`, `softmax`, `SPY`, `PyTorch`.
The `<Term>` hover shows the counterpart anyway, and forcing a Korean
neologism (`부동소수점32`?) reads worse than the English everyone uses.

Code stays English: variable names, function names, comments. Always.

## Term consistency (mechanical)

Every `<Term id="x">` in prose requires:

- `src/data/glossary/x/en.md` — frontmatter `term:` + body
- `src/data/glossary/x/ko.md` — frontmatter `term:` + body
- The id appears in `src/data/glossary/_order.json` (else it won't render
  in the glossary section)

Verify with:

```sh
npm run validate:glossary --prefix apps/web
```

## Triage workflow

When the user says "review Korean translations" or similar:

1. **Survey** all Korean prose surfaces:
   - `apps/web/src/views/*.tsx` (page prose)
   - `apps/web/src/data/glossary/*/ko.md` (glossary entries)
   - `apps/web/src/data/{applications,modules}.ts` (card titles + hooks)
2. **Score** each passage on calque ↔ native (1–5). Don't grade individual
   words; grade the *paragraph rhythm*.
3. **Prioritize** the 1–3 worst, with one-line diagnoses ("English clause
   order leaks through", "academic register", "term inconsistency with x/ko.md").
4. **Use Opus** for the rewrite pass on tough passages. Sonnet/Haiku tend to
   produce smoother but blander Korean and over-formalize.
5. **Verify** the rewrite preserves *meaning*, not *clause structure*. The
   English and Korean versions are allowed to diverge in *how* they say it
   as long as they converge on *what* the reader walks away knowing.

## QA per file

For a single `ko.md` or `ko.*` surface, check:

- Does any sentence read like English-shaped Korean? Rewrite.
- Any `~합니다` mid-prose? Convert to `~다`.
- Math notation in Latin form?
- Are technical terms consistent with the glossary entries?
- Does the rhythm feel native — short Korean sentences where the English
  was short, long where it was long? Not slavishly — just rhythmically.

## When translating new content (en → ko or ko → en)

1. Read the entire page first. Translation is content-shaped, not
   sentence-shaped.
2. Translate the **hook** last. It's the most rhythmic prose on the page;
   it benefits from doing the rest first.
3. For the arc sections, preserve the *function* of each clause (this clause
   sets up, this clause delivers, this clause pivots). Don't preserve the
   *order* if the target language wants it differently.
4. For exercises and solutions, preserve the math literally. The prose
   wrapping the math can flex.
5. Check term ids — every `<Term id="x">` in the source must resolve in the
   target's glossary. Add missing locales as part of the same pass.
