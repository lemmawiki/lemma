import { useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Widget — Tangent Approximation.
// f(x) = sin(x) over [-π, π], with the tangent line at a slidable anchor a.
// The reader chooses an evaluation point x and reads off three numbers:
// true f(x), the linear approximation tangent(x), and the error
// |f(x) - tangent(x)|. The error scales as ~(x-a)²/2 for smooth f, so
// doubling the deviation quadruples the error — the entire content of
// "linear works only in a small regime" made directly visible.

const PI = Math.PI;

function F(x: number): number {
  return Math.sin(x);
}
function FPRIME(x: number): number {
  return Math.cos(x);
}

const X_MIN = -PI;
const X_MAX = PI;
const Y_MIN = -1.4;
const Y_MAX = 1.4;

const W = 540;
const H = 320;
const PAD_X = 38;
const PAD_Y = 30;

const sx = (x: number) => PAD_X + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD_X);
const sy = (y: number) => H - PAD_Y - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD_Y);

const COLOR = {
  curve: "#1e6da6",
  tangent: "#7a5c2c",
  anchor: "#3a8c4a",
  evalTrue: "#1e6da6",
  evalApprox: "#b6451e",
  error: "#b6451e",
  axis: "#9ca3a4",
} as const;

function fmt(n: number, d = 4): string {
  return n.toFixed(d);
}

export function TangentApproximation() {
  const { language } = useApp();
  const [a, setA] = useState(0);
  const [x, setX] = useState(0.8);

  const fa = F(a);
  const fpa = FPRIME(a);
  const tangentAt = (xx: number) => fa + fpa * (xx - a);
  const trueVal = F(x);
  const approxVal = tangentAt(x);
  const error = trueVal - approxVal;
  const dev = x - a;
  const errorOverDevSq = Math.abs(dev) > 1e-6 ? error / (dev * dev) : 0;

  // Curve points
  const curvePts = (() => {
    const pts: string[] = [];
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const xx = X_MIN + ((X_MAX - X_MIN) * i) / N;
      pts.push(`${sx(xx)},${sy(F(xx))}`);
    }
    return pts.join(" ");
  })();

  // Tangent line clipped to plot frame
  function clipTangent(): { x: number; y: number }[] {
    const out: { x: number; y: number }[] = [];
    for (const xEnd of [X_MIN, X_MAX]) {
      let xx = xEnd;
      let yy = tangentAt(xx);
      if (yy < Y_MIN) {
        yy = Y_MIN;
        xx = a + (yy - fa) / (fpa || 1e-9);
      } else if (yy > Y_MAX) {
        yy = Y_MAX;
        xx = a + (yy - fa) / (fpa || 1e-9);
      }
      out.push({ x: xx, y: yy });
    }
    return out;
  }
  const tline = clipTangent();

  return (
    <WidgetShell kicker={pick(language, "Widget — Tangent approximation", "위젯 — 접선 근사")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "f(x) — true", "f(x) — 실제")}
          value={fmt(trueVal)}
          color={COLOR.evalTrue}
        />
        <Stat
          label={pick(language, "approx — tangent", "근사 — 접선")}
          value={fmt(approxVal)}
          color={COLOR.evalApprox}
        />
        <Stat
          label={pick(language, "error", "오차")}
          value={fmt(error)}
          color={Math.abs(error) > 0.05 ? COLOR.error : undefined}
        />
        <Stat
          label={pick(language, "error / (x − a)²", "오차 / (x − a)²")}
          value={Math.abs(dev) > 0.01 ? fmt(errorOverDevSq, 3) : "—"}
        />
      </div>

      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label={pick(
            language,
            "sin curve with tangent line at anchor a and evaluation point x",
            "sin 곡선과 기준점 a에서의 접선, 평가점 x",
          )}
        >
          {/* axes */}
          <line
            x1={PAD_X}
            y1={sy(0)}
            x2={W - PAD_X}
            y2={sy(0)}
            stroke={COLOR.axis}
            strokeWidth={0.8}
          />
          <line
            x1={sx(0)}
            y1={PAD_Y}
            x2={sx(0)}
            y2={H - PAD_Y}
            stroke={COLOR.axis}
            strokeWidth={0.8}
          />
          {/* x-axis ticks at multiples of π/2 */}
          {[-PI, -PI / 2, PI / 2, PI].map((v) => (
            <g key={`tx-${v.toFixed(3)}`}>
              <line
                x1={sx(v)}
                y1={sy(0) - 3}
                x2={sx(v)}
                y2={sy(0) + 3}
                stroke={COLOR.axis}
                strokeWidth={0.7}
              />
              <text
                x={sx(v)}
                y={sy(0) + 14}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                fill={COLOR.axis}
              >
                {v < 0 ? "−" : ""}
                {Math.abs(v) === PI ? "π" : "π/2"}
              </text>
            </g>
          ))}
          {/* y ticks at ±1 */}
          {[-1, 1].map((v) => (
            <g key={`ty-${v}`}>
              <line
                x1={sx(0) - 3}
                y1={sy(v)}
                x2={sx(0) + 3}
                y2={sy(v)}
                stroke={COLOR.axis}
                strokeWidth={0.7}
              />
              <text
                x={sx(0) - 6}
                y={sy(v) + 3}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                fill={COLOR.axis}
              >
                {v}
              </text>
            </g>
          ))}

          {/* sin curve */}
          <polyline points={curvePts} fill="none" stroke={COLOR.curve} strokeWidth={2} />

          {/* tangent line */}
          <line
            x1={sx(tline[0].x)}
            y1={sy(tline[0].y)}
            x2={sx(tline[1].x)}
            y2={sy(tline[1].y)}
            stroke={COLOR.tangent}
            strokeWidth={1.6}
            strokeDasharray="5 4"
          />

          {/* anchor (a, f(a)) */}
          <circle
            cx={sx(a)}
            cy={sy(fa)}
            r={6}
            fill={COLOR.anchor}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={sx(a) - 12}
            y={sy(fa) - 9}
            textAnchor="end"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={COLOR.anchor}
          >
            a
          </text>

          {/* error gap: vertical line from approx to true at x */}
          {Math.abs(error) > 1e-3 && (
            <line
              x1={sx(x)}
              y1={sy(approxVal)}
              x2={sx(x)}
              y2={sy(trueVal)}
              stroke={COLOR.error}
              strokeWidth={1.6}
              strokeDasharray="2 2"
            />
          )}

          {/* eval point on tangent (approx) */}
          <circle
            cx={sx(x)}
            cy={sy(approxVal)}
            r={5}
            fill={COLOR.evalApprox}
            stroke="white"
            strokeWidth={1.5}
          />
          {/* eval point on curve (true) */}
          <circle
            cx={sx(x)}
            cy={sy(trueVal)}
            r={5}
            fill={COLOR.evalTrue}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={sx(x) + 8}
            y={sy(Math.max(trueVal, approxVal)) - 7}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={COLOR.evalTrue}
          >
            x
          </text>
        </svg>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "anchor a", "기준 a")}
          value={a}
          onChange={setA}
          min={-PI}
          max={PI}
          step={0.05}
          accent={COLOR.anchor}
          display={fmt(a, 2)}
        />
        <Slider
          label={pick(language, "evaluate at x", "평가점 x")}
          value={x}
          onChange={setX}
          min={-PI}
          max={PI}
          step={0.05}
          accent={COLOR.evalTrue}
          display={fmt(x, 2)}
        />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            With the anchor at <span className="font-mono">a = 0</span>, the tangent line is{" "}
            <span className="font-mono">y = x</span> — the famous{" "}
            <span className="font-mono">sin x ≈ x</span>. Drag <b>x</b>: at{" "}
            <span className="font-mono">x = 0.1</span> the error is below{" "}
            <span className="font-mono">0.001</span>; at <span className="font-mono">x = 1</span>{" "}
            it's near <span className="font-mono">−0.16</span>; at{" "}
            <span className="font-mono">x = π/2</span> the tangent says{" "}
            <span className="font-mono">π/2 ≈ 1.57</span> while the true value is{" "}
            <span className="font-mono">1</span>. The "error / (x − a)²" column is roughly constant
            near the anchor — that's the <em>error grows as the square of deviation</em> rule, made
            directly visible.
          </>,
          <>
            기준이 <span className="font-mono">a = 0</span>일 때 접선은{" "}
            <span className="font-mono">y = x</span> — 그 유명한{" "}
            <span className="font-mono">sin x ≈ x</span>. <b>x</b>를 끌어보면:{" "}
            <span className="font-mono">x = 0.1</span>에서 오차는{" "}
            <span className="font-mono">0.001</span> 아래; <span className="font-mono">x = 1</span>
            에서 약 <span className="font-mono">−0.16</span>;{" "}
            <span className="font-mono">x = π/2</span>에서 접선은{" "}
            <span className="font-mono">π/2 ≈ 1.57</span>이라 하지만 실제값은{" "}
            <span className="font-mono">1</span>. "오차 / (x − a)²" 칸은 기준 근처에서 거의 상수 —
            그게 <em>오차가 편차의 제곱으로 자란다</em>는 규칙, 눈으로 보이는 형태.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  accent,
  display,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  accent: string;
  display: string;
}) {
  return (
    <label className="grid grid-cols-[140px_1fr_70px] items-center gap-3 text-[13px] max-md:grid-cols-[100px_1fr_56px]">
      <span className="inline-flex items-center gap-1.5 font-mono text-ink-mute">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
          style={{ background: accent }}
          aria-hidden
        />
        {label}
      </span>
      <input
        type="range"
        className="w-full"
        style={{ accentColor: accent }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <span className="text-right font-mono text-[12.5px] text-ink">{display}</span>
    </label>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="grid">
      <span className="text-ink-mute">{label}</span>
      <span className="text-ink" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}
