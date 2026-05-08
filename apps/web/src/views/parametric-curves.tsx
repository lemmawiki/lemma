import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { ToolSpec } from "../components/meta";
import { SameCurve } from "../components/widgets/same-curve";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const MONO = "font-mono text-[0.93em]";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const CODE_PRE =
  "mt-3 overflow-x-auto rounded-md border border-rule bg-rule-soft px-4 py-3.5 font-mono text-[13.5px] leading-[1.5] text-ink-soft";

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="mt-7 font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
      <Link to="/">{pick(language, "Lemma", "Lemma")}</Link>
      <span className="mx-2 text-rule">/</span>
      <span className="uppercase tracking-[0.06em] text-ink">
        {pick(language, "module · parametric curves", "모듈 · 매개변수 곡선")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · definitional crisis", "도입 · 정의의 위기")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(language, <>What is "the same curve"?</>, <>"같은 곡선"이란 무엇인가?</>)}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc">
        {pick(
          language,
          <>
            Drawing the parabola <span className={MONO}>y = x²</span> on a board, you'd say{" "}
            <em>this is a curve</em>. Below you'll see the same picture drawn three different ways —
            same paint, different motions. Which one is <b>the</b> curve? Pick an answer in your
            head before pressing play. Then play.
          </>,
          <>
            칠판에 <span className={MONO}>y = x²</span>을 그려놓고 무슨 곡선이냐고 물으면, 누구나{" "}
            <em>곡선이지</em> 하고 답한다. 그런데 아래에는 같은 그림이 세 가지 다른 방식으로
            그려진다 — 그림은 똑같고, 그리는 움직임이 다르다. <b>그</b> 곡선은 셋 중 어느 쪽인가?
            재생을 누르기 전에 머릿속으로 답을 한 번 정해둔다. 그 다음에 누른다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft">
        {pick(
          language,
          <>
            A module that opens with a{" "}
            <Term id="definitional-crisis">
              <em className="italic">definitional crisis</em>
            </Term>{" "}
            instead of an application: the same picture, drawn three different ways. The fix
            redefines what "a curve" even is — and that redefinition is the tool downstream
            applications (graphics, physics, animation) consume.
          </>,
          <>
            외부 응용이 아니라{" "}
            <Term id="definitional-crisis">
              <em className="italic">정의의 위기</em>
            </Term>
            로 열리는 모듈: 같은 그림이 세 가지 방식으로 그려진다. 그 위기를 푸는 과정에서 "곡선"이
            *무엇인지*가 다시 정의되고, 그 재정의가 아래로 흘러갈 응용들 (그래픽, 물리, 애니메이션)
            의 도구가 된다.
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

function Arc() {
  const { language, mode } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "the arc", "흐름")}</div>

      <ArcRow n={1}>
        <h3>{pick(language, "γ is a function, not a shape", "γ는 함수다, 모양이 아니다")}</h3>
        <p>
          {pick(
            language,
            <>
              A <Term id="parametrized-curve">parametrized curve</Term> is a function{" "}
              <span className={MONO}>γ : [0, 1] → ℝ²</span>. The three γ above are three{" "}
              <em>different</em> functions. They happen to share an{" "}
              <Term id="image-of-curve">image</Term> — the set{" "}
              <span className={MONO}>{"{γ(t) : t ∈ [0, 1]}"}</span>, which is the parabola{" "}
              <span className={MONO}>y = x²</span> on <span className={MONO}>x ∈ [−1, 1]</span> —
              but the image is a <em>set of points</em>, stripped of order, speed, and visit count.
              The function γ is none of those things. Two parametrized curves are equal when{" "}
              <span className={MONO}>γ₁(t) = γ₂(t)</span> for every t — the same equality you'd use
              for any other function. By <em>that</em> test, the three γ above are three different
              curves that happen to leave the same shadow. But functional equality is only the
              strictest of three layers; the next step locates where the line should actually be
              drawn.
            </>,
            <>
              <em className="italic text-ink-mute">
                (어휘 약속: 이 글에서 "곡선"은 매개변수 곡선 — 함수 — 을 가리키고, 점들의 집합은
                "상"이라 부른다. 한국어에서 "곡선"은 일상적으로 두 의미를 다 받는데, 한 단어가 두
                대상을 함께 짊어지고 있다는 사실 자체가 이 페이지의 출발점이다.)
              </em>{" "}
              <Term id="parametrized-curve">매개변수 곡선</Term>은 함수{" "}
              <span className={MONO}>γ : [0, 1] → ℝ²</span>다. 위의 세 γ는 <em>서로 다른</em> 세
              함수다. 셋은 우연히 같은 <Term id="image-of-curve">상</Term> — 집합{" "}
              <span className={MONO}>{"{γ(t) : t ∈ [0, 1]}"}</span>, 즉 포물선{" "}
              <span className={MONO}>y = x²</span>의 <span className={MONO}>x ∈ [−1, 1]</span> 구간
              — 을 공유할 뿐이다. 상은 순서·속도·방문 횟수가 모두 빠진 <em>점들의 집합</em>이고,
              함수 γ는 그중 어느 것도 아니다. 두 매개변수 곡선이 같다는 건 모든 t에 대해{" "}
              <span className={MONO}>γ₁(t) = γ₂(t)</span>라는 뜻 — 다른 어떤 함수에서나 쓰는 그 일치
              판정 그대로다. <em>그</em> 기준으로 보면 위의 셋은 같은 그림자를 남기는 세 개의 서로
              다른 곡선이다. 다만 함수 일치는 세 층 중 가장 엄격한 한 층일 뿐이고, 다음 단계에서
              선이 실제로 어디에 그어져야 하는지 본다.
            </>,
          )}
        </p>
        {mode === "code" && (
          <pre className={CODE_PRE}>{`# γ is a function. Equality is functional equality.
g1 = lambda u: (2*u - 1, (2*u - 1)**2)
g2 = lambda u: ((2*u - 1)**3, (2*u - 1)**6)

# Same image — both trace y = x² on x ∈ [-1, 1].
# Different functions:
g1(0.25)   # (-0.5,  0.25)
g2(0.25)   # (-0.125, 0.000244)
# γ₁(0.25) ≠ γ₂(0.25) → different curves, by definition.

# 'image' is what you get when you forget the input.
image_g1 = {round(g1(t/100)[0], 4) for t in range(101)}
image_g2 = {round(g2(t/100)[0], 4) for t in range(101)}
# Same set. Not the same function.`}</pre>
        )}
      </ArcRow>

      <ArcRow n={2}>
        <h3>
          {pick(language, "Same image, but is it the same curve?", "같은 상이라도 같은 곡선인가?")}
        </h3>
        <p>
          {pick(
            language,
            <>
              Step 1's strict test separates γ₁ from γ₂ even though they paint the same picture in
              the same direction at different paces. That feels too strict — geometrically they
              ought to be the same. Differential geometry agrees: it identifies γ with{" "}
              <span className={MONO}>γ ∘ φ</span> whenever <Term id="reparametrization">φ</Term> is
              a monotone bijection <span className={MONO}>[0, 1] → [0, 1]</span>. With{" "}
              <span className={MONO}>φ(u) = ((2u−1)³ + 1) / 2</span> (monotone since{" "}
              <span className={MONO}>dφ/du = 3(2u−1)² ≥ 0</span>), one checks{" "}
              <span className={MONO}>γ₁ ∘ φ = γ₂</span> exactly: γ₁ and γ₂ are the same curve at
              different paces. γ₃ has no such partner — it visits each interior image point twice,
              and no monotone φ can take a once-visit schedule to a twice-visit one. So between
              strict equality (too tight) and image equality (too loose) sits{" "}
              <Term id="reparametrization">reparametrization</Term> equivalence — and that is what
              most working mathematicians mean by "the same curve."
            </>,
            <>
              § 1의 엄격한 판정은 γ₁과 γ₂를 서로 다른 곡선으로 가른다 — 같은 그림을 같은 방향으로
              그리는데, 속도만 다른데도 그렇다. 그건 너무 빡빡한 기준이다. 기하학적으로는 같다고
              해야 한다. 미분기하학은 실제로 그렇게 한다: 단조 일대일 함수{" "}
              <Term id="reparametrization">φ</Term> : <span className={MONO}>[0, 1] → [0, 1]</span>
              가 있을 때 γ와 <span className={MONO}>γ ∘ φ</span>를 같은 것으로 본다.{" "}
              <span className={MONO}>φ(u) = ((2u−1)³ + 1) / 2</span> (단조,{" "}
              <span className={MONO}>dφ/du = 3(2u−1)² ≥ 0</span>)로 두면{" "}
              <span className={MONO}>γ₁ ∘ φ = γ₂</span>가 정확히 성립한다 — γ₁과 γ₂는 같은 곡선이고,
              속도만 다를 뿐이다. γ₃에는 그런 짝이 없다 — 내부 점을 두 번 방문하는데, 단조 φ로는 한
              번 방문 스케줄을 두 번 방문 스케줄로 바꿀 수 없기 때문이다. 엄격한 일치 (너무 빡빡)와
              상의 일치 (너무 헐거움) 사이에 <Term id="reparametrization">재매개화</Term> 동치가
              있고, 대부분의 수학자가 "같은 곡선"이라 부르는 건 바로 이것이다.
            </>,
          )}
        </p>
        {mode === "code" && (
          <pre className={CODE_PRE}>{`import numpy as np

# γ₁ and γ₂ paint the same picture in the same direction, at different paces.
# Test: is there a monotone φ : [0,1] → [0,1] with γ₁ ∘ φ = γ₂?
phi = lambda u: ((2*u - 1)**3 + 1) / 2     # monotone: dφ/du = 3(2u-1)² ≥ 0

g1 = lambda u: (2*u - 1, (2*u - 1)**2)
g2 = lambda u: ((2*u - 1)**3, (2*u - 1)**6)

us = np.linspace(0, 1, 9)
err = max(abs(g1(phi(u))[0] - g2(u)[0]) for u in us)
# err == 0.0  → γ₁ ∘ φ = γ₂  →  γ₁ ≡ γ₂ up to reparametrization.

# γ₃ visits x=0 at u=1/4 AND u=3/4. γ₁ visits x=0 only at u=1/2.
# A monotone φ can't map one t to two t — γ₁ ≢ γ₃ up to reparametrization.`}</pre>
        )}
      </ArcRow>

      <div className="mt-[22px] rounded-r-md border-l-4 border-acc bg-acc-soft px-[22px] py-[18px] text-base leading-[1.55] text-acc-deep [&_em]:italic">
        {pick(
          language,
          <>
            <b>Three layers of "same":</b>
            <ul className="my-2 ml-5 list-disc space-y-1">
              <li>
                <b>same image</b> — the picture: γ₁ ~ γ₂ ~ γ₃
              </li>
              <li>
                <b>same up to reparametrization</b> — the geometric curve: γ₁ ~ γ₂; γ₃ stands alone
              </li>
              <li>
                <b>equal as functions</b> — the parametrized curve: all three differ
              </li>
            </ul>
            The picture is the weakest layer; the function is the strictest.{" "}
            <b>Geometry lives in between.</b> School math conflates all three under the single word{" "}
            <em>curve</em>; that is why "is this the same curve?" has no clean answer — the word was
            quietly carrying three different objects. The widget you played with above is one
            diagram showing all three at once.
          </>,
          <>
            <b>"같다"의 세 층:</b>
            <ul className="my-2 ml-5 list-disc space-y-1">
              <li>
                <b>같은 상</b> — 그림: γ₁ ~ γ₂ ~ γ₃
              </li>
              <li>
                <b>재매개화 동치</b> — 기하학적 곡선: γ₁ ~ γ₂; γ₃은 따로
              </li>
              <li>
                <b>함수로서 같음</b> — 매개변수 곡선: 셋 다 다름
              </li>
            </ul>
            그림은 가장 약한 층이고, 함수는 가장 엄격한 층이다. <b>기하학은 그 사이에 산다.</b> 학교
            수학은 이 세 층을 <em>곡선</em>이라는 한 단어 안에 섞어 둔다. "같은 곡선인가?"라는
            질문에 깔끔한 답이 없는 건, 그 한 단어가 세 가지를 한꺼번에 짊어지고 있어서다. 위에서
            가지고 논 위젯 하나가 그 세 층을 한 그림 안에 담아 보여준다.
          </>,
        )}
      </div>
    </section>
  );
}

function Exercises() {
  return (
    <section className="mt-14">
      <div className={KICKER}>exercises · 손으로 풀기</div>

      <Exercise
        number={1}
        tag={{ en: "read the widget · trail density", ko: "위젯 읽기 · 트레일 밀도" }}
        prompt={{
          en: (
            <>
              Play γ₂ and look at the trail. Where are the points <em>most</em> tightly packed —
              near the origin, or near the endpoints? Why? (Trail spacing is constant in time, not
              in arc length.)
            </>
          ),
          ko: (
            <>
              γ₂를 재생하고 트레일을 보자. 점들이 <em>가장 빽빽이</em> 모이는 곳은 원점 근처인가,
              끝점 근처인가? 왜 그럴까? (트레일은 시간 간격이 일정하다 — 호 길이가 아니라.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Densest <em>at the origin</em>. With <span className={MONO}>x(u) = (2u−1)³</span>, the
              speed <span className={MONO}>dx/du = 6(2u−1)²</span> vanishes at{" "}
              <span className={MONO}>u = 1/2</span> — γ₂ crawls through the origin and sprints
              through the endpoints. Equal time steps spend most of their time near the slow point,
              so trail dots pile up there. The image is the same parabola; only the schedule
              differs.
            </>
          ),
          ko: (
            <>
              <em>원점</em>에서 가장 빽빽하다. <span className={MONO}>x(u) = (2u−1)³</span>이면 속도{" "}
              <span className={MONO}>dx/du = 6(2u−1)²</span>는 <span className={MONO}>u = 1/2</span>
              에서 0이 된다 — γ₂는 원점을 기어가다가 끝에서 질주한다. 시간 간격이 일정하니 느린
              구간에 시간을 더 많이 쓰고, 점도 거기에 쌓인다. 상은 같은 포물선이고, 스케줄만 다를
              뿐이다.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{
          en: "construct · same image, different schedule",
          ko: "구성하기 · 같은 상, 다른 스케줄",
        }}
        prompt={{
          en: (
            <>
              Write a γ : [0, 1] → ℝ² whose image is exactly <span className={MONO}>y = x²</span> on{" "}
              <span className={MONO}>x ∈ [−1, 1]</span>, but which traces that parabola{" "}
              <em>three times</em> as t goes 0 → 1. Give a closed-form expression. (Hint: the round
              trip γ₃ traces it twice using cosine.)
            </>
          ),
          ko: (
            <>
              상이 정확히 <span className={MONO}>y = x²</span>의{" "}
              <span className={MONO}>x ∈ [−1, 1]</span> 구간이면서, t가 0 → 1로 가는 동안 그
              포물선을 <em>세 번</em> 훑는 γ : [0, 1] → ℝ²를 닫힌 식으로 써보자. (힌트: γ₃은
              코사인을 써서 두 번 훑는다.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              One choice: <span className={MONO}>γ(t) = (cos(3πt), cos²(3πt))</span>. As t runs 0 →
              1, the argument <span className={MONO}>3πt</span> sweeps{" "}
              <span className={MONO}>[0, 3π]</span>; cosine completes one and a half full periods,
              traversing <span className={MONO}>[−1, 1]</span> three times. Image: the parabola{" "}
              <span className={MONO}>y = x²</span> on <span className={MONO}>[−1, 1]</span>. Same
              shadow, triple-pace schedule. The image cannot tell this trip apart from γ₁'s single
              one.
            </>
          ),
          ko: (
            <>
              한 예: <span className={MONO}>γ(t) = (cos(3πt), cos²(3πt))</span>. t가 0 → 1로 가면
              인자 <span className={MONO}>3πt</span>는 <span className={MONO}>[0, 3π]</span>를
              지나고, 코사인은 한 주기 반을 돌아 <span className={MONO}>[−1, 1]</span>을 세 번
              훑는다. 상은 <span className={MONO}>[−1, 1]</span> 위의 포물선{" "}
              <span className={MONO}>y = x²</span>. 같은 그림자, 세 배 빠른 스케줄이다. 상만 봐서는
              이 여정을 γ₁의 한 번짜리 여정과 구별할 수 없다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{
          en: "the evil one · 'extensional equality'",
          ko: "악마의 문제 · '외연적 동등성'",
        }}
        prompt={{
          en: (
            <>
              A junior says: "Two functions with the same outputs are the same function — that's
              extensional equality. Three γ producing the same image must be the same curve." Find
              the bug in one sentence. Then state the correct equality test for parametrized curves.
            </>
          ),
          ko: (
            <>
              주니어가 말한다: "출력이 같은 두 함수는 같은 함수다 — 외연적 동등성. 그러면 같은 상을
              만들어내는 세 γ도 같은 곡선이어야 하는 거 아니냐." 어디가 잘못됐는지 한 문장으로 짚고,
              매개변수 곡선의 올바른 일치 기준을 적어보자.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              The bug: extensional equality of γ compares <span className={MONO}>γ(t)</span> at
              every t, not <span className={MONO}>{"{γ(t) : t}"}</span> as a set; the junior swapped
              the function for its image. Correct test:{" "}
              <span className={FORMULA_INLINE}>γ₁ = γ₂ ⇔ γ₁(t) = γ₂(t) for all t</span>. Two γ with
              the same image are equal iff the schedule also matches, point by point.
            </>
          ),
          ko: (
            <>
              잘못된 지점: γ의 외연적 동등성은 모든 t에서 <span className={MONO}>γ(t)</span>를
              비교하는 것이지, <span className={MONO}>{"{γ(t) : t}"}</span>를 집합으로 비교하는 게
              아니다 — 주니어는 함수를 슬쩍 그 상으로 바꿔치기했다. 올바른 판정:{" "}
              <span className={FORMULA_INLINE}>γ₁ = γ₂ ⇔ 모든 t에 대해 γ₁(t) = γ₂(t)</span>. 상이
              같은 두 γ는 스케줄까지 점마다 일치해야만 같다.
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
            module: <b>Parametric Curves</b>. The crisis-as-hook spike that became a real module.
            Downstream consumers — Bezier curves in graphics, trajectories in physics, motion paths
            in animation — plug into the parametrization-vs-image distinction this module makes
            precise.
          </>,
          <>
            모듈: <b>매개변수 곡선</b>. 위기를 도입으로 삼은 스파이크가 정식 모듈로 자라난 결과. 이
            모듈이 정밀하게 만든 *매개변수 vs 이미지* 구분을 그래픽의 베지에 곡선, 물리의 궤적,
            애니메이션의 움직임 경로 같은 응용들이 소비한다.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function ParametricCurves() {
  useEffect(() => {
    document.title = "Parametric Curves · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <ToolSpec
        definition={{
          en: (
            <>
              A function <span className="font-mono text-[0.95em] text-ink">γ : [0, 1] → ℝ²</span>.
              Not its picture, not its image — the <em>function</em>. Three layers of "same": same
              image (loosest), same up to monotone reparametrization (geometric), equal as functions
              (strictest).
            </>
          ),
          ko: (
            <>
              함수 <span className="font-mono text-[0.95em] text-ink">γ : [0, 1] → ℝ²</span>. 그림도
              상도 아니다 — <em>함수</em>다. "같다"의 세 층: 같은 상 (가장 약함), 단조 재매개화 동치
              (기하학적), 함수로서 같음 (가장 엄격).
            </>
          ),
        }}
        appliesWhen={{
          en: (
            <>
              The question is <em>motion</em>, not just <em>shape</em>. Bezier curves (designer
              drags handles, computer evaluates γ(t)), trajectories (γ(t) = position at time t),
              animations (motion path is a parametrization, not the path image), arc-length
              integrals.
            </>
          ),
          ko: (
            <>
              질문이 <em>모양</em>이 아니라 <em>움직임</em>일 때. 베지에 곡선 (디자이너가 핸들을
              끌고 컴퓨터는 γ(t)를 계산), 궤적 (γ(t) = 시간 t에서의 위치), 애니메이션 (움직임 경로는
              그림이 아니라 매개변수화다), 호의 길이 적분.
            </>
          ),
        }}
        breaksWhen={{
          en: (
            <>
              If only the picture matters — drawing on paper, fitting an outline — the function
              machinery is overkill; point-set geometry suffices. The distinction also leaks: "is
              this the same curve?" has no clean answer until you say{" "}
              <em>which of the three layers</em> you mean.
            </>
          ),
          ko: (
            <>
              그림만 필요할 때 — 종이에 그리기, 윤곽 맞추기 — 함수 기계는 과잉이다. 점들의
              집합론으로 충분. 또 새는 곳: "같은 곡선이냐?"는 <em>세 층 중 어느 것</em>을 묻는지
              정해지기 전에는 답이 없다.
            </>
          ),
        }}
      />
      <SameCurve />
      <Arc />
      <Exercises />
      <Glossary />
      <PageFooter />
    </TermsProvider>
  );
}
