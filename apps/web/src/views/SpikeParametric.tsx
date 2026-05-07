import { useEffect } from "react";
import { useApp, pick } from "../context/AppContext";
import { TermsProvider, useTermsRegistry } from "../context/TermsContext";
import { Term } from "../components/Term";
import { Exercise } from "../components/Exercise";
import { SameCurve } from "../components/widgets/SameCurve";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="breadcrumb">
      <Link to="/">{pick(language, "Lemma", "Lemma")}</Link>
      <span className="breadcrumb-sep">/</span>
      <span className="breadcrumb-current">
        {pick(language, "spike · parametric curves", "스파이크 · 매개변수 곡선")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="hook">
      <div className="kicker">
        {pick(language, "spike · definitional crisis", "스파이크 · 정의의 위기")}
      </div>
      <h1 className="hook-title">
        {pick(language, <>What is "the same curve"?</>, <>"같은 곡선"이란 무엇인가?</>)}
      </h1>
      <p className="hook-q">
        {pick(
          language,
          <>
            Drawing the parabola <span className="mono">y = x²</span> on a board, you'd say{" "}
            <em>this is a curve</em>. Below you'll see the same picture drawn three different ways —
            same paint, different motions. Which one is <b>the</b> curve? Pick an answer in your
            head before pressing play. Then play.
          </>,
          <>
            칠판에 <span className="mono">y = x²</span>를 그리면 당신은 <em>이것이 곡선이다</em>라고
            말한다. 아래에는 같은 그림이 세 가지 다른 방식으로 그려진다 — 페인트는 같고, 움직임은
            다르다. <b>그</b> 곡선은 어느 쪽인가? 재생을 누르기 전에 마음속으로 답을 정해두자. 그
            다음에 누른다.
          </>,
        )}
      </p>
      <p className="hook-tag">
        {pick(
          language,
          <>
            Not an external application. A spike — testing whether Lemma's grammar can carry a{" "}
            <em>definitional crisis</em> the way it carries Bitcoin Pizza or float underflow.
          </>,
          <>
            외부 응용이 아니다. 스파이크 — Lemma의 문법이 비트코인 피자나 float 언더플로우를 담는
            것과 같은 방식으로 <em>정의의 위기</em>를 담을 수 있는지 시험하는 자리.
          </>,
        )}
      </p>
    </section>
  );
}

function Arc() {
  const { language, mode } = useApp();
  return (
    <section className="arc">
      <div className="kicker">{pick(language, "the arc", "흐름")}</div>

      <div className="arc-row">
        <div className="arc-num">1</div>
        <div>
          <h3>{pick(language, "γ is a function, not a shape", "γ는 함수다, 모양이 아니다")}</h3>
          <p>
            {pick(
              language,
              <>
                A <Term id="parametrized-curve">parametrized curve</Term> is a function{" "}
                <span className="mono">γ : [0, 1] → ℝ²</span>. The three γ above are three{" "}
                <em>different</em> functions. They happen to share an{" "}
                <Term id="image-of-curve">image</Term> — the set{" "}
                <span className="mono">{"{γ(t) : t ∈ [0, 1]}"}</span>, which is the parabola{" "}
                <span className="mono">y = x²</span> on <span className="mono">x ∈ [−1, 1]</span> —
                but the image is a <em>set of points</em>, stripped of order, speed, and visit
                count. The function γ is none of those things. Two parametrized curves are equal
                when <span className="mono">γ₁(t) = γ₂(t)</span> for every t — the same equality
                you'd use for any other function. By <em>that</em> test, the three γ above are three
                different curves that happen to leave the same shadow. But functional equality is
                only the strictest of three layers; the next step locates where the line should
                actually be drawn.
              </>,
              <>
                <em>
                  (어휘 약속: 이 글에서 "곡선"은 매개변수 곡선 — 함수 — 을 가리키고, 점들의 집합은
                  "상"이라 부른다. 한국어 일상어에서는 "곡선"이 두 의미를 다 받는데, 그 한 단어에 두
                  대상이 들어가 있다는 사실 자체가 이 페이지의 출발점이다.)
                </em>{" "}
                <Term id="parametrized-curve">매개변수 곡선</Term>은 함수{" "}
                <span className="mono">γ : [0, 1] → ℝ²</span>이다. 위의 세 γ는 세 개의{" "}
                <em>서로 다른</em> 함수다. 그들은 우연히 같은 <Term id="image-of-curve">상</Term> —
                집합 <span className="mono">{"{γ(t) : t ∈ [0, 1]}"}</span>, 즉 포물선{" "}
                <span className="mono">y = x²</span>의 <span className="mono">x ∈ [−1, 1]</span>{" "}
                구간 — 을 공유할 뿐이다. 그 상은 순서·속도·방문 횟수가 모두 빠진{" "}
                <em>점들의 집합</em>이다. 함수 γ는 그 어느 것도 아니다. 두 매개변수 곡선이 같다는
                것은 모든 t에 대해 <span className="mono">γ₁(t) = γ₂(t)</span>라는 뜻이다 — 다른
                어떤 함수에서나 쓰는 같은 등식 판정. <em>그</em> 기준으로 보면 위의 셋은 단지 같은
                그림자를 남길 뿐인 세 개의 다른 곡선이다. 하지만 함수 동등성은 세 층 중 가장
                strict한 한 층일 뿐이고, 다음 단계에서 그 선이 실제로 어디에 그어져야 하는지 본다.
              </>,
            )}
          </p>
          {mode === "code" && (
            <pre className="code">{`# γ is a function. Equality is functional equality.
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
        </div>
      </div>

      <div className="arc-row">
        <div className="arc-num">2</div>
        <div>
          <h3>
            {pick(
              language,
              "Same image, but is it the same curve?",
              "같은 상이라도 같은 곡선인가?",
            )}
          </h3>
          <p>
            {pick(
              language,
              <>
                Step 1's strict test separates γ₁ from γ₂ even though they paint the same picture in
                the same direction at different paces. That feels too strict — geometrically they
                ought to be the same. Differential geometry agrees: it identifies γ with{" "}
                <span className="mono">γ ∘ φ</span> whenever <Term id="reparametrization">φ</Term>{" "}
                is a monotone bijection <span className="mono">[0, 1] → [0, 1]</span>. With{" "}
                <span className="mono">φ(u) = ((2u−1)³ + 1) / 2</span> (monotone since{" "}
                <span className="mono">dφ/du = 3(2u−1)² ≥ 0</span>), one checks{" "}
                <span className="mono">γ₁ ∘ φ = γ₂</span> exactly: γ₁ and γ₂ are the same curve at
                different paces. γ₃ has no such partner — it visits each interior image point twice,
                and no monotone φ can take a once-visit schedule to a twice-visit one. So between
                strict equality (too tight) and image equality (too loose) sits{" "}
                <Term id="reparametrization">reparametrization</Term> equivalence — and that is what
                most working mathematicians mean by "the same curve."
              </>,
              <>
                § 1의 strict한 테스트는 γ₁과 γ₂를 서로 다른 곡선으로 분리한다. 같은 그림을 같은
                방향으로, 속도만 다르게 그리는데도. 그건 너무 빡빡하게 느껴진다 — 기하학적으로는
                같다고 말해야 한다. 미분기하학은 그렇게 말한다: 단조 일대일 함수{" "}
                <Term id="reparametrization">φ</Term> :{" "}
                <span className="mono">[0, 1] → [0, 1]</span>가 있을 때 γ와{" "}
                <span className="mono">γ ∘ φ</span>를 같다고 본다.{" "}
                <span className="mono">φ(u) = ((2u−1)³ + 1) / 2</span> (단조,{" "}
                <span className="mono">dφ/du = 3(2u−1)² ≥ 0</span>)로 두면{" "}
                <span className="mono">γ₁ ∘ φ = γ₂</span>가 정확히 성립한다 — γ₁과 γ₂는 같은
                곡선이고, 페이스만 다른 것. γ₃에는 그런 짝이 없다 — 내부 점을 두 번 방문하는데, 단조
                φ로는 한 번 방문 스케줄을 두 번 방문 스케줄로 옮길 수 없기 때문이다. strict 등식
                (너무 빡빡)과 image 등식 (너무 헐거움) 사이에{" "}
                <Term id="reparametrization">재매개화</Term> 동치가 있고, 대부분의 수학자가 "같은
                곡선"이라 부르는 게 그것이다.
              </>,
            )}
          </p>
          {mode === "code" && (
            <pre className="code">{`import numpy as np

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
        </div>
      </div>

      <div className="arc-pin">
        {pick(
          language,
          <>
            <b>Three layers of "same":</b>
            <ul style={{ margin: "0.5em 0 0.6em 1.3em", padding: 0 }}>
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
            <ul style={{ margin: "0.5em 0 0.6em 1.3em", padding: 0 }}>
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
            그림은 가장 약한 층, 함수는 가장 strict. <b>기하학은 그 사이에 산다.</b> 학교 수학은 세
            층을 <em>곡선</em>이라는 한 단어 안에 섞어 둔다. "같은 곡선인가?"라는 질문에 깔끔한 답이
            없는 건 바로 그 단어가 셋을 한꺼번에 짊어지고 있어서다. 위에서 가지고 논 위젯 하나가 세
            층을 한 그림에 담고 있다.
          </>,
        )}
      </div>
    </section>
  );
}

function Exercises() {
  const { language } = useApp();
  return (
    <section className="exercises">
      <div className="kicker">
        {pick(language, "exercises · 손으로 풀기", "exercises · 손으로 풀기")}
      </div>

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
              γ₂를 재생하고 트레일을 보라. 점들이 <em>가장 빽빽이</em> 모이는 지점은 원점 근처인가,
              끝점 근처인가? 왜 그런가? (트레일은 시간 간격이 일정하다 — 호 길이가 아니라.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Densest <em>at the origin</em>. With <span className="mono">x(u) = (2u−1)³</span>, the
              speed <span className="mono">dx/du = 6(2u−1)²</span> vanishes at{" "}
              <span className="mono">u = 1/2</span> — γ₂ crawls through the origin and sprints
              through the endpoints. Equal time steps spend most of their time near the slow point,
              so trail dots pile up there. The image is the same parabola; only the schedule
              differs.
            </>
          ),
          ko: (
            <>
              <em>원점에서</em> 가장 빽빽하다. <span className="mono">x(u) = (2u−1)³</span>이면 속도{" "}
              <span className="mono">dx/du = 6(2u−1)²</span>는 <span className="mono">u = 1/2</span>
              에서 0이 된다 — γ₂는 원점을 기어가고 끝에서 질주한다. 일정한 시간 간격은 느린 지점에서
              더 많은 시간을 쓰므로 점이 거기에 쌓인다. 상(image)은 같은 포물선이고, 스케줄만 다를
              뿐.
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
              Write a γ : [0, 1] → ℝ² whose image is exactly <span className="mono">y = x²</span> on{" "}
              <span className="mono">x ∈ [−1, 1]</span>, but which traces that parabola{" "}
              <em>three times</em> as t goes 0 → 1. Give a closed-form expression. (Hint: the round
              trip γ₃ traces it twice using cosine.)
            </>
          ),
          ko: (
            <>
              상이 정확히 <span className="mono">y = x²</span>의{" "}
              <span className="mono">x ∈ [−1, 1]</span> 구간이고, t가 0 → 1로 갈 때 그 포물선을{" "}
              <em>세 번</em> 훑는 γ : [0, 1] → ℝ²를 닫힌 식으로 써라. (힌트: γ₃은 코사인을 써서 두
              번 훑는다.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              One choice: <span className="mono">γ(t) = (cos(3πt), cos²(3πt))</span>. As t runs 0 →
              1, the argument <span className="mono">3πt</span> sweeps{" "}
              <span className="mono">[0, 3π]</span>; cosine completes one and a half full periods,
              traversing <span className="mono">[−1, 1]</span> three times. Image: the parabola{" "}
              <span className="mono">y = x²</span> on <span className="mono">[−1, 1]</span>. Same
              shadow, triple-pace schedule. The image cannot tell this trip apart from γ₁'s single
              one.
            </>
          ),
          ko: (
            <>
              한 예: <span className="mono">γ(t) = (cos(3πt), cos²(3πt))</span>. t가 0 → 1로 가면
              인자 <span className="mono">3πt</span>는 <span className="mono">[0, 3π]</span>를 훑고,
              코사인은 한 주기 반을 돌아 <span className="mono">[−1, 1]</span>을 세 번 지나간다.
              상은 <span className="mono">[−1, 1]</span> 위의 포물선{" "}
              <span className="mono">y = x²</span>. 같은 그림자, 세 배 속의 스케줄. 상은 이 여정을
              γ₁의 한 번짜리 여정과 구별할 수 없다.
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
              주니어가 말한다: "출력이 같은 두 함수는 같은 함수다 — 외연적 동등성. 같은 상을
              만들어내는 세 γ는 같은 곡선이어야 한다." 한 문장으로 버그를 짚어라. 그리고 매개변수
              곡선의 올바른 등식 판정을 적어라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              The bug: extensional equality of γ compares <span className="mono">γ(t)</span> at
              every t, not <span className="mono">{"{γ(t) : t}"}</span> as a set; the junior swapped
              the function for its image. Correct test:{" "}
              <span className="formula-inline">γ₁ = γ₂ ⇔ γ₁(t) = γ₂(t) for all t</span>. Two γ with
              the same image are equal iff the schedule also matches, point by point.
            </>
          ),
          ko: (
            <>
              버그: γ의 외연적 동등성은 모든 t에서 <span className="mono">γ(t)</span>를 비교하는
              것이지, <span className="mono">{"{γ(t) : t}"}</span>를 집합으로 비교하는 게 아니다 —
              주니어는 함수를 그 상으로 바꿔치기했다. 올바른 판정:{" "}
              <span className="formula-inline">γ₁ = γ₂ ⇔ 모든 t에 대해 γ₁(t) = γ₂(t)</span>. 같은
              상을 가진 두 γ는 스케줄까지 점마다 일치할 때만 같다.
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
    <section className="glossary">
      <div className="kicker">
        {pick(
          language,
          `glossary · used on this page · ${visible.length}`,
          `용어집 · 이 페이지에서 쓰임 · ${visible.length}`,
        )}
      </div>
      <div className="glossary-grid">
        {visible.map((g) => {
          const en = g.locales.en;
          const ko = g.locales.ko;
          const view = g.locales[language] ?? en;
          return (
            <div className="glossary-item" key={g.id}>
              <div className="glossary-head">
                <span className="glossary-en">{en?.term ?? g.id}</span>
                <span className="glossary-sep">·</span>
                <span className="glossary-ko">{ko?.term ?? g.id}</span>
              </div>
              <div className="glossary-body">{view?.body}</div>
              {view?.flag && <div className="glossary-flag">⚠ {view.flag}</div>}
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
    <footer className="footer">
      <div>
        {pick(
          language,
          <>
            <b>Spike, not a published module.</b> The bar this is testing: can Lemma's grammar —
            hook, widget, arc, pin, exercises, glossary — carry a definitional crisis instead of an
            external application? If yes, this becomes{" "}
            <span className="mono">modules/parametric-curves</span> and consumers (graphics
            rendering, physical trajectories) plug in later.
          </>,
          <>
            <b>스파이크일 뿐, 공개 모듈이 아니다.</b> 시험 중인 기준: Lemma의 문법 —
            도입·위젯·흐름·핀·연습문제·용어집 — 이 외부 응용이 아니라 정의의 위기를 담아낼 수
            있는가? 가능하다면 이건 <span className="mono">modules/parametric-curves</span>가 되고,
            소비처(그래픽 렌더링, 물리 궤적)는 나중에 붙는다.
          </>,
        )}
      </div>
      <div className="footer-license">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function SpikeParametric() {
  useEffect(() => {
    document.title = "Spike — Parametric Curves · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <SameCurve />
      <Arc />
      <Exercises />
      <Glossary />
      <PageFooter />
    </TermsProvider>
  );
}
