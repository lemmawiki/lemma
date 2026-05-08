import { useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat } from "./widget-primitives";

// Widget — Secant to Tangent.
// Plot y = x². Two points P = (a, a²) and Q = (a+h, (a+h)²). The
// secant line through P and Q has slope (2a + h). The tangent at P has
// slope 2a. As h → 0, the secant rotates onto the tangent — the limit
// the derivative is *defined* as. The widget makes the limit visible:
// drag h toward 0 and watch the orange secant collapse onto the gray
// tangent.

const X_MIN = -0.5;
const X_MAX = 2.8;
const Y_MIN = -0.6;
const Y_MAX = 6.2;

const W = 480;
const H = 320;
const PAD_X = 36;
const PAD_Y = 28;

const COLOR = {
  curve: "#1e6da6",
  tangent: "#7a5c2c",
  secant: "#b6451e",
  point: "#3a8c4a",
  axis: "#9ca3a4",
  grid: "var(--color-rule)",
} as const;

const F = (x: number) => x * x;
const FPRIME = (x: number) => 2 * x;

function fmt(n: number, d = 3): string {
  return Number.isFinite(n) ? n.toFixed(d) : "—";
}

const sx = (x: number) => PAD_X + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD_X);
const sy = (y: number) => H - PAD_Y - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD_Y);

export function SecantToTangent() {
  const { language } = useApp();
  const [a, setA] = useState(1);
  const [h, setH] = useState(1);

  const fa = F(a);
  const fb = F(a + h);
  const slopeSecant = (fb - fa) / h;
  const slopeTangent = FPRIME(a);

  // Curve sampled.
  const curvePts = (() => {
    const pts: string[] = [];
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const x = X_MIN + ((X_MAX - X_MIN) * i) / N;
      pts.push(`${sx(x)},${sy(F(x))}`);
    }
    return pts.join(" ");
  })();

  // Clip line endpoints to the plot frame so they don't overshoot.
  // The lines pass through P = (a, fa) with the given slope; if the y
  // at x = X_MIN/X_MAX falls outside [Y_MIN, Y_MAX], reproject by
  // inverting the slope-form solve.
  function clipLine(slope: number) {
    const out: { x: number; y: number }[] = [];
    for (const xEnd of [X_MIN, X_MAX]) {
      let x = xEnd;
      let y = fa + slope * (x - a);
      if (y < Y_MIN) {
        y = Y_MIN;
        x = a + (y - fa) / slope;
      } else if (y > Y_MAX) {
        y = Y_MAX;
        x = a + (y - fa) / slope;
      }
      out.push({ x, y });
    }
    return out;
  }

  const tLine = clipLine(slopeTangent);
  const sLine = clipLine(slopeSecant);

  return (
    <WidgetShell kicker={pick(language, "Widget — Secant → tangent", "위젯 — 할선 → 접선")}>
      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label={pick(
            language,
            "secant lines on y = x² collapsing onto the tangent",
            "y = x² 위에서 할선이 접선으로 무너지는 모습",
          )}
        >
          {/* axes */}
          <line
            x1={sx(X_MIN)}
            y1={sy(0)}
            x2={sx(X_MAX)}
            y2={sy(0)}
            stroke={COLOR.axis}
            strokeWidth={0.8}
          />
          <line
            x1={sx(0)}
            y1={sy(Y_MIN)}
            x2={sx(0)}
            y2={sy(Y_MAX)}
            stroke={COLOR.axis}
            strokeWidth={0.8}
          />

          {/* curve y = x² */}
          <polyline points={curvePts} fill="none" stroke={COLOR.curve} strokeWidth={2} />

          {/* tangent (gray, always shown) */}
          <line
            x1={sx(tLine[0].x)}
            y1={sy(tLine[0].y)}
            x2={sx(tLine[1].x)}
            y2={sy(tLine[1].y)}
            stroke={COLOR.tangent}
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />

          {/* secant (orange) */}
          <line
            x1={sx(sLine[0].x)}
            y1={sy(sLine[0].y)}
            x2={sx(sLine[1].x)}
            y2={sy(sLine[1].y)}
            stroke={COLOR.secant}
            strokeWidth={2.2}
          />

          {/* P = (a, f(a)) */}
          <circle
            cx={sx(a)}
            cy={sy(fa)}
            r={6}
            fill={COLOR.point}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={sx(a) - 14}
            y={sy(fa) + 18}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={COLOR.point}
          >
            P
          </text>

          {/* Q = (a+h, f(a+h)) */}
          <circle
            cx={sx(a + h)}
            cy={sy(fb)}
            r={5}
            fill={COLOR.secant}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={sx(a + h) + 8}
            y={sy(fb) - 6}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={COLOR.secant}
          >
            Q
          </text>

          {/* axis ticks */}
          {[0, 1, 2].map((v) => (
            <g key={`tx-${v}`}>
              <line
                x1={sx(v)}
                y1={sy(0) - 3}
                x2={sx(v)}
                y2={sy(0) + 3}
                stroke={COLOR.axis}
                strokeWidth={0.8}
              />
              <text
                x={sx(v)}
                y={sy(0) + 14}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                fill={COLOR.axis}
              >
                {v}
              </text>
            </g>
          ))}
          {[1, 4].map((v) => (
            <g key={`ty-${v}`}>
              <line
                x1={sx(0) - 3}
                y1={sy(v)}
                x2={sx(0) + 3}
                y2={sy(v)}
                stroke={COLOR.axis}
                strokeWidth={0.8}
              />
              <text
                x={sx(0) - 6}
                y={sy(v) + 3}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                fill={COLOR.axis}
              >
                {v}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div
        role="status"
        aria-live="polite"
        className="mt-3 grid grid-cols-3 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-1"
      >
        <Stat
          label={pick(language, "secant slope", "할선 기울기")}
          value={`(f(a+h) − f(a))/h = ${fmt(slopeSecant, 4)}`}
          color={COLOR.secant}
        />
        <Stat
          label={pick(language, "tangent slope", "접선 기울기")}
          value={`f'(${a}) = 2·${a} = ${fmt(slopeTangent, 4)}`}
          color={COLOR.tangent}
        />
        <Stat
          label={pick(language, "difference (= h)", "차이 (= h)")}
          value={fmt(slopeSecant - slopeTangent, 4)}
        />
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "anchor a", "기준 a")}
          value={a}
          onChange={setA}
          min={0.2}
          max={2}
          step={0.05}
          accent={COLOR.point}
          display={fmt(a, 2)}
        />
        <Slider
          label={pick(language, "interval h", "구간 h")}
          value={h}
          onChange={setH}
          min={0.01}
          max={1.5}
          step={0.01}
          accent={COLOR.secant}
          display={fmt(h, 2)}
        />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Drag <b>h</b> toward 0. The orange <b>secant</b> rotates and collapses onto the brown
            dashed <b>tangent</b>; the secant slope <span className="font-mono">2a + h</span>{" "}
            approaches the tangent slope <span className="font-mono">2a</span>; the difference shown
            above shrinks to <em>exactly h</em>. That number — what the secant slope *converges to*
            as the two points merge — is the derivative <span className="font-mono">f'(a)</span>.
            Move <b>a</b> and the slope changes at a rate of 2 per unit of <b>a</b>: that is{" "}
            <span className="font-mono">d/da [2a] = 2</span> — one more derivative.
          </>,
          <>
            <b>h</b>를 0 쪽으로 끌어보자. 주황색 <b>할선</b>이 회전하며 갈색 점선 <b>접선</b>으로
            무너진다. 할선 기울기 <span className="font-mono">2a + h</span>가 접선 기울기{" "}
            <span className="font-mono">2a</span>로 다가가고, 위 차이 칸은 <em>정확히 h</em>로
            작아진다. 그 수 — 두 점이 합쳐질 때 할선 기울기가 *수렴하는* 값 — 이 미분{" "}
            <span className="font-mono">f'(a)</span>. <b>a</b>를 움직이면 기울기가 <b>a</b> 단위 당
            2의 속도로 바뀐다 — 그게 <span className="font-mono">d/da [2a] = 2</span>, 한 번 더
            미분.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
