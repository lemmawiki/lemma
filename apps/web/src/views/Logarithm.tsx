import { useEffect } from "react";
import { useApp, pick } from "../context/AppContext";
import { TermsProvider, useTermsRegistry } from "../context/TermsContext";
import { Term } from "../components/Term";
import { Exercise } from "../components/Exercise";
import { TwoStacks } from "../components/widgets/TwoStacks";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="breadcrumb">
      <Link to="/">{pick(language, "Lemma", "Lemma")}</Link>
      <span className="breadcrumb-sep">/</span>
      <span className="breadcrumb-current">
        {pick(language, "module · the logarithm", "모듈 · 로그")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="hook">
      <div className="kicker">{pick(language, "the hook · ×→+", "도입 · ×→+")}</div>
      <h1 className="hook-title">
        {pick(
          language,
          <>Engineers carried wooden rulers until 1972.</>,
          <>엔지니어들은 1972년까지 나무 자를 들고 다녔다.</>,
        )}
      </h1>
      <p className="hook-q">
        {pick(
          language,
          <>
            They used them to multiply by <em>adding</em> — sliding two log-spaced scales past each
            other, reading the product off the meeting point. The trick was 400 years old by then
            and is still the trick: <span className="mono">log(a·b) = log(a) + log(b)</span>. The
            same one-line identity is why a modern language model can train at all. Multiply twenty
            probabilities of <span className="mono">0.1</span> in{" "}
            <Term id="float32">
              <span className="mono">float32</span>
            </Term>{" "}
            and the result rounds silently to zero — every <Term id="gradient">gradient</Term> that
            touched it dies with it. <Term id="pytorch">PyTorch</Term> never multiplies them. It
            calls{" "}
            <Term id="log-softmax">
              <span className="mono">log_softmax</span>
            </Term>{" "}
            and <em>adds</em> twenty negative numbers. The model trains because somebody decided to
            live in log-space.
          </>,
          <>
            그 자로 곱셈을 <em>덧셈</em>으로 했다 — 로그 간격으로 눈금이 새겨진 두 자를 서로
            미끄러뜨려, 만나는 자리에서 곱을 읽는 식이었다. 그 트릭은 1972년에 이미 400년이 지나
            있었고, 지금도 같은 트릭이다: <span className="mono">log(a·b) = log(a) + log(b)</span>.
            현대 언어 모델이 학습된다는 사실도 이 한 줄에서 나온다.{" "}
            <Term id="float32">
              <span className="mono">float32</span>
            </Term>
            에서 확률 <span className="mono">0.1</span>을 스무 번 곱하면 결과는 조용히 0으로
            떨어지고, 그 값에 닿았던 모든 <Term id="gradient">그래디언트</Term>가 함께 죽는다.{" "}
            <Term id="pytorch">PyTorch</Term>는 절대 그것들을 곱하지 않는다.{" "}
            <Term id="log-softmax">
              <span className="mono">log_softmax</span>
            </Term>{" "}
            를 호출해 음수 스무 개를 <em>더한다</em>. 모델이 학습되는 건, 누군가가 로그 공간에
            살기로 결정했기 때문이다.
          </>,
        )}
      </p>
      <p className="hook-tag">
        {pick(
          language,
          <>The whole module is one equation. Everything else is consequence.</>,
          <>모듈 전체가 한 방정식이다. 나머지는 따름정리.</>,
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
          <h3>{pick(language, "The identity that does all the work", "모든 일을 하는 항등식")}</h3>
          <p>
            {pick(
              language,
              <>
                Log is defined by one rule: <span className="mono">log(a·b) = log(a) + log(b)</span>
                . Pick any base. The rule is the same. Every other property falls out of that line.{" "}
                <span className="mono">log(a/b) = log(a) − log(b)</span>: take the rule, replace b
                with 1/b, done. <span className="mono">log(aⁿ) = n·log(a)</span>: apply the rule n
                times to <span className="mono">a · a · … · a</span>.{" "}
                <span className="mono">log(1) = 0</span>: from{" "}
                <span className="mono">log(1·a) = log(1) + log(a)</span>. There is no fourth rule
                because there is no fourth way to combine multiplications. Practically: the{" "}
                <Term id="logarithm">log</Term> of a number tells you{" "}
                <em>how many factors of the base it is built from</em>.{" "}
                <span className="mono">log₁₀(1000) = 3</span> because 1000 is three tens,
                multiplied. Counting factors. That's it.
              </>,
              <>
                로그는 한 줄로 정의된다: <span className="mono">log(a·b) = log(a) + log(b)</span>.
                밑은 뭐든 좋다. 규칙은 같다. 다른 모든 성질이 이 한 줄에서 떨어져 나온다.{" "}
                <span className="mono">log(a/b) = log(a) − log(b)</span>: 규칙에서 b를 1/b로 바꾸면
                끝. <span className="mono">log(aⁿ) = n·log(a)</span>: 규칙을{" "}
                <span className="mono">a · a · … · a</span>에 n번 적용.{" "}
                <span className="mono">log(1) = 0</span>:{" "}
                <span className="mono">log(1·a) = log(1) + log(a)</span>에서. 네 번째 규칙은 없다 —
                곱셈을 묶는 네 번째 방법이 없기 때문이다. 실용적으로 보면:{" "}
                <Term id="logarithm">로그</Term>는 어떤 수가 <em>밑을 몇 번 곱해 만든 것인지</em>를
                알려준다. <span className="mono">log₁₀(1000) = 3</span>인 건 1000이 10을 세 번 곱한
                수이기 때문. 곱한 횟수를 센다. 그게 전부다.
              </>,
            )}
          </p>
          {mode === "code" && (
            <pre className="code">{`import math

# every log law from one identity:
math.log10(2 * 50)              # ≈ math.log10(2) + math.log10(50)
math.log10(2 ** 10)             # ≈ 10 * math.log10(2)
math.log10(1)                   # 0.0`}</pre>
          )}
        </div>
      </div>

      <div className="arc-row">
        <div className="arc-num">2</div>
        <div>
          <h3>
            {pick(
              language,
              "Napier and the slide rule (×→+ embodied)",
              "네이피어와 계산자 (×→+ 의 화신)",
            )}
          </h3>
          <p>
            {pick(
              language,
              <>
                John Napier published the first log tables in 1614 because astronomers were dying
                inside, multiplying nine-digit numbers by hand to predict eclipses. His tables let
                them <em>look up</em> <span className="mono">log(a)</span> and{" "}
                <span className="mono">log(b)</span>, <em>add</em> the two, and <em>look up</em>{" "}
                what number had that log — the answer to <span className="mono">a·b</span> with no
                multiplication anywhere. Three centuries later, every engineer carried a{" "}
                <Term id="slide-rule">slide rule</Term>: a wooden ruler with two log-spaced scales
                that <em>slid past each other</em>. Aligning <b>2</b> on one against <b>3</b> on the
                other physically performed <span className="mono">log(2) + log(3)</span> and showed{" "}
                <b>6</b> at the meeting point.{" "}
                <b>The slide rule is the identity from § 1, made into furniture.</b> Apollo got to
                the moon on these.
              </>,
              <>
                1614년, 존 네이피어가 첫 로그 표를 출판했다. 일식을 예측하려고 9자리 수를 손으로
                곱하다 속이 타들어 가던 천문학자들의 시대였다. 표를 펴서{" "}
                <span className="mono">log(a)</span>와 <span className="mono">log(b)</span>를{" "}
                <em>찾고</em>, 둘을 <em>더하고</em>, 그 합이 로그값인 수를 다시 <em>찾으면</em> —
                곱셈 한 번 없이 <span className="mono">a·b</span>가 나왔다. 300년 뒤, 모든
                엔지니어가 <Term id="slide-rule">계산자</Term>를 들고 다녔다. 두 개의 로그 눈금이
                서로 <em>미끄러지는</em> 나무 자. 한쪽의 <b>2</b>와 다른 쪽의 <b>3</b>을 맞추면
                물리적으로 <span className="mono">log(2) + log(3)</span>이 수행됐고, 만나는 자리에{" "}
                <b>6</b>이 찍혔다. <b>계산자는 § 1의 항등식을 도구로 깎아 만든 물건이다.</b>{" "}
                아폴로는 이걸로 달에 갔다.
              </>,
            )}
          </p>
        </div>
      </div>

      <div className="arc-row">
        <div className="arc-num">3</div>
        <div>
          <h3>
            {pick(
              language,
              "Underflow — and why log-space saves your model",
              "언더플로우 — 그리고 로그 공간이 모델을 살리는 이유",
            )}
          </h3>
          <p>
            {pick(
              language,
              <>
                A{" "}
                <Term id="float32">
                  <span className="mono">float32</span>
                </Term>{" "}
                can hold numbers down to about <span className="mono">10⁻³⁸</span>. Multiply forty
                probabilities of <span className="mono">0.1</span> and you've crossed it — the
                result rounds to zero, silently. No exception. No warning. Every{" "}
                <Term id="gradient">gradient</Term> that depended on it dies with it. This isn't a
                numerical-analysis curiosity; it's why every deep-learning library reports loss as a{" "}
                <em>sum</em>, not a product. The fix is the identity from § 1, applied mechanically:
                take logs the moment a product would otherwise form.{" "}
                <span className="mono">log(p₁·p₂·…·pₙ) = Σ log(pᵢ)</span>. Each{" "}
                <span className="mono">log(pᵢ)</span> is a comfortable negative number; their sum is
                a comfortable larger negative number. No <Term id="underflow">underflow</Term> can
                reach you. This is what <Term id="log-likelihood">log-likelihood</Term> is doing,
                and what{" "}
                <Term id="log-softmax">
                  <span className="mono">log_softmax</span>
                </Term>{" "}
                was built to do. Live in log-space; sums replace products; floats stop lying.
              </>,
              <>
                <Term id="float32">
                  <span className="mono">float32</span>
                </Term>
                는 약 <span className="mono">10⁻³⁸</span>까지만 표현한다. 확률{" "}
                <span className="mono">0.1</span>을 마흔 번 곱하면 이미 그 아래로 — 결과는 조용히
                0으로 반올림된다. 예외도, 경고도 없다. 거기 의존하던 모든{" "}
                <Term id="gradient">그래디언트</Term>가 함께 죽는다. 수치해석의 흥밋거리가 아니다.
                모든 딥러닝 라이브러리가 손실을 <em>곱</em>이 아니라 <em>합</em>으로 보고하는
                이유다. 해법은 § 1의 항등식을 기계적으로 적용하는 것: 곱이 만들어지기 직전에 로그를
                씌운다. <span className="mono">log(p₁·p₂·…·pₙ) = Σ log(pᵢ)</span>. 각각의{" "}
                <span className="mono">log(pᵢ)</span>는 다루기 편한 음수, 그 합은 다루기 편한 더 큰
                음수. <Term id="underflow">언더플로우</Term>가 닿을 수 없다.{" "}
                <Term id="log-likelihood">로그우도</Term>가 하는 일이고,{" "}
                <Term id="log-softmax">
                  <span className="mono">log_softmax</span>
                </Term>{" "}
                가 만들어진 이유다. 로그 공간에 살면 곱은 합이 되고, float는 거짓말을 멈춘다.
              </>,
            )}
          </p>
          {mode === "code" && (
            <pre className="code">{`import numpy as np

# Naive: multiply 40 probabilities. Underflows in float32.
p = np.float32(0.1)
np.prod([p] * 40)               # → 0.0  (silent death)

# Log-space: add 40 log-probabilities. Survives.
np.sum(np.log([p] * 40))        # → -92.10  (well-defined)`}</pre>
          )}
        </div>
      </div>

      <div className="arc-row">
        <div className="arc-num">4</div>
        <div>
          <h3>{pick(language, "Back to the application", "다시 응용으로")}</h3>
          <p>
            {pick(
              language,
              <>
                This module is <em>consumed</em> by{" "}
                <Link to="/finance/bitcoin-pizza">the Bitcoin Pizza</Link>. There you're asked to
                compute <span className="mono">10⁹ · 2.89²⁰</span> by hand. You can't, until you
                take <span className="mono">log₁₀</span> of both sides — and then you're adding{" "}
                <span className="mono">9 + 20·log₁₀(2.89)</span>, two numbers a human can manage.
                That hand-computation is only possible because of the identity in § 1. Same trick as
                Napier's, same trick as{" "}
                <Term id="log-softmax">
                  <span className="mono">log_softmax</span>
                </Term>
                . Different decade, different stakes, identical mechanism.
              </>,
              <>
                이 모듈은 <Link to="/finance/bitcoin-pizza">비트코인 피자</Link>에서 쓰인다.
                거기서는 <span className="mono">10⁹ · 2.89²⁰</span>을 손으로 계산하라고 한다. 양변에{" "}
                <span className="mono">log₁₀</span>을 씌우기 전에는 불가능하지만, 씌우는 순간{" "}
                <span className="mono">9 + 20·log₁₀(2.89)</span> — 사람이 다룰 수 있는 두 수의
                덧셈이 된다. 그 손계산이 가능한 건 § 1의 항등식 덕분이다. 네이피어의 트릭과 같고,{" "}
                <Term id="log-softmax">
                  <span className="mono">log_softmax</span>
                </Term>
                의 트릭과 같다. 시대도 판돈도 다르지만, 메커니즘은 동일하다.
              </>,
            )}
          </p>
        </div>
      </div>

      <div className="arc-pin">
        {pick(
          language,
          <>
            <b>log(a·b) = log(a) + log(b).</b> The whole module. Everything else — the digit-count
            rule, the <Term id="slide-rule">slide rule</Term>,{" "}
            <Term id="log-likelihood">log-likelihood</Term>, hand-computing $10⁹ × 2.89²⁰ — is a
            corollary.
          </>,
          <>
            <b>log(a·b) = log(a) + log(b).</b> 모듈 전체. 나머지 — 자릿수 규칙,{" "}
            <Term id="slide-rule">계산자</Term>, <Term id="log-likelihood">로그우도</Term>, $10⁹ ×
            2.89²⁰ 손계산 — 은 따름정리.
          </>,
        )}
      </div>
    </section>
  );
}

function Exercises() {
  return (
    <section className="exercises">
      <div className="kicker">exercises · 손으로 풀기</div>

      <Exercise
        number={1}
        tag={{ en: "read the graph", ko: "그래프 읽기" }}
        prompt={{
          en: (
            <>
              On the Two Stacks widget, set <b>a = 4</b>. What value of <b>b</b> makes <b>a·b</b>{" "}
              land exactly on <b>100</b>? Read it off the log axis without computing.
            </>
          ),
          ko: (
            <>
              위젯에서 <b>a = 4</b>로 두자. <b>a·b</b>가 정확히 <b>100</b>에 떨어지게 하려면{" "}
              <b>b</b>는? 계산하지 말고 로그 축에서 읽어라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <b>b = 25</b>. log₁₀(4) ≈ 0.60; we need total log = 2; so log(b) = 1.40, i.e. b ≈ 25.
              Visually, the b handle ends up two-thirds of the way between 10 and 100.
            </>
          ),
          ko: (
            <>
              <b>b = 25</b>. log₁₀(4) ≈ 0.60이고, 합이 2가 되어야 하므로 log(b) = 1.40, 즉 b ≈ 25.
              시각적으로 b 핸들은 10과 100 사이의 약 2/3 지점에 놓인다.
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{
          en: "compute by hand · the digit rule",
          ko: "손으로 계산 · 자릿수 규칙",
        }}
        prompt={{
          en: (
            <>
              Without a calculator, give <b>log₁₀(2,000,000)</b> using only{" "}
              <span className="mono">log₁₀(2) ≈ 0.301</span>.
            </>
          ),
          ko: (
            <>
              계산기 없이, <span className="mono">log₁₀(2) ≈ 0.301</span>만 사용해서{" "}
              <b>log₁₀(2,000,000)</b>을 구하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              log₁₀(2 · 10⁶) = log₁₀(2) + log₁₀(10⁶) = 0.301 + 6 = <b>6.301</b>. The whole exercise
              is the identity from § 1: a product becomes a sum. Memorize log₁₀(2) ≈ 0.301; with
              that one number you can ballpark the log of any number with two digits of precision.
            </>
          ),
          ko: (
            <>
              log₁₀(2 · 10⁶) = log₁₀(2) + log₁₀(10⁶) = 0.301 + 6 = <b>6.301</b>. 문제 전체가 § 1의
              항등식 — 곱이 합으로 바뀐다. log₁₀(2) ≈ 0.301만 외워 두면, 그 하나로 거의 모든 수의
              로그를 두 자리 정밀도로 어림할 수 있다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{
          en: "write the equation · sequence probability",
          ko: "식 세우기 · 시퀀스 확률",
        }}
        prompt={{
          en: (
            <>
              You evaluate a 50-token sequence; each token has probability ~<b>0.05</b>. Write the
              formula your code should compute, <em>and</em> the formula it should <em>avoid</em>.
              Use <span className="mono">log(0.05) ≈ −3.00</span>.
            </>
          ),
          ko: (
            <>
              50토큰 시퀀스를 평가한다. 각 토큰의 확률은 ~<b>0.05</b>. 코드가 <em>계산해야 할</em>{" "}
              식과 <em>피해야 할</em> 식을 각각 써라.{" "}
              <span className="mono">log(0.05) ≈ −3.00</span> 사용.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <em>Avoid</em>: P = 0.05⁵⁰ ≈ <span className="mono">10⁻⁶⁵</span> — zero in float32,
              almost zero in float64. <em>Compute</em>: log P = 50·log(0.05) ≈ 50·(−3.00) ={" "}
              <b>−150</b>. The product is the same number; the sum is the only one your computer can
              hold.
            </>
          ),
          ko: (
            <>
              <em>피해야 할 식</em>: P = 0.05⁵⁰ ≈ <span className="mono">10⁻⁶⁵</span> — float32에서
              0, float64에서도 사실상 0. <em>계산해야 할 식</em>: log P = 50·log(0.05) ≈ 50·(−3.00)
              = <b>−150</b>. 같은 수다. 다만 컴퓨터 안에 담을 수 있는 건 합 쪽뿐이다.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        noCalculator
        tag={{
          en: "compute by hand · Stirling on a napkin",
          ko: "손으로 계산 · 냅킨 한 장에 스털링",
        }}
        prompt={{
          en: (
            <>
              <Term id="stirling-approximation">Stirling</Term>:{" "}
              <span className="mono">log₁₀(n!) ≈ n·log₁₀(n) − n·log₁₀(e)</span>, with{" "}
              <span className="mono">log₁₀(e) ≈ 0.434</span>. Estimate <b>log₁₀(100!)</b>.{" "}
              <em>How many digits</em> does 100! have?
            </>
          ),
          ko: (
            <>
              <Term id="stirling-approximation">스털링</Term>:{" "}
              <span className="mono">log₁₀(n!) ≈ n·log₁₀(n) − n·log₁₀(e)</span>,{" "}
              <span className="mono">log₁₀(e) ≈ 0.434</span>. <b>log₁₀(100!)</b> 추정, 그리고 100!의{" "}
              <em>자릿수</em>는?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              100·log₁₀(100) − 100·0.434 = 100·2 − 43.4 = <b>156.6</b>. So 100! has about{" "}
              <b>158 digits</b> (true: 158). You estimated a 158-digit number using arithmetic that
              fits on a napkin. <em>That is what log is for.</em>
            </>
          ),
          ko: (
            <>
              100·log₁₀(100) − 100·0.434 = 200 − 43.4 = <b>156.6</b>. 따라서 100!의 자릿수는 약{" "}
              <b>158자리</b> (실제: 158). 158자리 수를 종이 귀퉁이 산수로 추정한 셈이다.{" "}
              <em>로그는 바로 이런 일을 하라고 있는 것이다.</em>
            </>
          ),
        }}
      />

      <Exercise
        number={5}
        tag={{
          en: "read the graph · equal log-distance = equal ratio",
          ko: "그래프 읽기 · 같은 로그 거리 = 같은 비율",
        }}
        prompt={{
          en: (
            <>
              On Two Stacks, drag <b>a</b> and <b>b</b> so that the gap log(b) − log(a) is exactly
              the gap from log(1) to log(10). What does <b>b/a</b> always equal, regardless of where
              you placed them?
            </>
          ),
          ko: (
            <>
              위젯에서, log(b) − log(a)의 거리가 log(1)부터 log(10)까지의 거리와 같도록 두 핸들을
              두면, 위치와 상관없이 <b>b/a</b>는 항상 얼마인가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <b>b/a = 10</b>. Equal log-distance ⇒ equal <em>ratio</em>, not equal{" "}
              <em>difference</em>. This is why an exponential curve becomes a straight line on a log
              axis (see <Link to="/finance/bitcoin-pizza">the Bitcoin Pizza chart</Link>): a
              constant rate is a constant log-distance per unit time.
            </>
          ),
          ko: (
            <>
              <b>b/a = 10</b>. 같은 로그 거리 ⇒ 같은 <em>비율</em>이지, 같은 <em>차</em>가 아니다.
              지수 곡선이 로그 축에서 직선이 되는 이유다 (
              <Link to="/finance/bitcoin-pizza">비트코인 피자 차트</Link> 참조). 일정한 이율은 곧
              단위 시간당 일정한 로그 거리.
            </>
          ),
        }}
      />

      <Exercise
        number={6}
        tag={{
          en: "write the equation · logsumexp",
          ko: "식 세우기 · logsumexp",
        }}
        prompt={{
          en: (
            <>
              You're given two probabilities p and q, but you only know{" "}
              <span className="mono">log p</span> and <span className="mono">log q</span> (not p, q
              themselves — they'd underflow). Derive a numerically stable expression for{" "}
              <span className="mono">log(p + q)</span>. (This is the{" "}
              <Term id="logsumexp">
                <em>logsumexp</em>
              </Term>{" "}
              trick.)
            </>
          ),
          ko: (
            <>
              두 확률 p, q가 있다. 단, <span className="mono">log p</span>와{" "}
              <span className="mono">log q</span>만 안다 (p, q 자체는 언더플로우).{" "}
              <span className="mono">log(p + q)</span>의 수치적으로 안정한 식을 유도하라. (
              <Term id="logsumexp">
                <em>logsumexp</em>
              </Term>{" "}
              트릭이다.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Let <span className="mono">M = max(log p, log q)</span>. Factor:{" "}
              <span className="mono">log(p + q) = M + log(e^(log p − M) + e^(log q − M))</span>.
              Both inner exponents are ≤ 0, so their exponentials are ≤ 1 — no overflow, no
              underflow. This is <em>the</em> function in every ML library:{" "}
              <span className="mono">torch.logsumexp</span>,{" "}
              <span className="mono">scipy.special.logsumexp</span>. Same identity from § 1, used
              backwards.
            </>
          ),
          ko: (
            <>
              <span className="mono">M = max(log p, log q)</span>로 두자. 인수분해하면:{" "}
              <span className="mono">log(p + q) = M + log(e^(log p − M) + e^(log q − M))</span>.
              안쪽 지수는 모두 ≤ 0이므로 지수값은 ≤ 1 — 오버플로우도 언더플로우도 일어나지 않는다.
              모든 ML 라이브러리에 있는 <em>그</em> 함수다:{" "}
              <span className="mono">torch.logsumexp</span>,{" "}
              <span className="mono">scipy.special.logsumexp</span>. § 1의 같은 항등식을 거꾸로 쓴
              것뿐이다.
            </>
          ),
        }}
      />

      <Exercise
        number={7}
        tag={{
          en: "the evil one · 'just multiply'",
          ko: "악마의 문제 · '그냥 곱하면 되잖아'",
        }}
        prompt={{
          en: (
            <>
              A junior says: "
              <Term id="log-softmax">
                <span className="mono">log_softmax</span>
              </Term>{" "}
              is just a perf optimization. Mathematically you could just multiply the probabilities
              — switch to float64 if you're worried." Write a <em>one-paragraph</em> rebuttal that
              holds for both{" "}
              <Term id="float32">
                <span className="mono">float32</span>
              </Term>{" "}
              and <span className="mono">float64</span>. Then state the single equation that makes
              log-space work.
            </>
          ),
          ko: (
            <>
              주니어가 말한다: "
              <Term id="log-softmax">
                <span className="mono">log_softmax</span>
              </Term>{" "}
              는 그냥 성능 최적화일 뿐이고, 수학적으로는 그냥 확률을 곱해도 된다. 걱정되면 float64
              쓰면 되잖아."{" "}
              <Term id="float32">
                <span className="mono">float32</span>
              </Term>
              와 <span className="mono">float64</span> 둘 다에 대해 통하는 반박을 한 단락으로 써라.
              그리고 로그 공간을 가능하게 만드는 단 하나의 방정식을 적어라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Wrong for both. <span className="mono">float32</span> underflows below{" "}
              <span className="mono">~10⁻³⁸</span>; <span className="mono">float64</span> below{" "}
              <span className="mono">~10⁻³⁰⁸</span>. A 1000-token sequence at p = 0.1 per token is
              10⁻¹⁰⁰⁰ — zero in <em>both</em>. The product literally does not exist in machine
              arithmetic; the sum-of-logs always does. The single equation:{" "}
              <span className="formula-inline">log(a·b) = log(a) + log(b)</span>.
            </>
          ),
          ko: (
            <>
              둘 다 틀렸다. <span className="mono">float32</span>는{" "}
              <span className="mono">~10⁻³⁸</span> 아래에서 언더플로우;{" "}
              <span className="mono">float64</span>는 <span className="mono">~10⁻³⁰⁸</span> 아래에서
              언더플로우. 1000토큰 시퀀스에서 토큰 확률이 p=0.1이면 곱은 10⁻¹⁰⁰⁰ —{" "}
              <em>두 형식 모두</em>에서 0이다. 곱은 기계 연산 안에 아예 존재하지 않는다. 로그의 합은
              언제나 존재한다. 단 하나의 방정식:{" "}
              <span className="formula-inline">log(a·b) = log(a) + log(b)</span>.
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
  const visible = used ? glossary.filter((g) => used.has(g.id)) : glossary;
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
            module: <b>The Logarithm</b>. Consumed by{" "}
            <Link to="/finance/bitcoin-pizza">Bitcoin Pizza</Link>. Future modules build on this
            one: log-likelihood + cross-entropy, decibels, half-life, information / entropy.
          </>,
          <>
            모듈: <b>로그</b>. 쓰이는 곳: <Link to="/finance/bitcoin-pizza">비트코인 피자</Link>. 이
            모듈 위에 올라설 다음 모듈들: 로그우도와 교차 엔트로피, 데시벨, 반감기, 정보·엔트로피.
          </>,
        )}
      </div>
      <div className="footer-license">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function Logarithm() {
  useEffect(() => {
    document.title = "Log · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <TwoStacks />
      <Arc />
      <Exercises />
      <Glossary />
      <PageFooter />
    </TermsProvider>
  );
}
