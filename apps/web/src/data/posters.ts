// Print-ready poster content for each module.
//
// A poster is a single A3 portrait page distilling the module to:
//   1. A title (giant serif).
//   2. The single essential formula (huge mono).
//   3. One sentence — the manifesto for that module.
//   4. A small cluster of 5–7 key terms.
//   5. URL + license footer.
//
// Different from `modules.ts`: that file holds an explanatory hook
// (a paragraph). The poster needs the *punchline*, not the explanation.
// Different copy, different shape.
//
// Adding a poster:
//   1. Add an entry below referencing an existing module id.
//   2. Visit /<lang>/poster/<module-id>/ and Cmd+P → save as PDF (A3).
//   3. (Future) `pnpm build:posters` will headless-render all of them
//      to dist-posters/<lang>/<id>.pdf for batch printing.

import type { Locale } from "./glossary";

export interface PosterMeta {
  /** moduleId — must match a `modules.ts` entry. */
  id: string;
  /** The single essential formula, rendered huge. */
  formula: string;
  /** 4–10 word headline rendered above the formula. */
  punchline: Record<Locale, string>;
  /** One-sentence manifesto for the module. */
  oneLine: Record<Locale, string>;
  /** Glossary term ids to pin at the bottom. 5–7 looks right on A3. */
  terms: string[];
}

export const posters: PosterMeta[] = [
  {
    id: "log",
    formula: "log(a · b) = log(a) + log(b)",
    punchline: {
      en: "The trick that turns × into +.",
      ko: "곱셈을 덧셈으로 바꾸는 트릭.",
    },
    oneLine: {
      en: "Most big numbers in nature are built from exponents. Log recovers the exponent. The whole module is one identity; everything else — slide rules, log-likelihood, decibels, the Bitcoin pizza — is a corollary.",
      ko: "자연의 큰 수는 거의 다 지수로 만들어진다. 로그는 그 지수를 꺼낸다. 모듈 전체가 한 항등식, 나머지 — 계산자, 로그우도, 데시벨, 비트코인 피자 — 는 따름정리.",
    },
    terms: ["logarithm", "exponent", "base", "natural-log", "common-log", "slide-rule"],
  },
  {
    id: "entropy",
    formula: "H = −Σ pᵢ log₂ pᵢ",
    punchline: {
      en: "log₂ N, generalized.",
      ko: "log₂ N, 일반화된.",
    },
    oneLine: {
      en: "The expected number of yes/no questions to identify an outcome. Equals log₂ N when uniform; collapses to 0 when one outcome wins. Wordle, Huffman, password strength — all bump against the same number.",
      ko: "어떤 결과가 나왔는지 가리는 데 평균적으로 필요한 예/아니오 질문 수. 균등이면 log₂ N, 한 결과가 압도하면 0. Wordle, Huffman, 비밀번호 강도 — 모두 같은 수에 부딪힌다.",
    },
    terms: ["entropy", "bit", "surprise", "information-gain", "shannon-bound", "logarithm"],
  },
  {
    id: "derivatives",
    formula: "f'(a) = lim h→0 (f(a+h) − f(a)) / h",
    punchline: {
      en: "The arrow the trail wants to be.",
      ko: "자취가 되려는 화살표.",
    },
    oneLine: {
      en: "A moving point leaves a trail. The derivative is not the trail — it is the arrow the trail wants to become at this instant. Same machine, four names: slope, velocity, rate, gradient.",
      ko: "움직이는 점은 자취를 남긴다. 미분은 그 자취가 아니다 — 지금 이 순간 자취가 되려는 화살표다. 한 기계, 네 이름: 기울기·속도·변화율·그래디언트.",
    },
    terms: ["derivative", "secant", "tangent", "velocity", "acceleration", "linearization"],
  },
  {
    id: "vectors",
    formula: "v + w = (v₁ + w₁, v₂ + w₂, …)",
    punchline: {
      en: "A point says where. A vector says how to move.",
      ko: "점은 어디인지를, 벡터는 어떻게 움직일지를.",
    },
    oneLine: {
      en: "The same tuple plays four roles — position, displacement, velocity, feature — across graphics, physics, and ML. Two operations (add and scale) carry every one of them.",
      ko: "같은 튜플이 그래픽·물리·ML에서 네 가지 역할 — 위치·변위·속도·특징 — 을 한다. 두 연산 (더하기와 늘이기) 이 그 모두를 받친다.",
    },
    terms: ["lerp", "control-point", "gradient", "velocity", "cosine-similarity"],
  },
  {
    id: "linearization",
    formula: "f(x) ≈ f(a) + f'(a) · (x − a)",
    punchline: {
      en: "Replace the curve with its tangent.",
      ko: "곡선을 접선으로 갈아끼운다.",
    },
    oneLine: {
      en: "Far from a critical point a function looks linear. The clock works because sin θ ≈ θ; the optimizer works because the loss looks like its tangent line. Linearization is the move every model in physics and ML quietly trusts.",
      ko: "임계점에서 멀면 함수는 선형으로 보인다. 시계가 작동하는 건 sin θ ≈ θ 덕분이고, 최적화기가 작동하는 건 손실이 접선처럼 보이기 때문. 선형화는 물리·ML의 모든 모델이 조용히 의지하는 한 수.",
    },
    terms: ["linearization", "tangent", "derivative", "small-angle-approximation", "secant"],
  },
  {
    id: "bezout",
    formula: "deg(C₁) × deg(C₂) = #(C₁ ∩ C₂)",
    punchline: {
      en: "d × e meeting points — once the plane is fixed.",
      ko: "d × e개의 만남 — 평면이 보정된 뒤에.",
    },
    oneLine: {
      en: "Two curves of degrees d and e meet in exactly d·e points, once the plane is repaired three ways: complex coordinates, projective infinity, multiplicity. The repair is what makes the chord-and-tangent group law work; the group law is what makes elliptic-curve cryptography exist.",
      ko: "차수 d, e인 두 곡선은 정확히 d·e점에서 만난다 — 평면이 세 번 보정된 뒤. 복소 좌표, 사영 무한, 중복도. 그 보정이 현·접선 군 법칙을 가능하게 하고, 그 군 법칙이 타원곡선 암호를 존재하게 한다.",
    },
    terms: [
      "intersection-multiplicity",
      "projective-plane",
      "elliptic-curve",
      "homogenize",
      "vieta-formulas",
    ],
  },
  {
    id: "parametric-curves",
    formula: "γ : [0, 1] → ℝ²",
    punchline: {
      en: "A curve is a function, not a shape.",
      ko: "곡선은 함수다, 모양이 아니다.",
    },
    oneLine: {
      en: "Three layers of 'same': same image (loosest), same up to monotone reparametrization (geometric), equal as functions (strictest). School math conflates them under one word; geometry lives in between.",
      ko: "'같다'의 세 층: 같은 상 (가장 약함), 단조 재매개화 동치 (기하학적), 함수로서 같음 (가장 엄격). 학교 수학은 이를 한 단어 안에 섞어 두고, 기하학은 그 사이에 산다.",
    },
    terms: [
      "parametrized-curve",
      "image-of-curve",
      "reparametrization",
      "definitional-crisis",
      "lerp",
    ],
  },
];

export const posterById: Record<string, PosterMeta> = Object.fromEntries(
  posters.map((p) => [p.id, p]),
);
