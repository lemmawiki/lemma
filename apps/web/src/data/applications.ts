// Applications: the entry points to Lemma. One application = one page = one
// concrete question, with a working artifact and exercises that prove you got it.
//
// Adding a new application:
// 1) Add an entry below.
// 2) Build the page component at src/pages/<id>.tsx.
// 3) Wire the route in src/App.tsx (in <Routes/>).

import type { Locale } from "./glossary";

export type Pillar = "graphics" | "physics" | "ml" | "finance";

export type ApplicationStatus = "available" | "draft";

export interface ApplicationMeta {
  id: string;
  href: string;
  pillar: Pillar;
  modules: string[];
  status: ApplicationStatus;
  title: Record<Locale, string>;
  hook: Record<Locale, string>;
}

export const PILLAR_LABEL: Record<Pillar, Record<Locale, string>> = {
  graphics: { en: "graphics", ko: "그래픽" },
  physics: { en: "physics", ko: "물리" },
  ml: { en: "ml / dl", ko: "ML / DL" },
  finance: { en: "finance", ko: "금융" },
};

export const applications: ApplicationMeta[] = [
  {
    id: "bitcoin-pizza",
    href: "/finance/bitcoin-pizza",
    pillar: "finance",
    modules: ["log-root-exp"],
    status: "available",
    title: {
      en: "The Bitcoin Pizza",
      ko: "비트코인 피자",
    },
    hook: {
      en: "On May 22, 2010, a Florida programmer paid 10,000 BTC for two Papa John's pizzas — about $41. Sixteen years later, those coins are worth $1 billion. The most expensive meal in history.",
      ko: "2010년 5월 22일, 플로리다의 프로그래머가 파파존스 피자 두 판 값으로 10,000 BTC — 약 $41 — 을 보냈다. 16년 뒤, 그 코인의 가치는 $10억. 역사상 가장 비싼 식사.",
    },
  },
];

export const applicationByHref: Record<string, ApplicationMeta> = Object.fromEntries(
  applications.map((a) => [a.href, a])
);
