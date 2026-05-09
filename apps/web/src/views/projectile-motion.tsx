import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { Counterexample, WhyNotTaught } from "../components/meta";
import { Launch } from "../components/widgets/launch";
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
        {pick(language, "physics · projectile motion", "물리 · 포물선 운동")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · gravity's signature", "도입 · 중력의 서명")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>Why does gravity write a parabola, every time?</>,
          <>중력은 왜 매번 포물선을 그릴까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            Throw a ball. Ignore air. Its horizontal motion keeps time — the same speed forever. Its
            vertical motion loses to <Term id="gravity">gravity</Term> — slower up, faster down.{" "}
            <b>Two perpendicular stories, neither aware of the other</b>, and yet their shared trace
            is a <Term id="parabola">parabola</Term>. Not a special property of parabolas — a
            recipe. Constant velocity meets constant acceleration; their joint picture is quadratic.
          </>,
          <>
            공을 던진다. 공기저항은 무시. 가로 방향 운동은 시간을 그대로 간다 — 영원히 같은 속력.
            세로 방향 운동은 <Term id="gravity">중력</Term>에 진다 — 올라갈 때 느려지고, 내려올 때
            빨라진다. <b>서로를 모르는 수직 두 이야기</b>가 공유하는 자취가{" "}
            <Term id="parabola">포물선</Term>. 포물선의 특별한 속성이 아니라 *레시피*. 등속이
            등가속과 만나면, 그 합동 그림이 이차식이 된다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            Drag the angle, the speed, and gravity in the widget. The path always closes back to the
            ground; the apex is always halfway across; the brown <b>vₓ</b> arrow stays the same
            length while the blue <b>v_y</b> arrow zeroes at the top and reverses on the way down.
            That's the whole picture.
          </>,
          <>
            위젯에서 각도·속력·중력을 끌어보자. 경로는 늘 지면으로 다시 닫힌다. 정점은 늘 가운데.
            갈색 <b>vₓ</b> 화살표는 길이가 일정하고 파란 <b>v_y</b> 화살표는 정점에서 0이 되었다가
            내려오며 뒤집힌다. 그림 전체.
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
        <h3>{pick(language, "Two motions, one ball", "두 운동, 공 하나")}</h3>
        <p>
          {pick(
            language,
            <>
              Once the ball leaves your hand, the only force on it is{" "}
              <Term id="gravity">gravity</Term> — pulling straight down. Nothing pushes it
              horizontally. So horizontally, it carries on at whatever
              <Term id="velocity">velocity</Term> you launched it with — uniform, forever, until it
              lands. Vertically, gravity slows it on the way up, stops it briefly at the apex, and
              speeds it up on the way down.{" "}
              <em>
                The horizontal motion has no idea there's gravity. The vertical motion has no idea
                there's a horizontal velocity.
              </em>{" "}
              Each is a one-dimensional problem; we solve them in parallel and only later combine
              them into a 2D picture.
            </>,
            <>
              공이 손을 떠나면 작용하는 힘은 <Term id="gravity">중력</Term> 하나 — 정확히 아래로
              당긴다. 가로 방향엔 아무 힘도 없다. 그러니 가로로는 던질 때의{" "}
              <Term id="velocity">속도</Term> 그대로 — 등속, 영원히, 착지할 때까지. 세로로는 중력이
              올라갈 때 느리게, 정점에서 잠깐 멈추고, 내려올 때 빨라지게 한다.{" "}
              <em>가로 운동은 중력의 존재를 모른다. 세로 운동은 가로 속도의 존재를 모른다.</em>{" "}
              각각은 1차원 문제, 둘을 *나란히* 푼 다음 합쳐 2차원 그림을 만든다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "Equations of motion", "운동 방정식")}</h3>
        <p>
          {pick(
            language,
            <>
              Split the launch velocity into components:{" "}
              <span className={FORMULA_INLINE}>vₓ = v₀ cos θ</span>,{" "}
              <span className={FORMULA_INLINE}>v_y = v₀ sin θ</span>. The horizontal component is
              constant; the vertical component decreases at a rate of{" "}
              <span className={MONO}>g</span> (the constant downward{" "}
              <Term id="acceleration">acceleration</Term>):{" "}
              <span className={FORMULA_INLINE}>v_y(t) = v₀ sin θ − g·t</span>. Integrate once and
              you get position:
            </>,
            <>
              발사 속도를 성분으로 나누자: <span className={FORMULA_INLINE}>vₓ = v₀ cos θ</span>,{" "}
              <span className={FORMULA_INLINE}>v_y = v₀ sin θ</span>. 가로 성분은 일정. 세로 성분은
              일정한 아래 방향 <Term id="acceleration">가속도</Term> <span className={MONO}>g</span>
              로 줄어든다: <span className={FORMULA_INLINE}>v_y(t) = v₀ sin θ − g·t</span>. 한 번
              적분하면 위치:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`x(t) = v₀ cos θ · t
y(t) = v₀ sin θ · t − ½ g t²`}
        </pre>
        <p>
          {pick(
            language,
            <>
              That pair is a{" "}
              <Link
                to="/modules/parametric-curves"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                parametric curve
              </Link>
              : two functions of a shared time parameter <span className={MONO}>t</span>. The{" "}
              <em>image</em> of this curve is the shape on the field; the <em>parametrization</em>{" "}
              is the actual motion in time. Same image can be painted by many parametrizations —
              we'll see one shortly.
            </>,
            <>
              이 한 쌍은{" "}
              <Link
                to="/modules/parametric-curves"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                매개변수 곡선
              </Link>
              — 공유 시간 매개변수 <span className={MONO}>t</span>의 두 함수. 이 곡선의{" "}
              <em>이미지</em>는 운동장 위의 모양, <em>매개변수화</em>는 시간상의 실제 운동. 같은
              이미지는 여러 매개변수화로 칠해질 수 있다 — 곧 본다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>
          {pick(language, "Eliminate time, see the parabola", "시간을 지우면 포물선이 보인다")}
        </h3>
        <p>
          {pick(
            language,
            <>
              Solve <span className={MONO}>x(t) = v₀ cos θ · t</span> for{" "}
              <span className={MONO}>t</span>:{" "}
              <span className={FORMULA_INLINE}>t = x / (v₀ cos θ)</span>. Plug into{" "}
              <span className={MONO}>y(t)</span>:
            </>,
            <>
              <span className={MONO}>x(t) = v₀ cos θ · t</span>를 <span className={MONO}>t</span>에
              대해 풀면 <span className={FORMULA_INLINE}>t = x / (v₀ cos θ)</span>. 이걸{" "}
              <span className={MONO}>y(t)</span>에 넣자:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`y(x) = (tan θ) · x  −  g · x² / (2 v₀² cos²θ)`}
        </pre>
        <p>
          {pick(
            language,
            <>
              That is a quadratic in <span className={MONO}>x</span>. The trace of two independent
              linear processes (in <span className={MONO}>t</span>) is necessarily quadratic (in{" "}
              <span className={MONO}>x</span>) — and the graph of a quadratic is a{" "}
              <Term id="parabola">parabola</Term>. The parabola is the <em>image</em> of the motion.
              The motion is the <em>parametrization</em>. The image hides the time axis; you can
              read shape off it, but you cannot tell how fast the ball got there.
            </>,
            <>
              이게 <span className={MONO}>x</span>에 대한 이차식. <span className={MONO}>t</span> 에
              대한 두 독립 선형 과정의 자취는 필연적으로 <span className={MONO}>x</span>에 대한
              이차식이고, 이차식의 그래프는 <Term id="parabola">포물선</Term>. 포물선은 이 운동의{" "}
              <em>이미지</em>, 운동은 <em>매개변수화</em>. 이미지는 시간 축을 감춘다 — 형태는 읽을
              수 있지만, 공이 얼마나 빨리 그 자리에 도달했는지는 알 수 없다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
      </ArcRow>

      <ArcRow n={4}>
        <h3>
          {pick(
            language,
            "What you can read off without solving anything",
            "아무 것도 풀지 않고 읽히는 것",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>Four facts fall out of the formula.</>,
            <>식에서 네 가지가 떨어진다.</>,
          )}
        </p>
        <ul className="m-0 mb-3 list-none space-y-1.5 pl-0 [&_li]:border-l-[3px] [&_li]:border-rule [&_li]:pl-3.5 [&_b]:font-semibold [&_b]:text-ink">
          {pick(
            language,
            <>
              <li>
                <b>Time to peak.</b> Vertical velocity{" "}
                <span className={MONO}>v_y(t) = v₀ sin θ − g·t</span> hits zero at{" "}
                <span className={FORMULA_INLINE}>t_peak = v₀ sin θ / g</span>. That is when the ball
                is highest.
              </li>
              <li>
                <b>Time to land.</b> By symmetry, the down-trip mirrors the up-trip:{" "}
                <span className={FORMULA_INLINE}>t_land = 2 · t_peak</span>. The widget's stat row
                shows it.
              </li>
              <li>
                <b>Range.</b>{" "}
                <span className={FORMULA_INLINE}>R = v₀ cos θ · t_land = v₀² sin(2θ) / g</span>.
                Maximum at <span className={MONO}>2θ = 90°</span>, i.e. launch angle{" "}
                <span className={MONO}>θ = 45°</span>. The longest throw is the one split evenly
                between up and forward.
              </li>
              <li>
                <b>Symmetry.</b> The peak sits at <span className={MONO}>x = R/2</span>. The speed
                at impact equals the speed at launch (same <span className={MONO}>vₓ</span>,
                equal-magnitude opposite-sign <span className={MONO}>v_y</span>). Without drag, the
                ball loses no energy to the air.
              </li>
            </>,
            <>
              <li>
                <b>정점까지의 시간.</b> 세로 속도{" "}
                <span className={MONO}>v_y(t) = v₀ sin θ − g·t</span>가 0이 되는 시점:{" "}
                <span className={FORMULA_INLINE}>t_정점 = v₀ sin θ / g</span>. 이때 공이 최고점.
              </li>
              <li>
                <b>착지까지의 시간.</b> 대칭으로 내려오는 길은 올라간 길의 거울:{" "}
                <span className={FORMULA_INLINE}>t_착지 = 2 · t_정점</span>. 위젯의 통계 줄이
                보여준다.
              </li>
              <li>
                <b>사거리.</b>{" "}
                <span className={FORMULA_INLINE}>R = v₀ cos θ · t_착지 = v₀² sin(2θ) / g</span>.{" "}
                <span className={MONO}>2θ = 90°</span>, 즉 발사각{" "}
                <span className={MONO}>θ = 45°</span>에서 최대. 가장 멀리 던지는 던지기는 위와
                앞으로 정확히 반반 나뉜 던지기.
              </li>
              <li>
                <b>대칭.</b> 정점은 <span className={MONO}>x = R/2</span>. 착지 속력은 발사 속력과
                같다 (같은 <span className={MONO}>vₓ</span>, 부호만 뒤집힌 같은 크기의{" "}
                <span className={MONO}>v_y</span>). 공기저항이 없으면 공기에게 에너지를 잃지 않는다.
              </li>
            </>,
          )}
        </ul>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>{pick(language, "Same image, different motions", "같은 이미지, 다른 운동")}</h3>
        <p>
          {pick(
            language,
            <>
              The image-vs-parametrization distinction the{" "}
              <Link
                to="/modules/parametric-curves"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                parametric-curves
              </Link>{" "}
              module makes precise applies right here. Look at{" "}
              <span className={MONO}>y(x) = (tan θ) x − g x² / (2 v₀² cos²θ)</span>: the shape of
              the parabola depends only on <span className={MONO}>θ</span> and the ratio{" "}
              <span className={MONO}>g/v₀²</span>. Double both <span className={MONO}>v₀</span> and{" "}
              <span className={MONO}>g</span> together by appropriate factors and you get the{" "}
              <em>same parabola, traversed in a different time</em>. A throw on the Moon with the
              right matching speed paints exactly the same shape as a throw on Earth — but slower,
              because the Moon's clock for the same shape ticks differently.
            </>,
            <>
              <Link
                to="/modules/parametric-curves"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                매개변수 곡선
              </Link>{" "}
              모듈이 정밀하게 만든 *이미지 vs 매개변수화* 구분이 여기서도 그대로 적용된다.{" "}
              <span className={MONO}>y(x) = (tan θ) x − g x² / (2 v₀² cos²θ)</span>를 보자: 포물선
              모양은 <span className={MONO}>θ</span>와 비율 <span className={MONO}>g/v₀²</span>에만
              의존한다. <span className={MONO}>v₀</span>와 <span className={MONO}>g</span>를 적절한
              배율로 함께 늘리면 <em>같은 포물선을 다른 시간으로 지난다</em>. 적당히 맞춘 속력으로
              달에서 던지면 지구 에서 던질 때와 *모양은 같지만* 더 느리게 — 달의 시계가 같은 모양에
              대해 다르게 가니까.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              That is the same lesson as Bezier curves and as the parametric-curves spike that
              became a module: the picture is one thing, the motion that paints it is another. Two
              parametrizations can disagree on every detail except the <em>image</em> they produce.
            </>,
            <>
              베지에 곡선, 그리고 모듈이 된 매개변수 곡선 스파이크와 *같은* 교훈: 그림은 한 가지,
              그것을 칠하는 움직임은 또 다른 한 가지. 두 매개변수화가 *모든 세부에서 달라도*{" "}
              <em>이미지</em>는 같을 수 있다.
            </>,
          )}
        </p>
        <Counterexample
          en={
            <>
              The parabola is the trajectory you get <em>when you ignore air</em>. A baseball thrown
              at 40 m/s has Reynolds number ~10⁵; drag is not a small correction. Compute the same
              equations with quadratic drag{" "}
              <span className="font-mono text-[0.93em]">F_d = ½ ρ C_d A v²</span> for a 145 g ball,
              and the range at <b>θ = 45°</b> drops from <b>~163 m</b> (vacuum) to <b>~98 m</b>{" "}
              (air) — <em>and</em> the optimal angle shifts from <b>45°</b> to <b>~38°</b>. The
              clean parabola is a vacuum object; real outdoor motion is one of those, asymmetric,
              foreshortened.
            </>
          }
          ko={
            <>
              포물선은 <em>공기를 무시할 때</em> 나오는 궤적이다. 40 m/s로 던진 야구공의 레이놀즈
              수는 ~10⁵; 항력은 작은 보정이 아니다. 145 g 공에 대해 2차 항력{" "}
              <span className="font-mono text-[0.93em]">F_d = ½ ρ C_d A v²</span>를 넣고 같은 식을
              풀면, <b>θ = 45°</b>에서 사거리가 <b>~163 m</b> (진공)에서 <b>~98 m</b> (공기)로 줄고,{" "}
              <em>최적 각도</em>도 <b>45°</b>에서 <b>~38°</b>로 옮겨간다. 깔끔한 포물선은 진공의
              물건이다. 실제 야외에서의 운동은 그것과 닮았으되, 비대칭이고, 짧다.
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
            <b>Horizontal keeps time. Vertical loses to gravity.</b> Their independent stories —
            uniform velocity meeting constant acceleration — trace a parabola. The shape is the
            recipe; the motion is the story.
          </>,
          <>
            <b>가로는 시간을 그대로 간다. 세로는 중력에 진다.</b> 등속과 등가속이 만나 만든 두 독립
            이야기의 자취가 포물선. 모양이 레시피, 움직임이 이야기.
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
        tag={{ en: "time to the peak", ko: "정점까지의 시간" }}
        prompt={{
          en: (
            <>
              A ball is launched at <span className={MONO}>v₀ = 20 m/s</span>,{" "}
              <span className={MONO}>θ = 30°</span>, with <span className={MONO}>g = 10 m/s²</span>.
              Find <span className={MONO}>t_peak</span> and the maximum height. Use{" "}
              <span className={MONO}>sin 30° = 1/2</span>.
            </>
          ),
          ko: (
            <>
              공이 <span className={MONO}>v₀ = 20 m/s</span>, <span className={MONO}>θ = 30°</span>,{" "}
              <span className={MONO}>g = 10 m/s²</span>로 발사된다.{" "}
              <span className={MONO}>t_정점</span>과 최고 높이를 구하라.{" "}
              <span className={MONO}>sin 30° = 1/2</span> 사용.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>v_y(0) = v₀ sin 30° = 10 m/s</span>. Setting{" "}
              <span className={MONO}>v_y(t) = 10 − 10·t = 0</span> gives <b>t_peak = 1 s</b>. Max
              height{" "}
              <span className={MONO}>= v_y(0)·t_peak − ½ g t_peak² = 10·1 − ½·10·1 = 5 m</span>.
              (Same as <span className={MONO}>v_y(0)² / (2g) = 100/20 = 5 m</span>.)
            </>
          ),
          ko: (
            <>
              <span className={MONO}>v_y(0) = v₀ sin 30° = 10 m/s</span>.{" "}
              <span className={MONO}>v_y(t) = 10 − 10·t = 0</span>에서 <b>t_정점 = 1 s</b>. 최고
              높이 <span className={MONO}>= v_y(0)·t_정점 − ½ g t_정점² = 10·1 − ½·10·1 = 5 m</span>
              . (<span className={MONO}>v_y(0)² / (2g) = 100/20 = 5 m</span>과 동일.)
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        tag={{ en: "derive the range formula", ko: "사거리 공식 유도" }}
        prompt={{
          en: (
            <>
              Starting from <span className={MONO}>x(t_land) = v₀ cos θ · t_land</span> and{" "}
              <span className={MONO}>t_land = 2 v₀ sin θ / g</span>, derive{" "}
              <span className={FORMULA_INLINE}>R = v₀² sin(2θ) / g</span>. Confirm in the widget
              that the range is largest at <span className={MONO}>θ = 45°</span>.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>x(t_착지) = v₀ cos θ · t_착지</span>와{" "}
              <span className={MONO}>t_착지 = 2 v₀ sin θ / g</span>에서{" "}
              <span className={FORMULA_INLINE}>R = v₀² sin(2θ) / g</span>를 유도하라. 위젯에서{" "}
              <span className={MONO}>θ = 45°</span>일 때 사거리가 최대인지 확인.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>
                R = v₀ cos θ · (2 v₀ sin θ / g) = (2 v₀² sin θ cos θ) / g = v₀² sin(2θ) / g
              </span>{" "}
              using the double-angle identity <span className={MONO}>sin(2θ) = 2 sin θ cos θ</span>.
              Maximum of <span className={MONO}>sin(2θ)</span> is 1 at{" "}
              <span className={MONO}>2θ = 90°</span>, i.e. <b>θ = 45°</b>.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>
                R = v₀ cos θ · (2 v₀ sin θ / g) = (2 v₀² sin θ cos θ) / g = v₀² sin(2θ) / g
              </span>
              . 배각 공식 <span className={MONO}>sin(2θ) = 2 sin θ cos θ</span>를 썼다.{" "}
              <span className={MONO}>sin(2θ)</span>의 최댓값은{" "}
              <span className={MONO}>2θ = 90°</span>, 즉 <b>θ = 45°</b>에서 1.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "same image, different time", ko: "같은 이미지, 다른 시간" }}
        prompt={{
          en: (
            <>
              Two throws have the same launch angle <span className={MONO}>θ = 45°</span>: one with{" "}
              <span className={MONO}>(v₀, g) = (20, 10)</span>, the other with{" "}
              <span className={MONO}>(v₀, g) = (40, 40)</span>. Show that they paint the{" "}
              <em>same parabola</em> <span className={MONO}>y(x)</span>, but the second is
              <em>faster</em> in time. Which quantity controls the image, and which controls the
              motion?
            </>
          ),
          ko: (
            <>
              두 던지기가 같은 발사각 <span className={MONO}>θ = 45°</span>를 가진다. 하나는{" "}
              <span className={MONO}>(v₀, g) = (20, 10)</span>, 다른 하나는{" "}
              <span className={MONO}>(v₀, g) = (40, 40)</span>. 둘이 *같은 포물선*{" "}
              <span className={MONO}>y(x)</span>를 그리지만 두 번째가 시간상 *더 빠르다*는 것을
              보여라. 어느 양이 이미지를 결정하고, 어느 양이 운동을 결정하는가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>y(x) = (tan θ) x − g·x² / (2 v₀² cos²θ)</span> depends only on{" "}
              <span className={MONO}>θ</span> and <span className={MONO}>g/v₀²</span>. For both
              throws this ratio equals <span className={MONO}>10/400 = 40/1600 = 0.025</span>, so
              same parabola. But <span className={MONO}>t_land = 2 v₀ sin θ / g</span> evaluates to{" "}
              <span className={MONO}>√2 · 20/10 ≈ 2.83 s</span> for the first and{" "}
              <span className={MONO}>√2 · 40/40 ≈ 1.41 s</span> for the second — half the flight
              time.{" "}
              <b>
                Image: <span className={MONO}>(θ, g/v₀²)</span>
              </b>
              ; <b>motion: anything else, including absolute v₀ and g.</b>
            </>
          ),
          ko: (
            <>
              <span className={MONO}>y(x) = (tan θ) x − g·x² / (2 v₀² cos²θ)</span>는{" "}
              <span className={MONO}>θ</span>와 <span className={MONO}>g/v₀²</span>에만 의존. 두
              던지기 모두 이 비가 <span className={MONO}>10/400 = 40/1600 = 0.025</span> — 같은
              포물선. 그런데 <span className={MONO}>t_착지 = 2 v₀ sin θ / g</span>는 첫째에서{" "}
              <span className={MONO}>√2 · 20/10 ≈ 2.83 s</span>, 둘째에서{" "}
              <span className={MONO}>√2 · 40/40 ≈ 1.41 s</span> — 절반의 비행 시간.{" "}
              <b>
                이미지: <span className={MONO}>(θ, g/v₀²)</span>
              </b>
              , <b>운동: 그 외 모든 것 (v₀와 g의 절대값 포함).</b>
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "speed at impact", ko: "착지 속력" }}
        prompt={{
          en: (
            <>
              Without doing any time calculation, argue that the ball's <em>speed</em> at impact
              equals its launch speed <span className={MONO}>v₀</span>. (Same height, no drag.) What
              about the angle the velocity vector makes with the ground at impact?
            </>
          ),
          ko: (
            <>
              시간 계산을 전혀 하지 않고, 착지 시 공의 *속력*이 발사 속력{" "}
              <span className={MONO}>v₀</span>와 같음을 논증하라. (같은 높이, 공기저항 무시.) 착지
              순간 속도 벡터가 지면과 이루는 각은?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              By symmetry of the parabola and the time-reversal symmetry of constant acceleration:
              at landing, <span className={MONO}>vₓ</span> is unchanged (no horizontal force), and{" "}
              <span className={MONO}>v_y</span> has equal magnitude but opposite sign of its launch
              value. So <span className={MONO}>|v_impact|² = vₓ² + v_y² = v₀²</span> — same speed.
              Direction: launch was at <span className={MONO}>+θ</span> above the ground, impact is
              at <span className={MONO}>−θ</span> below — equal angle, opposite side.
            </>
          ),
          ko: (
            <>
              포물선의 대칭성과 등가속 운동의 시간 역전 대칭에서: 착지 시{" "}
              <span className={MONO}>vₓ</span>는 그대로 (가로 힘 없음),{" "}
              <span className={MONO}>v_y</span>는 같은 크기에 부호만 반대. 그러므로{" "}
              <span className={MONO}>|v_착지|² = vₓ² + v_y² = v₀²</span> — 같은 속력. 방향: 발사가
              지면 위 <span className={MONO}>+θ</span>였다면 착지는 지면 아래{" "}
              <span className={MONO}>−θ</span> — 같은 각, 반대편.
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
            application: <b>Projectile Motion</b>. Consumes the{" "}
            <Link to="/modules/parametric-curves">Parametric Curves</Link> module — the parabola is
            the image; the equations of motion are the parametrization.
          </>,
          <>
            응용: <b>포물선 운동</b>. <Link to="/modules/parametric-curves">매개변수 곡선</Link>{" "}
            모듈을 소비한다 — 포물선은 이미지, 운동 방정식은 매개변수화.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function ProjectileMotion({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Projectile Motion · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <Launch />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <WhyNotTaught
        en={
          <>
            Most physics intros open with "objects in projectile motion follow a parabolic path" —
            stated as a fact about <em>nature</em>, not as a consequence of two assumptions (no air,
            constant g). The reader files away "parabola" without knowing what they traded for it.
            Lemma keeps the two motions visible — horizontal uniform, vertical free-fall — so the
            parabola arrives as a <em>theorem</em>, not a slogan. And the counterexample above
            admits the obvious: outdoors, the parabola is already wrong.
          </>
        }
        ko={
          <>
            물리 입문서 대부분은 "발사된 물체는 포물선을 그린다"로 연다 — 두 가정 (공기 무시, g
            상수)의 *결과*가 아니라 *자연의 사실*처럼. 독자는 무엇을 거래해서 "포물선"을 얻었는지
            모른 채 그 단어만 챙긴다. Lemma는 두 운동 — 수평 등속, 수직 자유낙하 — 을 끝까지 분리해
            둔다. 그래서 포물선이 *구호*가 아니라 *정리*로 도착한다. 그리고 위 counterexample이
            분명히 말한다: 야외에서, 포물선은 이미 틀려 있다.
          </>
        }
      />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
