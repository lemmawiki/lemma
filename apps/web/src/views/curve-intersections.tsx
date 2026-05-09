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

type CodeMap = { arc4: string };

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
        {pick(language, "graphics · curve intersections", "그래픽 · 곡선의 교차")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · the count that won't sit still", "도입 · 가만히 있지 않는 수")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>Where do the missing intersections go?</>,
          <>사라진 교점들은 어디로 갔을까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            Drag two conics on a screen. Sometimes you see <b>four</b> crossings. Sometimes{" "}
            <b>two</b>. Sometimes <b>one</b>. Sometimes <b>none</b>. A physics engine doing
            collision, a vector tool doing clipping, a font rasterizer doing outline cleanup, a ray
            tracer doing picking — all of them need a <em>stable</em> answer to "how many?" What you
            see on screen flickers; the math underneath does not.
          </>,
          <>
            화면 위 두 이차곡선을 끌어보라. 어떤 때는 교점 <b>네 개</b>, 어떤 때는 <b>둘</b>,{" "}
            <b>하나</b>, <b>없음</b>. 충돌을 계산하는 물리 엔진, 클리핑하는 벡터 도구, 외곽선을
            정리하는 폰트 래스터라이저, 픽킹하는 레이 트레이서 — 모두 "몇 개?"에 *흔들리지 않는*
            답이 필요하다. 눈에 보이는 수는 깜빡인다. 그 밑의 수학은 그렇지 않다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            <Link
              to="/modules/bezout"
              className="border-b border-dotted text-acc no-underline hover:border-acc"
            >
              Bezout's theorem
            </Link>{" "}
            says the count is always <b>4</b> for two conics — counted in the right number system,
            on the right plane, with the right multiplicity. The widget below is the same one the
            Bezout module ships with; here it answers a different question:{" "}
            <em>which subset of those 4 is what the screen actually shows?</em>
          </>,
          <>
            <Link
              to="/modules/bezout"
              className="border-b border-dotted text-acc no-underline hover:border-acc"
            >
              베주 정리
            </Link>
            는 두 이차곡선의 교점이 늘 <b>4개</b>라고 말한다 — 올바른 수 체계, 올바른 평면, 올바른
            중복도로 셀 때. 아래 위젯은 베주 모듈에 실린 그 위젯과 *같은 것*이다. 여기서는 다른
            질문에 답한다: <em>그 4개 중 화면이 *실제로* 보여주는 부분집합이 무엇인가?</em>
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
        <h3>
          {pick(
            language,
            "What the screen sees vs. what is there",
            "화면이 보는 것 vs 거기 있는 것",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              Two real curves on a 2D plane. The "visible count" is just{" "}
              <em>the number of points your eye finds at the same pixel</em> — real coordinates,
              both finite. That is the count a naive collision detector returns by raster sampling,
              or a CAD engine returns by approximate root-finding. It depends on where the curves
              happen to be drifting today and is not stable under tiny perturbations.
            </>,
            <>
              2D 평면 위의 두 실수 곡선. *눈에 보이는 수*는 *같은 픽셀에서 두 곡선이 만나는 점의 수*
              — 좌표가 실수이고 둘 다 유한할 때. 단순한 충돌 검출기가 래스터 샘플링으로 내놓는 수,
              CAD 엔진이 근사 근-찾기로 내놓는 수가 그것이다. 오늘 곡선들이 표류한 위치에 의존하고,
              작은 섭동에도 흔들린다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Try the widget. The <span className={MONO}>general</span> preset shows 4 real
              crossings — visible count agrees with Bezout. The{" "}
              <span className={MONO}>tangent</span> preset drops to 3 visible — turn on{" "}
              <em>show multiplicity</em> and one of those gets a <span className={MONO}>×2</span>{" "}
              tag. The <span className={MONO}>disjoint</span> preset shows 0 visible — turn on{" "}
              <em>show complex</em> and four open dots appear in the side panel. None of the missing
              intersections were lost. They just left the real-affine plane.
            </>,
            <>
              위젯에서: <span className={MONO}>일반</span> 프리셋은 실수 교점 4개 — 눈에 보이는 수와
              베주 셈이 일치. <span className={MONO}>접</span> 프리셋은 3개로 보이지만{" "}
              <em>중복도 표시</em>를 켜면 그중 하나에 <span className={MONO}>×2</span> 라벨이
              붙는다. <span className={MONO}>분리</span> 프리셋은 0개로 보이지만 <em>복소 보기</em>
              를 켜면 옆 패널에 빈 동그라미 네 개가 뜬다. 사라진 교점은 잃어버린 게 아니다. 실-아핀
              평면을 떠났을 뿐.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "Three places they hide", "세 가지 숨는 곳")}</h3>
        <p>
          {pick(
            language,
            <>
              Bezout's repair (covered fully in the{" "}
              <Link
                to="/modules/bezout"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                Bezout module
              </Link>
              ) tells you exactly where the missing crossings went. Three corrections; three places
              to look.
            </>,
            <>
              베주의 수선 (자세한 건{" "}
              <Link
                to="/modules/bezout"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                베주 모듈
              </Link>
              에)이 사라진 교점이 어디로 갔는지 정확히 말해준다. 세 가지 보정, 세 군데 검색 위치.
            </>,
          )}
        </p>
        <ul className="m-0 mb-2 list-none space-y-1.5 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <b>Tangency.</b> Two crossings collapsed onto one geometric point — the algebra
                still says two, but the renderer sees one dot. The bookkeeping is{" "}
                <Term id="intersection-multiplicity">intersection multiplicity</Term>: a tangent
                intersection counts as 2.
              </li>
              <li>
                <b>Off the visible plane.</b> The intersection points have complex coordinates —
                they exist as solutions of the algebra but cannot be plotted in the real{" "}
                <span className={MONO}>(x, y)</span> grid. Two disjoint circles still intersect at{" "}
                <span className={FORMULA_INLINE}>(3/2, ± i √5 / 2)</span>; the screen has nowhere to
                put those.
              </li>
              <li>
                <b>At infinity.</b> Some intersections live on the line at infinity. Every two
                distinct circles, no matter where they sit, share the two <em>circular points</em>{" "}
                <span className={FORMULA_INLINE}>I = [1 : i : 0]</span> and{" "}
                <span className={FORMULA_INLINE}>J = [1 : −i : 0]</span> — that's two of their four
                Bezout intersections, off-screen and complex, accounted for whether you like it or
                not. The fix is the <Term id="projective-plane">projective plane</Term>.
              </li>
            </>,
            <>
              <li>
                <b>접점.</b> 두 교점이 한 기하 점으로 무너짐 — 대수는 여전히 둘이라 하지만 렌더러는
                한 점만 본다. 장부는 <Term id="intersection-multiplicity">교차 중복도</Term>: 접
                교점은 2로 센다.
              </li>
              <li>
                <b>보이는 평면 밖.</b> 교점의 좌표가 복소수 — 대수의 해로는 존재하지만 실수{" "}
                <span className={MONO}>(x, y)</span> 격자 위에 그릴 수 없다. 떨어진 두 단위원도{" "}
                <span className={FORMULA_INLINE}>(3/2, ± i √5 / 2)</span>에서 교차한다. 화면엔 이
                점을 놓을 자리가 없다.
              </li>
              <li>
                <b>무한대.</b> 어떤 교점은 무한원선 위에 산다. 서로 다른 두 원은 어디 있든 항상 두{" "}
                *원형점* <span className={FORMULA_INLINE}>I = [1 : i : 0]</span>과{" "}
                <span className={FORMULA_INLINE}>J = [1 : −i : 0]</span>을 공유한다 — 베주 셈 4개 중
                2개가 이미 화면 밖, 복소, 자동 적립. 보정은{" "}
                <Term id="projective-plane">사영평면</Term>.
              </li>
            </>,
          )}
        </ul>
      </ArcRow>

      <ArcRow n={3}>
        <h3>
          {pick(
            language,
            "Why a graphics engine cares about the stable count",
            "그래픽 엔진이 *흔들리지 않는 수*를 챙기는 이유",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              An engine that only watches "visible count" is fragile. Two near-tangent circles can
              have visible-count 0, 1, or 2 depending on a sub-pixel jitter. A renderer that reports
              "no intersection" one frame and "two intersections" the next is reporting numerical
              noise as physics. The fix is to compute the <em>algebraic</em> count — the one Bezout
              guarantees — and then classify each root.
            </>,
            <>
              "보이는 수"만 보는 엔진은 부서지기 쉽다. 거의-접하는 두 원은 서브-픽셀 진동에 따라
              보이는 수가 0, 1, 또는 2일 수 있다. 한 프레임에 "교점 없음", 다음 프레임에 "교점
              둘"이라고 보고하는 렌더러는 수치 잡음을 물리로 보고하는 셈이다. 해법은 *대수적* 수 —
              베주가 보장하는 그 수 — 를 계산한 뒤 각 근을 *분류*하는 것.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Practically: solve the y-resultant (a quartic in x), find its 4 complex roots with
              multiplicity, then label each one as <em>real-affine</em> (visible), <em>complex</em>{" "}
              (off-plane), or <em>at infinity</em> (asymptotic). The visible count is the size of
              the first bucket. Tangencies are marked by repeated roots, not by "two roots that
              happen to be very close." A <em>multiplicity-2 real root</em> and{" "}
              <em>two distinct real roots within ε of each other</em> are different geometric
              situations that look identical on screen — the algebraic classification keeps them
              apart.
            </>,
            <>
              실제로는: y-종결식(x에 대한 4차)을 풀고, 중복도 포함한 4개의 복소근을 찾은 뒤, 각 근을{" "}
              <em>실-아핀</em> (보임), <em>복소</em> (평면 밖), <em>무한원</em> (점근적) 중 하나로
              라벨링한다. 보이는 수는 첫 번째 버킷의 크기. 접은 *중복근*으로 표시되지, "우연히 매우
              가까운 두 근"이 아니다. <em>중복도 2의 실수 근 하나</em>와{" "}
              <em>서로 ε 이내의 서로 다른 실수 근 둘</em>은 화면상 똑같아 보이지만 *기하적으로 다른
              상황* — 대수적 분류가 둘을 구분해준다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={4}>
        <h3>{pick(language, "What the engine actually computes", "엔진이 실제로 계산하는 것")}</h3>
        <p>
          {pick(
            language,
            <>
              The pipeline is short. (1) <Term id="resultant">Eliminate one variable</Term> from the
              two conic equations to get a single polynomial in the other — a quartic when both
              inputs are degree 2. (2) Find its roots numerically (Durand–Kerner or similar). (3)
              Recover the corresponding y-coordinates by linear back-substitution. (4) Tag each
              intersection as real-affine, complex, or at infinity. The widget above performs steps
              1–4 every time you move a slider.
            </>,
            <>
              파이프라인은 짧다. (1) 두 이차곡선 식에서 <Term id="resultant">한 변수를 소거</Term>해
              다른 변수의 단일 다항식을 얻는다 — 둘 다 차수 2면 4차식. (2) 그 근을 수치적으로 찾는다
              (Durand–Kerner 등). (3) 대응하는 y 좌표를 선형 역대입으로 복구. (4) 각 교점을 실-아핀,
              복소, 무한 중 하나로 라벨링. 위 위젯은 슬라이더를 움직일 때마다 1–4를 매번 수행한다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>
          {pick(language, "Where this shows up in a graphics stack", "그래픽 스택 안의 자리")}
        </h3>
        <p>
          {pick(
            language,
            <>The same Bezout-and-classify logic, in different costumes, runs in:</>,
            <>같은 *베주-와-분류* 로직이 옷만 바꿔서 다음에서 작동한다:</>,
          )}
        </p>
        <ul className="m-0 list-none space-y-1.5 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <b>Collision detection.</b> Two convex shapes (circles, ellipses, capsules) meet how
                many times? Bezout gives the upper bound; tangency-with-multiplicity detects
                glancing contact; "0 real, 4 complex" reports clearly disjoint.
              </li>
              <li>
                <b>Vector clipping.</b> When you intersect two paths in Illustrator/Figma, the tool
                computes algebraic intersections of cubic Bezier segments — degree 3 × degree 3 = up
                to 9 algebraic, classified into visible / out-of-segment / tangent.
              </li>
              <li>
                <b>Ray–curve picking.</b> A line (degree 1) meets a conic (degree 2) in 2 algebraic
                points. The mouse picks the first real-affine one along the ray. If both are
                complex, the click misses.
              </li>
              <li>
                <b>Font outline rasterization.</b> A horizontal scanline (degree 1) crosses a glyph
                outline (Beziers up to degree 3) in d·1 = d points. Counting those with multiplicity
                gives the even-odd fill rule for free.
              </li>
            </>,
            <>
              <li>
                <b>충돌 검출.</b> 두 볼록 도형 (원·타원·캡슐)의 교차 횟수는? 베주가 상한, 접 +
                중복도가 스치는 접촉 검출, "실수 0 + 복소 4"가 명확한 분리를 보고.
              </li>
              <li>
                <b>벡터 클리핑.</b> Illustrator/Figma의 두 경로 교차 계산 — 3차 베지에 × 3차 베지에
                = 최대 9개의 대수 교점을 보임/구간 밖/접으로 분류.
              </li>
              <li>
                <b>레이-곡선 픽킹.</b> 직선 (차수 1)과 이차곡선 (차수 2)은 대수 교점 2개. 마우스
                클릭은 레이를 따라 첫 번째 실-아핀 교점을 고른다. 둘 다 복소면 클릭이 빗나간다.
              </li>
              <li>
                <b>폰트 외곽선 래스터화.</b> 수평 스캔라인 (차수 1)이 글리프 외곽선 (3차까지의
                베지에)을 d·1 = d개의 점에서 가른다. 중복도 포함 카운트가 짝-홀 채움 규칙을 *공짜*
                로 준다.
              </li>
            </>,
          )}
        </ul>
        <p>
          {pick(
            language,
            <>
              In every case the surface story is "count and classify"; the deep story is Bezout's
              theorem and a root-classifier. The shape changes; the count protocol doesn't.
            </>,
            <>
              모든 경우에서 표면의 이야기는 "세고 분류한다"이고, 깊은 이야기는 베주 정리 + 근
              분류기. 모양은 달라지지만 *셈의 프로토콜*은 그대로.
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
            <b>Real intersections come and go. Bezout's count never does.</b> What the screen shows
            is the real-affine subset of a number that doesn't change. A graphics engine keeps the
            count and classifies each member; the picture is just one bucket.
          </>,
          <>
            <b>실수 교점은 왔다 갔다 한다. 베주의 수는 그렇지 않다.</b> 화면이 보여주는 건 변하지
            않는 그 수의 *실-아핀* 부분집합. 그래픽 엔진은 수 자체를 유지하고 각 원소를 분류한다 —
            그림은 그 한 버킷일 뿐.
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
        tag={{ en: "line meets circle", ko: "직선과 원" }}
        prompt={{
          en: (
            <>
              The line <span className={FORMULA_INLINE}>y = mx + c</span> meets the unit circle{" "}
              <span className={FORMULA_INLINE}>x² + y² = 1</span> in how many points, by Bezout? For
              what range of <span className={MONO}>(m, c)</span> are all of those visible
              (real-affine), and for what range do the missing ones become complex? Sketch one
              example of each.
            </>
          ),
          ko: (
            <>
              직선 <span className={FORMULA_INLINE}>y = mx + c</span>는 단위원{" "}
              <span className={FORMULA_INLINE}>x² + y² = 1</span>과 베주 셈으로 몇 점에서 만나나?
              어떤 <span className={MONO}>(m, c)</span> 범위에서 모두 보이고 (실-아핀), 어떤
              범위에서 사라진 것이 복소가 되는가? 각각 한 예씩 그려보라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Bezout: 1·2 = <b>2</b>. Substitute to get{" "}
              <span className={MONO}>(1+m²)x² + 2mc·x + (c²−1) = 0</span>; discriminant is{" "}
              <span className={MONO}>4(m² + 1 − c²)</span>. <b>Two real-affine</b> when{" "}
              <span className={MONO}>c² &lt; m² + 1</span> (the line crosses the disk).{" "}
              <b>Tangent (multiplicity 2)</b> when <span className={MONO}>c² = m² + 1</span>.{" "}
              <b>Two complex</b> when <span className={MONO}>c² &gt; m² + 1</span> (the line misses
              the circle entirely on the real plane). Same Bezout count of 2 in all three cases.
            </>
          ),
          ko: (
            <>
              베주: 1·2 = <b>2</b>. 대입하면{" "}
              <span className={MONO}>(1+m²)x² + 2mc·x + (c²−1) = 0</span>, 판별식{" "}
              <span className={MONO}>4(m² + 1 − c²)</span>. <b>실-아핀 둘</b>은{" "}
              <span className={MONO}>c² &lt; m² + 1</span>일 때 (직선이 원반을 가로지름).{" "}
              <b>접 (중복도 2)</b>은 <span className={MONO}>c² = m² + 1</span>. <b>복소 둘</b>은{" "}
              <span className={MONO}>c² &gt; m² + 1</span> (실평면에서 원과 만나지 않음). 세 경우
              모두 베주 셈은 동일한 2.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        tag={{ en: "two circles share infinity", ko: "두 원은 무한원을 공유한다" }}
        prompt={{
          en: (
            <>
              Take any two distinct circles. Bezout says they meet 4 times. Yet the picture on
              screen never shows more than 2 real-affine intersections. Where are the other 2
              always? (Hint: the <Term id="homogenize">homogenized</Term> equation of any circle,
              evaluated at the line at infinity <span className={MONO}>Z = 0</span>, depends only on
              the leading term.)
            </>
          ),
          ko: (
            <>
              서로 다른 두 원을 잡자. 베주는 4번 만난다고 한다. 그런데 화면 그림은 실-아핀 교점이
              항상 2개 이하다. 나머지 2개는 *항상* 어디에 있나? (힌트: 원의{" "}
              <Term id="homogenize">동차화</Term>식을 무한원선 <span className={MONO}>Z = 0</span>에
              대입하면 최고차 항만 남는다.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Homogenize <span className={MONO}>x² + y² + ax + by + c = 0</span> →{" "}
              <span className={MONO}>X² + Y² + aXZ + bYZ + cZ² = 0</span>. At{" "}
              <span className={MONO}>Z = 0</span>: <span className={MONO}>X² + Y² = 0</span>, so{" "}
              <span className={MONO}>[X : Y : 0] = [1 : ± i : 0]</span> — independent of{" "}
              <span className={MONO}>a, b, c</span>. So <em>every</em> circle passes through{" "}
              <span className={MONO}>I = [1 : i : 0]</span> and{" "}
              <span className={MONO}>J = [1 : −i : 0]</span> at infinity. Two distinct circles share
              both. Bezout's 4 = (≤ 2 real-affine) + (2 complex at infinity). When the real-affine
              count drops below 2, multiplicity or complex-affine intersections fill the gap.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>x² + y² + ax + by + c = 0</span>을 동차화하면{" "}
              <span className={MONO}>X² + Y² + aXZ + bYZ + cZ² = 0</span>.{" "}
              <span className={MONO}>Z = 0</span>에서 <span className={MONO}>X² + Y² = 0</span>, 즉{" "}
              <span className={MONO}>[X : Y : 0] = [1 : ± i : 0]</span> —{" "}
              <span className={MONO}>a, b, c</span>와 무관. 그러므로 *모든* 원이{" "}
              <span className={MONO}>I = [1 : i : 0]</span>과{" "}
              <span className={MONO}>J = [1 : −i : 0]</span>을 무한원에서 지난다. 서로 다른 두 원은
              둘 다 공유. 베주 4 = (≤ 2 실-아핀) + (2 복소 무한원). 실-아핀 수가 2 이하로 내려가면
              중복도 또는 복소-아핀 교점이 그 자리를 메운다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        noCalculator
        tag={{ en: "tangent vs near-miss", ko: "접 vs 거의-빗나감" }}
        prompt={{
          en: (
            <>
              An engine has two parameters: an angle <span className={MONO}>θ</span> and a tolerance{" "}
              <span className={MONO}>ε</span>. As <span className={MONO}>θ</span> sweeps through a
              tangent configuration, the visible-count goes 2 → 1 → 0 → 1 → 2. The "tangent" instant
              is one configuration; the surrounding "near-tangent" instants are different. State the
              difference algebraically (one root with multiplicity 2 vs two roots within ε), and
              explain why a robust engine should not dedupe based on raw{" "}
              <span className={MONO}>ε</span>-distance.
            </>
          ),
          ko: (
            <>
              엔진에 매개변수 둘: 각도 <span className={MONO}>θ</span>와 허용오차{" "}
              <span className={MONO}>ε</span>. <span className={MONO}>θ</span>가 접 배치를 지나갈 때
              보이는 수는 2 → 1 → 0 → 1 → 2로 변한다. *접* 순간은 하나의 배치, 그 주변 *거의-접*
              순간은 다른 배치. 대수적으로 차이를 진술하고 (중복도 2의 한 근 vs ε 이내의 서로 다른
              두 근), 왜 견고한 엔진이 단순 <span className={MONO}>ε</span>-거리로 중복제거하면 안
              되는지 설명하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              At the tangent instant, the resultant has a <em>repeated</em> real root{" "}
              <span className={MONO}>x = a</span> — the polynomial factors as{" "}
              <span className={MONO}>(x − a)² · q(x)</span>. Near-tangent has two close but{" "}
              <em>simple</em> real roots <span className={MONO}>a ± δ</span>. Both look like "one
              point" to a tolerance-based deduplicator with <span className={MONO}>ε &gt; δ</span>;
              but the tangent case has different physics (no transverse crossing — the curves graze
              and separate) and different robustness behaviour (stable under perturbation in one
              direction; unstable in the other). Robust engines compute exact discriminants when
              possible, or use interval arithmetic to bound the multiplicity decision — never raw
              distance alone.
            </>
          ),
          ko: (
            <>
              접 순간엔 종결식이 <em>중근</em> <span className={MONO}>x = a</span>를 가진다 —
              다항식이 <span className={MONO}>(x − a)² · q(x)</span>로 인수분해된다. 거의-접은
              가까운 *단순* 실수 근 둘 <span className={MONO}>a ± δ</span>. 둘 다{" "}
              <span className={MONO}>ε &gt; δ</span>인 허용오차 기반 중복제거기에는 "한 점"으로
              보인다. 그러나 접 경우는 물리가 다르다 (가로지름 없음 — 곡선이 스치고 분리), 견고성
              거동도 다르다 (한 방향으로 섭동에 안정, 반대로는 불안정). 견고한 엔진은 가능하면
              정확한 판별식을 계산하거나, 구간 산술로 중복도 결정의 경계를 잡는다 — 단순 거리만 보지
              않는다.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "the cubic that won't fit", ko: "맞지 않는 삼차" }}
        prompt={{
          en: (
            <>
              You're computing intersections of a horizontal line{" "}
              <span className={FORMULA_INLINE}>y = 0</span> with the cubic{" "}
              <span className={FORMULA_INLINE}>y = x³ + 1</span>. Bezout predicts 1·3 = 3. How many
              real-affine? Where are the others? (No <span className={MONO}>i</span> required for
              the visible ones; one for each of the others.)
            </>
          ),
          ko: (
            <>
              수평 직선 <span className={FORMULA_INLINE}>y = 0</span>과 3차 곡선{" "}
              <span className={FORMULA_INLINE}>y = x³ + 1</span>의 교점을 계산한다. 베주 예측: 1·3 =
              3. 실-아핀은 몇 개? 나머지는 어디? (보이는 것에는 <span className={MONO}>i</span>가
              필요 없고, 나머지에는 각각 하나씩.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Solve <span className={MONO}>x³ + 1 = 0</span>: roots are the cube roots of −1, i.e.{" "}
              <span className={MONO}>x = −1</span>,{" "}
              <span className={MONO}>x = e^(iπ/3) = ½ + i√3/2</span>, and{" "}
              <span className={MONO}>x = e^(−iπ/3) = ½ − i√3/2</span>.{" "}
              <b>One real-affine intersection</b> at <span className={MONO}>(−1, 0)</span> — the
              only point you'll see plotted. <b>Two complex</b> at the conjugate pair, off the real
              plane. Bezout count: 3, picture count: 1, missing count: 2 complex.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>x³ + 1 = 0</span>을 풀면 −1의 세제곱근:{" "}
              <span className={MONO}>x = −1</span>,{" "}
              <span className={MONO}>x = e^(iπ/3) = ½ + i√3/2</span>,{" "}
              <span className={MONO}>x = e^(−iπ/3) = ½ − i√3/2</span>. <b>실-아핀 교점 하나</b>는{" "}
              <span className={MONO}>(−1, 0)</span> — 그래프에 찍히는 유일한 점. <b>복소 둘</b>은
              켤레 쌍, 실평면 밖. 베주 셈: 3, 그림 셈: 1, 사라진 셈: 복소 2.
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
            application: <b>Curve Intersections</b>. Consumes the{" "}
            <Link to="/modules/bezout">Bezout</Link> module — same theorem, different question: "
            <em>which subset of the count is on screen?</em>" Sister application:{" "}
            <Link to="/finance/bitcoin-signature">Bitcoin Signature</Link>, the other Bezout
            consumer.
          </>,
          <>
            응용: <b>곡선의 교차</b>. <Link to="/modules/bezout">베주</Link> 모듈을 소비한다 — 같은
            정리, 다른 질문: "<em>그 셈 중 화면에 있는 부분집합은?</em>" 자매 응용:{" "}
            <Link to="/finance/bitcoin-signature">비트코인 서명</Link>, 또 다른 베주 소비자.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function CurveIntersections({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Curve Intersections · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <ConicIntersect />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
