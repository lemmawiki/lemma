// Compute registry — the data layer for the inline `<Compute>` MDX tag.
//
// Each entry describes one *executable formula* embedded somewhere in prose.
// Authors reference it by `id`; the React widget reads the entry, renders an
// inline result chip + click-to-expand sliders that recompute live.
//
// Why a registry instead of inline props in MDX:
//  - Astro islands serialize props via JSON. Functions don't survive that.
//  - Keeping `fn` next to `formula`/`vars`/`format` makes it auditable and
//    exportable later (a "Lemma DATASET" of every computed claim Lemma makes).
//
// Adding a new compute:
//  1. Define the entry below with vars, fn, formula, format.
//  2. Use `<Compute id="<your-id>" />` in MDX.
//  3. Validation runs at build time via scripts/validate-computes.mjs (TBD).

import type { Locale } from "./glossary";

export interface ComputeVar {
  value: number;
  range: [number, number];
  step?: number;
  label: Record<Locale, string>;
  /** Optional formatter for the var's own display in the slider panel. */
  format?: (v: number) => string;
}

export interface ComputeMeta {
  /** Symbolic formula as a string, rendered above the sliders. */
  formula: string;
  vars: Record<string, ComputeVar>;
  fn: (vars: Record<string, number>) => number;
  /** How to render the result. */
  format: (result: number, vars: Record<string, number>) => string;
  /** Optional one-line caption shown at the top of the expand panel. */
  caption?: Record<Locale, string>;
}

const fmtCurrency = (v: number): string => "$" + Math.round(v).toLocaleString("en-US");

const fmtBigSciIfHuge = (v: number): string => {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 1e12) return v.toExponential(2);
  return Math.round(v).toLocaleString("en-US");
};

export const computes: Record<string, ComputeMeta> = {
  // bitcoin-pizza · arc 1 — projecting the pizza forward.
  "bitcoin-pizza-future-value": {
    formula: "F = P · (1 + r)^t",
    vars: {
      P: {
        value: 41,
        range: [1, 1000],
        step: 1,
        label: { en: "principal $P$", ko: "원금 $P$" },
        format: (v) => "$" + v.toFixed(0),
      },
      r: {
        value: 1.89,
        range: [0, 3],
        step: 0.01,
        label: { en: "annual rate $r$", ko: "연이율 $r$" },
        format: (v) => (v * 100).toFixed(0) + "%",
      },
      t: {
        value: 16,
        range: [0, 40],
        step: 1,
        label: { en: "years $t$", ko: "햇수 $t$" },
        format: (v) => v.toFixed(0),
      },
    },
    fn: ({ P, r, t }) => P * Math.pow(1 + r, t),
    format: (v) => "$" + fmtBigSciIfHuge(v),
    caption: {
      en: "drag $r$ to a saner rate (0.10 = 10%/year SPY pace) and watch the future shrink.",
      ko: "$r$를 더 합리적인 값 (0.10 = SPY 연 10% 페이스) 으로 끌고, 미래가 어떻게 줄어드는지 보자.",
    },
  },

  // bitcoin-pizza · arc 6 (the evil exercise) — 16-year CAGR projected another 20 years.
  "bitcoin-pizza-2046": {
    formula: "F = 10^9 · 2.89^t",
    vars: {
      t: {
        value: 20,
        range: [0, 30],
        step: 1,
        label: { en: "years past 2026 (t)", ko: "2026년 이후 햇수 (t)" },
        format: (v) => v.toFixed(0),
      },
    },
    fn: ({ t }) => 1e9 * Math.pow(2.89, t),
    format: (v) => {
      if (!Number.isFinite(v) || v === 0) return "—";
      const log10 = Math.log10(v);
      return `≈ $10^${log10.toFixed(2)}`;
    },
    caption: {
      en: "the result outgrows global GDP (≈$10¹⁴) around year 11. exponentials cannot survive contact with finite resources.",
      ko: "약 11년차에 결과가 세계 GDP (≈$10¹⁴) 를 넘는다. 지수는 유한한 자원과 만나면 살아남지 못한다.",
    },
  },

  // log module · arc 4 — log(p₁·...·pₙ) sum vs product underflow demo.
  "log-product-underflow": {
    formula: "P = pⁿ  vs  log P = n · log p",
    vars: {
      p: {
        value: 0.1,
        range: [0.001, 0.5],
        step: 0.001,
        label: { en: "per-token probability $p$", ko: "토큰당 확률 $p$" },
        format: (v) => v.toFixed(3),
      },
      n: {
        value: 50,
        range: [1, 1000],
        step: 1,
        label: { en: "tokens $n$", ko: "토큰 수 $n$" },
        format: (v) => v.toFixed(0),
      },
    },
    fn: ({ p, n }) => n * Math.log10(p),
    format: (v) => {
      if (!Number.isFinite(v)) return "—";
      return `log₁₀ P = ${v.toFixed(2)}  ⇒  P ≈ 10^${v.toFixed(2)}`;
    },
    caption: {
      en: "set n=1000 with p=0.1 — the product underflows float32 (~10⁻³⁸), but the sum stays in -1000 territory comfortably.",
      ko: "n=1000, p=0.1로 두면 곱은 float32 (~10⁻³⁸) 아래로 무너지지만, 합은 -1000 근처에서 편안.",
    },
  },

  // entropy module — H of 4-outcome distribution from raw weights.
  "entropy-four-outcomes": {
    formula: "H = −Σ pᵢ log₂ pᵢ",
    vars: {
      a: {
        value: 4,
        range: [0, 10],
        step: 0.1,
        label: { en: "weight A", ko: "가중치 A" },
        format: (v) => v.toFixed(1),
      },
      b: {
        value: 3,
        range: [0, 10],
        step: 0.1,
        label: { en: "weight B", ko: "가중치 B" },
        format: (v) => v.toFixed(1),
      },
      c: {
        value: 2,
        range: [0, 10],
        step: 0.1,
        label: { en: "weight C", ko: "가중치 C" },
        format: (v) => v.toFixed(1),
      },
      d: {
        value: 1,
        range: [0, 10],
        step: 0.1,
        label: { en: "weight D", ko: "가중치 D" },
        format: (v) => v.toFixed(1),
      },
    },
    fn: ({ a, b, c, d }) => {
      const sum = a + b + c + d;
      if (sum <= 0) return 0;
      let h = 0;
      for (const w of [a, b, c, d]) {
        const p = w / sum;
        if (p > 0) h -= p * Math.log2(p);
      }
      return h;
    },
    format: (v) => `${v.toFixed(2)} bits  (max log₂ 4 = 2.00)`,
    caption: {
      en: "uniform = 2.00 bits (max). spike one weight to 10 with the others 1 — H falls toward 1.16.",
      ko: "균등 = 2.00 비트 (최대). 한 가중치를 10으로, 나머지를 1로 — H는 1.16 근처로 떨어진다.",
    },
  },

  // unused for now, kept here as a template — half-life decay.
  "half-life-decay": {
    formula: "N(t) = N₀ · (1/2)^(t/τ)",
    vars: {
      N0: {
        value: 1000,
        range: [1, 10000],
        step: 1,
        label: { en: "initial N₀", ko: "초기 N₀" },
        format: (v) => v.toFixed(0),
      },
      tau: {
        value: 5730,
        range: [100, 20000],
        step: 10,
        label: { en: "half-life τ", ko: "반감기 τ" },
        format: (v) => v.toFixed(0),
      },
      t: {
        value: 11460,
        range: [0, 40000],
        step: 1,
        label: { en: "elapsed t", ko: "경과 시간 t" },
        format: (v) => v.toFixed(0),
      },
    },
    fn: ({ N0, tau, t }) => N0 * Math.pow(0.5, t / tau),
    format: (v) => fmtCurrency(v).replace("$", "") + " remaining",
  },
};
