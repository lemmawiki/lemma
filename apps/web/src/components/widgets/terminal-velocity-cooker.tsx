import { useContext, useMemo, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Terminal Velocity Cooker.
//
// Per-unit-mass equation of motion:  dv/dt = g − k v
// Closed-form solution from rest:    v(t) = v_t · (1 − e^(−k t)),  v_t = g / k
//
// Reader controls:
//   • k — drag coefficient per unit mass (1/s). Larger k → smaller v_t,
//          faster approach to terminal.
//   • t — time to highlight on the curve (s).
//
// Two views:
//   • Curve panel: v(t) over [0, T_MAX] with v_t asymptote dashed,
//     current-time cursor, force arrows showing gravity vs drag at v(t).
//   • Stat strip:  v_t, v(t), dv/dt, fraction of terminal reached.

const G = 9.8; // m/s² — gravity, fixed (Earth surface, simplified).
const T_MAX = 12; // seconds — the curve's time window
const PLOT_W = 420;
const PLOT_H = 260;
const PAD_L = 44;
const PAD_R = 28;
const PAD_T = 18;
const PAD_B = 32;
const INNER_W = PLOT_W - PAD_L - PAD_R;
const INNER_H = PLOT_H - PAD_T - PAD_B;
const V_PLOT_MAX = 50; // m/s — covers v_t up to ~49 (k = 0.2)

type Preset = "raindrop" | "skydiver" | "feather";
const PRESETS: Record<Preset, { k: number; en: string; ko: string }> = {
  raindrop: { k: 1.6, en: "raindrop", ko: "빗방울" },
  skydiver: { k: 0.4, en: "skydiver", ko: "낙하산 펴기 전" },
  feather: { k: 6.0, en: "feather", ko: "깃털" },
};

function vOfT(t: number, k: number): number {
  if (k <= 0) return G * t; // free fall, no drag
  const vt = G / k;
  return vt * (1 - Math.exp(-k * t));
}

function dvdt(v: number, k: number): number {
  return G - k * v;
}

const fmt = (n: number, d = 2) => n.toFixed(d);

export function TerminalVelocityCooker({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [k, setK] = useState(PRESETS.raindrop.k);
  const [t, setT] = useState(2);

  const vt = G / Math.max(k, 1e-6);
  const vNow = vOfT(t, k);
  const dvNow = dvdt(vNow, k);
  const fractionTerminal = vt > 0 ? vNow / vt : 0;

  // Sample the curve.
  const curve = useMemo(() => {
    const STEPS = 160;
    const pts: { t: number; v: number }[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const ti = (i / STEPS) * T_MAX;
      pts.push({ t: ti, v: vOfT(ti, k) });
    }
    return pts;
  }, [k]);

  const xC = (ti: number) => PAD_L + (ti / T_MAX) * INNER_W;
  const yC = (v: number) => PAD_T + (1 - Math.min(v, V_PLOT_MAX) / V_PLOT_MAX) * INNER_H;
  const curvePath = (() => {
    const parts: string[] = [];
    for (let i = 0; i < curve.length; i++) {
      const p = curve[i];
      parts.push(`${i === 0 ? "M" : "L"}${xC(p.t).toFixed(2)},${yC(p.v).toFixed(2)}`);
    }
    return parts.join(" ");
  })();

  const presetMatch = (() => {
    const eps = 0.02;
    for (const [id, p] of Object.entries(PRESETS)) {
      if (Math.abs(k - p.k) < eps) return id as Preset;
    }
    return null;
  })();

  // Force arrow scale: gravity is fixed (g per unit mass), drag is k·v.
  // Render both to the right of the plot, scaled so gravity = 1 unit.
  const ARROW_X = PAD_L + INNER_W + 14;
  const ARROW_BASE_Y = PAD_T + INNER_H / 2;
  const ARROW_LEN = 50;
  const dragMag = (k * vNow) / G; // ratio drag / gravity

  return (
    <WidgetShell kicker={pick(language, "Widget — Terminal velocity", "위젯 — 종단속도")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "v_t (terminal)", "v_t (종단)")}
          value={`${fmt(vt)} m/s`}
          color={C.curveAlt}
        />
        <Stat label={pick(language, "v(t) at cursor", "v(t) — 현재")} value={`${fmt(vNow)} m/s`} />
        <Stat
          label={pick(language, "dv/dt at cursor", "dv/dt — 현재")}
          value={`${fmt(dvNow)} m/s²`}
          color={dvNow < 0.5 ? C.curveAlt : C.secant}
        />
        <Stat
          label={pick(language, "fraction of v_t", "v_t 대비")}
          value={`${(fractionTerminal * 100).toFixed(0)}%`}
        />
      </div>

      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <svg
          viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
          width="100%"
          style={{ display: "block", touchAction: "none" }}
          role="img"
          aria-label={pick(
            language,
            "velocity over time, with terminal-velocity asymptote and force balance arrows",
            "시간에 따른 속도, 종단속도 점근선 및 힘 균형 화살표",
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

          {/* y-grid + ticks (every 10 m/s) */}
          {[10, 20, 30, 40].map((v) => (
            <g key={`gy-${v}`}>
              <line
                x1={PAD_L}
                y1={yC(v)}
                x2={PAD_L + INNER_W}
                y2={yC(v)}
                stroke={C.axis}
                strokeWidth={0.4}
                opacity={0.4}
              />
              <text
                x={PAD_L - 6}
                y={yC(v) + 3}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                fill={C.axis}
              >
                {v}
              </text>
            </g>
          ))}
          {/* x-ticks */}
          {[0, 3, 6, 9, 12].map((ti) => (
            <text
              key={`gx-${ti}`}
              x={xC(ti)}
              y={PAD_T + INNER_H + 14}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
              fill={C.axis}
            >
              {ti}
            </text>
          ))}
          <text
            x={PAD_L + INNER_W / 2}
            y={PLOT_H - 6}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            fill={C.axis}
          >
            {pick(language, "time t (s)", "시간 t (s)")}
          </text>
          <text
            x={14}
            y={PAD_T + INNER_H / 2}
            transform={`rotate(-90 14 ${PAD_T + INNER_H / 2})`}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            fill={C.axis}
          >
            {pick(language, "velocity v (m/s)", "속도 v (m/s)")}
          </text>

          {/* terminal-velocity asymptote */}
          <line
            x1={PAD_L}
            y1={yC(Math.min(vt, V_PLOT_MAX))}
            x2={PAD_L + INNER_W}
            y2={yC(Math.min(vt, V_PLOT_MAX))}
            stroke={C.curveAlt}
            strokeWidth={1.4}
            strokeDasharray="6 4"
          />
          <text
            x={PAD_L + INNER_W - 6}
            y={yC(Math.min(vt, V_PLOT_MAX)) - 4}
            textAnchor="end"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}
            fill={C.curveAlt}
          >
            v_t = {fmt(vt, 1)}
          </text>

          {/* free-fall reference (no drag) — v = g·t — dashed dim */}
          <line
            x1={xC(0)}
            y1={yC(0)}
            x2={xC(V_PLOT_MAX / G)}
            y2={yC(V_PLOT_MAX)}
            stroke={C.axis}
            strokeWidth={0.8}
            strokeDasharray="2 4"
            opacity={0.5}
          />
          <text
            x={xC(2)}
            y={yC(G * 2.05)}
            style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
            fill={C.axis}
            opacity={0.7}
          >
            {pick(language, "no-drag (v = g·t)", "저항 없음 (v = g·t)")}
          </text>

          {/* the curve */}
          <path d={curvePath} fill="none" stroke={C.curve} strokeWidth={2.2} />

          {/* current-t cursor */}
          <line
            x1={xC(t)}
            y1={PAD_T}
            x2={xC(t)}
            y2={PAD_T + INNER_H}
            stroke={C.secant}
            strokeWidth={0.8}
            strokeDasharray="2 3"
            opacity={0.7}
          />
          <circle cx={xC(t)} cy={yC(vNow)} r={5} fill={C.secant} stroke="white" strokeWidth={1.5} />

          {/* Force-balance arrows (right side overlay) */}
          {/* gravity — always 1 unit down */}
          <line
            x1={ARROW_X}
            y1={ARROW_BASE_Y}
            x2={ARROW_X}
            y2={ARROW_BASE_Y + ARROW_LEN}
            stroke={C.secant}
            strokeWidth={2}
          />
          <polygon
            points={`${ARROW_X - 4},${ARROW_BASE_Y + ARROW_LEN - 4} ${ARROW_X + 4},${ARROW_BASE_Y + ARROW_LEN - 4} ${ARROW_X},${ARROW_BASE_Y + ARROW_LEN}`}
            fill={C.secant}
          />
          <text
            x={ARROW_X + 6}
            y={ARROW_BASE_Y + ARROW_LEN - 2}
            style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
            fill={C.secant}
          >
            g
          </text>
          {/* drag — up, length proportional to drag/gravity */}
          {dragMag > 0.001 && (
            <>
              <line
                x1={ARROW_X}
                y1={ARROW_BASE_Y}
                x2={ARROW_X}
                y2={ARROW_BASE_Y - ARROW_LEN * Math.min(dragMag, 1)}
                stroke={C.curveAlt}
                strokeWidth={2}
              />
              <polygon
                points={`${ARROW_X - 4},${ARROW_BASE_Y - ARROW_LEN * Math.min(dragMag, 1) + 4} ${ARROW_X + 4},${ARROW_BASE_Y - ARROW_LEN * Math.min(dragMag, 1) + 4} ${ARROW_X},${ARROW_BASE_Y - ARROW_LEN * Math.min(dragMag, 1)}`}
                fill={C.curveAlt}
              />
              <text
                x={ARROW_X + 6}
                y={ARROW_BASE_Y - ARROW_LEN * Math.min(dragMag, 1) + 4}
                style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
                fill={C.curveAlt}
              >
                kv
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "drag k (1/s)", "저항 k (1/s)")}
          value={k}
          onChange={setK}
          min={0.2}
          max={6}
          step={0.05}
          accent={C.curveAlt}
          display={fmt(k, 2)}
        />
        <Slider
          label={pick(language, "time t (s)", "시간 t (s)")}
          value={t}
          onChange={setT}
          min={0}
          max={T_MAX}
          step={0.05}
          accent={C.secant}
          display={`${fmt(t, 1)} s`}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {(Object.keys(PRESETS) as Preset[]).map((id) => (
            <button
              key={`preset-${id}`}
              type="button"
              onClick={() => setK(PRESETS[id].k)}
              className={pillClass(presetMatch === id)}
            >
              {pick(language, PRESETS[id].en, PRESETS[id].ko)}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11.5px] text-ink-mute">g = {G} m/s²</span>
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            The blue curve is <span className="font-mono">v(t) = v_t (1 − e^(−kt))</span> — velocity
            from rest under gravity and linear drag. The dashed green line is the{" "}
            <em>terminal velocity</em> <span className="font-mono">v_t = g/k</span>; the curve
            approaches it but never crosses. The dotted gray line is the no-drag reference{" "}
            <span className="font-mono">v = g·t</span>; without drag, velocity grows linearly
            forever. The two arrows show the force balance at the cursor: gravity (orange, fixed){" "}
            and drag (green, growing with v). At <span className="font-mono">v = v_t</span> the
            arrows match in length — no net force, no acceleration, no further change in speed. Try
            the presets: a feather (large k) reaches a tiny v_t in a fraction of a second; a
            free-falling skydiver before the chute opens (small k) takes several seconds to settle
            near 25 m/s.
          </>,
          <>
            파란 곡선은 <span className="font-mono">v(t) = v_t (1 − e^(−kt))</span> — 정지 상태에서
            중력과 선형 저항을 받는 속도. 점선 초록은 <em>종단속도</em>{" "}
            <span className="font-mono">v_t = g/k</span>. 곡선이 다가가지만 절대 넘지 않는다. 점선
            회색은 저항 없을 때 기준 <span className="font-mono">v = g·t</span> — 저항이 없으면
            속도는 영원히 선형으로 증가한다. 화살표 두 개가 커서에서 힘 균형을 보여준다: 중력 (주황,
            고정), 저항 (초록, v에 비례 증가). <span className="font-mono">v = v_t</span>에서 두
            화살표 길이가 같아진다 — 알짜힘 0, 가속도 0, 속도 변화도 0. 프리셋을 시도해보자: 깃털
            (큰 k) 은 1초도 안 돼 작은 v_t에 닿고, 낙하산 펴기 전 (작은 k) 은 몇 초가 걸려야 약 25
            m/s 근처에 안정된다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
