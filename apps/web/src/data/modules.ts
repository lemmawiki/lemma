// Modules: shared math, consumed by applications. A module is not a curriculum
// stage — it's a tool. Build once, reuse across pillars.
//
// Adding a new module:
// 1) Add an entry below.
// 2) Build the page component at src/pages/<id>.tsx.
// 3) Wire the route in src/App.tsx (in <Routes/>).

import type { Locale } from "./glossary";

export type ModuleStatus = "available" | "draft";

export interface ModuleMeta {
  id: string;
  href: string;
  status: ModuleStatus;
  title: Record<Locale, string>;
  hook: Record<Locale, string>;
}

export const modules: ModuleMeta[] = [
  {
    id: "log",
    href: "/modules/log",
    status: "available",
    title: { en: "The Logarithm", ko: "로그" },
    hook: {
      en: "The trick that turns × into +. The whole module is one equation; everything else is consequence.",
      ko: "곱셈을 덧셈으로 바꾸는 트릭. 모듈 전체가 한 방정식, 나머지는 따름정리.",
    },
  },
  {
    id: "parametric-curves",
    href: "/modules/parametric-curves",
    status: "available",
    title: { en: "Parametric Curves", ko: "매개변수 곡선" },
    hook: {
      en: "A curve is not a picture. Three motions can paint the same parabola — same image, different parametrizations. Pin down the distinction the word 'curve' was hiding, and a whole stack of downstream tools snaps into place.",
      ko: "곡선은 그림이 아니다. 세 가지 움직임이 같은 포물선을 칠할 수 있다 — 같은 이미지, 다른 매개변수화. '곡선'이라는 단어가 숨기고 있던 구분을 못박으면, 그 위에 쌓일 도구들 (그래픽, 물리, 애니메이션) 의 자리가 한꺼번에 잡힌다.",
    },
  },
  {
    id: "derivatives",
    href: "/modules/derivatives",
    status: "available",
    title: { en: "The Derivative", ko: "미분" },
    hook: {
      en: "A moving point leaves a trail. The derivative is not the trail — it is the arrow the trail wants to become at this instant. Secant slopes converge to tangent slopes, and the same machine becomes slope, velocity, and rate.",
      ko: "움직이는 점은 자취를 남긴다. 미분은 그 자취가 아니다 — 지금 이 순간, 자취가 되려고 하는 화살표다. 할선 기울기가 접선 기울기로 수렴하고, 같은 기계가 기울기·속도·변화율이 된다.",
    },
  },
  {
    id: "bezout",
    href: "/modules/bezout",
    status: "available",
    title: { en: "Bezout's Theorem", ko: "베주 정리" },
    hook: {
      en: "Two curves of degrees d, e meet in exactly d·e points — once the plane is repaired three ways. The chord-and-tangent feeds elliptic-curve arithmetic, which feeds Bitcoin signatures.",
      ko: "두 차수 d, e 곡선은 정확히 d·e 점에서 만난다 — 평면이 세 번 보정된 뒤. 현·접선 작도는 타원곡선 산술을, 그 다음은 비트코인 서명을 받친다.",
    },
  },
  {
    id: "integration",
    href: "/modules/integration",
    status: "available",
    title: { en: "The Integral", ko: "적분" },
    hook: {
      en: "A speedometer reads. How far have you traveled? The integral is what survives when you sum a rate over time. The pair to the derivative — and the fundamental theorem says they are inverses.",
      ko: "속도계만 보고 얼마나 멀리 왔는지 알 수 있을까? 적분은 비율을 시간에 대해 합할 때 살아남는 것. 미분의 짝 — 기본정리가 둘이 역연산임을 말한다.",
    },
  },
  {
    id: "linearization",
    href: "/modules/linearization",
    status: "available",
    title: { en: "Linearization", ko: "선형화" },
    hook: {
      en: "Most equations are hard. Their tangent line at a point is easy. Replace one with the other and you get a tool that powers the pendulum clock, Newton's method, and gradient descent — valid in a regime, wrong outside it. The discipline is the regime.",
      ko: "대부분의 식은 어렵다. 어떤 점에서의 접선은 쉽다. 둘을 바꿔치면 진자시계·뉴턴 방법·경사하강법을 받치는 도구가 손에 들어온다 — 어떤 영역에서는 맞고, 그 밖에서는 틀린다. 규율은 그 영역에 있다.",
    },
  },
  {
    id: "vectors",
    href: "/modules/vectors",
    status: "available",
    title: { en: "Vectors", ko: "벡터" },
    hook: {
      en: "A point says where. A vector says how to move. The same tuple plays four roles — position, displacement, velocity, feature — across graphics, physics, and ML. Two operations (add and scale) carry every one of them.",
      ko: "점은 어디인지를, 벡터는 어떻게 움직일지를 말한다. 같은 튜플이 그래픽·물리·ML에서 네 가지 역할 — 위치·변위·속도·특징 — 을 한다. 두 연산 (더하기와 늘이기) 이 그 모두를 받친다.",
    },
  },
  {
    id: "entropy",
    href: "/modules/entropy",
    status: "available",
    title: { en: "Entropy", ko: "엔트로피" },
    hook: {
      en: "20 questions to find any one of N items needs log₂ N when items are equally likely. Entropy is the generalization — the expected number of yes/no questions when they aren't. The bound everything from Wordle to Huffman to password strength bumps against.",
      ko: "20 questions으로 N개 중 하나를 찾는 데 항목이 모두 같은 확률이면 log₂ N번. 엔트로피는 그 일반화 — 확률이 같지 않을 때의 기대 질문 수. Wordle부터 Huffman 압축, 비밀번호 강도까지 모두 부딪히는 한계.",
    },
  },
];

export const moduleByHref: Record<string, ModuleMeta> = Object.fromEntries(
  modules.map((m) => [m.href, m]),
);
