import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { ScoreCooker } from "../components/widgets/score-cooker";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc2: string; arc3: string; arc5: string };

function Code({ html }: { html: string }) {
  return <div className="shiki-wrap" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="mt-7 font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
      <Link to="/">Lemma</Link>
      <span className="mx-2 text-rule">/</span>
      <Link to="/graph">{pick(language, "graph", "그래프")}</Link>
      <span className="mx-2 text-rule">/</span>
      <span className="uppercase tracking-[0.06em] text-ink">
        {pick(language, "ml · confidently wrong", "ML · 자신 있게 틀리기")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(
          language,
          "the hook · scores → probabilities → confidence",
          "도입 · 점수 → 확률 → 자신감",
        )}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>Why is the model so confident about a wrong answer?</>,
          <>모델은 왜 틀린 답에 그렇게 자신만만할까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            A model does not <em>know</em> it is right. It has scores.{" "}
            <Term id="softmax">Softmax</Term> turns those scores into numbers that look like
            probabilities. <Term id="cross-entropy">Cross-entropy</Term> punishes the probability
            the model gave to the correct answer. The trap is hidden in plain sight:{" "}
            <b>a bad score can still become a very confident probability</b>. That is the entire
            page. Everything else is consequence.
          </>,
          <>
            모델은 자신이 맞는지 <em>아는</em> 게 아니다. 점수들이 있을 뿐이다.{" "}
            <Term id="softmax">Softmax</Term>는 그 점수들을 확률처럼 보이는 수로 바꾸고,{" "}
            <Term id="cross-entropy">교차 엔트로피</Term>는 정답에 부여한 확률을 벌점으로 바꾼다.
            함정은 빤히 보이는 곳에 있다: <b>나쁜 점수도 아주 자신만만한 확률이 될 수 있다</b>. 이
            페이지 전체가 이것이다. 나머지는 따름정리.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            <b>Softmax does not check truth.</b> It only compares scores.
          </>,
          <>
            <b>Softmax는 진실을 확인하지 않는다.</b> 점수끼리 비교할 뿐이다.
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
      <div className="min-w-0 [&_h3]:m-0 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-[-0.01em] [&_h3]:text-ink [&_p]:m-0 [&_p]:text-[16.5px] [&_p]:text-ink-soft">
        {children}
      </div>
    </div>
  );
}

function Arc({ code }: { code: CodeMap }) {
  const { language, mode } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "the arc", "흐름")}</div>

      <ArcRow n={1}>
        <h3>{pick(language, "Scores aren't probabilities", "점수는 확률이 아니다")}</h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              The last layer of a classifier outputs three numbers — one per class. They are not
              constrained to be positive. They are not constrained to sum to anything. They are just{" "}
              <Term id="logit">logits</Term>: raw scores.{" "}
              <span className={MONO}>z = [2.0, 1.0, 0.5]</span> says only that the model "leaned"
              toward class 0 the most. It does not say "65% chance of class 0." That number doesn't
              exist yet.
            </>,
            <>
              분류기의 마지막 층은 세 개의 수를 내놓는다 — 클래스마다 하나씩. 양수일 필요도, 합이
              어떤 수여야 할 필요도 없다. 그저 <Term id="logit">로짓</Term>이다: 원시 점수.{" "}
              <span className={MONO}>z = [2.0, 1.0, 0.5]</span>는 모델이 클래스 0 쪽으로 가장 많이
              "기울었다"는 것만 말한다. "클래스 0일 확률 65%"라고 말한 적이 없다. 그 수는 아직
              존재하지 않는다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              We need a function that maps three real numbers to three positive numbers summing to
              1. Many such functions exist. The one we use is softmax — and the reason it's{" "}
              <em>that</em> one, not another, is the point of the next step.
            </>,
            <>
              세 실수를 합이 1인 양수 셋으로 보내는 함수가 필요하다. 그런 함수는 많다. 우리가 쓰는
              건 softmax — 왜 *그것*이고 다른 것이 아닌지가 다음 절의 요점이다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>
          {pick(
            language,
            "Softmax — exponentiate, then normalize",
            "Softmax — 지수 취하고, 정규화",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              Softmax is two steps. First, raise everything to <span className={MONO}>e</span>:{" "}
              <span className={MONO}>[e^2.0, e^1.0, e^0.5] ≈ [7.39, 2.72, 1.65]</span>. Now they're
              all positive. Second, divide by the sum so they sum to 1:{" "}
              <span className={MONO}>≈ [0.629, 0.231, 0.140]</span>. Done. Three numbers, all
              positive, sum to 1 — looks exactly like a probability distribution.
            </>,
            <>
              softmax는 두 단계다. 먼저 모두 <span className={MONO}>e</span>의 거듭제곱으로 올린다:{" "}
              <span className={MONO}>[e^2.0, e^1.0, e^0.5] ≈ [7.39, 2.72, 1.65]</span>. 이제 모두
              양수. 둘째, 합으로 나눠 합이 1이 되게 한다:{" "}
              <span className={MONO}>≈ [0.629, 0.231, 0.140]</span>. 끝. 세 수 모두 양수, 합 1 —
              확률 분포처럼 정확히 보인다.
            </>,
          )}
        </p>
        <p className="mb-3">
          {pick(
            language,
            <>
              The exp step is not arbitrary. It guarantees positivity (any real exponent of{" "}
              <span className={MONO}>e</span> is positive) and it makes softmax depend only on{" "}
              <em>differences</em> of logits — adding the same constant to every logit changes
              nothing. The downstream effect is profound: softmax doesn't know the absolute scale of
              your scores. It only sees who's ahead, by how much.
            </>,
            <>
              exp 단계는 임의가 아니다. 양수성을 보장하고 (<span className={MONO}>e</span>의 어떤
              실수 거듭제곱도 양수), softmax가 로짓의 *차이*에만 의존하게 만든다 — 모든 로짓에 같은
              상수를 더해도 결과는 그대로. 결과는 깊다: softmax는 점수의 절대 스케일을 모른다. 누가
              얼마나 앞섰는지만 본다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>
          {pick(
            language,
            "Cross-entropy — punish the probability you gave the correct answer",
            "교차 엔트로피 — 정답에 부여한 확률을 벌하라",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              Now there's a probability vector. Suppose the truth is class 0. The number we care
              about is <span className={MONO}>p_0</span> — what the model gave to the right answer.
              The training signal we want should be 0 when <span className={MONO}>p_0 = 1</span>{" "}
              (perfect) and large when <span className={MONO}>p_0</span> is small (confidently
              wrong). The simplest function that does this: <span className={MONO}>−log p_0</span>.
              That's <Term id="cross-entropy">cross-entropy</Term>.{" "}
              <b>
                For one correct label, cross-entropy is the negative log-likelihood of that label
              </b>{" "}
              — same number, two names from two framings (CE: truth as a distribution, one-hot here;{" "}
              <Term id="negative-log-likelihood">NLL</Term>: truth as an observation).
            </>,
            <>
              이제 확률 벡터가 있다. 정답이 클래스 0이라 하자. 우리가 신경 쓰는 건{" "}
              <span className={MONO}>p_0</span> — 모델이 정답에 부여한 수. 우리가 원하는 훈련 신호는{" "}
              <span className={MONO}>p_0 = 1</span>일 때 0 (완벽), <span className={MONO}>p_0</span>
              가 작을 때 큰 값 (자신만만하게 틀림). 가장 단순한 함수:{" "}
              <span className={MONO}>−log p_0</span>. 그게{" "}
              <Term id="cross-entropy">교차 엔트로피</Term>다.{" "}
              <b>정답이 하나인 분류에서 교차 엔트로피는 그 정답의 음의 로그우도와 같다</b> — 같은
              수, 두 이름 (CE: 진실을 분포로, 여기선 원-핫;{" "}
              <Term id="negative-log-likelihood">NLL</Term>: 진실을 관측으로 보는 관점).
            </>,
          )}
        </p>
        <p className="mb-3">
          {pick(
            language,
            <>
              Why <Term id="logarithm">log</Term>? Because independent observations multiply their
              likelihoods, and log turns multiplication into addition. The total loss across a
              dataset becomes a clean sum: <span className={MONO}>L = Σ −log p(y_i | x_i)</span>.
              That's the same identity the{" "}
              <Link
                to="/modules/log"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                logarithm module
              </Link>{" "}
              is built on.
            </>,
            <>
              왜 <Term id="logarithm">log</Term>? 독립 관측은 가능도를 곱하고, log는 곱셈을 덧셈으로
              바꾼다. 데이터셋 전체의 손실이 깔끔한 합이 된다:{" "}
              <span className={MONO}>L = Σ −log p(y_i | x_i)</span>. 이 항등식은{" "}
              <Link
                to="/modules/log"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                로그 모듈
              </Link>
              이 깔린 그 한 줄과 같은 것이다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
      </ArcRow>

      <ArcRow n={4}>
        <h3>{pick(language, "Temperature — the confidence dial", "온도 — 자신감 다이얼")}</h3>
        <p>
          {pick(
            language,
            <>
              Replace <span className={MONO}>softmax(z)</span> with{" "}
              <span className={MONO}>softmax(z/T)</span>. <Term id="temperature">Temperature</Term>{" "}
              <span className={MONO}>T &lt; 1</span> divides logits by something small, magnifying
              their differences — the winner pulls away. <span className={MONO}>T &gt; 1</span>{" "}
              shrinks differences, flattening the distribution. The widget shows it: drag T toward
              0.1 and watch one bar reach for the ceiling. <em>The winner doesn't change.</em> The
              wrongness doesn't change. Only the <em>reported confidence</em> changes — and so the
              cross-entropy loss, which depends on that confidence, changes with it.
            </>,
            <>
              <span className={MONO}>softmax(z)</span>를 <span className={MONO}>softmax(z/T)</span>
              로 바꾼다. <Term id="temperature">온도</Term> <span className={MONO}>T &lt; 1</span>은
              로짓을 작은 수로 나눠 차이를 *증폭* — 승자가 치솟는다.{" "}
              <span className={MONO}>T &gt; 1</span>은 차이를 줄여 분포를 평평하게. 위젯에서 보인다:
              T를 0.1 쪽으로 끌면 막대 하나가 천장을 향한다. <em>승자는 안 바뀐다.</em> *틀린 것*도
              안 바뀐다. *보고된 자신감*만 바뀐다 — 그 자신감에 의존하는 교차 엔트로피 손실도 함께
              바뀐다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={5}>
        <h3>
          {pick(
            language,
            "Confidence ≠ truth — the trap, made explicit",
            "자신감 ≠ 진실 — 함정, 명시적으로",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              Set logits to <span className={MONO}>[5.0, 1.0, 0.5]</span> — the model has decided
              hard for class 0. Softmax says <span className={MONO}>p ≈ [0.978, 0.018, 0.011]</span>
              : 97.8% confidence. But <em>truth is independent of this calculation</em>. If the real
              label is class 1, then <span className={MONO}>p_true = 0.018</span> and the loss is{" "}
              <span className={MONO}>−log 0.018 ≈ 4.0</span>. The model is confident <em>and</em>{" "}
              wrong. Lowering temperature makes it <em>more</em> confident, and the loss rises
              faster.
            </>,
            <>
              로짓을 <span className={MONO}>[5.0, 1.0, 0.5]</span>로 두자 — 모델은 클래스 0에 대해
              강하게 결정했다. softmax는 <span className={MONO}>p ≈ [0.978, 0.018, 0.011]</span>:
              97.8% 자신감. 그런데 <em>진실은 이 계산과 독립이다</em>. 진짜 정답이 클래스 1이면{" "}
              <span className={MONO}>p_정답 = 0.018</span>, 손실은{" "}
              <span className={MONO}>−log 0.018 ≈ 4.0</span>. 모델은 자신만만하고 <em>동시에</em>{" "}
              틀렸다. 온도를 낮추면 <em>더</em> 자신만만해지고, 손실은 더 빨리 치솟는다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              This is why "the model said 97% so it must be right" is a category error.{" "}
              <em>Looks like a probability</em> and <em>matches reality</em> are two unrelated
              claims. Aligning them is its own field — calibration — and it requires data the model
              never sees during training.
            </>,
            <>
              그래서 "모델이 97%라고 했으니 맞을 거다"는 범주 오류다. <em>확률처럼 보인다</em>와{" "}
              <em>현실과 일치한다</em>는 서로 무관한 두 주장이다. 둘을 맞추는 일은 별도 분야 —
              캘리브레이션 — 이고, 훈련 중에는 모델이 못 보는 데이터가 필요하다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc5} />}
      </ArcRow>
    </section>
  );
}

function Pin() {
  const { language } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "pin this", "핀")}</div>
      <p className="m-0 max-w-[680px] border-l-[3px] border-acc-deep pl-5 font-serif text-[22px] italic leading-[1.45] text-ink [&_b]:not-italic [&_b]:font-semibold">
        {pick(
          language,
          <>
            <b>Softmax doesn't check truth.</b> It compares scores, exponentiates, normalizes.
            Cross-entropy reads off the bar that happens to belong to the correct answer. Confidence
            and rightness are two different things; the model only computes the first.
          </>,
          <>
            <b>Softmax는 진실을 확인하지 않는다.</b> 점수를 비교하고, 지수 취하고, 정규화한다. 교차
            엔트로피는 정답이 우연히 선 자리의 막대를 읽는다. 자신감과 옳음은 다른 두 개의 것이고,
            모델은 첫 번째만 계산한다.
          </>,
        )}
      </p>
    </section>
  );
}

function Exercises() {
  return (
    <section className="mt-14">
      <div className={KICKER}>exercises · 손으로 풀기</div>

      <Exercise
        number={1}
        tag={{ en: "read the bars", ko: "막대 읽기" }}
        prompt={{
          en: (
            <>
              In the widget, set logits to <span className={MONO}>[2.0, 1.0, 0.5]</span> and lower
              the temperature from 1.0 to 0.1. Which class wins at each temperature? How does the
              winning probability change? Now raise T to 5.0 — what happens to the bars? Why does
              the <b>winner</b> never change just because of T?
            </>
          ),
          ko: (
            <>
              위젯에서 로짓을 <span className={MONO}>[2.0, 1.0, 0.5]</span>로 두고 온도를 1.0 →
              0.1로 내려라. 각 온도에서 어느 클래스가 이기나? 이긴 확률은 어떻게 변하나? 이제 T를
              5.0으로 — 막대는 어떻게 되나? 왜 T 때문에는 <b>승자</b>가 바뀌지 않을까?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              The winner is class 0 (logit 2.0) at every temperature — temperature divides every
              logit by the same positive number, so the ordering is preserved. Lower T magnifies the
              differences and the winner's probability climbs (≈ 95% at T=0.1). Higher T flattens
              everything (≈ 36/33/31% at T=5). T is a volume dial on the same song.
            </>
          ),
          ko: (
            <>
              승자는 모든 온도에서 클래스 0 (로짓 2.0) — 온도는 모든 로짓을 같은 양수로 나누므로
              순서가 보존된다. T를 낮추면 차이가 증폭되어 승자의 확률이 치솟는다 (T=0.1에서 ≈ 95%).
              T를 높이면 모두 평평해진다 (T=5에서 ≈ 36/33/31%). T는 같은 노래의 음량 다이얼.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "compute by hand · softmax", ko: "손으로 계산 · softmax" }}
        prompt={{
          en: (
            <>
              Estimate <span className={MONO}>softmax([2, 1, 0])</span> at <b>T = 1</b>. Use{" "}
              <span className={MONO}>e ≈ 2.72</span>, <span className={MONO}>e² ≈ 7.39</span>. Round
              and check the bars match.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>softmax([2, 1, 0])</span>를 <b>T = 1</b>에서 어림하라.{" "}
              <span className={MONO}>e ≈ 2.72</span>, <span className={MONO}>e² ≈ 7.39</span>를 쓰면
              된다. 어림하고 막대와 맞는지 확인.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>e² + e + 1 ≈ 7.39 + 2.72 + 1 = 11.11</span>. So{" "}
              <span className={MONO}>
                p ≈ [7.39/11.11, 2.72/11.11, 1/11.11] ≈ [0.665, 0.245, 0.090]
              </span>
              . The bars confirm it.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>e² + e + 1 ≈ 7.39 + 2.72 + 1 = 11.11</span>. 그러면{" "}
              <span className={MONO}>
                p ≈ [7.39/11.11, 2.72/11.11, 1/11.11] ≈ [0.665, 0.245, 0.090]
              </span>
              . 막대가 확인해준다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "write the loss", ko: "손실 쓰기" }}
        prompt={{
          en: (
            <>
              The loss is <span className={MONO}>−log p_true</span>. Compute it for{" "}
              <span className={MONO}>{"p_true ∈ {0.9, 0.5, 0.1, 0.01}"}</span> (natural log). What
              does the gap between <span className={MONO}>0.1</span> and{" "}
              <span className={MONO}>0.01</span> say about how cross-entropy treats{" "}
              <em>confident wrongness</em>?
            </>
          ),
          ko: (
            <>
              손실은 <span className={MONO}>−log p_정답</span>.{" "}
              <span className={MONO}>{"p_정답 ∈ {0.9, 0.5, 0.1, 0.01}"}</span>일 때를 계산 (자연
              로그). <span className={MONO}>0.1</span>과 <span className={MONO}>0.01</span> 사이의
              간격이 교차 엔트로피가 <em>자신만만한 오답</em>을 어떻게 다루는지에 대해 무엇을
              말해주나?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>−ln 0.9 ≈ 0.105</span> ·{" "}
              <span className={MONO}>−ln 0.5 ≈ 0.693</span> ·{" "}
              <span className={MONO}>−ln 0.1 ≈ 2.303</span> ·{" "}
              <span className={MONO}>−ln 0.01 ≈ 4.605</span>. Going 0.5 → 0.9 saves ~0.59. Going 0.1
              → 0.01 <b>adds</b> 2.30. The loss is asymmetric: the model is punished far more for
              being confidently wrong than rewarded for being confidently right.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>−ln 0.9 ≈ 0.105</span> ·{" "}
              <span className={MONO}>−ln 0.5 ≈ 0.693</span> ·{" "}
              <span className={MONO}>−ln 0.1 ≈ 2.303</span> ·{" "}
              <span className={MONO}>−ln 0.01 ≈ 4.605</span>. 0.5 → 0.9는 ~0.59 절감. 0.1 → 0.01은{" "}
              <b>2.30 증가</b>. 손실은 비대칭이다: 자신만만하게 틀린 것에 대한 처벌이 자신만만하게
              맞춘 것에 대한 보상보다 훨씬 크다.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "the evil one · confidence ≠ truth", ko: "사악한 것 · 자신감 ≠ 진실" }}
        prompt={{
          en: (
            <>
              A model gives the wrong class a probability of <span className={MONO}>0.99</span>,
              leaving <span className={MONO}>0.01</span> for the truth. What is the loss? Now
              imagine someone asks: "but it was 99% sure — isn't that close to right?" Write a
              one-sentence reply that distinguishes <em>looks like a probability</em> from{" "}
              <em>is actually likely</em>.
            </>
          ),
          ko: (
            <>
              모델이 틀린 클래스에 <span className={MONO}>0.99</span>를 줘서 정답에는{" "}
              <span className={MONO}>0.01</span>밖에 안 남았다. 손실은? 이제 누군가가 "근데 99%
              자신했잖아 — 거의 맞는 거 아냐?"라고 묻는다고 하자. <em>확률처럼 보인다</em>와{" "}
              <em>실제로 그럴 가능성이 높다</em>를 구분하는 한 문장 답을 써라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Loss is <span className={MONO}>−log 0.01 ≈ 4.61</span>. The reply: "Softmax produces
              numbers between 0 and 1 that sum to 1 — <b>that</b> is what makes them <em>look</em>{" "}
              like probabilities. Whether they <em>match how often the model is right</em> requires
              a separate measurement against held-out truth (calibration), which softmax neither
              performs nor promises."
            </>
          ),
          ko: (
            <>
              손실은 <span className={MONO}>−log 0.01 ≈ 4.61</span>. 답변: "Softmax는 0과 1 사이의
              수를 합 1로 만들 뿐 — <b>그게</b> 그 수가 확률처럼 <em>보이게</em> 하는 전부다. 그
              수가 <em>모델이 실제로 맞는 빈도와 일치하는지</em>는 보유된 정답에 대한 별도의 측정
              (캘리브레이션) 이 필요하고, softmax는 그 일을 하지도, 약속하지도 않는다."
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
  const visible = used ? glossary.filter((g) => used.has(g.id)) : glossary;
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

export function ConfidentWrong({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Confidently Wrong · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <ScoreCooker />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <GlossaryList />
    </TermsProvider>
  );
}
