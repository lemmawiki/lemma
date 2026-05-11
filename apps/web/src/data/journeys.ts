// Curated reading paths through the Lemma graph.
//
// A journey is an *opinionated* sequence — the manifesto says modules form a
// graph, not a curriculum. That stays true. Journeys are just *one author's
// pick of one path through that graph*, with a destination in mind. Readers
// who want a directed start use them. Readers who want to wander still can.
//
// Each day points at an existing module or application page. The `why` is
// the editorial glue — why this on this day, not before, not after.
//
// Adding a journey:
//   1. Add an entry below.
//   2. Drop content/pages/journeys/<id>/{en,ko}.mdx with a hook + the
//      <JourneyDays id="<id>"/> tag for the day list.
//   3. URLs land at /<lang>/journey/<id>/.

import type { Locale } from "./glossary";

export type DayKind = "module" | "application" | "review";

export interface JourneyDay {
  day: number;
  page: string; // href, e.g. "/modules/log" or "/finance/bitcoin-pizza"
  kind: DayKind;
  why: Record<Locale, string>;
}

export interface JourneyMeta {
  id: string;
  title: Record<Locale, string>;
  hook: Record<Locale, string>;
  /** Single-line promise for the home-page card — terser than `hook`. */
  tagline: Record<Locale, string>;
  /** Total days. Read on consecutive days, or pace yourself — your call. */
  duration: number;
  destination: Record<Locale, string>; // the application or concept this lands on
  days: JourneyDay[];
}

export const journeys: JourneyMeta[] = [
  {
    id: "to-bitcoin",
    title: {
      en: "To Bitcoin in 7 days",
      ko: "7일에 비트코인까지",
    },
    hook: {
      en: "Two applications, three modules, one trip. Open with the most expensive pizza in history; close knowing why a wallet stays safe.",
      ko: "응용 둘, 모듈 셋, 한 여정. 역사상 가장 비싼 피자로 시작해서 — 지갑이 왜 안전한지를 알고 닫는다.",
    },
    tagline: {
      en: "From the most expensive pizza in history to the signature that keeps a wallet safe.",
      ko: "역사상 가장 비싼 피자에서 지갑을 지키는 서명까지.",
    },
    duration: 7,
    destination: {
      en: "Bitcoin Signature",
      ko: "비트코인 서명",
    },
    days: [
      {
        day: 1,
        page: "/finance/bitcoin-pizza",
        kind: "application",
        why: {
          en: "The question first. Read the page once without any modules — let the gaps surface.",
          ko: "질문부터. 어떤 모듈도 없이 한 번 읽고, 어디가 막히는지 표면화시킨다.",
        },
      },
      {
        day: 2,
        page: "/modules/log",
        kind: "module",
        why: {
          en: "The single equation log(a·b) = log(a) + log(b). Most of the bitcoin-pizza arithmetic was actually this.",
          ko: "단 한 줄의 항등식 log(a·b) = log(a) + log(b). 비트코인 피자의 산술 대부분이 사실은 이것.",
        },
      },
      {
        day: 3,
        page: "/finance/bitcoin-pizza",
        kind: "review",
        why: {
          en: "Re-read with log in hand. The arc 3 CAGR computation should now feel mechanical, not magical.",
          ko: "로그를 쥐고 다시 읽는다. § 3의 CAGR 계산이 이제 마법이 아니라 기계처럼 느껴져야 한다.",
        },
      },
      {
        day: 4,
        page: "/modules/vectors",
        kind: "module",
        why: {
          en: "Bitcoin signatures live on a curve, and curves live in the plane. Vectors are the type-system of points and motions.",
          ko: "비트코인 서명은 곡선 위에 살고, 곡선은 평면에 산다. 벡터는 점과 움직임의 타입 시스템.",
        },
      },
      {
        day: 5,
        page: "/modules/bezout",
        kind: "module",
        why: {
          en: "Two curves of degrees d, e meet in d·e points. The chord-and-tangent law makes elliptic-curve arithmetic possible.",
          ko: "차수 d, e인 두 곡선은 d·e점에서 만난다. 현·접선 법칙이 타원곡선 산술을 가능하게 한다.",
        },
      },
      {
        day: 6,
        page: "/graphics/curve-intersections",
        kind: "application",
        why: {
          en: "Bezout's first non-cryptographic consumer — a small playground that confirms the count before the stakes get real.",
          ko: "베주의 첫 비암호 소비자. 판돈이 커지기 전에 그 셈을 작은 운동장에서 확인.",
        },
      },
      {
        day: 7,
        page: "/finance/bitcoin-signature",
        kind: "application",
        why: {
          en: "Now everything's in place: log + vectors + bezout. Read the signature scheme as a *consequence*, not a wonder.",
          ko: "이제 다 갖춰졌다: 로그 + 벡터 + 베주. 서명 방식을 *경이*가 아니라 *따름정리*로 읽는다.",
        },
      },
    ],
  },

  {
    id: "to-backprop",
    title: {
      en: "To Backprop in 7 days",
      ko: "7일에 역전파까지",
    },
    hook: {
      en: "Confidently wrong, then less wrong, then almost right. Why does a model train? It walks downhill. The hill is a function. The walking is calculus.",
      ko: "자신 있게 틀리고, 덜 틀리고, 거의 맞고. 모델은 왜 학습되는가? 언덕을 내려간다. 언덕은 함수. 내려가는 일은 미적분.",
    },
    tagline: {
      en: "Why does a model train? It walks downhill. The hill is a function.",
      ko: "모델은 왜 학습되는가? 언덕을 내려간다. 언덕은 함수다.",
    },
    duration: 7,
    destination: {
      en: "Gradient Descent",
      ko: "경사하강",
    },
    days: [
      {
        day: 1,
        page: "/ml/confident-wrong",
        kind: "application",
        why: {
          en: "Read once for the trap: a model can be confidently wrong, and softmax doesn't know.",
          ko: "함정부터 읽는다: 모델은 자신 있게 틀릴 수 있고, softmax는 그 사실을 모른다.",
        },
      },
      {
        day: 2,
        page: "/modules/log",
        kind: "module",
        why: {
          en: "Cross-entropy lives in log space. Read why the product of probabilities is replaced by a sum of their logs — float underflow is not a bug to patch around.",
          ko: "교차 엔트로피는 로그 공간에 산다. 확률의 곱이 왜 로그의 합으로 대체되는지 — float 언더플로우는 우회할 버그가 아니다.",
        },
      },
      {
        day: 3,
        page: "/modules/derivatives",
        kind: "module",
        why: {
          en: "The slope of the loss is the direction of training. The same machine — secant collapsing onto tangent — under a new name (the gradient).",
          ko: "손실의 기울기가 학습의 방향. 같은 기계 — 할선이 접선으로 무너지는 — 가 새 이름(그래디언트)을 단다.",
        },
      },
      {
        day: 4,
        page: "/modules/linearization",
        kind: "module",
        why: {
          en: "Far from a critical point, the loss looks linear. That linear approximation is exactly what every optimizer secretly trusts.",
          ko: "임계점에서 멀면 손실은 선형으로 보인다. 그 선형 근사가 모든 최적화기가 은근히 의지하는 바.",
        },
      },
      {
        day: 5,
        page: "/modules/vectors",
        kind: "module",
        why: {
          en: "The gradient is a vector. Backprop is vector calculus done with care. Read this *before* the application — the abstraction earns the page first.",
          ko: "그래디언트는 벡터. 역전파는 조심스러운 벡터 미적분. 응용 *전에* 읽는다 — 추상이 먼저 페이지를 정당화하게.",
        },
      },
      {
        day: 6,
        page: "/ml/gradient-descent",
        kind: "application",
        why: {
          en: "All the tools are now on the bench. Walk downhill on a real loss surface. Watch the step size matter as much as the direction.",
          ko: "도구가 다 작업대에 올라왔다. 실제 손실 곡면을 따라 내려간다. 방향만큼이나 *걸음 크기*가 중요하다는 걸 본다.",
        },
      },
      {
        day: 7,
        page: "/ml/confident-wrong",
        kind: "review",
        why: {
          en: "Re-read with all of the above in hand. The arc-5 trap should now feel like an obvious consequence, not a surprise.",
          ko: "위 모두를 쥐고 다시 읽는다. § 5의 함정이 이제 *놀람*이 아니라 *명백한 따름정리*로 느껴져야 한다.",
        },
      },
    ],
  },

  {
    id: "change-and-accumulation",
    title: {
      en: "Change and accumulation in 7 days",
      ko: "7일에 변화와 누적까지",
    },
    hook: {
      en: "Calculus is two operations — change and its accumulation — and the same pair runs both physics and finance. Distance and present value are the same shape, with different rates plugged in.",
      ko: "미적분은 두 연산이다 — 변화와 그 누적. 같은 짝이 물리와 금융을 동시에 돌린다. 거리와 현재가치는 같은 모양에 다른 변화율을 꽂은 결과다.",
    },
    tagline: {
      en: "How calculus runs both physics and finance — same math, different nouns.",
      ko: "같은 미적분이 물리와 금융을 동시에 돌린다 — 같은 수학, 다른 이름.",
    },
    duration: 7,
    destination: {
      en: "The same accumulator at work in distance and present value.",
      ko: "거리와 현재가치에서 같은 누적기를 알아보기.",
    },
    days: [
      {
        day: 1,
        page: "/physics/projectile-motion",
        kind: "application",
        why: {
          en: "Start with the falling ball — read once without any modules. Note where you reach for v(t) or y(t) and feel the gap.",
          ko: "떨어지는 공으로 시작. 모듈 없이 한 번 읽고, v(t)나 y(t)를 손으로 더듬는 자리를 표시한다.",
        },
      },
      {
        day: 2,
        page: "/modules/derivatives",
        kind: "module",
        why: {
          en: "The change side. Position differentiated once is velocity; twice is acceleration. The whole projectile arc 1 is exactly this ladder.",
          ko: "변화 쪽. 위치를 한 번 미분하면 속도, 두 번 미분하면 가속도. 포물선 § 1 전체가 이 사다리.",
        },
      },
      {
        day: 3,
        page: "/modules/integration",
        kind: "module",
        why: {
          en: "The accumulation side — the pair of the derivative. Reverse the ladder: from acceleration back to velocity, from velocity back to position. Note Arc 6 — the same accumulator runs finance too, with no edits to the math.",
          ko: "누적 쪽 — 미분의 짝. 사다리를 거꾸로: 가속도에서 속도로, 속도에서 위치로. § 6에 주목 — 같은 누적기가 금융에서도 식 한 줄도 안 바꾸고 그대로 돈다.",
        },
      },
      {
        day: 4,
        page: "/physics/projectile-motion",
        kind: "review",
        why: {
          en: "Re-read with both tools in hand. The y(t) = ½gt² formula now reads as ∫₀ᵗ g·s ds — the triangle area you read off geometry on day 1, derived this time from the antiderivative.",
          ko: "두 도구를 쥐고 다시 읽는다. y(t) = ½gt² 공식이 이제 ∫₀ᵗ g·s ds로 읽힌다 — § 1에서 기하로 읽었던 삼각형 넓이가 이번에는 원시함수에서 유도된다.",
        },
      },
      {
        day: 5,
        page: "/physics/terminal-velocity",
        kind: "application",
        why: {
          en: "Change isn't free anymore — drag bends velocity toward an asymptote. Distance is still ∫₀ᵗ v(s) ds; the curve just isn't a triangle. Same accumulator, harder shape.",
          ko: "변화가 더는 공짜가 아니다 — 저항이 속도를 점근선으로 휜다. 거리는 여전히 ∫₀ᵗ v(s) ds, 곡선만 삼각형이 아니다. 같은 누적, 더 어려운 모양.",
        },
      },
      {
        day: 6,
        page: "/finance/present-value",
        kind: "application",
        why: {
          en: "Same accumulator, finance noun. PV = ∫₀ᵀ c(t) e^(−rt) dt — discount each future moment, sum them. Money over time is structurally identical to velocity over time.",
          ko: "같은 누적, 금융 어휘. PV = ∫₀ᵀ c(t) e^(−rt) dt — 각 미래 시점을 할인하고 합한다. *시간에 걸친 돈*은 구조적으로 *시간에 걸친 속도*와 같다.",
        },
      },
      {
        day: 7,
        page: "/modules/integration",
        kind: "review",
        why: {
          en: "Re-read Arc 6 with all four consumers (projectile, terminal, oscillator, present-value) in hand. The cross-pillar admission is now firsthand — *same machine, different nouns*.",
          ko: "이제 네 소비자(포물선, 종단속도, 진동자, 현재가치)를 다 손에 쥐고 § 6을 다시 읽는다. 필러를 가로지르는 인정이 이제는 직접 경험한 사실이다 — *같은 기계, 다른 이름*.",
        },
      },
    ],
  },

  {
    id: "finding-the-minimum",
    title: {
      en: "Finding the Minimum",
      ko: "최솟값을 찾아가기",
    },
    hook: {
      en: "The nouns change: loss, calibration error, portfolio risk. The shape is the same: choose a number to improve, move through choices, stop when improvement runs out. One module, three applications, one skeleton.",
      ko: "이름은 바뀐다 — 손실, 보정 오차, 포트폴리오 위험. 모양은 같다 — 좋아져야 할 숫자를 정하고, 선택지 사이를 움직이다가, 더 좋아지지 않는 곳에서 멈춘다. 한 모듈, 세 응용, 한 골격.",
    },
    tagline: {
      en: "One skeleton — objective, move, step, stop — under three applications across ML and finance.",
      ko: "한 골격 — 목적, 움직임, 스텝, 정지 — 이 ML과 금융의 세 응용을 받친다.",
    },
    duration: 4,
    destination: {
      en: "Reading three different optimization stories as one shared procedure.",
      ko: "세 다른 최적화 이야기를 한 공유 절차로 읽기.",
    },
    days: [
      {
        day: 1,
        page: "/modules/optimization",
        kind: "module",
        why: {
          en: "Read the skeleton first. Five steps — objective, search space, move, step size, stopping — and the widget that walks them in 1D. Note what each step is *named* abstractly; the applications will rename them.",
          ko: "골격부터 읽는다. 다섯 단계 — 목적, 탐색 공간, 움직임, 스텝 크기, 정지 — 와 그 다섯을 1차원에서 보여주는 위젯. 각 단계의 추상적 *이름*에 주의한다. 응용에서는 이 이름이 다시 붙는다.",
        },
      },
      {
        day: 2,
        page: "/ml/gradient-descent",
        kind: "application",
        why: {
          en: "The canonical example. Objective = loss. Search space = a parameter. Move = the derivative. Step size = the learning rate. Read with the five-step skeleton in mind — every word on the page lands on one of the five.",
          ko: "정전적 예. 목적 = 손실. 탐색 공간 = 매개변수. 움직임 = 미분. 스텝 크기 = 학습률. 다섯 단계 골격을 머리에 두고 읽는다 — 페이지의 모든 단어가 다섯 중 하나에 떨어진다.",
        },
      },
      {
        day: 3,
        page: "/ml/model-calibration",
        kind: "application",
        why: {
          en: "Same skeleton, one-dimensional search space. Objective = negative log-likelihood. Search space = a single scalar T. Move = the derivative of NLL with respect to T. *Two pages, identical procedure*; only the dimension differs.",
          ko: "같은 골격, 1차원 탐색 공간. 목적 = 음의 로그 가능도. 탐색 공간 = 스칼라 하나 T. 움직임 = T에 대한 NLL의 미분. *두 페이지, 같은 절차*. 차원만 다르다.",
        },
      },
      {
        day: 4,
        page: "/finance/portfolio-risk",
        kind: "application",
        why: {
          en: "Same skeleton, finance vocabulary. Objective = portfolio variance. Search space = weights summing to 1. Move = the derivative of variance with respect to weight. For two assets the minimum is closed-form; in higher dimensions the same procedure iterates. *The skeleton crosses pillars without changing.*",
          ko: "같은 골격, 금융 어휘. 목적 = 포트폴리오 분산. 탐색 공간 = 합이 1인 비중. 움직임 = 비중에 대한 분산의 미분. 두 자산이면 최솟값은 닫힌 형식, 고차원에서는 같은 절차를 반복한다. *골격은 필러를 가로지르며 그대로다.*",
        },
      },
    ],
  },
];

export const journeyById: Record<string, JourneyMeta> = Object.fromEntries(
  journeys.map((j) => [j.id, j]),
);
