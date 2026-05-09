import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { LossLandscape } from "../components/widgets/loss-landscape";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc2: string; arc4: string; arc6: string };

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
        {pick(language, "ml · gradient descent", "ML · 경사하강법")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · which knob, how much", "도입 · 어느 손잡이, 얼마나")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>A model is wrong. Which knob should move, and by how much?</>,
          <>모델이 틀렸다. 어떤 손잡이를 어느 방향으로 얼마나 움직여야 할까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            You have a parameter <span className={MONO}>w</span> and a way to measure how wrong the
            model is — a <Term id="loss-function">loss</Term>{" "}
            <span className={FORMULA_INLINE}>L(w)</span>. <em>Which direction</em> should{" "}
            <span className={MONO}>w</span> move to make <span className={MONO}>L</span> smaller?{" "}
            <em>How far</em>? Answers: the <Term id="derivative">derivative</Term> tells you the
            direction; a number called the <Term id="learning-rate">learning rate</Term> tells you
            how far. Together they make one of the simplest, oldest, most-used recipes in numerical
            mathematics — and the engine of every modern ML system.
          </>,
          <>
            매개변수 <span className={MONO}>w</span> 하나, 모델이 얼마나 틀렸는지를 재는{" "}
            <Term id="loss-function">손실</Term> <span className={FORMULA_INLINE}>L(w)</span> 가
            있다. <em>어느 방향</em>으로 <span className={MONO}>w</span>를 움직여야{" "}
            <span className={MONO}>L</span>이 작아질까? <em>얼마나</em>? 답: 방향은{" "}
            <Term id="derivative">미분</Term>이 알려주고, 거리는{" "}
            <Term id="learning-rate">학습률</Term>이라 부르는 한 숫자가 결정한다. 둘을 합친 것이
            수치 수학에서 가장 단순하고 가장 오래된, 그리고 가장 많이 쓰이는 레시피 중 하나 — 모든
            현대 ML 시스템의 엔진.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            In the widget below, drag the starting <span className={MONO}>w₀</span> and the{" "}
            <span className={MONO}>η</span> slider, then press <b>step</b>. Three preset rates:{" "}
            <em>too small</em> crawls down, <em>good</em> snaps to the minimum in a couple of steps,{" "}
            <em>too big</em> oscillates and explodes. The boundary between "good" and "explodes" is
            the entire stability theory of the method, in one screen.
          </>,
          <>
            아래 위젯에서 <span className={MONO}>w₀</span> 출발점과 <span className={MONO}>η</span>
            를 끌고 <b>한 스텝</b>을 눌러보자. 세 프리셋: <em>작음</em>은 기어 내려가고,{" "}
            <em>적당</em>은 두어 스텝 만에 최솟값에 닿고, <em>너무 큼</em>은 진동하며 발산한다.
            "적당"과 "발산" 사이의 경계가 이 방법의 안정성 이론 *전부* — 한 화면 안에.
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

function Arc({ code }: { code: CodeMap }) {
  const { language, mode } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "the arc", "흐름")}</div>

      <ArcRow n={1}>
        <h3>{pick(language, "Wrongness as a number", "틀림을 숫자로")}</h3>
        <p>
          {pick(
            language,
            <>
              Take the simplest possible model: one parameter <span className={MONO}>w</span>, one
              input <span className={MONO}>x</span>, prediction{" "}
              <span className={FORMULA_INLINE}>ŷ = w · x</span>. We want{" "}
              <span className={MONO}>ŷ ≈ y</span> for the true value <span className={MONO}>y</span>
              . "Closeness" needs a number; the standard choice is squared error{" "}
              <span className={FORMULA_INLINE}>L(w) = (w·x − y)²</span> — zero when the prediction
              is exact, large when it's far, and (importantly) <em>smooth</em> everywhere so we can
              take derivatives.
            </>,
            <>
              가장 단순한 모델: 매개변수 하나 <span className={MONO}>w</span>, 입력 하나{" "}
              <span className={MONO}>x</span>, 예측{" "}
              <span className={FORMULA_INLINE}>ŷ = w · x</span>. 우리는 참값{" "}
              <span className={MONO}>y</span>에 대해 <span className={MONO}>ŷ ≈ y</span>를 원한다.
              "가까움"엔 한 숫자가 필요한데, 표준 선택은 제곱 오차{" "}
              <span className={FORMULA_INLINE}>L(w) = (w·x − y)²</span> — 예측이 정확하면 0, 멀면
              크고, (중요하게) 모든 곳에서 *매끄럽다* 미분이 가능하도록.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The widget fixes <span className={MONO}>(x, y) = (2, 6)</span>, so the loss is{" "}
              <span className={FORMULA_INLINE}>L(w) = (2w − 6)² = 4(w − 3)²</span> — a parabola with
              minimum at <span className={MONO}>w* = 3</span>. The whole problem reduces to: how do
              we get from any starting <span className={MONO}>w₀</span> to{" "}
              <span className={MONO}>3</span>?
            </>,
            <>
              위젯은 <span className={MONO}>(x, y) = (2, 6)</span>로 고정 — 손실은{" "}
              <span className={FORMULA_INLINE}>L(w) = (2w − 6)² = 4(w − 3)²</span>, 최솟값은{" "}
              <span className={MONO}>w* = 3</span>인 포물선. 문제 전체는 한 줄로 줄어든다 — 임의의
              출발점 <span className={MONO}>w₀</span>에서 <span className={MONO}>3</span>까지 어떻게
              갈 것인가.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "Which direction? — the derivative", "어느 방향? — 미분")}</h3>
        <p>
          {pick(
            language,
            <>
              The{" "}
              <Link
                to="/modules/derivatives"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                derivatives module
              </Link>{" "}
              gives the answer in one line:{" "}
              <span className={FORMULA_INLINE}>L'(w) = 2x(wx − y)</span> — the slope of the loss
              curve at the current <span className={MONO}>w</span>. If{" "}
              <span className={MONO}>L'(w) &gt; 0</span>, <span className={MONO}>L</span> is rising
              as <span className={MONO}>w</span> grows; we should make{" "}
              <span className={MONO}>w</span> <em>smaller</em>. If{" "}
              <span className={MONO}>L'(w) &lt; 0</span>, the opposite. The descent direction is
              always <span className={FORMULA_INLINE}>−L'(w)</span>.
            </>,
            <>
              <Link
                to="/modules/derivatives"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                미분 모듈
              </Link>
              이 한 줄로 답한다: <span className={FORMULA_INLINE}>L'(w) = 2x(wx − y)</span> — 현재{" "}
              <span className={MONO}>w</span>에서의 손실 곡선의 기울기. 만약{" "}
              <span className={MONO}>L'(w) &gt; 0</span>이면 <span className={MONO}>w</span>가
              증가할수록 손실이 *상승* — <span className={MONO}>w</span>를 <em>줄여야</em> 한다.{" "}
              <span className={MONO}>L'(w) &lt; 0</span>이면 반대. 하강 방향은 항상{" "}
              <span className={FORMULA_INLINE}>−L'(w)</span>.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              In the widget, the green arrow at the current point shows that direction. As{" "}
              <span className={MONO}>w</span> approaches the minimum, the arrow shrinks; right at{" "}
              <span className={MONO}>w*</span> it has zero length — there's no signal left, because
              the gradient is exactly zero at the minimum.
            </>,
            <>
              위젯에서 현재 점의 초록 화살표가 그 방향. <span className={MONO}>w</span>가 최솟값에
              가까워지면 화살표가 줄고, 정확히 <span className={MONO}>w*</span>에서 길이가 0 —
              최솟값에서 기울기가 정확히 0이라 남는 신호가 없다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>{pick(language, "How far? — the learning rate", "얼마나? — 학습률")}</h3>
        <p>
          {pick(
            language,
            <>
              The direction is settled. The size still isn't. We multiply the gradient by a positive
              number <span className={MONO}>η</span> (the{" "}
              <Term id="learning-rate">learning rate</Term>) and subtract:
            </>,
            <>
              방향은 정해졌다. 크기는 아직 아니다. 기울기에 양수 <span className={MONO}>η</span> (
              <Term id="learning-rate">학습률</Term>) 를 곱해 빼준다:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`w  ←  w  −  η · L'(w)`}
        </pre>
        <p>
          {pick(
            language,
            <>
              Different <span className={MONO}>η</span> shapes the trajectory. Try{" "}
              <span className={MONO}>η = 0.04</span> in the widget: each step shrinks the distance
              to <span className={MONO}>w*</span> by a constant factor (about 0.68 here), so
              convergence is geometric but slow. <span className={MONO}>η = 0.12</span> is near the
              Newton-optimal <span className={MONO}>η = 1/L''(w*) = 1/8 = 0.125</span> — convergence
              in two or three steps. <span className={MONO}>η = 0.27</span> is past the boundary;
              we'll see what happens to it next.
            </>,
            <>
              <span className={MONO}>η</span>가 다르면 궤적이 다르다. 위젯에서{" "}
              <span className={MONO}>η = 0.04</span>로 보면, 매 스텝마다{" "}
              <span className={MONO}>w*</span>까지의 거리가 일정 비율 (여기선 약 0.68) 줄어드는 기하
              수렴 — 느리지만 안정. <span className={MONO}>η = 0.12</span>는 뉴턴-최적{" "}
              <span className={MONO}>η = 1/L''(w*) = 1/8 = 0.125</span> 근처 — 두세 스텝이면 끝.{" "}
              <span className={MONO}>η = 0.27</span>은 경계 너머. 무슨 일이 일어나는지 다음 절에서
              본다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={4}>
        <h3>{pick(language, "Iterate — the descent loop", "반복 — 하강 루프")}</h3>
        <p>
          {pick(
            language,
            <>
              The whole method is just step → step → step until either the gradient is small enough
              (we're near a minimum) or a budget runs out:
            </>,
            <>
              방법 전체는 스텝 → 스텝 → 스텝 — 기울기가 충분히 작아지거나 (최솟값 근처) 한도가 끝날
              때까지:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`for _ in range(steps):
    w = w − η · L'(w)`}
        </pre>
        <p>
          {pick(
            language,
            <>
              Five lines of code. That's gradient descent. The widget runs exactly this loop when
              you press <em>auto</em>. Press it with <span className={MONO}>η = 0.12</span> and
              watch <span className={MONO}>w</span> converge to <span className={MONO}>3</span>.
              Press it with <span className={MONO}>η = 0.27</span> and watch the iterates leave the
              screen.
            </>,
            <>
              코드 다섯 줄. 그게 경사하강법이다. 위젯의 <em>자동</em>이 정확히 이 루프를 돌린다.{" "}
              <span className={MONO}>η = 0.12</span>로 누르면 <span className={MONO}>w</span>가{" "}
              <span className={MONO}>3</span>으로 수렴. <span className={MONO}>η = 0.27</span>
              로 누르면 갱신값이 화면 밖으로 날아간다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>{pick(language, "Diverge — when η goes too far", "발산 — η가 너무 크면")}</h3>
        <p>
          {pick(
            language,
            <>
              For our quadratic loss, write <span className={MONO}>u = w − w*</span>. The update
              rule becomes <span className={FORMULA_INLINE}>u ← (1 − η · L''(w*)) · u</span> — the
              *distance to the minimum* gets multiplied by{" "}
              <span className={MONO}>r = 1 − η · L''(w*)</span> at each step. Stable convergence
              requires <span className={MONO}>|r| &lt; 1</span>, i.e.{" "}
              <span className={FORMULA_INLINE}>0 &lt; η &lt; 2/L''(w*)</span>. For our specific
              loss, <span className={MONO}>L''(w) = 8</span>, so any{" "}
              <span className={MONO}>η &lt; 0.25</span> converges and any{" "}
              <span className={MONO}>η &gt; 0.25</span> diverges.
            </>,
            <>
              우리의 이차 손실에서 <span className={MONO}>u = w − w*</span>로 두면 갱신이{" "}
              <span className={FORMULA_INLINE}>u ← (1 − η · L''(w*)) · u</span> — *최솟값까지의
              거리*가 매 스텝 <span className={MONO}>r = 1 − η · L''(w*)</span>로 곱해진다. 안정
              수렴은 <span className={MONO}>|r| &lt; 1</span>, 즉{" "}
              <span className={FORMULA_INLINE}>0 &lt; η &lt; 2/L''(w*)</span>. 우리 손실의{" "}
              <span className={MONO}>L''(w) = 8</span>이라 <span className={MONO}>η &lt; 0.25</span>
              는 수렴, <span className={MONO}>η &gt; 0.25</span>는 발산.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Above <span className={MONO}>0.25</span>, each step overshoots the minimum by
              <em> more</em> than it corrected for. The signs of <span className={MONO}>u</span>{" "}
              alternate (we land on opposite sides) and the magnitude grows. The widget makes this
              picture: at <span className={MONO}>η = 0.27</span>, the iterates ping-pong and
              balloon. The fix in real ML is never "trial and error" alone — it's measuring local
              curvature (second-order methods, Adam-style adaptive rates) and using a schedule that{" "}
              <em>shrinks</em> <span className={MONO}>η</span> as the optimum gets closer.
            </>,
            <>
              <span className={MONO}>0.25</span> 위에서는 매 스텝이 최솟값을 *교정한 것보다 더 멀리*
              지나친다. <span className={MONO}>u</span>의 부호가 번갈아가며 (최솟값의 양쪽에 번갈아
              떨어진다) 크기가 자란다. 위젯이 그림을 보여준다 —{" "}
              <span className={MONO}>η = 0.27</span>에서 갱신값이 핑퐁하며 부풀어 오른다. 실제 ML의
              해법은 단순한 시행착오 하나가 아니라, 국소 곡률을 *측정*하는 것 (2차 방법, Adam 같은
              적응형) + 최적해에 가까워질수록 <span className={MONO}>η</span>를 *줄이는* 스케줄.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={6}>
        <h3>{pick(language, "Why this is everywhere in ML", "왜 ML 곳곳에 이 식이 있는가")}</h3>
        <p>
          {pick(
            language,
            <>
              Real ML doesn't have one parameter; it has millions or billions. It doesn't have one
              example; it has millions of them. It doesn't have a clean parabolic loss; it has a
              high-dimensional, non-convex landscape full of saddles and plateaus. None of that
              changes the recipe — it just changes what each symbol stands for.
            </>,
            <>
              실제 ML은 매개변수가 하나가 아니라 수백만~수십억. 예제도 하나가 아니라 수백만. 손실은
              깔끔한 포물선이 아니라 안장점과 평탄지가 가득한 고차원 비볼록 풍경. 어느 것도 레시피
              자체를 바꾸지는 못한다 — 각 기호가 가리키는 *것*만 바뀐다.
            </>,
          )}
        </p>
        <ul className="m-0 mb-3 list-none space-y-1.5 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <b>One parameter → vector.</b> <span className={MONO}>w</span> becomes a parameter
                vector <span className={MONO}>θ</span>; the gradient becomes a vector of partial
                derivatives. Vector subtraction in place of the scalar update.
              </li>
              <li>
                <b>One example → mini-batch.</b> Sum (or average) the loss over a small random
                sample of examples each step. The gradient is now <em>noisy</em> — that's{" "}
                <span className={MONO}>SGD</span>. The noise is a feature: it helps escape bad local
                geometry.
              </li>
              <li>
                <b>Clean parabola → real loss surface.</b> Cross-entropy on a deep network is
                non-convex. There is no single optimum; we settle for "good enough" local minima,
                found by the same descent loop.
              </li>
              <li>
                <b>Hand-derived gradient → autograd.</b> The chain rule is mechanical. Modern ML
                frameworks build a computation graph during the forward pass and walk it backward to
                produce <span className={MONO}>∇L</span> automatically. The derivative we computed
                by hand for the toy is the same operation, scaled.
              </li>
            </>,
            <>
              <li>
                <b>매개변수 하나 → 벡터.</b> <span className={MONO}>w</span>가 매개변수 벡터{" "}
                <span className={MONO}>θ</span>로, 기울기는 편미분의 벡터로. 스칼라 갱신 대신 벡터
                뺄셈.
              </li>
              <li>
                <b>예제 하나 → 미니배치.</b> 매 스텝마다 작은 무작위 샘플에 대해 손실을 합 (또는
                평균). 기울기가 *잡음 있음* — 이게 <span className={MONO}>SGD</span>. 잡음은 버그가
                아니라 특징 — 나쁜 국소 기하를 탈출하는 데 도움.
              </li>
              <li>
                <b>깔끔한 포물선 → 실제 손실 표면.</b> 깊은 신경망의 교차 엔트로피는 비볼록. 하나의
                최적해는 없고, 같은 하강 루프로 찾아지는 "충분히 좋은" 국소 최솟값으로 만족.
              </li>
              <li>
                <b>손-유도 기울기 → autograd.</b> 연쇄 법칙은 기계적이다. 현대 ML 프레임워크는
                forward 동안 계산 그래프를 만들고 그것을 거꾸로 걸어 자동으로{" "}
                <span className={MONO}>∇L</span>을 만든다. 우리가 토이에서 손으로 계산한 미분과
                *같은 연산*, 규모만 다르다.
              </li>
            </>,
          )}
        </ul>
        <p>
          {pick(
            language,
            <>
              The bridge to{" "}
              <Link
                to="/ml/confident-wrong"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                Confidently Wrong
              </Link>
              : the squared loss here is the warm-up. The cross-entropy loss there has the same
              "compute gradient, take a step" geometry — just with{" "}
              <span className={MONO}>−log p_true</span> instead of{" "}
              <span className={MONO}>(ŷ − y)²</span>. Same descent algorithm, different landscape.
            </>,
            <>
              <Link
                to="/ml/confident-wrong"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                자신 있게 틀리기
              </Link>
              로 가는 다리: 여기 제곱 손실은 워밍업. 거기 교차 엔트로피 손실도 같은 "기울기 계산 →
              한 스텝" 기하를 가진다 — 단지 <span className={MONO}>(ŷ − y)²</span> 대신{" "}
              <span className={MONO}>−log p_true</span>일 뿐. 같은 하강 알고리즘, 다른 풍경.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc6} />}
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
            <b>Direction from the derivative. Distance from η. Repeat.</b> The whole machinery of
            modern ML is one variable substitution away from this single line:{" "}
            <span className="font-mono text-[0.95em]">w ← w − η · L'(w)</span>.
          </>,
          <>
            <b>방향은 미분이, 거리는 η가, 반복.</b> 현대 ML의 모든 기계는 이 한 줄에서 변수 치환만
            하면 나온다 — <span className="font-mono text-[0.95em]">w ← w − η · L'(w)</span>.
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
        noCalculator
        tag={{ en: "compute the loss", ko: "손실 계산" }}
        prompt={{
          en: (
            <>
              With <span className={MONO}>x = 2</span>, <span className={MONO}>y = 6</span>, and{" "}
              <span className={MONO}>w = 1</span>, compute the prediction{" "}
              <span className={MONO}>ŷ</span> and the loss{" "}
              <span className={FORMULA_INLINE}>L(w) = (ŷ − y)²</span>.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>x = 2</span>, <span className={MONO}>y = 6</span>,{" "}
              <span className={MONO}>w = 1</span>일 때 예측 <span className={MONO}>ŷ</span>와 손실{" "}
              <span className={FORMULA_INLINE}>L(w) = (ŷ − y)²</span>를 계산하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>ŷ = 1 · 2 = 2</span>. Off by{" "}
              <span className={MONO}>(2 − 6) = −4</span>. Loss{" "}
              <span className={MONO}>(−4)² = 16</span>. Verify in the widget by setting{" "}
              <span className={MONO}>w = 1</span>.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>ŷ = 1 · 2 = 2</span>. 차이는{" "}
              <span className={MONO}>(2 − 6) = −4</span>. 손실{" "}
              <span className={MONO}>(−4)² = 16</span>. 위젯에서 <span className={MONO}>w = 1</span>
              로 두고 확인.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "gradient by hand", ko: "기울기 손계산" }}
        prompt={{
          en: (
            <>
              Use the secant-to-tangent recipe from the{" "}
              <Link
                to="/modules/derivatives"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                derivatives module
              </Link>{" "}
              to derive <span className={FORMULA_INLINE}>L'(w) = 2x(wx − y)</span> from scratch.
              Then evaluate at <span className={MONO}>w = 1</span> with{" "}
              <span className={MONO}>(x, y) = (2, 6)</span>.
            </>
          ),
          ko: (
            <>
              <Link
                to="/modules/derivatives"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                미분 모듈
              </Link>
              의 할선-접선 레시피로 <span className={FORMULA_INLINE}>L'(w) = 2x(wx − y)</span>
              를 처음부터 유도하라. 그 다음 <span className={MONO}>(x, y) = (2, 6)</span>,{" "}
              <span className={MONO}>w = 1</span>에서 값을 계산.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>L(w + h) − L(w) = ((w + h)x − y)² − (wx − y)²</span>. Expand
              the squares and subtract: the result is{" "}
              <span className={MONO}>2(wx − y)·xh + x²h²</span>. Divide by{" "}
              <span className={MONO}>h</span>: <span className={MONO}>2x(wx − y) + x²h</span>. Let{" "}
              <span className={MONO}>h → 0</span>:{" "}
              <span className={FORMULA_INLINE}>L'(w) = 2x(wx − y)</span>. At{" "}
              <span className={MONO}>w = 1</span>:{" "}
              <span className={MONO}>2 · 2 · (2 − 6) = 4 · (−4) = −16</span>. Negative — the loss is
              decreasing as <span className={MONO}>w</span> grows, so descent will push{" "}
              <span className={MONO}>w</span> upward. ✓
            </>
          ),
          ko: (
            <>
              <span className={MONO}>L(w + h) − L(w) = ((w + h)x − y)² − (wx − y)²</span>. 제곱을
              펴고 빼면 <span className={MONO}>2(wx − y)·xh + x²h²</span>.{" "}
              <span className={MONO}>h</span>로 나누면{" "}
              <span className={MONO}>2x(wx − y) + x²h</span>. <span className={MONO}>h → 0</span>:{" "}
              <span className={FORMULA_INLINE}>L'(w) = 2x(wx − y)</span>.{" "}
              <span className={MONO}>w = 1</span>에서:{" "}
              <span className={MONO}>2 · 2 · (2 − 6) = 4 · (−4) = −16</span>. 음수 —{" "}
              <span className={MONO}>w</span>가 늘면 손실이 감소, 그래서 하강이{" "}
              <span className={MONO}>w</span>를 *위쪽*으로 민다. ✓
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        noCalculator
        tag={{ en: "one step by hand", ko: "한 스텝 손계산" }}
        prompt={{
          en: (
            <>
              Starting at <span className={MONO}>w = 1</span> with{" "}
              <span className={MONO}>η = 0.12</span> and gradient <span className={MONO}>−16</span>,
              what is <span className={MONO}>w</span> after one step? After two? You should land
              near the optimum quickly.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>w = 1</span>에서 출발, <span className={MONO}>η = 0.12</span>,
              기울기 <span className={MONO}>−16</span>일 때 한 스텝 뒤{" "}
              <span className={MONO}>w</span>는? 두 스텝 뒤는? 최적해 근처에 빨리 닿을 것이다.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Step 1: <span className={MONO}>w = 1 − 0.12 · (−16) = 1 + 1.92 = 2.92</span>.
              Recompute gradient: <span className={MONO}>2 · 2 · (5.84 − 6) = −0.64</span>. Step 2:{" "}
              <span className={MONO}>w = 2.92 − 0.12 · (−0.64) = 2.92 + 0.077 ≈ 3.00</span>. Already
              at the optimum, two steps. <span className={MONO}>η = 0.12</span> is near the
              Newton-optimal <span className={MONO}>1/L''(w*) = 1/8 = 0.125</span>.
            </>
          ),
          ko: (
            <>
              스텝 1: <span className={MONO}>w = 1 − 0.12 · (−16) = 1 + 1.92 = 2.92</span>. 기울기
              다시 계산: <span className={MONO}>2 · 2 · (5.84 − 6) = −0.64</span>. 스텝 2:{" "}
              <span className={MONO}>w = 2.92 − 0.12 · (−0.64) = 2.92 + 0.077 ≈ 3.00</span>. 두 스텝
              만에 최적해. <span className={MONO}>η = 0.12</span>가 뉴턴-최적{" "}
              <span className={MONO}>1/L''(w*) = 1/8 = 0.125</span>에 가까워서.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "why too-large η explodes", ko: "왜 큰 η가 폭발하는가" }}
        prompt={{
          en: (
            <>
              For our quadratic loss, the update on the displacement{" "}
              <span className={MONO}>u = w − w*</span> is{" "}
              <span className={FORMULA_INLINE}>u ← (1 − 8η) · u</span>. Show that{" "}
              <span className={MONO}>η = 0.27</span> gives <span className={MONO}>|u_n| → ∞</span>{" "}
              exponentially in <span className={MONO}>n</span>. At what{" "}
              <span className={MONO}>η</span> does the iteration sit at the boundary (constant
              amplitude, no growth, no decay)? What's special about that{" "}
              <span className={MONO}>η</span>?
            </>
          ),
          ko: (
            <>
              우리의 이차 손실에서 변위 <span className={MONO}>u = w − w*</span>의 갱신은{" "}
              <span className={FORMULA_INLINE}>u ← (1 − 8η) · u</span>.{" "}
              <span className={MONO}>η = 0.27</span>에서 <span className={MONO}>|u_n| → ∞</span>이{" "}
              <span className={MONO}>n</span>에 대해 지수적으로 발산함을 보여라. 어느{" "}
              <span className={MONO}>η</span>에서 갱신이 경계에 머무르는가 (진폭 일정, 자라지도
              줄지도 않음)? 그 <span className={MONO}>η</span>가 특별한 이유는?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>r = 1 − 8 · 0.27 = 1 − 2.16 = −1.16</span>;{" "}
              <span className={MONO}>|r| = 1.16 &gt; 1</span>. So{" "}
              <span className={MONO}>|u_n| = |r|^n · |u_0| = 1.16^n · |u_0|</span> — exponential
              growth. The boundary is <span className={MONO}>|r| = 1</span>: either{" "}
              <span className={MONO}>r = 1</span> (no update at all, only at{" "}
              <span className={MONO}>η = 0</span>) or <span className={MONO}>r = −1</span> (perfect
              oscillation around <span className={MONO}>w*</span>), which gives{" "}
              <b>η = 0.25 = 2/L''(w*)</b>. Right at this critical <span className={MONO}>η</span>,
              the iterate flips sign every step but never shrinks — the algorithm sits on the edge
              between converging and exploding. Real ML training stays well below this boundary,
              often by 10× or more, especially when curvature is unknown or varies across
              parameters.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>r = 1 − 8 · 0.27 = 1 − 2.16 = −1.16</span>;{" "}
              <span className={MONO}>|r| = 1.16 &gt; 1</span>. 그러므로{" "}
              <span className={MONO}>|u_n| = |r|^n · |u_0| = 1.16^n · |u_0|</span> — 지수적 성장.
              경계는 <span className={MONO}>|r| = 1</span> — 즉 <span className={MONO}>r = 1</span>{" "}
              (갱신 없음, <span className={MONO}>η = 0</span>
              에서만) 또는 <span className={MONO}>r = −1</span> (<span className={MONO}>w*</span>
              주위 완전 진동), 후자는 <b>η = 0.25 = 2/L''(w*)</b>에 해당. 이 임계{" "}
              <span className={MONO}>η</span>에서 매 스텝 부호가 뒤집히지만 줄지 않음 — 알고리즘이
              수렴과 발산의 경계에 앉아 있다. 실제 ML 훈련은 이 경계보다 *훨씬* 아래에 있다 (보통
              10배 이상), 특히 곡률을 모르거나 매개변수마다 다를 때.
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

function PageFooter() {
  const { language } = useApp();
  return (
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-[18px] font-mono text-xs text-ink-mute [&_b]:font-semibold [&_b]:text-ink">
      <div>
        {pick(
          language,
          <>
            application: <b>Gradient Descent</b>. Consumes the{" "}
            <Link to="/modules/derivatives">Derivatives</Link> module — the same secant-to-tangent
            limit, applied to a loss function. Sister application:{" "}
            <Link to="/ml/confident-wrong">Confidently Wrong</Link>, where the loss is cross-entropy
            and the same descent loop trains the classifier.
          </>,
          <>
            응용: <b>경사하강법</b>. <Link to="/modules/derivatives">미분</Link> 모듈을 소비한다 —
            할선-접선 극한을 손실 함수에 적용한 것. 자매 응용:{" "}
            <Link to="/ml/confident-wrong">자신 있게 틀리기</Link>, 거기서 손실은 교차 엔트로피이고
            같은 하강 루프가 분류기를 훈련한다.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function GradientDescent({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Gradient Descent · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <LossLandscape />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
