import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { TermsProvider, useTermsRegistry } from "../context/terms-context";
import { Term } from "../components/term";
import { Exercise } from "../components/exercise";
import { SignAndVerify } from "../components/widgets/sign-and-verify";
import { glossary } from "../data/glossary";
import { Link } from "../lib/router";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const FORMULA_INLINE =
  "rounded-sm bg-rule-soft px-1.5 py-px font-mono text-[0.95em] text-ink whitespace-nowrap max-md:whitespace-normal";
const MONO = "font-mono text-[0.93em]";

type CodeMap = { arc2: string; arc4: string; arc5: string };

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
        {pick(language, "finance · the bitcoin signature", "금융 · 비트코인 서명")}
      </span>
    </nav>
  );
}

function Hook() {
  const { language } = useApp();
  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "the hook · proof without disclosure", "도입 · 누설 없는 증명")}
      </div>
      <h1 className="m-0 mb-6 font-serif text-[38px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[28px]">
        {pick(
          language,
          <>How do you prove a coin is yours without showing the key that unlocks it?</>,
          <>비밀키를 보여주지 않고, 이 코인이 네 것이라는 걸 어떻게 증명할까?</>,
        )}
      </h1>
      <p className="m-0 mb-5 font-serif text-[22px] leading-[1.45] text-ink-soft max-md:text-[18px] [&_em]:italic [&_em]:text-acc [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            A Bitcoin address is public — anyone can see it. The{" "}
            <Term id="private-key">private key</Term> that authorizes spending must stay secret;
            whoever sees it can spend everything you have, forever. Yet every transaction is
            verified by thousands of strangers.{" "}
            <b>
              How can the network be sure you signed this payment without ever learning the secret
              that authorizes all your payments?
            </b>
          </>,
          <>
            비트코인 주소는 공개돼 있다 — 누구나 볼 수 있다. 그 코인을 쓰게 해주는{" "}
            <Term id="private-key">개인키</Term>는 비밀이어야 한다. 그것을 본 자는 네가 가진 모든 걸
            영원히 쓸 수 있으니까. 그런데도 모든 거래는 모르는 사람 수천 명이 검증한다.{" "}
            <b>
              네트워크는 네 모든 결제를 승인할 수 있는 비밀을 *배우지 않고도*, 이번 결제를 네가
              정말로 서명했다는 걸 어떻게 확인할 수 있을까?
            </b>
          </>,
        )}
      </p>
      <p className="m-0 border-l-[3px] border-acc pl-4 text-base text-ink-soft [&_b]:font-semibold [&_b]:text-ink">
        {pick(
          language,
          <>
            The trick lives on a curve. Two operations: one easy in one direction and impossible in
            the other; one algebraic identity that only the secret-holder can produce but anyone can
            check. The widget below runs the entire dance with numbers small enough to verify by
            hand.
          </>,
          <>
            그 트릭은 곡선 위에 산다. 두 가지 연산: 하나는 한 방향으로 쉽고 반대 방향으로는
            불가능하고, 하나는 비밀을 가진 자만 만들 수 있지만 누구나 검증할 수 있는 대수 항등식.
            아래 위젯은 그 춤 전체를 손으로 검산 가능한 작은 수로 돌려본다.
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
        <h3>{pick(language, "What needs to be true", "무엇이 참이어야 하는가")}</h3>
        <p>
          {pick(
            language,
            <>
              Three properties at once: (a) <b>only you</b> can produce a valid signature for a
              given message, (b) <b>anyone</b> can check it, (c) checking it does <em>not</em>{" "}
              reveal what made it producible. No password scheme satisfies all three — passwords
              must be shown to be checked. We need a one-way function: easy in the producing
              direction, impossible in the recovering direction, with a clean algebraic identity
              tying the two together.
            </>,
            <>
              세 가지가 동시에 참이어야 한다. (a) <b>너만이</b> 주어진 메시지에 대한 유효 서명을
              만들 수 있다, (b) <b>누구나</b> 그것을 검증할 수 있다, (c) 검증이 *생산* 능력의 비밀을
              드러내지 <em>않는다</em>. 어떤 비밀번호 방식도 셋을 다 만족시키지 못한다 — 비밀번호는
              검증되려면 보여져야 하니까. 일방통행 함수가 필요하다: 생산 쪽으로는 쉽고, 복구
              쪽으로는 불가능하며, 둘을 잇는 깔끔한 대수 항등식을 갖춘.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={2}>
        <h3>
          {pick(
            language,
            "The one-way function — scalar multiplication on a curve",
            "일방통행 함수 — 곡선 위의 스칼라 곱셈",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              Take an <Term id="elliptic-curve">elliptic curve</Term>{" "}
              <span className={FORMULA_INLINE}>y² = x³ + 7</span> over a finite field. The points of
              this curve form a group: any two points have a sum, computed by the very{" "}
              <Link
                to="/modules/bezout"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                chord-and-tangent construction
              </Link>{" "}
              that makes Bezout's count work. Pick a generator <span className={MONO}>G</span>;
              repeated addition gives <Term id="scalar-multiplication">scalar multiplication</Term>:{" "}
              <span className={FORMULA_INLINE}>kG = G + G + ⋯ + G</span> (k times).
            </>,
            <>
              유한체 위의 <Term id="elliptic-curve">타원곡선</Term>{" "}
              <span className={FORMULA_INLINE}>y² = x³ + 7</span>을 잡자. 이 곡선의 점들은 하나의
              군을 이룬다 — 임의의 두 점에 합이 있고, 합은 베주의 셈을 작동시켰던 바로 그{" "}
              <Link
                to="/modules/bezout"
                className="border-b border-dotted text-acc no-underline hover:border-acc"
              >
                현·접선 작도
              </Link>
              로 계산된다. 생성점 <span className={MONO}>G</span>를 잡고 덧셈을 반복하면{" "}
              <Term id="scalar-multiplication">스칼라 곱셈</Term>이 된다:{" "}
              <span className={FORMULA_INLINE}>kG = G + G + ⋯ + G</span> (k번).
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              Computing <span className={MONO}>kG</span> from{" "}
              <span className={FORMULA_INLINE}>(k, G)</span> takes about{" "}
              <span className={MONO}>log₂ k</span> additions (double-and-add). Recovering{" "}
              <span className={MONO}>k</span> from <span className={FORMULA_INLINE}>(G, kG)</span>{" "}
              is the <Term id="discrete-log">discrete logarithm</Term> problem; for cryptographic
              curves like secp256k1, no algorithm is known that beats roughly{" "}
              <span className={MONO}>√n</span> work, where <span className={MONO}>n ≈ 2²⁵⁶</span>.
              That is the asymmetry the entire scheme stands on.
            </>,
            <>
              <span className={FORMULA_INLINE}>(k, G)</span>에서 <span className={MONO}>kG</span>를
              계산하는 데는 약 <span className={MONO}>log₂ k</span>번의 덧셈이면 된다 (배수-덧셈).{" "}
              <span className={FORMULA_INLINE}>(G, kG)</span>에서 <span className={MONO}>k</span>를
              복구하는 건 <Term id="discrete-log">이산 로그</Term> 문제 — secp256k1 같은 암호용
              곡선에서는 약 <span className={MONO}>√n</span> 보다 더 빠른 알고리즘이 알려져 있지
              않다 (<span className={MONO}>n ≈ 2²⁵⁶</span>). 모든 체계가 서 있는 비대칭성이다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc2} />}
      </ArcRow>

      <ArcRow n={3}>
        <h3>
          {pick(
            language,
            "Keys — the move that anyone can do, no one can undo",
            "키 — 누구나 하지만, 아무도 되돌릴 수 없는 한 수",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              Pick a random integer <span className={MONO}>d ∈ {`{1, …, n−1}`}</span> and keep it
              secret — that is your <Term id="private-key">private key</Term>. Compute{" "}
              <span className={FORMULA_INLINE}>Q = dG</span> and publish it — that is your{" "}
              <Term id="public-key">public key</Term>. Anyone can compute{" "}
              <span className={MONO}>Q</span> from <span className={MONO}>d</span> in milliseconds.
              Nobody can recover <span className={MONO}>d</span> from{" "}
              <span className={MONO}>Q</span> in this universe.
            </>,
            <>
              임의 정수 <span className={MONO}>d ∈ {`{1, …, n−1}`}</span>을 골라 비밀로 둔다 —
              이것이 <Term id="private-key">개인키</Term>.{" "}
              <span className={FORMULA_INLINE}>Q = dG</span>를 계산해 공개한다 — 이것이{" "}
              <Term id="public-key">공개키</Term>. 누구나 <span className={MONO}>d</span>에서{" "}
              <span className={MONO}>Q</span>를 밀리초 안에 계산할 수 있고, 아무도 이 우주 안에서{" "}
              <span className={MONO}>Q</span>로부터 <span className={MONO}>d</span>를 복구할 수
              없다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              In the widget, drag the <b>private key d</b> slider and watch <b>Q</b> hop around the
              curve while <b>G</b> stays fixed. Every <span className={MONO}>d</span> in{" "}
              <span className={MONO}>{`{1, …, 8}`}</span> lands on a different point of the
              subgroup. The puzzle: given the position of <b>Q</b> on the plot, can you tell which{" "}
              <span className={MONO}>d</span> produced it without trying all eight? On the toy curve
              you can; on secp256k1 you cannot.
            </>,
            <>
              위젯에서 <b>개인키 d</b> 슬라이더를 끌면 <b>G</b>는 그대로인데 <b>Q</b>가 곡선 위를
              뛰어다닌다. <span className={MONO}>{`{1, …, 8}`}</span>의 모든{" "}
              <span className={MONO}>d</span>가 부분군의 서로 다른 점에 떨어진다. 퍼즐: 그래프 위의{" "}
              <b>Q</b> 위치만 보고 <span className={MONO}>d</span>가 무엇이었는지, 여덟 개를 모두
              시도하지 않고 알아낼 수 있을까? 토이 곡선에서는 가능하고, secp256k1에서는 불가능하다.
            </>,
          )}
        </p>
      </ArcRow>

      <ArcRow n={4}>
        <h3>
          {pick(
            language,
            "Sign — commit to the message, hide the key",
            "서명 — 메시지에 묶고, 키는 숨긴다",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              The <Term id="digital-signature">signature</Term> on a message hash{" "}
              <span className={MONO}>h</span> is two numbers{" "}
              <span className={FORMULA_INLINE}>(r, s)</span>. Pick a fresh random{" "}
              <Term id="nonce">nonce</Term> <span className={MONO}>k</span>, compute{" "}
              <span className={FORMULA_INLINE}>R = kG</span>, take{" "}
              <span className={FORMULA_INLINE}>r = R.x mod n</span>, and set{" "}
              <span className={FORMULA_INLINE}>s = (h + r·d) · k⁻¹ mod n</span>. The{" "}
              <span className={MONO}>k⁻¹</span> hides <span className={MONO}>d</span>: with{" "}
              <span className={MONO}>k</span> random and secret, <span className={MONO}>s</span>{" "}
              looks random too. Without the nonce, two signatures from the same key would be a
              linear system in <span className={MONO}>d</span> — anyone could solve it.
            </>,
            <>
              메시지 해시 <span className={MONO}>h</span>에 대한{" "}
              <Term id="digital-signature">서명</Term>은 두 수{" "}
              <span className={FORMULA_INLINE}>(r, s)</span>. 새 임의 <Term id="nonce">nonce</Term>{" "}
              <span className={MONO}>k</span>를 뽑아 <span className={FORMULA_INLINE}>R = kG</span>
              를 계산하고, <span className={FORMULA_INLINE}>r = R.x mod n</span>,{" "}
              <span className={FORMULA_INLINE}>s = (h + r·d) · k⁻¹ mod n</span>.{" "}
              <span className={MONO}>k⁻¹</span>가 <span className={MONO}>d</span>를 가린다 —{" "}
              <span className={MONO}>k</span>가 임의이고 비밀이면 <span className={MONO}>s</span>도
              임의처럼 보인다. nonce가 없다면 같은 키의 두 서명은 <span className={MONO}>d</span>에
              대한 일차연립이 되어 누구나 풀 수 있다.
            </>,
          )}
        </p>
        <p>
          {pick(
            language,
            <>
              In the widget, the signer panel shows the equations live. Drag <b>d</b>, <b>h</b>, or{" "}
              <b>k</b> and the signature recomputes. Note the line labelled{" "}
              <em>verifier · only knows h, (r, s), Q</em>: the boundary between what leaves the
              signing device and what stays in it.
            </>,
            <>
              위젯의 서명자 패널은 식을 실시간으로 보여준다. <b>d</b>, <b>h</b>, <b>k</b>를 끌면
              서명이 즉시 다시 계산된다. <em>검증자 · h, (r, s), Q만 앎</em> 라고 적힌 줄이 경계 —
              서명 디바이스 밖으로 나가는 것과 안에 머무는 것의 경계.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc4} />}
      </ArcRow>

      <ArcRow n={5}>
        <h3>
          {pick(
            language,
            "Verify — the identity that holds iff you knew the key",
            "검증 — 키를 알았을 때만 성립하는 항등식",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              The verifier is given <span className={MONO}>h</span>,{" "}
              <span className={FORMULA_INLINE}>(r, s)</span>, and <span className={MONO}>Q</span> —
              nothing else. Compute <span className={FORMULA_INLINE}>u₁ = h · s⁻¹ mod n</span>,{" "}
              <span className={FORMULA_INLINE}>u₂ = r · s⁻¹ mod n</span>, then{" "}
              <span className={FORMULA_INLINE}>V = u₁G + u₂Q</span>. Accept the signature iff{" "}
              <span className={FORMULA_INLINE}>V.x ≡ r (mod n)</span>. Watch the algebra:
            </>,
            <>
              검증자는 <span className={MONO}>h</span>,{" "}
              <span className={FORMULA_INLINE}>(r, s)</span>, <span className={MONO}>Q</span>만
              받는다. 다른 것은 없다. <span className={FORMULA_INLINE}>u₁ = h · s⁻¹ mod n</span>,{" "}
              <span className={FORMULA_INLINE}>u₂ = r · s⁻¹ mod n</span>,{" "}
              <span className={FORMULA_INLINE}>V = u₁G + u₂Q</span>를 계산하고,{" "}
              <span className={FORMULA_INLINE}>V.x ≡ r (mod n)</span>이면 서명을 받아들인다. 대수 한
              줄을 따라가 보자:
            </>,
          )}
        </p>
        <pre className="my-2 overflow-x-auto rounded-md bg-rule-soft p-3 font-mono text-[13px] leading-[1.55] text-ink">
          {`V = u₁·G + u₂·Q
  = (h/s)·G + (r/s)·dG
  = ((h + r·d)/s)·G                       ← group up by G
  = ((h + r·d) · k / (h + r·d))·G        ← s = (h + r·d)/k
  = k·G
  = R                                      ← so V.x = R.x = r ✓`}
        </pre>
        <p>
          {pick(
            language,
            <>
              The line <span className={MONO}>s = (h + r·d)/k</span> hides{" "}
              <span className={MONO}>d</span> from anyone who only sees{" "}
              <span className={MONO}>(r, s, h, Q)</span>; the same line, plugged into{" "}
              <span className={MONO}>V = u₁G + u₂Q</span>, makes <span className={MONO}>V</span>{" "}
              *exactly* equal <span className={MONO}>R</span>. The verifier never recovers{" "}
              <span className={MONO}>d</span> and yet arrives at the same point the signer used.
              That coincidence — produced only by knowing <span className={MONO}>d</span>, checked
              without — is the <em>signature</em> of the entire scheme, in both senses of the word.
            </>,
            <>
              <span className={MONO}>s = (h + r·d)/k</span>이라는 줄이{" "}
              <span className={MONO}>(r, s, h, Q)</span>만 보는 자에게서{" "}
              <span className={MONO}>d</span>를 가리고, 같은 줄을{" "}
              <span className={MONO}>V = u₁G + u₂Q</span>에 끼워 넣으면{" "}
              <span className={MONO}>V</span>가 *정확히* <span className={MONO}>R</span>이 된다.
              검증자는 <span className={MONO}>d</span>를 복구하지 않고도 서명자가 도달했던 그 점에
              도달한다. 이 우연 — <span className={MONO}>d</span>를 알아야만 만들 수 있고,{" "}
              <span className={MONO}>d</span>를 모르고도 검증할 수 있는 — 가 이 체계의 본질이다.
            </>,
          )}
        </p>
        {mode === "code" && <Code html={code.arc5} />}
      </ArcRow>

      <ArcRow n={6}>
        <h3>
          {pick(
            language,
            "secp256k1 — the same algorithm, bigger numbers",
            "secp256k1 — 같은 알고리즘, 더 큰 수",
          )}
        </h3>
        <p>
          {pick(
            language,
            <>
              Bitcoin runs the same group law and the same ECDSA equations on{" "}
              <Term id="secp256k1">secp256k1</Term>:{" "}
              <span className={FORMULA_INLINE}>y² = x³ + 7</span> over the prime{" "}
              <span className={FORMULA_INLINE}>p = 2²⁵⁶ − 2³² − 977</span>. The widget above is a
              microscopic version: 17 instead of <span className={MONO}>2²⁵⁶</span>, subgroup order
              9 instead of <span className={MONO}>~2²⁵⁶</span>. The algorithm is identical. The only
              thing that scales is the gap between <em>multiplying</em> (still{" "}
              <span className={MONO}>O(log k)</span>) and <em>recovering</em> (now{" "}
              <span className={MONO}>~2¹²⁸</span>). That gap is the only reason your wallet is safe.
            </>,
            <>
              비트코인은 <Term id="secp256k1">secp256k1</Term> — 소수{" "}
              <span className={FORMULA_INLINE}>p = 2²⁵⁶ − 2³² − 977</span> 위의{" "}
              <span className={FORMULA_INLINE}>y² = x³ + 7</span> — 위에서 같은 군 법칙과 같은 ECDSA
              식을 돌린다. 위 위젯은 그 미니어처 버전: <span className={MONO}>2²⁵⁶</span> 대신 17,{" "}
              <span className={MONO}>~2²⁵⁶</span> 대신 부분군 차수 9. 알고리즘은 동일. 스케일이
              변하는 건 단 하나, *곱셈* (여전히 <span className={MONO}>O(log k)</span>) 과 *복구*
              (이제 <span className={MONO}>~2¹²⁸</span>) 사이의 격차. 그 격차가 너의 지갑이 안전한
              유일한 이유.
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
            <b>Sign with d. Verify without d.</b> A signature is a number you can only produce by
            knowing the key, and anyone can check by walking around it. Same key authorizes and
            refuses to be revealed.
          </>,
          <>
            <b>d로 서명하고, d 없이 검증한다.</b> 서명은 키를 알아야만 만들 수 있고, 누구나 그
            주위를 돌아 확인할 수 있는 수다. 같은 키가 결제를 승인하면서, 동시에 자신의 노출을
            거부한다.
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
        tag={{ en: "scalar multiplication by hand", ko: "손으로 스칼라 곱셈" }}
        prompt={{
          en: (
            <>
              On <span className={FORMULA_INLINE}>y² = x³ + 7 (mod 17)</span> with{" "}
              <span className={FORMULA_INLINE}>G = (1, 5)</span>, compute <b>3G</b> using the
              chord-and-tangent group law: first 2G by doubling, then add G. Verify your answer
              against the widget.
            </>
          ),
          ko: (
            <>
              <span className={FORMULA_INLINE}>y² = x³ + 7 (mod 17)</span>,{" "}
              <span className={FORMULA_INLINE}>G = (1, 5)</span>에서 현·접선 군 법칙으로 <b>3G</b>를
              계산하라. 먼저 2배로 2G, 그 다음 G를 더한다. 답을 위젯과 맞춰보자.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              <b>2G:</b> doubling, λ = (3·1² + 0)/(2·5) = 3/10. 10⁻¹ mod 17 = 12 (since 10·12 = 120
              = 7·17 + 1), so λ = 3·12 = 36 ≡ 2. xR = 2² − 1 − 1 = 2. yR = 2·(1 − 2) − 5 = −7 ≡ 10.{" "}
              <b>2G = (2, 10)</b>.<br />
              <b>3G = 2G + G:</b> λ = (10 − 5)/(2 − 1) = 5. xR = 25 − 2 − 1 = 22 ≡ 5. yR = 5·(2 − 5)
              − 10 = −25 ≡ 9. <b>3G = (5, 9)</b>. ✓
            </>
          ),
          ko: (
            <>
              <b>2G:</b> 두 배. λ = (3·1² + 0)/(2·5) = 3/10. 10⁻¹ mod 17 = 12 (10·12 = 120 = 7·17 +
              1), 그래서 λ = 3·12 = 36 ≡ 2. xR = 2² − 1 − 1 = 2. yR = 2·(1 − 2) − 5 = −7 ≡ 10.{" "}
              <b>2G = (2, 10)</b>.<br />
              <b>3G = 2G + G:</b> λ = (10 − 5)/(2 − 1) = 5. xR = 25 − 2 − 1 = 22 ≡ 5. yR = 5·(2 − 5)
              − 10 = −25 ≡ 9. <b>3G = (5, 9)</b>. ✓
            </>
          ),
        }}
      />

      <Exercise
        number={2}
        tag={{ en: "sign by hand", ko: "손으로 서명" }}
        prompt={{
          en: (
            <>
              With <b>d = 3</b>, <b>h = 4</b>, <b>k = 2</b>, produce the ECDSA signature{" "}
              <span className={FORMULA_INLINE}>(r, s)</span>. You may use{" "}
              <span className={FORMULA_INLINE}>2G = (2, 10)</span> from exercise 1. Confirm in the
              widget by setting d, h, k to these values.
            </>
          ),
          ko: (
            <>
              <b>d = 3</b>, <b>h = 4</b>, <b>k = 2</b>일 때 ECDSA 서명{" "}
              <span className={FORMULA_INLINE}>(r, s)</span>를 만들어라. 문제 1의{" "}
              <span className={FORMULA_INLINE}>2G = (2, 10)</span>을 써도 된다. 위젯의 d, h, k를 이
              값으로 두고 확인.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              R = kG = 2G = (2, 10), so r = 2 mod 9 = <b>2</b>. k⁻¹ mod 9 = 5 (because 2·5 = 10 ≡ 1
              mod 9). s = (h + r·d)·k⁻¹ = (4 + 2·3)·5 = 10·5 = 50 mod 9 = <b>5</b>. Signature{" "}
              <b>(r, s) = (2, 5)</b>.
            </>
          ),
          ko: (
            <>
              R = kG = 2G = (2, 10), 즉 r = 2 mod 9 = <b>2</b>. k⁻¹ mod 9 = 5 (2·5 = 10 ≡ 1 mod 9).
              s = (h + r·d)·k⁻¹ = (4 + 2·3)·5 = 10·5 = 50 mod 9 = <b>5</b>. 서명{" "}
              <b>(r, s) = (2, 5)</b>.
            </>
          ),
        }}
      />

      <Exercise
        number={3}
        tag={{ en: "verify by hand", ko: "손으로 검증" }}
        prompt={{
          en: (
            <>
              You receive <b>h = 4</b>, signature <b>(r, s) = (2, 5)</b>, and public key{" "}
              <span className={FORMULA_INLINE}>Q = 3G = (5, 9)</span>. Run the verifier equations:
              compute u₁, u₂, then V = u₁G + u₂Q, and check V.x mod 9 = r.
            </>
          ),
          ko: (
            <>
              <b>h = 4</b>, 서명 <b>(r, s) = (2, 5)</b>, 공개키{" "}
              <span className={FORMULA_INLINE}>Q = 3G = (5, 9)</span>를 받았다. 검증자 식을 돌려라:
              u₁, u₂를 구하고, V = u₁G + u₂Q를 계산해 V.x mod 9 = r 인지 확인.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              s⁻¹ mod 9 = 2 (5·2 = 10 ≡ 1). u₁ = h·s⁻¹ = 4·2 = 8. u₂ = r·s⁻¹ = 2·2 = 4. So V = 8G +
              4Q = 8G + 4·3G = 8G + 12G = 20G = 20 mod 9 G = <b>2G = (2, 10)</b>. V.x mod 9 = 2 = r
              ✓. Note V = 2G = R = kG, exactly the point the signer used — without ever learning d.
            </>
          ),
          ko: (
            <>
              s⁻¹ mod 9 = 2 (5·2 = 10 ≡ 1). u₁ = h·s⁻¹ = 4·2 = 8. u₂ = r·s⁻¹ = 2·2 = 4. 그러므로 V =
              8G + 4Q = 8G + 4·3G = 8G + 12G = 20G = 20 mod 9 G = <b>2G = (2, 10)</b>. V.x mod 9 = 2
              = r ✓. V = 2G = R = kG — 서명자가 썼던 바로 그 점, d를 한 번도 배우지 않고.
            </>
          ),
        }}
      />

      <Exercise
        number={4}
        tag={{ en: "the forger's frustration", ko: "위조자의 좌절" }}
        prompt={{
          en: (
            <>
              A forger doesn't know <b>d</b>, but tries to invent a signature{" "}
              <span className={FORMULA_INLINE}>(r', s')</span> for some message hash{" "}
              <span className={MONO}>h</span> and a target public key Q. Explain — without proof,
              just the structure — why almost any guess fails the verify check. What would the
              forger have to know to succeed?
            </>
          ),
          ko: (
            <>
              위조자는 <b>d</b>를 모르지만 어떤 메시지 해시 <span className={MONO}>h</span>와 타겟
              공개키 Q에 대해 서명 <span className={FORMULA_INLINE}>(r', s')</span>을 지어내려 한다.
              증명 말고 *구조* 차원에서 — 거의 모든 시도가 왜 검증을 통과하지 못하는지 설명하고,
              위조에 성공하려면 뭐를 알아야 하는지 답하라.
            </>
          ),
        }}
        solution={{
          en: (
            <>
              Verify computes V = u₁G + u₂Q, a point on the curve. The check is V.x mod n = r'. For
              a random guess of (r', s'), V is essentially a random point of the subgroup, so V.x is
              uniform over n possibilities; the chance of matching r' is ~1/n. With n ≈ 2²⁵⁶, that's
              hopeless. To force a match, the forger would need either (a) <em>d</em>, the discrete
              log of Q, or (b) a way to choose r' equal to V.x <em>after</em> picking u₁, u₂ — but
              r' is one of u₁, u₂'s inputs, so this is circular. ECDSA's security rests exactly on
              (a) being infeasible and (b) being circular.
            </>
          ),
          ko: (
            <>
              검증은 V = u₁G + u₂Q를 계산해 V.x mod n = r'을 확인한다. 임의 추측 (r', s')에서 V는
              본질적으로 부분군의 임의 점이라 V.x는 n개 값 중 균일분포 — r'과 일치할 확률은 약 1/n.
              n ≈ 2²⁵⁶이면 절망적. 일치를 강제하려면 위조자는 (a) Q의 이산 로그인 <em>d</em>를
              알거나, (b) u₁, u₂를 정한 *후*에 r'을 V.x에 맞춰 고를 수 있어야 한다. 그런데 r'이 u₁,
              u₂의 입력이라 (b)는 순환. ECDSA의 안전성은 정확히 (a)가 불가능하고 (b)가 순환이라는 데
              기댄다.
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
            application: <b>The Bitcoin Signature</b>. Consumes the{" "}
            <Link to="/modules/bezout">Bezout</Link> module via its chord-and-tangent group law.
            Sister application: <Link to="/finance/bitcoin-pizza">Bitcoin Pizza</Link>.
          </>,
          <>
            응용: <b>비트코인 서명</b>. <Link to="/modules/bezout">베주</Link> 모듈의 현·접선 군
            법칙을 소비한다. 자매 응용: <Link to="/finance/bitcoin-pizza">비트코인 피자</Link>.
          </>,
        )}
      </div>
      <div className="text-[11px]">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function BitcoinSignature({ code }: { code: CodeMap }) {
  useEffect(() => {
    document.title = "The Bitcoin Signature · Lemma";
  }, []);
  return (
    <TermsProvider>
      <Breadcrumb />
      <Hook />
      <SignAndVerify />
      <Arc code={code} />
      <Pin />
      <Exercises />
      <GlossaryList />
      <PageFooter />
    </TermsProvider>
  );
}
