import { useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat } from "./widget-primitives";

// Widget — Two Pendulums.
// Two pendulums share L and g but launch with different amplitudes
// θ_A and θ_B. Both swing as cos(ω·t). With small-angle on, both use
// ω = √(g/L), so they stay perfectly synchronized — the lie the
// pendulum clock runs on. Toggle correction on, and pendulum B uses
// the leading-order period correction T_B ≈ T₀ (1 + θ_B²/16); over a
// few periods, B visibly lags A. The widget is not a numerical
// integration of the nonlinear ODE; it is a teaching device that
// shows the period-as-function-of-amplitude effect at the right scale.

const RAD = Math.PI / 180;
const TWO_PI = 2 * Math.PI;

const W = 560;
const H = 360;
const PIVOT_Y = 60;
const PIVOT_A_X = 200;
const PIVOT_B_X = 400;
const L_PX_PER_METER = 130;

const COLOR = {
  rope: "#7a5c2c",
  pivot: "#9ca3a4",
  bobA: "#1e6da6",
  bobB: "#b6451e",
  arc: "#9ca3a4",
} as const;

function fmt(n: number, d = 2): string {
  return Number.isFinite(n) ? n.toFixed(d) : "—";
}

// Borda's leading-order period correction for a plane pendulum.
// T(θ₀) = T₀ · (1 + θ₀²/16 + …). One term is plenty in the angles
// the slider reaches; we never claim "exact."
function periodCorrection(thetaRad: number): number {
  return 1 + (thetaRad * thetaRad) / 16;
}

export function TwoPendulums() {
  const { language } = useApp();
  const [L, setL] = useState(1.0);
  const [g, setG] = useState(9.8);
  const [thetaA, setThetaA] = useState(8); // degrees
  const [thetaB, setThetaB] = useState(45); // degrees
  const [tFrac, setTFrac] = useState(0);
  const [correction, setCorrection] = useState(false);

  const T0 = TWO_PI * Math.sqrt(L / g);
  const omegaA = TWO_PI / T0;
  const TB = correction ? T0 * periodCorrection(thetaB * RAD) : T0;
  const omegaB = TWO_PI / TB;

  // Show 5 small-angle periods on the time slider.
  const T_DISPLAY = 5 * T0;
  const t = tFrac * T_DISPLAY;

  const angA = thetaA * RAD * Math.cos(omegaA * t);
  const angB = thetaB * RAD * Math.cos(omegaB * t);

  const Lpx = Math.max(60, Math.min(L_PX_PER_METER * L, 240));
  const bobAx = PIVOT_A_X + Lpx * Math.sin(angA);
  const bobAy = PIVOT_Y + Lpx * Math.cos(angA);
  const bobBx = PIVOT_B_X + Lpx * Math.sin(angB);
  const bobBy = PIVOT_Y + Lpx * Math.cos(angB);

  // Arc trail showing the swing range, drawn once per pendulum.
  const arcPath = (cx: number, theta0deg: number): string => {
    const r = Lpx;
    const a = theta0deg * RAD;
    const x1 = cx + r * Math.sin(-a);
    const y1 = PIVOT_Y + r * Math.cos(-a);
    const x2 = cx + r * Math.sin(a);
    const y2 = PIVOT_Y + r * Math.cos(a);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };

  const lagSec = correction ? Math.max(0, t - (omegaA / omegaB) * t) : 0;
  // ticksA = number of half-cycles A has completed (each half-cycle
  // crosses θ = 0). ticks B same with omegaB.
  const ticksA = Math.floor((omegaA * t) / Math.PI);
  const ticksB = Math.floor((omegaB * t) / Math.PI);

  return (
    <WidgetShell kicker={pick(language, "Widget — Two pendulums", "위젯 — 두 진자")}>
      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label={pick(
            language,
            "two pendulums of equal length and gravity, different amplitudes",
            "길이와 중력이 같고 진폭만 다른 두 진자",
          )}
        >
          {/* pivot bar */}
          <line
            x1={PIVOT_A_X - 60}
            y1={PIVOT_Y}
            x2={PIVOT_B_X + 60}
            y2={PIVOT_Y}
            stroke={COLOR.pivot}
            strokeWidth={1.5}
          />
          <line
            x1={PIVOT_A_X - 60}
            y1={PIVOT_Y - 5}
            x2={PIVOT_A_X - 60}
            y2={PIVOT_Y + 5}
            stroke={COLOR.pivot}
            strokeWidth={1.2}
          />
          <line
            x1={PIVOT_B_X + 60}
            y1={PIVOT_Y - 5}
            x2={PIVOT_B_X + 60}
            y2={PIVOT_Y + 5}
            stroke={COLOR.pivot}
            strokeWidth={1.2}
          />

          {/* arcs (swing range) */}
          <path
            d={arcPath(PIVOT_A_X, thetaA)}
            fill="none"
            stroke={COLOR.arc}
            strokeDasharray="3 3"
            strokeWidth={0.8}
          />
          <path
            d={arcPath(PIVOT_B_X, thetaB)}
            fill="none"
            stroke={COLOR.arc}
            strokeDasharray="3 3"
            strokeWidth={0.8}
          />

          {/* pendulum A */}
          <line
            x1={PIVOT_A_X}
            y1={PIVOT_Y}
            x2={bobAx}
            y2={bobAy}
            stroke={COLOR.rope}
            strokeWidth={1.5}
          />
          <circle cx={PIVOT_A_X} cy={PIVOT_Y} r={3} fill={COLOR.pivot} />
          <circle cx={bobAx} cy={bobAy} r={11} fill={COLOR.bobA} stroke="white" strokeWidth={1.5} />
          <text
            x={PIVOT_A_X}
            y={PIVOT_Y - 12}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={COLOR.bobA}
          >
            A · θ₀ = {thetaA}°
          </text>

          {/* pendulum B */}
          <line
            x1={PIVOT_B_X}
            y1={PIVOT_Y}
            x2={bobBx}
            y2={bobBy}
            stroke={COLOR.rope}
            strokeWidth={1.5}
          />
          <circle cx={PIVOT_B_X} cy={PIVOT_Y} r={3} fill={COLOR.pivot} />
          <circle cx={bobBx} cy={bobBy} r={11} fill={COLOR.bobB} stroke="white" strokeWidth={1.5} />
          <text
            x={PIVOT_B_X}
            y={PIVOT_Y - 12}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={COLOR.bobB}
          >
            B · θ₀ = {thetaB}°
          </text>
        </svg>
      </div>

      <div
        role="status"
        aria-live="polite"
        className="mt-3 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "T₀ (small angle)", "T₀ (작은 각)")}
          value={`${fmt(T0, 3)} s`}
        />
        <Stat
          label={pick(language, "T_B (with correction)", "T_B (보정 적용)")}
          value={`${fmt(TB, 3)} s`}
          color={correction && Math.abs(TB - T0) > 1e-3 ? COLOR.bobB : undefined}
        />
        <Stat
          label={pick(language, "swings · A / B", "흔들림 · A / B")}
          value={`${ticksA} / ${ticksB}`}
        />
        <Stat
          label={pick(language, "B's lag", "B의 지연")}
          value={correction ? `${fmt(lagSec, 2)} s` : pick(language, "(off)", "(꺼짐)")}
          color={correction && lagSec > 0.05 ? COLOR.bobB : undefined}
        />
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "length L (m)", "길이 L (m)")}
          value={L}
          onChange={setL}
          min={0.3}
          max={2.0}
          step={0.05}
          accent="var(--ink)"
          display={`${fmt(L, 2)} m`}
        />
        <Slider
          label={pick(language, "gravity g (m/s²)", "중력 g (m/s²)")}
          value={g}
          onChange={setG}
          min={1.6}
          max={25}
          step={0.1}
          accent="var(--ink-mute)"
          display={`${fmt(g, 1)} m/s²`}
        />
        <Slider
          label={pick(language, "θ_A (deg)", "θ_A (도)")}
          value={thetaA}
          onChange={setThetaA}
          min={2}
          max={75}
          step={1}
          accent={COLOR.bobA}
          display={`${thetaA}°`}
        />
        <Slider
          label={pick(language, "θ_B (deg)", "θ_B (도)")}
          value={thetaB}
          onChange={setThetaB}
          min={2}
          max={75}
          step={1}
          accent={COLOR.bobB}
          display={`${thetaB}°`}
        />
        <Slider
          label={pick(language, "time t / 5 T₀", "시간 t / 5 T₀")}
          value={tFrac}
          onChange={setTFrac}
          min={0}
          max={1}
          step={0.005}
          accent="var(--acc)"
          display={`${(tFrac * 100).toFixed(0)}%`}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCorrection((v) => !v)}
          className={
            "rounded-full border px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors " +
            (correction
              ? "border-acc bg-acc/10 text-acc"
              : "border-rule text-ink-mute hover:border-acc hover:text-acc")
          }
        >
          {pick(language, "show large-angle correction", "큰 각 보정 적용")}
        </button>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            With correction <b>off</b>, both pendulums use the small-angle period{" "}
            <span className="font-mono">T₀ = 2π√(L/g)</span>. Drag <b>θ_B</b> to anything you like;
            A and B stay perfectly synchronized. <em>That</em> is the lie the pendulum clock runs
            on. Now flip correction <b>on</b>: B uses the leading-order Borda correction{" "}
            <span className="font-mono">T₀(1 + θ_B²/16)</span>. With <b>θ_B = 60°</b> and a few
            periods on the time slider, B visibly lags A — small here, painful by the end of a real
            day.
          </>,
          <>
            보정 <b>꺼짐</b>일 때 두 진자 모두 작은 각 주기{" "}
            <span className="font-mono">T₀ = 2π√(L/g)</span>를 쓴다. <b>θ_B</b>를 어디로 끌어도 A와
            B는 완벽히 동기. <em>그것</em>이 진자시계가 서 있는 거짓말. 이제 보정 <b>켜짐</b>: B는
            1차 Borda 보정 <span className="font-mono">T₀(1 + θ_B²/16)</span>를 쓴다.{" "}
            <b>θ_B = 60°</b>로 두고 시간 슬라이더를 몇 주기 진행시키면 B가 눈에 보이게 뒤처진다 —
            여기선 작지만, 진짜 하루 끝엔 견딜 수 없는 양이 된다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
