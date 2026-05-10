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
    id: "present-value",
    href: "/finance/present-value",
    pillar: "finance",
    modules: ["log", "integration"],
    status: "available",
    title: {
      en: "What Is Future Money Worth Today?",
      ko: "미래의 돈은 오늘 얼마일까?",
    },
    hook: {
      en: "A future dollar is not a present dollar. Discounting and integration price every cash-flow stream — from rent to bonds to perpetuities — through one identity: future cash times the discount factor, summed across time.",
      ko: "미래의 1달러는 오늘의 1달러가 아니다. 할인과 적분이 모든 현금흐름 — 월세부터 채권, 영구채까지 — 을 한 항등식으로 가격 책정한다. 미래 현금 곱하기 할인계수, 시간에 걸쳐 합산.",
    },
  },
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
    id: "pendulum-clock",
    href: "/physics/pendulum-clock",
    pillar: "physics",
    modules: ["parametric-curves", "derivatives", "linearization"],
    status: "available",
    title: {
      en: "The Pendulum Clock",
      ko: "진자시계",
    },
    hook: {
      en: "Double the swing. Why does the clock barely change? A real pendulum's period depends on amplitude — but for small swings it almost doesn't. Linearize sin θ ≈ θ, and the period becomes constant. The clock stands on that approximation.",
      ko: "진폭을 두 배로 키웠는데, 왜 시계는 거의 같은 시간을 잴까? 실제 진자의 주기는 진폭에 의존한다 — 단, 작은 흔들림에서는 거의 의존하지 않는다. sin θ ≈ θ로 선형화하면 주기가 상수가 된다. 시계는 그 근사 위에 서 있다.",
    },
  },
  {
    id: "terminal-velocity",
    href: "/physics/terminal-velocity",
    pillar: "physics",
    modules: ["derivatives", "integration", "vectors"],
    status: "available",
    title: {
      en: "Why Falling Stops Speeding Up",
      ko: "낙하는 왜 계속 빨라지지 않을까",
    },
    hook: {
      en: "Gravity pulls forever, but a falling raindrop doesn't speed up forever. The reason is one first-order equation — a derivative balanced against a force that grows with speed. Terminal velocity is not a maximum; it's an equilibrium.",
      ko: "중력은 계속 당기는데, 빗방울은 끝없이 빨라지지 않는다. 이유는 한 줄짜리 1계 방정식 — 미분이 속도에 비례해 자라는 힘과 균형을 이루는 자리. 종단속도는 최대값이 아니라 평형이다.",
    },
  },
  {
    id: "projectile-motion",
    href: "/physics/projectile-motion",
    pillar: "physics",
    modules: ["parametric-curves", "derivatives", "integration", "vectors"],
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
    id: "curve-intersections",
    href: "/graphics/curve-intersections",
    pillar: "graphics",
    modules: ["bezout"],
    status: "available",
    title: {
      en: "Curve Intersections",
      ko: "곡선의 교차",
    },
    hook: {
      en: "Drag two conics. Sometimes you see four crossings. Sometimes two. Sometimes none. Bezout says the count is still four. Where did the missing intersections go — and what does a graphics engine do about it?",
      ko: "두 이차곡선을 움직인다. 어떤 때는 교점 네 개가 보이고, 어떤 때는 두 개, 어떤 때는 하나도 안 보인다. 베주 정리는 여전히 네 개라고 말한다. 사라진 교점들은 어디로 갔고, 그래픽 엔진은 그것을 어떻게 다룰까?",
    },
  },
  {
    id: "jpeg-compression",
    href: "/graphics/jpeg-compression",
    pillar: "graphics",
    modules: ["vectors", "entropy"],
    status: "available",
    title: {
      en: "Why JPEG Throws Pixels Away",
      ko: "JPEG는 왜 픽셀을 버릴까",
    },
    hook: {
      en: "Lossy compression isn't bound by entropy — it picks what to discard. JPEG changes basis (DCT) so the picture becomes sparse, throws away the coordinates that don't matter (quantization), and Huffman-packs the rest. Three steps, one savings: fewer coefficients, smaller values, longer zero runs.",
      ko: "손실 압축은 엔트로피에 매이지 않는다 — 무엇을 버릴지를 고른다. JPEG는 기저를 바꿔 (DCT) 그림이 희소해지게 만들고, 의미 없는 좌표를 버리고 (양자화), 나머지를 Huffman으로 묶는다. 세 단계, 하나의 절약: 적은 계수, 작은 값, 긴 0의 연속.",
    },
  },
  {
    id: "image-compression",
    href: "/graphics/image-compression",
    pillar: "graphics",
    modules: ["entropy"],
    status: "available",
    title: {
      en: "Why Images Compress",
      ko: "이미지는 왜 압축될까",
    },
    hook: {
      en: "Two same-size images: one shrinks, one doesn't. The histogram tells half the story; the spatial structure tells the rest. The entropy module names the floor — this page shows what that floor isn't bounding.",
      ko: "같은 크기의 이미지 두 장 — 하나는 줄고 하나는 안 줄어든다. 히스토그램이 절반을 말하고, 공간 구조가 나머지를 말한다. 엔트로피 모듈이 바닥을 명명하고, 이 페이지는 그 바닥이 묶지 못하는 것을 보여준다.",
    },
  },
  {
    id: "bezier-curves",
    href: "/graphics/bezier-curves",
    pillar: "graphics",
    modules: ["parametric-curves", "vectors"],
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
    id: "portfolio-risk",
    href: "/finance/portfolio-risk",
    pillar: "finance",
    modules: ["vectors"],
    status: "available",
    title: {
      en: "Portfolio Risk",
      ko: "포트폴리오 위험",
    },
    hook: {
      en: "Two risky assets, mixed, can be less risky than either alone. The mathematics is one cross-term in a quadratic — and it's the same identity that makes a vector sum's length more (or less) than the sum of its parts. Variance, covariance, correlation; the dot product of returns.",
      ko: "위험한 자산 두 개를 섞으면 각자보다 덜 위험할 수 있다. 그 수학은 이차식의 한 교차항이고, 벡터 합의 길이가 부분의 합보다 크거나 작은 이유와 같은 항등식이다. 분산, 공분산, 상관계수 — 수익률의 내적.",
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
    id: "gradient-descent",
    href: "/ml/gradient-descent",
    pillar: "ml",
    modules: ["derivatives", "vectors"],
    status: "available",
    title: {
      en: "Gradient Descent",
      ko: "경사하강법",
    },
    hook: {
      en: "A model is wrong. You can measure how wrong. But which knob should move, and by how much? The derivative gives the direction; the learning rate gives the distance. Repeat. That five-line loop trains every modern ML model.",
      ko: "모델이 틀렸다. 얼마나 틀렸는지는 잴 수 있다. 그런데 어떤 손잡이를 어느 방향으로 얼마나 움직여야 할까? 미분이 방향을, 학습률이 거리를 정한다. 반복. 그 다섯 줄 루프가 모든 현대 ML 모델을 훈련시킨다.",
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
  {
    id: "model-calibration",
    href: "/ml/model-calibration",
    pillar: "ml",
    modules: ["linearization", "log"],
    status: "available",
    title: {
      en: "Model Calibration",
      ko: "모델 캘리브레이션",
    },
    hook: {
      en: "A model says '70% confident.' Does that mean, across many such predictions, seven in ten are right? The number on the screen and the long-run frequency are two different quantities. The reliability diagram makes the gap visible; one scalar — temperature — rotates the curve back to the diagonal.",
      ko: "모델이 '70% 확신'이라고 말한다. 그런 예측을 많이 모았을 때 정말 열에 일곱이 맞는다는 뜻일까? 화면 위의 수와 장기적 빈도는 다른 두 양이다. 신뢰도 다이어그램이 그 격차를 보여주고, 단 하나의 스칼라 — 온도 — 가 곡선을 대각선 쪽으로 회전시킨다.",
    },
  },
  {
    id: "tf-idf",
    href: "/ml/tf-idf",
    pillar: "ml",
    modules: ["log", "entropy", "vectors"],
    status: "available",
    title: {
      en: "TF-IDF",
      ko: "TF-IDF",
    },
    hook: {
      en: "Why does Google show those results in that order? For thirty years the decision rule barely changed. TF-IDF ranks documents by a score that looks like a sum of probabilities — and the log inside it is the same log as in entropy. Rare words carry many bits; common words carry near zero. Stopwords aren't a list, they're the zero set of a function.",
      ko: "구글은 왜 검색 결과를 그 순서로 보여줄까? 30년 동안 그 결정 규칙은 거의 안 바뀌었다. TF-IDF는 확률의 합처럼 보이는 점수로 문서 순위를 매긴다 — 그 안의 log는 엔트로피의 그 log와 같다. 희귀한 단어는 많은 비트, 흔한 단어는 0에 가까운 비트. Stopword는 목록이 아니라 어떤 함수의 영점이다.",
    },
  },
];

export const applicationByHref: Record<string, ApplicationMeta> = Object.fromEntries(
  applications.map((a) => [a.href, a]),
);
