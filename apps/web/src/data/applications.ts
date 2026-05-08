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
    modules: ["log"],
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
  {
    id: "projectile-motion",
    href: "/physics/projectile-motion",
    pillar: "physics",
    modules: ["parametric-curves"],
    status: "available",
    title: {
      en: "Projectile Motion",
      ko: "포물선 운동",
    },
    hook: {
      en: "Throw a ball. Ignore air. Its horizontal motion keeps time; its vertical motion loses to gravity. Why does that make a parabola?",
      ko: "공을 던진다. 공기저항은 무시한다. 가로 방향은 시간을 그대로 가고, 세로 방향은 중력에 진다. 왜 그 결과가 포물선일까?",
    },
  },
  {
    id: "bezier-curves",
    href: "/graphics/bezier-curves",
    pillar: "graphics",
    modules: ["parametric-curves"],
    status: "available",
    title: {
      en: "Bezier Curves",
      ko: "베지에 곡선",
    },
    hook: {
      en: "A designer drags four handles. A movie character gets a smooth cheek, a car gets a perfect hood, a letter gets its curve. How does a computer turn a few points into a smooth path?",
      ko: "디자이너가 손잡이 네 개를 움직인다. 캐릭터의 볼이 매끄러워지고, 자동차 보닛이 휘고, 글자의 곡선이 잡힌다. 컴퓨터는 점 몇 개를 어떻게 매끄러운 길로 바꿀까?",
    },
  },
  {
    id: "bitcoin-signature",
    href: "/finance/bitcoin-signature",
    pillar: "finance",
    modules: ["bezout"],
    status: "available",
    title: {
      en: "The Bitcoin Signature",
      ko: "비트코인 서명",
    },
    hook: {
      en: "Anyone can see your Bitcoin address. No one should see your private key. So how can the network verify that you authorized a payment without learning the secret that authorizes all payments?",
      ko: "비트코인 주소는 누구나 볼 수 있다. 개인키는 아무도 보면 안 된다. 그렇다면 네트워크는 모든 결제를 승인할 수 있는 비밀을 배우지 않고도, 이번 결제가 정말 네가 승인한 것인지 어떻게 확인할까?",
    },
  },
  {
    id: "confident-wrong",
    href: "/ml/confident-wrong",
    pillar: "ml",
    modules: ["log"],
    status: "available",
    title: {
      en: "Confidently Wrong",
      ko: "자신 있게 틀리기",
    },
    hook: {
      en: "A model does not know it is right. It has scores. Softmax turns those scores into numbers that look like probabilities. Cross-entropy punishes the probability the model gave to the correct answer. The trap: a bad score can still become a very confident probability.",
      ko: "모델은 자신이 맞는지 아는 게 아니다. 점수들이 있을 뿐이다. softmax는 그 점수들을 확률처럼 보이는 수로 바꾸고, 교차 엔트로피는 정답에 부여한 확률을 벌점으로 바꾼다. 함정: 나쁜 점수도 아주 자신만만한 확률이 될 수 있다.",
    },
  },
];

export const applicationByHref: Record<string, ApplicationMeta> = Object.fromEntries(
  applications.map((a) => [a.href, a]),
);
