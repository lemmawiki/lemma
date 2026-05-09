import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { ToolSpec } from "../components/meta";
import { ShannonBars } from "../components/widgets/shannon-bars";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const MONO = "font-mono text-[0.93em]";

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="mt-7 font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
      <Link to="/">Lemma</Link>
      <span className="mx-2 text-rule">/</span>
      <Link to="/graph">{pick(language, "graph", "그래프")}</Link>
      <span className="mx-2 text-rule">/</span>
      <span className="uppercase tracking-[0.06em] text-ink">
        {pick(language, "module · entropy", "모듈 · 엔트로피")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · 20 questions, with a twist", "도입 · 20 questions, 비틀어서")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>How many yes/no questions to find one item in 1,024?</>,
          <>1,024개 중 하나를 찾는 데 예/아니오 질문 몇 번이면 되는가?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            Halve the list each time and the answer is <b>10</b> —{" "}
            <Term id="logarithm">log₂(1,024)</Term>. The dictionary search from the log module, in
            new clothes. <b>But the items are not all equally likely.</b> If "the" is a thousand
            times more frequent than "antidisestablishmentarianism", asking about the rare one first
            is wasted breath. The right number of questions, on average, is no longer{" "}
            <span className={MONO}>log₂ N</span>. It is <em>entropy</em>.
          </>,
          <>
            매번 절반으로 자르면 답은 <b>10</b> — <Term id="logarithm">log₂(1,024)</Term>. 로그
            모듈의 사전 탐색이 새 옷을 입은 모습이다. <b>그런데 항목들은 같은 확률이 아니다.</b>{" "}
            "the"가 "antidisestablishmentarianism"보다 천 배 흔하다면, 드문 단어부터 묻는 건 헛
            숨이다. 평균적으로 필요한 질문 수는 더 이상 <span className={MONO}>log₂ N</span>이
            아니다. <em>엔트로피</em>다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            <b>Entropy = the average number of yes/no questions needed.</b> When everything is
            equally likely, it collapses to <span className={MONO}>log₂ N</span>. When one outcome
            dominates, it falls toward 0. Wordle, Huffman compression, password strength, decision
            trees — all are bumping against the same number.
          </>,
          <>
            <b>엔트로피 = 평균적으로 필요한 예/아니오 질문 수.</b> 모두가 같은 확률이면{" "}
            <span className={MONO}>log₂ N</span>으로 무너지고, 한 결과가 지배하면 0으로 다가간다.
            Wordle, Huffman 압축, 비밀번호 강도, 결정 트리 — 모두 같은 수에 부딪힌다.
          </>,
        )}
      </p>
    </section>
  );
}

function ArcRow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[56px_1fr] gap-5 border-t border-rule py-5 max-md:grid-cols-[36px_1fr] max-md:gap-[14px]">
      <div className="font-serif text-[38px] font-medium leading-none text-acc [font-feature-settings:'lnum'] max-md:text-[28px]">
        {n}
      </div>
      <div className="min-w-0 [&_h3]:m-0 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-[-0.01em] [&_h3]:text-ink [&_p]:m-0 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-[16.5px] [&_p]:text-ink-soft">
        {children}
      </div>
    </div>
  );
}

function Arc() {
  const { language } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "the arc", "흐름")}</div>

      <ArcRow n={1}>
        <h3>
          {pick(language, "log₂ N — the equally-likely floor", "log₂ N — 같은 확률일 때의 바닥")}
        </h3>
        <p>
          {pick(
            language,
            <>
              Start where the log module ended. With <span className={MONO}>N</span> equally-likely
              outcomes, halving the candidate set each question takes{" "}
              <span className={MONO}>log₂ N</span> questions. A standard deck:{" "}
              <span className={MONO}>log₂ 52 ≈ 5.7</span> bits — six questions identify any card.
              Two coin flips: <span className={MONO}>log₂ 4 = 2</span> bits. A 64-bit random
              integer: <em>64 bits</em>, by definition. The unit "<Term id="bit">bit</Term>" is the
              answer to one yes/no question with two equally likely outcomes — and{" "}
              <span className={MONO}>log₂ N</span> is how many such questions to specify one of N.
            </>,
            <>
              로그 모듈이 끝난 곳에서 시작한다. 같은 확률의 결과 <span className={MONO}>N</span>
              개가 있으면, 매 질문이 후보를 절반으로 자를 때 <span className={MONO}>log₂ N</span>번
              질문이면 된다. 카드 한 벌: <span className={MONO}>log₂ 52 ≈ 5.7</span> 비트 — 여섯
              질문이면 카드 식별. 동전 두 번: <span className={MONO}>log₂ 4 = 2</span> 비트. 64비트
              무작위 정수: 정의상 <em>64 비트</em>. "<Term id="bit">비트</Term>"라는 단위는 같은
              확률의 두 결과 중 하나를 가리는 예/아니오 질문 1번의 답이고,{" "}
              <span className={MONO}>log₂ N</span>은 N 중 하나를 특정하는 데 필요한 그런 질문의 수.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "Surprise, weighted", "놀람도, 가중평균")}</h3>
        <p>
          {pick(
            language,
            <>
              When outcomes have unequal probabilities, "halve the list" stops being optimal. A
              question that splits a list into 90% / 10% gives you only <em>some information</em>:
              the 90% answer barely narrowed anything. The right accounting is per-outcome:{" "}
              <Term id="surprise">surprise</Term> of an event with probability{" "}
              <span className={MONO}>p</span> is <span className={FORMULA_INLINE}>−log₂ p</span> —
              the bits revealed by learning that outcome. Common events carry low surprise; rare
              events carry high. The expected surprise is <em>entropy</em>:
            </>,
            <>
              결과들의 확률이 다를 때 "절반으로 자르기"는 더 이상 최선이 아니다. 90%/10%로 자르는
              질문은 <em>일부 정보</em>만 준다 — 90%가 답인 경우에는 거의 좁혀지지 않으니까. 회계는
              결과 단위로 한다: 확률 <span className={MONO}>p</span>인 사건의{" "}
              <Term id="surprise">놀람도</Term>는 <span className={FORMULA_INLINE}>−log₂ p</span> —
              그 결과를 알게 됐을 때 얻는 비트 수. 흔한 사건은 작은 놀람도, 드문 사건은 큰 놀람도.
              그 놀람도의 기대값이 <em>엔트로피</em>:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`H(X) = −Σ p_i log₂ p_i  =  Σ p_i · (−log₂ p_i)
                              ↑
                   probability × surprise, summed`}
        </pre>
        <p>
          {pick(
            language,
            <>
              Two anchors. <b>Uniform p = 1/N for every i</b>:{" "}
              <span className={MONO}>H = log₂ N</span> — the equally-likely floor from arc 1, now
              recovered as the <em>maximum</em>. <b>Spike p = 1 on one outcome, 0 elsewhere</b>:{" "}
              <span className={MONO}>H = 0</span> — no questions, no information, no uncertainty.
              Every distribution sits between those two and the widget above lets you slide along
              that line.
            </>,
            <>
              두 닻점. <b>균등 p = 1/N</b>이면 <span className={MONO}>H = log₂ N</span> — § 1의
              "같은 확률 바닥"이 이제 <em>최대값</em>으로 다시 잡힌다. <b>집중 p = 1</b> (한 결과에
              확률 1, 나머지 0)이면 <span className={MONO}>H = 0</span> — 질문도, 정보도, 불확실성도
              없다. 모든 분포는 그 사이에 있고, 위 위젯이 그 선 위를 미끄러지게 해준다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={3}>
        <h3>
          {pick(
            language,
            "Why the average matters — Shannon's bound",
            "평균이 왜 중요한가 — 섀넌 한계",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              In 1948 Shannon proved that no code can compress a stream of symbols below{" "}
              <span className={MONO}>H(X)</span> bits per symbol on average — the{" "}
              <Term id="shannon-bound">Shannon bound</Term>. English text has per-character entropy
              around 1.0–1.5 bits (down from the naive log₂ 26 ≈ 4.7) because letters are not
              independent and are not equally likely; that gap is exactly the room compression has
              to work in. zip and gzip live there. The bound is tight in two senses: <em>no</em>{" "}
              code can beat it, and <em>some</em> codes (Huffman within 1 bit, arithmetic
              arbitrarily close) hit it. Entropy is not a measurement people invented — it is the
              floor everyone independently reinvented hitting.
            </>,
            <>
              1948년 섀넌은 어떤 부호도 심볼당 평균 <span className={MONO}>H(X)</span> 비트보다{" "}
              <em>적게</em> 압축할 수 없음을 증명했다 — <Term id="shannon-bound">섀넌 한계</Term>.
              영문 텍스트의 글자당 엔트로피는 약 1.0–1.5 비트 (순진하게 log₂ 26 ≈ 4.7에서 한참 낮은)
              — 글자가 서로 독립이 아니고 확률도 같지 않아서다. 그 간격이 바로 압축이 일할 여지.
              zip과 gzip이 그 안에 산다. 한계는 두 의미에서 빡빡하다: 어떤 부호도 깰 수{" "}
              <em>없고</em>, 일부 부호는 (Huffman은 1 비트 안, 산술 부호는 임의로 가까이) 그것에{" "}
              <em>도달한다</em>. 엔트로피는 사람이 발명한 측정이 아니라, 모두가 독립적으로 다시
              발명하며 부딪힌 바닥이다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={4}>
        <h3>
          {pick(
            language,
            "Information gain — Wordle's optimal first guess",
            "정보 이득 — Wordle 최적의 첫 추측",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              Wordle: pick a 5-letter guess; the game returns one of{" "}
              <span className={MONO}>3⁵</span> feedback patterns (each tile gray/yellow/green); each
              pattern partitions the remaining candidate words. A guess gives you{" "}
              <span className={FORMULA_INLINE}>IG = H(words) − E[H(words | feedback)]</span> bits of{" "}
              <Term id="information-gain">information gain</Term> on average. Maximizing IG is what
              every Wordle solver, ever, does — though most do it by intuition. The numerical winner
              over the official ~2,300-word answer list is <em>SALET</em> (an old word for a helmet)
              at ≈ 5.88 bits, beating CRANE (5.79) and ADIEU (5.49). The "obvious" answer (vowels)
              loses to "split letters across feedback patterns evenly", which is exactly
              maximum-entropy behavior on the feedback distribution.
            </>,
            <>
              Wordle: 5글자 추측을 던지면 게임이 <span className={MONO}>3⁵</span> 가지 피드백 패턴
              (각 타일 회색/노랑/초록) 중 하나를 돌려준다. 각 패턴은 남은 후보 단어를 분할한다. 추측
              한 번이 평균적으로{" "}
              <span className={FORMULA_INLINE}>IG = H(단어) − E[H(단어 | 피드백)]</span> 비트의{" "}
              <Term id="information-gain">정보 이득</Term>을 준다. IG 최대화 — Wordle 풀이 모두가
              직관적으로든 명시적으로든 *그 일*을 한다. 공식 정답 ~2,300단어에 대한 수치 승자는{" "}
              <em>SALET</em> (투구를 뜻하는 옛 단어), 약 5.88 비트로 CRANE (5.79)과 ADIEU (5.49)를
              이긴다. "모음 많이"라는 직관은 "글자가 피드백 패턴들에 고르게 흩어지게"에 진다 —
              후자가 정확히 피드백 분포의 *최대 엔트로피* 행동이다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Same machinery underlies decision-tree splits in machine learning ("which feature
              partitions labels into the most uncertainty-reducing groups?"), 20 Questions strategy
              ("ask the question with the highest expected information gain"), and the
              binary-search-vs-fingerprint-lookup contrast in algorithms.
            </>,
            <>
              같은 기계가 머신러닝의 결정 트리 분할 ("어떤 특성이 레이블을 가장 불확실성-감소시키는
              그룹으로 나누는가?"), 20 questions 전략 ("기대 정보 이득이 가장 큰 질문을 물어라"),
              그리고 알고리즘의 이진 탐색 vs 지문 조회 대비 — 모두 떠받친다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={5}>
        <h3>{pick(language, "Where this module flows next", "이 모듈이 흘러갈 곳")}</h3>
        <p>
          {pick(
            language,
            <>
              The same definition reappears under new names.{" "}
              <Term id="cross-entropy">Cross-entropy</Term> (the loss at the heart of{" "}
              <Link to="/ml/confident-wrong">classification</Link>) is <em>your</em> entropy plus a
              penalty when your model's predicted distribution differs from the truth. KL
              divergence, mutual information, perplexity in language models — all consume this
              module. Password strength is just <span className={MONO}>log₂</span> of the keyspace
              under the assumption of a uniform attacker, which is the special case of arc 1. Every
              time someone says "this carries more information" or "that's redundant", they are
              gesturing at a number this module makes precise.
            </>,
            <>
              같은 정의가 새 이름으로 다시 나타난다. <Term id="cross-entropy">교차 엔트로피</Term> (
              <Link to="/ml/confident-wrong">분류</Link>의 핵심 손실)는 *너의* 엔트로피에 모델
              분포가 진실과 다를 때의 벌점을 더한 것. KL 발산, 상호정보량, 언어 모델의 perplexity —
              모두 이 모듈을 소비한다. 비밀번호 강도는 균등 공격자 가정 아래 키 공간의{" "}
              <span className={MONO}>log₂</span> — § 1의 특수 케이스. "이건 정보가 많다", "저건
              중복이다"라고 말할 때마다, 사람들은 이 모듈이 정확히 만든 그 수를 가리키고 있다.
            </>,
          )}
        </p>
      </ArcRow>

      <div className="mt-[22px] rounded-r-md border-l-4 border-acc bg-acc-soft px-[22px] py-[18px] text-base leading-[1.55] text-acc-deep">
        {pick(
          language,
          <>
            <b>H = −Σ p log₂ p.</b> Probability times surprise, summed. Equals{" "}
            <span className={MONO}>log₂ N</span> when uniform, falls to 0 when one outcome wins
            outright. Everything else — the Shannon bound, Wordle's first guess, password strength,
            cross-entropy loss — is a corollary.
          </>,
          <>
            <b>H = −Σ p log₂ p.</b> 확률 곱하기 놀람도의 합. 균등이면{" "}
            <span className={MONO}>log₂ N</span>, 한 결과가 압도하면 0. 나머지 — 섀넌 한계, Wordle
            첫 추측, 비밀번호 강도, 교차 엔트로피 손실 — 는 따름정리.
          </>,
        )}
      </div>
    </section>
  );
}

function Exercises() {
  return (
    <section className="mt-14">
      <div className={KICKER}>exercises · 손으로 풀기</div>

      <Exercise
        number={1}
        tag={{ en: "read the widget · the uniform max", ko: "위젯 읽기 · 균등 최대" }}
        prompt={{
          en: (
            <>
              On the Shannon Bars widget, click the <b>uniform</b> preset. What is H? Now click{" "}
              <b>spike</b>: estimate H without computing — is it above or below 1 bit?
            </>
          ),
          ko: (
            <>
              위젯에서 <b>균등</b>을 누르자. H는 얼마인가? 이제 <b>집중</b>을 누르자: 계산하지 말고
              어림하라 — H는 1 비트보다 위인가, 아래인가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Uniform: <b>H = 2 bits</b> = log₂(4). Spike (raw [10, 1, 1, 1]): the dominant outcome
              has p ≈ 0.77 with surprise ≈ 0.38 bits; the three minorities have p ≈ 0.077 with
              surprise ≈ 3.7 bits each. Weighted: H ≈ 0.77·0.38 + 3·(0.077·3.7) ≈ <b>1.16 bits</b> —
              just above 1. The intuition "spike means low entropy" is directionally right; the
              actual number is higher than people guess because the rare outcomes still carry
              weight.
            </>
          ),
          ko: (
            <>
              균등: <b>H = 2 비트</b> = log₂(4). 집중 (raw [10, 1, 1, 1]): 지배 결과는 p ≈ 0.77,
              놀람도 ≈ 0.38 비트; 소수 셋은 각각 p ≈ 0.077, 놀람도 ≈ 3.7 비트. 가중평균: H ≈
              0.77·0.38 + 3·(0.077·3.7) ≈ <b>1.16 비트</b> — 1보다 약간 위. "집중 = 낮은 엔트로피"
              직관은 방향은 맞다. 실제 수는 사람들이 추측하는 것보다 더 큰데, 드문 결과들이 여전히
              가중치를 가지기 때문.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{
          en: "compute by hand · uniform N",
          ko: "손으로 계산 · 균등 N",
        }}
        prompt={{
          en: (
            <>
              Compute H for uniform distributions over <b>N = 2, 4, 8, 16</b>. State the pattern.
            </>
          ),
          ko: (
            <>
              <b>N = 2, 4, 8, 16</b>에 대한 균등 분포의 H를 계산하라. 패턴은?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              For uniform: H = log₂(N). N=2 → 1, N=4 → 2, N=8 → 3, N=16 → 4. Each doubling of N adds
              exactly one bit. The unit of entropy is the bit because <em>H</em> counts
              binary-decision equivalents.
            </>
          ),
          ko: (
            <>
              균등: H = log₂(N). N=2 → 1, N=4 → 2, N=8 → 3, N=16 → 4. N이 두 배가 되면 정확히 1
              비트가 더해진다. 엔트로피의 단위가 비트인 건 <em>H</em>가 이진 결정 등가 횟수를 세기
              때문.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{
          en: "write the equation · 1/2, 1/4, 1/8, 1/8",
          ko: "식 세우기 · 1/2, 1/4, 1/8, 1/8",
        }}
        prompt={{
          en: (
            <>
              Compute H for <span className={MONO}>p = (1/2, 1/4, 1/8, 1/8)</span>. Compare to the
              uniform-4 case.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>p = (1/2, 1/4, 1/8, 1/8)</span>의 H를 계산하라. 균등 4와
              비교하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              H = (1/2)·1 + (1/4)·2 + (1/8)·3 + (1/8)·3 = 1/2 + 1/2 + 3/8 + 3/8 = <b>1.75 bits</b>.
              Uniform-4 is 2.0 bits. The non-uniform distribution carries less information per
              symbol, which means a code can spend fewer than 2 bits per symbol on average. Huffman
              spends exactly {`{1, 2, 3, 3}`} bits on these — hitting the bound exactly.
            </>
          ),
          ko: (
            <>
              H = (1/2)·1 + (1/4)·2 + (1/8)·3 + (1/8)·3 = 1/2 + 1/2 + 3/8 + 3/8 = <b>1.75 비트</b>.
              균등 4는 2.0 비트. 비균등 분포는 심볼당 정보가 더 적고, 따라서 부호는 평균 2 비트
              미만으로도 충분하다. 이 분포에서 Huffman은 정확히 {`{1, 2, 3, 3}`} 비트를 쓴다 —
              한계에 정확히 닿는다.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{
          en: "Wordle · why splits matter",
          ko: "Wordle · 왜 분할이 중요한가",
        }}
        prompt={{
          en: (
            <>
              You guess CRANE; against a 2,300-word answer list it produces 200 distinct feedback
              patterns and partitions the candidates accordingly. The largest partition has 168
              words; the average IG is 5.79 bits. SALET produces 205 patterns, largest 119, IG 5.88.
              Even though both reduce uncertainty by ≈ log₂ 2300 = 11.2 bits, why is SALET "better"?
              Answer in one sentence about the worst case.
            </>
          ),
          ko: (
            <>
              CRANE을 추측하면 2,300단어 정답 목록에 대해 200개의 서로 다른 피드백 패턴이 나오고
              후보가 그렇게 분할된다. 가장 큰 패턴에 168 단어, 평균 IG는 5.79 비트. SALET은 205
              패턴, 가장 큰 패턴 119, IG 5.88. 둘 다 log₂ 2300 = 11.2 비트의 불확실성을 줄이는데, 왜
              SALET이 "더 낫다"고 하는가? 최악의 경우에 대해 한 문장으로 답하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              SALET's worst-case partition (119 words remaining, log₂ 119 ≈ 6.9 bits left) is
              smaller than CRANE's (168 words, log₂ 168 ≈ 7.4 bits) — even when the unlucky feedback
              pattern hits, you have a better second move. Average IG and worst-case partition size
              are <em>different</em> objectives that usually agree but not always; choose the one
              your problem cares about.
            </>
          ),
          ko: (
            <>
              SALET의 최악 분할 (119단어 남음, log₂ 119 ≈ 6.9 비트 남음)이 CRANE의 (168단어, log₂
              168 ≈ 7.4 비트)보다 작다 — 운 나쁜 피드백이 나와도 둘째 수가 더 낫다. 평균 IG와 최악
              분할 크기는 <em>다른</em> 목적함수다. 보통은 일치하지만 항상은 아니니, 네 문제가 신경
              쓰는 쪽을 골라라.
            </>
          ),
        }}
      />

      <Exercise
        number={5}
        noCalculator
        tag={{ en: "the evil one · 'uniform = lowest entropy'", ko: "악마의 문제 · '균등이 최저'" }}
        prompt={{
          en: (
            <>
              A junior says: "uniform distribution has minimum entropy because it's the most boring
              — every outcome the same." Refute in one sentence. State the actual minimum.
            </>
          ),
          ko: (
            <>
              주니어가 말한다: "균등 분포는 엔트로피가 최저다. 가장 지루하니까 — 모든 결과가 같다."
              한 문장으로 반박하고, 실제 최저값을 말하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Uniform is <em>maximum</em>, not minimum: every yes/no question has equal information
              in either direction, so it takes the most questions on average. The minimum is{" "}
              <b>H = 0</b>, achieved when one outcome has probability 1 and all others 0 — there is
              nothing to ask about, so zero questions are needed.
            </>
          ),
          ko: (
            <>
              균등은 <em>최대</em>지 최저가 아니다: 어느 예/아니오 질문이든 양쪽으로 같은 정보를
              가져서, 평균 질문 수가 *가장 많다*. 최저는 <b>H = 0</b>, 한 결과가 확률 1이고 나머지가
              0일 때 — 물을 게 없으니 질문 0번이면 충분.
            </>
          ),
        }}
      />

      <Exercise
        number={6}
        tag={{ en: "passwords · NIST entropy", ko: "비밀번호 · NIST 엔트로피" }}
        prompt={{
          en: (
            <>
              Two passwords. (a) 8 random characters from {`{a–z, A–Z, 0–9}`} = 62 symbols. (b) 6
              random English words from a dictionary of 7,776 (the Diceware list). Which has higher
              entropy? Use <span className={MONO}>log₂ 62 ≈ 5.95</span>,{" "}
              <span className={MONO}>log₂ 7776 ≈ 12.92</span>.
            </>
          ),
          ko: (
            <>
              두 비밀번호. (a) {`{a–z, A–Z, 0–9}`} 62개 문자에서 8자 무작위. (b) Diceware 목록 7,776
              단어에서 영문 단어 6개 무작위. 어느 쪽이 엔트로피가 더 큰가?{" "}
              <span className={MONO}>log₂ 62 ≈ 5.95</span>,{" "}
              <span className={MONO}>log₂ 7776 ≈ 12.92</span> 사용.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              (a) 8 × 5.95 ≈ <b>47.6 bits</b>. (b) 6 × 12.92 ≈ <b>77.5 bits</b>. The passphrase wins
              by a factor of <span className={MONO}>2³⁰</span> in attacker work, and is famously
              easier to remember. xkcd 936's "correct horse battery staple" rests on this
              calculation.
            </>
          ),
          ko: (
            <>
              (a) 8 × 5.95 ≈ <b>47.6 비트</b>. (b) 6 × 12.92 ≈ <b>77.5 비트</b>. 패스프레이즈가
              공격자 작업량에서 <span className={MONO}>2³⁰</span> 배 차이로 이긴다 — 게다가 외우기
              훨씬 쉽다. xkcd 936의 "correct horse battery staple"이 이 계산 위에 있다.
            </>
          ),
        }}
      />
    </section>
  );
}

function GlossaryList() {
  const { language } = useApp();
  const registry = useTermsRegistry();
  const used = registry?.used;
  const visible = used ? glossary.filter((g) => used.has(g.id)) : [];
  if (visible.length === 0) return null;
  return (
    <section className="mt-14">
      <div className={KICKER}>
        {pick(
          language,
          `glossary · used on this page · ${visible.length}`,
          `용어집 · 이 페이지에서 쓰임 · ${visible.length}`,
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
        {visible.map((g) => {
          const en = g.locales.en;
          const ko = g.locales.ko;
          const view = g.locales[language] ?? en;
          return (
            <div
              key={g.id}
              className="rounded-md border border-rule bg-bg-card px-4 py-3.5 text-[14.5px] leading-[1.5]"
            >
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="font-serif text-base font-semibold text-ink">
                  {en?.term ?? g.id}
                </span>
                <span className="text-ink-mute">·</span>
                <span className="font-sans text-[15px] font-medium text-acc">
                  {ko?.term ?? g.id}
                </span>
              </div>
              <div className="text-ink-soft">{view?.body}</div>
              {view?.flag && (
                <div className="mt-2 border-t border-dashed border-rule pt-2 text-[13px] text-acc-deep">
                  ⚠ {view.flag}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PageFooter() {
  const { language } = useApp();
  return (
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-[18px] font-mono text-xs text-ink-mute [&_b]:font-semibold [&_b]:text-ink">
      <div>
        {pick(
          language,
          <>
            module: <b>Entropy</b>. Built on <Link to="/modules/log">the logarithm</Link>. Currently
            consumed by no application page on its own (<em>cross-entropy</em> already lives inside{" "}
            <Link to="/ml/confident-wrong">Confidently Wrong</Link>); the planned consumers are{" "}
            <em>Wordle</em>, <em>JPEG</em>, and <em>password strength</em>.
          </>,
          <>
            모듈: <b>엔트로피</b>. <Link to="/modules/log">로그</Link> 위에 서 있다. 현재는 단독
            소비 응용이 없다 (<em>교차 엔트로피</em>는 이미{" "}
            <Link to="/ml/confident-wrong">자신 있게 틀리기</Link> 안에 산다). 예정된 소비자:{" "}
            <em>Wordle</em>, <em>JPEG</em>, <em>비밀번호 강도</em>.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function Entropy() {
  useEffect(() => {
    document.title = "Entropy · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <ToolSpec
        definition={{
          en: (
            <>
              <span className={MONO}>H(X) = −Σ pᵢ log₂ pᵢ</span>. The expected number of yes/no
              questions, on average, to identify which outcome of <span className={MONO}>X</span>{" "}
              occurred. Reduces to <span className={MONO}>log₂ N</span> when the N outcomes are
              equally likely (maximum); collapses to 0 when one outcome has probability 1 (minimum).
            </>
          ),
          ko: (
            <>
              <span className={MONO}>H(X) = −Σ pᵢ log₂ pᵢ</span>. <span className={MONO}>X</span>의
              어느 결과가 일어났는지 가리는 데 평균적으로 필요한 예/아니오 질문 수. N개 결과가 모두
              같은 확률이면 <span className={MONO}>log₂ N</span> (최대)으로 무너지고, 한 결과가 확률
              1이면 0 (최소)으로 무너진다.
            </>
          ),
        }}
        appliesWhen={{
          en: (
            <>
              Uncertainty has structure: Wordle (information gain per guess), Huffman / arithmetic
              compression (the Shannon bound), password strength (NIST entropy), decision-tree
              splits (information-gain criterion), language-model perplexity (
              <span className={MONO}>2^H</span>), KL divergence and mutual information.
            </>
          ),
          ko: (
            <>
              불확실성에 구조가 있을 때: Wordle (추측당 정보 이득), Huffman/산술 압축 (섀넌 한계),
              비밀번호 강도 (NIST 엔트로피), 결정 트리 분할 (정보 이득 기준), 언어모델 perplexity (
              <span className={MONO}>2^H</span>), KL 발산과 상호정보량.
            </>
          ),
        }}
        breaksWhen={{
          en: (
            <>
              You don't actually know <span className={MONO}>p</span> — entropy is defined on a
              distribution, and estimating one from a sample is its own problem. Continuous
              distributions need <em>differential entropy</em> (different sign behavior, not
              non-negative). Entropy uses only the marginal <span className={MONO}>p</span>;
              identical marginals can hide very different joint structure (mutual information, not
              entropy, captures that).
            </>
          ),
          ko: (
            <>
              사실 <span className={MONO}>p</span>를 모른다 — 엔트로피는 *분포* 위에 정의되며,
              표본에서 분포를 추정하는 일은 그 자체로 별도 문제. 연속 분포는 <em>미분 엔트로피</em>
              가 필요하다 (부호 양상이 다르고, 음수가 될 수 있다). 엔트로피는 주변 확률{" "}
              <span className={MONO}>p</span>만 본다 — 주변이 같아도 결합 구조가 매우 다를 수 있다
              (그건 엔트로피가 아니라 상호정보량이 잡는다).
            </>
          ),
        }}
      />
      <ShannonBars />
      <Arc />
      <Exercises />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
