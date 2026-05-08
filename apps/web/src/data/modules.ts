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
    id: "bezout",
    href: "/modules/bezout",
    status: "available",
    title: { en: "Bezout's Theorem", ko: "베주 정리" },
    hook: {
      en: "Two curves of degrees d, e meet in exactly d·e points — once the plane is repaired three ways. The chord-and-tangent feeds elliptic-curve arithmetic, which feeds Bitcoin signatures.",
      ko: "두 차수 d, e 곡선은 정확히 d·e 점에서 만난다 — 평면이 세 번 보정된 뒤. 현·접선 작도는 타원곡선 산술을, 그 다음은 비트코인 서명을 받친다.",
    },
  },
];

export const moduleByHref: Record<string, ModuleMeta> = Object.fromEntries(
  modules.map((m) => [m.href, m]),
);
