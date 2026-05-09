import { useContext, useMemo, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Reliability Diagram.
// A synthetic but honest model: starts from a stated probability p, maps it
// to the true frequency `actual(p) = sigmoid(T · logit(p))`. T = 1 is the
// diagonal (perfect calibration). T < 1 squashes confidence toward 0.5 — but
// we apply it on the *logit*, so the model that *says* 0.9 is right less
// often than 0.9 → looks overconfident. T > 1 sharpens — model is
// underconfident. Bins of width 0.1 give the bar chart; the focal bin is
// linearized to show "the local fix is one slope away."

const BINS = 10;
const BIN_W = 1 / BINS;

const W = 520;
const H = 360;
const PAD_L = 44;
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 36;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

const BIN_IDS = ["b00", "b01", "b02", "b03", "b04", "b05", "b06", "b07", "b08", "b09"] as const;

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

function logit(p: number) {
  const c = clamp(p, 1e-6, 1 - 1e-6);
  return Math.log(c / (1 - c));
}

// The miscalibrated model. T encodes *sharpness* of the model relative to
// truth: T < 1 means stated logits are larger than reality → overconfident.
// We invert by dividing logit by T to compute the truth that the model
// actually corresponds to.
function actual(p: number, T: number): number {
  if (T <= 0) return p;
  return sigmoid(logit(p) / T);
}

function actualSlope(p: number, T: number): number {
  // d/dp actual(p) = (1/T) · σ'(logit(p)/T) · 1/(p(1-p))
  // where σ'(z) = σ(z)(1-σ(z)).
  const c = clamp(p, 1e-4, 1 - 1e-4);
  const z = logit(c) / T;
  const s = sigmoid(z);
  return (s * (1 - s)) / (T * c * (1 - c));
}

// Map plot coords -> SVG.
const xS = (p: number) => PAD_L + p * PLOT_W;
const yS = (a: number) => PAD_T + (1 - a) * PLOT_H;

type Preset = "over" | "calibrated" | "under";
const PRESET_T: Record<Preset, number> = {
  over: 0.55,
  calibrated: 1.0,
  under: 1.55,
};

const fmt = (n: number, d = 2) => n.toFixed(d);
const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

export function ReliabilityDiagram({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [T, setT] = useState(PRESET_T.over);
  const [focalIdx, setFocalIdx] = useState(8); // bin centered at 0.85

  const bins = useMemo(() => {
    return BIN_IDS.map((id, i) => {
      const lo = i * BIN_W;
      const hi = lo + BIN_W;
      const center = (lo + hi) / 2;
      return { id, lo, hi, center, accuracy: actual(center, T) };
    });
  }, [T]);

  // Expected calibration error — uniform weighting across bins (each bin gets
  // equal weight; honest enough for a teaching widget).
  const ece = useMemo(() => {
    let sum = 0;
    for (const b of bins) sum += Math.abs(b.center - b.accuracy);
    return sum / bins.length;
  }, [bins]);

  const focal = bins[focalIdx];
  const focalSlope = actualSlope(focal.center, T);
  // Tangent line at focal: y - actual(c) = slope * (x - c).
  const tangentY = (x: number) => focal.accuracy + focalSlope * (x - focal.center);

  const presetOf = (t: number): Preset | null => {
    const eps = 0.02;
    if (Math.abs(t - PRESET_T.over) < eps) return "over";
    if (Math.abs(t - PRESET_T.calibrated) < eps) return "calibrated";
    if (Math.abs(t - PRESET_T.under) < eps) return "under";
    return null;
  };
  const activePreset = presetOf(T);

  const labelKor = (p: Preset) =>
    p === "over" ? "과신" : p === "calibrated" ? "정확히 보정됨" : "과소확신";
  const labelEng = (p: Preset) =>
    p === "over" ? "overconfident" : p === "calibrated" ? "calibrated" : "underconfident";

  return (
    <WidgetShell
      kicker={pick(language, "Widget — Reliability diagram", "위젯 — 신뢰도 다이어그램")}
    >
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "regime", "상태")}
          value={pick(
            language,
            activePreset ? labelEng(activePreset) : "custom",
            activePreset ? labelKor(activePreset) : "사용자 설정",
          )}
          color={
            activePreset === "over"
              ? C.secant
              : activePreset === "under"
                ? C.curve
                : activePreset === "calibrated"
                  ? C.curveAlt
                  : undefined
          }
        />
        <Stat label={pick(language, "T (truth)", "T (진실)")} value={fmt(T, 2)} />
        <Stat
          label={pick(language, "focal bin", "선택 구간")}
          value={`[${fmt(focal.lo, 1)}, ${fmt(focal.hi, 1)}]`}
        />
        <Stat
          label={pick(language, "ECE", "ECE")}
          value={fmt(ece, 3)}
          color={ece > 0.04 ? C.secant : C.curveAlt}
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
            "reliability diagram with bars per bin and the y=x diagonal",
            "구간별 막대와 y=x 대각선이 있는 신뢰도 다이어그램",
          )}
        >
          {/* Plot frame */}
          <rect
            x={PAD_L}
            y={PAD_T}
            width={PLOT_W}
            height={PLOT_H}
            fill="white"
            stroke={C.axis}
            strokeWidth={1}
          />

          {/* Gridlines */}
          {[0.2, 0.4, 0.6, 0.8].map((v) => (
            <g key={`grid-${v}`}>
              <line
                x1={xS(v)}
                y1={PAD_T}
                x2={xS(v)}
                y2={PAD_T + PLOT_H}
                stroke={C.axis}
                strokeWidth={0.5}
                opacity={0.35}
              />
              <line
                x1={PAD_L}
                y1={yS(v)}
                x2={PAD_L + PLOT_W}
                y2={yS(v)}
                stroke={C.axis}
                strokeWidth={0.5}
                opacity={0.35}
              />
            </g>
          ))}

          {/* Diagonal y = x — perfect calibration */}
          <line
            x1={xS(0)}
            y1={yS(0)}
            x2={xS(1)}
            y2={yS(1)}
            stroke={C.curveAlt}
            strokeWidth={1.6}
            strokeDasharray="6 4"
          />

          {/* Bars: predicted-prob bin → observed accuracy */}
          {bins.map((b, i) => {
            const isFocal = i === focalIdx;
            const x = xS(b.lo) + 2;
            const w = (b.hi - b.lo) * PLOT_W - 4;
            const top = yS(b.accuracy);
            const bottom = yS(0);
            const fill = isFocal
              ? C.secant
              : b.accuracy < b.center
                ? "#d6a48a"
                : b.accuracy > b.center
                  ? "#a4b8d6"
                  : "#bfd6c4";
            return (
              <g key={b.id}>
                <rect
                  x={x}
                  y={top}
                  width={w}
                  height={Math.max(0, bottom - top)}
                  fill={fill}
                  opacity={0.85}
                  stroke={isFocal ? C.secant : "white"}
                  strokeWidth={isFocal ? 2 : 1}
                  style={{ cursor: "pointer" }}
                  onClick={() => setFocalIdx(i)}
                />
                {/* gap line: from bar top to diagonal */}
                <line
                  x1={xS(b.center)}
                  y1={top}
                  x2={xS(b.center)}
                  y2={yS(b.center)}
                  stroke={C.tangent}
                  strokeWidth={isFocal ? 1.6 : 0.9}
                  strokeDasharray="2 3"
                  opacity={isFocal ? 0.95 : 0.55}
                />
              </g>
            );
          })}

          {/* Smooth miscalibration curve (continuous version of bars) */}
          <path
            d={(() => {
              const pts: string[] = [];
              const STEPS = 80;
              for (let i = 0; i <= STEPS; i++) {
                const p = i / STEPS;
                pts.push(
                  `${i === 0 ? "M" : "L"}${xS(p).toFixed(2)},${yS(actual(p, T)).toFixed(2)}`,
                );
              }
              return pts.join(" ");
            })()}
            fill="none"
            stroke={C.curve}
            strokeWidth={1.8}
            opacity={0.8}
          />

          {/* Tangent at focal bin — local linearization */}
          <line
            x1={xS(Math.max(0, focal.center - 0.18))}
            y1={yS(clamp(tangentY(Math.max(0, focal.center - 0.18)), -0.05, 1.05))}
            x2={xS(Math.min(1, focal.center + 0.18))}
            y2={yS(clamp(tangentY(Math.min(1, focal.center + 0.18)), -0.05, 1.05))}
            stroke={C.tangent}
            strokeWidth={2}
          />
          <circle cx={xS(focal.center)} cy={yS(focal.accuracy)} r={5} fill={C.secant} />

          {/* Axes labels */}
          <text
            x={PAD_L + PLOT_W / 2}
            y={H - 8}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
            fill={C.axis}
          >
            {pick(language, "predicted probability", "예측 확률")}
          </text>
          <text
            x={12}
            y={PAD_T + PLOT_H / 2}
            textAnchor="middle"
            transform={`rotate(-90 12 ${PAD_T + PLOT_H / 2})`}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
            fill={C.axis}
          >
            {pick(language, "observed accuracy", "관측 정확도")}
          </text>

          {/* Tick labels */}
          {[0, 0.5, 1].map((v) => (
            <g key={`tx-${v}`}>
              <text
                x={xS(v)}
                y={PAD_T + PLOT_H + 14}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                fill={C.axis}
              >
                {v.toFixed(1)}
              </text>
              <text
                x={PAD_L - 8}
                y={yS(v) + 3}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                fill={C.axis}
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "T (sharpness)", "T (날카로움)")}
          value={T}
          onChange={setT}
          min={0.4}
          max={2.0}
          step={0.01}
          accent={C.curve}
          display={fmt(T, 2)}
        />
        <Slider
          label={pick(language, "focal bin", "선택 구간")}
          value={focalIdx}
          onChange={(v) => setFocalIdx(Math.round(v))}
          min={0}
          max={9}
          step={1}
          accent={C.secant}
          display={`[${fmt(focal.lo, 1)}, ${fmt(focal.hi, 1)}]`}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setT(PRESET_T.over)}
            className={pillClass(activePreset === "over")}
          >
            {pick(language, "overconfident", "과신")}
          </button>
          <button
            type="button"
            onClick={() => setT(PRESET_T.calibrated)}
            className={pillClass(activePreset === "calibrated")}
          >
            {pick(language, "calibrated", "정확히 보정")}
          </button>
          <button
            type="button"
            onClick={() => setT(PRESET_T.under)}
            className={pillClass(activePreset === "under")}
          >
            {pick(language, "underconfident", "과소확신")}
          </button>
          <span className="ml-auto font-mono text-[11.5px] text-ink-mute">
            {pick(language, "local slope", "국소 기울기")} ≈ {fmt(focalSlope, 2)}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Each bar groups predictions whose stated probability falls in a 0.1-wide bin; the bar
            height is the <b>fraction that turned out correct</b>. The <em>green dashed</em>{" "}
            diagonal is perfect calibration. With <span className="font-mono">T = 0.55</span> the
            bars sag <em>below</em> the diagonal in the high-confidence range — the model says{" "}
            <span className="font-mono">0.9</span>, reality returns about{" "}
            <span className="font-mono">{pct(actual(0.85, 0.55))}</span>. Click any bar to make it{" "}
            <em>focal</em>: the brown line is the <em>tangent at that bin</em>, the local linear
            approximation. Slope near 1 means "the curve is parallel to truth here, just shifted";
            slope ≠ 1 means the calibration error <em>changes</em> with confidence — and a single
            scalar (temperature) can rotate the whole curve toward the diagonal.
          </>,
          <>
            각 막대는 예측 확률이 0.1 폭 구간에 들어간 예제들을 묶고, 그 막대의 높이는{" "}
            <b>실제로 맞춘 비율</b>이다. <em>초록 점선</em> 대각선이 완벽한 캘리브레이션. T ={" "}
            <span className="font-mono">0.55</span>일 때 높은 신뢰도 쪽 막대들이 대각선{" "}
            <em>아래</em>
            로 처진다 — 모델이 <span className="font-mono">0.9</span>라 말하면 실제론 약{" "}
            <span className="font-mono">{pct(actual(0.85, 0.55))}</span>만 맞다. 막대를 클릭하면 그
            구간이 <em>선택 구간</em>: 갈색 선은 그 점에서의 <em>접선</em>, 국소 선형 근사다.
            기울기가 1에 가깝다면 "곡선이 진실과 평행, 단지 평행 이동"; 1과 다르다면 캘리브레이션
            오차가 신뢰도에 따라 <em>달라진다</em>는 뜻 — 그래서 단 하나의 스칼라 (온도) 가 곡선
            전체를 대각선 쪽으로 회전시킬 수 있다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
