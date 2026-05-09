import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { TangentApproximation } from "../components/widgets/tangent-approximation";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc2: string; arc3: string; arc4: string };

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
        {pick(language, "module · linearization", "모듈 · 선형화")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · the everyday move", "도입 · 일상적 한 수")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>Most equations are hard. Their tangent line is easy.</>,
          <>대부분의 식은 어렵다. 그 접선은 쉽다.</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            Every time you say "for small <span className={MONO}>θ</span>,{" "}
            <span className={MONO}>sin θ ≈ θ</span>" or "near here, things grow linearly" or "to a
            first approximation," you are <Term id="linearization">linearizing</Term>. The pattern
            is so common we stop noticing it. The pendulum clock works because of it. Newton's
            method is built on it. Gradient descent is built on it. Most engineering is the
            discipline of <em>staying in the regime where it holds</em>.
          </>,
          <>
            "작은 <span className={MONO}>θ</span>에서 <span className={MONO}>sin θ ≈ θ</span>" 또는
            "여기 근처에선 선형적으로 자란다" 또는 "1차 근사에선" 이라고 말할 때마다 우리는{" "}
            <Term id="linearization">선형화</Term>를 하고 있다. 이 패턴은 너무 흔해서 의식하지 않게
            된다. 진자시계가 작동하는 이유, 뉴턴 방법이 깔린 자리, 경사하강법의 바닥 모두 여기.
            대부분의 공학은 *그것이 통하는 영역에 머무는 일*에 대한 규율.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            In the widget below, drag <b>a</b> (the anchor) and <b>x</b> (where to evaluate). With{" "}
            <span className={MONO}>a = 0</span>, the tangent line of{" "}
            <span className={MONO}>sin</span> is exactly <span className={MONO}>y = x</span> — the
            small-angle approximation, in pictures. Drag <b>x</b> away from{" "}
            <span className={MONO}>0</span> and watch the error grow as the square of the distance.
          </>,
          <>
            아래 위젯에서 <b>a</b> (기준점)와 <b>x</b> (평가점)를 끌어보자.{" "}
            <span className={MONO}>a = 0</span>일 때 <span className={MONO}>sin</span>의 접선은
            정확히 <span className={MONO}>y = x</span> — 작은 각 근사, 그림으로. <b>x</b>를{" "}
            <span className={MONO}>0</span>에서 멀어지게 끌면 오차가 거리의 *제곱*으로 자란다.
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
        <h3>{pick(language, "Why we approximate", "왜 근사하는가")}</h3>
        <p>
          {pick(
            language,
            <>
              The functions that govern the world are mostly <em>nonlinear</em>: a pendulum's{" "}
              <span className={MONO}>sin θ</span>, a transistor's exponential current, a
              gravitational force's <span className={MONO}>1/r²</span>, a neural network's softmax.
              Solving them in closed form is, in most cases, impossible. So we trade away exactness
              in a controlled way: pick a point we care about, replace the nonlinear function with
              the closest linear function in a neighbourhood of that point, and accept that the
              answer is correct only "near enough."
            </>,
            <>
              세상을 지배하는 함수는 대부분 *비선형*이다 — 진자의{" "}
              <span className={MONO}>sin θ</span>, 트랜지스터의 지수형 전류, 중력의{" "}
              <span className={MONO}>1/r²</span>, 신경망의 softmax. 닫힌 형태로 푸는 건 대부분의
              경우 불가능. 그래서 우리는 *통제된* 방식으로 정확성을 거래한다 — 관심 있는 점을 하나
              정하고, 그 점 *근처*에서 비선형 함수를 가장 가까운 선형 함수로 교체하고, "충분히
              가까운" 영역에서만 답이 맞다고 받아들인다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "The tangent line at a point", "한 점에서의 접선")}</h3>
        <p>
          {pick(
            language,
            <>
              At any smooth point <span className={MONO}>a</span>, the function{" "}
              <span className={MONO}>f</span> has both a value <span className={MONO}>f(a)</span>{" "}
              and a slope <span className={MONO}>f'(a)</span> (from the{" "}
              <Link
                to="/modules/derivatives"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                derivatives module
              </Link>
              ). The unique line passing through <span className={MONO}>(a, f(a))</span> with that
              slope is the <Term id="tangent">tangent line</Term>:
            </>,
            <>
              매끄러운 점 <span className={MONO}>a</span>에서 함수 <span className={MONO}>f</span>는
              값 <span className={MONO}>f(a)</span>와 기울기 <span className={MONO}>f'(a)</span>를 (
              <Link
                to="/modules/derivatives"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                미분 모듈
              </Link>
              로부터) 가진다. <span className={MONO}>(a, f(a))</span>를 지나며 그 기울기를 가지는
              *유일한* 직선이 <Term id="tangent">접선</Term>이다:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`L_a(x)  =  f(a)  +  f'(a) · (x − a)`}
        </pre>
        <p>
          {pick(
            language,
            <>
              That is the linearization of <span className={MONO}>f</span> at{" "}
              <span className={MONO}>a</span>. It matches the function in two ways:{" "}
              <span className={MONO}>L_a(a) = f(a)</span> (same value at the anchor) and{" "}
              <span className={MONO}>L_a'(a) = f'(a)</span> (same slope at the anchor). No other
              line can claim both. The widget draws this line with the dashed brown stroke; for{" "}
              <span className={MONO}>f(x) = sin x</span> at <span className={MONO}>a = 0</span>, the
              line is <span className={FORMULA_INLINE}>L_0(x) = 0 + 1 · (x − 0) = x</span>.
            </>,
            <>
              그것이 <span className={MONO}>a</span>에서 <span className={MONO}>f</span>의 선형화.
              함수와 두 가지 면에서 일치한다 — 기준에서 값이 같고 (
              <span className={MONO}>L_a(a) = f(a)</span>), 기준에서 기울기도 같다 (
              <span className={MONO}>L_a'(a) = f'(a)</span>). 둘 다 만족시키는 직선은 *유일*하다.
              위젯의 점선 갈색 직선이 그것; <span className={MONO}>f(x) = sin x</span>,{" "}
              <span className={MONO}>a = 0</span>일 때 직선은{" "}
              <span className={FORMULA_INLINE}>L_0(x) = 0 + 1 · (x − 0) = x</span>.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>{pick(language, "Error grows as a square", "오차는 제곱으로 자란다")}</h3>
        <p>
          {pick(
            language,
            <>
              For any smooth function, the error{" "}
              <span className={FORMULA_INLINE}>f(x) − L_a(x)</span> behaves like a quadratic in the
              deviation <span className={MONO}>x − a</span>. Doubling the deviation roughly
              quadruples the error; halving it cuts the error to a quarter. This is{" "}
              <em>quadratic, not linear</em> — and it is the reason linearization is useful: the gap
              closes very quickly as you approach the anchor.
            </>,
            <>
              매끄러운 함수에 대해 오차 <span className={FORMULA_INLINE}>f(x) − L_a(x)</span>는 편차{" "}
              <span className={MONO}>x − a</span>에 대해 *이차*로 거동한다. 편차를 두 배로 하면
              오차는 약 네 배, 절반으로 하면 오차는 1/4. 이건 *선형이 아니라 이차* — 그래서 선형화가
              유용하다. 기준에 가까워질수록 격차가 *아주 빠르게* 닫힌다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Concretely for <span className={MONO}>sin</span> at <span className={MONO}>0</span>:
              the leading error term is <span className={FORMULA_INLINE}>−x³/6</span>, so{" "}
              <span className={MONO}>error / (x − a)²</span> drifts slowly with{" "}
              <span className={MONO}>x</span> rather than staying constant — the cubic term
              dominates here. Other functions (<span className={MONO}>e^x</span>,{" "}
              <span className={MONO}>√(1 + x)</span>, <span className={MONO}>1/(1 − x)</span>) have
              a constant <span className={MONO}>error / (x − a)²</span> ratio because their second
              derivative at the anchor is nonzero. Either way, the rule of thumb is the same:
              <em>
                {" "}
                "small" deviations make linear approximation fine; "large" deviations make it wrong,
                fast.
              </em>
            </>,
            <>
              구체적으로 <span className={MONO}>sin</span>의 <span className={MONO}>0</span>에서:
              선두 오차항은 <span className={FORMULA_INLINE}>−x³/6</span>이라{" "}
              <span className={MONO}>오차 / (x − a)²</span> 비율이 <span className={MONO}>x</span>에
              따라 천천히 표류 — 여기선 *삼차* 항이 지배. 다른 함수들 (
              <span className={MONO}>e^x</span>, <span className={MONO}>√(1 + x)</span>,{" "}
              <span className={MONO}>1/(1 − x)</span>) 은 기준에서 2차 도함수가 0이 아니라{" "}
              <span className={MONO}>오차 / (x − a)²</span>가 일정. 어느 쪽이든 경험칙은 같다 —{" "}
              <em>"작은" 편차에서는 선형 근사가 괜찮고, "큰" 편차에서는 *빠르게* 틀린다.</em>
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
      </ArcRow>

      <ArcRow n={4}>
        <h3>{pick(language, "What this lets you build", "이걸로 만들 수 있는 것")}</h3>
        <p>
          {pick(
            language,
            <>
              Once you have a tool that turns nonlinear into linear in a small region, three
              widely-used algorithms fall out:
            </>,
            <>
              작은 영역에서 비선형을 선형으로 바꾸는 도구가 손에 들어오면, 세 가지 널리 쓰이는
              알고리즘이 떨어진다:
            </>,
          )}
        </p>
        <ul className="m-0 mb-3 list-none space-y-2 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <b>Newton's method</b> for solving <span className={MONO}>f(x) = 0</span>. Linearize
                at the current guess, find where <em>that line</em> crosses zero, use that as the
                next guess. Each step is one linearization. Convergence is quadratic — a step's
                error becomes the next step's error squared.
              </li>
              <li>
                <b>
                  <Link
                    to="/ml/gradient-descent"
                    className="border-b border-dotted text-acc no-underline hover:border-acc"
                  >
                    Gradient descent
                  </Link>
                </b>{" "}
                for minimizing a loss. The first-order Taylor approximation says{" "}
                <span className={FORMULA_INLINE}>L(w − η · ∇L) ≈ L(w) − η · ‖∇L‖²</span>. If{" "}
                <span className={MONO}>η</span> is small enough that the linearization is
                trustworthy, the loss decreases. Too big and the linearization lies — the explosion
                you see at <span className={MONO}>η = 0.27</span> in that page's widget.
              </li>
              <li>
                <b>
                  <Link
                    to="/physics/pendulum-clock"
                    className="border-b border-dotted text-acc no-underline hover:border-acc"
                  >
                    The pendulum clock
                  </Link>
                </b>{" "}
                runs on a single linearization: <span className={MONO}>sin θ ≈ θ</span>. The
                nonlinear ODE <span className={MONO}>θ̈ = −(g/L) sin θ</span> becomes{" "}
                <span className={MONO}>θ̈ = −(g/L) θ</span>, with a closed-form sinusoidal solution
                and a constant-period clock. The whole technology lives inside the small-angle
                regime where the lie holds.
              </li>
            </>,
            <>
              <li>
                <b>뉴턴 방법</b>으로 <span className={MONO}>f(x) = 0</span> 풀기. 현재 추측에서
                선형화하고, *그 직선*이 0을 지나는 곳을 다음 추측으로 사용. 매 스텝이 한 번의
                선형화. 수렴은 이차 — 한 스텝의 오차가 다음 스텝의 오차의 *제곱*이 된다.
              </li>
              <li>
                <b>
                  <Link
                    to="/ml/gradient-descent"
                    className="border-b border-dotted text-acc no-underline hover:border-acc"
                  >
                    경사하강법
                  </Link>
                </b>
                으로 손실 최소화. 1차 테일러 근사가{" "}
                <span className={FORMULA_INLINE}>L(w − η · ∇L) ≈ L(w) − η · ‖∇L‖²</span>이라고
                말한다. <span className={MONO}>η</span>가 충분히 작아 선형화를 믿을 수 있으면 손실이
                감소. 너무 크면 선형화가 거짓말 — 그 페이지의 위젯에서{" "}
                <span className={MONO}>η = 0.27</span>일 때 보이는 폭발.
              </li>
              <li>
                <b>
                  <Link
                    to="/physics/pendulum-clock"
                    className="border-b border-dotted text-acc no-underline hover:border-acc"
                  >
                    진자시계
                  </Link>
                </b>
                가 의지하는 것은 단 하나의 선형화: <span className={MONO}>sin θ ≈ θ</span>. 비선형
                ODE <span className={MONO}>θ̈ = −(g/L) sin θ</span>가{" "}
                <span className={MONO}>θ̈ = −(g/L) θ</span>로 바뀌면서 닫힌 사인꼴 해와 일정 주기의
                시계가 나온다. 기술 전체가 그 거짓말이 통하는 *작은 각 영역* 안에 산다.
              </li>
            </>,
          )}
        </ul>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>{pick(language, "The catch — only 'almost'", "함정 — 어디까지나 '거의'")}</h3>
        <p>
          {pick(
            language,
            <>
              Every linearization is wrong outside its anchor's neighbourhood. The discipline of
              using the tool well is the discipline of measuring and respecting that neighbourhood:
            </>,
            <>
              모든 선형화는 기준 근처를 벗어나면 *틀린다*. 도구를 잘 쓴다는 것은 그 근처의 *경계를
              재고 존중하는 일*에 대한 규율:
            </>,
          )}
        </p>
        <ul className="m-0 list-none space-y-1.5 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                Quote a <em>bound on the deviation</em> for which the linear answer is good enough —
                not just a slogan that "linearization works."
              </li>
              <li>
                Compute or estimate the next-order term and check that it is small (or that its sign
                won't bite you).
              </li>
              <li>
                Stay <em>inside</em> the regime by design: clock escapements force small arcs; ML
                training schedules shrink the learning rate; control systems stay near operating
                points; circuit designers bias transistors into the linear region. When you can't
                stay there, switch to a higher-order method or a nonlinear solver — and accept the
                cost.
              </li>
            </>,
            <>
              <li>
                "선형화가 잘 된다"는 슬로건이 아니라, 선형 답이 충분히 좋은 *편차의 한계*를 인용할
                것.
              </li>
              <li>
                다음 차수 항을 계산하거나 추정해 그것이 충분히 작은지 (또는 부호가 해를 끼치지
                않는지) 확인할 것.
              </li>
              <li>
                설계로 영역 *안*에 머물 것 — 시계 탈진기는 호를 작게, ML 훈련 스케줄은 학습률을
                줄이고, 제어 시스템은 동작점 근처에, 회로 설계자는 트랜지스터를 선형 영역에
                바이어스. 머물 수 없으면 더 높은 차수의 방법이나 비선형 해법으로 넘어가고, 그 비용을
                받아들일 것.
              </li>
            </>,
          )}
        </ul>
        <p>
          {pick(
            language,
            <>
              That phrase — "the regime where the lie holds" — is the same one the pendulum page
              closes on. It is not coincidence; it is the pattern this module names. Every
              applied-math discipline has a private inventory of such regimes, kept by people who
              know exactly how far they can lean.
            </>,
            <>
              그 문구 — "거짓말이 통하는 영역" — 은 진자시계 페이지가 닫히는 그 줄이다. 우연이
              아니라, 이 모듈이 *이름 붙인* 패턴이다. 모든 응용 수학 분야는 자기만의 그런 영역
              목록을 가지고 있고, *얼마만큼 기댈 수 있는지를 정확히 아는 사람들*이 그 목록을
              관리한다.
            </>,
          )}
        </p>
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
            <b>The tangent line is the cheapest answer that still gets the slope right.</b>{" "}
            Linearization replaces a hard problem with an easy one — valid in a regime, wrong
            outside it, always. The discipline is the regime.
          </>,
          <>
            <b>접선은 *기울기*를 정확히 맞추는 가장 싸구려 답이다.</b> 선형화는 어려운 문제를 쉬운
            문제로 바꾼다 — 어떤 영역에서는 맞고, 그 밖에서는 늘 틀린다. 규율은 그 *영역*에 있다.
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
        tag={{ en: "small-angle by hand", ko: "작은 각 손계산" }}
        prompt={{
          en: (
            <>
              Linearize <span className={MONO}>f(x) = sin x</span> at{" "}
              <span className={MONO}>a = 0</span>. Use the linearization to estimate{" "}
              <span className={MONO}>sin 0.1</span>. The true value (3 decimals) is{" "}
              <span className={MONO}>0.0998</span>. What is the error? About what fraction of{" "}
              <span className={MONO}>x</span> is it?
            </>
          ),
          ko: (
            <>
              <span className={MONO}>f(x) = sin x</span>를 <span className={MONO}>a = 0</span>에서
              선형화하라. 그것으로 <span className={MONO}>sin 0.1</span>을 어림하라. 실제값 (소수
              3자리)은 <span className={MONO}>0.0998</span>. 오차는? 그것이{" "}
              <span className={MONO}>x</span>의 약 몇 분의 1인가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>L_0(x) = sin(0) + cos(0) · x = x</span>. So{" "}
              <span className={MONO}>L_0(0.1) = 0.1</span>. Error{" "}
              <span className={MONO}>= 0.1 − 0.0998 = 0.0002</span> (about{" "}
              <span className={MONO}>x³/6 ≈ 0.001/6 ≈ 0.000167</span> by the cubic-term rule — we
              also have higher-order correction). The error is about{" "}
              <span className={MONO}>1/500</span> of <span className={MONO}>x</span>, well below the{" "}
              <span className={MONO}>0.5%</span> threshold most engineers care about.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>L_0(x) = sin(0) + cos(0) · x = x</span>. 그러므로{" "}
              <span className={MONO}>L_0(0.1) = 0.1</span>. 오차{" "}
              <span className={MONO}>= 0.1 − 0.0998 = 0.0002</span> (3차항 규칙으로 약{" "}
              <span className={MONO}>x³/6 ≈ 0.001/6 ≈ 0.000167</span>, 더 높은 차수 보정 포함).
              오차는 <span className={MONO}>x</span>의 약 <span className={MONO}>1/500</span> —
              대부분의 엔지니어가 신경 쓰는 <span className={MONO}>0.5%</span> 임계 *훨씬* 아래.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "exponential at zero", ko: "0에서의 지수함수" }}
        prompt={{
          en: (
            <>
              Linearize <span className={MONO}>f(x) = e^x</span> at{" "}
              <span className={MONO}>a = 0</span>. Estimate <span className={MONO}>e^0.2</span>. The
              true value is about <span className={MONO}>1.2214</span>. Compare with{" "}
              <span className={MONO}>e^0.5</span> (true: <span className={MONO}>1.6487</span>). What
              does the relative error pattern look like as the deviation grows?
            </>
          ),
          ko: (
            <>
              <span className={MONO}>f(x) = e^x</span>를 <span className={MONO}>a = 0</span>
              에서 선형화. <span className={MONO}>e^0.2</span>를 어림. 실제값은 약{" "}
              <span className={MONO}>1.2214</span>. <span className={MONO}>e^0.5</span> (실제값{" "}
              <span className={MONO}>1.6487</span>) 와 비교. 편차가 커지면 *상대* 오차 패턴은?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>L_0(x) = e^0 + e^0 · x = 1 + x</span>. So{" "}
              <span className={MONO}>L_0(0.2) = 1.2</span> (true 1.2214; error{" "}
              <span className={MONO}>0.0214</span>, about <b>1.8%</b>). And{" "}
              <span className={MONO}>L_0(0.5) = 1.5</span> (true 1.6487; error{" "}
              <span className={MONO}>0.1487</span>, about <b>9%</b>). The deviation grew{" "}
              <span className={MONO}>2.5×</span>; the error grew <span className={MONO}>~7×</span> —
              close to the predicted <span className={MONO}>2.5² = 6.25×</span> for a
              quadratic-error scaling. That's the rule "doubling deviation quadruples error" in
              action.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>L_0(x) = e^0 + e^0 · x = 1 + x</span>. 그러므로{" "}
              <span className={MONO}>L_0(0.2) = 1.2</span> (실제 1.2214; 오차{" "}
              <span className={MONO}>0.0214</span>, 약 <b>1.8%</b>).{" "}
              <span className={MONO}>L_0(0.5) = 1.5</span> (실제 1.6487; 오차{" "}
              <span className={MONO}>0.1487</span>, 약 <b>9%</b>). 편차는{" "}
              <span className={MONO}>2.5배</span>, 오차는 <span className={MONO}>약 7배</span> —
              이차 오차 스케일링이 예측한 <span className={MONO}>2.5² = 6.25배</span>에 가깝다.
              *편차를 두 배로 하면 오차는 네 배* 규칙이 작동.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "Newton step as linearization", ko: "뉴턴 스텝 = 선형화" }}
        prompt={{
          en: (
            <>
              Suppose you want to solve <span className={MONO}>f(x) = 0</span> for some nonlinear{" "}
              <span className={MONO}>f</span>. You have a guess <span className={MONO}>x_n</span>.
              Linearize <span className={MONO}>f</span> at <span className={MONO}>x_n</span> and
              find where <em>that line</em> crosses zero. Show that the next guess is{" "}
              <span className={FORMULA_INLINE}>x_(n+1) = x_n − f(x_n) / f'(x_n)</span>. What breaks
              this iteration?
            </>
          ),
          ko: (
            <>
              어떤 비선형 <span className={MONO}>f</span>에 대해{" "}
              <span className={MONO}>f(x) = 0</span>을 풀고 싶다고 하자. 추측{" "}
              <span className={MONO}>x_n</span>이 있다. <span className={MONO}>x_n</span>에서{" "}
              <span className={MONO}>f</span>를 선형화하고, 그 직선이 0과 만나는 점을 다음 추측으로
              잡으면 다음 추측이{" "}
              <span className={FORMULA_INLINE}>x_(n+1) = x_n − f(x_n) / f'(x_n)</span>임을 보여라.
              이 반복은 언제 깨지는가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              The tangent line at <span className={MONO}>x_n</span> is{" "}
              <span className={MONO}>L(x) = f(x_n) + f'(x_n)(x − x_n)</span>. Set{" "}
              <span className={MONO}>L(x) = 0</span> and solve for <span className={MONO}>x</span>:
              <span className={MONO}>x = x_n − f(x_n)/f'(x_n)</span>. Breaks when{" "}
              <span className={MONO}>f'(x_n) ≈ 0</span> (the tangent is nearly horizontal — the next
              guess flies off to infinity), or when the guess is far from a root and the linear
              approximation lies badly. In practice, Newton needs a starting guess in the basin
              where the linearization is faithful.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>x_n</span>에서의 접선은{" "}
              <span className={MONO}>L(x) = f(x_n) + f'(x_n)(x − x_n)</span>.{" "}
              <span className={MONO}>L(x) = 0</span>으로 두고 <span className={MONO}>x</span>에 대해
              풀면 <span className={MONO}>x = x_n − f(x_n)/f'(x_n)</span>. 깨지는 경우 —{" "}
              <span className={MONO}>f'(x_n) ≈ 0</span> (접선이 거의 수평이라 다음 추측이 무한대로
              날아감), 또는 추측이 근에서 멀어 선형 근사가 *심하게 거짓말*하는 경우. 실제로는
              선형화가 *충실한 영역*에서 출발해야 한다.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "why gradient descent's η has a ceiling", ko: "왜 경사하강법 η에 천장이 있나" }}
        prompt={{
          en: (
            <>
              The first-order Taylor approximation of the loss{" "}
              <span className={FORMULA_INLINE}>L(w + d) ≈ L(w) + ∇L(w) · d</span> is honest only for
              small <span className={MONO}>‖d‖</span>. The gradient descent step chooses{" "}
              <span className={MONO}>d = −η · ∇L</span>. Use the second-order term to argue why the
              toy quadratic loss in{" "}
              <Link
                to="/ml/gradient-descent"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                /ml/gradient-descent
              </Link>{" "}
              has a hard <span className={MONO}>η</span> ceiling at{" "}
              <span className={MONO}>2/L''(w*)</span>.
            </>
          ),
          ko: (
            <>
              손실의 1차 테일러 근사{" "}
              <span className={FORMULA_INLINE}>L(w + d) ≈ L(w) + ∇L(w) · d</span>는 작은{" "}
              <span className={MONO}>‖d‖</span>에서만 정직하다. 경사하강법은{" "}
              <span className={MONO}>d = −η · ∇L</span>을 고른다. 2차 항으로{" "}
              <Link
                to="/ml/gradient-descent"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                /ml/gradient-descent
              </Link>
              의 토이 이차 손실에 <span className={MONO}>η</span> 천장이{" "}
              <span className={MONO}>2/L''(w*)</span>에 있는 이유를 논증하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              For a 1D quadratic loss <span className={MONO}>L(w) = c·(w − w*)²/2</span>,{" "}
              <span className={MONO}>L''(w) = c</span> everywhere. Linearization at{" "}
              <span className={MONO}>w</span> says the next step{" "}
              <span className={MONO}>w − η·c(w − w*)</span> moves the displacement{" "}
              <span className={MONO}>u = w − w*</span> by the factor{" "}
              <span className={MONO}>r = 1 − η·c</span>. Stable convergence requires{" "}
              <span className={MONO}>|r| &lt; 1</span>, i.e.{" "}
              <span className={MONO}>0 &lt; η &lt; 2/c = 2/L''(w*)</span>. Above this ceiling, every
              step *overshoots* the linearization's claim, and the iterates explode. This is exactly
              the boundary the gradient-descent widget shows at{" "}
              <span className={MONO}>η = 0.25</span>: the linearization stops being trustworthy for
              the chosen step size.
            </>
          ),
          ko: (
            <>
              1D 이차 손실 <span className={MONO}>L(w) = c·(w − w*)²/2</span>에서{" "}
              <span className={MONO}>L''(w) = c</span> 모든 곳에서. <span className={MONO}>w</span>
              에서의 선형화로 다음 스텝 <span className={MONO}>w − η·c(w − w*)</span>가 변위{" "}
              <span className={MONO}>u = w − w*</span>를 인자{" "}
              <span className={MONO}>r = 1 − η·c</span>로 곱한다. 안정 수렴엔{" "}
              <span className={MONO}>|r| &lt; 1</span>, 즉{" "}
              <span className={MONO}>0 &lt; η &lt; 2/c = 2/L''(w*)</span>. 천장 위에선 매 스텝이
              선형화의 주장을 *지나치고*, 갱신값이 폭발한다. 경사하강법 위젯이{" "}
              <span className={MONO}>η = 0.25</span>에서 보여주는 그 경계 — 선형화가 *그 스텝
              크기에서* 더 이상 믿을 만하지 않게 되는 지점.
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
            module: <b>Linearization</b>. Consumed (now or by name) by{" "}
            <Link to="/physics/pendulum-clock">The Pendulum Clock</Link>,{" "}
            <Link to="/ml/gradient-descent">Gradient Descent</Link>, and any future page that
            reaches for "first-order approximation" or "small-deviation regime."
          </>,
          <>
            모듈: <b>선형화</b>. 소비처 (이미 또는 이름으로):{" "}
            <Link to="/physics/pendulum-clock">진자시계</Link>,{" "}
            <Link to="/ml/gradient-descent">경사하강법</Link>, 그리고 "1차 근사"나 "작은 편차
            영역"을 끌어다 쓸 미래의 모든 페이지.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function Linearization({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Linearization · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <TangentApproximation />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
