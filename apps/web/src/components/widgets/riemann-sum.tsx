import { useContext, useMemo, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Riemann Sum.
//
// Pick a function from a small library. Drag N (rectangle count) and the
// rule (left / right / midpoint). The widget shows the rectangles, computes
// their total area, and compares to the exact integral. Watch the sum
// converge as N grows — the picture of "the integral is what survives in
// the limit."
//
// Three preset functions chosen to span easy / mid / oscillatory:
//   • velocity v(t) = g·t    over [0, 2]        (projectile-motion link)
//   • parabola f(x) = x²     over [0, 1]
//   • sine     f(x) = sin x  over [0, π]

const G = 9.8;

type FnId = "velocity" | "parabola" | "sine";
const FUNCTIONS: Record<
  FnId,
  {
    en: string;
    ko: string;
    fn: (x: number) => number;
    a: number;
    b: number;
    exact: number;
    formula: string;
  }
> = {
  velocity: {
    en: "v(t) = g·t",
    ko: "v(t) = g·t",
    fn: (t) => G * t,
    a: 0,
    b: 2,
    // ∫_0^2 g·t dt = g · t²/2 |_0^2 = g · 2 = 2g
    exact: 2 * G,
    formula: "∫₀² g·t dt = 2g",
  },
  parabola: {
    en: "f(x) = x²",
    ko: "f(x) = x²",
    fn: (x) => x * x,
    a: 0,
    b: 1,
    // ∫_0^1 x² dx = 1/3
    exact: 1 / 3,
    formula: "∫₀¹ x² dx = 1/3",
  },
  sine: {
    en: "f(x) = sin x",
    ko: "f(x) = sin x",
    fn: (x) => Math.sin(x),
    a: 0,
    b: Math.PI,
    // ∫_0^π sin x dx = 2
    exact: 2,
    formula: "∫₀π sin x dx = 2",
  },
};

type Rule = "left" | "right" | "midpoint";
const RULES: { id: Rule; en: string; ko: string }[] = [
  { id: "left", en: "left", ko: "왼쪽" },
  { id: "right", en: "right", ko: "오른쪽" },
  { id: "midpoint", en: "midpoint", ko: "중점" },
];

function riemannSum(fnId: FnId, n: number, rule: Rule): number {
  const { fn, a, b } = FUNCTIONS[fnId];
  const dx = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) {
    let x: number;
    if (rule === "left") x = a + i * dx;
    else if (rule === "right") x = a + (i + 1) * dx;
    else x = a + (i + 0.5) * dx;
    s += fn(x) * dx;
  }
  return s;
}

const W = 460;
const H = 280;
const PAD_L = 40;
const PAD_R = 16;
const PAD_T = 18;
const PAD_B = 32;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

const fmt = (n: number, d = 4) => n.toFixed(d);

// Stable per-rectangle React keys — oxlint rejects raw indices, but every
// rectangle has a fixed integer slot in [0, N_MAX), so we precompute the
// strings once.
const N_MAX = 80;
const RECT_IDS = Array.from({ length: N_MAX }, (_, i) => `r${i.toString().padStart(2, "0")}`);

export function RiemannSum({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [fnId, setFnId] = useState<FnId>("velocity");
  const [n, setN] = useState(8);
  const [rule, setRule] = useState<Rule>("midpoint");

  const cfg = FUNCTIONS[fnId];
  const sumValue = useMemo(() => riemannSum(fnId, n, rule), [fnId, n, rule]);
  const error = sumValue - cfg.exact;

  // y range — sample the function densely and pick a tight max with margin.
  const yMax = useMemo(() => {
    let m = 0;
    const STEPS = 200;
    for (let i = 0; i <= STEPS; i++) {
      const x = cfg.a + ((cfg.b - cfg.a) * i) / STEPS;
      const v = cfg.fn(x);
      if (v > m) m = v;
    }
    return m * 1.1;
  }, [cfg]);

  // Plot helpers.
  const xS = (x: number) => PAD_L + ((x - cfg.a) / (cfg.b - cfg.a)) * INNER_W;
  const yS = (y: number) => PAD_T + (1 - y / yMax) * INNER_H;

  // The curve path. Cheap to recompute (200 samples), so we drop useMemo
  // rather than wrestle with the closure-deps lint rule for xS / yS.
  const curvePath = (() => {
    const STEPS = 200;
    const parts: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const x = cfg.a + ((cfg.b - cfg.a) * i) / STEPS;
      const y = cfg.fn(x);
      parts.push(`${i === 0 ? "M" : "L"}${xS(x).toFixed(2)},${yS(y).toFixed(2)}`);
    }
    return parts.join(" ");
  })();

  // Rectangles. Same reason — cheap, and lint doesn't accept fnId as a
  // dep when cfg already covers it.
  const dx = (cfg.b - cfg.a) / n;
  const rects = (() => {
    const out: { x: number; y: number; w: number; h: number }[] = [];
    for (let i = 0; i < n; i++) {
      const x0 = cfg.a + i * dx;
      let xe: number;
      if (rule === "left") xe = x0;
      else if (rule === "right") xe = x0 + dx;
      else xe = x0 + dx / 2;
      const yv = cfg.fn(xe);
      out.push({ x: x0, y: yv, w: dx, h: yv });
    }
    return out;
  })();

  return (
    <WidgetShell kicker={pick(language, "Widget — Riemann sum", "위젯 — 리만 합")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-3 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-3"
      >
        <Stat
          label={pick(language, "Riemann sum (S_N)", "리만 합 (S_N)")}
          value={fmt(sumValue)}
          color={C.secant}
        />
        <Stat
          label={pick(language, "exact integral", "정확한 적분")}
          value={fmt(cfg.exact)}
          color={C.curveAlt}
        />
        <Stat
          label={pick(language, "error", "오차")}
          value={fmt(error)}
          color={Math.abs(error) < 0.001 ? C.curveAlt : C.secant}
        />
      </div>

      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", touchAction: "none" }}
          role="img"
          aria-label={pick(
            language,
            `Riemann sum of ${cfg.en} with ${n} rectangles`,
            `${cfg.en}의 ${n}개 직사각형 리만 합`,
          )}
        >
          {/* plot frame */}
          <rect
            x={PAD_L}
            y={PAD_T}
            width={INNER_W}
            height={INNER_H}
            fill="white"
            stroke={C.axis}
            strokeWidth={1}
          />

          {/* x-axis line */}
          <line
            x1={PAD_L}
            y1={yS(0)}
            x2={PAD_L + INNER_W}
            y2={yS(0)}
            stroke={C.axis}
            strokeWidth={0.8}
          />

          {/* x-tick labels (a, midpoint, b) */}
          {[cfg.a, (cfg.a + cfg.b) / 2, cfg.b].map((x) => (
            <text
              key={`xt-${x.toFixed(3)}`}
              x={xS(x)}
              y={PAD_T + INNER_H + 14}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
              fill={C.axis}
            >
              {x === Math.PI ? "π" : x.toFixed(x === Math.floor(x) ? 0 : 1)}
            </text>
          ))}

          {/* rectangles (drawn first so the curve sits on top) */}
          {rects.map((r, i) => (
            <rect
              key={RECT_IDS[i]}
              x={xS(r.x)}
              y={yS(r.h)}
              width={xS(r.x + r.w) - xS(r.x)}
              height={yS(0) - yS(r.h)}
              fill={C.secant}
              fillOpacity={0.18}
              stroke={C.secant}
              strokeWidth={0.6}
              strokeOpacity={0.7}
            />
          ))}

          {/* the curve */}
          <path d={curvePath} fill="none" stroke={C.curve} strokeWidth={2} />

          {/* formula caption */}
          <text
            x={PAD_L + INNER_W - 6}
            y={PAD_T + 14}
            textAnchor="end"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={C.curveAlt}
          >
            {cfg.formula}
          </text>
        </svg>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "rectangles N", "직사각형 N")}
          value={n}
          onChange={(v) => setN(Math.round(v))}
          min={1}
          max={N_MAX}
          step={1}
          accent={C.secant}
          display={`${n}`}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-mute">
            {pick(language, "function", "함수")}
          </span>
          {(Object.keys(FUNCTIONS) as FnId[]).map((id) => (
            <button
              key={`fn-${id}`}
              type="button"
              onClick={() => setFnId(id)}
              className={pillClass(fnId === id)}
            >
              {pick(language, FUNCTIONS[id].en, FUNCTIONS[id].ko)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-mute">
            {pick(language, "rule", "규칙")}
          </span>
          {RULES.map((r) => (
            <button
              key={`rule-${r.id}`}
              type="button"
              onClick={() => setRule(r.id)}
              className={pillClass(rule === r.id)}
            >
              {pick(language, r.en, r.ko)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            The orange rectangles are the <em>Riemann sum</em>: each one is{" "}
            <span className="font-mono">f(x_i) · Δx</span>, and the total is{" "}
            <span className="font-mono">{fmt(sumValue)}</span>. The blue curve is the function; the
            green number is the exact integral. Drag <b>N</b> upward and watch the rectangles crowd
            together — the gap closes as <span className="font-mono">~1/N</span> for the left/right
            rules and as <span className="font-mono">~1/N²</span> for the midpoint rule. The
            integral isn't a *new* operation; it's a <em>limit</em> of these finite sums, and for
            the velocity curve <span className="font-mono">v(t) = g·t</span> it equals the distance
            traveled in time <span className="font-mono">2 s</span> — exactly the statement
            projectile motion makes when it goes from acceleration to position.
          </>,
          <>
            주황 직사각형이 <em>리만 합</em>: 각각 <span className="font-mono">f(x_i) · Δx</span>,
            전체 합 <span className="font-mono">{fmt(sumValue)}</span>. 파란 곡선은 함수, 초록 수는
            정확한 적분. <b>N</b>을 올리면 직사각형이 빽빽해진다 — 격차가 left/right 규칙에선{" "}
            <span className="font-mono">~1/N</span>, 중점 규칙에선{" "}
            <span className="font-mono">~1/N²</span>로 닫힌다. 적분은 *새로운* 연산이 아니다 — 이
            유한 합들의 <em>극한</em>이고, 속도 곡선 <span className="font-mono">v(t) = g·t</span>
            의 경우 시간 <span className="font-mono">2초</span> 동안의 이동 거리와 같다 — 포물선
            운동이 가속도에서 위치로 갈 때 정확히 하는 그 진술.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
