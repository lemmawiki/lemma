import { useContext, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Objective Explorer.
//
// One real input x ∈ [-3, 3], one objective f(x) the reader is trying to
// minimize. Four presets shape f differently:
//   • convex     — single bowl, every step downhill lands in the unique min
//   • plateau    — long flat region, gradient near zero, progress stalls
//   • two valleys — local + global minimum, start side decides outcome
//   • noisy      — convex trend plus a sin ripple, lots of small local mins
//
// The reader drags x with a slider, or clicks "step" to apply one gradient-
// descent update x ← x − α · f'(x). A trail of recent positions shows the
// trajectory. Step size α is a second slider. The point of the widget is to
// SEE — across all four presets — how the same machine (move down the
// derivative) produces very different outcomes depending on the geometry.

const X_MIN = -3;
const X_MAX = 3;

type Preset = "convex" | "plateau" | "twoValleys" | "noisy";

interface Field {
  // f(x) and f'(x) chosen so both are analytic and the graph stays in range.
  f: (x: number) => number;
  df: (x: number) => number;
  // The "true" minimum to display as a target marker.
  trueMin: number;
  // Display window for f(x).
  fMin: number;
  fMax: number;
}

const FIELDS: Record<Preset, Field> = {
  convex: {
    f: (x) => (x - 1.0) * (x - 1.0),
    df: (x) => 2 * (x - 1.0),
    trueMin: 1.0,
    fMin: 0,
    fMax: 16,
  },
  plateau: {
    // tanh-shaped: very flat at the right side, steep entry on the left.
    f: (x) => -1.5 * Math.tanh(0.9 * (x + 0.5)) + 2,
    df: (x) => {
      const t = Math.tanh(0.9 * (x + 0.5));
      return -1.5 * 0.9 * (1 - t * t);
    },
    trueMin: X_MAX, // never actually reaches it inside the window
    fMin: 0,
    fMax: 4,
  },
  twoValleys: {
    // Two wells: local at x ≈ -1.5 (shallow), global at x ≈ +1.5 (deeper).
    // f(x) = x⁴/4 − x²·1.2 + 0.25·x  (the linear tilt asymmetrizes the wells)
    f: (x) => (x * x * x * x) / 4 - 1.2 * x * x + 0.25 * x + 1.6,
    df: (x) => x * x * x - 2.4 * x + 0.25,
    trueMin: 1.563, // numerical: solution of x³ - 2.4x + 0.25 = 0 near +1.5
    fMin: 0,
    fMax: 6,
  },
  noisy: {
    // Convex bowl with sinusoidal ripple → many shallow local mins.
    f: (x) => 0.5 * (x - 0.5) * (x - 0.5) + 0.4 * Math.sin(3.5 * x),
    df: (x) => x - 0.5 + 0.4 * 3.5 * Math.cos(3.5 * x),
    trueMin: 0.5, // approximate; sin ripple shifts it slightly
    fMin: -1,
    fMax: 6,
  },
};

const PRESET_LABEL: Record<Preset, { en: string; ko: string }> = {
  convex: { en: "convex bowl", ko: "볼록 그릇" },
  plateau: { en: "flat plateau", ko: "평평한 고원" },
  twoValleys: { en: "two valleys", ko: "두 골짜기" },
  noisy: { en: "noisy", ko: "잡음 있는" },
};

const W = 520;
const H_PX = 220;
const PAD_L = 38;
const PAD_R = 14;
const PAD_T = 18;
const PAD_B = 32;

const N_CURVE_POINTS = 200;
const TRAIL_CAP = 12;

const fmt = (v: number, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "—");

export function ObjectiveExplorer({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [preset, setPreset] = useState<Preset>("convex");
  const [x, setX] = useState(-2.4);
  const [alpha, setAlpha] = useState(0.3);
  const [trail, setTrail] = useState<number[]>([]);

  const field = FIELDS[preset];
  const fx = field.f(x);
  const slope = field.df(x);

  const innerW = W - PAD_L - PAD_R;
  const innerH = H_PX - PAD_T - PAD_B;
  const xS = (xv: number) => PAD_L + ((xv - X_MIN) / (X_MAX - X_MIN)) * innerW;
  const yS = (fv: number) =>
    PAD_T +
    (1 -
      (Math.min(Math.max(fv, field.fMin), field.fMax) - field.fMin) / (field.fMax - field.fMin)) *
      innerH;

  // Curve path.
  const curvePath = (() => {
    const parts: string[] = [];
    for (let i = 0; i <= N_CURVE_POINTS; i++) {
      const xv = X_MIN + (i / N_CURVE_POINTS) * (X_MAX - X_MIN);
      const fv = field.f(xv);
      parts.push(`${i === 0 ? "M" : "L"}${xS(xv).toFixed(2)},${yS(fv).toFixed(2)}`);
    }
    return parts.join(" ");
  })();

  function doStep() {
    const nextX = x - alpha * slope;
    const clamped = Math.max(X_MIN, Math.min(X_MAX, nextX));
    setX(clamped);
    setTrail((prev) => {
      const next = [...prev, x];
      return next.slice(-TRAIL_CAP);
    });
  }

  function changePreset(p: Preset) {
    setPreset(p);
    setTrail([]);
    setX(-2.4); // restart from same left side every preset switch
  }

  function reset() {
    setX(-2.4);
    setTrail([]);
  }

  // Trail render (faded dots).
  const trailDots = trail.map((tx, i) => ({
    x: xS(tx),
    y: yS(FIELDS[preset].f(tx)),
    key: `tr-${i}-${tx.toFixed(3)}`,
    opacity: 0.1 + 0.5 * (i / Math.max(trail.length - 1, 1)),
  }));

  const stopped = Math.abs(slope) < 0.01;

  return (
    <WidgetShell kicker={pick(language, "Widget — Objective explorer", "위젯 — 목적 탐색기")}>
      <div className="mb-3.5 grid grid-cols-4 gap-x-6 gap-y-2 rounded-md bg-rule-soft px-3.5 py-2.5 font-mono text-[13.5px] max-md:grid-cols-2">
        <Stat label={pick(language, "current x", "현재 x")} value={fmt(x)} color={C.curve} />
        <Stat label={pick(language, "f(x)", "f(x)")} value={fmt(fx)} color={C.curveAlt} />
        <Stat
          label={pick(language, "slope f'(x)", "기울기 f'(x)")}
          value={fmt(slope)}
          color={C.secant}
        />
        <Stat
          label={pick(language, "status", "상태")}
          value={stopped ? pick(language, "stopped", "정지") : pick(language, "moving", "움직임")}
          color={stopped ? C.axis : C.curve}
        />
      </div>

      <svg
        viewBox={`0 0 ${W} ${H_PX}`}
        className="my-2 block h-auto w-full rounded-md border border-rule bg-bg-card"
        role="img"
        aria-label={pick(
          language,
          "objective function curve with current position and step trail",
          "목적 함수 곡선, 현재 위치와 스텝 자취",
        )}
      >
        {/* baseline */}
        <line
          x1={PAD_L}
          y1={PAD_T + innerH}
          x2={PAD_L + innerW}
          y2={PAD_T + innerH}
          stroke={C.axis}
          strokeWidth={1}
        />

        {/* x ticks at integer values */}
        {[-3, -2, -1, 0, 1, 2, 3].map((tv) => (
          <g key={`xt${tv}`}>
            <line
              x1={xS(tv)}
              y1={PAD_T + innerH}
              x2={xS(tv)}
              y2={PAD_T + innerH + 4}
              stroke={C.axis}
              strokeWidth={0.6}
            />
            <text
              x={xS(tv)}
              y={PAD_T + innerH + 16}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
              className="fill-ink-mute"
            >
              {tv}
            </text>
          </g>
        ))}

        {/* true minimum marker */}
        {field.trueMin >= X_MIN && field.trueMin <= X_MAX && (
          <line
            x1={xS(field.trueMin)}
            y1={PAD_T}
            x2={xS(field.trueMin)}
            y2={PAD_T + innerH}
            stroke={C.axis}
            strokeWidth={0.6}
            strokeDasharray="3 4"
            opacity={0.45}
          />
        )}

        {/* objective curve */}
        <path d={curvePath} fill="none" stroke={C.curveAlt} strokeWidth={1.8} />

        {/* trail */}
        {trailDots.map((d) => (
          <circle key={d.key} cx={d.x} cy={d.y} r={3} fill={C.curve} opacity={d.opacity} />
        ))}

        {/* current position */}
        <circle cx={xS(x)} cy={yS(fx)} r={5.5} fill={C.curve} stroke="white" strokeWidth={1.5} />

        {/* tangent at current position — short segment showing slope direction */}
        {(() => {
          const dx = 0.5;
          const x0 = Math.max(X_MIN, x - dx);
          const x1 = Math.min(X_MAX, x + dx);
          const y0 = fx + slope * (x0 - x);
          const y1 = fx + slope * (x1 - x);
          return (
            <line
              x1={xS(x0)}
              y1={yS(y0)}
              x2={xS(x1)}
              y2={yS(y1)}
              stroke={C.secant}
              strokeWidth={1.5}
              opacity={0.85}
            />
          );
        })()}
      </svg>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
          {pick(language, "preset", "프리셋")}
        </span>
        {(Object.keys(FIELDS) as Preset[]).map((id) => (
          <button
            key={`pre-${id}`}
            type="button"
            onClick={() => changePreset(id)}
            className={pillClass(preset === id)}
          >
            {pick(language, PRESET_LABEL[id].en, PRESET_LABEL[id].ko)}
          </button>
        ))}
        <span className="ml-auto inline-flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={doStep} className={pillClass(false)}>
            {pick(language, `step  x ← x − α · f'(x)`, "스텝  x ← x − α · f'(x)")}
          </button>
          <button type="button" onClick={reset} className={pillClass(false)}>
            {pick(language, "reset", "리셋")}
          </button>
        </span>
      </div>

      <div className="grid gap-2.5">
        <Slider
          label={pick(language, "position x", "위치 x")}
          value={x}
          onChange={(v) => {
            setX(v);
            setTrail([]);
          }}
          min={X_MIN}
          max={X_MAX}
          step={0.05}
          accent={C.curve}
          display={fmt(x)}
        />
        <Slider
          label={pick(language, "step size α", "스텝 크기 α")}
          value={alpha}
          onChange={setAlpha}
          min={0.02}
          max={1.5}
          step={0.02}
          accent={C.secant}
          display={fmt(alpha)}
        />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            One input <b>x</b>, one objective <b>f(x)</b> you are trying to minimize. The dashed
            vertical line marks the *true* minimum (if it exists in the window). Click <b>step</b>{" "}
            to apply one update <em>x ← x − α · f'(x)</em>: move in the direction the slope says is
            better, by α. The orange tangent shows that direction at your current x. Try{" "}
            <b>convex</b> with a small α — steady progress to the bottom. Try <b>plateau</b> — the
            slope is near zero, so each step barely moves. Try <b>two valleys</b> from x = −2.4 with
            small α — you fall into the *left* valley, a local minimum, and stop short of the deeper
            right one. Try <b>noisy</b> — you stop at the first ripple your step size can't escape.
            *Same machine, four outcomes.*
          </>,
          <>
            입력 <b>x</b> 하나, 최소화하려는 목적 <b>f(x)</b> 하나. 점선 세로선은 *진짜* 최솟값 (창
            안에 있을 때) 을 표시한다. <b>스텝</b>을 누르면 한 갱신 <em>x ← x − α · f'(x)</em>이
            적용된다 — 기울기가 *더 좋은 쪽*이라 말하는 방향으로 α만큼 움직인다. 주황 접선이 현재 x
            에서의 그 방향을 보여준다. <b>볼록 그릇</b>에 작은 α — 바닥까지 꾸준히 내려간다.{" "}
            <b>평평한 고원</b> — 기울기가 0에 가까워 한 스텝당 거의 움직이지 않는다.{" "}
            <b>두 골짜기</b>
            를 x = −2.4에서 작은 α로 — *왼쪽* 골짜기, 국소 최솟값에 떨어져 더 깊은 오른쪽에는 닿지
            못한다. <b>잡음 있는</b> — 스텝이 넘지 못하는 첫 잔물결에서 멈춘다. *같은 기계, 네
            결과.*
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
