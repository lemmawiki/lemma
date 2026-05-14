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

  {
    id: "vectors-everywhere",
    title: {
      en: "Vectors Everywhere",
      ko: "벡터는 어디에나",
    },
    hook: {
      en: "Four pillars hold the same tuple and call it different things — a point, a velocity, a feature, a weight. Two operations — add and scale — make all four behave. This path walks one example per pillar with the vectors module open as a constant frame.",
      ko: "네 필러가 같은 튜플을 들고 서로 다른 이름으로 부른다 — 점, 속도, 특징, 비중. 두 연산 — 더하기와 늘이기 — 가 그 넷 모두를 받친다. 이 경로는 벡터 모듈을 상수 프레임으로 열어두고 필러마다 예시 하나씩을 걷는다.",
    },
    tagline: {
      en: "Same tuple, four roles — across graphics, physics, ML, and finance.",
      ko: "같은 튜플, 네 역할 — 그래픽, 물리, ML, 금융을 가로질러.",
    },
    duration: 5,
    destination: {
      en: "Seeing one tuple and two operations wear four pillar-shaped hats.",
      ko: "한 튜플과 두 연산이 네 필러의 모자를 바꿔 쓰는 모습 보기.",
    },
    days: [
      {
        day: 1,
        page: "/modules/vectors",
        kind: "module",
        why: {
          en: "Open with the abstract object. A vector is a tuple plus two operations: addition and scalar multiplication. Read for the *roles* the module names — position, displacement, velocity, feature — each is the same algebra wearing a different hat. The next four days fill those hats with real pages.",
          ko: "추상 객체부터 연다. 벡터는 튜플 + 두 연산 (더하기와 스칼라 곱) 이다. 모듈이 명명하는 *역할들* — 위치, 변위, 속도, 특징 — 을 읽는다. 같은 대수가 다른 모자를 쓴다. 다음 4일이 그 모자에 실제 페이지를 채워 넣는다.",
        },
      },
      {
        day: 2,
        page: "/graphics/bezier-curves",
        kind: "application",
        why: {
          en: "Pillar 1 — graphics. The control points the designer drags *are* vectors. The Bezier curve is built by repeated linear interpolation, which is *add* and *scale* iterated. The drawing on screen is the algebra running with no friction.",
          ko: "필러 1 — 그래픽. 디자이너가 끄는 제어점이 *곧* 벡터다. 베지에 곡선은 반복된 선형 보간으로 만들어지고, 그건 *더하기*와 *늘이기*의 반복일 뿐. 화면의 그림은 마찰 없이 돌아가는 그 대수다.",
        },
      },
      {
        day: 3,
        page: "/physics/projectile-motion",
        kind: "application",
        why: {
          en: "Pillar 2 — physics. The same tuple now names *motion*. Position and velocity are vectors evolving in time; gravity is a constant vector added each step. The graphics tuple stored *where*; the physics tuple stores *how it changes*. Algebra unchanged.",
          ko: "필러 2 — 물리. 이제 같은 튜플이 *움직임*을 부른다. 위치와 속도는 시간에 따라 진화하는 벡터, 중력은 매 스텝마다 더해지는 상수 벡터. 그래픽의 튜플이 *어디*를 담았다면, 물리의 튜플은 *어떻게 변하는가*를 담는다. 대수는 그대로.",
        },
      },
      {
        day: 4,
        page: "/ml/gradient-descent",
        kind: "application",
        why: {
          en: "Pillar 3 — ML. The model's parameters are a vector; the gradient is a vector; the update step is *parameter ← parameter − α · gradient* — add and scale again. The *feature* role the module names lives here too: each training example is a vector in ℝⁿ.",
          ko: "필러 3 — ML. 모델 매개변수가 벡터, 그래디언트가 벡터, 갱신 스텝이 *매개변수 ← 매개변수 − α · 그래디언트* — 다시 더하기와 늘이기. 모듈이 명명하는 *특징* 역할도 여기 산다 — 각 학습 예시가 ℝⁿ 위의 벡터.",
        },
      },
      {
        day: 5,
        page: "/finance/portfolio-risk",
        kind: "application",
        why: {
          en: "Pillar 4 — finance. The portfolio weights form a vector; the returns form a vector; the variance involves a dot product against a covariance matrix. The most famous portfolio formula is *literally* the |a + b|² identity from the vectors module, with finance-flavoured names on each term.",
          ko: "필러 4 — 금융. 포트폴리오 비중이 벡터, 수익률이 벡터, 분산은 공분산 행렬에 대한 내적을 거친다. 가장 유명한 포트폴리오 공식은 *글자 그대로* 벡터 모듈의 |a + b|² 항등식 — 각 항에 금융 이름표만 붙은 것.",
        },
      },
    ],
  },

  {
    id: "how-compression-works",
    title: {
      en: "How Compression Works",
      ko: "압축은 어떻게 돌아가는가",
    },
    hook: {
      en: "JPEG squeezes a 1 MB photo to 100 KB. TF-IDF squeezes a million-word vocabulary to a handful of words that actually mean something. Two unrelated pages, one *three-step* procedure — change basis, drop small, reconstruct. This path reads the entropy bound first, then walks the three pages that obey it.",
      ko: "JPEG는 1 MB 사진을 100 KB로 줄인다. TF-IDF는 백만 단어 어휘를 의미 있는 한 줌으로 줄인다. 보기엔 무관한 두 페이지가 같은 *3단계* 절차를 돈다 — 기저 변환, 작은 좌표 버리기, 재구성. 이 경로는 엔트로피 한계를 먼저 읽고, 그 한계를 따르는 세 페이지를 차례로 걷는다.",
    },
    tagline: {
      en: "One three-step procedure under JPEG, TF-IDF, and the raw-pixel entropy floor — across graphics and ML.",
      ko: "JPEG · TF-IDF · 픽셀 엔트로피 하한 — 그래픽과 ML에서 같은 3-단계 절차.",
    },
    duration: 4,
    destination: {
      en: "Seeing one procedure (change basis, drop small, reconstruct) wear three names across graphics and ML.",
      ko: "한 절차 (기저 변환, 작은 좌표 버리기, 재구성) 가 그래픽과 ML에서 세 이름을 바꿔 쓰는 모습 보기.",
    },
    days: [
      {
        day: 1,
        page: "/modules/entropy",
        kind: "module",
        why: {
          en: "Open with the bound the rest of the path bumps against. Entropy $H = -Σ pᵢ \\log pᵢ$ is the minimum bits-per-symbol any lossless coder can hit. Read Arc 5 — *same equation, two pillars* — and note that the compression story already extends across pillars before you finish the abstract.",
          ko: "이 경로의 나머지가 부딪힐 *한계*를 먼저 연다. 엔트로피 $H = -Σ pᵢ \\log pᵢ$는 어떤 무손실 코더도 깰 수 없는 *심볼당 비트* 최솟값. § 5 — *같은 식, 두 필러* — 를 읽고, 추상이 끝나기 전에 압축 이야기가 이미 필러를 가로지른다는 사실을 표시해둔다.",
        },
      },
      {
        day: 2,
        page: "/graphics/image-compression",
        kind: "application",
        why: {
          en: "First instance — pillar: graphics. The objective is a raw pixel grid; the *change of basis* is the move from raw pixels to neighbour-differences (or to a histogram); the entropy of the new representation is much smaller than the entropy of the raw one. PNG lives inside this gap.",
          ko: "첫 사례 — 필러: 그래픽. 대상은 원본 픽셀 그리드, *기저 변환*은 원본 픽셀에서 이웃 차분 (또는 히스토그램) 으로 옮기는 일, 새 표현의 엔트로피가 원본의 엔트로피보다 훨씬 작다. PNG는 그 격차 안에 산다.",
        },
      },
      {
        day: 3,
        page: "/graphics/jpeg-compression",
        kind: "application",
        why: {
          en: "Second instance — still graphics. Same three steps, more aggressive. The basis is now the DCT — 8×8 blocks become 64 frequency coefficients, signal concentrates in the low ones. *Drop small* is quantisation; *reconstruct* runs inverse DCT. Crucially, this is *lossy* — JPEG accepts irreversible loss in exchange for going below the lossless floor day 1 named.",
          ko: "두 번째 사례 — 여전히 그래픽. 같은 세 단계, 더 공격적. 기저는 이번엔 DCT — 8×8 블록이 64개 주파수 계수로 바뀌고, 신호는 저주파에 모인다. *작은 좌표 버리기*는 양자화, *재구성*은 역 DCT. 결정적으로 이건 *손실 압축* — JPEG는 1일차가 말한 무손실 하한 아래로 가기 위해 *되돌릴 수 없는 손실*을 받아들인다.",
        },
      },
      {
        day: 4,
        page: "/ml/tf-idf",
        kind: "application",
        why: {
          en: "Third instance — pillar jumps to ML. The basis is the bag-of-words representation. *Drop small* is $idf(t) = \\log(N / df(t))$ — common words get near-zero weight and effectively *vanish*. The procedure is the same three steps, applied to a document instead of an image, ranking instead of bytes. *Same skeleton, different unit of compression.*",
          ko: "세 번째 사례 — 필러가 ML로 점프한다. 기저는 단어 가방 표현. *작은 좌표 버리기*는 $idf(t) = \\log(N / df(t))$ — 흔한 단어가 거의 0 가중치를 받아 *사라진다*. 절차는 같은 세 단계, 이미지 대신 문서에, 바이트 대신 순위에 적용된 것. *같은 골격, 다른 압축 단위.*",
        },
      },
    ],
  },

  {
    id: "where-change-vanishes",
    title: {
      en: "Where Change Vanishes",
      ko: "변화가 사라지는 곳",
    },
    hook: {
      en: "Why does anything ever stop moving? A pendulum hung from above swings forever in principle. A raindrop falls to a constant speed and never accelerates again. A car spring jiggles, then settles. Three different physics, *one underlying question*: where does the net force vanish, and how does the system get there? This path opens with the derivative — the tool that names *no change* — and walks the three pages that obey it.",
      ko: "왜 무엇은 결국 멈추는가? 위에서 매단 진자는 원칙적으로 영원히 흔들린다. 빗방울은 어떤 속도에 도달한 뒤 더 가속되지 않는다. 자동차 스프링은 진동하다가 정지로 가라앉는다. 세 다른 물리, *한 질문* — 알짜 힘이 사라지는 곳은 어디이고, 시스템은 그곳에 어떻게 도달하는가? 이 경로는 *변화 없음*을 이름 붙이는 도구, 미분으로 시작해 그 도구를 따르는 세 페이지를 걷는다.",
    },
    tagline: {
      en: "One question — *where does change vanish?* — under three physics applications.",
      ko: "한 질문 — *변화는 어디서 사라지는가?* — 세 물리 응용을 관통한다.",
    },
    duration: 4,
    destination: {
      en: "Three different ways a system relates to its equilibrium — orbit it, approach it asymptotically, settle into it.",
      ko: "시스템이 평형과 맺을 수 있는 세 가지 관계 — 돌고 있다, 점근적으로 다가간다, 내려앉는다.",
    },
    days: [
      {
        day: 1,
        page: "/modules/derivatives",
        kind: "module",
        why: {
          en: "Open with the tool that *names* equilibrium. A derivative is the rate of change; setting a derivative equal to zero is what equilibrium *means*. Read Arc 5 — *force balance is exactly where the derivative vanishes here* — and note the pattern before you meet it three times.",
          ko: '평형을 *이름 붙이는* 도구를 먼저 연다. 미분은 변화율이고, 미분을 0으로 놓는 일이 평형의 *정의*다. § 5 — *힘의 균형이란 정확히 "여기서 미분이 사라진다"는 뜻이다* — 를 읽고, 세 번 만나기 전에 패턴을 인지한다.',
        },
      },
      {
        day: 2,
        page: "/physics/pendulum-clock",
        kind: "application",
        why: {
          en: "First instance — *orbit*. The pendulum has an equilibrium at θ = 0, but it never settles there in the ideal model — it *orbits* the equilibrium, swinging through it twice per period. The whole 17th-century clock technology lives in this *periodic-around-equilibrium* regime. The equilibrium is the *axis* of the motion, not its end.",
          ko: "첫 사례 — *공전*. 진자는 θ = 0에서 평형을 가지지만, 이상 모형에서는 그곳에 *멈추지* 않고 그 점을 한 주기에 두 번 지나치며 *공전*한다. 17세기 시계 기술 전부가 *평형 둘레 주기*의 이 영역 안에서 작동한다. 평형은 운동의 *축*이지 *끝*이 아니다.",
        },
      },
      {
        day: 3,
        page: "/physics/terminal-velocity",
        kind: "application",
        why: {
          en: "Second instance — *approach*. The raindrop's equilibrium $v_t = g/k$ is never quite reached — gravity pulling down and drag pushing up approach equality asymptotically, never algebraically. The trajectory *bends toward* the equilibrium without touching it. Calculus is the only honest description of *almost there forever*.",
          ko: "두 번째 사례 — *접근*. 빗방울의 평형 $v_t = g/k$는 *완전히* 도달되지 않는다 — 중력과 공기 저항이 점근적으로 같아질 뿐, 대수적으로는 결코 같아지지 않는다. 자취는 평형을 *향해 휘지만* 닿지 않는다. *영원히 거의 도달*을 정직하게 묘사하는 도구는 미적분뿐이다.",
        },
      },
      {
        day: 4,
        page: "/physics/damped-oscillator",
        kind: "application",
        why: {
          en: "Third instance — *settle*. With both a restoring force and a damping force, the system *reaches* equilibrium — but the shape of the approach depends on the damping ratio. Underdamped: oscillates while shrinking. Critically damped: returns straight, fastest. Overdamped: crawls back slowly. Same equilibrium, three different ways to get there. *Pendulum + terminal-velocity, generalised — and now the equilibrium can actually be reached.*",
          ko: "세 번째 사례 — *내려앉음*. 복원력과 감쇠력이 *둘 다* 있으면 시스템은 평형에 *도달한다* — 하지만 도달 *모양*이 감쇠비에 달려 있다. 부족 감쇠 — 줄어들면서 진동. 임계 감쇠 — 곧장, 가장 빠르게. 과 감쇠 — 천천히 기어서. 같은 평형, 세 가지 도달 방식. *진자 + 종단속도의 일반화 — 그리고 이번엔 평형이 *실제로* 닿는다.*",
        },
      },
    ],
  },

  {
    id: "working-backward",
    title: {
      en: "Working Backward",
      ko: "거꾸로 풀어가기",
    },
    hook: {
      en: "Forward, the formula is trivial: plug in, compute, get the answer. Backward, the *same formula* is the question that actually matters — given the answer, what input produced it? *How long until my money doubles? What rate makes today's price match these future cash flows? What temperature setting makes the model's confidence match observed frequency?* Each is one inversion of an equation that's easy forward. This path walks the three.",
      ko: "정방향이라면 식은 시시하다 — 값을 넣고, 계산하고, 답을 얻는다. 역방향에서 *같은 식*이 *진짜 답해야 할 질문*이 된다 — 답이 주어졌을 때 어떤 입력이 그걸 만들었는가? *내 돈이 두 배가 되는 데 얼마나 걸리지? 어느 금리가 오늘 가격을 미래 현금흐름에 맞춰주지? 어느 온도 값이 모델의 신뢰도를 관측 빈도에 맞춰주지?* 셋 다 *정방향으로는 시시한* 식의 *역방향 풀이*. 이 경로가 그 셋을 차례로 걷는다.",
    },
    tagline: {
      en: "Three pages, one question — given the output, find the input.",
      ko: "세 페이지, 한 질문 — 출력을 보고 입력을 찾는다.",
    },
    duration: 4,
    destination: {
      en: "Recognising that *most of finance and most of model fitting* is the inverse direction of an equation that is easy forward.",
      ko: "*금융의 대부분과 모델 적합의 대부분*이 정방향으로는 시시한 식의 역방향 풀이임을 알아보기.",
    },
    days: [
      {
        day: 1,
        page: "/modules/log",
        kind: "module",
        why: {
          en: "Open with the canonical inverter. Logarithm is what undoes exponentiation — *the* tool for inverting compound-growth equations algebraically. Every page on this path uses it, in one form or another. Read with one question in mind: *when does log give a closed-form inverse, and when do you have to solve numerically instead?*",
          ko: "정전적인 역연산 도구를 먼저 연다. 로그는 거듭제곱을 *되돌리는 것* — 복리식을 *대수적으로* 역산할 때 *바로 그* 도구. 이 경로의 모든 페이지가 이걸 어떤 형태로든 쓴다. 한 질문을 머리에 두고 읽는다 — *언제 log가 닫힌 형식 역해를 주고, 언제는 수치로 풀어야만 하는가?*",
        },
      },
      {
        day: 2,
        page: "/finance/bitcoin-pizza",
        kind: "application",
        why: {
          en: "First instance — algebraic inversion. Forward: $F = P(1+r)^t$ — plug in price, rate, time, get future value. Backward: *given the 10,000-BTC pizza's 2010 price and today's price, what compound annual growth rate connects them?* Take logs of both sides; the unknown drops out of the exponent. One line of algebra, one historical fact about the most expensive meal in history.",
          ko: "첫 사례 — 대수적 역산. 정방향: $F = P(1+r)^t$ — 가격·금리·시간을 넣으면 미래 가치. 역방향: *2010년 1만 BTC 피자의 당시 가격과 오늘 가격이 주어졌을 때, 둘을 잇는 복리 연수익률은 얼마인가?* 양변에 log를 취하면 미지수가 지수에서 떨어진다. 대수 한 줄, 역사상 가장 비싼 식사 한 사실.",
        },
      },
      {
        day: 3,
        page: "/finance/present-value",
        kind: "application",
        why: {
          en: "Second instance — same family, integrated. Compounding *forward* multiplies by $(1+r)^t$; *discounting* — the inverse — divides by the same factor. Present value *is* the inverse-direction calculation: future cash flows are observed, today's price is the unknown to solve for. The integral of $c(t) · e^{-rt}$ is one inversion machine running continuously.",
          ko: "두 번째 사례 — 같은 가족, 적분된 판. *정방향* 복리는 $(1+r)^t$를 곱하고, *할인* — 역방향 — 은 같은 인수로 나눈다. 현재가치는 *바로 그 역방향 계산* — 미래 현금흐름이 관측치, 오늘 가격이 풀어야 할 미지수. $c(t) · e^{-rt}$의 적분은 *연속적으로 돌아가는* 한 역산 기계다.",
        },
      },
      {
        day: 4,
        page: "/ml/model-calibration",
        kind: "application",
        why: {
          en: "Third instance — numerical inversion. Now there is no closed-form inverse. Forward: a temperature value $T$ produces softmax probabilities. Observed: a held-out set of correctness frequencies. Unknown: *which $T$ makes the forward pass match reality?* Algebra cannot answer; the inverse is found by *minimising log-loss over $T$* — an optimization, exactly the kind day 1's module hinted you'd need when log alone runs out.",
          ko: "세 번째 사례 — 수치 역산. 이번엔 닫힌 형식 역해가 *없다*. 정방향 — 온도 값 $T$가 softmax 확률을 만든다. 관측치 — 따로 빼둔 정답률. 미지수 — *어느 $T$가 정방향을 현실에 맞춰주는가?* 대수가 답하지 못한다. 역해는 *$T$에 대해 log-loss를 최소화*해 얻는다 — 최적화, 1일차 모듈이 *log만으로 부족할 때*를 미리 가리킨 그 도구.",
        },
      },
    ],
  },
];

export const journeyById: Record<string, JourneyMeta> = Object.fromEntries(
  journeys.map((j) => [j.id, j]),
);
