import type { ReactNode } from "react";
import { useState } from "react";
import { useApp, pick } from "../../context/AppContext";

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sub = (k: number) =>
  k
    .toString()
    .split("")
    .map((d) => SUB[+d] ?? d)
    .join("");

// A character in a formula with a tiny role-label below it. Spacers (= ( ))
// pass label="" to keep the same baseline grid.
function Tok({
  ch,
  label = "",
  cls = "text-ink",
  size = "text-[26px] max-md:text-[20px]",
  raise = false,
}: {
  ch: ReactNode;
  label?: string;
  cls?: string;
  size?: string;
  raise?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center leading-none ${raise ? "-mb-2" : ""}`}>
      <div className={`${size} ${cls} leading-none`}>{ch}</div>
      <div className="mt-2 h-3 text-[9.5px] uppercase tracking-[0.12em] leading-none text-ink-mute">
        {label}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  dotCls,
  accentCls,
  min,
  max,
  value,
  onChange,
  display,
}: {
  label: string;
  dotCls: string;
  accentCls: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <label className="grid grid-cols-[140px_1fr_60px] items-center gap-3 text-[13.5px] max-md:grid-cols-[90px_1fr_50px]">
      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-mute">
        <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-sm ${dotCls}`} aria-hidden />
        {label}
      </span>
      <input
        type="range"
        className={`w-full ${accentCls}`}
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <span className="text-right font-mono text-[12.5px] text-ink">{display}</span>
    </label>
  );
}

// Cap result so that base=10 doesn't blow up to 10^10. 1024 keeps base=2
// reaching n=10 cleanly while still containing larger bases.
const RESULT_MAX = 1024;

// Widget A — Doubling Ladder.
// Three coupled sliders: base b, exponent n, result r — all living on one
// equation b^n = r. Dragging any one updates the others. Each character of
// the formulas (밑/지수/결과/함수) carries a tiny role-label so every position
// of log_b(r) = n is visible.
export function DoublingLadder() {
  const { language } = useApp();
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(4);

  const expMaxFor = (b: number) => Math.floor(Math.log(RESULT_MAX) / Math.log(b));
  const expMax = expMaxFor(base);
  const result = base ** exponent;

  const onBaseChange = (b: number) => {
    setBase(b);
    const cap = expMaxFor(b);
    if (exponent > cap) setExponent(cap);
  };

  const onExpChange = (e: number) => setExponent(Math.max(0, Math.min(Math.round(e), expMax)));

  // Dragging r snaps exponent to the nearest integer; result re-locks to b^n.
  const onResultChange = (r: number) => {
    if (r >= 1 && base > 1) {
      const newExp = Math.round(Math.log(r) / Math.log(base));
      setExponent(Math.max(0, Math.min(newExp, expMax)));
    }
  };

  const L = {
    base: pick(language, "base", "밑"),
    exp: pick(language, "exponent", "지수"),
    res: pick(language, "result", "결과"),
    fn: pick(language, "function", "함수"),
    forward: pick(language, "forward — exponentiation", "정방향 — 거듭제곱"),
    inverse: pick(language, "inverse — logarithm", "역방향 — 로그"),
  };

  const expDisplay = exponent.toString();
  const resultDisplay = result.toLocaleString();

  return (
    <div className="mt-9 rounded-[10px] border border-rule bg-bg-card px-6 py-[22px]">
      <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute">
        {pick(language, "Widget A — Doubling ladder", "위젯 A — 두 배의 사다리")}
      </div>

      <div className="grid gap-3 rounded-md bg-rule-soft px-4 py-5 font-mono">
        {/* Section header — forward */}
        <div className="text-center text-[10px] uppercase tracking-[0.18em] text-ink-mute">
          {L.forward}
        </div>

        {/* b ⁿ = r with per-char labels */}
        <div className="flex items-end justify-center gap-1.5 max-md:gap-1">
          <Tok ch={base} label={L.base} />
          <Tok
            ch={expDisplay}
            label={L.exp}
            cls="text-acc font-semibold"
            size="text-[20px] max-md:text-[16px]"
            raise
          />
          <Tok ch="=" cls="text-ink-mute" size="text-[26px] max-md:text-[20px] mx-2 max-md:mx-1" />
          <Tok ch={resultDisplay} label={L.res} cls="text-ink font-semibold" />
        </div>

        <div className="my-1 border-t border-dashed border-rule" />

        {/* Section header — inverse */}
        <div className="text-center text-[10px] uppercase tracking-[0.18em] text-ink-mute">
          {L.inverse}
        </div>

        {/* log_b(r) = n with per-char labels */}
        <div className="flex items-end justify-center gap-1 max-md:gap-0.5">
          <Tok ch="log" label={L.fn} cls="text-ink-soft" size="text-[22px] max-md:text-[16px]" />
          <Tok
            ch={sub(base)}
            label={L.base}
            cls="text-ink-soft"
            size="text-[16px] max-md:text-[12px]"
            raise
          />
          <Tok ch="(" cls="text-ink-mute" size="text-[22px] max-md:text-[16px]" />
          <Tok
            ch={resultDisplay}
            label={L.res}
            cls="text-ink font-semibold"
            size="text-[22px] max-md:text-[16px]"
          />
          <Tok ch=")" cls="text-ink-mute" size="text-[22px] max-md:text-[16px]" />
          <Tok ch="=" cls="text-ink-mute" size="text-[22px] max-md:text-[16px] mx-2 max-md:mx-1" />
          <Tok
            ch={expDisplay}
            label={L.exp}
            cls="text-acc font-semibold"
            size="text-[22px] max-md:text-[16px]"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-2.5">
        <SliderRow
          label={`${L.base} b`}
          dotCls="bg-ink-mute"
          accentCls="accent-ink-soft"
          min={2}
          max={10}
          value={base}
          onChange={onBaseChange}
          display={`b = ${base}`}
        />
        <SliderRow
          label={`${L.exp} n`}
          dotCls="bg-acc"
          accentCls="accent-acc"
          min={0}
          max={expMax}
          value={exponent}
          onChange={onExpChange}
          display={`n = ${expDisplay}`}
        />
        <SliderRow
          label={`${L.res} r`}
          dotCls="bg-ink"
          accentCls="accent-ink"
          min={1}
          max={base ** expMax}
          value={result}
          onChange={onResultChange}
          display={`r = ${resultDisplay}`}
        />
      </div>

      <div className="mt-3.5 border-t border-rule pt-3 text-[14.5px] text-ink-soft [&_b]:text-ink">
        {pick(
          language,
          <>
            Three sliders — <b>base b</b>, <b>exponent n</b>, <b>result r</b> — all live on the same
            equation <span className="font-mono">bⁿ = r</span>. Drag <b>n</b> and r grows or
            shrinks. Drag <b>r</b> and it snaps to the nearest power of b; the answer falls out as{" "}
            <b>n</b> — that is <span className="font-mono">log_b(r)</span>. The fact that n and r
            move together (orange follows ink) <em>is</em> the picture of{" "}
            <b>log pulling the exponent out of the result</b>.
          </>,
          <>
            세 슬라이더 — <b>밑 b</b>, <b>지수 n</b>, <b>결과 r</b> — 은 모두 같은 식{" "}
            <span className="font-mono">bⁿ = r</span> 위에 있다. <b>n</b>을 끌면 r이 자라거나
            줄어든다. <b>r</b>을 끌면 가장 가까운 b의 거듭제곱으로 스냅되고, 답이 <b>n</b>으로
            떨어진다 — 그게 곧 <span className="font-mono">log_b(r)</span>. 오렌지(n) 와 검정(r) 이
            함께 움직이는 것 자체가 <b>로그가 결과에서 지수를 꺼낸다</b>는 사실의 그림.
          </>,
        )}
      </div>
    </div>
  );
}
