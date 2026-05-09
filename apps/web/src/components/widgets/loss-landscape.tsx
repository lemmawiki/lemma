import { useEffect, useRef, useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Widget — Loss Landscape (1D descent).
// One parameter w, one example (x = 2, y = 6). Loss(w) = (w·x − y)² is a
// parabola with minimum at w* = y/x = 3. Each "Step" applies one gradient
// update w ← w − η · L'(w). The trajectory leaves a faint trail. Three
// learning-rate presets show: too small (slow), good (fast), too large
// (oscillating divergence). The same loop scales to higher-dimensional ML;
// the geometry stays this picture.

const X_DATA = 2;
const Y_DATA = 6;
const W_STAR = Y_DATA / X_DATA; // 3

const W_MIN = -1.5;
const W_MAX = 7.5;
const LOSS_DISPLAY_MAX = 60;

function loss(w: number): number {
  return (w * X_DATA - Y_DATA) ** 2;
}
function grad(w: number): number {
  return 2 * X_DATA * (w * X_DATA - Y_DATA);
}

const W = 540;
const H = 320;
const PAD_X = 36;
const PAD_Y = 28;

const sx = (w: number) => PAD_X + ((w - W_MIN) / (W_MAX - W_MIN)) * (W - 2 * PAD_X);
const sy = (l: number) =>
  H - PAD_Y - (Math.min(l, LOSS_DISPLAY_MAX) / LOSS_DISPLAY_MAX) * (H - 2 * PAD_Y);

const COLOR = {
  curve: "#1e6da6",
  axis: "#9ca3a4",
  point: "#b6451e", // current w — accent-deep
  tangent: "#3a8c4a", // gradient arrow — green
  trail: "#7a5c2c", // past-step trail — brown
  optimum: "#9ca3a4",
} as const;

const PRESETS = {
  small: { lr: 0.04, label: { en: "small (slow)", ko: "작음 (느림)" } },
  good: { lr: 0.12, label: { en: "good", ko: "적당" } },
  big: { lr: 0.27, label: { en: "too big (diverges)", ko: "너무 큼 (발산)" } },
} as const;

function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return n > 0 ? "∞" : "−∞";
  return Math.abs(n) > 1e6 ? n.toExponential(1) : n.toFixed(d);
}

export function LossLandscape() {
  const { language } = useApp();
  const [w, setW] = useState(0);
  const [lr, setLr] = useState(0.04);
  const [history, setHistory] = useState<number[]>([0]);
  const [auto, setAuto] = useState(false);

  // Auto-step: 60 steps over 6 seconds. Stops at convergence (|grad| < 1e-3)
  // or divergence (|w| > some big number).
  const tickRef = useRef<number | null>(null);
  useEffect(() => {
    if (!auto) {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }
    const id = window.setInterval(() => {
      setW((cur) => {
        if (Math.abs(grad(cur)) < 1e-3 || Math.abs(cur) > 1e6) {
          setAuto(false);
          return cur;
        }
        const next = cur - lr * grad(cur);
        setHistory((h) => [...h, next]);
        return next;
      });
    }, 100);
    tickRef.current = id;
    return () => {
      window.clearInterval(id);
      tickRef.current = null;
    };
  }, [auto, lr]);

  const step = () => {
    const next = w - lr * grad(w);
    setW(next);
    setHistory((h) => [...h, next]);
  };
  const reset = () => {
    setW(0);
    setHistory([0]);
    setAuto(false);
  };

  // Sampled curve points.
  const curvePts = (() => {
    const pts: string[] = [];
    const N = 100;
    for (let i = 0; i <= N; i++) {
      const ww = W_MIN + ((W_MAX - W_MIN) * i) / N;
      pts.push(`${sx(ww)},${sy(loss(ww))}`);
    }
    return pts.join(" ");
  })();

  // Downhill arrow: horizontal indicator of which way w should move.
  // Pointing strictly along the tangent would make the arrow flip vertically
  // near the minimum (slope very small); a fixed horizontal length keyed off
  // the gradient sign reads more clearly as "this direction" at every point.
  const g = grad(w);
  const TANGENT_X_PX = clamp(-Math.sign(g) * 60, -80, 80);

  // Visible trail: render last N steps as faint dots + connecting lines.
  const visibleTrail = history.slice(Math.max(0, history.length - 30));

  // Status flags
  const converged = Math.abs(g) < 1e-3;
  const diverged = Math.abs(w) > 1e3;
  const ratio = Math.abs(1 - 8 * lr); // |1 - lr·L''| for our quadratic
  const stable = ratio < 1;

  return (
    <WidgetShell kicker={pick(language, "Widget — Loss landscape", "위젯 — 손실 풍경")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "w", "w")}
          value={fmt(w, 4)}
          color={Math.abs(w - W_STAR) < 0.05 ? COLOR.tangent : undefined}
        />
        <Stat label={pick(language, "L(w)", "L(w)")} value={fmt(loss(w), 3)} />
        <Stat
          label={pick(language, "L'(w) = ∇L", "L'(w) = ∇L")}
          value={fmt(g, 3)}
          color={COLOR.tangent}
        />
        <Stat
          label={pick(language, "step #", "스텝")}
          value={`${history.length - 1}`}
          color={converged ? COLOR.tangent : diverged ? COLOR.point : undefined}
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
            "1D loss landscape with descent trail",
            "1차원 손실 풍경과 하강 흔적",
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
          {/* w-axis tick at minimum */}
          <line
            x1={sx(W_STAR)}
            y1={sy(0)}
            x2={sx(W_STAR)}
            y2={sy(0) + 4}
            stroke={COLOR.optimum}
            strokeWidth={1}
          />
          <text
            x={sx(W_STAR)}
            y={sy(0) + 16}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            fill={COLOR.optimum}
          >
            w* = {W_STAR}
          </text>

          {/* loss curve */}
          <polyline points={curvePts} fill="none" stroke={COLOR.curve} strokeWidth={2} />

          {/* Trail: past steps, faint. Each segment is keyed by its absolute
              step index in the full history, which is monotonic and unique
              even if w-values repeat under oscillation. */}
          {visibleTrail.slice(0, -1).map((prev, idx) => {
            const next = visibleTrail[idx + 1];
            const stepIdx = history.length - visibleTrail.length + idx;
            const opacity = 0.15 + 0.6 * (idx / visibleTrail.length);
            return (
              <line
                key={`trail-step-${stepIdx}`}
                x1={sx(prev)}
                y1={sy(loss(prev))}
                x2={sx(next)}
                y2={sy(loss(next))}
                stroke={COLOR.trail}
                strokeWidth={1}
                opacity={opacity}
              />
            );
          })}
          {visibleTrail.slice(0, -1).map((wPast, idx) => {
            const stepIdx = history.length - visibleTrail.length + idx;
            return (
              <circle
                key={`tdot-step-${stepIdx}`}
                cx={sx(wPast)}
                cy={sy(loss(wPast))}
                r={2}
                fill={COLOR.trail}
                opacity={0.15 + 0.5 * (idx / visibleTrail.length)}
              />
            );
          })}

          {/* downhill arrow at current w */}
          <line
            x1={sx(w)}
            y1={sy(loss(w))}
            x2={sx(w) + TANGENT_X_PX}
            y2={sy(loss(w))}
            stroke={COLOR.tangent}
            strokeWidth={2}
            markerEnd="url(#arrow-descent)"
          />
          <defs>
            <marker
              id="arrow-descent"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth={5}
              markerHeight={5}
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={COLOR.tangent} />
            </marker>
          </defs>

          {/* current point */}
          <circle
            cx={sx(w)}
            cy={sy(loss(w))}
            r={6}
            fill={COLOR.point}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={sx(w) + 9}
            y={sy(loss(w)) - 9}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={COLOR.point}
          >
            w
          </text>
        </svg>
      </div>

      {/* controls */}
      <div className="mt-4 grid gap-2.5">
        <label className="grid grid-cols-[140px_1fr_70px] items-center gap-3 text-[13px] max-md:grid-cols-[100px_1fr_56px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-ink-mute">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: COLOR.point }}
              aria-hidden
            />
            {pick(language, "start w₀", "출발 w₀")}
          </span>
          <input
            type="range"
            className="w-full"
            style={{ accentColor: COLOR.point }}
            min={-1}
            max={7}
            step={0.1}
            value={history[0]}
            onChange={(e) => {
              const v = +e.target.value;
              setW(v);
              setHistory([v]);
              setAuto(false);
            }}
          />
          <span className="text-right font-mono text-[12.5px] text-ink">{fmt(history[0], 2)}</span>
        </label>
        <label className="grid grid-cols-[140px_1fr_70px] items-center gap-3 text-[13px] max-md:grid-cols-[100px_1fr_56px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-ink-mute">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: COLOR.tangent }}
              aria-hidden
            />
            {pick(language, "learning rate η", "학습률 η")}
          </span>
          <input
            type="range"
            className="w-full"
            style={{ accentColor: COLOR.tangent }}
            min={0.001}
            max={0.4}
            step={0.001}
            value={lr}
            onChange={(e) => {
              setLr(+e.target.value);
              setAuto(false);
            }}
          />
          <span className="text-right font-mono text-[12.5px] text-ink">{fmt(lr, 3)}</span>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(
          Object.entries(PRESETS) as [
            keyof typeof PRESETS,
            (typeof PRESETS)[keyof typeof PRESETS],
          ][]
        ).map(([key, p]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setLr(p.lr);
              setAuto(false);
            }}
            className={
              "rounded-full border px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors " +
              (Math.abs(lr - p.lr) < 1e-4
                ? "border-acc bg-acc/10 text-acc"
                : "border-rule text-ink-mute hover:border-acc hover:text-acc")
            }
          >
            η = {p.lr} · {pick(language, p.label.en, p.label.ko)}
          </button>
        ))}
        <span className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={step}
            disabled={converged || diverged || auto}
            className="rounded-full border border-rule px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-mute hover:border-acc hover:text-acc disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pick(language, "step", "한 스텝")}
          </button>
          <button
            type="button"
            onClick={() => setAuto((v) => !v)}
            className={
              "rounded-full border px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors " +
              (auto
                ? "border-acc bg-acc/10 text-acc"
                : "border-rule text-ink-mute hover:border-acc hover:text-acc")
            }
          >
            {auto ? pick(language, "stop", "정지") : pick(language, "auto", "자동")}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-rule px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-mute hover:border-acc hover:text-acc"
          >
            {pick(language, "reset", "초기화")}
          </button>
        </span>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            One parameter <b>w</b>, one example <span className="font-mono">(x, y) = (2, 6)</span>,
            quadratic loss <span className="font-mono">L(w) = (w·x − y)²</span> with minimum at{" "}
            <span className="font-mono">w* = 3</span>. Hit <b>step</b> repeatedly with{" "}
            <span className="font-mono">η = 0.04</span> and watch a slow descent. Switch to{" "}
            <span className="font-mono">η = 0.12</span>: nearly Newton-fast — almost one shot.
            Switch to <span className="font-mono">η = 0.27</span> and click <b>auto</b>: the
            iterates oscillate and grow without bound. The boundary <em>η &lt; 2/L''(w*)</em> (here{" "}
            <span className="font-mono">2/8 = 0.25</span>) is the entire stability theory of the
            method, distilled into one widget.
            {!stable && (
              <>
                {" "}
                <span className="text-acc-deep">
                  ⚠{" "}
                  {pick(
                    language,
                    "current η is unstable for this loss.",
                    "현재 η는 이 손실에서 불안정.",
                  )}
                </span>
              </>
            )}
          </>,
          <>
            매개변수 하나 <b>w</b>, 예제 하나 <span className="font-mono">(x, y) = (2, 6)</span>,
            이차 손실 <span className="font-mono">L(w) = (w·x − y)²</span>, 최솟값은{" "}
            <span className="font-mono">w* = 3</span>. <span className="font-mono">η = 0.04</span>로
            <b>한 스텝</b>을 반복하면 느린 하강. <span className="font-mono">η = 0.12</span>로
            바꾸면 거의 뉴턴-속도 — 한 방에 가까움. <span className="font-mono">η = 0.27</span>로
            두고 <b>자동</b>을 누르면 갱신이 진동하며 무한히 커진다. 경계 <em>η &lt; 2/L''(w*)</em>{" "}
            (여기선 <span className="font-mono">2/8 = 0.25</span>)이 이 방법의 안정성 이론 *전부* —
            위젯 한 화면에 압축돼 있다.
            {!stable && (
              <>
                {" "}
                <span className="text-acc-deep">
                  ⚠ {pick(language, "current η is unstable.", "현재 η는 불안정.")}
                </span>
              </>
            )}
          </>,
        )}
      </div>
    </WidgetShell>
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
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
