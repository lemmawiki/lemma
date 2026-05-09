// Notation dialect map.
//
// The same mathematical concept gets different symbols across communities. ML
// θ, physics φ, math t, stats β, finance r — all the same animal under different
// names. Lemma is bilingual at the term level; it should also be multi-dialect
// at the notation level.
//
// Each entry catalogues one concept with its canonical Lemma name, then the
// notations the concept goes by in different fields. A `<Dialect>` MDX tag
// renders this as a small inline panel — hover/click to see all dialects at
// once.
//
// Adding a dialect entry:
//   1. Add to the registry below.
//   2. Use `<Dialect concept="<id>" />` next to a relevant formula in MDX.

import type { Locale } from "./glossary";

export type Field =
  | "math"
  | "physics"
  | "ml"
  | "stats"
  | "finance"
  | "graphics"
  | "ee" // electrical engineering / signals
  | "cs";

export const FIELD_LABEL: Record<Field, Record<Locale, string>> = {
  math: { en: "math", ko: "수학" },
  physics: { en: "physics", ko: "물리" },
  ml: { en: "ml / dl", ko: "ML / DL" },
  stats: { en: "statistics", ko: "통계" },
  finance: { en: "finance", ko: "금융" },
  graphics: { en: "graphics", ko: "그래픽" },
  ee: { en: "signals / ee", ko: "신호 / 전기" },
  cs: { en: "cs", ko: "CS" },
};

export interface DialectEntry {
  field: Field;
  notation: string;
  /** Optional one-line note about why this field uses this notation. */
  note?: Record<Locale, string>;
}

export interface DialectMeta {
  /** Concept id, e.g. 'learning-rate', 'slope'. */
  concept: string;
  title: Record<Locale, string>;
  /** A one-sentence concept description, language-aware. */
  description: Record<Locale, string>;
  dialects: DialectEntry[];
}

export const dialects: DialectMeta[] = [
  {
    concept: "learning-rate",
    title: {
      en: "learning rate · the step size of an update",
      ko: "학습률 · 한 걸음의 크기",
    },
    description: {
      en: "How big a step the optimizer takes in the gradient direction. Same number, three names.",
      ko: "최적화기가 그래디언트 방향으로 얼마나 큰 걸음을 내딛을지. 같은 수, 세 가지 이름.",
    },
    dialects: [
      {
        field: "ml",
        notation: "η (eta)",
        note: {
          en: "Greek letter eta in many ML papers; lr in code.",
          ko: "많은 ML 논문에서 그리스 문자 에타. 코드에서는 lr.",
        },
      },
      {
        field: "ml",
        notation: "α (alpha)",
        note: {
          en: "Adam, SGD-with-momentum papers tend to use α.",
          ko: "Adam, SGD-momentum 논문들이 자주 쓰는 표기.",
        },
      },
      {
        field: "math",
        notation: "h",
        note: { en: "step size in numerical analysis.", ko: "수치해석의 step size." },
      },
      {
        field: "stats",
        notation: "step",
        note: {
          en: "stochastic-approximation literature spells it out.",
          ko: "확률적 근사 문헌은 이름을 풀어 쓴다.",
        },
      },
    ],
  },

  {
    concept: "slope",
    title: {
      en: "slope · the rate at which y rises per unit x",
      ko: "기울기 · 단위 x당 y의 증가율",
    },
    description: {
      en: "How steep a line is. Renamed in every field that uses lines.",
      ko: "직선이 얼마나 가파른가. 직선을 쓰는 모든 분야에서 이름이 바뀐다.",
    },
    dialects: [
      {
        field: "math",
        notation: "m",
        note: { en: "y = mx + b — the canonical form.", ko: "y = mx + b — 정규형." },
      },
      {
        field: "ml",
        notation: "w (weight)",
        note: {
          en: "the linear-model coefficient. Same role as m.",
          ko: "선형 모델의 계수. m과 같은 역할.",
        },
      },
      {
        field: "stats",
        notation: "β (beta)",
        note: {
          en: "regression coefficient — y = β₀ + β₁ x.",
          ko: "회귀 계수 — y = β₀ + β₁ x.",
        },
      },
      {
        field: "physics",
        notation: "v (velocity)",
        note: {
          en: "for x = vt + x₀, v is exactly the slope.",
          ko: "x = vt + x₀에서 v가 정확히 기울기.",
        },
      },
    ],
  },

  {
    concept: "parameter-time",
    title: {
      en: "the parameter that runs from 0 to 1",
      ko: "0에서 1로 흐르는 매개변수",
    },
    description: {
      en: "When a curve is a function of one input, that input goes by different names depending on what's being modelled.",
      ko: "곡선이 한 입력의 함수일 때, 그 입력은 무엇을 모델링하느냐에 따라 다른 이름을 갖는다.",
    },
    dialects: [
      {
        field: "math",
        notation: "t",
        note: { en: "the abstract parameter.", ko: "추상적인 매개변수." },
      },
      {
        field: "graphics",
        notation: "u (or t)",
        note: {
          en: "Bezier convention; u for parameter, t reserved for time when both apply.",
          ko: "베지에 관습. 매개변수는 u, 둘 다 필요할 땐 t는 시간.",
        },
      },
      {
        field: "physics",
        notation: "t",
        note: {
          en: "literal time. Often dimensional (seconds).",
          ko: "실제 시간. 단위가 있음 (초).",
        },
      },
      {
        field: "ml",
        notation: "epoch / step",
        note: {
          en: "training-loop iteration counter.",
          ko: "학습 루프의 반복 카운터.",
        },
      },
      {
        field: "stats",
        notation: "n",
        note: {
          en: "sample index — when the parameter is 'which observation'.",
          ko: "표본 인덱스 — 매개변수가 '어느 관측치인가'일 때.",
        },
      },
    ],
  },

  {
    concept: "probability",
    title: {
      en: "probability · how likely an outcome is",
      ko: "확률 · 결과가 일어날 가능성",
    },
    description: {
      en: "A number in [0, 1]. Different fields stamp different letters on it.",
      ko: "[0, 1] 안의 수. 분야마다 다른 글자를 찍는다.",
    },
    dialects: [
      {
        field: "math",
        notation: "P(A)",
        note: {
          en: "measure-theoretic probability — capital P, function of an event.",
          ko: "측도론적 확률 — 대문자 P, 사건의 함수.",
        },
      },
      {
        field: "stats",
        notation: "p, π",
        note: {
          en: "lowercase p in formulas; π for the success probability of a Bernoulli.",
          ko: "수식에서는 소문자 p. 베르누이의 성공 확률은 π.",
        },
      },
      {
        field: "ml",
        notation: "p̂, softmax(z)ᵢ",
        note: {
          en: "p-hat for predicted probability; softmax row when it comes from logits.",
          ko: "예측 확률은 p-hat. 로짓에서 나온 거면 softmax 행 한 자리.",
        },
      },
      {
        field: "physics",
        notation: "|ψ|²",
        note: {
          en: "Born rule — quantum probability is the squared amplitude.",
          ko: "보른 규칙 — 양자 확률은 진폭의 제곱.",
        },
      },
    ],
  },

  {
    concept: "loss",
    title: {
      en: "the thing we're minimizing",
      ko: "최소화하려는 것",
    },
    description: {
      en: "How wrong the model is. The objective every optimizer is trying to drive toward zero.",
      ko: "모델이 얼마나 틀렸나. 모든 최적화기가 0으로 끌고 가려는 목적함수.",
    },
    dialects: [
      {
        field: "ml",
        notation: "L(θ), J(θ)",
        note: {
          en: "L for 'loss', J for the equivalent in older optimization texts.",
          ko: "L은 'loss'. 옛 최적화 텍스트는 J를 쓴다.",
        },
      },
      {
        field: "stats",
        notation: "σ², MSE",
        note: {
          en: "residual variance for regression; mean-squared error in plain English.",
          ko: "회귀의 잔차 분산. 풀어 쓰면 MSE (평균 제곱 오차).",
        },
      },
      {
        field: "math",
        notation: "f(x)",
        note: {
          en: "in optimization theory, just 'the objective'.",
          ko: "최적화 이론에서는 그냥 '목적함수'.",
        },
      },
      {
        field: "ee",
        notation: "E[e²]",
        note: {
          en: "expected squared error — Wiener-filter / signal-processing convention.",
          ko: "기대 제곱 오차 — 위너 필터·신호처리 관습.",
        },
      },
    ],
  },

  {
    concept: "gradient",
    title: {
      en: "gradient · the multivariable slope",
      ko: "그래디언트 · 다변수 기울기",
    },
    description: {
      en: "The vector of partial derivatives. Points uphill the steepest. Same vector under five different naming conventions.",
      ko: "편미분의 벡터. 가장 가파르게 위로 향하는 방향. 같은 벡터, 다섯 가지 이름.",
    },
    dialects: [
      {
        field: "math",
        notation: "∇f",
        note: { en: "nabla f — the canonical notation.", ko: "나블라 f — 정규 표기." },
      },
      {
        field: "ml",
        notation: "∇L, ∂L/∂θ",
        note: {
          en: "gradient of the loss; entries written out as ∂L/∂θᵢ.",
          ko: "손실의 그래디언트. 성분별로는 ∂L/∂θᵢ로 풀어 씀.",
        },
      },
      {
        field: "stats",
        notation: "score",
        note: {
          en: "gradient of the log-likelihood — ∇ log p(x; θ). Has its own name.",
          ko: "로그우도의 그래디언트 — ∇ log p(x; θ). 자기 이름을 가짐.",
        },
      },
      {
        field: "physics",
        notation: "∇V, F",
        note: {
          en: "gradient of a potential is force (with a sign): F = −∇V.",
          ko: "퍼텐셜의 그래디언트가 (부호 빼면) 힘: F = −∇V.",
        },
      },
    ],
  },
];

export const dialectByConcept: Record<string, DialectMeta> = Object.fromEntries(
  dialects.map((d) => [d.concept, d]),
);
