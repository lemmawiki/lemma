// Provenance — when and why each concept was first formalized.
//
// Math is normally taught as if it always existed. It didn't. Each idea has a
// year, a person, a place, and (most importantly) a *problem that demanded
// it*. Surfacing that turns the manifesto's "application before abstraction"
// into a *historical* fact, not just a pedagogical claim: the application
// came first, here is the human who couldn't compute X any other way and so
// invented Y.
//
// Authoring rule: every entry must answer "what real problem did this
// concept's invention solve?" If no concrete answer, do not add the entry.
// History without motivation is the trivia we already reject.
//
// The MDX tag `<History concept="logarithm" />` renders this as a small
// sidenote inline with the prose. Click to expand for the full one-liner.

import type { Locale } from "./glossary";

export interface ProvenanceEntry {
  concept: string;
  year: number; // CE; negative for BCE
  /** Free-text era when a single year is wrong (e.g. 'late 1670s'). */
  yearLabel?: { en: string; ko: string };
  who: string;
  where: string;
  /** What real-world problem demanded the invention. One sentence. */
  oneLiner: Record<Locale, string>;
  /** Optional URL — primary-source paper, Wikipedia, anything stable. */
  source?: string;
}

export const provenance: ProvenanceEntry[] = [
  {
    concept: "logarithm",
    year: 1614,
    who: "John Napier",
    where: "Edinburgh, Scotland",
    oneLiner: {
      en: "Astronomers computing eclipse predictions were dying inside multiplying nine-digit numbers by hand. Napier spent 20 years building tables that turn each such product into a single sum. Apollo got to the moon on slide rules — direct descendants of his tables.",
      ko: "일식을 예측하던 천문학자들이 9자리 수를 손으로 곱하다 속이 타들어 갔다. 네이피어는 모든 곱셈을 단 한 번의 덧셈으로 바꿔주는 표를 20년에 걸쳐 만들었다. 아폴로는 그 표의 직계 후손인 계산자(slide rule)로 달에 갔다.",
    },
    source: "https://en.wikipedia.org/wiki/Mirifici_Logarithmorum_Canonis_Descriptio",
  },
  {
    concept: "derivative",
    year: 1670,
    yearLabel: { en: "late 1660s–1680s", ko: "1660년대 말–1680년대" },
    who: "Isaac Newton (England) & Gottfried Leibniz (Germany), independently",
    where: "Cambridge / Hannover",
    oneLiner: {
      en: "Newton needed the slope of position to talk about velocity for his planetary motion work; Leibniz invented the same machine in different notation for tangent-line problems. The bitter priority dispute that followed delayed British mathematics by ~50 years.",
      ko: "뉴턴은 행성 운동을 다루려고 *위치의 기울기 = 속도*를 셈해야 했고, 라이프니츠는 같은 기계를 접선 문제에 답하려고 다른 표기로 발명했다. 뒤따른 쓰라린 우선권 분쟁이 영국 수학을 ~50년 늦춘다.",
    },
    source: "https://en.wikipedia.org/wiki/Leibniz%E2%80%93Newton_calculus_controversy",
  },
  {
    concept: "linearization",
    year: 1715,
    who: "Brook Taylor",
    where: "London",
    oneLiner: {
      en: "Taylor's *Methodus Incrementorum* gave the series that bears his name — 'replace any function near a point by its tangent line, then by its tangent parabola, and so on'. Every linearization in physics, ML, and engineering is a one-term Taylor expansion.",
      ko: "테일러의 《Methodus Incrementorum》(1715)이 그의 이름이 붙은 급수를 제시했다 — '한 점 근처에서 어떤 함수를 그 접선으로, 다음엔 접 포물선으로, 이렇게 계속 바꿔라.' 물리·ML·공학의 모든 선형화는 테일러 전개의 1차 항이다.",
    },
    source: "https://en.wikipedia.org/wiki/Taylor%27s_theorem",
  },
  {
    concept: "parametrized-curve",
    year: 1748,
    who: "Leonhard Euler",
    where: "Berlin",
    oneLiner: {
      en: "Euler's *Introductio in analysin infinitorum* was the first to systematically describe a curve as a function of a single parameter (time, angle, arc length). Before this, curves were the locus of points satisfying an equation — a static, set-theoretic view. Euler made them *moving*.",
      ko: "오일러의 《Introductio in analysin infinitorum》(1748)이 곡선을 *단일 매개변수의 함수* (시간, 각도, 호의 길이) 로 체계적으로 기술한 최초의 책이다. 그 전까지 곡선은 식을 만족하는 점들의 집합 — 정적이고 집합론적인 시각. 오일러가 곡선을 *움직이게* 만들었다.",
    },
    source: "https://en.wikipedia.org/wiki/Introductio_in_analysin_infinitorum",
  },
  {
    concept: "bezout",
    year: 1779,
    who: "Étienne Bézout",
    where: "Paris",
    oneLiner: {
      en: "Bézout's *Théorie générale des équations algébriques* stated the theorem cleanly: two curves of degree d, e meet in exactly d·e points. The full modern proof (over algebraically closed fields, with multiplicity, in the projective plane) took another 100+ years.",
      ko: "베주의 《Théorie générale des équations algébriques》(1779)이 정리를 깔끔하게 진술했다 — 차수 d, e인 두 곡선은 정확히 d·e점에서 만난다. 현대적 완전 증명 (대수적 폐쇄체 위, 중복도 포함, 사영 평면에서) 은 다시 100년 이상 걸렸다.",
    },
    source: "https://en.wikipedia.org/wiki/B%C3%A9zout%27s_theorem",
  },
  {
    concept: "scalar-multiplication",
    year: 1844,
    yearLabel: { en: "1844 (Grassmann), 1853 (Hamilton)", ko: "1844 (그라스만), 1853 (해밀턴)" },
    who: "Hermann Grassmann",
    where: "Stettin (then Prussia)",
    oneLiner: {
      en: "Grassmann's *Ausdehnungslehre* introduced what we now call vectors and linear combinations. Almost no one read it for 40 years. Hamilton's quaternions (1843) and later Gibbs/Heaviside (1880s) finally pushed vector notation into physics and engineering.",
      ko: "그라스만의 《Ausdehnungslehre》(1844)가 지금 우리가 *벡터*와 *선형결합*이라 부르는 것을 도입했다. 40년 가까이 거의 아무도 읽지 않았다. 해밀턴의 사원수(1843)와 그 후 깁스·헤비사이드(1880년대)가 마침내 벡터 표기를 물리와 공학에 밀어 넣었다.",
    },
    source: "https://en.wikipedia.org/wiki/Hermann_Grassmann",
  },
  {
    concept: "gradient",
    year: 1847,
    who: "Augustin-Louis Cauchy",
    where: "Paris",
    oneLiner: {
      en: "Cauchy's *Méthode générale pour la résolution des systèmes d'équations simultanées* introduced what we now call gradient descent — 'follow the steepest slope downhill, repeat'. He was solving systems of nonlinear equations, not training neural networks; the algorithm has not changed.",
      ko: "코시의 《Méthode générale pour la résolution des systèmes d'équations simultanées》(1847)가 지금 우리가 *경사하강*이라 부르는 것을 도입했다 — '가장 가파른 내리막을 따라가라, 반복하라.' 그는 신경망 훈련이 아니라 비선형 연립방정식을 풀고 있었다. 알고리즘은 한 줄도 바뀌지 않았다.",
    },
    source: "https://en.wikipedia.org/wiki/Gradient_descent",
  },
  {
    concept: "elliptic-curve",
    year: 1985,
    yearLabel: { en: "1830s pure math · 1985 cryptography", ko: "1830년대 순수수학 · 1985년 암호" },
    who: "Niels Abel & Carl Jacobi (1830s); Neal Koblitz & Victor Miller (1985)",
    where: "Norway / Königsberg, then UC / IBM",
    oneLiner: {
      en: "Abel and Jacobi studied elliptic curves in the 1830s as inverse functions of elliptic integrals — pure mathematics with no application in sight. 150 years later, in 1985, Koblitz and Miller independently realized the chord-and-tangent group law on these curves gave a cryptographic one-way function. Bitcoin's signature scheme is a direct descendant.",
      ko: "아벨과 야코비는 1830년대에 타원곡선을 *타원적분의 역함수*로 연구했다 — 응용 없는 순수 수학. 150년 뒤인 1985년, Koblitz와 Miller가 독립적으로 *현·접선 군 법칙*이 암호학적 일방통행 함수를 준다는 걸 깨달았다. 비트코인 서명은 그 직계 후손.",
    },
    source: "https://en.wikipedia.org/wiki/Elliptic-curve_cryptography",
  },
  {
    concept: "lerp",
    year: 1962,
    who: "Pierre Bézier (Renault) & Paul de Casteljau (Citroën), independently",
    where: "Paris",
    oneLiner: {
      en: "Bézier and de Casteljau, working at rival French car companies, both invented the same recursive linear-interpolation construction to design car body curves on early CAD systems. De Casteljau's work was kept as a trade secret; Bézier published. The curves bear Bézier's name; the algorithm bears de Casteljau's.",
      ko: "베지에(르노)와 드 카스텔조(시트로엥)는 경쟁 프랑스 자동차 회사에서 일하며, 초기 CAD 시스템으로 차체 곡선을 디자인하기 위해 *같은 재귀적 선형 보간 작도*를 독립적으로 발명했다. 드 카스텔조의 작업은 영업 비밀로 묻혔고, 베지에는 출판했다. 곡선엔 베지에의 이름이, 알고리즘엔 드 카스텔조의 이름이 붙는다.",
    },
    source: "https://en.wikipedia.org/wiki/B%C3%A9zier_curve",
  },
  {
    concept: "entropy",
    year: 1948,
    who: "Claude Shannon",
    where: "Bell Labs, New Jersey",
    oneLiner: {
      en: "Shannon's *A Mathematical Theory of Communication* (1948) defined information itself, in bits, as the average number of yes/no questions needed to identify an outcome. Cryptanalysis at Bell Labs needed a quantitative answer to 'how much information is in this signal'; the answer ended up founding the entire field of information theory.",
      ko: "섀넌의 《A Mathematical Theory of Communication》(1948)이 *정보* 자체를 비트 단위로 정의했다 — 한 결과를 가리는 데 평균적으로 필요한 예/아니오 질문 수. 벨 연구소의 암호분석이 '이 신호엔 정보가 얼마나 있나'에 대한 정량적 답을 필요로 했고, 그 답이 정보이론이라는 분야 전체를 열었다.",
    },
    source: "https://en.wikipedia.org/wiki/A_Mathematical_Theory_of_Communication",
  },
  {
    concept: "softmax",
    year: 1989,
    yearLabel: {
      en: "1868 (Boltzmann) / 1989 (Bridle, ML)",
      ko: "1868 (볼츠만) / 1989 (브리들, ML)",
    },
    who: "Ludwig Boltzmann (physics) → John S. Bridle (ML)",
    where: "Vienna → RSRE Malvern, UK",
    oneLiner: {
      en: "Boltzmann (1868) wrote `e^(-E/kT) / Z` to describe the probability of a physical state at temperature T — statistical mechanics. 121 years later, Bridle (1989) repurposed exactly the same formula for neural-network output layers, calling it 'softmax' because temperature → 0 makes it a hard argmax. Same equation, two completely separate problems.",
      ko: "볼츠만(1868)은 온도 T에서 물리 상태의 확률을 `e^(-E/kT) / Z`로 적었다 — 통계역학. 121년 뒤 브리들(1989)이 정확히 같은 공식을 신경망 출력층에 갖다 썼고, 온도가 0으로 가면 hard argmax가 된다고 해서 'softmax'라 불렀다. 같은 식, 완전히 다른 두 문제.",
    },
    source: "https://en.wikipedia.org/wiki/Softmax_function",
  },
  {
    concept: "tf-idf",
    year: 1972,
    yearLabel: {
      en: "1958 TF (Luhn) · 1972 IDF (Spärck Jones)",
      ko: "1958 TF (룬) · 1972 IDF (스파크 존스)",
    },
    who: "Hans Peter Luhn (1958) → Karen Spärck Jones (1972)",
    where: "IBM Yorktown → Cambridge",
    oneLiner: {
      en: "Luhn (1958, IBM) noticed that *frequent words within a document* signal what it's about — term frequency. Fourteen years later, Spärck Jones (1972, Cambridge) added the missing half: *rare words across the corpus* are the signal — inverse document frequency. The product, TF-IDF, was the dominant search-ranking score for thirty years before BM25 and Google.",
      ko: "룬(1958, IBM)이 *문서 안의 빈출 단어*가 그 문서가 무엇에 관한 것인지 알려준다는 걸 관찰했다 — term frequency. 14년 뒤 스파크 존스(1972, 케임브리지)가 빠진 절반을 채웠다 — *코퍼스 전체에서 드문 단어*가 신호다, inverse document frequency. 그 곱 TF-IDF가 BM25와 Google 이전 30년간 검색 랭킹의 지배적 점수였다.",
    },
    source: "https://en.wikipedia.org/wiki/Tf%E2%80%93idf",
  },
];

export const provenanceByConcept: Record<string, ProvenanceEntry> = Object.fromEntries(
  provenance.map((p) => [p.concept, p]),
);
