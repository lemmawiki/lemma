import { useContext, useMemo, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Present Value Lab.
//
// One continuous cash flow at constant rate c (dollars per year). The
// reader controls the discount rate r (continuous compounding) and the
// horizon T. Two curves stack on the same axes:
//   • flat:        c(t) = c                       (undiscounted rate)
//   • discounted:  c(t) · e^(−rt)                  (what each future
//                                                   dollar is worth today)
// The shaded area under the discounted curve, from 0 to T, is the
// present value of the stream:
//   PV(T) = ∫_0^T c · e^(−rt) dt = (c/r) · (1 − e^(−rT))
//
// As T → ∞, PV → c/r — the perpetuity formula. The widget renders this
// limit as a horizontal asymptote.

const C_RATE = 1.0; // dollars per year (constant)
const W = 460;
const H = 280;
const PAD_L = 44;
const PAD_R = 16;
const PAD_T = 18;
const PAD_B = 32;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

// Y-axis range: a fixed ceiling that comfortably exceeds the undiscounted
// rate at any reasonable c.
const Y_MAX = 1.4;
const T_MAX_PLOT = 30;

// Stable per-bar IDs (annual-payment overlay) — index is meaningful, but
// oxlint rejects raw-index keys; precomputed string IDs satisfy the rule.
const BAR_IDS = Array.from({ length: 60 }, (_, i) => `b${i.toString().padStart(2, "0")}`);

const fmt = (n: number, d = 2) => n.toFixed(d);

function presentValue(c: number, r: number, T: number): number {
  if (r <= 1e-9) return c * T; // r → 0: PV = c · T
  return (c / r) * (1 - Math.exp(-r * T));
}

// Discrete annual-payment PV, for the side-by-side compare:
//   PV_disc = Σ_{i=1..N} c · e^(−r·i) · (one-year amount)
function presentValueDiscrete(c: number, r: number, T: number): number {
  let s = 0;
  const N = Math.floor(T);
  for (let i = 1; i <= N; i++) s += c * Math.exp(-r * i);
  return s;
}

export function PresentValueLab({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [r, setR] = useState(0.05);
  const [T, setT] = useState(15);
  const [showDiscrete, setShowDiscrete] = useState(false);

  const pv = presentValue(C_RATE, r, T);
  const pvInf = r > 1e-9 ? C_RATE / r : Infinity; // perpetuity
  const pvDisc = presentValueDiscrete(C_RATE, r, T);
  const undiscountedTotal = C_RATE * T;

  // Plot helpers.
  const xS = (t: number) => PAD_L + (t / T_MAX_PLOT) * INNER_W;
  const yS = (y: number) => PAD_T + (1 - Math.min(y, Y_MAX) / Y_MAX) * INNER_H;

  // Discounted curve path: c · e^(−rt) over [0, T_MAX_PLOT].
  const curvePath = useMemo(() => {
    const STEPS = 200;
    const parts: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * T_MAX_PLOT;
      const y = C_RATE * Math.exp(-r * t);
      parts.push(`${i === 0 ? "M" : "L"}${xS(t).toFixed(2)},${yS(y).toFixed(2)}`);
    }
    return parts.join(" ");
  }, [r]);

  // Shaded area under the discounted curve from 0 to T (closed polygon).
  const areaPath = useMemo(() => {
    const STEPS = Math.max(20, Math.floor((T / T_MAX_PLOT) * 200));
    const parts: string[] = [`M${xS(0).toFixed(2)},${yS(0).toFixed(2)}`];
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * T;
      const y = C_RATE * Math.exp(-r * t);
      parts.push(`L${xS(t).toFixed(2)},${yS(y).toFixed(2)}`);
    }
    parts.push(`L${xS(T).toFixed(2)},${yS(0).toFixed(2)} Z`);
    return parts.join(" ");
  }, [r, T]);

  return (
    <WidgetShell kicker={pick(language, "Widget — Present value", "위젯 — 현재가치")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "PV (continuous)", "PV (연속)")}
          value={`$${fmt(pv)}`}
          color={C.curveAlt}
        />
        <Stat
          label={pick(language, "undiscounted total", "할인 안 한 합계")}
          value={`$${fmt(undiscountedTotal)}`}
        />
        <Stat label={pick(language, "PV (annual)", "PV (연 1회)")} value={`$${fmt(pvDisc)}`} />
        <Stat
          label={pick(language, "perpetuity (T → ∞)", "영구채 (T → ∞)")}
          value={Number.isFinite(pvInf) ? `$${fmt(pvInf)}` : "∞"}
          color={C.axis}
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
            "discounted cash flow curve with present-value area",
            "할인된 현금흐름 곡선과 현재가치 면적",
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

          {/* y gridlines + labels */}
          {[0.5, 1.0].map((y) => (
            <g key={`gy-${y}`}>
              <line
                x1={PAD_L}
                y1={yS(y)}
                x2={PAD_L + INNER_W}
                y2={yS(y)}
                stroke={C.axis}
                strokeWidth={0.4}
                opacity={0.4}
              />
              <text
                x={PAD_L - 6}
                y={yS(y) + 3}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                fill={C.axis}
              >
                ${y.toFixed(2)}
              </text>
            </g>
          ))}

          {/* x ticks (every 5 years) */}
          {[0, 5, 10, 15, 20, 25, 30].map((t) => (
            <text
              key={`gx-${t}`}
              x={xS(t)}
              y={PAD_T + INNER_H + 14}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
              fill={C.axis}
            >
              {t}
            </text>
          ))}

          <text
            x={PAD_L + INNER_W / 2}
            y={H - 6}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            fill={C.axis}
          >
            {pick(language, "time t (years)", "시간 t (년)")}
          </text>
          <text
            x={14}
            y={PAD_T + INNER_H / 2}
            transform={`rotate(-90 14 ${PAD_T + INNER_H / 2})`}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            fill={C.axis}
          >
            {pick(language, "rate ($/yr)", "비율 ($/년)")}
          </text>

          {/* undiscounted reference line at y = c */}
          <line
            x1={xS(0)}
            y1={yS(C_RATE)}
            x2={xS(T_MAX_PLOT)}
            y2={yS(C_RATE)}
            stroke={C.axis}
            strokeWidth={0.8}
            strokeDasharray="3 4"
            opacity={0.6}
          />
          <text
            x={xS(T_MAX_PLOT) - 6}
            y={yS(C_RATE) - 4}
            textAnchor="end"
            style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
            fill={C.axis}
          >
            {pick(language, "no-discount (c)", "할인 없음 (c)")}
          </text>

          {/* shaded PV area */}
          <path d={areaPath} fill={C.curveAlt} fillOpacity={0.18} stroke="none" />

          {/* discounted curve */}
          <path d={curvePath} fill="none" stroke={C.curve} strokeWidth={2} />

          {/* T cursor */}
          <line
            x1={xS(T)}
            y1={PAD_T}
            x2={xS(T)}
            y2={PAD_T + INNER_H}
            stroke={C.secant}
            strokeWidth={0.8}
            strokeDasharray="2 3"
            opacity={0.7}
          />
          <text
            x={xS(T) + 4}
            y={PAD_T + 12}
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}
            fill={C.secant}
          >
            T = {fmt(T, 0)}
          </text>

          {/* discrete-payment bars (annual) — overlay if toggled */}
          {showDiscrete &&
            (() => {
              const N = Math.min(Math.floor(T), 30);
              const out = [];
              for (let i = 1; i <= N; i++) {
                const dpv = C_RATE * Math.exp(-r * i);
                const cx = xS(i);
                const barW = 6;
                out.push(
                  <rect
                    key={BAR_IDS[i - 1]}
                    x={cx - barW / 2}
                    y={yS(dpv)}
                    width={barW}
                    height={yS(0) - yS(dpv)}
                    fill={C.secant}
                    fillOpacity={0.85}
                  />,
                );
              }
              return out;
            })()}
        </svg>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "discount rate r", "할인율 r")}
          value={r}
          onChange={setR}
          min={0}
          max={0.2}
          step={0.005}
          accent={C.curve}
          display={`${(r * 100).toFixed(1)}%`}
        />
        <Slider
          label={pick(language, "horizon T (yrs)", "기간 T (년)")}
          value={T}
          onChange={(v) => setT(Math.round(v))}
          min={1}
          max={30}
          step={1}
          accent={C.secant}
          display={`${fmt(T, 0)}`}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowDiscrete((v) => !v)}
            className={pillClass(showDiscrete)}
          >
            {pick(language, "show annual payments", "연 1회 지급 보기")}
          </button>
          <span className="ml-auto font-mono text-[11.5px] text-ink-mute">
            c = $1/yr (constant)
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            The blue curve is what each future dollar is worth today —{" "}
            <span className="font-mono">c · e^(−rt)</span>. The dashed gray line is the undiscounted
            rate (a dollar a year, forever). The shaded green region between them and the time axis,
            from <span className="font-mono">0</span> to <b>T</b>, is the <em>present value</em> of
            the stream: <span className="font-mono">PV = (c/r)(1 − e^(−rT))</span>. Drag <b>r</b>{" "}
            from 0 to 20%: at <span className="font-mono">r = 0</span> the curve <em>is</em> the
            gray line — no discount, PV equals the undiscounted total. At{" "}
            <span className="font-mono">r = 20%</span> the curve plummets — the same{" "}
            <span className="font-mono">$1/yr</span> stream is worth far less today. As <b>T</b>{" "}
            grows the area approaches the perpetuity limit <span className="font-mono">c/r</span>;
            once <span className="font-mono">T</span> is past <span className="font-mono">5/r</span>{" "}
            or so, extending the horizon barely adds anything. *Distant money discounts away.*
          </>,
          <>
            파란 곡선은 미래의 1달러가 오늘 얼마인지 —{" "}
            <span className="font-mono">c · e^(−rt)</span>. 점선 회색은 할인 안 한 비율 (1년에
            1달러, 영원히). 둘과 시간축 사이의 초록 음영 영역, <span className="font-mono">0</span>
            에서 <b>T</b>까지가 그 스트림의 <em>현재가치</em> —{" "}
            <span className="font-mono">PV = (c/r)(1 − e^(−rT))</span>. <b>r</b>을 0에서 20%까지
            끌어보자 — <span className="font-mono">r = 0</span>이면 곡선이 회색 직선과 *같다* — 할인
            없음, PV = 미할인 합계. <span className="font-mono">r = 20%</span>이면 곡선이 급락 —
            같은 <span className="font-mono">$1/년</span> 스트림이 오늘은 훨씬 적다. <b>T</b>가
            커지면 면적이 영구채 한계 <span className="font-mono">c/r</span>로 다가가고,{" "}
            <span className="font-mono">T</span>가 <span className="font-mono">5/r</span>
            을 넘으면 기간을 늘려도 거의 안 더해진다. *먼 미래의 돈은 할인되어 사라진다.*
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
