import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { ToolSpec } from "../components/meta";
import { DoublingLadder } from "../components/widgets/doubling-ladder";
import { TwoStacks } from "../components/widgets/two-stacks";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc1: string; arc4: string };

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
        {pick(language, "module · the logarithm", "모듈 · 로그")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · what's the exponent", "도입 · 지수가 몇이냐")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>How many times do you multiply 2 to get 1,024?</>,
          <>2를 몇 번 곱해야 1,024가 될까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            The answer is 10. That 10 is <span className={MONO}>log₂(1,024)</span>.{" "}
            <b>Log is the inverse of exponentiation — it pulls the exponent out of the result.</b>{" "}
            Most big numbers in nature are built from exponents: cells double, interest compounds,
            starlight dims as <span className={MONO}>1/r²</span>, sound spans twelve orders of
            magnitude. The result you see (1,024 cells, a 100× gain, magnitude-7.2) is rarely the
            natural parameter. The <em>exponent</em> (how many doublings, how many years) is. Log is
            the function that recovers it. You already use a special case —{" "}
            <span className={MONO}>log₁₀(1,000,000) = 6</span> because the number has six zeros. The
            everyday <em>digit count is the exponent for base 10</em>. Generalize the digit count to
            any base and you have the log. And because exponents add when their bases multiply, log
            turns multiplication into addition:{" "}
            <span className={MONO}>log(a·b) = log(a) + log(b)</span>. That one line drives the rest
            of this page.
          </>,
          <>
            답은 10. 그 10이 <span className={MONO}>log₂(1,024)</span>다.{" "}
            <b>로그는 거듭제곱의 역함수 — 결과에서 지수를 꺼낸다.</b> 자연의 큰 수는 거의 다 지수로
            만들어진다. 세포는 두 배가 되고, 이자는 복리로 쌓이고, 별빛은{" "}
            <span className={MONO}>1/r²</span>로 흐려지고, 소리는 열두 자릿수에 걸쳐 변한다. 우리가
            보는 <em>결과</em> (1,024개의 세포, 100배가 된 자산, 진도 7.2)는 자연이 쓰는 매개변수가
            아니다. <em>지수</em> (몇 번 두 배 됐나, 몇 년 굴렸나)가 매개변수다. 로그는 그것을
            꺼내주는 함수다. 이미 익숙한 특수 케이스가 있다 —{" "}
            <span className={MONO}>log₁₀(1,000,000) = 6</span>인 건 0이 6개라서. 일상의{" "}
            <em>자릿수가 밑 10에서의 지수</em>. 자릿수를 다른 밑으로 일반화하면 로그가 된다. 그리고
            지수는 밑이 곱해질 때 더해지므로, 로그는 곱셈을 덧셈으로 바꾼다:{" "}
            <span className={MONO}>log(a·b) = log(a) + log(b)</span>. 이 페이지의 나머지가 이 한
            줄에서 따라 나온다.
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            <b>log = what's the exponent.</b> Everything else —{" "}
            <span className={MONO}>log(a·b) = log(a) + log(b)</span>, slide rules, log-likelihood,
            digit-count estimates — is consequence.
          </>,
          <>
            <b>로그 = 지수가 몇이냐.</b> 나머지 —{" "}
            <span className={MONO}>log(a·b) = log(a) + log(b)</span>, 계산자, 로그우도, 자릿수 추정
            — 는 따름정리.
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

function Arc({ code }: { code: CodeMap }) {
  const { language, mode } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "the arc", "흐름")}</div>

      <ArcRow n={1}>
        <h3>{pick(language, "The identity that does all the work", "모든 일을 하는 항등식")}</h3>
        <p>
          {pick(
            language,
            <>
              Log is defined by one rule: <span className={MONO}>log(a·b) = log(a) + log(b)</span>.
              Pick any base. The rule is the same. (Context picks the base by convention:{" "}
              <span className={MONO}>log</span> means <Term id="common-log">log₁₀</Term> in
              engineering, <Term id="natural-log">ln</Term> in ML and statistics,{" "}
              <span className={MONO}>log₂</span> in algorithms — read by domain when the subscript
              is omitted.) Every other property falls out of that line.{" "}
              <span className={MONO}>log(a/b) = log(a) − log(b)</span>: take the rule, replace b
              with 1/b, done. <span className={MONO}>log(aⁿ) = n·log(a)</span>: apply the rule n
              times to <span className={MONO}>a · a · … · a</span>.{" "}
              <span className={MONO}>log(1) = 0</span>: from{" "}
              <span className={MONO}>log(1·a) = log(1) + log(a)</span>. There is no fourth rule
              because there is no fourth way to combine multiplications. Practically: the{" "}
              <Term id="logarithm">log</Term> of a number tells you{" "}
              <em>how many factors of the base it is built from</em>.{" "}
              <span className={MONO}>log₁₀(1000) = 3</span> because 1000 is three tens, multiplied.
              Counting factors. That's it.
            </>,
            <>
              로그는 한 줄로 정의된다: <span className={MONO}>log(a·b) = log(a) + log(b)</span>.
              밑은 뭐든 좋다. 규칙은 같다. (분야가 밑을 정한다: <span className={MONO}>log</span>는
              공학·고등학교에서는 <Term id="common-log">log₁₀</Term>, ML·통계에서는{" "}
              <Term id="natural-log">ln</Term>, 알고리즘에서는 <span className={MONO}>log₂</span> —
              첨자가 없으면 분야로 읽는다.) 다른 모든 성질이 이 한 줄에서 떨어져 나온다.{" "}
              <span className={MONO}>log(a/b) = log(a) − log(b)</span>: 규칙에서 b를 1/b로 바꾸면
              끝. <span className={MONO}>log(aⁿ) = n·log(a)</span>: 규칙을{" "}
              <span className={MONO}>a · a · … · a</span>에 n번 적용.{" "}
              <span className={MONO}>log(1) = 0</span>:{" "}
              <span className={MONO}>log(1·a) = log(1) + log(a)</span>에서. 네 번째 규칙은 없다 —
              곱셈을 묶는 네 번째 방법이 없기 때문이다. 실용적으로 보면:{" "}
              <Term id="logarithm">로그</Term>는 어떤 수가 <em>밑을 몇 번 곱해 만든 것인지</em>를
              알려준다. <span className={MONO}>log₁₀(1000) = 3</span>인 건 1000이 10을 세 번 곱한
              수이기 때문. 곱한 횟수를 센다. 그게 전부다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc1} />}
      </ArcRow>

      <ArcRow n={2}>
        <h3>{pick(language, "Same trick, five places", "같은 트릭, 다섯 곳")}</h3>
        <p>
          {pick(
            language,
            <>
              Exponential quantities scatter across many places — time-growth (
              <Term id="compound-interest">compound interest</Term>, carbon dating), perceptual
              compression (decibels), scale-of-nature units (earthquake magnitude), counting
              information (bits). Same trick each time: set up the equation, take logs, pull the
              exponent. By hand.
            </>,
            <>
              지수에 사는 양은 여러 군데에 흩어져 있다 — 시간에 따라 자라는 것 (
              <Term id="compound-interest">복리</Term>, 탄소 연대 측정), 사람 감각의 압축 (데시벨),
              거대 스케일의 단위 (지진), 정보를 세는 단위 (비트). 매번 같은 트릭이다: 식을 세우고,
              양변에 로그, 지수를 꺼낸다. 손으로 풀어보자.
            </>,
          )}
        </p>
        <ul className="mt-4 list-none space-y-3 p-0 text-[16.5px] text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
          <li>
            {pick(
              language,
              <>
                <b>Compound interest.</b> A million won at 7%/year — when does it double?{" "}
                <span className={MONO}>1.07ᵗ = 2</span> →{" "}
                <span className={MONO}>t = log(2) / log(1.07) ≈ 0.301 / 0.0294 ≈ 10.24 years</span>.
                The <Term id="rule-of-72">Rule of 72</Term> (
                <span className={MONO}>72 / 7 ≈ 10.3</span>) is this formula sloppily memorized.
              </>,
              <>
                <b>복리.</b> 100만원을 연 7%로 굴리면 두 배는 몇 년 뒤?{" "}
                <span className={MONO}>1.07ᵗ = 2</span> →{" "}
                <span className={MONO}>t = log(2) / log(1.07) ≈ 0.301 / 0.0294 ≈ 10.24년</span>.{" "}
                <Term id="rule-of-72">72의 법칙</Term> (<span className={MONO}>72 / 7 ≈ 10.3</span>
                )이 이 식을 작은 r에서 어림한 결과.
              </>,
            )}
          </li>
          <li>
            {pick(
              language,
              <>
                <b>Carbon-14 dating.</b> Carbon-14 halves every 5,730 years after death. If 25%
                remains: <span className={MONO}>(1/2)^(t/5730) = 0.25 = (1/2)²</span> →{" "}
                <span className={MONO}>t = 11,460 years</span>. For odd ratios (33%, 17%) only the
                log expression closes in a single line.
              </>,
              <>
                <b>탄소-14 연대 측정.</b> 탄소-14는 생물이 죽으면 반감기 5,730년으로 줄어든다. 25%만
                남아 있다면: <span className={MONO}>(1/2)^(t/5730) = 0.25 = (1/2)²</span> →{" "}
                <span className={MONO}>t = 11,460년</span>. 33%, 17% 같은 어중간한 비율은 로그 식 한
                줄로만 닫힌다.
              </>,
            )}
          </li>
          <li>
            {pick(
              language,
              <>
                <b>Decibels.</b> <span className={MONO}>dB = 10·log₁₀(P/P₀)</span>. Conversation 60
                dB, rock concert 110 dB → acoustic power differs by{" "}
                <span className={MONO}>10⁵ = 100,000×</span>. Your ears don't perceive a
                hundred-thousand-fold gap; hearing is logarithmic in power, and decibels track that
                compression directly.
              </>,
              <>
                <b>데시벨.</b> <span className={MONO}>dB = 10·log₁₀(P/P₀)</span>. 일반 대화 60 dB,
                록 콘서트 110 dB → 음향 강도 차이는 <span className={MONO}>10⁵ = 10만 배</span>.
                귀로는 그렇게 안 들린다. 청각이 강도의 로그를 듣기 때문 — 데시벨은 그 청각 로그를
                그대로 따라간 단위.
              </>,
            )}
          </li>
          <li>
            {pick(
              language,
              <>
                <b>Earthquake magnitude.</b> <span className={MONO}>E = E₀·10^(1.5·M)</span>. Tōhoku
                2011 (M 9.0) vs an ordinary large quake (M 7.0):{" "}
                <span className={MONO}>E₉ / E₇ = 10^(1.5×2) = 10³ = 1,000×</span>. Two units of
                magnitude, three orders of energy. Natural earthquake energies span 19 orders of
                magnitude — comparison is hopeless without the compression Richter applies.
              </>,
              <>
                <b>지진 규모.</b> <span className={MONO}>E = E₀·10^(1.5·M)</span>. 2011 도호쿠 (M
                9.0) vs 평범한 큰 지진 (M 7.0):{" "}
                <span className={MONO}>E₉ / E₇ = 10^(1.5×2) = 10³ = 1,000배</span>. 규모 2 차이가
                에너지 1,000배. 자연 지진 에너지가 19자릿수에 걸쳐 있어, 리히터의 로그 압축 없이는
                비교 자체가 불가능.
              </>,
            )}
          </li>
          <li>
            {pick(
              language,
              <>
                <b>Bits and binary search.</b> A 1,024-page dictionary, halving each step →{" "}
                <span className={MONO}>log₂(1024) = 10</span> steps to find any word. A 32-bit int
                holds <span className={MONO}>2³² ≈ 4.3 billion</span> values; identifying N items
                needs <span className={MONO}>log₂(N)</span> bits. A deck of cards has{" "}
                <span className={MONO}>
                  log₂(<Term id="factorial">52!</Term>) ≈ 226 bits
                </span>{" "}
                of shuffle entropy — 226 yes/no questions to specify a single shuffle exactly.
              </>,
              <>
                <b>비트와 이진 탐색.</b> 1,024쪽 사전을 매번 절반으로 자르면{" "}
                <span className={MONO}>log₂(1024) = 10</span>번 만에 단어에 도달한다. 32비트 정수는{" "}
                <span className={MONO}>2³² ≈ 43억</span> 가지를 표현하고, 거꾸로 N개를 식별하려면{" "}
                <span className={MONO}>log₂(N)</span> 비트가 필요하다. 카드 한 벌의 셔플은{" "}
                <span className={MONO}>
                  log₂(<Term id="factorial">52!</Term>) ≈ 226 비트
                </span>{" "}
                — 226개의 예/아니오 질문이면 한 셔플이 정확히 특정된다.
              </>,
            )}
          </li>
        </ul>
        <p className="mt-4">
          {pick(
            language,
            <>
              Five problems, one shape: nature's equation is exponential, take logs both sides, the
              exponent falls out. The identity from § 1 — multiplication into addition — is doing
              this work every single time.
            </>,
            <>
              다섯 문제, 같은 모양: 자연이 만든 식은 지수꼴, 양변에 로그, 지수가 답으로 떨어진다. §
              1의 항등식 — 곱셈을 덧셈으로 — 이 매번 이 일을 한다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={3}>
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
              them <em>look up</em> <span className={MONO}>log(a)</span> and{" "}
              <span className={MONO}>log(b)</span>, <em>add</em> the two, and <em>look up</em> what
              number had that log — the answer to <span className={MONO}>a·b</span> with no
              multiplication anywhere. Three centuries later, every engineer carried a{" "}
              <Term id="slide-rule">slide rule</Term>: a wooden ruler with two log-spaced scales
              that <em>slid past each other</em>. Aligning <b>2</b> on one against <b>3</b> on the
              other physically performed <span className={MONO}>log(2) + log(3)</span> and showed{" "}
              <b>6</b> at the meeting point.{" "}
              <b>The slide rule is the identity from § 1, made into furniture.</b> Apollo got to the
              moon on these.
            </>,
            <>
              1614년, 존 네이피어가 첫 로그 표를 출판했다. 일식을 예측하려고 9자리 수를 손으로
              곱하다 속이 타들어 가던 천문학자들의 시대였다. 표를 펴서{" "}
              <span className={MONO}>log(a)</span>와 <span className={MONO}>log(b)</span>를{" "}
              <em>찾고</em>, 둘을 <em>더하고</em>, 그 합이 로그값인 수를 다시 <em>찾으면</em> — 곱셈
              한 번 없이 <span className={MONO}>a·b</span>
              가 나왔다. 300년 뒤, 모든 엔지니어가 <Term id="slide-rule">계산자</Term>를 들고
              다녔다. 두 개의 로그 눈금이 서로 <em>미끄러지는</em> 나무 자. 한쪽의 <b>2</b>와 다른
              쪽의 <b>3</b>을 맞추면 물리적으로 <span className={MONO}>log(2) + log(3)</span>이
              수행됐고, 만나는 자리에 <b>6</b>이 찍혔다.{" "}
              <b>계산자는 § 1의 항등식을 도구로 깎아 만든 물건이다.</b> 아폴로는 이걸로 달에 갔다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={4}>
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
                <span className={MONO}>float32</span>
              </Term>{" "}
              can hold numbers down to about <span className={MONO}>10⁻³⁸</span>. Multiply forty
              probabilities of <span className={MONO}>0.1</span> and you've crossed it — the result
              rounds to zero, silently. No exception. No warning. Every{" "}
              <Term id="gradient">gradient</Term> that depended on it dies with it. This isn't a
              numerical-analysis curiosity; it's why every deep-learning library reports loss as a{" "}
              <em>sum</em>, not a product. The fix is the identity from § 1, applied mechanically:
              take logs the moment a product would otherwise form.{" "}
              <span className={MONO}>log(p₁·p₂·…·pₙ) = Σ log(pᵢ)</span>. Each{" "}
              <span className={MONO}>log(pᵢ)</span> is a comfortable negative number; their sum is a
              comfortable larger negative number. No <Term id="underflow">underflow</Term> can reach
              you. This is what <Term id="log-likelihood">log-likelihood</Term> is doing, and what{" "}
              <Term id="log-softmax">
                <span className={MONO}>log_softmax</span>
              </Term>{" "}
              was built to do. Live in log-space; sums replace products; floats stop lying.
            </>,
            <>
              <Term id="float32">
                <span className={MONO}>float32</span>
              </Term>
              는 약 <span className={MONO}>10⁻³⁸</span>까지만 표현한다. 확률{" "}
              <span className={MONO}>0.1</span>을 마흔 번 곱하면 이미 그 아래로 — 결과는 조용히
              0으로 반올림된다. 예외도, 경고도 없다. 거기 의존하던 모든{" "}
              <Term id="gradient">그래디언트</Term>가 함께 죽는다. 수치해석의 흥밋거리가 아니다.
              모든 딥러닝 라이브러리가 손실을 <em>곱</em>이 아니라 <em>합</em>으로 보고하는 이유다.
              해법은 § 1의 항등식을 기계적으로 적용하는 것: 곱이 만들어지기 직전에 로그를 씌운다.{" "}
              <span className={MONO}>log(p₁·p₂·…·pₙ) = Σ log(pᵢ)</span>. 각각의{" "}
              <span className={MONO}>log(pᵢ)</span>는 다루기 편한 음수, 그 합은 다루기 편한 더 큰
              음수. <Term id="underflow">언더플로우</Term>가 닿을 수 없다.{" "}
              <Term id="log-likelihood">로그우도</Term>가 하는 일이고,{" "}
              <Term id="log-softmax">
                <span className={MONO}>log_softmax</span>
              </Term>{" "}
              가 만들어진 이유다. 로그 공간에 살면 곱은 합이 되고, float는 거짓말을 멈춘다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>{pick(language, "Back to the application", "다시 응용으로")}</h3>
        <p>
          {pick(
            language,
            <>
              This module is <em>consumed</em> by{" "}
              <Link to="/finance/bitcoin-pizza">the Bitcoin Pizza</Link>. There you're asked to
              compute <span className={MONO}>10⁹ · 2.89²⁰</span> by hand. You can't, until you take{" "}
              <span className={MONO}>log₁₀</span> of both sides — and then you're adding{" "}
              <span className={MONO}>9 + 20·log₁₀(2.89)</span>, two numbers a human can manage. That
              hand-computation is only possible because of the identity in § 1. Same trick as
              Napier's, same trick as{" "}
              <Term id="log-softmax">
                <span className={MONO}>log_softmax</span>
              </Term>
              . Different decade, different stakes, identical mechanism.
            </>,
            <>
              이 모듈은 <Link to="/finance/bitcoin-pizza">비트코인 피자</Link>에서 쓰인다. 거기서는{" "}
              <span className={MONO}>10⁹ · 2.89²⁰</span>을 손으로 계산하라고 한다. 양변에{" "}
              <span className={MONO}>log₁₀</span>을 씌우기 전에는 불가능하지만, 씌우는 순간{" "}
              <span className={MONO}>9 + 20·log₁₀(2.89)</span> — 사람이 다룰 수 있는 두 수의 덧셈이
              된다. 그 손계산이 가능한 건 § 1의 항등식 덕분이다. 네이피어의 트릭과 같고,{" "}
              <Term id="log-softmax">
                <span className={MONO}>log_softmax</span>
              </Term>
              의 트릭과 같다. 시대도 판돈도 다르지만, 메커니즘은 동일하다.
            </>,
          )}
        </p>
      </ArcRow>

      <div className="mt-[22px] rounded-r-md border-l-4 border-acc bg-acc-soft px-[22px] py-[18px] text-base leading-[1.55] text-acc-deep">
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
    <section className="mt-14">
      <div className={KICKER}>exercises · 손으로 풀기</div>

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
              <span className={MONO}>log₁₀(2) ≈ 0.301</span>.
            </>
          ),
          ko: (
            <>
              계산기 없이, <span className={MONO}>log₁₀(2) ≈ 0.301</span>만 사용해서{" "}
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
              Use <span className={MONO}>log(0.05) ≈ −3.00</span>.
            </>
          ),
          ko: (
            <>
              50토큰 시퀀스를 평가한다. 각 토큰의 확률은 ~<b>0.05</b>. 코드가 <em>계산해야 할</em>{" "}
              식과 <em>피해야 할</em> 식을 각각 써라.{" "}
              <span className={MONO}>log(0.05) ≈ −3.00</span> 사용.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <em>Avoid</em>: P = 0.05⁵⁰ ≈ <span className={MONO}>10⁻⁶⁵</span> — zero in float32,
              almost zero in float64. <em>Compute</em>: log P = 50·log(0.05) ≈ 50·(−3.00) ={" "}
              <b>−150</b>. The product is the same number; the sum is the only one your computer can
              hold.
            </>
          ),
          ko: (
            <>
              <em>피해야 할 식</em>: P = 0.05⁵⁰ ≈ <span className={MONO}>10⁻⁶⁵</span> — float32에서
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
              <span className={MONO}>log₁₀(n!) ≈ n·log₁₀(n) − n·log₁₀(e)</span>, with{" "}
              <span className={MONO}>log₁₀(e) ≈ 0.434</span>. Estimate <b>log₁₀(100!)</b>.{" "}
              <em>How many digits</em> does 100! have?
            </>
          ),
          ko: (
            <>
              <Term id="stirling-approximation">스털링</Term>:{" "}
              <span className={MONO}>log₁₀(n!) ≈ n·log₁₀(n) − n·log₁₀(e)</span>,{" "}
              <span className={MONO}>log₁₀(e) ≈ 0.434</span>. <b>log₁₀(100!)</b> 추정, 그리고 100!의{" "}
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
              <span className={MONO}>log p</span> and <span className={MONO}>log q</span> (not p, q
              themselves — they'd underflow). Derive a numerically stable expression for{" "}
              <span className={MONO}>log(p + q)</span>. (This is the{" "}
              <Term id="logsumexp">
                <em>logsumexp</em>
              </Term>{" "}
              trick.)
            </>
          ),
          ko: (
            <>
              두 확률 p, q가 있다. 단, <span className={MONO}>log p</span>와{" "}
              <span className={MONO}>log q</span>만 안다 (p, q 자체는 언더플로우).{" "}
              <span className={MONO}>log(p + q)</span>의 수치적으로 안정한 식을 유도하라. (
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
              Let <span className={MONO}>M = max(log p, log q)</span>. Factor:{" "}
              <span className={MONO}>log(p + q) = M + log(e^(log p − M) + e^(log q − M))</span>.
              Both inner exponents are ≤ 0, so their exponentials are ≤ 1 — no overflow, no
              underflow. This is <em>the</em> function in every ML library:{" "}
              <span className={MONO}>torch.logsumexp</span>,{" "}
              <span className={MONO}>scipy.special.logsumexp</span>. Same identity from § 1, used
              backwards.
            </>
          ),
          ko: (
            <>
              <span className={MONO}>M = max(log p, log q)</span>로 두자. 인수분해하면:{" "}
              <span className={MONO}>log(p + q) = M + log(e^(log p − M) + e^(log q − M))</span>.
              안쪽 지수는 모두 ≤ 0이므로 지수값은 ≤ 1 — 오버플로우도 언더플로우도 일어나지 않는다.
              모든 ML 라이브러리에 있는 <em>그</em> 함수다:{" "}
              <span className={MONO}>torch.logsumexp</span>,{" "}
              <span className={MONO}>scipy.special.logsumexp</span>. § 1의 같은 항등식을 거꾸로 쓴
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
                <span className={MONO}>log_softmax</span>
              </Term>{" "}
              is just a perf optimization. Mathematically you could just multiply the probabilities
              — switch to float64 if you're worried." Write a <em>one-paragraph</em> rebuttal that
              holds for both{" "}
              <Term id="float32">
                <span className={MONO}>float32</span>
              </Term>{" "}
              and <span className={MONO}>float64</span>. Then state the single equation that makes
              log-space work.
            </>
          ),
          ko: (
            <>
              주니어가 말한다: "
              <Term id="log-softmax">
                <span className={MONO}>log_softmax</span>
              </Term>{" "}
              는 그냥 성능 최적화일 뿐이고, 수학적으로는 그냥 확률을 곱해도 된다. 걱정되면 float64
              쓰면 되잖아."{" "}
              <Term id="float32">
                <span className={MONO}>float32</span>
              </Term>
              와 <span className={MONO}>float64</span> 둘 다에 대해 통하는 반박을 한 단락으로 써라.
              그리고 로그 공간을 가능하게 만드는 단 하나의 방정식을 적어라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Wrong for both. <span className={MONO}>float32</span> underflows below{" "}
              <span className={MONO}>~10⁻³⁸</span>; <span className={MONO}>float64</span> below{" "}
              <span className={MONO}>~10⁻³⁰⁸</span>. A 1000-token sequence at p = 0.1 per token is
              10⁻¹⁰⁰⁰ — zero in <em>both</em>. The product literally does not exist in machine
              arithmetic; the sum-of-logs always does. The single equation:{" "}
              <span className={FORMULA_INLINE}>log(a·b) = log(a) + log(b)</span>.
            </>
          ),
          ko: (
            <>
              둘 다 틀렸다. <span className={MONO}>float32</span>는{" "}
              <span className={MONO}>~10⁻³⁸</span> 아래에서 언더플로우;{" "}
              <span className={MONO}>float64</span>는 <span className={MONO}>~10⁻³⁰⁸</span> 아래에서
              언더플로우. 1000토큰 시퀀스에서 토큰 확률이 p=0.1이면 곱은 10⁻¹⁰⁰⁰ —{" "}
              <em>두 형식 모두</em>에서 0이다. 곱은 기계 연산 안에 아예 존재하지 않는다. 로그의 합은
              언제나 존재한다. 단 하나의 방정식:{" "}
              <span className={FORMULA_INLINE}>log(a·b) = log(a) + log(b)</span>.
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
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function Logarithm({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "Log · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <ToolSpec
        definition={{
          en: (
            <>
              The inverse of exponentiation.{" "}
              <span className="font-mono text-[0.95em] text-ink">log(a·b) = log(a) + log(b)</span> —
              products become sums. The whole module is that one identity.
            </>
          ),
          ko: (
            <>
              거듭제곱의 역함수.{" "}
              <span className="font-mono text-[0.95em] text-ink">log(a·b) = log(a) + log(b)</span> —
              곱이 합이 된다. 모듈에 식은 이 하나뿐.
            </>
          ),
        }}
        appliesWhen={{
          en: (
            <>
              A quantity is built from exponents — compound interest, half-life, decibels,
              earthquake magnitudes, sequence probabilities. The natural parameter is{" "}
              <em>how many factors</em>, and you want to recover it from the result.
            </>
          ),
          ko: (
            <>
              어떤 양이 지수로 만들어졌을 때 — 복리, 반감기, 데시벨, 지진 규모, 시퀀스 확률. 자연이
              쓰는 변수가 <em>몇 번 곱했는가</em>이고, 결과에서 그 횟수를 꺼내고 싶을 때.
            </>
          ),
        }}
        breaksWhen={{
          en: (
            <>
              Argument is zero or negative — real log is undefined. Base 1 — every exponent gives 1
              and the inverse collapses. The most common student error is logging across an
              addition:{" "}
              <span className="font-mono text-[0.95em] text-ink">log(a + b) ≠ log(a) + log(b)</span>
              . The identity needs a product underneath, every time.
            </>
          ),
          ko: (
            <>
              인수가 0 이하면 실수 로그는 정의되지 않는다. 밑이 1이면 모든 지수가 1을 만들어
              역함수가 무너진다. 학생 실수 1순위는 합에 로그를 씌우는 것:{" "}
              <span className="font-mono text-[0.95em] text-ink">log(a + b) ≠ log(a) + log(b)</span>
              . 항등식 아래엔 *반드시* 곱이 있어야 한다.
            </>
          ),
        }}
      />
      <DoublingLadder />
      <TwoStacks />
      <Arc code={code} />
      <Exercises />
      <Glossary />
      <PageFooter />
    </TermsProvider>
  );
}
