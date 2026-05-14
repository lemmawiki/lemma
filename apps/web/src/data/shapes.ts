// Shapes — the third dimension of Lemma's content graph.
//
// Modules organise content by *math tool* (log, derivative, vectors, ...).
// Pillars organise by *domain* (finance/physics/graphics/ml).
// Journeys are curated *paths* through the graph.
// Shapes organise by *procedural skeleton* — the same step-by-step
// procedure that appears, under different names, across multiple pages.
//
// The pattern was already visible in the `finding-the-minimum` journey,
// which threaded three otherwise-unrelated applications (gradient
// descent, model calibration, portfolio risk) under one skeleton:
// objective → move → step → stop. This file promotes that pattern to
// first-class data: every shape names a procedure, declares its
// skeleton, and points at every application that is an instance of it.
//
// Authoring rule: a shape exists only if at least three pages on Lemma
// already implement the same procedure. Shapes do not invent new
// abstractions; they recognise procedures already present in the
// prose. If a shape only has two instances, it stays as a journey or
// an inline observation. The cross-pillar diagnostic — same procedure
// across different domains — is the load-bearing claim.

import type { Locale } from "./glossary";

export interface ShapeStep {
  /** Short noun naming this step of the procedure. */
  name: Record<Locale, string>;
  /** One-line gloss of what happens at this step. */
  gloss: Record<Locale, string>;
}

export interface ShapeInstance {
  /** Application id from applications.ts (or module id for module-level instances). */
  page: string;
  /** What this app calls the "objective" / first step in its own vocabulary. */
  objective: Record<Locale, string>;
  /** One-line summary of how this instance of the shape closes. */
  stop: Record<Locale, string>;
}

export interface ShapeMeta {
  id: string;
  title: Record<Locale, string>;
  /** Why the shape is worth naming — what changes when you recognise it. */
  hook: Record<Locale, string>;
  /** The procedural skeleton, in order. */
  skeleton: ShapeStep[];
  /** Live pages that are instances of this shape. >=3 required. */
  instances: ShapeInstance[];
  /** Modules whose tools this shape leans on. */
  modules: string[];
  /** Optional pointer to a journey that walks this shape's instances in order. */
  journey?: string;
}

export const shapes: ShapeMeta[] = [
  {
    id: "find-the-minimum",
    title: {
      en: "Find the Minimum",
      ko: "최솟값을 찾아가기",
    },
    hook: {
      en: "The nouns change — loss, calibration error, portfolio risk — but the procedure is one: pick a number to improve, move through choices, stop when improvement runs out. Once you read it once, you recognise it everywhere.",
      ko: "이름은 바뀐다 — 손실, 보정 오차, 포트폴리오 위험. 절차는 하나다 — 좋아져야 할 숫자를 정하고, 선택지 사이를 움직이다가, 더 좋아지지 않는 곳에서 멈춘다. 한 번 읽고 나면, 모든 곳에서 알아본다.",
    },
    skeleton: [
      {
        name: { en: "objective", ko: "목적" },
        gloss: {
          en: "Pick a single number that should get smaller (or larger).",
          ko: "작아져야 할 (또는 커져야 할) 한 숫자를 고른다.",
        },
      },
      {
        name: { en: "move", ko: "움직임" },
        gloss: {
          en: "Decide which direction in the choice space lowers the objective.",
          ko: "선택지 공간에서 목적을 낮추는 방향을 정한다.",
        },
      },
      {
        name: { en: "step", ko: "스텝" },
        gloss: {
          en: "Decide how far to move in that direction.",
          ko: "그 방향으로 얼마나 갈지 정한다.",
        },
      },
      {
        name: { en: "stop", ko: "정지" },
        gloss: {
          en: "Pick a rule for when further moves stop helping.",
          ko: "더 이상 움직임이 도움이 안 되는 시점을 정한다.",
        },
      },
    ],
    instances: [
      {
        page: "gradient-descent",
        objective: { en: "training loss L(w)", ko: "훈련 손실 L(w)" },
        stop: {
          en: "gradient norm small or held-out loss flat.",
          ko: "그래디언트 노름이 작거나 검증 손실이 평탄해질 때.",
        },
      },
      {
        page: "model-calibration",
        objective: { en: "log-loss on validation set", ko: "검증셋의 log-loss" },
        stop: {
          en: "validation log-loss stops improving as temperature T changes.",
          ko: "온도 T 가 바뀌어도 검증 log-loss 가 더 안 좋아지지 않을 때.",
        },
      },
      {
        page: "portfolio-risk",
        objective: { en: "portfolio variance σ²", ko: "포트폴리오 분산 σ²" },
        stop: {
          en: "KKT conditions met — no feasible move lowers risk further.",
          ko: "KKT 조건 충족 — 위험을 더 낮출 수 있는 가능한 움직임이 없을 때.",
        },
      },
    ],
    modules: ["optimization", "derivatives", "vectors"],
    journey: "finding-the-minimum",
  },
  {
    id: "equilibrium",
    title: {
      en: "Equilibrium",
      ko: "균형",
    },
    hook: {
      en: "Two opposing forces, one point where they cancel. The shape underneath the pendulum, the falling raindrop, and the optimal portfolio: name the forces, write the balance equation, solve for where the net change vanishes.",
      ko: "맞서는 두 힘, 그들이 상쇄되는 한 점. 진자, 떨어지는 빗방울, 최적 포트폴리오 아래에 *같은 골격*이 있다 — 힘을 명명하고, 균형식을 적고, 알짜 변화가 사라지는 곳을 푼다.",
    },
    skeleton: [
      {
        name: { en: "two opposing forces", ko: "두 힘" },
        gloss: {
          en: "Identify what pushes the system one way and what pushes it back.",
          ko: "시스템을 한 방향으로 미는 것과 되돌리는 것을 식별한다.",
        },
      },
      {
        name: { en: "balance equation", ko: "균형식" },
        gloss: {
          en: "Write the net force / net rate as a single algebraic expression.",
          ko: "알짜 힘 또는 알짜 변화율을 한 식으로 적는다.",
        },
      },
      {
        name: { en: "fixed point", ko: "고정점" },
        gloss: {
          en: "Set the net to zero and solve for the state where nothing changes.",
          ko: "알짜를 0으로 놓고 변화가 멈추는 상태를 푼다.",
        },
      },
    ],
    instances: [
      {
        page: "pendulum-clock",
        objective: {
          en: "gravity restoring force vs angular displacement",
          ko: "중력 복원력 vs 각 변위",
        },
        stop: {
          en: "θ̈ = −(g/L) sin θ — linearised to a single fixed frequency.",
          ko: "θ̈ = −(g/L) sin θ — 작은 각 근사로 단일 고유주파수.",
        },
      },
      {
        page: "terminal-velocity",
        objective: { en: "gravity pulling down vs drag pushing up", ko: "중력 ↓ vs 공기저항 ↑" },
        stop: {
          en: "dv/dt = g − kv → set to 0 → v_t = g/k.",
          ko: "dv/dt = g − kv → 0 으로 → v_t = g/k.",
        },
      },
      {
        page: "damped-oscillator",
        objective: { en: "restoring force vs damping force", ko: "복원력 vs 감쇠력" },
        stop: {
          en: "Equilibrium at the origin; the damping ratio decides how it gets there.",
          ko: "원점이 평형 — 감쇠비가 그곳에 *어떻게* 도달할지 결정.",
        },
      },
    ],
    modules: ["derivatives", "linearization"],
  },
  {
    id: "inverse-problem",
    title: {
      en: "The Inverse Problem",
      ko: "역문제",
    },
    hook: {
      en: "The forward model is easy: given inputs, compute the output. The inverse is the question that actually matters: given the output, recover the input. Most of finance and most of model calibration is the inverse direction of an equation that's trivial forward.",
      ko: "정방향 모델은 쉽다 — 입력을 주면 출력이 나온다. 역방향이 *진짜 답해야 할 질문*이다 — 출력을 주고 입력을 찾는다. 금융의 대부분과 모델 보정의 대부분이 *정방향으로는 시시한* 식의 *역방향*이다.",
    },
    skeleton: [
      {
        name: { en: "forward model", ko: "정방향 모델" },
        gloss: {
          en: "Write the function that maps inputs to outputs the straightforward way.",
          ko: "입력을 출력으로 보내는 함수를 똑바로 적는다.",
        },
      },
      {
        name: { en: "known + unknown", ko: "기지 + 미지" },
        gloss: {
          en: "Mark which side of the equation is observed and which is the question.",
          ko: "식의 어느 쪽이 관측됐고 어느 쪽이 질문인지 표시한다.",
        },
      },
      {
        name: { en: "invert", ko: "역산" },
        gloss: {
          en: "Apply log, root, or numerical solve depending on what the unknown is.",
          ko: "미지수가 무엇이냐에 따라 log, root, 또는 수치 풀이를 적용.",
        },
      },
    ],
    instances: [
      {
        page: "bitcoin-pizza",
        objective: {
          en: "F = P(1+r)^t with known F, P; unknown t or r",
          ko: "F = P(1+r)^t — F, P 알고 t 또는 r 미지",
        },
        stop: {
          en: "log inverts to find t; root inverts to find r — same forward, two inverses.",
          ko: "log 로 t 를 역산, root 로 r 를 역산 — 같은 정방향, 두 역방향.",
        },
      },
      {
        page: "present-value",
        objective: {
          en: "future cash flow known; present value unknown",
          ko: "미래 현금흐름 알고, 현재 가치 미지",
        },
        stop: {
          en: "Divide forward expression by (1+r)^t — discounting *is* the inverse of compounding.",
          ko: "정방향 식을 (1+r)^t 로 나눔 — 할인은 복리의 *역연산 그 자체*.",
        },
      },
      {
        page: "model-calibration",
        objective: {
          en: "model outputs predicted probabilities; observed frequencies known; unknown temperature T",
          ko: "모델 예측 확률, 관측 빈도 알고, 온도 T 미지",
        },
        stop: {
          en: "Minimise log-loss over T to invert: which T makes the forward pass match reality?",
          ko: "T 에 대해 log-loss 최소화로 역산 — 어느 T 가 정방향을 현실에 맞추는가?",
        },
      },
    ],
    modules: ["log", "optimization"],
  },
  {
    id: "compression",
    title: {
      en: "Compression",
      ko: "압축",
    },
    hook: {
      en: "High-dimensional data with too much redundancy. Change basis until most coordinates are small. Drop the small ones. Reconstruct what's left. JPEG, TF-IDF, and Huffman codes are the *same procedure*, just applied to pixels, words, and probabilities.",
      ko: "차원은 높고 중복은 많은 데이터. 대부분의 좌표가 작아질 때까지 기저를 바꾼다. 작은 것들은 버린다. 남은 걸로 재구성한다. JPEG·TF-IDF·허프만 코드는 *같은 절차* — 픽셀에, 단어에, 확률에 적용했을 뿐.",
    },
    skeleton: [
      {
        name: { en: "change basis", ko: "기저 변환" },
        gloss: {
          en: "Pick a basis where signal concentrates in few coordinates.",
          ko: "신호가 적은 좌표에 집중되도록 기저를 고른다.",
        },
      },
      {
        name: { en: "drop small", ko: "작은 좌표 버리기" },
        gloss: {
          en: "Zero out (or quantise) coordinates below a threshold.",
          ko: "임계값 이하의 좌표를 0으로 (또는 양자화).",
        },
      },
      {
        name: { en: "reconstruct", ko: "재구성" },
        gloss: {
          en: "Invert the basis change with the surviving coordinates.",
          ko: "살아남은 좌표로 기저 변환을 역으로.",
        },
      },
    ],
    instances: [
      {
        page: "jpeg-compression",
        objective: { en: "8×8 pixel block as 64-D vector", ko: "8×8 픽셀 블록을 64차원 벡터로" },
        stop: {
          en: "DCT basis concentrates energy in low frequencies; quantise the rest; Huffman the residuals.",
          ko: "DCT 기저가 저주파에 에너지 집중; 나머지 양자화; 잔차는 Huffman.",
        },
      },
      {
        page: "tf-idf",
        objective: {
          en: "document as bag of words; high-D sparse vector",
          ko: "문서를 단어 가방으로; 고차원 희소 벡터",
        },
        stop: {
          en: "idf = log(N/df) zeros out common words; rare words carry the signal.",
          ko: "idf = log(N/df) 가 흔한 단어를 0으로; 희귀 단어가 신호를 짊어짐.",
        },
      },
      {
        page: "image-compression",
        objective: {
          en: "raw pixel grid; redundancy across neighbours",
          ko: "원본 픽셀 그리드; 이웃 간 중복",
        },
        stop: {
          en: "Histogram + spatial coding catch what the entropy floor predicts.",
          ko: "히스토그램 + 공간 부호화가 엔트로피 하한이 예측한 것을 잡음.",
        },
      },
    ],
    modules: ["entropy", "vectors"],
  },
];

export const shapeById: Record<string, ShapeMeta> = Object.fromEntries(
  shapes.map((s) => [s.id, s]),
);
