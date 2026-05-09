import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { Counterexample, WhyNotTaught } from "../components/meta";
import { PizzaSlider } from "../components/widgets/pizza-slider";
import { ThreeDoors } from "../components/widgets/three-doors";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc1: string; arc2: string; arc3: string };

// Pre-rendered Shiki HTML produced at build time in the .astro page; we just
// drop it into the DOM. The .shiki rule in global.css adds spacing/overflow.
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
        {pick(language, "finance · the bitcoin pizza", "금융 · 비트코인 피자")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · may 22, 2010", "도입 · 2010년 5월 22일")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px] [&_.acc]:font-semibold [&_.acc]:text-acc">
        {pick(
          language,
          <>
            A Florida programmer named Laszlo Hanyecz paid <span className="acc">10,000 BTC</span>{" "}
            for two Papa John's pizzas — about <span className="acc">$41</span>.
          </>,
          <>
            플로리다의 프로그래머 라즐로 하녜츠가 파파존스 피자 두 판 값으로{" "}
            <span className="acc">10,000 BTC</span> — 당시 약 <span className="acc">$41</span> 어치
            — 를 보냈다.
          </>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc">
        {pick(
          language,
          <>
            Sixteen years later, those 10,000 BTC are worth about <b>$1 billion</b>. The most
            expensive meal in history. So: <em>what annual rate</em> turns $41 into $1B in 16 years?{" "}
            <em>When</em> did Laszlo's dinner first cost a million dollars? And — the one that bites
            — <em>how much</em> would it be worth in 2046 if BTC keeps that pace?
          </>,
          <>
            16년 뒤, 그 10,000 BTC의 가치는 약 <b>$10억</b>. 역사상 가장 비싼 식사다. 그래서: $41이
            16년 만에 $10억이 되려면 <em>연 몇 %</em>가 필요한가? 라즐로의 저녁이 처음 $100만짜리가
            된 건 <em>언제</em>인가? 그리고 — 결정타 — 같은 속도가 이어지면 2046년엔 <em>얼마</em>가
            되는가?
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_em]:italic [&_em]:text-acc">
        {pick(
          language,
          <>
            You cannot answer any of these without three operations: <Term id="exponent">exp</Term>,{" "}
            <Term id="logarithm">log</Term>, and <Term id="nth-root">n-th root</Term>. They are not
            three topics. They are three doors of one room — and the same machine that{" "}
            <em>discovers</em> a story like Bitcoin's also <em>detects</em> when a story is
            impossible. This page is the room.
          </>,
          <>
            이 셋 없이는 어떤 질문도 답할 수 없다: <Term id="exponent">지수</Term>,{" "}
            <Term id="logarithm">로그</Term>, <Term id="nth-root">거듭제곱근</Term>. 별개의 주제가
            아니다. 한 방의 세 문이다 — 비트코인 같은 이야기를 <em>발견</em>하는 그 기계가, 같은
            이야기가 <em>불가능해지는 순간</em>도 잡아낸다. 이 페이지가 그 방이다.
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
        <h3>
          {pick(
            language,
            "How much? — projecting the pizza forward",
            "얼마? — 피자를 미래로 보내기",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              If <Term id="bitcoin">Bitcoin</Term> keeps its historical pace, what's 10,000 BTC
              worth in 2046? Stack <span className={MONO}>×2.89</span> twenty more times on $1B.{" "}
              <Term id="compound-interest">Compound</Term> growth is repeated multiplication;
              repeated multiplication, compressed into one symbol, is{" "}
              <Term id="exponent">exponentiation</Term>.{" "}
              <span className={FORMULA_INLINE}>
                F = P · (1 + r)<sup>t</sup>
              </span>
              . Tap "Code" mode at the top — three lines of Python.
            </>,
            <>
              <Term id="bitcoin">비트코인</Term>이 지금까지의 속도를 유지하면 10,000 BTC는 2046년에
              얼마? $10억 위에 <span className={MONO}>×2.89</span>를 20번 더 쌓는다.{" "}
              <Term id="compound-interest">복리</Term>는 곱셈의 반복; 그 반복을 한 기호로 압축한 게{" "}
              <Term id="exponent">지수</Term>.{" "}
              <span className={FORMULA_INLINE}>
                F = P · (1 + r)<sup>t</sup>
              </span>
              . 위쪽 "코드" 모드를 켜라 — 파이썬 세 줄.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc1} />}
      </ArcRow>

      <ArcRow n={2}>
        <h3>
          {pick(
            language,
            "How long? — when did the pizza hit $1M?",
            "언제까지? — 피자가 $100만이 된 건 언제?",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              Reverse the question: at BTC's actual rate, when did 10,000 BTC first cross{" "}
              <b>$1,000,000</b>? You can't multiply your way there — you have to <em>undo</em> the
              exponent. The <Term id="logarithm">logarithm</Term> is exactly that: given the result,{" "}
              <em>count the steps</em>.{" "}
              <span className={FORMULA_INLINE}>t = log(F / P) ÷ log(1 + r)</span>. Log <em>is</em>{" "}
              the inverse of exp. They are defined by each other. Answer: about <b>9.5 years</b> in
              — late 2019. The pizza became a million-dollar pizza on a random Tuesday.
            </>,
            <>
              질문을 뒤집자. BTC 실제 속도로, 10,000 BTC가 처음 <b>$100만</b>을 넘긴 건 언제? 곱해서
              도달할 길은 없다. 지수를 <em>되돌려야</em> 한다. <Term id="logarithm">로그</Term>가
              바로 그것이다: 결과를 주면 <em>몇 번 곱했는지를 센다</em>.{" "}
              <span className={FORMULA_INLINE}>t = log(F / P) ÷ log(1 + r)</span>. 로그는 지수의
              역함수. 서로가 서로를 정의한다. 답: 약 <b>9.5년</b> 후 — 2019년 말. 평범한 어느
              화요일에, 그 피자는 백만 달러짜리 피자가 되어 있었다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>
          {pick(
            language,
            "What rate? — was Laszlo's loss really 'extraordinary'?",
            "이율은? — 라즐로의 손실은 정말 '특별했나'?",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              We know $41 became $1B in 16 years. We don't know r. We can't undo the exponent (we
              don't know it); we can't take a log (we'd get the wrong unknown). We need a{" "}
              <em>third</em> operation: the <Term id="nth-root">n-th root</Term>.{" "}
              <span className={FORMULA_INLINE}>
                r = (F / P)<sup>1/t</sup> − 1
              </span>
              . Finance calls this <Term id="cagr">CAGR</Term>. It is a fractional exponent — a
              1/16th power. The number that comes out: <b>189% per year</b>.{" "}
              <Term id="spy">SPY</Term> does ~10%. Buffett's Berkshire (his investment company):
              ~20%. NVIDIA over 25 years: ~33%. Bitcoin: <em>189</em>.{" "}
              <em>Roots are exponents whose value is not a whole number.</em>
            </>,
            <>
              $41이 16년 만에 $10억이 됐다는 건 안다. r은 모른다. 지수를 되돌릴 수도 없고 (지수
              자체를 모르니까), 로그를 씌울 수도 없다 (엉뚱한 미지수가 분리된다). <em>세 번째</em>{" "}
              연산이 필요하다: <Term id="nth-root">거듭제곱근</Term>.{" "}
              <span className={FORMULA_INLINE}>
                r = (F / P)<sup>1/t</sup> − 1
              </span>
              . 금융에서는 <Term id="cagr">CAGR</Term>이라 부른다. 1/16 제곱 — 분수 지수. 결과:{" "}
              <b>연 189%</b>. <Term id="spy">SPY</Term>는 약 10%. 버크셔 (버핏의 투자회사)는 약 20%.
              25년간의 엔비디아는 약 33%. 비트코인은 — <em>189</em>.{" "}
              <em>거듭제곱근은 정수가 아닌 지수일 뿐이다.</em>
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc3} />}
        <Counterexample
          en={
            <>
              The single number "189% CAGR" hides 16 years of violence. Compute the CAGR over{" "}
              <b>2018 → 2022</b> (peak-to-peak): it's around <b>3% per year</b>. Compute it over{" "}
              <b>2020 → 2021</b>: over <b>300%</b>. CAGR is an <em>average exponent</em> — it
              assumes the rate was constant, which it never was. The same equation that{" "}
              <em>discovered</em> the Bitcoin story <em>flattens</em> it the moment you compute
              CAGR. If you sell at the wrong window, your "average" returns nothing like 189%.
            </>
          }
          ko={
            <>
              "연 189% CAGR"이라는 한 숫자는 16년의 난동을 숨긴다. <b>2018 → 2022</b> (정점-정점)의
              CAGR을 계산해 보면 <b>연 3%</b>쯤 된다. <b>2020 → 2021</b>로 잘라보면 <b>300%</b>가
              넘는다. CAGR은 <em>평균 지수</em> — 이율이 일정했다고 가정한다. 한 번도 일정한 적
              없는데. 비트코인 이야기를 <em>찾아낸</em> 그 식이, CAGR을 계산하는 그 순간부터 같은
              이야기를 <em>납작하게 만든다</em>. 잘못된 창을 골라 팔면 당신의 '평균'은 189%와 한참
              멀어진다.
            </>
          }
        />
      </ArcRow>

      <div className="mt-[22px] rounded-r-md border-l-4 border-acc bg-acc-soft px-[22px] py-[18px] text-base leading-[1.55] text-acc-deep">
        {pick(
          language,
          <>
            <b>One equation, three operations.</b>{" "}
            <span className={FORMULA_INLINE}>
              F = P(1+r)<sup>t</sup>
            </span>{" "}
            has three unknowns. Each unknown picks a different door: <b>exp</b> for F, <b>log</b>{" "}
            for t, <b>root</b> for r. That is the entire structural relationship between exp, log,
            and root. Memorize the equation, not the operations.
          </>,
          <>
            <b>한 식, 세 연산.</b>{" "}
            <span className={FORMULA_INLINE}>
              F = P(1+r)<sup>t</sup>
            </span>
            에는 미지수가 셋 있다. 각 미지수가 서로 다른 문을 고른다: F는 <b>지수</b>, t는{" "}
            <b>로그</b>, r은 <b>거듭제곱근</b>. 지수·로그·거듭제곱근의 관계는 정확히 이게 전부다.
            외워야 할 건 식이지, 연산이 아니다.
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
              On the Pizza Slider above, leave it at the defaults: <b>P = $41</b>, <b>r = 189%</b>.
              Toggle the y-axis to <b>log</b>. Roughly when does Laszlo's $41 first cross{" "}
              <b>$1,000,000</b>? (Read it off the graph; no formula.)
            </>
          ),
          ko: (
            <>
              위 슬라이더는 기본값 그대로: <b>P = $41</b>, <b>r = 189%</b>. y축은 <b>로그</b>로.
              라즐로의 $41이 처음으로 <b>$1,000,000</b>을 넘는 건 대략 언제인가? (식 쓰지 말고
              그래프로만.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              About <b>2019</b> — roughly 9–10 years in. The straight log-line meets the $1M grid
              line near year 9.5. (Sanity check: $41 × 24,000 = $984k, and 2.89<sup>9.5</sup> ≈
              24,000, so 9.5 years checks.)
            </>
          ),
          ko: (
            <>
              약 <b>2019년</b> — 9~10년 차. 로그 축의 직선이 $1M 격자선과 만나는 지점이 9.5년 부근.
              (검산: $41 × 24,000 ≈ $984k, 2.89<sup>9.5</sup> ≈ 24,000.)
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        noCalculator
        tag={{ en: "compute by hand · Rule of 72", ko: "손으로 계산 · 72의 법칙" }}
        prompt={{
          en: (
            <>
              The <Term id="rule-of-72">Rule of 72</Term> at SPY's <b>8% per year</b>: how long for
              $1 to double? Then justify the rule using ln(2) ≈ 0.693 and ln(1 + r) ≈ r for small r.{" "}
              <em>Then</em> ask yourself: would the rule still work at BTC's 189%? (Don't compute —
              just predict.)
            </>
          ),
          ko: (
            <>
              <Term id="rule-of-72">72의 법칙</Term>, SPY의 연 <b>8%</b>로: $1이 두 배가 되는 데 몇
              년? ln(2) ≈ 0.693과, 작은 r에 대해 ln(1 + r) ≈ r 을 써서 이 법칙이 왜 성립하는지
              보여라. <em>그리고</em> 자문해 보라: BTC의 189%에서도 이 법칙이 통할까? (계산 말고 —
              예측만.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              72 / 8 = <b>9 years</b>. Justification: (1+r)<sup>t</sup> = 2 ⇒ t = ln(2) / ln(1+r) ≈
              0.693 / r. So t·(r in %) ≈ 69.3, rounded up to 72 (lots of divisors). At BTC's 189%,
              the approximation ln(1+r) ≈ r breaks badly — the "72" rule predicts doubling in 72/189
              ≈ 0.38 years (≈4.5 months), but the true answer is ln(2)/ln(2.89) ≈ <b>0.65 years</b>{" "}
              (≈8 months). The rule is a small-r tool. Pin this lesson — exercise 6 will revisit it.
            </>
          ),
          ko: (
            <>
              72 / 8 = <b>9년</b>. 유도: (1+r)<sup>t</sup> = 2 ⇒ t = ln(2)/ln(1+r) ≈ 0.693/r. 따라서
              t·(r%) ≈ 69.3, 약수가 많은 72로 올림한 것. BTC의 189%에서는 ln(1+r) ≈ r 근사가 크게
              깨진다 — '72'는 72/189 ≈ 0.38년 (≈4.5개월)을 예측하지만, 실제는 ln(2)/ln(2.89) ≈{" "}
              <b>0.65년</b> (≈8개월). 72의 법칙은 작은 r 전용. 이 교훈은 잘 박아두자 — 6번 문제에서
              다시 만난다.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "write the equation", ko: "식 세우기" }}
        prompt={{
          en: (
            <>
              You buy <b>$100</b> of BTC today. Assume — generously — that BTC's CAGR slows to{" "}
              <b>50% per year</b> (about a quarter of its historical pace). Write the equation for
              its value in <b>10 years</b>, then solve.
            </>
          ),
          ko: (
            <>
              오늘 BTC를 <b>$100</b>어치 산다. 후하게 가정해서 — BTC의 CAGR이 <b>연 50%</b>로
              느려진다 (지금까지 속도의 약 1/4). <b>10년 후</b> 가치를 식으로 세우고 풀어라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              F = 100 · 1.5<sup>10</sup>. Compute 1.5<sup>10</sup>: 1.5² = 2.25, 1.5⁴ = 5.06, 1.5⁸ =
              25.6, 1.5<sup>10</sup> = 1.5⁸ · 1.5² = 25.6 · 2.25 ≈ 57.7. So F ≈ <b>$5,770</b>. The
              "boring" half-pace future still puts $100 at almost $6k in a decade. That's what
              compounding does even when slowed.
            </>
          ),
          ko: (
            <>
              F = 100 · 1.5<sup>10</sup>. 1.5<sup>10</sup> 계산: 1.5² = 2.25, 1.5⁴ = 5.06, 1.5⁸ =
              25.6, 1.5<sup>10</sup> = 1.5⁸·1.5² = 25.6·2.25 ≈ 57.7. 따라서 F ≈ <b>$5,770</b>.
              '느려진' 미래에서도 10년이면 $100이 약 $6k. 복리는 속도가 줄어도 여전히 일을 한다.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        noCalculator
        tag={{ en: "compute by hand · the root", ko: "손으로 계산 · 거듭제곱근" }}
        prompt={{
          en: (
            <>
              A friend put <b>$1,000</b> into BTC <b>5 years</b> ago. It is now <b>$32,000</b>. What
              was their CAGR? (Hint: notice 32 = 2⁵.)
            </>
          ),
          ko: (
            <>
              친구가 <b>5년 전</b> BTC에 <b>$1,000</b>을 넣었다. 지금은 <b>$32,000</b>. CAGR은
              얼마였나? (힌트: 32 = 2⁵.)
            </>
          ),
        }}
        solution={{
          en: (
            <>
              r = (32000/1000)<sup>1/5</sup> − 1 = 32<sup>1/5</sup> − 1 = (2⁵)<sup>1/5</sup> − 1 = 2
              − 1 = <b>100% per year</b>. Their portfolio doubled every year. The trick was spotting
              that 32 is 2⁵, so the 5th root collapses to a clean 2.
            </>
          ),
          ko: (
            <>
              r = (32000/1000)<sup>1/5</sup> − 1 = 32<sup>1/5</sup> − 1 = (2⁵)<sup>1/5</sup> − 1 = 2
              − 1 = <b>연 100%</b>. 매년 두 배. 핵심 트릭: 32 = 2⁵ 임을 알아차리면 5제곱근이
              깔끔하게 2로 떨어진다.
            </>
          ),
        }}
      />

      <Exercise
        number={5}
        tag={{ en: "two curves cross", ko: "두 곡선의 교차" }}
        prompt={{
          en: (
            <>
              Investor A puts <b>$1,000,000</b> into <b>SPY at 8%/yr</b> in 2010. Investor B puts
              just <b>$100</b> into <b>BTC at 50%/yr</b> in 2010 (sober assumption, not the 189%
              historical). After how many years does B catch up to A?
            </>
          ),
          ko: (
            <>
              투자자 A는 2010년에 <b>SPY (연 8%)</b>에 <b>$1,000,000</b>을 넣었다. 투자자 B는 같은
              해, <b>BTC (연 50%, 보수적 가정)</b>에 단 <b>$100</b>을 넣었다. 몇 년 뒤에 B가 A를
              따라잡는가?
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Set 100 · 1.5<sup>t</sup> = 1,000,000 · 1.08<sup>t</sup>. Divide: (1.5/1.08)
              <sup>t</sup> = 10,000, so 1.389<sup>t</sup> = 10,000. Take log<sub>10</sub>: t · log
              <sub>10</sub>(1.389) = 4. With log<sub>10</sub>(1.389) ≈ 0.143, t ≈ 4 / 0.143 ≈{" "}
              <b>28 years</b> — i.e. around 2038. Lesson: in compounding,{" "}
              <em>rate beats principal</em>, but only if you give it enough time. The break-even is
              set by the log of the principal gap.
            </>
          ),
          ko: (
            <>
              100 · 1.5<sup>t</sup> = 1,000,000 · 1.08<sup>t</sup>. 나누면: (1.5/1.08)<sup>t</sup> =
              10,000, 즉 1.389<sup>t</sup> = 10,000. 양변에 log<sub>10</sub>: t · log<sub>10</sub>
              (1.389) = 4. log<sub>10</sub>(1.389) ≈ 0.143이므로 t ≈ 4 / 0.143 ≈ <b>28년</b> — 즉 약
              2038년. 교훈: 복리에서는 <em>원금보다 이율이 이긴다</em> — 단, 시간이 충분히 주어졌을
              때만. 만나는 시점은 원금 차이의 로그가 정한다.
            </>
          ),
        }}
      />

      <Exercise
        number={6}
        tag={{
          en: "the evil one · log as lie detector",
          ko: "악마의 문제 · 거짓말탐지기로서의 로그",
        }}
        prompt={{
          en: (
            <>
              Project Bitcoin forward. Today (2026): 10,000 BTC ≈ <b>$1B</b>. If BTC keeps its
              16-year CAGR of <b>189%</b> for another <b>20 years</b> (until 2046), what is the
              pizza worth? Compare to global GDP (~$110T). What does the answer tell you about
              exponential stories? Use{" "}
              <span className={MONO}>
                log<sub>10</sub>(2.89) ≈ 0.461
              </span>
              .
            </>
          ),
          ko: (
            <>
              비트코인을 미래로 던져 보자. 오늘 (2026): 10,000 BTC ≈ <b>$10억</b>. BTC가{" "}
              <b>연 189%</b>라는 16년치 CAGR을 앞으로 <b>20년</b> 더 유지하면 (2046년) 그 피자의
              값은? 세계 GDP (~$110조)와 비교하라. 그 답은 지수 이야기에 대해 무엇을 말해주는가?{" "}
              <span className={MONO}>
                log<sub>10</sub>(2.89) ≈ 0.461
              </span>{" "}
              사용.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              F = 10⁹ · 2.89²⁰. Take log<sub>10</sub>: log<sub>10</sub>(F) = 9 + 20 · 0.461 = 9 +
              9.22 = <b>18.22</b>. So F ≈ 10<sup>18.22</sup> ≈{" "}
              <b>
                $1.7 × 10<sup>18</sup>
              </b>{" "}
              — about <b>$1.7 quintillion</b>. Global GDP is ~$1.1 × 10<sup>14</sup>. Ratio: ~
              <b>15,000× global GDP</b>. The lesson is the punchline of this whole module:{" "}
              <em>exponentials cannot survive contact with finite resources</em>. The same log that{" "}
              <em>discovered</em> Bitcoin's 189% rate also <em>predicts</em> when that rate becomes
              nonsense. Logs aren't just inverse exponents. They are the bullshit detector for any
              story told in compounding.
            </>
          ),
          ko: (
            <>
              F = 10⁹ · 2.89²⁰. 양변에 log<sub>10</sub>: log<sub>10</sub>(F) = 9 + 20 · 0.461 = 9 +
              9.22 = <b>18.22</b>. 따라서 F ≈ 10<sup>18.22</sup> ≈{" "}
              <b>
                $1.7 × 10<sup>18</sup>
              </b>{" "}
              — 약 <b>$170경</b>. 세계 GDP ≈ $1.1 × 10<sup>14</sup>. 비율: 약{" "}
              <b>세계 GDP의 15,000배</b>. 이 모듈 전체의 결론이 여기 있다:{" "}
              <em>지수는 유한한 자원과 만나면 살아남지 못한다</em>. 비트코인의 189% 이율을{" "}
              <em>찾아낸</em> 그 로그가, 같은 이율이 <em>말이 안 되는 순간</em>도 잡아낸다. 로그는
              단순히 지수의 역함수가 아니다. 복리로 쓰인 모든 이야기에 대한 헛소리 탐지기다.
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
            application: <b>Bitcoin Pizza</b> · pillar: <b>Finance</b>. Next modules consume this
            one: continuous compounding (introduces <em>e</em>),{" "}
            <Link to="/modules/log">log-likelihood</Link>, half-life (where 반감기 means something
            else entirely).
          </>,
          <>
            응용: <b>비트코인 피자</b> · 기둥: <b>금융</b>. 이 모듈을 받아쓰는 다음 모듈들: 연속
            복리 (e의 등장), <Link to="/modules/log">로그우도</Link>, 반감기 (여기서의 반감기와는
            다른 의미).
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function BitcoinPizza({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "The Bitcoin Pizza · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <PizzaSlider />
      <Arc code={code} />
      <ThreeDoors />
      <Exercises />
      <WhyNotTaught
        en={
          <>
            Most textbooks open with <span className="font-mono">log(x)</span> as "the inverse of{" "}
            <span className="font-mono">eˣ</span>" — a definition without a question. The reader
            learns the symbol before they learn the <em>need</em>. Lemma inverts the order: a
            ten-thousand-bitcoin pizza is the question, and exp/log/root fall out as the only honest
            way to answer it. The mathematics earns the page; the page does not earn the
            mathematics.
          </>
        }
        ko={
          <>
            대부분 교과서는 로그를 "<span className="font-mono">eˣ</span>의 역함수"로 정의하면서
            연다 — 질문 없는 정의. 독자는 <em>왜 필요한지</em>를 배우기 전에 기호부터 배운다.
            Lemma는 순서를 뒤집는다: 10,000 BTC짜리 피자가 질문이고, 지수·로그·거듭제곱근은 그
            질문에 정직하게 답하는 유일한 도구로 *떨어져 나온다*. 수학이 페이지를 정당화하지,
            페이지가 수학을 정당화하지 않는다.
          </>
        }
      />
      <Glossary />
      <PageFooter />
    </TermsProvider>
  );
}
