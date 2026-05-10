import { useContext, useMemo, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Portfolio Mixer.
//
// Two assets A and B with the same mean return and (for v1 simplicity) the
// same standard deviation σ. The reader controls correlation ρ ∈ [-1, 1] and
// portfolio weight w ∈ [0, 1] (fraction in A; 1-w in B).
//
// Portfolio variance: σ²_p(w) = w² σ_A² + (1-w)² σ_B² + 2 w (1-w) ρ σ_A σ_B
// At ρ = +1: σ_p is linear in w — variance never falls below min(σ_A, σ_B)².
// At ρ < 1: σ²_p is convex with a minimum interior to (0, 1).
// At ρ = -1 with σ_A = σ_B: σ_p hits zero at w = 0.5 — "risk disappears".
//
// Two views:
//   • Left:  scatter of joint returns sampled with chosen ρ — visual ρ.
//   • Right: σ²_p(w) curve, highlighting the current w + min-variance w*.

const N_SAMPLES = 200;
const SIG_A = 1.0; // standard deviation of asset A
const SIG_B = 1.0; // standard deviation of asset B (kept equal in v1)
const MU_A = 0.05; // mean return — same for both, so the average of the
const MU_B = 0.05; //   portfolio is constant; only variance moves.

const W_PRESETS = [-1, 0, 1] as const;
const PRESET_LABELS: Record<string, { en: string; ko: string }> = {
  "-1": { en: "ρ = −1 (anti)", ko: "ρ = −1 (반대)" },
  "0": { en: "ρ = 0 (uncorrelated)", ko: "ρ = 0 (무상관)" },
  "1": { en: "ρ = +1 (lockstep)", ko: "ρ = +1 (한 몸)" },
};

// Deterministic Box-Muller-style normal pairs with desired correlation.
// Cholesky on the 2x2 covariance: B = ρ A + sqrt(1-ρ²) Z.
function sampleJointReturns(rho: number, seed: number): { a: number; b: number }[] {
  let s = seed >>> 0;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  const out: { a: number; b: number }[] = [];
  for (let i = 0; i < N_SAMPLES; i++) {
    // Box-Muller: two independent N(0,1) draws.
    const u1 = Math.max(rng(), 1e-9);
    const u2 = rng();
    const r = Math.sqrt(-2 * Math.log(u1));
    const z1 = r * Math.cos(2 * Math.PI * u2);
    const z2 = r * Math.sin(2 * Math.PI * u2);
    const a = MU_A + SIG_A * z1;
    const b = MU_B + SIG_B * (rho * z1 + Math.sqrt(Math.max(0, 1 - rho * rho)) * z2);
    out.push({ a, b });
  }
  return out;
}

function portfolioVariance(w: number, rho: number): number {
  return (
    w * w * SIG_A * SIG_A +
    (1 - w) * (1 - w) * SIG_B * SIG_B +
    2 * w * (1 - w) * rho * SIG_A * SIG_B
  );
}

// Closed-form minimum-variance weight (assets A, B; same σ here, so it
// reduces to 0.5 for any ρ — but we keep the general expression in case a
// future v2 lets σ_A ≠ σ_B).
function minVarWeight(rho: number): number {
  const num = SIG_B * SIG_B - rho * SIG_A * SIG_B;
  const den = SIG_A * SIG_A + SIG_B * SIG_B - 2 * rho * SIG_A * SIG_B;
  if (Math.abs(den) < 1e-9) return 0.5;
  return Math.max(0, Math.min(1, num / den));
}

// Layout for the variance curve plot.
const PLOT_W = 320;
const PLOT_H = 200;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 28;
const INNER_W = PLOT_W - PAD_L - PAD_R;
const INNER_H = PLOT_H - PAD_T - PAD_B;
const Y_MAX = 1.05; // covers σ² up to a little over 1 (since σ=1 each)

// Layout for the scatter plot.
const SC_W = 240;
const SC_H = 240;
const SC_PAD = 16;
const SC_INNER = SC_W - 2 * SC_PAD;
const SC_RANGE = 4; // ±4 σ window

const fmt = (n: number, d = 3) => n.toFixed(d);
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export function PortfolioMixer({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [rho, setRho] = useState(0);
  const [w, setW] = useState(0.5);
  const [seed, setSeed] = useState(13);

  const samples = useMemo(() => sampleJointReturns(rho, seed), [rho, seed]);
  const varP = portfolioVariance(w, rho);
  const sigP = Math.sqrt(Math.max(0, varP));
  const wStar = minVarWeight(rho);
  const varStar = portfolioVariance(wStar, rho);
  const sigStar = Math.sqrt(Math.max(0, varStar));

  // Variance curve sampled at 0..1.
  const curve = useMemo(() => {
    const STEPS = 100;
    const pts: { w: number; v: number }[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const wi = i / STEPS;
      pts.push({ w: wi, v: portfolioVariance(wi, rho) });
    }
    return pts;
  }, [rho]);

  // Plot helpers (curve panel).
  const xC = (wi: number) => PAD_L + wi * INNER_W;
  const yC = (v: number) => PAD_T + (1 - Math.min(v, Y_MAX) / Y_MAX) * INNER_H;
  const curvePath = (() => {
    const parts: string[] = [];
    for (let i = 0; i < curve.length; i++) {
      const p = curve[i];
      parts.push(`${i === 0 ? "M" : "L"}${xC(p.w).toFixed(2)},${yC(p.v).toFixed(2)}`);
    }
    return parts.join(" ");
  })();

  // Scatter helpers.
  const xS = (a: number) => SC_PAD + ((a - MU_A) / SC_RANGE + 0.5) * SC_INNER;
  const yS = (b: number) => SC_PAD + (0.5 - (b - MU_B) / SC_RANGE) * SC_INNER;

  return (
    <WidgetShell kicker={pick(language, "Widget — Portfolio mixer", "위젯 — 포트폴리오 믹서")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "ρ", "ρ")}
          value={fmt(rho, 2)}
          color={rho < 0 ? C.curveAlt : rho > 0.5 ? C.secant : undefined}
        />
        <Stat label={pick(language, "weight w (A)", "비중 w (A)")} value={pct(w)} />
        <Stat
          label={pick(language, "σ_p (current)", "σ_p (현재)")}
          value={fmt(sigP)}
          color={sigP < 0.5 ? C.curveAlt : sigP > 0.9 ? C.secant : undefined}
        />
        <Stat
          label={pick(language, "σ_p (min @ w*)", "σ_p (최소 @ w*)")}
          value={fmt(sigStar)}
          color={C.curveAlt}
        />
      </div>

      <div className="grid grid-cols-[auto_1fr] items-start gap-5 max-md:grid-cols-1">
        {/* Joint returns scatter — visual ρ */}
        <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
          <div className="border-b border-rule px-3 pt-2 pb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            {pick(language, "joint returns · A vs B", "결합 수익률 · A 대 B")}
          </div>
          <svg
            viewBox={`0 0 ${SC_W} ${SC_H}`}
            width="100%"
            style={{ display: "block", maxWidth: SC_W }}
            role="img"
            aria-label={pick(
              language,
              `scatter plot of asset A return versus asset B return at correlation ${fmt(rho, 2)}`,
              `상관계수 ${fmt(rho, 2)}에서 자산 A 수익률 대 자산 B 수익률 산점도`,
            )}
          >
            {/* axes through means */}
            <line
              x1={SC_PAD}
              y1={yS(MU_B)}
              x2={SC_W - SC_PAD}
              y2={yS(MU_B)}
              stroke={C.axis}
              strokeWidth={0.6}
              opacity={0.4}
            />
            <line
              x1={xS(MU_A)}
              y1={SC_PAD}
              x2={xS(MU_A)}
              y2={SC_H - SC_PAD}
              stroke={C.axis}
              strokeWidth={0.6}
              opacity={0.4}
            />
            {samples.map((s, i) => (
              <circle
                key={`pt-${i.toString().padStart(3, "0")}`}
                cx={xS(s.a)}
                cy={yS(s.b)}
                r={1.7}
                fill={C.curve}
                opacity={0.55}
              />
            ))}
            <text
              x={SC_W - SC_PAD}
              y={yS(MU_B) - 4}
              textAnchor="end"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
              fill={C.axis}
            >
              A →
            </text>
            <text
              x={xS(MU_A) + 4}
              y={SC_PAD + 8}
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
              fill={C.axis}
            >
              B ↑
            </text>
          </svg>
        </div>

        {/* Variance vs w curve — the teaching plot */}
        <div className="rounded-md border border-rule bg-bg-card p-3">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            {pick(
              language,
              "portfolio variance σ²_p as a function of w",
              "포트폴리오 분산 σ²_p, w의 함수",
            )}
          </div>
          <svg
            viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
            width="100%"
            style={{ display: "block" }}
            role="img"
            aria-label={pick(
              language,
              "portfolio variance versus weight curve",
              "포트폴리오 분산 대 비중 곡선",
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
            {/* gridlines + y ticks */}
            {[0.25, 0.5, 0.75, 1.0].map((v) => (
              <g key={`g-${v}`}>
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
                  style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
                  fill={C.axis}
                >
                  {v.toFixed(2)}
                </text>
              </g>
            ))}
            {/* x ticks 0, 0.5, 1 */}
            {[0, 0.5, 1].map((wt) => (
              <text
                key={`xt-${wt}`}
                x={xC(wt)}
                y={PAD_T + INNER_H + 14}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                fill={C.axis}
              >
                {wt.toFixed(1)}
              </text>
            ))}
            <text
              x={PAD_L + INNER_W / 2}
              y={PLOT_H - 4}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
              fill={C.axis}
            >
              w (fraction in A)
            </text>
            {/* horizontal reference: σ_A² = σ_B² = 1 (the no-mix variance) */}
            <line
              x1={PAD_L}
              y1={yC(SIG_A * SIG_A)}
              x2={PAD_L + INNER_W}
              y2={yC(SIG_A * SIG_A)}
              stroke={C.axis}
              strokeWidth={0.8}
              strokeDasharray="3 3"
              opacity={0.6}
            />
            {/* the curve */}
            <path d={curvePath} fill="none" stroke={C.curve} strokeWidth={2} />
            {/* min-variance marker */}
            <circle cx={xC(wStar)} cy={yC(varStar)} r={4} fill={C.curveAlt} />
            <line
              x1={xC(wStar)}
              y1={yC(varStar)}
              x2={xC(wStar)}
              y2={PAD_T + INNER_H}
              stroke={C.curveAlt}
              strokeWidth={0.8}
              strokeDasharray="2 3"
              opacity={0.7}
            />
            {/* current-w marker */}
            <circle
              cx={xC(w)}
              cy={yC(varP)}
              r={5}
              fill={C.secant}
              stroke="white"
              strokeWidth={1.5}
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "correlation ρ", "상관계수 ρ")}
          value={rho}
          onChange={setRho}
          min={-1}
          max={1}
          step={0.01}
          accent={C.curve}
          display={fmt(rho, 2)}
        />
        <Slider
          label={pick(language, "weight w (A)", "비중 w (A)")}
          value={w}
          onChange={setW}
          min={0}
          max={1}
          step={0.01}
          accent={C.secant}
          display={pct(w)}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {W_PRESETS.map((p) => (
            <button
              key={`rho-${p}`}
              type="button"
              onClick={() => setRho(p)}
              className={pillClass(Math.abs(rho - p) < 0.005)}
            >
              {pick(language, PRESET_LABELS[String(p)].en, PRESET_LABELS[String(p)].ko)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-full border border-rule bg-bg px-3.5 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-acc hover:text-acc"
          >
            {pick(language, "resample", "다시 뽑기")}
          </button>
          <span className="ml-auto font-mono text-[11.5px] text-ink-mute">
            {pick(language, "w* = ", "w* = ")}
            {fmt(wStar, 2)}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Two assets, both with mean return <span className="font-mono">5%</span> and standard
            deviation <span className="font-mono">σ = 1</span>. The mean of any mix is the same{" "}
            <span className="font-mono">5%</span> — but the <em>variance</em> isn't. The dashed line
            is the no-mix reference (<span className="font-mono">σ² = 1</span>); the green dot is
            the minimum-variance weight <span className="font-mono">w*</span>; the orange dot is the
            mix you've chosen. At <span className="font-mono">ρ = +1</span> the curve is a flat line
            at <span className="font-mono">1</span> — mixing buys nothing. At{" "}
            <span className="font-mono">ρ = 0</span> the curve sags to{" "}
            <span className="font-mono">0.5</span> at <span className="font-mono">w = 0.5</span>. At{" "}
            <span className="font-mono">ρ = −1</span> it touches{" "}
            <span className="font-mono">0</span> — risk disappears entirely. Same expected return,
            wildly different risk; the cross-term <em>2 w (1−w) ρ σ_A σ_B</em> is the lever.
          </>,
          <>
            두 자산, 둘 다 평균 수익률 <span className="font-mono">5%</span>, 표준편차{" "}
            <span className="font-mono">σ = 1</span>. 어떤 비중이든 평균은 똑같은{" "}
            <span className="font-mono">5%</span>. 그러나 <em>분산</em>은 다르다. 점선은 섞지 않을
            때의 기준 (<span className="font-mono">σ² = 1</span>). 초록 점은 분산 최소 비중{" "}
            <span className="font-mono">w*</span>. 주황 점은 네가 고른 비중.{" "}
            <span className="font-mono">ρ = +1</span>
            에서 곡선은 <span className="font-mono">1</span>의 평평한 직선 — 섞어도 얻는 게 없다.{" "}
            <span className="font-mono">ρ = 0</span>에서 곡선은{" "}
            <span className="font-mono">w = 0.5</span>에서 <span className="font-mono">0.5</span>
            까지 내려간다. <span className="font-mono">ρ = −1</span>에서는{" "}
            <span className="font-mono">0</span>에 닿는다 — 위험이 완전히 사라진다. 같은 기대 수익,
            전혀 다른 위험. <em>2 w (1−w) ρ σ_A σ_B</em>의 교차항이 그 지렛대.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
