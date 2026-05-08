import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { ConicIntersect } from "../components/widgets/conic-intersect";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc4: string; arc6: string };

function Code({ html }: { html: string }) {
  return <div className="shiki-wrap" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="mt-7 font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
      <Link to="/">{pick(language, "Lemma", "Lemma")}</Link>
      <span className="mx-2 text-rule">/</span>
      <span className="uppercase tracking-[0.06em] text-ink">
        {pick(language, "module · Bezout's theorem", "모듈 · 베주 정리")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · the product rule", "도입 · 곱셈 규칙")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px] [&_.acc]:font-semibold [&_.acc]:text-acc">
        {pick(
          language,
          <>
            A line meets a parabola in <span className="acc">two</span> points. Two circles in{" "}
            <span className="acc">two</span>. A cubic and a line in{" "}
            <span className="acc">three</span>. Multiply the <em>degrees</em> of the curves and you
            get the count.
          </>,
          <>
            직선과 포물선은 <span className="acc">두</span> 점에서 만난다. 두 원도{" "}
            <span className="acc">두</span> 점. 3차 곡선과 직선은 <span className="acc">세</span>{" "}
            점. 두 곡선의 <em>차수</em>를 곱하면 그 수가 나온다.
          </>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc">
        {pick(
          language,
          <>
            Except <em>parallel</em> lines meet in zero. A line <em>tangent</em> to a parabola in
            one. Two <em>disjoint</em> circles in zero. The product rule breaks. The repair is not a
            footnote — it rewrites what the plane <em>is</em>.
          </>,
          <>
            그런데 <em>평행한</em> 두 직선은 0개. 포물선에 <em>접하는</em> 직선은 1개. 서로{" "}
            <em>떨어진</em> 두 원은 0개. 곱셈 규칙이 깨진다. 각주 한 줄로 메울 일이 아니다 — 평면
            자체를 다시 정의해야 한다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_em]:italic [&_em]:text-acc">
        {pick(
          language,
          <>The repair takes three moves. The widget below runs through them.</>,
          <>수선은 세 번에 걸쳐 일어난다. 아래 위젯이 그 과정을 보여준다.</>,
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
        <h3>{pick(language, "Three failures of the naive count", "순진한 셈법의 세 가지 실패")}</h3>
        <p>
          {pick(
            language,
            <>
              Take a line of degree 1 and a parabola of degree 2. Substitute{" "}
              <span className={FORMULA_INLINE}>y = mx + c</span> into{" "}
              <span className={FORMULA_INLINE}>y = x²</span> and you get a quadratic in x — two
              roots, two intersections. <span className={FORMULA_INLINE}>1 · 2 = 2</span>. Clean.
              Now break it three ways: (a) two <em>parallel</em> lines{" "}
              <span className={FORMULA_INLINE}>y = x</span> and{" "}
              <span className={FORMULA_INLINE}>y = x + 1</span> — substitute and you get{" "}
              <span className={FORMULA_INLINE}>0 = 1</span>, a contradiction; zero intersections,
              not the predicted <span className={FORMULA_INLINE}>1 · 1 = 1</span>. (b) The line{" "}
              <span className={FORMULA_INLINE}>y = 0</span> is <em>tangent</em> to{" "}
              <span className={FORMULA_INLINE}>y = x²</span> at the origin — they meet at one point,
              not two. (c) Two <em>disjoint</em> unit circles{" "}
              <span className={FORMULA_INLINE}>x² + y² = 1</span> and{" "}
              <span className={FORMULA_INLINE}>(x − 3)² + y² = 1</span> share zero points, not four.
            </>,
            <>
              차수 1 직선과 차수 2 포물선을 잡자. <span className={FORMULA_INLINE}>y = mx + c</span>
              를 <span className={FORMULA_INLINE}>y = x²</span>에 대입하면 x에 대한 이차방정식 — 두
              근, 두 교점. <span className={FORMULA_INLINE}>1 · 2 = 2</span>. 깔끔. 이제 세 군데서
              깨뜨려보자. (a) 평행한 두 직선 <span className={FORMULA_INLINE}>y = x</span>와{" "}
              <span className={FORMULA_INLINE}>y = x + 1</span> — 대입하면{" "}
              <span className={FORMULA_INLINE}>0 = 1</span>, 모순; 교점 0개,{" "}
              <span className={FORMULA_INLINE}>1 · 1 = 1</span>이 아니다. (b) 직선{" "}
              <span className={FORMULA_INLINE}>y = 0</span>은 원점에서{" "}
              <span className={FORMULA_INLINE}>y = x²</span>에 <em>접한다</em> — 두 점이 아니라 한
              점에서 만난다. (c) 떨어진 두 단위원{" "}
              <span className={FORMULA_INLINE}>x² + y² = 1</span>과{" "}
              <span className={FORMULA_INLINE}>(x − 3)² + y² = 1</span> — 0점, 4점이 아니다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The product rule is right often enough to look like a theorem, and wrong often enough
              to look like a guess. Either it's a guess, or the plane is the wrong stage. We take
              the second option.
            </>,
            <>
              곱셈 규칙은 맞을 때가 많아서 정리처럼 보이지만, 틀릴 때도 많아서 추측처럼 보인다. 둘
              중 하나다 — 추측이거나, 평면이 잘못된 무대거나. 두 번째를 택한다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "Fix #1 — the projective plane", "보정 1 — 사영평면")}</h3>
        <p>
          {pick(
            language,
            <>
              A line is a <em>direction</em> plus an offset. Parallel lines share a direction.
              Suppose we add a new <em>point</em> to the plane for each direction — call it the{" "}
              <Term id="point-at-infinity">point at infinity</Term> for that direction. Then any two
              parallel lines, sharing a direction, share that one extra point. Two non-parallel
              lines still meet at their usual one place. So <em>every</em> two distinct lines now
              meet at exactly one point. Add up all the points at infinity (one per direction) and
              you've added one extra <em>line</em> — the line at infinity. The plane plus that line
              is the <Term id="projective-plane">projective plane</Term>{" "}
              <span className={FORMULA_INLINE}>ℝℙ²</span>.
            </>,
            <>
              직선은 <em>방향</em>에 위치 하나가 붙은 것이다. 평행선은 방향을 공유한다. 평면에
              *방향마다* 하나씩 새 점을 추가하자 — 그 방향의{" "}
              <Term id="point-at-infinity">무한원점</Term>이라 부른다. 그러면 평행한 두 직선은
              방향을 공유하므로 그 추가된 한 점을 공유하고, 평행하지 않은 두 직선은 원래 한 점에서
              만난다. 결국 <em>서로 다른 임의의 두 직선이 정확히 한 점에서 만난다</em>. 모든 방향의
              무한원점을 모으면 한 줄의 *무한원선*이 된다. 평면에 그 직선을 더한 것이{" "}
              <Term id="projective-plane">사영평면</Term>{" "}
              <span className={FORMULA_INLINE}>ℝℙ²</span>.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The clean way to write a projective point is{" "}
              <span className={FORMULA_INLINE}>[X : Y : Z]</span> — three numbers, not all zero, up
              to overall scale (so{" "}
              <span className={FORMULA_INLINE}>[2 : 2 : 0], [1 : 1 : 0], [5 : 5 : 0]</span> are the
              same point). Affine (ordinary, finite) points are{" "}
              <span className={FORMULA_INLINE}>[x : y : 1]</span>. Points at infinity are{" "}
              <span className={FORMULA_INLINE}>[X : Y : 0]</span>: the <em>direction</em>{" "}
              <span className={FORMULA_INLINE}>(X, Y)</span>. The two parallel lines from §1 both
              pass through <span className={FORMULA_INLINE}>[1 : 1 : 0]</span> — the "direction (1,
              1)" point. Failure (a) is fixed.
            </>,
            <>
              사영점은 <span className={FORMULA_INLINE}>[X : Y : Z]</span>로 쓴다 — 셋이 모두 0은
              아닌 세 수, 전체 스케일은 무시 (즉{" "}
              <span className={FORMULA_INLINE}>[2 : 2 : 0], [1 : 1 : 0], [5 : 5 : 0]</span>은 같은
              점). affine (보통의 유한) 점은 <span className={FORMULA_INLINE}>[x : y : 1]</span>,
              무한원점은 <span className={FORMULA_INLINE}>[X : Y : 0]</span>: <em>방향</em>{" "}
              <span className={FORMULA_INLINE}>(X, Y)</span>. § 1의 두 평행선은 둘 다{" "}
              <span className={FORMULA_INLINE}>[1 : 1 : 0]</span>을 지난다 — "방향 (1, 1)"이라는 점.
              실패 (a) 보정 완료.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={3}>
        <h3>{pick(language, "Fix #2 — multiplicity", "보정 2 — 중복도")}</h3>
        <p>
          {pick(
            language,
            <>
              A tangent line meets a parabola at one geometric point but a <em>double</em> algebraic
              point. Substitute <span className={FORMULA_INLINE}>y = 0</span> into{" "}
              <span className={FORMULA_INLINE}>y = x²</span>: the equation becomes{" "}
              <span className={FORMULA_INLINE}>x² = 0</span>, with{" "}
              <span className={FORMULA_INLINE}>x = 0</span> as a <em>repeated root</em>. Polynomials
              remember what pictures forget. Define the{" "}
              <Term id="intersection-multiplicity">intersection multiplicity</Term> of two curves at
              a point as the order to which the eliminated polynomial vanishes there. A transverse
              crossing is multiplicity 1; a simple tangency is 2; a triple tangency 3; and so on.
              Bezout's count is <em>multiplicity-counted</em>, never raw.
            </>,
            <>
              접선은 포물선과 *기하적으로*는 한 점에서 만나지만 *대수적으로*는 두 점이다.{" "}
              <span className={FORMULA_INLINE}>y = 0</span>을{" "}
              <span className={FORMULA_INLINE}>y = x²</span>에 대입하면{" "}
              <span className={FORMULA_INLINE}>x² = 0</span> — <em>중근</em>{" "}
              <span className={FORMULA_INLINE}>x = 0</span>. 다항식은 그림이 잊는 걸 기억한다. 두
              곡선의 한 점에서의 <Term id="intersection-multiplicity">교차 중복도</Term>를, 한
              변수를 소거한 다항식이 그 점에서 *몇 차로 사라지는가*로 정의한다. 가로지름은 1, 단순
              접은 2, 3중 접은 3, ⋯. 베주의 수는 항상 <em>중복도까지 더한</em> 수, 날것이 아니다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              In the widget above, switch to the <b>tangent</b> preset and turn on{" "}
              <em>show multiplicity</em>: the tangent point earns its{" "}
              <span className={MONO}>×2</span> label, and the visible 3 jumps to 4. Failure (b)
              fixed.
            </>,
            <>
              위 위젯에서 <b>접</b> 프리셋으로 가서 <em>중복도 표시</em>를 켜라: 접점이{" "}
              <span className={MONO}>×2</span> 라벨을 얻고, 보이던 3이 4로 채워진다. 실패 (b) 보정
              완료.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={4}>
        <h3>{pick(language, "Fix #3 — complex coordinates", "보정 3 — 복소수 좌표")}</h3>
        <p>
          {pick(
            language,
            <>
              The disjoint circles <span className={FORMULA_INLINE}>x² + y² = 1</span> and{" "}
              <span className={FORMULA_INLINE}>(x − 3)² + y² = 1</span> seem to meet nowhere.
              Subtract them: <span className={FORMULA_INLINE}>−6x + 9 = 0</span>, so{" "}
              <span className={FORMULA_INLINE}>x = 3/2</span>. At that x the first circle gives{" "}
              <span className={FORMULA_INLINE}>y² = 1 − 9/4 = −5/4</span> — no real{" "}
              <span className={FORMULA_INLINE}>y</span>, but two perfectly good complex ones:{" "}
              <span className={FORMULA_INLINE}>y = ± i √5 / 2</span>. The two circles really do meet
              at two points <span className={FORMULA_INLINE}>(3/2, ± i √5 / 2)</span> — they just
              live in <span className={FORMULA_INLINE}>ℂ²</span>, not{" "}
              <span className={FORMULA_INLINE}>ℝ²</span>.
            </>,
            <>
              떨어진 두 원 <span className={FORMULA_INLINE}>x² + y² = 1</span>과{" "}
              <span className={FORMULA_INLINE}>(x − 3)² + y² = 1</span>은 어디서도 안 만나 보인다.
              빼면 <span className={FORMULA_INLINE}>−6x + 9 = 0</span>, 즉{" "}
              <span className={FORMULA_INLINE}>x = 3/2</span>. 그 x에서 첫째 원은{" "}
              <span className={FORMULA_INLINE}>y² = 1 − 9/4 = −5/4</span> — 실수 해는 없지만 멀쩡한
              복소수 해 둘이 있다: <span className={FORMULA_INLINE}>y = ± i √5 / 2</span>. 두 원은
              정말로 두 점 <span className={FORMULA_INLINE}>(3/2, ± i √5 / 2)</span>에서 만난다 —
              다만 그 점이 <span className={FORMULA_INLINE}>ℝ²</span>이 아니라{" "}
              <span className={FORMULA_INLINE}>ℂ²</span>에 산다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              In the widget, the <b>disjoint</b> preset shows zero real intersections — turn on{" "}
              <em>show complex</em>, and four open dots appear in the side panel: the four
              Bezout-promised intersections, projected onto the complex x-plane. Failure (c) fixed.
            </>,
            <>
              위 위젯의 <b>분리</b> 프리셋은 실수 교점 0을 보여준다 — <em>복소 보기</em>를 켜면 옆
              패널에 네 개의 빈 동그라미가 뜬다: 베주가 약속한 네 교점이 복소 x-평면 위에 찍힌
              것이다. 실패 (c) 보정 완료.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>{pick(language, "The statement", "진술")}</h3>
        <p>
          {pick(
            language,
            <>
              Three fixes in: <Term id="projective-plane">projective plane</Term>, complex
              coordinates, <Term id="intersection-multiplicity">multiplicity</Term>. The product
              rule is now a theorem.
            </>,
            <>
              세 보정 — <Term id="projective-plane">사영평면</Term>, 복소좌표,{" "}
              <Term id="intersection-multiplicity">중복도</Term> — 을 끝내면 곱셈 규칙은 정리가
              된다.
            </>,
          )}
        </p>
      </ArcRow>

      <div className="mt-[22px] rounded-r-md border-l-4 border-acc bg-acc-soft px-[22px] py-[18px] text-base leading-[1.55] text-acc-deep [&_b]:font-semibold">
        {pick(
          language,
          <>
            <b>Bezout.</b> Two plane curves of degrees <span className={FORMULA_INLINE}>d</span> and{" "}
            <span className={FORMULA_INLINE}>e</span> with no common component meet — in{" "}
            <span className={FORMULA_INLINE}>ℂℙ²</span>, counted with multiplicity — in exactly{" "}
            <span className={FORMULA_INLINE}>d · e</span> points.
          </>,
          <>
            <b>베주.</b> 차수 <span className={FORMULA_INLINE}>d</span>,{" "}
            <span className={FORMULA_INLINE}>e</span>의 두 평면 곡선이 공통 성분을 갖지 않을 때 —{" "}
            <span className={FORMULA_INLINE}>ℂℙ²</span>에서, 중복도까지 세면 — 정확히{" "}
            <span className={FORMULA_INLINE}>d · e</span> 점에서 만난다.
          </>,
        )}
      </div>

      <ArcRow n={6}>
        <h3>{pick(language, "Why it works — the resultant", "왜 성립하는가 — 종결식")}</h3>
        <p>
          {pick(
            language,
            <>
              Eliminate one variable. Two polynomials{" "}
              <span className={FORMULA_INLINE}>f(x, y), g(x, y)</span>, viewed as polynomials in{" "}
              <span className={FORMULA_INLINE}>y</span> with coefficients depending on{" "}
              <span className={FORMULA_INLINE}>x</span>, share a root iff their{" "}
              <Term id="resultant">resultant</Term> in <span className={FORMULA_INLINE}>y</span>{" "}
              vanishes. If <span className={FORMULA_INLINE}>f</span> has{" "}
              <span className={FORMULA_INLINE}>y</span>-degree{" "}
              <span className={FORMULA_INLINE}>d</span> and{" "}
              <span className={FORMULA_INLINE}>g</span> has{" "}
              <span className={FORMULA_INLINE}>y</span>-degree{" "}
              <span className={FORMULA_INLINE}>e</span>, the resultant is a polynomial in{" "}
              <span className={FORMULA_INLINE}>x</span> of degree{" "}
              <span className={FORMULA_INLINE}>d · e</span> — and its{" "}
              <span className={FORMULA_INLINE}>d · e</span> complex roots (with multiplicity) are
              the <span className={FORMULA_INLINE}>x</span>-coordinates of the{" "}
              <span className={FORMULA_INLINE}>d · e</span> intersections. Two conics: a quartic in{" "}
              <span className={FORMULA_INLINE}>x</span>. Four roots. Four intersections. The widget
              above is exactly this quartic, solved.
            </>,
            <>
              한 변수를 소거한다. 두 다항식 <span className={FORMULA_INLINE}>f(x, y), g(x, y)</span>
              를 <span className={FORMULA_INLINE}>y</span>에 대한 다항식 (계수는{" "}
              <span className={FORMULA_INLINE}>x</span>의 식)으로 보면, 둘이 공통 근을 갖는 것은{" "}
              <span className={FORMULA_INLINE}>y</span>에 대한 <Term id="resultant">종결식</Term>이
              0이 되는 것과 동치. <span className={FORMULA_INLINE}>f</span>의{" "}
              <span className={FORMULA_INLINE}>y</span>-차수가{" "}
              <span className={FORMULA_INLINE}>d</span>, <span className={FORMULA_INLINE}>g</span>의{" "}
              <span className={FORMULA_INLINE}>y</span>-차수가{" "}
              <span className={FORMULA_INLINE}>e</span>이면 종결식은{" "}
              <span className={FORMULA_INLINE}>x</span>에 대한 차수{" "}
              <span className={FORMULA_INLINE}>d · e</span> 다항식 — 그{" "}
              <span className={FORMULA_INLINE}>d · e</span>개의 (중복도 포함) 복소근이 곧{" "}
              <span className={FORMULA_INLINE}>d · e</span>개의 교점의{" "}
              <span className={FORMULA_INLINE}>x</span>좌표. 두 원뿔곡선:{" "}
              <span className={FORMULA_INLINE}>x</span>에 대한 4차 다항식. 네 근. 네 교점. 위 위젯이
              정확히 이 4차 다항식을 푸는 것이다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc6} />}
      </ArcRow>
    </section>
  );
}

function Exercises() {
  return (
    <section className="mt-14">
      <div className={KICKER}>exercises · 손으로 풀기</div>

      <Exercise
        number={1}
        tag={{ en: "read the widget", ko: "위젯 읽기" }}
        prompt={{
          en: (
            <>
              Switch to the <b>disjoint</b> preset. The counter shows real = 0. Which toggles do you
              need to set so the visible total reaches 4? Then do the same for <b>tangent</b> and{" "}
              <b>partial</b>. State, in one sentence each, what each preset is "missing" from the
              naive view.
            </>
          ),
          ko: (
            <>
              <b>분리</b> 프리셋으로 가라. 카운터의 실수 = 0이다. 보이는 총합이 4가 되려면 어느
              토글을 켜야 하는가? <b>접</b>과 <b>부분</b> 프리셋도 같은 방식으로 답하라. 각 프리셋이
              순진한 시각에서 무엇을 "놓치고 있는지" 한 문장씩 적어라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <b>Disjoint</b> needs <em>show complex</em>: all four roots have nonzero imaginary
              parts; the real plane sees nothing. <b>Tangent</b> needs <em>show multiplicity</em>:
              three points are visible but one of them is a tangency that counts twice.{" "}
              <b>Partial</b> needs <em>both</em>: two real transverse intersections plus a complex
              conjugate pair off the real plane.
            </>
          ),
          ko: (
            <>
              <b>분리</b>는 <em>복소 보기</em>가 필요하다 — 네 근 모두 허수부가 0이 아니라 실평면엔
              보이지 않는다. <b>접</b>은 <em>중복도 표시</em>가 필요하다 — 세 점이 보이는데 그 중
              하나가 접점이라 두 번으로 센다. <b>부분</b>은 <em>둘 다</em> 필요하다 — 두 실수
              가로지름 + 실평면 바깥의 복소 켤레 쌍.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "compute by hand · degree 1 × 2", ko: "손계산 · 차수 1 × 2" }}
        prompt={{
          en: (
            <>
              Find all intersections of <span className={FORMULA_INLINE}>y = x²</span> and{" "}
              <span className={FORMULA_INLINE}>y = 2x − 1</span>. Bezout predicts 1 · 2 = 2.
              Identify what (in this case) closes the gap between geometry and algebra.
            </>
          ),
          ko: (
            <>
              <span className={FORMULA_INLINE}>y = x²</span>와{" "}
              <span className={FORMULA_INLINE}>y = 2x − 1</span>의 교점을 모두 구하라. 베주의 예측은
              1 · 2 = 2. 이 경우 기하와 대수의 간극을 무엇이 메우는지 짚어라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Substitute: <span className={FORMULA_INLINE}>x² = 2x − 1</span>, i.e.{" "}
              <span className={FORMULA_INLINE}>x² − 2x + 1 = (x − 1)² = 0</span>. The geometric
              intersection is a single point <span className={FORMULA_INLINE}>(1, 1)</span> — the
              line is tangent to the parabola there. The algebra reports{" "}
              <span className={FORMULA_INLINE}>x = 1</span> as a <em>double</em> root, so the
              intersection has <Term id="intersection-multiplicity">multiplicity</Term> 2. Bezout
              count: 1 (point) × 2 (multiplicity) = 2 ✓. The gap was closed by <em>multiplicity</em>
              .
            </>
          ),
          ko: (
            <>
              대입: <span className={FORMULA_INLINE}>x² = 2x − 1</span>, 즉{" "}
              <span className={FORMULA_INLINE}>x² − 2x + 1 = (x − 1)² = 0</span>. 기하 교점은 한 점{" "}
              <span className={FORMULA_INLINE}>(1, 1)</span> — 직선이 그 점에서 포물선에 접한다.
              대수는 <span className={FORMULA_INLINE}>x = 1</span>을 *이중근*으로 보고하므로 그
              교점의 <Term id="intersection-multiplicity">중복도</Term>는 2. 베주 셈: 1점 × 중복도 2
              = 2 ✓. 간극을 *중복도*가 메웠다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "infinity coordinates", ko: "무한원점 좌표" }}
        prompt={{
          en: (
            <>
              Two parallel lines <span className={FORMULA_INLINE}>y = x</span> and{" "}
              <span className={FORMULA_INLINE}>y = x + 1</span>. Write their unique intersection as
              a point <span className={FORMULA_INLINE}>[X : Y : Z]</span> in{" "}
              <Term id="projective-plane">ℝℙ²</Term>. (Hint: rewrite each line as a homogeneous
              equation in <span className={FORMULA_INLINE}>X, Y, Z</span> and solve.)
            </>
          ),
          ko: (
            <>
              두 평행선 <span className={FORMULA_INLINE}>y = x</span>와{" "}
              <span className={FORMULA_INLINE}>y = x + 1</span>의 유일한 교점을{" "}
              <Term id="projective-plane">ℝℙ²</Term>의 점{" "}
              <span className={FORMULA_INLINE}>[X : Y : Z]</span>로 적어라. (힌트: 각 직선을{" "}
              <span className={FORMULA_INLINE}>X, Y, Z</span>의 동차식으로 다시 쓰고 풀어라.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <Term id="homogenize">Homogenize</Term> <span className={FORMULA_INLINE}>y = x</span>{" "}
              by setting <span className={FORMULA_INLINE}>x = X/Z, y = Y/Z</span>:{" "}
              <span className={FORMULA_INLINE}>Y = X</span>. Same for the second line:{" "}
              <span className={FORMULA_INLINE}>Y = X + Z</span>. Subtracting:{" "}
              <span className={FORMULA_INLINE}>Z = 0</span>. Combined with{" "}
              <span className={FORMULA_INLINE}>Y = X</span>: the point is{" "}
              <span className={FORMULA_INLINE}>[1 : 1 : 0]</span> — the{" "}
              <Term id="point-at-infinity">point at infinity</Term> in the direction{" "}
              <span className={FORMULA_INLINE}>(1, 1)</span>. Bezout count: 1 · 1 = 1 ✓.
            </>
          ),
          ko: (
            <>
              <span className={FORMULA_INLINE}>y = x</span>를{" "}
              <span className={FORMULA_INLINE}>x = X/Z, y = Y/Z</span>로{" "}
              <Term id="homogenize">동차화</Term>: <span className={FORMULA_INLINE}>Y = X</span>.
              둘째 직선도 같은 방식으로: <span className={FORMULA_INLINE}>Y = X + Z</span>. 빼면{" "}
              <span className={FORMULA_INLINE}>Z = 0</span>. 이를{" "}
              <span className={FORMULA_INLINE}>Y = X</span>와 합치면 점{" "}
              <span className={FORMULA_INLINE}>[1 : 1 : 0]</span> — 방향{" "}
              <span className={FORMULA_INLINE}>(1, 1)</span>의{" "}
              <Term id="point-at-infinity">무한원점</Term>. 베주 셈: 1 · 1 = 1 ✓.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "the evil one · cubic at the origin", ko: "악마의 문제 · 원점의 3차" }}
        prompt={{
          en: (
            <>
              Consider <span className={FORMULA_INLINE}>y = x³</span> (cubic, degree 3) and the line{" "}
              <span className={FORMULA_INLINE}>y = 0</span> (degree 1). Bezout predicts 3
              intersections. Geometrically, you see one — at the origin. State precisely how Bezout
              is satisfied, and contrast this case with exercise 2.
            </>
          ),
          ko: (
            <>
              <span className={FORMULA_INLINE}>y = x³</span> (3차 곡선)와 직선{" "}
              <span className={FORMULA_INLINE}>y = 0</span> (차수 1)을 보자. 베주는 3개의 교점을
              예측한다. 기하적으로는 하나 — 원점에서. 베주가 어떻게 만족되는지 정확히 말하고, 이
              경우와 문제 2를 대비해 보아라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Substitute: <span className={FORMULA_INLINE}>x³ = 0</span>, so{" "}
              <span className={FORMULA_INLINE}>x = 0</span> is a <em>triple</em> root. The single
              geometric point at the origin has{" "}
              <Term id="intersection-multiplicity">multiplicity</Term> 3. Bezout: 1 × 3 = 3 ✓. The
              difference from exercise 2: there, two algebraic crossings collapsed into one tangency
              (multiplicity 2). Here, three collapse into one inflectional contact (multiplicity 3).
              The plane sees one dot in both cases; algebra sees the difference.
            </>
          ),
          ko: (
            <>
              대입: <span className={FORMULA_INLINE}>x³ = 0</span>, 즉{" "}
              <span className={FORMULA_INLINE}>x = 0</span>이 *삼중근*. 원점이라는 한 기하 점이{" "}
              <Term id="intersection-multiplicity">중복도</Term> 3을 갖는다. 베주: 1 × 3 = 3 ✓. 문제
              2와의 차이: 거기서는 두 대수 교점이 한 접점으로 무너졌고 (중복도 2), 여기서는 세 점이
              한 변곡 접촉으로 무너진다 (중복도 3). 평면은 두 경우 모두 한 점만 보지만, 대수는 그
              차이를 본다.
            </>
          ),
        }}
      />

      <Exercise
        number={5}
        tag={{ en: "two-circle infinity", ko: "두 원의 무한원" }}
        prompt={{
          en: (
            <>
              Take any two non-coincident circles{" "}
              <span className={FORMULA_INLINE}>x² + y² + a x + b y + c = 0</span>. Their degrees
              multiply to 4, but you typically see at most 2 affine intersections. Where are the
              other two? (Hint: <Term id="homogenize">homogenize</Term> and look at the line at
              infinity <span className={FORMULA_INLINE}>Z = 0</span>.) These two points have a name.
              What is the consequence: are they shared by <em>all</em> circles, or are they specific
              to a given pair?
            </>
          ),
          ko: (
            <>
              일치하지 않는 두 원{" "}
              <span className={FORMULA_INLINE}>x² + y² + a x + b y + c = 0</span>을 보자. 차수의
              곱은 4지만, 보통 보이는 affine 교점은 많아야 2개. 나머지 둘은 어디? (힌트:{" "}
              <Term id="homogenize">동차화</Term>한 뒤 무한원선{" "}
              <span className={FORMULA_INLINE}>Z = 0</span>을 보라.) 이 두 점에는 이름이 있다. 그
              결과: 그들은 *모든* 원이 공유하는가, 아니면 주어진 쌍에만 해당하는가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Homogenize: <span className={FORMULA_INLINE}>X² + Y² + a X Z + b Y Z + c Z² = 0</span>
              . At <span className={FORMULA_INLINE}>Z = 0</span>:{" "}
              <span className={FORMULA_INLINE}>X² + Y² = 0</span>, i.e.{" "}
              <span className={FORMULA_INLINE}>[1 : ± i : 0]</span>. These two complex{" "}
              <Term id="point-at-infinity">points at infinity</Term> are called the{" "}
              <em>circular points</em> <span className={FORMULA_INLINE}>I = [1 : i : 0]</span> and{" "}
              <span className={FORMULA_INLINE}>J = [1 : −i : 0]</span>. Every circle contains them
              (the equation is independent of <span className={FORMULA_INLINE}>a, b, c</span>), so{" "}
              <em>any</em> two distinct circles share both. Two circles' Bezout count of 4 is
              always: (≤ 2 affine) + (2 at infinity, namely I and J). When the affine count drops
              from 2, multiplicity or complex affine points fill in.
            </>
          ),
          ko: (
            <>
              동차화: <span className={FORMULA_INLINE}>X² + Y² + a X Z + b Y Z + c Z² = 0</span>.{" "}
              <span className={FORMULA_INLINE}>Z = 0</span>에서{" "}
              <span className={FORMULA_INLINE}>X² + Y² = 0</span>, 즉{" "}
              <span className={FORMULA_INLINE}>[1 : ± i : 0]</span>. 이 두 복소{" "}
              <Term id="point-at-infinity">무한원점</Term>을 *circular points* (원의 점이라는 뜻 —
              좌표계의 원점 (0, 0)과는 다른 개념)라 부르고{" "}
              <span className={FORMULA_INLINE}>I = [1 : i : 0]</span>,{" "}
              <span className={FORMULA_INLINE}>J = [1 : −i : 0]</span>로 쓴다. 모든 원이 이 둘을
              포함한다 (식이 <span className={FORMULA_INLINE}>a, b, c</span>에 의존하지 않으므로),
              따라서 <em>임의의</em> 두 원은 둘을 공유한다. 두 원의 베주 4 = (≤ 2 affine) +
              (무한원의 I, J 2개). affine 수가 2에서 줄면 그 차이를 중복도 또는 복소 affine 점이
              메운다.
            </>
          ),
        }}
      />

      <Exercise
        number={6}
        tag={{ en: "synthesis · the elliptic curve seed", ko: "합성 · 타원곡선의 씨앗" }}
        prompt={{
          en: (
            <>
              Let <span className={FORMULA_INLINE}>E : y² = x³ − x</span> (degree 3) and a line{" "}
              <span className={FORMULA_INLINE}>L : y = m x + c</span> (degree 1). Bezout: three
              intersections. Suppose all three are affine, with x-coordinates{" "}
              <span className={FORMULA_INLINE}>x₁, x₂, x₃</span>. Show that{" "}
              <span className={FORMULA_INLINE}>x₁ + x₂ + x₃ = m²</span>. (This identity is the seed
              of the elliptic-curve group law — given two points on E, the third intersection of
              their chord is geometrically determined, and Vieta gives its x-coordinate for free.)
            </>
          ),
          ko: (
            <>
              <span className={FORMULA_INLINE}>E : y² = x³ − x</span> (차수 3)와 직선{" "}
              <span className={FORMULA_INLINE}>L : y = m x + c</span> (차수 1)을 보자. 베주: 세
              교점. 셋 모두 affine이고 x좌표가 <span className={FORMULA_INLINE}>x₁, x₂, x₃</span>라
              하자. <span className={FORMULA_INLINE}>x₁ + x₂ + x₃ = m²</span>임을 보여라. (이
              항등식이 타원곡선 군법칙의 씨앗 — E 위 두 점이 주어지면 그 현이 만드는 세 번째 교점은
              기하적으로 결정되고, x좌표는 비에타가 공짜로 준다.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Substitute <span className={FORMULA_INLINE}>y = m x + c</span> into the curve:{" "}
              <span className={FORMULA_INLINE}>(m x + c)² = x³ − x</span>, i.e.{" "}
              <span className={FORMULA_INLINE}>x³ − m² x² − (2 m c + 1) x − c² = 0</span>. By{" "}
              <Term id="vieta-formulas">Vieta's formulas</Term> on this monic (leading coefficient
              1) cubic, the sum of roots is the negative of the{" "}
              <span className={FORMULA_INLINE}>x²</span> coefficient: −(−m²) = m². Hence{" "}
              <span className={FORMULA_INLINE}>x₁ + x₂ + x₃ = m²</span>. Geometrically: pick two
              points <span className={FORMULA_INLINE}>P₁, P₂</span> on{" "}
              <span className={FORMULA_INLINE}>E</span>, draw the chord through them; the line meets{" "}
              <span className={FORMULA_INLINE}>E</span> at exactly one more point{" "}
              <span className={FORMULA_INLINE}>P₃</span> (Bezout demands a third), and you read off{" "}
              <span className={FORMULA_INLINE}>x₃ = m² − x₁ − x₂</span> with no further work. The
              group law on <span className={FORMULA_INLINE}>E</span> defines{" "}
              <span className={FORMULA_INLINE}>P₁ + P₂ = − P₃</span> from this very fact.
            </>
          ),
          ko: (
            <>
              <span className={FORMULA_INLINE}>y = m x + c</span>를 곡선에 대입:{" "}
              <span className={FORMULA_INLINE}>(m x + c)² = x³ − x</span>, 정리하면{" "}
              <span className={FORMULA_INLINE}>x³ − m² x² − (2 m c + 1) x − c² = 0</span>. 이 monic
              (최고차항 계수가 1) 3차식에 <Term id="vieta-formulas">비에타 공식</Term>을 적용하면
              근의 합은 <span className={FORMULA_INLINE}>x²</span> 계수의 음수 = −(−m²) = m². 따라서{" "}
              <span className={FORMULA_INLINE}>x₁ + x₂ + x₃ = m²</span>. 기하적으로:{" "}
              <span className={FORMULA_INLINE}>E</span> 위 두 점{" "}
              <span className={FORMULA_INLINE}>P₁, P₂</span>를 잡아 그 둘을 잇는 현을 긋는다. 그
              직선은 <span className={FORMULA_INLINE}>E</span>와 정확히 한 점{" "}
              <span className={FORMULA_INLINE}>P₃</span>을 더 만나고 (베주가 세 번째를 요구한다),{" "}
              <span className={FORMULA_INLINE}>x₃ = m² − x₁ − x₂</span>를 추가 계산 없이 읽어낸다.{" "}
              <span className={FORMULA_INLINE}>E</span> 위 군법칙은 바로 이 사실에서{" "}
              <span className={FORMULA_INLINE}>P₁ + P₂ = − P₃</span>으로 정의된다.
            </>
          ),
        }}
      />
    </section>
  );
}

function Glossary() {
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
            module: <b>Bezout's Theorem</b>. The chord-and-tangent construction in exercise 6 is one
            short step from a proper module on elliptic-curve arithmetic — and from there, ECDSA /{" "}
            <Term id="bitcoin">Bitcoin</Term> signatures plug into the <b>finance</b> pillar via the
            existing <Link to="/finance/bitcoin-pizza">Bitcoin Pizza</Link>.
          </>,
          <>
            모듈: <b>베주 정리</b>. 6번 문제의 현·접선 작도는 타원곡선 산술이라는 본격 모듈로 가는
            한 걸음 — 거기서부터 ECDSA · <Term id="bitcoin">비트코인</Term> 서명이 기존{" "}
            <Link to="/finance/bitcoin-pizza">비트코인 피자</Link>를 통해 <b>금융</b> 기둥에 붙는다.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function Bezout({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Bezout's Theorem · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <ConicIntersect />
      <Arc code={code} />
      <Exercises />
      <Glossary />
      <PageFooter />
    </TermsProvider>
  );
}
