import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Counterexample, WhyNotTaught } from "../components/meta";
import { Exercise } from "../components/exercise";
import { ControlPoints } from "../components/widgets/control-points";
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
        {pick(language, "graphics · bezier curves", "그래픽 · 베지에 곡선")}
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
          "the hook · a few handles, a smooth path",
          "도입 · 손잡이 몇 개, 매끄러운 길",
        )}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>How does a computer turn a few points into a smooth curve?</>,
          <>컴퓨터는 점 몇 개를 어떻게 매끄러운 곡선으로 바꿀까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            A designer drags four handles. A movie character gets a smooth cheek, a car gets a
            perfect hood, a letter gets its curve. The handles are not <em>on</em> the curve; they
            pull at it like magnets. Move one handle and only the part of the curve nearby changes —
            the rest sits still. <b>One operation, applied recursively, is doing all of this.</b>{" "}
            That operation is linear interpolation between two points.
          </>,
          <>
            디자이너가 손잡이 네 개를 움직인다. 캐릭터의 볼이 매끄러워지고, 자동차 보닛이 휘고,
            글자의 곡선이 잡힌다. 손잡이는 곡선 <em>위에</em> 있지 않다 — 자석처럼 곡선을 끌어당길
            뿐이다. 하나를 움직이면 그 근처 곡선만 바뀌고 나머지는 그대로 있다.{" "}
            <b>한 가지 연산이, 재귀적으로, 이걸 다 한다.</b> 그 연산은 두 점 사이의 선형 보간 —
            그것뿐.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            Drag any handle in the widget below. Slide <b>t</b> across the bottom and watch the
            construction collapse layer by layer onto a single point — that point traces the curve.
          </>,
          <>
            아래 위젯의 손잡이를 끌어보자. <b>t</b>를 슬라이드하면 작도가 한 층씩 무너져 한 점에
            닿는다 — 그 점이 곡선을 그린다.
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
        <h3>{pick(language, "Why not just connect the dots?", "왜 그냥 점들을 잇지 않을까?")}</h3>
        <p>
          {pick(
            language,
            <>
              Imagine asking a computer for "a smooth curve passing through these five points." A
              first attempt: fit a single polynomial. It works for two or three points; for five or
              more it oscillates wildly between them (the Runge phenomenon). Splines fix this by
              stitching local pieces together — but each piece still has to be defined. Bezier's
              idea is different: don't ask for a curve <em>through</em> the points; ask for one{" "}
              <em>shaped by</em> them. The points become handles, not anchors.
            </>,
            <>
              컴퓨터에게 "이 다섯 점을 지나는 매끄러운 곡선"을 그려달라고 한다고 하자. 첫 시도:
              하나의 다항식으로 보간. 점이 두세 개일 때는 작동한다. 다섯 개 이상이면 점들 사이에서
              심하게 출렁인다 (Runge 현상). 스플라인은 *국소* 조각을 이어 붙여 이 문제를 푸는데, 그
              조각 하나하나의 형태를 또 정의해야 한다. 베지에의 발상은 다르다 — 점들을{" "}
              <em>지나는</em> 곡선을 요구하지 말고, 점들이 <em>형태를 잡는</em> 곡선을 요구하자.
              점들은 *닻*이 아니라 *손잡이*가 된다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "The two-point case — lerp", "두 점 케이스 — lerp")}</h3>
        <p>
          {pick(
            language,
            <>
              Between two points <span className={MONO}>P₀</span> and{" "}
              <span className={MONO}>P₁</span>, the linear interpolation <Term id="lerp">lerp</Term>{" "}
              is <span className={FORMULA_INLINE}>lerp(P₀, P₁, t) = (1−t)·P₀ + t·P₁</span>. At{" "}
              <span className={MONO}>t = 0</span> you sit on <span className={MONO}>P₀</span>, at{" "}
              <span className={MONO}>t = 1</span> on <span className={MONO}>P₁</span>, and in
              between you trace the straight line. This is so simple it looks like nothing. But it
              is the <em>only</em> tool Bezier curves need.
            </>,
            <>
              두 점 <span className={MONO}>P₀</span>와 <span className={MONO}>P₁</span> 사이의 선형
              보간 <Term id="lerp">lerp</Term>는{" "}
              <span className={FORMULA_INLINE}>lerp(P₀, P₁, t) = (1−t)·P₀ + t·P₁</span>.{" "}
              <span className={MONO}>t = 0</span>이면 <span className={MONO}>P₀</span>,{" "}
              <span className={MONO}>t = 1</span>이면 <span className={MONO}>P₁</span>, 그 사이는
              직선. 너무 단순해서 아무것도 아닌 듯 보인다. 그런데 베지에 곡선이 필요로 하는 도구는{" "}
              <em>이것뿐</em>이다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>{pick(language, "Recursive lerp — De Casteljau", "재귀적 lerp — 드 카스텔조")}</h3>
        <p>
          {pick(
            language,
            <>
              With four <Term id="control-point">control points</Term>{" "}
              <span className={MONO}>P₀, P₁, P₂, P₃</span>, do this. Lerp every adjacent pair at{" "}
              <span className={MONO}>t</span> to get three new points. Lerp those pairs to get two.
              Lerp those to get one. That last point is <span className={MONO}>B(t)</span>, the
              curve at parameter <span className={MONO}>t</span>. Each "layer" reduces the count by
              one; with <span className={MONO}>n+1</span> controls, you stop after{" "}
              <span className={MONO}>n</span> layers. This is{" "}
              <Term id="de-casteljau">De Casteljau's algorithm</Term>, and it is exactly equivalent
              to the polynomial form{" "}
              <span className={FORMULA_INLINE}>
                B(t) = (1−t)³P₀ + 3(1−t)²t·P₁ + 3(1−t)t²·P₂ + t³P₃
              </span>{" "}
              — same numbers, kinder bookkeeping.
            </>,
            <>
              <Term id="control-point">제어점</Term> 네 개{" "}
              <span className={MONO}>P₀, P₁, P₂, P₃</span>에서, 이렇게 한다. 인접 쌍을 모두{" "}
              <span className={MONO}>t</span>로 lerp해 새 점 셋을 얻는다. 그 셋의 인접 쌍을 lerp해
              둘. 그 둘을 lerp해 하나. 그 마지막 점이 매개변수 <span className={MONO}>t</span>에서의{" "}
              <span className={MONO}>B(t)</span>. 각 "층"은 점의 개수를 1만큼 줄이고, 제어점이{" "}
              <span className={MONO}>n+1</span>개면 <span className={MONO}>n</span>층 뒤에 끝난다.
              이것이 <Term id="de-casteljau">드 카스텔조 알고리즘</Term>이고, 다항식 형태{" "}
              <span className={FORMULA_INLINE}>
                B(t) = (1−t)³P₀ + 3(1−t)²t·P₁ + 3(1−t)t²·P₂ + t³P₃
              </span>
              와 *완전히 동치* — 같은 수, 더 친절한 장부.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              In the widget, each layer is drawn in its own color: the dashed gray polygon connects
              the original controls, orange the level-1 lerps, brown the level-2 lerps, and the
              final green dot is <span className={MONO}>B(t)</span>. Sweep{" "}
              <span className={MONO}>t</span> across the slider — the construction collapses, the
              green dot moves, and its trace <em>is</em> the curve. The curve is not drawn by a
              separate formula; it is the locus of recursion.
            </>,
            <>
              위젯에서 각 층은 색깔이 다르다. 점선 회색이 원래 제어 다각형, 주황이 레벨-1 lerp,
              갈색이 레벨-2 lerp, 마지막 초록 점이 <span className={MONO}>B(t)</span>.{" "}
              <span className={MONO}>t</span> 슬라이더를 끌어보면 작도가 무너지면서 초록 점이
              움직이고, 그 자취가 *그대로* 곡선이 된다. 곡선은 별도의 공식으로 그려지는 게 아니다 —
              재귀의 자취 자체.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
      </ArcRow>

      <ArcRow n={4}>
        <h3>{pick(language, "What you can read off the picture", "그림에서 읽히는 것들")}</h3>
        <p>
          {pick(
            language,
            <>Four facts fall out without proof, just from staring at the construction.</>,
            <>증명 없이, 작도를 들여다보기만 해도 네 가지 사실이 떨어진다.</>,
          )}
        </p>
        <ul className="m-0 mb-2 list-none space-y-1.5 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <b>Endpoints.</b> At <span className={MONO}>t = 0</span> every lerp returns the left
                point, so <span className={MONO}>B(0) = P₀</span>. Symmetrically{" "}
                <span className={MONO}>B(1) = P₃</span>.{" "}
                <em>The curve passes through the first and last control points.</em>
              </li>
              <li>
                <b>Tangents at endpoints.</b> The level-1 lerps near{" "}
                <span className={MONO}>t = 0</span> sit on segments{" "}
                <span className={MONO}>P₀P₁</span>; the curve emerges along that direction. So{" "}
                <em>
                  the curve leaves <span className={MONO}>P₀</span> heading toward{" "}
                  <span className={MONO}>P₁</span>
                </em>
                , and arrives at <span className={MONO}>P₃</span> along{" "}
                <span className={MONO}>P₂P₃</span>. Designers use this to "make two curves meet
                smoothly": align their end-handles.
              </li>
              <li>
                <b>Convex hull.</b> Every layer of lerps is a convex combination of the previous
                layer; the final point is a convex combination of the controls. So the curve lives
                inside the polygon's convex hull and never escapes — useful for collision bounds and
                clipping.
              </li>
              <li>
                <b>The control polygon is not the curve.</b> It bounds the curve, points along it,
                can be moved to drag the curve — but the curve sits <em>inside</em> the polygon,
                smoothed away from its corners.
              </li>
            </>,
            <>
              <li>
                <b>끝점.</b> <span className={MONO}>t = 0</span>에서 모든 lerp가 왼쪽 점을
                돌려주므로 <span className={MONO}>B(0) = P₀</span>. 대칭으로{" "}
                <span className={MONO}>B(1) = P₃</span>.{" "}
                <em>곡선은 첫 제어점과 마지막 제어점을 지난다.</em>
              </li>
              <li>
                <b>끝점에서의 접선.</b> <span className={MONO}>t ≈ 0</span> 부근의 레벨-1 lerp는
                선분 <span className={MONO}>P₀P₁</span> 위에 있고, 곡선은 그 방향으로 출발한다.
                따라서{" "}
                <em>
                  <span className={MONO}>P₀</span>에서 <span className={MONO}>P₁</span> 쪽으로
                  떠나고
                </em>
                , <span className={MONO}>P₃</span>에는 <span className={MONO}>P₂P₃</span> 방향으로
                들어온다. 디자이너는 이 사실로 두 곡선을 *매끄럽게* 잇는다 — 끝 핸들을 정렬하면
                된다.
              </li>
              <li>
                <b>볼록껍질.</b> 매 층의 lerp는 이전 층의 볼록조합 — 마지막 점은 제어점들의
                볼록조합. 그래서 곡선은 다각형의 볼록껍질 안에서 살고 *밖으로 나가지 않는다*. 충돌
                판정과 클리핑에 유용.
              </li>
              <li>
                <b>제어 다각형은 곡선이 아니다.</b> 곡선을 가두고, 가리키고, 끌어 움직일 수 있는
                물체이지만, 곡선은 다각형 *안쪽*에 — 모서리에서 부드럽게 멀어진 채로 — 앉아 있다.
              </li>
            </>,
          )}
        </ul>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>
          {pick(
            language,
            "Why every graphics stack ships this",
            "왜 모든 그래픽 스택이 이걸 넣고 다닐까",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              The properties above are exactly what a tool needs. <b>Local control</b> — moving one
              handle changes only the nearby curve. <b>Affine invariance</b> — transform the
              controls, and the curve transforms the same way (rotate, scale, translate without
              re-evaluating the formula). <b>Numerical stability</b> — De Casteljau is just lerps,
              no high-degree polynomial cancellation. <b>Composable</b> — splice many cubic Beziers
              end-to-end with matching tangents and you get B-splines, the workhorse of CAD and
              animation.
            </>,
            <>
              위의 성질이 정확히 도구가 필요로 하는 것들이다. <b>국소 제어</b> — 손잡이 하나를
              움직이면 근처 곡선만 바뀐다. <b>아핀 불변성</b> — 제어점을 변환하면 곡선이 같은
              방식으로 변환된다 (회전·스케일·이동 시 식 재계산 불필요). <b>수치 안정성</b> — 드
              카스텔조는 lerp뿐이라 고차 다항식의 상쇄가 없다. <b>이어붙이기</b> — 3차 베지에를
              끝점·접선 맞춰 줄줄이 잇으면 B-스플라인 — CAD와 애니메이션의 일꾼.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Concretely: TrueType fonts use quadratic Beziers; PostScript and most modern fonts use
              cubic; SVG `path` data is a Bezier syntax with shorthand; Figma, Illustrator, Inkscape
              — all the same recursion at the bottom; Pixar's smooth animation curves and the
              "ease-in-out" timing function in CSS are cubic Beziers picked by hand. One algorithm,
              four handles, an entire industry of curves.
            </>,
            <>
              구체적으로: TrueType은 2차 베지에, PostScript와 현대 폰트 대부분은 3차; SVG의 `path`
              데이터는 약식 표기를 더한 베지에 문법; Figma·Illustrator·Inkscape — 바닥엔 모두 같은
              재귀; 픽사의 매끄러운 애니메이션 곡선, CSS의 "ease-in-out" 타이밍 함수 — 손으로 고른
              3차 베지에. 한 가지 알고리즘, 네 개의 손잡이, 곡선 산업 전체.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The deeper bridge: Bezier curves consume the{" "}
              <Link
                to="/modules/parametric-curves"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                parametric-curves
              </Link>{" "}
              module. The <em>image</em> of the curve is the smooth path; the{" "}
              <em>parametrization</em> is <span className={MONO}>t ↦ B(t)</span>. Designers usually
              only see the image; the parametrization is what the renderer steps through to draw it.
            </>,
            <>
              더 깊은 다리: 베지에 곡선은{" "}
              <Link
                to="/modules/parametric-curves"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                매개변수 곡선
              </Link>{" "}
              모듈을 소비한다. 곡선의 <em>이미지</em>는 매끄러운 경로, <em>매개변수화</em>는{" "}
              <span className={MONO}>t ↦ B(t)</span>. 디자이너에게는 보통 이미지만 보이지만, 그것을
              한 칸씩 따라가 그리는 것은 매개변수화다.
            </>,
          )}
        </p>
        <Counterexample
          en={
            <>
              Bezier's "smooth" is a <em>local</em> claim, not a global one. A cubic Bezier whose
              control polygon makes a sharp loop will produce a self-intersecting curve — still
              smooth in the differential sense (B'(t) is continuous), but visually pathological. Try
              the widget with{" "}
              <span className="font-mono text-[0.93em]">
                P₀ = (60, 80), P₁ = (440, 240), P₂ = (60, 240), P₃ = (440, 80)
              </span>
              : a self-crossing Z. Designers' "smooth" and differential geometry's "smooth" diverge
              here, and the four-handle abstraction does nothing to warn you.
            </>
          }
          ko={
            <>
              베지에의 "매끄러움"은 <em>국소</em> 주장이지 전역 주장이 아니다. 제어 다각형이
              날카롭게 꺾이는 3차 베지에는 자기 자신과 교차하는 곡선을 만든다 — 미분적으로는 여전히
              매끄럽지만 (B'(t) 연속), 시각적으로는 병적이다. 위젯에서{" "}
              <span className="font-mono text-[0.93em]">
                P₀ = (60, 80), P₁ = (440, 240), P₂ = (60, 240), P₃ = (440, 80)
              </span>
              으로 두면 자기 교차하는 Z가 나온다. 디자이너의 "매끄러움"과 미분기하학의 "매끄러움"은
              여기서 갈라지고, 네 개의 손잡이 추상은 그 사실을 한 마디도 경고하지 않는다.
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
            <b>Bezier is lerp, recursively.</b> One operation between two points, applied to
            adjacent pairs, then to the new pairs, then again. Move a handle and the lerps follow;
            the curve follows the lerps.
          </>,
          <>
            <b>베지에는 lerp의 재귀.</b> 두 점 사이의 한 연산을 인접 쌍에 적용하고, 결과 쌍에 또
            적용하고, 또 한 번. 손잡이를 움직이면 lerp가 따라가고, 곡선은 lerp를 따라간다.
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
        tag={{ en: "lerp by hand", ko: "손으로 lerp" }}
        prompt={{
          en: (
            <>
              Compute <span className={FORMULA_INLINE}>lerp((0, 0), (4, 2), 0.25)</span>. Then
              <span className={MONO}> lerp((0, 0), (4, 2), 0.75)</span>. Sketch both points between
              the endpoints.
            </>
          ),
          ko: (
            <>
              <span className={FORMULA_INLINE}>lerp((0, 0), (4, 2), 0.25)</span>를 계산하라. 그 다음{" "}
              <span className={MONO}>lerp((0, 0), (4, 2), 0.75)</span>. 두 점을 양 끝점 사이에
              그려보자.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              At t = 0.25:{" "}
              <span className={MONO}>(0.75·0, 0.75·0) + (0.25·4, 0.25·2) = (1, 0.5)</span>. At t =
              0.75: <span className={MONO}>(3, 1.5)</span>. Both lie on the segment from (0,0) to
              (4,2), at quarter and three-quarter distance.
            </>
          ),
          ko: (
            <>
              t = 0.25일 때:{" "}
              <span className={MONO}>(0.75·0, 0.75·0) + (0.25·4, 0.25·2) = (1, 0.5)</span>. t =
              0.75일 때: <span className={MONO}>(3, 1.5)</span>. 둘 다 (0,0) → (4,2) 선분 위, 1/4
              지점과 3/4 지점.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "midpoint of a cubic", ko: "3차 곡선의 중간점" }}
        prompt={{
          en: (
            <>
              For the cubic Bezier with controls{" "}
              <span className={FORMULA_INLINE}>P = [(0, 0), (1, 2), (3, 2), (4, 0)]</span>, compute{" "}
              <span className={MONO}>B(0.5)</span> by De Casteljau. Show every layer.
            </>
          ),
          ko: (
            <>
              제어점 <span className={FORMULA_INLINE}>P = [(0, 0), (1, 2), (3, 2), (4, 0)]</span>
              인 3차 베지에에서 드 카스텔조로 <span className={MONO}>B(0.5)</span>를 계산하라. 모든
              층을 다 보여라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Layer 1: <span className={MONO}>L₀ = (0.5, 1), L₁ = (2, 2), L₂ = (3.5, 1)</span>.
              Layer 2: <span className={MONO}>M₀ = (1.25, 1.5), M₁ = (2.75, 1.5)</span>. Layer 3
              (final): <span className={MONO}>B(0.5) = (2, 1.5)</span>. Note the final two layers
              are flat at <span className={MONO}>y = 1.5</span> — the curve passes its midpoint
              parallel to the x-axis here.
            </>
          ),
          ko: (
            <>
              층 1: <span className={MONO}>L₀ = (0.5, 1), L₁ = (2, 2), L₂ = (3.5, 1)</span>. 층 2:{" "}
              <span className={MONO}>M₀ = (1.25, 1.5), M₁ = (2.75, 1.5)</span>. 층 3 (최종):{" "}
              <span className={MONO}>B(0.5) = (2, 1.5)</span>. 마지막 두 층이{" "}
              <span className={MONO}>y = 1.5</span> 평탄선 위에 있음 — 곡선이 이 중간점을 x축에
              평행하게 지난다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "tangents at endpoints", ko: "끝점에서의 접선" }}
        prompt={{
          en: (
            <>
              Why does the cubic Bezier curve <em>start</em> in the direction of{" "}
              <span className={MONO}>P₁ − P₀</span> and <em>end</em> in the direction of{" "}
              <span className={MONO}>P₃ − P₂</span>? Argue geometrically from De Casteljau, then
              confirm by computing <span className={MONO}>B'(0)</span> from the polynomial form.
            </>
          ),
          ko: (
            <>
              왜 3차 베지에는 <span className={MONO}>P₁ − P₀</span> 방향으로 *출발*하고{" "}
              <span className={MONO}>P₃ − P₂</span> 방향으로 *도착*할까? 드 카스텔조 작도로 기하적
              논증을 하고, 다항식 형태에서 <span className={MONO}>B'(0)</span>를 계산해 확인하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Geometric: at <span className={MONO}>t = 0</span> the level-1 lerps are exactly{" "}
              <span className={MONO}>P₀, P₁, P₂</span> (each lerp returns its left endpoint). For
              very small <span className={MONO}>t</span>, the construction is dominated by the
              segment from <span className={MONO}>P₀</span> to <span className={MONO}>P₁</span>, so
              the curve heads that way. Algebraic: differentiate{" "}
              <span className={MONO}>B(t) = (1−t)³P₀ + 3(1−t)²t·P₁ + …</span> and evaluate at 0:{" "}
              <span className={MONO}>B'(0) = 3(P₁ − P₀)</span>. Same direction, magnitude scaled by
              3. Endpoint-symmetric for <span className={MONO}>B'(1) = 3(P₃ − P₂)</span>.
            </>
          ),
          ko: (
            <>
              기하: <span className={MONO}>t = 0</span>에서 레벨-1 lerp는 정확히{" "}
              <span className={MONO}>P₀, P₁, P₂</span> (각 lerp가 왼쪽 끝점을 돌려준다). 아주 작은{" "}
              <span className={MONO}>t</span>에서는 작도가 <span className={MONO}>P₀ → P₁</span>{" "}
              선분에 지배되므로 곡선이 그쪽으로 향한다. 대수:{" "}
              <span className={MONO}>B(t) = (1−t)³P₀ + 3(1−t)²t·P₁ + …</span>를 미분해 0에서
              계산하면 <span className={MONO}>B'(0) = 3(P₁ − P₀)</span>. 같은 방향, 크기는 3배. 끝점
              대칭으로 <span className={MONO}>B'(1) = 3(P₃ − P₂)</span>.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "polygon vs curve", ko: "다각형 vs 곡선" }}
        prompt={{
          en: (
            <>
              The control polygon and the Bezier curve have the same first and last point and
              roughly the same shape. List <b>three</b> ways they differ. Use the widget to
              construct an example where the differences are obvious.
            </>
          ),
          ko: (
            <>
              제어 다각형과 베지에 곡선은 첫 점과 마지막 점이 같고 대략 비슷한 모양이다. 둘이{" "}
              <b>다른</b> 세 가지 방식을 들어라. 차이가 분명히 보이는 예를 위젯으로 만들어보자.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              (1) The polygon has corners at <span className={MONO}>P₁</span> and{" "}
              <span className={MONO}>P₂</span>; the curve is smooth (no corners). (2) The polygon
              <em> passes through</em> all controls; the curve only touches{" "}
              <span className={MONO}>P₀</span> and <span className={MONO}>P₃</span>. (3) The
              polygon's segments are straight; the curve's pieces between samples are not — they
              bend toward the inner controls. Bonus visible difference: drag{" "}
              <span className={MONO}>P₁</span> wildly while keeping{" "}
              <span className={MONO}>P₀, P₂, P₃</span> fixed — the polygon has a sharp peak there,
              the curve is rounded.
            </>
          ),
          ko: (
            <>
              (1) 다각형은 <span className={MONO}>P₁</span>과 <span className={MONO}>P₂</span>에서
              꺾이지만 곡선은 매끄럽다 (코너 없음). (2) 다각형은 모든 제어점을 <em>지나가지만</em>{" "}
              곡선은 <span className={MONO}>P₀, P₃</span>만 닿는다. (3) 다각형의 변은 직선, 곡선의
              사이는 직선이 아니다 — 안쪽 제어점 쪽으로 휜다. 보너스로 눈에 보이는 차이:{" "}
              <span className={MONO}>P₀, P₂, P₃</span>는 두고 <span className={MONO}>P₁</span>만
              멀리 끌어보면 — 다각형은 거기서 뾰족한 봉우리, 곡선은 둥근 언덕.
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
            application: <b>Bezier Curves</b>. Consumes the{" "}
            <Link to="/modules/parametric-curves">Parametric Curves</Link> module — the curve is an
            image; the construction is the parametrization.
          </>,
          <>
            응용: <b>베지에 곡선</b>. <Link to="/modules/parametric-curves">매개변수 곡선</Link>{" "}
            모듈을 소비한다 — 곡선은 이미지, 작도는 매개변수화.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function BezierCurves({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Bezier Curves · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <ControlPoints />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <WhyNotTaught
        en={
          <>
            Computer-graphics texts usually present Bezier curves through their{" "}
            <em>Bernstein basis</em> formula —{" "}
            <span className="font-mono">B(t) = Σ b_i,n(t) · P_i</span> — a polynomial sum the reader
            has no reason to trust. Lemma starts at the other end: <em>lerp</em>, the one operation
            a designer already knows. Three lerps, recursively, <em>derive</em> the Bernstein form.
            Industry uses the formula; understanding starts at the recursion. The Bernstein basis is
            a consequence, not a starting point.
          </>
        }
        ko={
          <>
            컴퓨터 그래픽 교과서는 보통 베지에를 <em>번스타인 기저</em> 공식 —{" "}
            <span className="font-mono">B(t) = Σ b_i,n(t) · P_i</span> — 으로 소개한다. 독자가
            믿어야 할 이유 없는 다항식 합으로. Lemma는 반대 끝에서 시작한다: <em>lerp</em> —
            디자이너가 이미 아는 단 하나의 연산. 그 lerp를 재귀적으로 세 번 적용하면 번스타인 형식이
            *유도*된다. 업계는 공식을 쓰지만, 이해는 재귀에서 시작한다. 번스타인 기저는 결과지,
            출발점이 아니다.
          </>
        }
      />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
