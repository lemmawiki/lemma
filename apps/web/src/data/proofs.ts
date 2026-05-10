// The Lean layer.
//
// Lemma's prose explains *why* a theorem is true. The proof here is the
// machine-checked version of *that the theorem is true* — every assumption
// stated, every step required. Reading the prose tells you the story; reading
// the Lean tells you what the story has to honour.
//
// The pair is the point. If a curious reader finishes a Lemma module and asks
// "wait, where did that hypothesis come from?", the Lean entry is the answer:
// look at the binders. They are exhaustive.
//
// Authoring rules:
//  - Each entry must compile against current Mathlib on https://live.lean-lang.org.
//  - Statement is plain math (no Lean syntax). Lean source goes in `lean`.
//  - `mathlib` cites the canonical lemma the proof leans on (or "by hand" if
//    the proof is fully unfolded).
//  - `why` answers a single question: what does formalisation reveal that
//    prose hides? If there's no honest answer, do not add the entry.
//
// MDX usage: `<Proof id="log-mul" />` mounts the React widget below.

import type { Locale } from "./glossary";

export interface ProofEntry {
  id: string;
  /** Module this proof underwrites (matches modules registry id). */
  module: string;
  /** Plain-math statement, displayed as the headline. */
  statement: Record<Locale, string>;
  /** What formalisation reveals that prose hides. One sentence. */
  why: Record<Locale, string>;
  /** The full Lean source. Must be self-contained on live.lean-lang.org. */
  lean: string;
  /** Canonical Mathlib lemma name (or "by hand"). */
  mathlib: string;
}

export const proofs: ProofEntry[] = [
  {
    id: "log-mul",
    module: "log",
    statement: {
      en: "For x, y ≠ 0, log(x · y) = log(x) + log(y).",
      ko: "x, y ≠ 0 일 때, log(x · y) = log(x) + log(y).",
    },
    why: {
      en: "Prose says 'log turns × into +'. Lean forces the hypothesis: if either x or y is zero, log is just zero by convention and the identity is empty. Real.log_mul refuses to type-check without `x ≠ 0` and `y ≠ 0` — the hidden caveat is now load-bearing.",
      ko: "산문은 '로그는 곱셈을 덧셈으로 바꾼다'고 말한다. Lean은 가정을 강제한다: x든 y든 0이면, log는 그냥 약속에 따라 0이고 등식은 무의미해진다. Real.log_mul은 `x ≠ 0`과 `y ≠ 0` 없이는 타입 체크를 거부한다 — 산문이 가린 단서가 이제 떠받침이 된다.",
    },
    lean: `import Mathlib

open Real

-- The central identity of the logarithm: it converts multiplication into
-- addition. Mathlib defines log 0 := 0 by convention, so the identity needs
-- both factors nonzero — that is the whole content of the hypotheses.
example (x y : ℝ) (hx : x ≠ 0) (hy : y ≠ 0) :
    log (x * y) = log x + log y :=
  Real.log_mul hx hy`,
    mathlib: "Real.log_mul",
  },
  {
    id: "deriv-pow",
    module: "derivatives",
    statement: {
      en: "d/dx (x²) = 2x, for every real x.",
      ko: "모든 실수 x에 대해, d/dx (x²) = 2x.",
    },
    why: {
      en: "Prose reaches 2x by passing the secant slope to a limit. Lean cannot 'pass to a limit' informally: differentiability at x is itself a proposition that must be discharged before deriv even has a value. The simp lemma deriv_pow is what packs that machinery — once it fires, the equation is just arithmetic.",
      ko: "산문은 할선 기울기를 극한으로 보내 2x에 도달한다. Lean에서는 '극한으로 보낸다'를 말로 할 수 없다: x에서의 미분 가능성 자체가 deriv의 값을 갖기 전에 해소되어야 하는 명제다. simp 보조정리 deriv_pow가 그 기계를 압축하고 있다 — 한 번 발동되면 등식은 그냥 산수다.",
    },
    lean: `import Mathlib

-- The derivative of x^2 is 2x. The whole content is hidden in deriv_pow,
-- which carries the proof that x ↦ x^n is differentiable everywhere — a
-- fact prose tends to assert by gesture.
example (x : ℝ) : deriv (fun y : ℝ => y ^ 2) x = 2 * x := by
  simp [deriv_pow]
  ring`,
    mathlib: "deriv_pow",
  },
  {
    id: "smul-add",
    module: "vectors",
    statement: {
      en: "For a scalar c and vectors u, v: c · (u + v) = c · u + c · v.",
      ko: "스칼라 c와 벡터 u, v에 대해: c · (u + v) = c · u + c · v.",
    },
    why: {
      en: "Prose calls this 'scalar multiplication distributes' and demonstrates with arrows. Lean asks the harder question first: distributes over what kind of vector? Real ℝ², ℂ³, an abstract module over a ring? Mathlib's smul_add proves it once for any module, leaving the user to prove their structure is a module to inherit it. The reusability prose only suggests, the type system enforces.",
      ko: "산문은 이걸 '스칼라 곱이 분배된다'라고 부르고 화살표로 보여준다. Lean은 더 어려운 질문을 먼저 한다: *어떤 종류의* 벡터에 대해? 실수 ℝ², 복소수 ℂ³, 환 위의 추상 가군? Mathlib의 smul_add는 임의의 가군에 대해 한 번만 증명하고, 사용자는 자기 구조가 가군임을 증명해서 그걸 물려받을 뿐이다. 산문이 *암시*하는 재사용성을 타입 시스템이 *강제*한다.",
    },
    lean: `import Mathlib

-- Scalar multiplication distributes over vector addition. The proof is one
-- lemma — but the lemma works for any module (vectors over any ring), not
-- just ℝ². The generality is the point: prove it once, get every special
-- case for free.
example (V : Type) [AddCommGroup V] [Module ℝ V] (c : ℝ) (u v : V) :
    c • (u + v) = c • u + c • v :=
  smul_add c u v`,
    mathlib: "smul_add",
  },
];

export const proofById: Record<string, ProofEntry> = Object.fromEntries(
  proofs.map((p) => [p.id, p]),
);
