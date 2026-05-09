import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { VectorRoles } from "../components/widgets/vector-roles";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc3: string; arc4: string };

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
        {pick(language, "module · vectors", "모듈 · 벡터")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · same arrow, four costumes", "도입 · 같은 화살표, 네 가지 옷")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>Why do graphics, physics, and ML all steal the same arrow?</>,
          <>왜 그래픽, 물리, 머신러닝은 모두 같은 화살표를 훔쳐 쓸까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            <span className={FORMULA_INLINE}>(3, 4)</span>. Is that a point on a screen, an arrow
            showing how to move, a velocity, or a feature representation of an apple? It depends on
            what you're doing — and that is the whole reason <Term id="vector">vectors</Term> are
            the most-shared piece of mathematics across applications. The tuple is the same. The
            arithmetic is the same. The role changes, and so does the costume.
          </>,
          <>
            <span className={FORMULA_INLINE}>(3, 4)</span>. 이것은 화면 위의 점인가, 어떻게 움직일지
            보여주는 화살표인가, 속도인가, 사과를 표현하는 특징 벡터인가? 답은 *무엇을 하느냐*에
            달렸다 — 그리고 그게 <Term id="vector">벡터</Term>가 응용 전반에서 *가장 많이 공유되는*
            수학인 이유다. 튜플은 같다. 산술도 같다. 역할이 바뀌고, 그에 따라 옷이 바뀐다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            In the widget below: one tuple <span className={MONO}>A</span>, one tuple{" "}
            <span className={MONO}>v</span>, the result <span className={MONO}>A + cv</span>. Click
            the role buttons — generic, graphics, physics, ml — and the labels change without the
            picture changing. The picture <em>can't</em> change; only the story you tell about it
            can.
          </>,
          <>
            아래 위젯: 튜플 하나 <span className={MONO}>A</span>, 튜플 하나{" "}
            <span className={MONO}>v</span>, 결과 <span className={MONO}>A + cv</span>. 역할 버튼을
            누르면 — 기본/그래픽/물리/ML — 라벨만 바뀌고 그림은 그대로다. 그림은{" "}
            <em>바뀔 수가 없다</em>; 그것에 *대해 들려주는* 이야기만 바뀐다.
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
        <h3>{pick(language, "One tuple, several jobs", "한 튜플, 여러 일")}</h3>
        <p>
          {pick(
            language,
            <>
              The notation <span className={FORMULA_INLINE}>(3, 4)</span> is a finger pointing
              somewhere — but it can point at very different things. As a <em>position</em> on a 2D
              plane, it's the point three units right and four up. As a{" "}
              <em>
                <Term id="displacement">displacement</Term>
              </em>
              , it's an instruction: "go three right, four up, from wherever you are." As a{" "}
              <em>velocity</em>, it's a rate: three horizontal units per second, four vertical. As a{" "}
              <em>feature vector</em> for a fruit-classifier, it might be (sweetness 3, tartness 4)
              — coordinates in an abstract feature space with no geometric interpretation at all.{" "}
              <b>The tuple is silent on which one it is.</b>
            </>,
            <>
              표기 <span className={FORMULA_INLINE}>(3, 4)</span>은 어딘가를 가리키는 손가락 —
              하지만 가리키는 *것*은 아주 다양하다. 2D 평면 위의 *위치*로 읽으면, 오른쪽 3 아래(혹은
              위로) 4.{" "}
              <em>
                <Term id="displacement">변위</Term>
              </em>
              로 읽으면 명령: "어디서든 오른쪽 3, 위로 4 가라." *속도*로 읽으면 비율: 초당 가로 3,
              세로 4. 과일 분류기의 *특징 벡터*로 읽으면 (단맛 3, 신맛 4) — 기하적 해석이 *전혀
              없는* 추상 특징 공간의 좌표. <b>튜플은 자신이 무엇인지 말하지 않는다.</b>
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The same ambiguity is what makes vectors useful. Every application that wants to talk
              about "two-or-more-numbers-bundled-together-and-treated-as-one" inherits the same
              tools — a single arithmetic, a single set of identities — and the application's job is
              to <em>interpret</em> the bundle in its specific way.
            </>,
            <>
              이 모호성이 벡터를 유용하게 만드는 *이유*다. "두 개 이상의 수를 묶어 하나로 다루기"를
              원하는 모든 응용이 같은 도구 — 한 벌의 산술, 한 벌의 항등식 — 을 물려받고, 자기 영역의
              방식으로 *해석*하는 것이 응용의 일이 된다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "Point: where", "점: 어디인지")}</h3>
        <p>
          {pick(
            language,
            <>
              When the role is "location," the tuple is an <em>address</em> in space. It answers{" "}
              <em>where</em>, not <em>how to move</em>. A position changes when you choose a
              different origin — the very same physical point becomes{" "}
              <span className={MONO}>(3, 4)</span> in one coordinate system and{" "}
              <span className={MONO}>(0, 0)</span> in a system whose origin sits at that point.
              Positions are origin-dependent.
            </>,
            <>
              역할이 "위치"일 때, 튜플은 공간 안의 *주소*. *어디*에 답하지, *어떻게 움직일지*에
              답하지 않는다. 원점을 바꾸면 위치는 바뀐다 — 같은 물리적 점이 한 좌표계에서{" "}
              <span className={MONO}>(3, 4)</span>이지만, 원점이 그 점에 놓인 좌표계에서는{" "}
              <span className={MONO}>(0, 0)</span>이 된다. *위치는 원점에 의존*한다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={3}>
        <h3>{pick(language, "Vector: how to move", "벡터: 어떻게 움직일지")}</h3>
        <p>
          {pick(
            language,
            <>
              When the role is "displacement," the tuple is a <em>recipe for motion</em>: from
              wherever you are, change your x by 3 and your y by 4. Crucially, this is{" "}
              <em>origin-free</em> — moving the coordinate system's origin doesn't change the
              displacement between two points. That is why the projectile-motion equations and the
              gradient-descent update equation look the same regardless of where you place your
              axes.
            </>,
            <>
              역할이 "변위"일 때, 튜플은 *이동 레시피*: 어디 있든 x를 3 더하고 y를 4 더하라.
              결정적으로, 이것은 *원점-자유* — 좌표계 원점을 옮겨도 두 점 사이의 변위는 변하지
              않는다. 그래서 포물선-운동 식과 경사하강법 갱신식이 축을 어디에 놓든 같은 모양으로
              보인다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Subtracting two points gives a vector:{" "}
              <span className={FORMULA_INLINE}>v = B − A</span> is the displacement from A to B.
              Adding a vector to a point gives another point:{" "}
              <span className={FORMULA_INLINE}>A + v = B</span>. Two points and one vector live in
              the same picture, but only the vector is dimension-of-direction.
            </>,
            <>
              두 점을 빼면 벡터가 된다: <span className={FORMULA_INLINE}>v = B − A</span>는 A에서
              B로의 변위. 점에 벡터를 더하면 다른 점이 된다:{" "}
              <span className={FORMULA_INLINE}>A + v = B</span>. 두 점과 한 벡터는 같은 그림 안에
              살지만, 벡터만 *방향-차원*을 가진다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
      </ArcRow>

      <ArcRow n={4}>
        <h3>
          {pick(language, "Components: split, work, reassemble", "성분: 쪼개고, 계산하고, 합치기")}
        </h3>
        <p>
          {pick(
            language,
            <>
              A 2D vector decomposes into x- and y-<Term id="component">components</Term>:{" "}
              <span className={FORMULA_INLINE}>v = (v_x, v_y) = v_x · x̂ + v_y · ŷ</span>, where{" "}
              <span className={MONO}>x̂</span> and <span className={MONO}>ŷ</span> are the unit
              vectors along each axis. Adding two vectors is component-wise:{" "}
              <span className={FORMULA_INLINE}>(a, b) + (c, d) = (a + c, b + d)</span>. Multiplying
              a vector by a <Term id="scalar">scalar</Term> <span className={MONO}>c</span>{" "}
              stretches each component:{" "}
              <span className={FORMULA_INLINE}>c · (a, b) = (c·a, c·b)</span>.
            </>,
            <>
              2D 벡터는 x-, y- <Term id="component">성분</Term>으로 분해된다:{" "}
              <span className={FORMULA_INLINE}>v = (v_x, v_y) = v_x · x̂ + v_y · ŷ</span>, 여기서{" "}
              <span className={MONO}>x̂</span>와 <span className={MONO}>ŷ</span>는 각 축의 단위 벡터.
              두 벡터의 덧셈은 성분별:{" "}
              <span className={FORMULA_INLINE}>(a, b) + (c, d) = (a + c, b + d)</span>. 벡터에{" "}
              <Term id="scalar">스칼라</Term> <span className={MONO}>c</span>를 곱하면 각 성분이
              늘어난다: <span className={FORMULA_INLINE}>c · (a, b) = (c·a, c·b)</span>.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The decompose-compute-recompose pattern is so universal you stop noticing it. The
              projectile-motion page splits a launch velocity into{" "}
              <span className={MONO}>(v₀ cos θ, v₀ sin θ)</span> and runs each component as a 1D
              motion. The gradient-descent update writes <span className={MONO}>w − η·∇L</span> as a
              vector subtraction, but every real implementation does it component-wise on the
              underlying array. Components are how vector arithmetic becomes scalar arithmetic in
              software.
            </>,
            <>
              *분해-계산-재조립* 패턴은 너무 보편적이라 의식하지 않게 된다. 포물선-운동 페이지는
              발사 속도를 <span className={MONO}>(v₀ cos θ, v₀ sin θ)</span>로 쪼개 각 성분을 1D
              운동으로 돌린다. 경사하강법 갱신은 <span className={MONO}>w − η·∇L</span>을 벡터
              뺄셈으로 적지만, 모든 실제 구현은 그 아래 배열에 대해 *성분별*로 한다. 성분은 *벡터
              산술이 소프트웨어 안에서 스칼라 산술이 되는 방식*.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>{pick(language, "Two operations, no exceptions", "두 연산, 예외 없음")}</h3>
        <p>
          {pick(
            language,
            <>
              Vector arithmetic has only two operations: add two vectors, scale one by a number.
              Together they describe everything called a "linear" operation in this entire stack of
              math. From these two you can build:
            </>,
            <>
              벡터 산술에는 단 두 연산이 있다 — 두 벡터를 더한다, 하나를 수로 늘인다. 둘이 합쳐 이
              수학 스택 전체에서 "선형"이라 불리는 모든 것을 묘사한다. 이 둘로 만들 수 있는 것들:
            </>,
          )}
        </p>
        <ul className="m-0 mb-3 list-none space-y-1.5 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <b>Linear interpolation.</b>{" "}
                <span className={FORMULA_INLINE}>lerp(A, B, t) = (1 − t)·A + t·B</span> — one add
                and two scales. The same primitive that builds Bezier curves.
              </li>
              <li>
                <b>Translation.</b> Move every point of a shape by the same vector{" "}
                <span className={MONO}>v</span> — replace every coordinate{" "}
                <span className={MONO}>P</span> with <span className={MONO}>P + v</span>.
              </li>
              <li>
                <b>Linear combination.</b> Any expression of the form{" "}
                <span className={FORMULA_INLINE}>c₁v₁ + c₂v₂ + ⋯</span>. Convex combinations (where
                all coefficients sum to 1) are how the Bezier widget collapses control points layer
                by layer.
              </li>
              <li>
                <b>Decomposition into bases.</b> Any vector in a 2D plane is{" "}
                <span className={MONO}>v_x · x̂ + v_y · ŷ</span>. Choose a different basis and the
                components change without changing the vector — exactly the situation arc 6 of the
                projectile-motion page hints at when it discusses the independence of horizontal and
                vertical motion.
              </li>
            </>,
            <>
              <li>
                <b>선형 보간.</b>{" "}
                <span className={FORMULA_INLINE}>lerp(A, B, t) = (1 − t)·A + t·B</span> — 덧셈 한
                번, 스칼라배 두 번. 베지에 곡선이 깔린 그 원시 연산.
              </li>
              <li>
                <b>평행 이동.</b> 도형의 모든 점을 같은 벡터 <span className={MONO}>v</span>로
                옮긴다 — 모든 좌표 <span className={MONO}>P</span>를{" "}
                <span className={MONO}>P + v</span>로 교체.
              </li>
              <li>
                <b>선형 결합.</b> <span className={FORMULA_INLINE}>c₁v₁ + c₂v₂ + ⋯</span> 꼴의 모든
                식. 계수 합이 1인 *볼록 결합*은 베지에 위젯이 제어점을 층별로 무너뜨리는 방식.
              </li>
              <li>
                <b>기저 분해.</b> 2D 평면의 임의 벡터는{" "}
                <span className={MONO}>v_x · x̂ + v_y · ŷ</span>. 다른 기저를 고르면 성분은 바뀌지만
                벡터는 그대로 — 포물선-운동 페이지가 *가로/세로 운동의 독립성*을 이야기하며 암시했던
                정확히 그 상황.
              </li>
            </>,
          )}
        </ul>
        <p>
          {pick(
            language,
            <>
              The promise: any quantity that admits component-wise addition and scalar scaling can
              use this entire toolkit. Numbers, points, colors, sounds, function spaces,
              neural-network parameters — all of them count. The tuple's silence on role is what
              lets the toolkit travel.
            </>,
            <>
              약속: 성분별 덧셈과 스칼라배가 정의되는 모든 양이 이 도구 상자를 그대로 쓸 수 있다.
              수, 점, 색, 소리, 함수 공간, 신경망 매개변수 — 전부 자격이 있다. *튜플이 역할에
              침묵한다*는 점이 도구가 영역을 가로질러 가는 이유.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={6}>
        <h3>{pick(language, "Where this module gets consumed", "이 모듈이 어디서 소비되는가")}</h3>
        <p>
          {pick(
            language,
            <>
              Every application Lemma ships either consumes vectors directly or hides them inside a
              higher-level abstraction. The widget's role toggle is not just rhetoric — each role
              corresponds to a live application that actually performs that arithmetic.
            </>,
            <>
              Lemma의 모든 응용이 벡터를 *직접 소비*하거나 더 높은 수준의 추상 안에 *숨겨서* 쓴다.
              위젯의 역할 토글은 수사가 아니다 — 각 역할이 실제로 그 산술을 수행하는 살아있는 응용에
              대응한다.
            </>,
          )}
        </p>
        <ul className="m-0 list-none space-y-2 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <Link
                  to="/graphics/bezier-curves"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>Bezier curves</b>
                </Link>{" "}
                — <Term id="control-point">control points</Term> are points; the recursive lerp uses
                convex combinations of those points; the resulting curve is a path of position
                vectors parametrized by <span className={MONO}>t</span>.
              </li>
              <li>
                <Link
                  to="/physics/projectile-motion"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>Projectile motion</b>
                </Link>{" "}
                — launch velocity is a vector, decomposed into{" "}
                <span className={MONO}>(v₀ cos θ, v₀ sin θ)</span>. The position over time is
                another vector, computed component-wise.
              </li>
              <li>
                <Link
                  to="/ml/gradient-descent"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>Gradient descent</b>
                </Link>{" "}
                — the parameter <span className={MONO}>w</span> in the toy widget is a scalar only
                because the toy has one parameter. The real version operates on a parameter{" "}
                <em>vector</em>; the gradient is the vector of partial derivatives; the descent step
                is vector subtraction.
              </li>
              <li>
                <Link
                  to="/finance/bitcoin-signature"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>Bitcoin signatures</b>
                </Link>{" "}
                — points on the curve are 2-tuples; the chord-and-tangent group law is described as
                point arithmetic, but every implementation works on the underlying coordinate
                vectors.
              </li>
            </>,
            <>
              <li>
                <Link
                  to="/graphics/bezier-curves"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>베지에 곡선</b>
                </Link>{" "}
                — <Term id="control-point">제어점</Term>은 점이고, 재귀 lerp는 그 점들의 *볼록
                결합*, 결과로 나오는 곡선은 매개변수 <span className={MONO}>t</span>가 만드는 위치
                벡터의 경로.
              </li>
              <li>
                <Link
                  to="/physics/projectile-motion"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>포물선 운동</b>
                </Link>{" "}
                — 발사 속도는 벡터, <span className={MONO}>(v₀ cos θ, v₀ sin θ)</span>로 성분 분해.
                시간에 따른 위치는 또 다른 벡터로, 성분별 계산.
              </li>
              <li>
                <Link
                  to="/ml/gradient-descent"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>경사하강법</b>
                </Link>{" "}
                — 토이 위젯의 <span className={MONO}>w</span>가 스칼라인 건 토이가 매개변수를 하나만
                갖기 때문. 실제 버전은 매개변수 *벡터*에서 작동하고, 기울기는 편미분의 벡터, 한
                스텝은 *벡터 뺄셈*.
              </li>
              <li>
                <Link
                  to="/finance/bitcoin-signature"
                  className="border-b border-dotted text-acc no-underline hover:border-acc"
                >
                  <b>비트코인 서명</b>
                </Link>{" "}
                — 곡선 위의 점은 2-튜플, 현·접선 군 법칙은 점 산술로 묘사되지만, 모든 구현은 그
                아래의 좌표 *벡터*에서 일한다.
              </li>
            </>,
          )}
        </ul>
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
            <b>The tuple is silent on role.</b> Add component-wise. Scale by a number. The
            arithmetic stays the same; what changes is the costume the application gives the answer.
          </>,
          <>
            <b>튜플은 역할에 대해 침묵한다.</b> 성분별로 더하라. 수로 늘여라. 산술은 그대로 남는다;
            바뀌는 것은 응용이 그 답에게 입히는 옷뿐이다.
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
        tag={{ en: "add by hand", ko: "손으로 더하기" }}
        prompt={{
          en: (
            <>
              <span className={FORMULA_INLINE}>A = (2, 1)</span>,{" "}
              <span className={FORMULA_INLINE}>v = (3, 4)</span>. Compute{" "}
              <span className={MONO}>A + v</span>, <span className={MONO}>A − v</span>, and{" "}
              <span className={MONO}>2v</span>. Sketch all three on graph paper and explain in one
              sentence why the first answers <em>"where do I end up?"</em>, the second{" "}
              <em>"where did I come from?"</em>, and the third{" "}
              <em>"what if my step is twice as long?"</em>
            </>
          ),
          ko: (
            <>
              <span className={FORMULA_INLINE}>A = (2, 1)</span>,{" "}
              <span className={FORMULA_INLINE}>v = (3, 4)</span>.{" "}
              <span className={MONO}>A + v</span>, <span className={MONO}>A − v</span>,{" "}
              <span className={MONO}>2v</span>를 계산. 셋을 모눈종이에 그려보고, 첫째가 왜{" "}
              <em>"내가 어디로 가는가?"</em>, 둘째가 <em>"어디서 왔는가?"</em>, 셋째가{" "}
              <em>"내 한 걸음이 두 배 길면?"</em>에 답하는지 한 문장으로 설명.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>A + v = (5, 5)</span>: walk from{" "}
              <span className={MONO}>(2, 1)</span> by 3 right and 4 up, end up at{" "}
              <span className={MONO}>(5, 5)</span>. <span className={MONO}>A − v = (−1, −3)</span>:
              walk *backwards* — that's where you would have started if your final step ended at A.{" "}
              <span className={MONO}>2v = (6, 8)</span>: same direction, twice the distance — the
              point you'd land at if you took two of those steps from the origin instead of one.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>A + v = (5, 5)</span>: <span className={MONO}>(2, 1)</span>에서
              오른쪽 3 + 위로 4를 걸으면 <span className={MONO}>(5, 5)</span>.{" "}
              <span className={MONO}>A − v = (−1, −3)</span>: *반대로* 걷는다 — 마지막 걸음이 A에서
              끝났다면 출발점이 거기였다는 의미. <span className={MONO}>2v = (6, 8)</span>: 같은
              방향, 거리만 두 배 — 원점에서 한 걸음 대신 두 걸음을 갔을 때의 도착점.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "decompose a launch velocity", ko: "발사 속도 분해" }}
        prompt={{
          en: (
            <>
              A ball is thrown at <span className={MONO}>v₀ = 10 m/s</span> at angle{" "}
              <span className={MONO}>θ = 30°</span> above horizontal. Decompose the velocity into{" "}
              <span className={MONO}>(v_x, v_y)</span> using{" "}
              <span className={MONO}>cos 30° = √3/2 ≈ 0.87</span>,{" "}
              <span className={MONO}>sin 30° = 1/2</span>. After 0.4 s of flight (ignoring gravity
              for this exercise), what's the displacement vector?
            </>
          ),
          ko: (
            <>
              공이 <span className={MONO}>v₀ = 10 m/s</span>, 수평 위쪽{" "}
              <span className={MONO}>θ = 30°</span>로 던져진다. 속도를{" "}
              <span className={MONO}>(v_x, v_y)</span>로 분해하라.{" "}
              <span className={MONO}>cos 30° = √3/2 ≈ 0.87</span>,{" "}
              <span className={MONO}>sin 30° = 1/2</span>. 비행 0.4 s 후의 변위 벡터는? (이
              문제에서는 중력 무시.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>v = (10·0.87, 10·0.5) = (8.7, 5.0) m/s</span>. Displacement
              after <span className={MONO}>Δt = 0.4 s</span>:{" "}
              <span className={MONO}>0.4 · v = (3.48, 2.0) m</span>. The vector pointing in the
              throw's direction with length <span className={MONO}>10 · 0.4 = 4 m</span>. Same
              vector, two ways of describing it.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>v = (10·0.87, 10·0.5) = (8.7, 5.0) m/s</span>.{" "}
              <span className={MONO}>Δt = 0.4 s</span> 후 변위:{" "}
              <span className={MONO}>0.4 · v = (3.48, 2.0) m</span>. 던진 방향을 가리키는, 길이{" "}
              <span className={MONO}>10 · 0.4 = 4 m</span>의 벡터. 같은 벡터, 두 가지 묘사.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "the tangent vector", ko: "접선 벡터" }}
        prompt={{
          en: (
            <>
              On a Bezier curve with control points{" "}
              <span className={FORMULA_INLINE}>P₀, P₁, P₂, P₃</span>, the tangent at{" "}
              <span className={MONO}>t = 0</span> points in the direction{" "}
              <span className={MONO}>P₁ − P₀</span>. Why is that vector — not the position of{" "}
              <span className={MONO}>P₁</span> by itself — the right thing to call the "starting
              direction"?
            </>
          ),
          ko: (
            <>
              제어점 <span className={FORMULA_INLINE}>P₀, P₁, P₂, P₃</span>의 베지에 곡선에서{" "}
              <span className={MONO}>t = 0</span>의 접선은 <span className={MONO}>P₁ − P₀</span>{" "}
              방향. *그 벡터*가 — <span className={MONO}>P₁</span>의 위치 자체가 아니라 — 왜 "출발
              방향"이라 불려야 마땅한가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              The position <span className={MONO}>P₁</span> depends on where the origin sits; moving
              the canvas changes <span className={MONO}>P₁</span> but doesn't change the shape of
              the curve. The vector <span className={MONO}>P₁ − P₀</span> is origin-free — it's a
              displacement, not a position. It captures *the direction the curve heads from{" "}
              <span className={MONO}>P₀</span>*, which is a property of the curve, not of where you
              put the page on the desk. That's exactly the position/displacement distinction this
              module insists on.
            </>
          ),
          ko: (
            <>
              위치 <span className={MONO}>P₁</span>은 원점이 어디 있는지에 의존 — 캔버스를 옮기면{" "}
              <span className={MONO}>P₁</span>이 바뀌지만 곡선의 *모양*은 그대로다. 벡터{" "}
              <span className={MONO}>P₁ − P₀</span>은 원점-자유 — 위치가 아니라 변위.{" "}
              <span className={MONO}>P₀</span>에서 곡선이 *떠나는 방향*을 잡고, 이는 곡선의 성질이지
              종이를 책상 어디에 놓느냐의 성질이 아니다. 이 모듈이 고집하는 *위치 vs 변위* 구분
              그대로.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "the gradient is a vector", ko: "기울기는 벡터다" }}
        prompt={{
          en: (
            <>
              The toy gradient-descent page has one parameter <span className={MONO}>w</span> and
              one gradient <span className={MONO}>L'(w)</span> — both scalars. With two parameters{" "}
              <span className={MONO}>(w₁, w₂)</span>, the loss has two partial derivatives{" "}
              <span className={FORMULA_INLINE}>(∂L/∂w₁, ∂L/∂w₂)</span>. Write the descent step{" "}
              <span className={MONO}>w ← w − η · ∇L</span> in component form. Which arithmetic from
              this module are you using?
            </>
          ),
          ko: (
            <>
              토이 경사하강법 페이지는 매개변수 하나 <span className={MONO}>w</span>와 기울기 하나{" "}
              <span className={MONO}>L'(w)</span> — 둘 다 스칼라. 매개변수 둘{" "}
              <span className={MONO}>(w₁, w₂)</span>면 손실은 편미분 둘{" "}
              <span className={FORMULA_INLINE}>(∂L/∂w₁, ∂L/∂w₂)</span>를 가진다. 하강 스텝{" "}
              <span className={MONO}>w ← w − η · ∇L</span>을 성분 형태로 쓰자. 이 모듈의 어느 산술을
              쓰고 있는가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Component form:{" "}
              <span className={MONO}>(w₁, w₂) ← (w₁ − η·∂L/∂w₁, w₂ − η·∂L/∂w₂)</span>. The right
              side is <em>vector subtraction</em>{" "}
              <span className={MONO}>(w₁, w₂) − η·(∂L/∂w₁, ∂L/∂w₂)</span> — addition (with a
              negative sign) and scalar multiplication, the only two operations vectors need. All ML
              training in higher dimensions is the same one-line update; the gradient just becomes a
              longer vector.
            </>
          ),
          ko: (
            <>
              성분 형태: <span className={MONO}>(w₁, w₂) ← (w₁ − η·∂L/∂w₁, w₂ − η·∂L/∂w₂)</span>.
              우변은 *벡터 뺄셈* <span className={MONO}>(w₁, w₂) − η·(∂L/∂w₁, ∂L/∂w₂)</span> — 덧셈
              (음의 부호와 함께)과 스칼라 곱, 벡터에 필요한 단 두 연산. 더 높은 차원의 모든 ML
              훈련이 같은 한-줄 갱신; 기울기가 더 긴 벡터가 될 뿐이다.
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
            module: <b>Vectors</b>. Consumed (directly or implicitly) by every other application
            Lemma ships. Started as <em>"why do four pillars all use the same arrow?"</em>, ends as{" "}
            <em>"because they share two operations: add and scale."</em>
          </>,
          <>
            모듈: <b>벡터</b>. Lemma의 모든 응용이 (명시적으로든 암묵적으로든) 소비. 시작은{" "}
            <em>"왜 네 필러가 모두 같은 화살표를 쓰는가?"</em>, 끝은{" "}
            <em>"두 연산 — 더하기와 늘이기 — 을 공유하기 때문."</em>
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function Vectors({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Vectors · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <VectorRoles />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
