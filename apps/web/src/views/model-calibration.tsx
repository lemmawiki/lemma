import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { Counterexample, WhyNotTaught } from "../components/meta";
import { ReliabilityDiagram } from "../components/widgets/reliability-diagram";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc2: string; arc3: string; arc4: string; arc5: string };

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
        {pick(language, "ml · model calibration", "ML · 모델 캘리브레이션")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · confidence vs. frequency", "도입 · 신뢰도 대 빈도")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(language, <>Can you trust 70%?</>, <>70%를 믿어도 될까?</>)}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            A model says "70% confident." Does that mean, across many such predictions,{" "}
            <em>seven in ten</em> turn out right? Sometimes. Often not. The number on the screen and
            the long-run frequency are <em>two different quantities</em>; their alignment is called{" "}
            <Term id="calibration">calibration</Term>, and most modern neural networks fail it on
            their first try. The fix is one scalar — the same{" "}
            <Term id="temperature">temperature</Term> dial that confident-wrong introduced — fit
            against held-out truth.
          </>,
          <>
            모델이 "70% 확신"이라고 말한다. 그 말은 그런 예측을 많이 모았을 때 <em>열에 일곱</em>이
            맞는다는 뜻일까? 가끔은 맞다. 자주는 아니다. 화면 위의 수와 장기적 빈도는{" "}
            <em>다른 두 양</em>이고, 그 둘을 맞추는 일을 <Term id="calibration">캘리브레이션</Term>
            이라 부른다. 현대의 신경망은 첫 시도에서 거의 실패한다. 처방은 단 하나의 스칼라 —
            confident-wrong에서 등장한 그 <Term id="temperature">온도</Term> 다이얼 — 이고, 보유된
            정답에 맞춰 조정한다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            <b>Confidence is a number. Truth is a frequency. Calibration is the gap.</b>
          </>,
          <>
            <b>신뢰도는 수다. 진실은 빈도다. 캘리브레이션은 그 사이의 격차다.</b>
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
        <h3>{pick(language, "The promise of probability", "확률이 약속하는 것")}</h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              When a model emits the number <span className={MONO}>0.7</span> for a class, what
              should that number <em>mean</em>? The honest contract is the long-run one: across many
              examples that the model labeled "70%," the truth lights up about{" "}
              <span className={MONO}>70%</span> of the time. That contract is not enforced by{" "}
              <Term id="softmax">softmax</Term>, by <Term id="cross-entropy">cross-entropy</Term>,
              or by training. Training rewards low loss on the data it sees; the alignment between
              probability and frequency is a <em>separate</em> property the model picks up — or
              fails to — as a side effect.
            </>,
            <>
              모델이 어떤 클래스에 대해 <span className={MONO}>0.7</span>이라는 수를 내뱉을 때, 그
              수의 <em>의미</em>는 뭐여야 할까? 정직한 계약은 장기 빈도다: 모델이 "70%"라고 라벨한
              많은 예제들 중 실제 정답이 약 <span className={MONO}>70%</span> 비율로 들어온다는 것.
              이 계약은 <Term id="softmax">softmax</Term>가 강제하지 않는다.{" "}
              <Term id="cross-entropy">교차 엔트로피</Term>도, 훈련 자체도 강제하지 않는다. 훈련은
              본 데이터에서 손실이 낮은 것에만 보상을 준다. 확률과 빈도의 정렬은 모델이 부수적으로
              얻거나 — 못 얻는 — <em>별개의</em> 성질이다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Confident-wrong showed why softmax produces something that <em>looks</em> like a
              probability. This page asks the next question:{" "}
              <em>does it mean what it looks like?</em>
            </>,
            <>
              confident-wrong은 softmax가 왜 확률처럼 <em>보이는</em> 것을 만드는지 보여주었다. 이
              페이지의 질문은 그다음이다: <em>보이는 대로의 의미를 갖고 있는가?</em>
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "The reliability diagram", "신뢰도 다이어그램")}</h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              The standard way to <em>see</em> calibration: bin predictions by their stated
              probability — say ten bins of width <span className={MONO}>0.1</span>. For each bin,
              plot two numbers. On the x-axis, the bin's <em>mean predicted probability</em>. On the
              y-axis, the <em>fraction that turned out correct</em>. Perfect calibration is the
              diagonal <span className={MONO}>y = x</span>. The widget above is exactly this plot,
              for a synthetic model with a tunable miscalibration.
            </>,
            <>
              캘리브레이션을 <em>눈으로</em> 보는 표준 방법: 예측을 신뢰도 구간별로 묶는다 — 가령 폭{" "}
              <span className={MONO}>0.1</span>의 구간 열 개. 각 구간마다 두 수를 찍는다. x축에는{" "}
              <em>평균 예측 확률</em>, y축에는 <em>실제로 맞춘 비율</em>. 완벽한 캘리브레이션은
              대각선 <span className={MONO}>y = x</span>. 위 위젯이 정확히 이 그림이고, 미스캘리
              정도를 조절할 수 있는 합성 모델로 만들어졌다.
            </>,
          )}
        </p>
        <p className="mb-3">
          {pick(
            language,
            <>
              Bars sagging <em>below</em> the diagonal — model says{" "}
              <span className={MONO}>0.9</span>, gets <span className={MONO}>0.78</span> right — are
              the signature of <em>overconfidence</em>. Bars rising <em>above</em> mean the model is
              too humble: it says <span className={MONO}>0.6</span> but is actually right{" "}
              <span className={MONO}>0.8</span> of the time. The vertical gap at each bin, weighted
              by how many predictions land there, sums to a single number — the{" "}
              <em>expected calibration error</em>, ECE.
            </>,
            <>
              막대가 대각선 <em>아래</em>로 처지면 — 모델은 <span className={MONO}>0.9</span>
              라지만 실제로는 <span className={MONO}>0.78</span>만 맞다 — <em>과신</em>의 서명이다.
              막대가 <em>위</em>로 솟으면 모델이 너무 겸손한 것: <span className={MONO}>0.6</span>
              이라고 말하지만 실제로는 <span className={MONO}>0.8</span>이 맞는다. 각 구간의 수직
              간격을 그 구간의 예측 개수로 가중평균하면 단일 수가 나온다 —{" "}
              <em>기대 캘리브레이션 오차</em>, ECE.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>
          {pick(
            language,
            "Real models are overconfident — predictably",
            "실제 모델은 — 예측 가능하게 — 과신한다",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              An empirical pattern reported across image classifiers, language models, and tabular
              networks alike: the bars sit <em>below</em> the diagonal, and the gap is widest in the
              high-confidence tail. Models that say "very sure" are wrong more often than the number
              admits; models that say "uncertain" are roughly honest. The shape, drawn over the
              diagonal, looks like a sigmoid that has been slightly <em>squashed</em> toward 0.5.
              That's not a coincidence — it's what you get if the true posterior is the model's
              stated probability run through <span className={MONO}>σ(logit(p)/T)</span> with{" "}
              <span className={MONO}>T &lt; 1</span>.
            </>,
            <>
              이미지 분류기, 언어 모델, 표 형식 신경망 모두에서 관측된 경험적 패턴: 막대가 대각선{" "}
              <em>아래</em>에 있고, 그 격차는 높은 신뢰도 쪽에서 가장 크다. "아주 확신한다"는 모델은
              그 수가 인정하는 것보다 자주 틀리고, "잘 모르겠다"는 모델은 대체로 정직하다. 대각선
              위에 그려진 모양은 0.5 쪽으로 살짝 <em>눌린</em> 시그모이드다. 이건 우연이 아니다 —
              진짜 사후확률이 모델이 말하는 확률을 <span className={MONO}>σ(logit(p)/T)</span>(
              <span className={MONO}>T &lt; 1</span>) 에 통과시킨 결과라면 정확히 이 모양이 된다.
            </>,
          )}
        </p>
        <p className="mb-3">
          {pick(
            language,
            <>
              In the widget, drag <span className={MONO}>T</span> to{" "}
              <span className={MONO}>0.55</span> (the "overconfident" preset). The bars in the right
              tail sag dramatically — the
              <span className={MONO}>0.9</span> bin lands near <span className={MONO}>0.78</span>.
              ECE jumps. Drag to <span className={MONO}>1.55</span> and the curve flips above the
              diagonal: <em>underconfident</em>, the bin labeled <span className={MONO}>0.6</span>{" "}
              lands near <span className={MONO}>0.7</span>.
            </>,
            <>
              위젯에서 <span className={MONO}>T</span>를 <span className={MONO}>0.55</span>("과신"
              프리셋) 로 끌어보자. 오른쪽 꼬리 쪽 막대들이 극적으로 처진다 —{" "}
              <span className={MONO}>0.9</span> 구간이 <span className={MONO}>0.78</span> 근처로
              떨어진다. ECE가 치솟는다. <span className={MONO}>1.55</span>로 끌면 곡선이 대각선 위로
              뒤집힌다: <em>과소확신</em>, <span className={MONO}>0.6</span>이라 라벨된 구간이{" "}
              <span className={MONO}>0.7</span> 근처에 떨어진다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
      </ArcRow>

      <ArcRow n={4}>
        <h3>
          {pick(
            language,
            "Linearize at one bin — the local fix",
            "한 구간에서 선형화 — 국소적 처방",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              Click any bar in the widget. The brown line that appears is the{" "}
              <Term id="tangent">tangent</Term> to the calibration curve at that bin's center — the
              page-three trick from the{" "}
              <Link
                to="/modules/linearization"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                linearization module
              </Link>
              , reused here. Locally, the curve looks like a line with slope{" "}
              <span className={MONO}>m</span> and offset <span className={MONO}>c</span>:{" "}
              <span className={MONO}>actual(p) ≈ m·p + c</span>. Two numbers. The reliability bar
              and the diagonal differ by <span className={MONO}>(m − 1)·p + c</span> in this
              neighborhood — a quantity you can read off the slope and the intercept of one tangent
              line.
            </>,
            <>
              위젯의 막대를 클릭해보자. 등장하는 갈색 선은 그 구간 중심에서 캘리브레이션 곡선의{" "}
              <Term id="tangent">접선</Term> —{" "}
              <Link
                to="/modules/linearization"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                선형화 모듈
              </Link>
              의 그 트릭, 여기서 재사용. 국소적으로, 곡선은 기울기 <span className={MONO}>m</span>과
              절편 <span className={MONO}>c</span>의 직선처럼 생겼다:{" "}
              <span className={MONO}>actual(p) ≈ m·p + c</span>. 두 수. 이 동네에서 막대와 대각선의
              차이는 <span className={MONO}>(m − 1)·p + c</span> — 한 접선의 기울기와 절편에서 읽을
              수 있는 양이다.
            </>,
          )}
        </p>
        <p className="mb-3">
          {pick(
            language,
            <>
              Why does this matter? Because it tells you what kind of fix is needed. Slope{" "}
              <span className={MONO}>≈ 1</span> means "the curve is parallel to the diagonal here,
              just shifted" — a constant additive correction works. Slope{" "}
              <span className={MONO}>≠ 1</span> means the gap <em>changes</em> with confidence — and
              the right correction must <em>rotate</em> the curve toward the diagonal, not just
              shift it. That rotation is exactly what one parameter — temperature — buys you,
              globally.
            </>,
            <>
              이게 왜 중요한가? 어떤 종류의 처방이 필요한지를 말해주기 때문이다. 기울기{" "}
              <span className={MONO}>≈ 1</span>이면 "여기서 곡선은 대각선과 평행하고 그저 평행 이동"
              — 상수 보정으로 충분하다. 기울기 <span className={MONO}>≠ 1</span>이면 격차가 신뢰도에
              따라 <em>달라진다</em> — 올바른 보정은 곡선을 단지 옮기는 게 아니라 대각선 쪽으로{" "}
              <em>회전</em>시켜야 한다. 그 회전이야말로 단 하나의 매개변수 — 온도 — 가 전역적으로
              사주는 일이다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>
          {pick(
            language,
            "Temperature scaling — one scalar, post-hoc",
            "온도 스케일링 — 사후, 단 하나의 스칼라",
          )}
        </h3>
        <p className="mb-3">
          {pick(
            language,
            <>
              The recipe: take the trained model. Don't retrain. Don't change architecture. Take the
              raw <Term id="logit">logits</Term> on a held-out validation set, add one scalar{" "}
              <span className={MONO}>T &gt; 0</span>, and compute{" "}
              <span className={MONO}>softmax(z / T)</span>. Fit <span className={MONO}>T</span> by
              minimizing log loss on the validation set — a one-dimensional optimization, takes a
              second. That's <Term id="temperature-scaling">temperature scaling</Term>. The argmax
              is preserved (every logit divided by the same constant), so accuracy doesn't move;
              only the confidences rescale.
            </>,
            <>
              레시피: 훈련된 모델을 그대로 쓴다. 재훈련 없음. 아키텍처 변경 없음. 보유 검증 셋의
              원시 <Term id="logit">로짓</Term>을 가져와, 단 하나의 스칼라{" "}
              <span className={MONO}>T &gt; 0</span>를 더해{" "}
              <span className={MONO}>softmax(z / T)</span>를 계산한다.{" "}
              <span className={MONO}>T</span>는 검증 셋에서 로그 손실을 최소화하도록 맞춘다 — 1차원
              최적화, 1초면 끝. 그게 <Term id="temperature-scaling">온도 스케일링</Term>이다.
              argmax는 보존된다 (모든 로짓을 같은 상수로 나누니까), 정확도는 그대로다. 신뢰도만 다시
              스케일된다.
            </>,
          )}
        </p>
        <p className="mb-3">
          {pick(
            language,
            <>
              Why this works: dividing the logits by <span className={MONO}>T &gt; 1</span> flattens
              the softmax — every output probability moves toward the uniform{" "}
              <span className={MONO}>1/K</span>. Across many examples, that pulls down the
              right-tail bars (the overconfident region) more than it pulls up the middle, exactly
              undoing the squash that produced the sigmoid bend. It's a remarkably cheap fix for a
              remarkably common failure mode — and the first thing to try whenever a reliability
              diagram bows below the diagonal.
            </>,
            <>
              왜 작동하는가: 로짓을 <span className={MONO}>T &gt; 1</span>로 나누면 softmax가
              평평해진다 — 모든 출력 확률이 균등 분포 <span className={MONO}>1/K</span> 쪽으로
              움직인다. 많은 예제들 위에서, 이는 오른쪽 꼬리 (과신 영역) 의 막대를 가운데보다 더
              많이 끌어내려 시그모이드 굽힘을 정확히 되돌린다. 매우 흔한 실패 모드에 대한 매우 싼
              처방이고, 신뢰도 다이어그램이 대각선 아래로 휠 때 가장 먼저 시도해야 할 것.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc5} />}
        <Counterexample
          en={
            <>
              Temperature scaling assumes the miscalibration is the <em>same shape</em> everywhere
              in input space — one global rotation can fix it. Real models often miscalibrate{" "}
              <em>differently</em> on different slices: easy examples confidently right, hard
              examples confidently wrong, out-of-distribution inputs absurdly confident. A single{" "}
              <span className={MONO}>T</span> averages the gap, which can leave both regimes worse
              than nothing. The honest tell: ECE drops on validation, but the right tail of the
              held-out reliability diagram is still bowed. The fix isn't a bigger T; it's a model
              that asks "is this input near anything I've seen?" — a separate piece of machinery
              (selective prediction, conformal sets, density estimators) that lives outside the
              softmax entirely.
            </>
          }
          ko={
            <>
              온도 스케일링은 미스캘리브레이션이 입력 공간 전반에 걸쳐 <em>같은 모양</em>이라고
              가정한다 — 하나의 전역 회전으로 고칠 수 있다는 것. 실제 모델은 슬라이스마다{" "}
              <em>다르게</em> 미스캘리브레이션된다: 쉬운 예제는 자신만만하게 맞고, 어려운 예제는
              자신만만하게 틀리고, 분포 밖 입력은 터무니없이 자신만만하다. 단일{" "}
              <span className={MONO}>T</span>는 격차를 평균낼 뿐이라, 양쪽 영역 모두를 안 한 것만
              못하게 만들 수 있다. 정직한 신호: 검증 셋에서 ECE는 떨어지지만, 보유된 신뢰도
              다이어그램의 오른쪽 꼬리는 여전히 휘어 있다. 처방은 더 큰 T가 아니다; "이 입력이 내가
              본 것 근처인가?"를 묻는 모델 — 선택적 예측, 컨포멀 집합, 밀도 추정기 — 이고, 이건
              softmax 바깥에 사는 별개의 기계다.
            </>
          }
        />
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
            <b>
              Confidence is a number. Truth is a frequency. Calibration is the gap between them.
            </b>{" "}
            A reliability diagram makes the gap visible; a tangent at one bin tells you the local
            fix; one scalar — temperature — rotates the whole curve back toward the diagonal.
          </>,
          <>
            <b>신뢰도는 수다. 진실은 빈도다. 캘리브레이션은 그 사이의 격차다.</b> 신뢰도
            다이어그램이 그 격차를 눈에 보이게 하고, 한 구간의 접선이 국소적 처방을 말해주며, 단
            하나의 스칼라 — 온도 — 가 곡선 전체를 대각선 쪽으로 회전시킨다.
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
        tag={{ en: "read the bin", ko: "구간 읽기" }}
        prompt={{
          en: (
            <>
              In the widget, set <span className={MONO}>T = 0.55</span> (overconfident). Click the
              bin centered at <span className={MONO}>0.85</span>. Read off the bar height. Out of
              every 100 predictions the model labels "85% confident," about how many are actually
              correct? Now do the same for the bin at <span className={MONO}>0.55</span>. What kind
              of input is the model still being honest about?
            </>
          ),
          ko: (
            <>
              위젯에서 <span className={MONO}>T = 0.55</span> (과신) 으로 두자.{" "}
              <span className={MONO}>0.85</span> 중심 구간을 클릭. 막대 높이를 읽어라. 모델이 "85%
              확신"이라고 라벨한 100개의 예측 중 실제로 맞은 건 대략 몇 개? 같은 일을{" "}
              <span className={MONO}>0.55</span> 구간에 대해서도 해보자. 모델은 어떤 종류의 입력에
              대해 여전히 정직한가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              At <span className={MONO}>0.85</span>: <span className={MONO}>actual ≈ 0.74</span> —
              about 74 out of 100. The 11-point gap is the visible signature of overconfidence in
              the high-probability tail. At <span className={MONO}>0.55</span>:{" "}
              <span className={MONO}>actual ≈ 0.53</span> — almost on the diagonal. Models are
              calibrated near the middle (where they're already uncertain) and miscalibrated at the
              tails (where they think they're sure).
            </>
          ),
          ko: (
            <>
              <span className={MONO}>0.85</span>에서: <span className={MONO}>actual ≈ 0.74</span> —
              100개 중 약 74개. 11점 격차가 높은 확률 꼬리에서 과신의 가시적 서명이다.{" "}
              <span className={MONO}>0.55</span>에서: <span className={MONO}>actual ≈ 0.53</span> —
              거의 대각선 위. 모델은 중간 (이미 불확실한 영역) 에서 캘리브레이트되고, 꼬리 (모델이
              확신한다고 생각하는 영역) 에서 미스캘리브레이트된다.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "below the diagonal · what it means", ko: "대각선 아래 · 그 뜻" }}
        prompt={{
          en: (
            <>
              A friend looks at a reliability diagram where every bar in the right half lies{" "}
              <em>below</em> the diagonal and says: "great — the model is being modest." Write a
              one-sentence reply that distinguishes <em>modest</em> from <em>overconfident</em>.
              Which interpretation matches "below the diagonal"?
            </>
          ),
          ko: (
            <>
              친구가 신뢰도 다이어그램을 보고, 오른쪽 절반의 모든 막대가 대각선 <em>아래</em>에 있는
              것을 가리키며 "좋다 — 모델이 겸손하다"고 말한다. <em>겸손한</em>과 <em>과신하는</em>을
              구분하는 한 문장 답을 써라. "대각선 아래"는 어느 쪽 해석에 해당하나?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Below the diagonal at <span className={MONO}>p = 0.9</span> means the bar height is{" "}
              <em>less</em> than 0.9 — i.e., the model <em>says</em> 0.9 but is correct{" "}
              <em>less than 0.9</em> of the time. That's the model claiming more than it can
              deliver: <b>overconfident</b>, not modest. "Modest" would be a model that says 0.6 and
              is right 0.8 of the time — bars <em>above</em> the diagonal.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>p = 0.9</span>에서 대각선 아래라는 건 막대 높이가 0.9{" "}
              <em>미만</em>이라는 뜻 — 모델은 0.9라고 <em>말</em>하지만 실제로는 0.9 미만 비율로
              맞다는 것. 그건 모델이 줄 수 있는 것보다 더 주장하고 있다는 것: <b>과신</b>, 겸손이
              아니다. "겸손"은 0.6이라 말하면서 실제로 0.8 비율로 맞는 모델 — 대각선 <em>위</em>의
              막대다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "local linear fit", ko: "국소 선형 적합" }}
        prompt={{
          en: (
            <>
              In the overconfident regime (<span className={MONO}>T = 0.55</span>), click the bin at{" "}
              <span className={MONO}>0.85</span>. The widget reports a local slope. Suppose that
              slope is <span className={MONO}>m = 0.6</span> and the bar height is{" "}
              <span className={MONO}>0.74</span> at <span className={MONO}>p = 0.85</span>. Write
              the local linear approximation in the form{" "}
              <span className={MONO}>actual(p) ≈ m·p + c</span> — i.e., compute{" "}
              <span className={MONO}>c</span>. Use it to predict the calibration error at{" "}
              <span className={MONO}>p = 0.95</span>.
            </>
          ),
          ko: (
            <>
              과신 상태 (<span className={MONO}>T = 0.55</span>) 에서{" "}
              <span className={MONO}>0.85</span> 구간을 클릭. 위젯이 국소 기울기를 보고한다. 그
              기울기가 <span className={MONO}>m = 0.6</span>, 막대 높이가{" "}
              <span className={MONO}>0.74</span> (<span className={MONO}>p = 0.85</span>) 라 하자.
              국소 선형 근사를 <span className={MONO}>actual(p) ≈ m·p + c</span> 형태로 써라 —{" "}
              <span className={MONO}>c</span>를 계산하면 된다. 그것을 이용해{" "}
              <span className={MONO}>p = 0.95</span>에서의 캘리브레이션 오차를 예측하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>0.74 = 0.6·0.85 + c → c = 0.74 − 0.51 = 0.23</span>. So{" "}
              <span className={MONO}>actual(p) ≈ 0.6·p + 0.23</span>. At{" "}
              <span className={MONO}>p = 0.95</span>:{" "}
              <span className={MONO}>actual ≈ 0.6·0.95 + 0.23 = 0.80</span>. The calibration error
              is <span className={MONO}>0.95 − 0.80 = 0.15</span> — bigger than at{" "}
              <span className={MONO}>0.85</span>, exactly because slope &lt; 1 means the gap{" "}
              <em>grows</em> with confidence in this neighborhood.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>0.74 = 0.6·0.85 + c → c = 0.74 − 0.51 = 0.23</span>. 그래서{" "}
              <span className={MONO}>actual(p) ≈ 0.6·p + 0.23</span>.{" "}
              <span className={MONO}>p = 0.95</span>에서:{" "}
              <span className={MONO}>actual ≈ 0.6·0.95 + 0.23 = 0.80</span>. 캘리브레이션 오차는{" "}
              <span className={MONO}>0.95 − 0.80 = 0.15</span> — <span className={MONO}>0.85</span>
              에서보다 크다. 이 동네에서 기울기 &lt; 1이라는 사실이 정확히 격차가 신뢰도와 함께{" "}
              <em>커진다</em>는 뜻이기 때문.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "why cross-entropy → overconfidence", ko: "왜 교차 엔트로피 → 과신" }}
        prompt={{
          en: (
            <>
              From the confident-wrong page: cross-entropy is{" "}
              <span className={MONO}>−log p_true</span>. Sketch — in words, no math required — why a
              model trained to minimize this loss has an incentive to be <em>overconfident</em> on
              the training set, and why this incentive doesn't translate into good calibration on
              held-out data.
            </>
          ),
          ko: (
            <>
              confident-wrong 페이지에서: 교차 엔트로피는 <span className={MONO}>−log p_정답</span>.
              이 손실을 최소화하도록 훈련된 모델이 왜 훈련 셋에서 <em>과신</em>할 인센티브를
              가지는지, 그 인센티브가 왜 보유 데이터의 좋은 캘리브레이션으로 이어지지 않는지를 —
              수식 없이 — 말로 스케치하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>−log p</span> drops sharply as <span className={MONO}>p</span>{" "}
              approaches 1. So once the model is mostly right on a training example, the cheapest
              way to keep lowering its loss is to push <span className={MONO}>p_true</span> from 0.9
              to 0.99 to 0.999. The training signal rewards{" "}
              <em>more confidence on examples it already gets right</em>. On held-out data, that
              confidence has nothing to anchor it — the model has learned to be loud on familiar
              inputs, and that loudness carries over to the unfamiliar ones it hasn't seen. Result:
              bars sag below the diagonal exactly where the model is loudest.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>−log p</span>는 <span className={MONO}>p</span>가 1에
              가까울수록 가파르게 떨어진다. 그래서 모델이 어떤 훈련 예제에서 대체로 맞기 시작하면,
              손실을 더 낮추는 가장 싼 방법은 <span className={MONO}>p_정답</span>을 0.9 → 0.99 →
              0.999로 밀어붙이는 것. 훈련 신호는 <em>이미 맞히는 예제에서 더 강한 자신감</em>을
              보상한다. 보유 데이터에서는 그 자신감을 잡아줄 게 없다 — 모델은 익숙한 입력에서 큰
              소리로 말하는 법을 배웠고, 그 큰 목소리가 본 적 없는 입력에서도 따라간다. 결과: 막대는
              모델이 가장 큰 소리로 말하는 곳에서 정확히 대각선 아래로 처진다.
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

export function ModelCalibration({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Model Calibration · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <ReliabilityDiagram />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <WhyNotTaught
        en={
          <>
            ML courses introduce softmax, cross-entropy, and accuracy. They almost never introduce
            <em> calibration</em>. The reason is partly cultural — accuracy is what leaderboards
            track — and partly historical: classical learning theory cared about decision boundaries
            (which the argmax decides), not the probabilities the model emits along the way. But
            every shipped model that says "70% sure" makes the calibration claim implicitly. Lemma
            puts the diagram next to softmax so the reader can see the gap between{" "}
            <em>looks like a probability</em> and <em>matches frequency</em> — a separate
            measurement, against held-out truth, that no amount of cross-entropy training can
            replace.
          </>
        }
        ko={
          <>
            ML 강의는 softmax, 교차 엔트로피, 정확도를 가르친다. <em>캘리브레이션</em>은 거의
            가르치지 않는다. 일부는 문화 — 리더보드는 정확도를 추적한다 — 이고, 일부는 역사: 고전
            학습 이론은 결정 경계 (argmax가 정한다) 에 신경 썼지, 모델이 그 과정에서 내놓는 확률에는
            관심이 적었다. 하지만 "70% 확신"이라고 말하는 모든 출시된 모델은 암묵적으로 캘리브레이션
            주장을 하고 있다. Lemma는 softmax 옆에 그 다이어그램을 두어, 독자가{" "}
            <em>확률처럼 보인다</em>와 <em>빈도와 일치한다</em> 사이의 격차를 — 보유된 정답에 대한
            별개의 측정으로, 어떤 양의 교차 엔트로피 훈련도 대체할 수 없는 것으로 — 볼 수 있게 한다.
          </>
        }
      />
      <GlossaryList />
    </TermsProvider>
  );
}
