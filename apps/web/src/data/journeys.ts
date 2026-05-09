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
  /** ~total days; not enforced — author can compress or stretch in `days`. */
  duration: number;
  destination: Record<Locale, string>; // the application or concept this lands on
  days: JourneyDay[];
}

export const journeys: JourneyMeta[] = [
  {
    id: "to-bitcoin",
    title: {
      en: "To Bitcoin in 14 days",
      ko: "14일에 비트코인까지",
    },
    hook: {
      en: "Two applications, three modules, one trip. Open with the most expensive pizza in history; close knowing why a wallet stays safe.",
      ko: "응용 둘, 모듈 셋, 한 여정. 역사상 가장 비싼 피자로 시작해서 — 지갑이 왜 안전한지를 알고 닫는다.",
    },
    duration: 14,
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
        day: 3,
        page: "/modules/log",
        kind: "module",
        why: {
          en: "The single equation log(a·b) = log(a) + log(b). Most of the bitcoin-pizza arithmetic was actually this.",
          ko: "단 한 줄의 항등식 log(a·b) = log(a) + log(b). 비트코인 피자의 산술 대부분이 사실은 이것.",
        },
      },
      {
        day: 5,
        page: "/finance/bitcoin-pizza",
        kind: "review",
        why: {
          en: "Re-read with log in hand. The arc 3 CAGR computation should now feel mechanical, not magical.",
          ko: "로그를 쥐고 다시 읽는다. § 3의 CAGR 계산이 이제 마법이 아니라 기계처럼 느껴져야 한다.",
        },
      },
      {
        day: 7,
        page: "/modules/vectors",
        kind: "module",
        why: {
          en: "Bitcoin signatures live on a curve, and curves live in the plane. Vectors are the type-system of points and motions.",
          ko: "비트코인 서명은 곡선 위에 살고, 곡선은 평면에 산다. 벡터는 점과 움직임의 타입 시스템.",
        },
      },
      {
        day: 9,
        page: "/modules/bezout",
        kind: "module",
        why: {
          en: "Two curves of degrees d, e meet in d·e points. The chord-and-tangent law makes elliptic-curve arithmetic possible.",
          ko: "차수 d, e인 두 곡선은 d·e점에서 만난다. 현·접선 법칙이 타원곡선 산술을 가능하게 한다.",
        },
      },
      {
        day: 11,
        page: "/graphics/curve-intersections",
        kind: "application",
        why: {
          en: "Bezout's first non-cryptographic consumer — a small playground that confirms the count before the stakes get real.",
          ko: "베주의 첫 비암호 소비자. 판돈이 커지기 전에 그 셈을 작은 운동장에서 확인.",
        },
      },
      {
        day: 13,
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
      en: "To Backprop in 14 days",
      ko: "14일에 역전파까지",
    },
    hook: {
      en: "Confidently wrong, then less wrong, then almost right. Why does a model train? It walks downhill. The hill is a function. The walking is calculus.",
      ko: "자신 있게 틀리고, 덜 틀리고, 거의 맞고. 모델은 왜 학습되는가? 언덕을 내려간다. 언덕은 함수. 내려가는 일은 미적분.",
    },
    duration: 14,
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
        day: 3,
        page: "/modules/log",
        kind: "module",
        why: {
          en: "Cross-entropy lives in log space. Read why the product of probabilities is replaced by a sum of their logs — float underflow is not a bug to patch around.",
          ko: "교차 엔트로피는 로그 공간에 산다. 확률의 곱이 왜 로그의 합으로 대체되는지 — float 언더플로우는 우회할 버그가 아니다.",
        },
      },
      {
        day: 5,
        page: "/modules/derivatives",
        kind: "module",
        why: {
          en: "The slope of the loss is the direction of training. The same machine — secant collapsing onto tangent — under a new name (the gradient).",
          ko: "손실의 기울기가 학습의 방향. 같은 기계 — 할선이 접선으로 무너지는 — 가 새 이름(그래디언트)을 단다.",
        },
      },
      {
        day: 7,
        page: "/modules/linearization",
        kind: "module",
        why: {
          en: "Far from a critical point, the loss looks linear. That linear approximation is exactly what every optimizer secretly trusts.",
          ko: "임계점에서 멀면 손실은 선형으로 보인다. 그 선형 근사가 모든 최적화기가 은근히 의지하는 바.",
        },
      },
      {
        day: 9,
        page: "/modules/vectors",
        kind: "module",
        why: {
          en: "The gradient is a vector. Backprop is vector calculus done with care. Read this *before* the application — the abstraction earns the page first.",
          ko: "그래디언트는 벡터. 역전파는 조심스러운 벡터 미적분. 응용 *전에* 읽는다 — 추상이 먼저 페이지를 정당화하게.",
        },
      },
      {
        day: 11,
        page: "/ml/gradient-descent",
        kind: "application",
        why: {
          en: "All the tools are now on the bench. Walk downhill on a real loss surface. Watch the step size matter as much as the direction.",
          ko: "도구가 다 작업대에 올라왔다. 실제 손실 곡면을 따라 내려간다. 방향만큼이나 *걸음 크기*가 중요하다는 걸 본다.",
        },
      },
      {
        day: 13,
        page: "/ml/confident-wrong",
        kind: "review",
        why: {
          en: "Re-read with all of the above in hand. The arc-5 trap should now feel like an obvious consequence, not a surprise.",
          ko: "위 모두를 쥐고 다시 읽는다. § 5의 함정이 이제 *놀람*이 아니라 *명백한 따름정리*로 느껴져야 한다.",
        },
      },
    ],
  },
];

export const journeyById: Record<string, JourneyMeta> = Object.fromEntries(
  journeys.map((j) => [j.id, j]),
);
