import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { SecantToTangent } from "../components/widgets/secant-to-tangent";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
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
        {pick(language, "module · the derivative", "모듈 · 미분")}
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
          "the hook · the arrow the trail wants to be",
          "도입 · 자취가 되려는 화살표",
        )}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>What is a curve doing right now?</>,
          <>곡선은 *지금* 무엇을 하고 있는가?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            A moving point leaves a trail. <b>The derivative is not the trail.</b> It is the arrow
            the trail wants to become at this instant. Average speed knows two points and divides;
            instantaneous speed knows only one point, but somehow has a number anyway. That number —
            what every <em>rate</em> in physics, ML, and engineering ultimately is — comes from
            forcing the secant line through two points to collapse onto the tangent line at one.
          </>,
          <>
            움직이는 점은 자취를 남긴다. <b>미분은 그 자취가 아니다.</b> 지금 이 순간, 자취가 되려고
            하는 화살표다. 평균 속도는 두 점을 알고 나누지만, 순간 속도는 한 점만 알고도 어떻게든
            숫자를 가진다. 그 숫자 — 물리·ML·공학의 모든 <em>변화율</em>이 결국 이것 — 는 두 점을
            지나는 할선이 한 점에서의 접선으로 무너지도록 *강제*하는 데서 나온다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            In the widget below: the orange <b>secant</b> through two points on{" "}
            <span className={MONO}>y = x²</span>. Drag <b>h</b> toward 0 and the secant rotates onto
            the brown <b>tangent</b>. The slope it converges to is the derivative at that point —
            the curve's instantaneous direction, made into a number.
          </>,
          <>
            아래 위젯: <span className={MONO}>y = x²</span> 위의 두 점을 잇는 주황색 <b>할선</b>.{" "}
            <b>h</b>를 0으로 끌면 할선이 갈색 <b>접선</b>으로 회전해 무너진다. 그 기울기가 수렴하는
            값이 그 점에서의 미분 — 곡선의 *순간 방향*이 한 숫자로 응축된 것.
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
        <h3>{pick(language, "Δ over Δ — average rate", "Δ 분의 Δ — 평균 변화율")}</h3>
        <p>
          {pick(
            language,
            <>
              You drove from <span className={MONO}>x = 1 km</span> at{" "}
              <span className={MONO}>t = 0 s</span> to <span className={MONO}>x = 9 km</span> at{" "}
              <span className={MONO}>t = 4 s</span>. Your <em>average</em> speed is{" "}
              <span className={FORMULA_INLINE}>(9 − 1) / (4 − 0) = 2 km/s</span>. That number
              describes the trip as a whole — but it does not tell you what you were doing at{" "}
              <span className={MONO}>t = 2 s</span>. The line through{" "}
              <span className={MONO}>(0, 1)</span> and <span className={MONO}>(4, 9)</span> on the
              position graph is a <Term id="secant">secant</Term>, and its slope is the average.{" "}
              <em>You can compute it without any limit.</em>
            </>,
            <>
              <span className={MONO}>t = 0 s</span>에 <span className={MONO}>x = 1 km</span>에서
              출발해 <span className={MONO}>t = 4 s</span>에 <span className={MONO}>x = 9 km</span>
              에 도착했다. 당신의 *평균* 속도는{" "}
              <span className={FORMULA_INLINE}>(9 − 1) / (4 − 0) = 2 km/s</span>. 이 수는 여행
              전체를 묘사하지만, <span className={MONO}>t = 2 s</span>에서 *무엇을 하고 있었는지* 는
              알려주지 않는다. 위치 그래프 위 <span className={MONO}>(0, 1)</span>과{" "}
              <span className={MONO}>(4, 9)</span>를 잇는 직선이 <Term id="secant">할선</Term>, 그
              기울기가 평균. <em>극한 없이 계산할 수 있다.</em>
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={2}>
        <h3>
          {pick(language, "Shrink the interval — instantaneous rate", "구간을 0으로 — 순간 변화율")}
        </h3>
        <p>
          {pick(
            language,
            <>
              "What was I doing at <span className={MONO}>t = 2 s</span>?" requires the secant's two
              points to merge into one. Pick a fixed anchor <span className={MONO}>a = 2</span> and
              a small interval <span className={MONO}>h</span>; compute{" "}
              <span className={FORMULA_INLINE}>(f(a+h) − f(a)) / h</span> as{" "}
              <span className={MONO}>h</span> shrinks. For <span className={MONO}>f(t) = t²</span>:
            </>,
            <>
              "<span className={MONO}>t = 2 s</span>에서 *무엇을 하고 있었나*"는 할선의 두 점이
              하나로 합쳐져야 답할 수 있다. 고정 기준 <span className={MONO}>a = 2</span>와 작은
              구간 <span className={MONO}>h</span>를 잡고{" "}
              <span className={FORMULA_INLINE}>(f(a+h) − f(a)) / h</span>를 계산하며{" "}
              <span className={MONO}>h</span>를 줄여보자. <span className={MONO}>f(t) = t²</span>에
              대해:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`(f(2+h) − f(2)) / h
   = ((2+h)² − 4) / h
   = (4 + 4h + h² − 4) / h
   = 4 + h            ← independent of how big h is, except for the +h tail`}
        </pre>
        <p>
          {pick(
            language,
            <>
              As <span className={MONO}>h → 0</span>, the expression converges to{" "}
              <span className={MONO}>4</span>. Not "approaches" in some hand-wavy sense — the value{" "}
              <em>is</em> <span className={MONO}>4 + h</span>, and <span className={MONO}>h</span>{" "}
              can be made as small as you want. The number that survives in the limit, <b>4</b>, is
              the <Term id="derivative">derivative</Term> of <span className={MONO}>t²</span> at{" "}
              <span className={MONO}>t = 2</span>: <span className={FORMULA_INLINE}>f'(2) = 4</span>
              . Geometrically, the slope of the <Term id="tangent">tangent line</Term> through{" "}
              <span className={MONO}>(2, 4)</span>.
            </>,
            <>
              <span className={MONO}>h → 0</span>일 때 식은 <span className={MONO}>4</span>로
              수렴한다. 어딘가 모호하게 "다가간다"는 게 아니라 값은 *정확히*{" "}
              <span className={MONO}>4 + h</span>이고 <span className={MONO}>h</span>는 원하는 만큼
              작게 만들 수 있다. 극한에서 살아남는 수 <b>4</b>가 <span className={MONO}>t = 2</span>
              에서 <span className={MONO}>t²</span>의 <Term id="derivative">미분</Term>:{" "}
              <span className={FORMULA_INLINE}>f'(2) = 4</span>. 기하적으로는{" "}
              <span className={MONO}>(2, 4)</span>를 지나는 <Term id="tangent">접선</Term>의 기울기.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>
          {pick(
            language,
            "One machine, three names — slope, velocity, rate",
            "기계는 하나, 이름은 셋 — 기울기·속도·변화율",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              The recipe — pick two points, compute the secant slope, shrink the interval, take the
              limit — gives the same kind of number whatever you plug in. If{" "}
              <span className={MONO}>f</span> is a position-vs-time function, the derivative is{" "}
              <Term id="velocity">velocity</Term>. If <span className={MONO}>f</span> is a graph of
              revenue vs price, the derivative is "marginal revenue." If{" "}
              <span className={MONO}>f</span> is a curve drawn on paper, the derivative is the
              tangent's slope at each point.{" "}
              <em>
                Same operation; different physical or geometric interpretation depending on what was
                on the axes.
              </em>
            </>,
            <>
              레시피 — 두 점을 잡고, 할선 기울기를 계산하고, 구간을 줄이고, 극한을 취한다 — 는
              무엇을 넣든 같은 종류의 수를 낸다. <span className={MONO}>f</span>가 시간 대 위치
              함수면 미분은 <Term id="velocity">속도</Term>. 가격 대 수익 그래프면 미분은
              "한계수익." 종이에 그린 곡선이면 미분은 각 점에서의 접선 기울기.{" "}
              <em>연산은 같다; 축에 무엇을 놓느냐에 따라 물리적 또는 기하적 해석이 달라질 뿐.</em>
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The standard pattern: derivative of <span className={MONO}>x^n</span> is{" "}
              <span className={MONO}>n·x^(n−1)</span>. The widget shows it for{" "}
              <span className={MONO}>n = 2</span>: drag the anchor and read off{" "}
              <span className={MONO}>2a</span>. The same machinery, applied to{" "}
              <span className={MONO}>sin x</span>, gives <span className={MONO}>cos x</span>;
              applied to <span className={MONO}>e^x</span>, gives <span className={MONO}>e^x</span>{" "}
              back; applied to a constant, gives 0. The names of these — "differentiation rules" —
              are bookkeeping. The single underlying operation is the limit of secant slopes.
            </>,
            <>
              표준 패턴: <span className={MONO}>x^n</span>의 미분은{" "}
              <span className={MONO}>n·x^(n−1)</span>. 위젯이 <span className={MONO}>n = 2</span>{" "}
              경우를 보여준다 — 기준 a를 끌면 <span className={MONO}>2a</span>가 읽힌다. 같은 기계가{" "}
              <span className={MONO}>sin x</span>에 적용되면 <span className={MONO}>cos x</span>를
              내고, <span className={MONO}>e^x</span>에 적용되면 <span className={MONO}>e^x</span>를
              그대로 돌려주고, 상수에 적용되면 0. 이 이름들 — "미분법" — 은 장부일 뿐. 바닥의 한
              연산은 *할선 기울기의 극한*.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={4}>
        <h3>{pick(language, "Differentiate twice — acceleration", "두 번 미분하면 — 가속도")}</h3>
        <p>
          {pick(
            language,
            <>
              The derivative of a function is itself a function. You can differentiate it again. For{" "}
              <span className={MONO}>f(t) = t²</span>:{" "}
              <span className={FORMULA_INLINE}>f'(t) = 2t</span> (a line);{" "}
              <span className={FORMULA_INLINE}>f''(t) = 2</span> (a constant). Two derivatives of
              position give <Term id="acceleration">acceleration</Term> — the rate of change of
              velocity, which for free fall is the constant <span className={MONO}>−g</span>.
            </>,
            <>
              함수의 미분은 그 자체로 함수다. 한 번 더 미분할 수 있다.{" "}
              <span className={MONO}>f(t) = t²</span>의 경우:{" "}
              <span className={FORMULA_INLINE}>f'(t) = 2t</span> (직선),{" "}
              <span className={FORMULA_INLINE}>f''(t) = 2</span> (상수). 위치를 두 번 미분하면{" "}
              <Term id="acceleration">가속도</Term> — 속도의 변화율. 자유낙하에서는 상수{" "}
              <span className={MONO}>−g</span>.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              That tower — position, velocity, acceleration — is the entire content of "Newton's
              second law" once you have the derivative as a tool: force is mass times the second
              derivative of position. Most introductory physics is the algebraic and geometric
              consequences of this single fact.
            </>,
            <>
              그 사다리 — 위치, 속도, 가속도 — 는 미분이라는 도구만 있으면 "뉴턴 제2법칙" 전체와
              같은 내용이 된다: 힘 = 질량 × 위치의 두 번째 미분. 입문 물리의 대부분은 이 한 사실의
              대수·기하적 따름결과.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={5}>
        <h3>{pick(language, "Where this module gets consumed", "이 모듈이 어디서 소비되는가")}</h3>
        <p>
          {pick(
            language,
            <>
              Two pages already ran on derivatives without naming them. Now they have a place to
              point at.
            </>,
            <>이미 두 페이지가 미분을 *암묵적으로* 사용해왔다. 이제 가리킬 대상이 생겼다.</>,
          )}
        </p>
        <ul className="m-0 mb-2 list-none space-y-2 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <Link
                  to="/physics/projectile-motion"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>Projectile motion</b>
                </Link>{" "}
                — the equations of motion <span className={MONO}>x(t) = v₀ cos θ · t</span> and{" "}
                <span className={MONO}>y(t) = v₀ sin θ · t − ½ g t²</span> have derivatives{" "}
                <span className={MONO}>vₓ = v₀ cos θ</span> (constant) and{" "}
                <span className={MONO}>v_y(t) = v₀ sin θ − g t</span> (linear, the velocity shown on
                the projectile widget). Differentiating the *position* gives the *velocity*
                directly.
              </li>
              <li>
                <Link
                  to="/physics/pendulum-clock"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>The pendulum clock</b>
                </Link>{" "}
                — the equation <span className={MONO}>θ̈ = −(g/L) sin θ</span> is just{" "}
                <em>two derivatives of θ on the left, equals a function of θ on the right</em>. The
                "linearization" trick replaces <span className={MONO}>sin θ</span> with{" "}
                <span className={MONO}>θ</span>, leaving <span className={MONO}>θ̈ = −(g/L) θ</span>{" "}
                — the simple harmonic oscillator equation, which the derivative tool can recognize
                and solve.
              </li>
            </>,
            <>
              <li>
                <Link
                  to="/physics/projectile-motion"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>포물선 운동</b>
                </Link>{" "}
                — 운동 방정식 <span className={MONO}>x(t) = v₀ cos θ · t</span>와{" "}
                <span className={MONO}>y(t) = v₀ sin θ · t − ½ g t²</span>의 미분이{" "}
                <span className={MONO}>vₓ = v₀ cos θ</span> (상수)와{" "}
                <span className={MONO}>v_y(t) = v₀ sin θ − g t</span> (선형, 포물선 위젯이 보여주는
                그 속도). *위치*를 미분하면 곧 *속도*.
              </li>
              <li>
                <Link
                  to="/physics/pendulum-clock"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>진자시계</b>
                </Link>{" "}
                — 식 <span className={MONO}>θ̈ = −(g/L) sin θ</span>는{" "}
                <em>왼쪽은 θ의 두 번 미분, 오른쪽은 θ의 함수</em>. "선형화" 한 수가{" "}
                <span className={MONO}>sin θ</span>를 <span className={MONO}>θ</span>로 바꿔{" "}
                <span className={MONO}>θ̈ = −(g/L) θ</span>를 남긴다 — 미분 도구가 알아보고 풀 수
                있는 단순조화진동자 방정식.
              </li>
            </>,
          )}
        </ul>
        <p>
          {pick(
            language,
            <>
              The graph at <Link to="/graph">/graph</Link> now reflects this: both physics
              applications consume both <span className={MONO}>parametric-curves</span> and{" "}
              <span className={MONO}>derivatives</span>. The module is doing the job a module is
              supposed to do.
            </>,
            <>
              <Link to="/graph">/graph</Link>가 이제 이걸 반영한다: 두 physics 응용이 모두{" "}
              <span className={MONO}>parametric-curves</span>와{" "}
              <span className={MONO}>derivatives</span>를 소비한다. 모듈이 *모듈이 해야 하는* 일을
              하기 시작했다.
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
            <b>Δ knows the interval. d knows the instant.</b> The derivative is what Δ becomes when
            the interval shrinks to nothing — and the limit that survives is everything physics
            calls a rate.
          </>,
          <>
            <b>Δ는 구간을 안다. d는 순간을 안다.</b> 미분은 구간이 0으로 줄어들 때 Δ가 되는 것 —
            그리고 그 살아남는 극한이, 물리가 *변화율*이라 부르는 모든 것.
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
        tag={{ en: "average rate by hand", ko: "평균 변화율 손계산" }}
        prompt={{
          en: (
            <>
              For <span className={MONO}>f(t) = t²</span>, compute the average rate of change over
              the interval <span className={MONO}>[1, 3]</span>. Then over{" "}
              <span className={MONO}>[1, 1.1]</span>. Then over{" "}
              <span className={MONO}>[1, 1.001]</span>. What pattern do you see?
            </>
          ),
          ko: (
            <>
              <span className={MONO}>f(t) = t²</span>에서 구간 <span className={MONO}>[1, 3]</span>
              의 평균 변화율을 계산. 다음 <span className={MONO}>[1, 1.1]</span>, 다음{" "}
              <span className={MONO}>[1, 1.001]</span>. 어떤 패턴이 보이는가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>(9 − 1)/(3 − 1) = 4</span>. Then{" "}
              <span className={MONO}>(1.21 − 1)/0.1 = 2.1</span>. Then{" "}
              <span className={MONO}>(1.002001 − 1)/0.001 = 2.001</span>. The values are{" "}
              <b>
                <span className={MONO}>2 + h</span>
              </b>{" "}
              with <span className={MONO}>h = 2, 0.1, 0.001</span>. Limit at{" "}
              <span className={MONO}>h → 0</span> is <b>2</b> — the derivative{" "}
              <span className={MONO}>f'(1)</span>.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>(9 − 1)/(3 − 1) = 4</span>. 다음{" "}
              <span className={MONO}>(1.21 − 1)/0.1 = 2.1</span>. 다음{" "}
              <span className={MONO}>(1.002001 − 1)/0.001 = 2.001</span>. 값들이{" "}
              <b>
                <span className={MONO}>2 + h</span>
              </b>{" "}
              패턴 (<span className={MONO}>h = 2, 0.1, 0.001</span>).{" "}
              <span className={MONO}>h → 0</span>의 극한은 <b>2</b> — 미분{" "}
              <span className={MONO}>f'(1)</span>.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "instantaneous rate at t = 3", ko: "t = 3에서 순간 변화율" }}
        prompt={{
          en: (
            <>
              For <span className={MONO}>f(t) = t²</span>, derive{" "}
              <span className={MONO}>f'(3)</span> from the secant-slope definition. Show every step
              of the algebra.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>f(t) = t²</span>에서 할선 기울기 정의로부터{" "}
              <span className={MONO}>f'(3)</span>를 유도하라. 모든 대수 단계 표시.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>
                (f(3+h) − f(3)) / h = ((3+h)² − 9) / h = (9 + 6h + h² − 9) / h = (6h + h²) / h = 6 +
                h
              </span>
              . Now let <span className={MONO}>h → 0</span>: <b>f'(3) = 6</b>. (Same pattern: for
              any <span className={MONO}>a</span>, <span className={MONO}>(2a)·h + h²</span> divided
              by <span className={MONO}>h</span> is <span className={MONO}>2a + h → 2a</span>. That
              is why <span className={FORMULA_INLINE}>d/dt [t²] = 2t</span>.)
            </>
          ),
          ko: (
            <>
              <span className={MONO}>
                (f(3+h) − f(3)) / h = ((3+h)² − 9) / h = (9 + 6h + h² − 9) / h = (6h + h²) / h = 6 +
                h
              </span>
              . 이제 <span className={MONO}>h → 0</span>: <b>f'(3) = 6</b>. (같은 패턴: 임의의{" "}
              <span className={MONO}>a</span>에 대해 <span className={MONO}>(2a)·h + h²</span>를{" "}
              <span className={MONO}>h</span>로 나누면 <span className={MONO}>2a + h → 2a</span>.
              그래서 <span className={FORMULA_INLINE}>d/dt [t²] = 2t</span>.)
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "tangent slope from the curve", ko: "곡선에서 접선 기울기" }}
        prompt={{
          en: (
            <>
              The widget shows <span className={MONO}>y = x²</span>. Without using the formula, just
              by sliding <b>a</b> and shrinking <b>h</b>, read off the tangent slope at{" "}
              <span className={MONO}>x = 0.5</span> and at <span className={MONO}>x = 1.5</span>.
              State a rule that fits both numbers.
            </>
          ),
          ko: (
            <>
              위젯은 <span className={MONO}>y = x²</span>를 보여준다. 공식 없이, <b>a</b>를 움직이고{" "}
              <b>h</b>를 줄여서 <span className={MONO}>x = 0.5</span>와{" "}
              <span className={MONO}>x = 1.5</span>에서 접선 기울기를 읽어라. 두 수를 모두
              만족시키는 규칙을 한 줄로 진술.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              At <span className={MONO}>x = 0.5</span>, the slope reads <b>1</b>. At{" "}
              <span className={MONO}>x = 1.5</span>, it reads <b>3</b>. The rule:{" "}
              <span className={FORMULA_INLINE}>m(x) = 2x</span>. Confirms{" "}
              <span className={FORMULA_INLINE}>d/dx [x²] = 2x</span> directly from the picture,
              without ever doing the algebraic limit.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>x = 0.5</span>에서 기울기 <b>1</b>.{" "}
              <span className={MONO}>x = 1.5</span>에서 <b>3</b>. 규칙:{" "}
              <span className={FORMULA_INLINE}>m(x) = 2x</span>. 그림에서 직접{" "}
              <span className={FORMULA_INLINE}>d/dx [x²] = 2x</span>를 확인 — 대수 극한을 한 번도
              거치지 않고.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        noCalculator
        tag={{ en: "differentiate the projectile", ko: "포물선 운동 미분" }}
        prompt={{
          en: (
            <>
              The vertical position of a projectile is{" "}
              <span className={FORMULA_INLINE}>y(t) = v₀ sin θ · t − ½ g t²</span>. Use the same
              <span className={MONO}> (f(a+h) − f(a)) / h</span> recipe to derive{" "}
              <span className={MONO}>v_y(t) = dy/dt</span>. Confirm the answer matches the
              projectile widget's <b>v_y</b> readout.
            </>
          ),
          ko: (
            <>
              포물선 운동의 세로 위치는{" "}
              <span className={FORMULA_INLINE}>y(t) = v₀ sin θ · t − ½ g t²</span>. 같은{" "}
              <span className={MONO}>(f(a+h) − f(a)) / h</span> 레시피로{" "}
              <span className={MONO}>v_y(t) = dy/dt</span>를 유도하라. 포물선 위젯의 <b>v_y</b> 값과
              일치하는지 확인.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>y(t+h) = v₀ sin θ · (t+h) − ½ g (t+h)²</span>. Subtract{" "}
              <span className={MONO}>y(t)</span> and divide by <span className={MONO}>h</span>: the{" "}
              <span className={MONO}>v₀ sin θ</span> term contributes{" "}
              <span className={MONO}>v₀ sin θ</span>; the <span className={MONO}>½ g</span> term
              contributes <span className={MONO}>½ g (2t + h) = g t + ½ g h</span>; subtract sign
              and let <span className={MONO}>h → 0</span>:{" "}
              <b>
                <span className={MONO}>v_y(t) = v₀ sin θ − g t</span>
              </b>
              . Exactly the formula the projectile-motion widget displays at any{" "}
              <span className={MONO}>t</span>.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>y(t+h) = v₀ sin θ · (t+h) − ½ g (t+h)²</span>. 여기서{" "}
              <span className={MONO}>y(t)</span>를 빼고 <span className={MONO}>h</span>로 나눈다:{" "}
              <span className={MONO}>v₀ sin θ</span> 항은 <span className={MONO}>v₀ sin θ</span>를
              기여, <span className={MONO}>½ g</span> 항은{" "}
              <span className={MONO}>½ g (2t + h) = g t + ½ g h</span>를 기여. 부호 빼기 후{" "}
              <span className={MONO}>h → 0</span>:{" "}
              <b>
                <span className={MONO}>v_y(t) = v₀ sin θ − g t</span>
              </b>
              . 포물선-운동 위젯이 임의의 <span className={MONO}>t</span>에서 표시하는 그 식.
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
            module: <b>The Derivative</b>. Consumed by{" "}
            <Link to="/physics/projectile-motion">Projectile Motion</Link> and{" "}
            <Link to="/physics/pendulum-clock">The Pendulum Clock</Link>. Future ML and finance
            applications will plug in for "rate of change of loss" and "instantaneous return."
          </>,
          <>
            모듈: <b>미분</b>. 소비처: <Link to="/physics/projectile-motion">포물선 운동</Link>,{" "}
            <Link to="/physics/pendulum-clock">진자시계</Link>. 향후 ML/금융 응용도 "손실의 변화율,"
            "순간 수익률"을 위해 이걸 소비하게 된다.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function Derivatives({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "The Derivative · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <SecantToTangent />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
