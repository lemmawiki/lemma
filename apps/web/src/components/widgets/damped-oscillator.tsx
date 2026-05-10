import { useContext, useMemo, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Damped Oscillator.
//
// Simple harmonic oscillator with linear damping and optional sinusoidal
// driving:
//   ẍ + 2γ ẋ + ω₀² x  =  F · cos(ω t)
//
// γ is the damping coefficient, ω₀ the natural frequency, ω the driving
// frequency, F the driving amplitude (kept = 1). The reader controls
// γ and ω; ω₀ is fixed at 1 for clean numbers. Two panels:
//   • x(t) plot — RK4 integration of the full ODE for visible time series
//   • A(ω) plot — closed-form steady-state amplitude response curve, with
//     the current driving frequency marked
// Toggle 'forced' off to see free oscillation only (decay or critical /
// overdamped behavior). Toggle on to see the steady-state response.

const OMEGA_0 = 1.0; // natural frequency, fixed
const F_AMP = 1.0; // driving amplitude, fixed
const T_MAX = 30; // simulation horizon, seconds
const DT = 0.05; // RK4 step
const N_STEPS = Math.floor(T_MAX / DT);

const W = 460;
const H = 220;
const PAD_L = 38;
const PAD_R = 14;
const PAD_T = 16;
const PAD_B = 28;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

const Y_MAX = 4.5; // x amplitude clip
const A_MAX = 6.0; // A(ω) clip
const OMEGA_PLOT_MAX = 2.5; // x-range of A(ω) panel (in units of ω₀)

const fmt = (n: number, d = 2) => n.toFixed(d);

// RK4 for ẍ + 2γ ẋ + ω₀² x = F cos(ωt) when forced; F = 0 when free.
function simulate(gamma: number, omega: number, forced: boolean): { t: number; x: number }[] {
  const F = forced ? F_AMP : 0;
  // Initial conditions: free starts displaced (x=1, v=0); forced starts at
  // rest so the steady-state envelope grows in from zero — visually clearer.
  let x = forced ? 0 : 1;
  let v = 0;
  const out: { t: number; x: number }[] = [{ t: 0, x }];
  const accel = (x_: number, v_: number, t_: number) =>
    -2 * gamma * v_ - OMEGA_0 * OMEGA_0 * x_ + F * Math.cos(omega * t_);
  for (let i = 1; i <= N_STEPS; i++) {
    const t = i * DT;
    // RK4
    const k1x = v;
    const k1v = accel(x, v, t - DT);
    const k2x = v + (DT / 2) * k1v;
    const k2v = accel(x + (DT / 2) * k1x, v + (DT / 2) * k1v, t - DT / 2);
    const k3x = v + (DT / 2) * k2v;
    const k3v = accel(x + (DT / 2) * k2x, v + (DT / 2) * k2v, t - DT / 2);
    const k4x = v + DT * k3v;
    const k4v = accel(x + DT * k3x, v + DT * k3v, t);
    x = x + (DT / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    v = v + (DT / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    out.push({ t, x });
  }
  return out;
}

// Steady-state amplitude response: A(ω) = F / sqrt((ω₀² − ω²)² + (2γω)²).
function amplitude(omega: number, gamma: number): number {
  const a = OMEGA_0 * OMEGA_0 - omega * omega;
  const b = 2 * gamma * omega;
  return F_AMP / Math.sqrt(a * a + b * b);
}

type Preset = "undamped" | "weak" | "critical" | "over";
const PRESETS: Record<Preset, { gamma: number; en: string; ko: string }> = {
  undamped: { gamma: 0, en: "undamped", ko: "감쇠 없음" },
  weak: { gamma: 0.1, en: "weak damping", ko: "약한 감쇠" },
  critical: { gamma: 1.0, en: "critical", ko: "임계" },
  over: { gamma: 2.0, en: "overdamped", ko: "과 감쇠" },
};

export function DampedOscillator({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [gamma, setGamma] = useState(0.1);
  const [omega, setOmega] = useState(1.0);
  const [forced, setForced] = useState(false);

  const trace = useMemo(() => simulate(gamma, omega, forced), [gamma, omega, forced]);
  const Athis = amplitude(omega, gamma);

  // Damping regime label.
  const regime: "underdamped" | "critical" | "overdamped" =
    gamma < OMEGA_0 - 0.05 ? "underdamped" : gamma > OMEGA_0 + 0.05 ? "overdamped" : "critical";

  // Presets — find which (if any) matches.
  const presetMatch = (() => {
    const eps = 0.03;
    for (const [id, p] of Object.entries(PRESETS)) {
      if (Math.abs(gamma - p.gamma) < eps) return id as Preset;
    }
    return null;
  })();

  // Time-series plot helpers.
  const xS = (t: number) => PAD_L + (t / T_MAX) * INNER_W;
  const yS = (x: number) =>
    PAD_T + (1 - (Math.max(-Y_MAX, Math.min(Y_MAX, x)) + Y_MAX) / (2 * Y_MAX)) * INNER_H;
  const tracePath = (() => {
    const parts: string[] = [];
    for (let i = 0; i < trace.length; i++) {
      const p = trace[i];
      parts.push(`${i === 0 ? "M" : "L"}${xS(p.t).toFixed(2)},${yS(p.x).toFixed(2)}`);
    }
    return parts.join(" ");
  })();

  // Amplitude-response plot helpers (separate svg).
  const xA = (w: number) => PAD_L + (w / OMEGA_PLOT_MAX) * INNER_W;
  const yA = (a: number) => PAD_T + (1 - Math.min(Math.max(a, 0), A_MAX) / A_MAX) * INNER_H;
  const responsePath = (() => {
    const STEPS = 160;
    const parts: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const w = (i / STEPS) * OMEGA_PLOT_MAX;
      const a = amplitude(Math.max(w, 1e-3), gamma);
      parts.push(`${i === 0 ? "M" : "L"}${xA(w).toFixed(2)},${yA(a).toFixed(2)}`);
    }
    return parts.join(" ");
  })();

  return (
    <WidgetShell kicker={pick(language, "Widget — Damped oscillator", "위젯 — 감쇠 진동")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "γ (damping)", "γ (감쇠)")}
          value={fmt(gamma)}
          color={C.curveAlt}
        />
        <Stat
          label={pick(language, "ω₀ (natural)", "ω₀ (자연)")}
          value={fmt(OMEGA_0)}
          color={C.axis}
        />
        <Stat
          label={pick(language, "ω (driving)", "ω (구동)")}
          value={fmt(omega)}
          color={forced ? C.secant : C.axis}
        />
        <Stat
          label={pick(language, "regime", "상태")}
          value={pick(
            language,
            regime,
            regime === "underdamped" ? "부족 감쇠" : regime === "critical" ? "임계" : "과 감쇠",
          )}
          color={C.curve}
        />
      </div>

      {/* Time series x(t) */}
      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <div className="border-b border-rule px-3 pt-2 pb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
          {pick(language, "position x(t)", "위치 x(t)")}
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", touchAction: "none" }}
          role="img"
          aria-label={pick(language, "position over time plot", "시간에 따른 위치 그래프")}
        >
          {/* frame + zero line */}
          <rect
            x={PAD_L}
            y={PAD_T}
            width={INNER_W}
            height={INNER_H}
            fill="white"
            stroke={C.axis}
            strokeWidth={1}
          />
          <line
            x1={PAD_L}
            y1={yS(0)}
            x2={PAD_L + INNER_W}
            y2={yS(0)}
            stroke={C.axis}
            strokeWidth={0.6}
            opacity={0.6}
          />

          {/* y ticks */}
          {[-2, 2].map((y) => (
            <text
              key={`yt${y}`}
              x={PAD_L - 6}
              y={yS(y) + 3}
              textAnchor="end"
              style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
              fill={C.axis}
            >
              {y > 0 ? `+${y}` : `${y}`}
            </text>
          ))}
          {/* x ticks */}
          {[0, 10, 20, 30].map((t) => (
            <text
              key={`xt${t}`}
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
            y={H - 4}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            fill={C.axis}
          >
            {pick(language, "time t", "시간 t")}
          </text>

          {/* trace */}
          <path d={tracePath} fill="none" stroke={C.curve} strokeWidth={1.6} />
        </svg>
      </div>

      {/* Amplitude response A(ω) */}
      <div className="mt-3 overflow-hidden rounded-md border border-rule bg-bg-card">
        <div className="border-b border-rule px-3 pt-2 pb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
          {pick(language, "amplitude response A(ω) — steady-state", "진폭 반응 A(ω) — 정상상태")}
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", touchAction: "none" }}
          role="img"
          aria-label={pick(language, "amplitude response curve", "진폭 반응 곡선")}
        >
          <rect
            x={PAD_L}
            y={PAD_T}
            width={INNER_W}
            height={INNER_H}
            fill="white"
            stroke={C.axis}
            strokeWidth={1}
          />

          {/* gridlines */}
          {[1, 2, 3, 4, 5].map((a) => (
            <g key={`gA${a}`}>
              <line
                x1={PAD_L}
                y1={yA(a)}
                x2={PAD_L + INNER_W}
                y2={yA(a)}
                stroke={C.axis}
                strokeWidth={0.4}
                opacity={0.35}
              />
              <text
                x={PAD_L - 6}
                y={yA(a) + 3}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                fill={C.axis}
              >
                {a}
              </text>
            </g>
          ))}

          {/* x ticks at 0, 1 (=ω₀), 2 */}
          {[0, 1, 2].map((w) => (
            <text
              key={`xa${w}`}
              x={xA(w)}
              y={PAD_T + INNER_H + 14}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
              fill={C.axis}
            >
              {w === 1 ? "ω₀" : w.toString()}
            </text>
          ))}

          {/* natural-frequency vertical line */}
          <line
            x1={xA(OMEGA_0)}
            y1={PAD_T}
            x2={xA(OMEGA_0)}
            y2={PAD_T + INNER_H}
            stroke={C.axis}
            strokeWidth={0.6}
            strokeDasharray="3 3"
            opacity={0.5}
          />

          {/* response curve */}
          <path d={responsePath} fill="none" stroke={C.curveAlt} strokeWidth={1.8} />

          {/* current ω marker */}
          <line
            x1={xA(omega)}
            y1={PAD_T}
            x2={xA(omega)}
            y2={PAD_T + INNER_H}
            stroke={C.secant}
            strokeWidth={0.8}
            strokeDasharray="2 3"
            opacity={forced ? 0.9 : 0.3}
          />
          <circle
            cx={xA(omega)}
            cy={yA(Athis)}
            r={4.5}
            fill={C.secant}
            stroke="white"
            strokeWidth={1.5}
            opacity={forced ? 1 : 0.4}
          />
        </svg>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "damping γ", "감쇠 γ")}
          value={gamma}
          onChange={setGamma}
          min={0}
          max={2}
          step={0.02}
          accent={C.curveAlt}
          display={fmt(gamma)}
        />
        <Slider
          label={pick(language, "driving ω", "구동 ω")}
          value={omega}
          onChange={setOmega}
          min={0.1}
          max={OMEGA_PLOT_MAX}
          step={0.01}
          accent={C.secant}
          display={fmt(omega)}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="button" onClick={() => setForced((v) => !v)} className={pillClass(forced)}>
            {pick(language, forced ? "forcing on" : "forcing off", forced ? "구동 켬" : "구동 끔")}
          </button>
          {(Object.keys(PRESETS) as Preset[]).map((id) => (
            <button
              key={`pre${id}`}
              type="button"
              onClick={() => setGamma(PRESETS[id].gamma)}
              className={pillClass(presetMatch === id)}
            >
              {pick(language, PRESETS[id].en, PRESETS[id].ko)}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11.5px] text-ink-mute">ω₀ = 1 (fixed)</span>
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Equation: <span className="font-mono">ẍ + 2γ·ẋ + ω₀²·x = F·cos(ω·t)</span>. With{" "}
            <em>forcing off</em>, the system runs free from a displaced start: the trace decays
            exponentially while still oscillating (γ &lt; ω₀), or returns straight to rest without
            oscillating (γ ≥ ω₀). With <em>forcing on</em>, the bottom panel shows the steady-state
            amplitude as a function of driving frequency. Drag <b>ω</b> across the natural frequency{" "}
            <span className="font-mono">ω₀ = 1</span>: the orange dot climbs the response curve.
            With weak damping the peak is sharp and tall; with strong damping the peak flattens.
            *Same equation, three behaviors* — and the engineering of any oscillator is choosing
            where on these curves to live.
          </>,
          <>
            식: <span className="font-mono">ẍ + 2γ·ẋ + ω₀²·x = F·cos(ω·t)</span>. <em>구동 끔</em>
            이면 시스템이 변위된 상태에서 자유롭게 — 부족 감쇠 (γ &lt; ω₀) 면 진동하면서 지수적으로
            감쇠, 임계/과 감쇠 (γ ≥ ω₀) 면 진동 없이 곧장 정지로 복귀. <em>구동 켬</em>이면 아래
            패널이 정상상태 진폭을 구동 진동수의 함수로 보여준다. <b>ω</b>를 자연 진동수{" "}
            <span className="font-mono">ω₀ = 1</span>를 가로질러 끌어보자 — 주황 점이 반응 곡선을
            오른다. 약한 감쇠에서 피크가 날카롭고 높음. 강한 감쇠에서는 피크가 평평. *같은 식, 세
            가지 행동* — 어떤 진동자든 이 곡선 어디에 살게 할지가 공학의 선택이다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
