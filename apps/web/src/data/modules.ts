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
];

export const moduleByHref: Record<string, ModuleMeta> = Object.fromEntries(
  modules.map((m) => [m.href, m])
);
