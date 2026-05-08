import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { Counterexample, WhyNotTaught } from "../components/meta";
import { TwoPendulums } from "../components/widgets/two-pendulums";
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
      <Link to="/">Lemma</Link>
      <span className="mx-2 text-rule">/</span>
      <Link to="/graph">{pick(language, "graph", "그래프")}</Link>
      <span className="mx-2 text-rule">/</span>
      <span className="uppercase tracking-[0.06em] text-ink">
        {pick(language, "physics · the pendulum clock", "물리 · 진자시계")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · the lie a clock runs on", "도입 · 시계가 기댄 거짓말")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>Double the swing. Why does the clock barely change?</>,
          <>진폭을 두 배로 키웠는데, 왜 시계는 거의 같은 시간을 잴까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            A clock needs a tick that does not change. A real pendulum's swing depends on its
            amplitude — push it harder and it returns more slowly. So how did the world build
            mechanical clocks accurate to seconds per day on a device whose{" "}
            <Term id="period">period</Term> is, in principle, amplitude-dependent?{" "}
            <b>The trick is that for small swings, it almost isn't.</b> Replace one nonlinear
            function with its tangent line at zero, and the equation becomes a harmonic oscillator
            with a constant period. The clock stands on that approximation.
          </>,
          <>
            시계는 변하지 않는 째깍이 필요하다. 그런데 실제 진자의 흔들림은 진폭에 의존한다 — 세게
            밀면 돌아오는 데 더 오래 걸린다. 그렇다면 세상은 어떻게 *원리적으로* 진폭에 의존하는
            장치 위에 하루 오차 몇 초의 시계를 세웠을까?{" "}
            <b>비밀은 작은 흔들림에서는 *거의* 의존하지 않는다는 것.</b> 비선형 함수 하나를 0에서의
            접선으로 바꾸면, 방정식은 주기가 *상수*인 조화진동자가 된다. 시계는 그 근사 위에 서
            있다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            In the widget below: with correction <b>off</b>, two pendulums of equal length but very
            different amplitudes swing perfectly in step. Flip correction <b>on</b> and the larger
            swing visibly lags. The "almost" is the whole story of pendulum-clock engineering.
          </>,
          <>
            아래 위젯에서: 보정이 <b>꺼짐</b>일 때 길이는 같지만 진폭이 매우 다른 두 진자가{" "}
            <em>완벽히</em> 같은 박자로 흔들린다. 보정 <b>켜짐</b>으로 바꾸면 큰 진폭 쪽이 눈에
            보이게 뒤처진다. 이 "거의"가 진자시계 공학의 전부.
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
        <h3>{pick(language, "What a clock asks for", "시계가 요구하는 것")}</h3>
        <p>
          {pick(
            language,
            <>
              A mechanical clock counts swings. For "minute" to mean what we want it to mean, every
              swing must take the <em>same</em> amount of time. The bob does not have to swing with
              any particular amplitude — only with a <em>constant</em>{" "}
              <Term id="period">period</Term> regardless of how much energy the escapement happens
              to have given it on this tick. Whether the period actually has this property depends
              on the equation of motion.
            </>,
            <>
              기계식 시계는 흔들림의 횟수를 센다. "1분"이 우리가 원하는 의미가 되려면, 매 흔들림이{" "}
              *같은* 시간이 걸려야 한다. 흔들림 진폭은 무엇이든 좋다 — 단,{" "}
              <Term id="period">주기</Term>가 *일정*해야 한다, 이번 째깍에서 탈진기가 얼마만큼의
              에너지를 줬든 무관하게. 주기가 실제로 그 성질을 가지는지는 운동 방정식이 결정한다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "The real equation", "진짜 방정식")}</h3>
        <p>
          {pick(
            language,
            <>
              For a bob of mass <span className={MONO}>m</span> on a rigid rod of length{" "}
              <span className={MONO}>L</span>, the only force giving it angular{" "}
              <Term id="acceleration">acceleration</Term> is the component of{" "}
              <Term id="gravity">gravity</Term> tangent to the arc, which equals{" "}
              <span className={FORMULA_INLINE}>−mg sin θ</span> for angle{" "}
              <span className={MONO}>θ</span> measured from straight down. Newton's second law along
              the arc gives:
            </>,
            <>
              질량 <span className={MONO}>m</span>의 추가 길이 <span className={MONO}>L</span>의
              강체 막대에 매달려 있을 때, 각 <Term id="acceleration">가속도</Term>를 만드는 유일한
              힘은 <Term id="gravity">중력</Term>의 호 접선 성분 — 수직 아래에서 측정한 각{" "}
              <span className={MONO}>θ</span>에 대해{" "}
              <span className={FORMULA_INLINE}>−mg sin θ</span>. 호를 따라 뉴턴 제2법칙을 쓰면:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`θ̈ = −(g/L) · sin θ`}
        </pre>
        <p>
          {pick(
            language,
            <>
              That is a <em>nonlinear</em> differential equation. There is no clean elementary
              solution; the period <em>does</em> depend on the amplitude{" "}
              <span className={MONO}>θ₀</span> the bob is launched at. If the world worked exactly
              like this, no mechanical clock could keep time.
            </>,
            <>
              이것은 *비선형* 미분 방정식이다. 깔끔한 초등 해는 없고, 주기는 추가 출발한 진폭{" "}
              <span className={MONO}>θ₀</span>에 *의존한다*. 세상이 정확히 이대로라면, 어떤 기계식
              시계도 시간을 지킬 수 없다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={3}>
        <h3>{pick(language, "The small-angle move", "작은 각의 한 수")}</h3>
        <p>
          {pick(
            language,
            <>
              Look at <span className={MONO}>sin θ</span> near zero. Its tangent line at the origin
              is just <span className={MONO}>y = θ</span>. So{" "}
              <span className={FORMULA_INLINE}>sin θ ≈ θ</span> for small{" "}
              <span className={MONO}>θ</span> (in radians). At <span className={MONO}>θ = 5°</span>{" "}
              (≈ 0.087 rad) the error is about 0.1%. At <span className={MONO}>30°</span> it's about
              4.5%. At <span className={MONO}>60°</span> it's nearly 18% — the approximation breaks
              down quickly. This is the{" "}
              <Term id="small-angle-approximation">small-angle approximation</Term>; replacing a
              nonlinear function by its tangent line is{" "}
              <Term id="linearization">linearization</Term> in general.
            </>,
            <>
              <span className={MONO}>sin θ</span>를 0 근처에서 보자. 원점에서의 접선은{" "}
              <span className={MONO}>y = θ</span>. 그래서 작은 <span className={MONO}>θ</span>{" "}
              (라디안)에 대해 <span className={FORMULA_INLINE}>sin θ ≈ θ</span>.{" "}
              <span className={MONO}>θ = 5°</span> (≈ 0.087 rad)에서 오차는 약 0.1%.{" "}
              <span className={MONO}>30°</span>에서는 약 4.5%. <span className={MONO}>60°</span>
              에서는 거의 18% — 근사가 빠르게 깨진다. 이게{" "}
              <Term id="small-angle-approximation">작은 각 근사</Term>. 비선형 함수를 접선으로
              바꾸는 일반적 절차는 <Term id="linearization">선형화</Term>.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              The crisis: the equation in §2 is hard. The move: replace{" "}
              <span className={MONO}>sin θ</span> by <span className={MONO}>θ</span> wherever it
              appears. The trade: the new equation will be wrong for big swings; the gamble is that
              real clocks operate in the regime where it isn't.
            </>,
            <>
              위기: §2의 식은 어렵다. 한 수: 모든 곳에서 <span className={MONO}>sin θ</span>를{" "}
              <span className={MONO}>θ</span>로 바꾼다. 거래: 새 식은 큰 흔들림에서는 틀린다. 도박:
              실제 시계는 그게 안 틀리는 영역에서 작동한다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={4}>
        <h3>{pick(language, "The linearized equation", "선형화된 방정식")}</h3>
        <p>
          {pick(
            language,
            <>Substitute. The pendulum equation becomes:</>,
            <>대입한다. 진자 방정식은:</>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`θ̈ = −(g/L) · θ`}
        </pre>
        <p>
          {pick(
            language,
            <>
              That is <Term id="simple-harmonic-motion">simple harmonic motion</Term>: the
              acceleration is proportional to the negative of the displacement. The general solution
              is <span className={FORMULA_INLINE}>θ(t) = θ₀ cos(ω·t + φ)</span> for{" "}
              <span className={FORMULA_INLINE}>ω = √(g/L)</span>. Plug in initial conditions
              ("released from rest at angle <span className={MONO}>θ₀</span>") and the phase{" "}
              <span className={MONO}>φ</span> goes to zero, leaving{" "}
              <span className={FORMULA_INLINE}>θ(t) = θ₀ cos(√(g/L) · t)</span>.
            </>,
            <>
              그게 <Term id="simple-harmonic-motion">단순조화운동</Term>: 가속도가 변위의 음의 값에
              비례. 일반해는 <span className={FORMULA_INLINE}>θ(t) = θ₀ cos(ω·t + φ)</span>,{" "}
              <span className={FORMULA_INLINE}>ω = √(g/L)</span>. 초기 조건 ("각{" "}
              <span className={MONO}>θ₀</span>에서 정지 상태로 놓음")을 넣으면 위상{" "}
              <span className={MONO}>φ</span>이 0이 되어{" "}
              <span className={FORMULA_INLINE}>θ(t) = θ₀ cos(√(g/L) · t)</span>가 남는다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>
          {pick(
            language,
            "The clock formula — period without amplitude",
            "시계 공식 — 진폭이 없는 주기",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              The cosine has period <span className={MONO}>2π</span>; the angular frequency{" "}
              <span className={MONO}>ω</span> ticks at <span className={MONO}>2π/T</span> radians
              per second. So:
            </>,
            <>
              코사인의 주기는 <span className={MONO}>2π</span>, 각진동수{" "}
              <span className={MONO}>ω</span>는 초당 <span className={MONO}>2π/T</span> 라디안.
              그러므로:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`T = 2π √(L/g)`}
        </pre>
        <p>
          {pick(
            language,
            <>
              <em>The amplitude is gone.</em> Period depends only on the rod length{" "}
              <span className={MONO}>L</span> and the local <span className={MONO}>g</span>; not on
              the bob's mass, not on how widely it's swinging. That is the property a clock needs,
              derived as a clean consequence of the linearized equation. A 1-meter rod on Earth
              swings with <span className={FORMULA_INLINE}>T ≈ 2.007 s</span>; on the Moon, where{" "}
              <span className={MONO}>g ≈ 1.62 m/s²</span>, the same rod swings with{" "}
              <span className={FORMULA_INLINE}>T ≈ 4.93 s</span>.
            </>,
            <>
              <em>진폭이 사라졌다.</em> 주기는 막대 길이 <span className={MONO}>L</span>과 그 지역의{" "}
              <span className={MONO}>g</span>에만 의존한다 — 추의 질량과 무관, 얼마나 크게
              흔드는가와도 무관. 시계가 요구한 그 성질이, 선형화된 방정식의 깔끔한 따름결과로
              떨어진다. 지구의 1m 막대는 <span className={FORMULA_INLINE}>T ≈ 2.007 s</span>로
              흔들리고, 달에서는 <span className={MONO}>g ≈ 1.62 m/s²</span>이라 같은 막대가{" "}
              <span className={FORMULA_INLINE}>T ≈ 4.93 s</span>로 흔들린다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={6}>
        <h3>{pick(language, "The lie, examined honestly", "거짓말을 정직하게 들여다보기")}</h3>
        <p>
          {pick(
            language,
            <>
              The amplitude does not <em>vanish</em> from the real period — it shrinks. The next
              term in the expansion is well known:
            </>,
            <>
              진폭은 실제 주기에서 *사라지는* 게 아니라 *작아진다*. 전개의 다음 항은 잘 알려져 있다:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`T(θ₀) = T₀ · (1  +  θ₀²/16  +  …)`}
        </pre>
        <p>
          {pick(
            language,
            <>
              At <span className={MONO}>θ₀ = 10°</span> (≈ 0.175 rad) the correction is about 0.2% —
              a tolerable second per eight minutes. At <span className={MONO}>30°</span> it's 1.7%,
              half a minute per half-hour — already worse than a digital watch. At{" "}
              <span className={MONO}>60°</span> it's 6.9%, six minutes per hour — uselessly far from
              a clock. The widget shows it: with correction on and{" "}
              <span className={MONO}>θ_B = 60°</span>, pendulum B drifts visibly behind A within a
              handful of swings.
            </>,
            <>
              <span className={MONO}>θ₀ = 10°</span> (≈ 0.175 rad)에서 보정은 약 0.2% — 8분에 1초,
              감내할 만함. <span className={MONO}>30°</span>에서는 1.7%, 30분에 30초 — 이미 디지털
              손목시계보다 못함. <span className={MONO}>60°</span>에서는 6.9%, 시간당 6분 — 시계로는
              쓸모없음. 위젯이 보여준다: 보정을 켠 채 <span className={MONO}>θ_B = 60°</span>로 두면
              몇 흔들림 안에 B가 A보다 눈에 띄게 뒤처진다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Real pendulum clocks worked because their escapements force the bob to swing in
              <em>small</em> arcs — 17th-century clockmakers added cycloidal "cheeks" to the
              suspension to compensate for what amplitude error remained, and modern designs keep
              the arc small enough for the linear approximation to stay nearly true. The entire
              technology is built around the regime in which the lie holds. That, more than the
              formula itself, is the lesson worth pinning.
            </>,
            <>
              실제 진자시계가 작동한 건 탈진기가 추를 *작은* 호 안에 가둬뒀기 때문이다. 17세기
              시계공들은 남은 진폭 오차를 보정하려고 매다는 부위에 사이클로이드 "뺨"을 붙였고, 현대
              설계는 호를 충분히 작게 유지해 선형 근사가 *거의* 참인 영역에 머무르게 한다. 기술
              전체가 그 거짓말이 통하는 영역을 중심으로 만들어졌다. 공식 자체보다 이게 더 핀에 박을
              가치가 있는 교훈.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc6} />}
        <Counterexample>
          {{
            en: (
              <>
                The amplitude is not the only axis the model sweeps under the rug.{" "}
                <span className="font-mono text-[0.93em]">T = 2π√(L/g)</span> assumes{" "}
                <span className="font-mono text-[0.93em]">g</span> is fixed — but{" "}
                <span className="font-mono text-[0.93em]">g</span> drops by ~0.031% per 100 m of
                altitude. Carry a perfectly tuned grandfather clock from London to Denver (≈1,600
                m): the period lengthens by ~0.025%, and the clock falls behind by{" "}
                <b>~21 seconds per day</b>. Linearizing <span className="font-mono">sin θ</span> is
                one of several lies the clock runs on; the small-angle move is just the most visible
                one.
              </>
            ),
            ko: (
              <>
                진폭만이 모델이 카펫 밑으로 쓸어 넣은 축은 아니다.{" "}
                <span className="font-mono text-[0.93em]">T = 2π√(L/g)</span>는{" "}
                <span className="font-mono text-[0.93em]">g</span>가 고정이라고 가정한다 — 하지만{" "}
                <span className="font-mono text-[0.93em]">g</span>는 고도 100m당 약 0.031% 줄어든다.
                완벽히 맞춘 괘종시계를 런던에서 덴버 (≈1,600m)로 옮기면 주기가 약 0.025% 길어지고,
                시계는 <b>하루에 약 21초</b> 늦는다. <span className="font-mono">sin θ</span>의
                선형화는 시계가 의존하는 여러 거짓말 중 하나일 뿐 — 가장 눈에 띄는 한 줄에 불과하다.
              </>
            ),
          }}
        </Counterexample>
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
            <b>The pendulum clock runs on a lie.</b> Real swings depend on amplitude; small swings{" "}
            <em>almost</em> don't. Linearize the equation, and the period becomes a constant within
            the only regime a real clock ever works in. The "almost" is the engineering.
          </>,
          <>
            <b>진자시계는 거짓말 위에서 돈다.</b> 실제 흔들림은 진폭에 의존한다 — 단, 작은
            흔들림에서는 *거의* 의존하지 않는다. 식을 선형화하면 주기가 상수가 되고, 그 거짓말이
            통하는 영역에서만 시계가 시계가 된다. "거의"가 곧 공학.
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
        tag={{ en: "small-angle period by hand", ko: "작은 각 주기 손계산" }}
        prompt={{
          en: (
            <>
              Estimate the small-angle period <span className={FORMULA_INLINE}>T = 2π√(L/g)</span>{" "}
              for <span className={MONO}>L = 1 m</span>, <span className={MONO}>g = 10 m/s²</span>.
              Use <span className={MONO}>π² ≈ 10</span> to dodge the calculator.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>L = 1 m</span>, <span className={MONO}>g = 10 m/s²</span>일 때
              작은 각 주기 <span className={FORMULA_INLINE}>T = 2π√(L/g)</span>를 어림하라. 계산기
              없이 <span className={MONO}>π² ≈ 10</span>을 활용.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>L/g = 0.1</span>, so{" "}
              <span className={MONO}>√(L/g) = √0.1 ≈ 0.316</span>. Then{" "}
              <span className={MONO}>T ≈ 2π · 0.316 ≈ 6.28 · 0.316 ≈ 1.99 s</span>. (More cleanly:{" "}
              <span className={MONO}>T = 2π · √(L/g)</span>, so{" "}
              <span className={MONO}>T² = 4π²·L/g ≈ 40·0.1 = 4</span>, <b>T ≈ 2 s</b>. The "seconds
              pendulum" is exactly the rod whose half-period is one second — a meter long, on
              Earth.)
            </>
          ),
          ko: (
            <>
              <span className={MONO}>L/g = 0.1</span>, 그러므로{" "}
              <span className={MONO}>√(L/g) = √0.1 ≈ 0.316</span>. 이어서{" "}
              <span className={MONO}>T ≈ 2π · 0.316 ≈ 6.28 · 0.316 ≈ 1.99 s</span>. (더 깔끔히:{" "}
              <span className={MONO}>T = 2π · √(L/g)</span>이라{" "}
              <span className={MONO}>T² = 4π²·L/g ≈ 40·0.1 = 4</span>, <b>T ≈ 2 s</b>. *1초 진자* 는
              반주기가 1초인 막대 — 지구에서 정확히 1m.)
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        tag={{ en: "a 2-second pendulum on the Moon", ko: "달에서의 2초 진자" }}
        prompt={{
          en: (
            <>
              On the Moon, <span className={MONO}>g_moon ≈ 1.62 m/s²</span>. What length{" "}
              <span className={MONO}>L_moon</span> gives a small-angle pendulum of period{" "}
              <span className={MONO}>T = 2 s</span> there? How does that compare to the Earth length
              from exercise 1?
            </>
          ),
          ko: (
            <>
              달에서는 <span className={MONO}>g_달 ≈ 1.62 m/s²</span>. 그곳에서 작은 각 주기{" "}
              <span className={MONO}>T = 2 s</span>를 만들려면 길이{" "}
              <span className={MONO}>L_달</span>은? 문제 1의 지구 길이와 비교하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              From <span className={MONO}>T = 2π√(L/g)</span> and{" "}
              <span className={MONO}>T = 2</span>:{" "}
              <span className={MONO}>L = g · (T/2π)² = g/π²</span>. With{" "}
              <span className={MONO}>π² ≈ 9.87</span> and{" "}
              <span className={MONO}>g_moon = 1.62</span>:{" "}
              <span className={MONO}>L_moon ≈ 0.164 m</span> ≈ 16 cm. Earth needed 1 m. The Moon
              clock pendulum is about 6× shorter for the same tick. (Equivalently, the same
              meter-long rod ticks every <span className={MONO}>≈ 4.93 s</span> on the Moon.)
            </>
          ),
          ko: (
            <>
              <span className={MONO}>T = 2π√(L/g)</span>와 <span className={MONO}>T = 2</span>에서{" "}
              <span className={MONO}>L = g · (T/2π)² = g/π²</span>.{" "}
              <span className={MONO}>π² ≈ 9.87</span>, <span className={MONO}>g_달 = 1.62</span>
              이므로 <span className={MONO}>L_달 ≈ 0.164 m</span> ≈ 16 cm. 지구는 1 m였다. 같은
              째깍을 유지하는 달의 시계 진자는 약 6배 짧다. (반대로 같은 1 m 막대는 달에서 약{" "}
              <span className={MONO}>4.93 s</span>마다 한 번 째깍한다.)
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "where amplitude went", ko: "진폭이 사라진 자리" }}
        prompt={{
          en: (
            <>
              Walk through the algebra: starting from{" "}
              <span className={FORMULA_INLINE}>θ̈ = −(g/L) sin θ</span> and the substitution{" "}
              <span className={MONO}>sin θ ≈ θ</span>, explain in one paragraph why{" "}
              <span className={MONO}>θ₀</span> drops out of the period. Be precise about{" "}
              <em>where</em> the amplitude dependence was hiding before linearization.
            </>
          ),
          ko: (
            <>
              대수를 따라가자: <span className={FORMULA_INLINE}>θ̈ = −(g/L) sin θ</span>에서 출발해{" "}
              <span className={MONO}>sin θ ≈ θ</span>를 넣으면 왜 주기에서{" "}
              <span className={MONO}>θ₀</span>가 사라지는지 한 문단으로 설명하라. 선형화 전에는 진폭
              의존성이 *어디에* 숨어 있었는지 정확히.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Before linearization, the right-hand side is{" "}
              <span className={MONO}>−(g/L)·sin θ</span>. The function{" "}
              <span className={MONO}>sin</span> grows slower than its argument: at{" "}
              <span className={MONO}>θ = 1</span>, <span className={MONO}>sin 1 ≈ 0.84</span> (16%
              smaller). So at large angles, the restoring "force-per-unit-displacement" is{" "}
              <em>less than</em> <span className={MONO}>g/L</span>; the pendulum accelerates less
              per unit of angle than a linear law would predict, so it returns more slowly. The rate
              at which the restoring strength weakens depends on <span className={MONO}>θ₀</span>,
              which is precisely how <span className={MONO}>θ₀</span> enters the period. Replace{" "}
              <span className={MONO}>sin θ</span> with <span className={MONO}>θ</span> and the
              restoring strength is exactly proportional to displacement at all{" "}
              <span className={MONO}>θ</span>; <span className={MONO}>θ₀</span> no longer modifies
              the rate of return, so <span className={MONO}>T</span> stops depending on it.
            </>
          ),
          ko: (
            <>
              선형화 전 우변은 <span className={MONO}>−(g/L)·sin θ</span>. 함수{" "}
              <span className={MONO}>sin</span>은 입력보다 느리게 자란다:{" "}
              <span className={MONO}>θ = 1</span>에서 <span className={MONO}>sin 1 ≈ 0.84</span>{" "}
              (16% 작음). 그러니 큰 각에서 "변위당 복원 가속" 이{" "}
              <em>
                <span className={MONO}>g/L</span>보다 작다
              </em>{" "}
              — 진자가 선형 법칙이 예측하는 것보다 느리게 가속되어 더 늦게 돌아온다. 복원 강도가
              약해지는 비율이 <span className={MONO}>θ₀</span>에 의존하고, 그게 바로{" "}
              <span className={MONO}>θ₀</span>가 주기에 들어오는 경로.{" "}
              <span className={MONO}>sin θ</span>를 <span className={MONO}>θ</span>로 바꾸면 복원
              강도가 모든 <span className={MONO}>θ</span>에서 *변위에 정확히 비례*하게 되고,{" "}
              <span className={MONO}>θ₀</span>는 더 이상 돌아오는 속도를 바꾸지 않으므로{" "}
              <span className={MONO}>T</span>가 그것에 의존하지 않게 된다.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        noCalculator
        tag={{ en: "how big is the lie at 60°?", ko: "60°에서 거짓말은 얼마나 큰가?" }}
        prompt={{
          en: (
            <>
              Use the leading correction{" "}
              <span className={FORMULA_INLINE}>T(θ₀) ≈ T₀ · (1 + θ₀²/16)</span> with{" "}
              <span className={MONO}>θ₀ = 60°</span>. Estimate the relative error{" "}
              <span className={MONO}>(T − T₀)/T₀</span> as a percentage. How many seconds per hour
              is that? Check the widget.
            </>
          ),
          ko: (
            <>
              1차 보정 <span className={FORMULA_INLINE}>T(θ₀) ≈ T₀ · (1 + θ₀²/16)</span>을{" "}
              <span className={MONO}>θ₀ = 60°</span>에 적용. 상대 오차{" "}
              <span className={MONO}>(T − T₀)/T₀</span>을 퍼센트로 어림하고, 시간당 몇 초인지 계산.
              위젯과 확인.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <span className={MONO}>60° = π/3 rad ≈ 1.05</span>;{" "}
              <span className={MONO}>θ₀² ≈ 1.10</span>; <span className={MONO}>θ₀²/16 ≈ 0.069</span>
              . So <span className={MONO}>(T − T₀)/T₀ ≈ 6.9%</span>. In an hour (3600 s), that is
              about <b>250 seconds slow</b> — over four minutes per hour. A "clock" with that error
              wouldn't reliably tell you breakfast from dinner.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>60° = π/3 rad ≈ 1.05</span>;{" "}
              <span className={MONO}>θ₀² ≈ 1.10</span>; <span className={MONO}>θ₀²/16 ≈ 0.069</span>
              . 그러므로 <span className={MONO}>(T − T₀)/T₀ ≈ 6.9%</span>. 1시간(3600 s)이면 약{" "}
              <b>250초 느림</b> — 시간당 4분 이상. 그런 오차의 "시계"로는 아침과 저녁도 못 가린다.
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
            application: <b>The Pendulum Clock</b>. Sister application:{" "}
            <Link to="/physics/projectile-motion">Projectile Motion</Link>. Both are physics
            applications that lean on small-deviation linear behaviour — the projectile because we
            ignore drag, the pendulum because we ignore <span className={MONO}>sin θ − θ</span>.
            Modules consumed eventually: a future <em>derivatives</em> or <em>linearization</em>{" "}
            module.
          </>,
          <>
            응용: <b>진자시계</b>. 자매 응용:{" "}
            <Link to="/physics/projectile-motion">포물선 운동</Link>. 둘 다 작은 편차에서의 선형
            거동에 기댄다 — 포물선은 공기저항을 무시하기 때문, 진자는{" "}
            <span className={MONO}>sin θ − θ</span>를 무시하기 때문. 향후 소비 후보 모듈:{" "}
            <em>미분</em> 또는 <em>선형화</em> 모듈.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function PendulumClock({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "The Pendulum Clock · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <TwoPendulums />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <WhyNotTaught>
        {{
          en: (
            <>
              Physics textbooks usually present the linearized pendulum as <em>the</em> pendulum
              equation, with the nonlinear original demoted to a footnote. The reader walks away
              thinking the clock <em>is</em> a simple-harmonic oscillator. Lemma keeps the nonlinear
              equation in arc 2, names the linearization in arc 3 as a <em>move</em> rather than a
              discovery, and spends arc 6 owning the lie. Engineering doesn't tell fewer truths than
              the textbook — it tells one more: the truth about <em>where the model holds</em>.
            </>
          ),
          ko: (
            <>
              물리 교과서는 보통 선형화된 진자식을 <em>그</em> 진자 방정식으로 내놓고, 비선형 원본은
              각주 한 줄로 밀어둔다. 독자는 시계가 *그냥* 단순조화진동자라고 믿고 떠난다. Lemma는
              §2에 비선형 식을 그대로 두고, §3에서 선형화를 *발견*이 아니라 *한 수*로 부르며, §6에서
              그 거짓말을 정직하게 들여다본다. 공학은 교과서보다 진실을 적게 말하지 않는다 —{" "}
              <em>모델이 어디서 통하는가</em>라는 한 가지 진실을 *더* 말한다.
            </>
          ),
        }}
      </WhyNotTaught>
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
