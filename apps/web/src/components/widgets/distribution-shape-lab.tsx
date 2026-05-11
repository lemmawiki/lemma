import { useContext, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Distribution Shape Lab.
// Five outcomes with values 1..5 and raw weights the user drags. The widget
// normalizes every render so the bars always sum to 1 and the formulas
// always make sense. Live readout: mean E[X] = Σ x·p, variance Var[X] =
// Σ p·(x − μ)², standard deviation σ = √Var. The mean is also drawn on the
// x-axis as a vertical marker, so "center" is something the reader sees in
// the same picture as the bars. Presets: uniform / peaked / skewed /
// bimodal — same five outcomes, four shapes of uncertainty.

const VALUES = [1, 2, 3, 4, 5] as const;
const COLORS = ["#1e6da6", "#2c8a8c", "#7a4ea0", "#b6451e", "#9a7a1a"] as const;

const W = 520;
const H_PX = 220;
const PAD_X = 36;
const PAD_TOP = 18;
const PAD_BOT = 38;

function mean(ps: readonly number[]): number {
  let m = 0;
  for (let i = 0; i < ps.length; i++) m += VALUES[i] * ps[i];
  return m;
}

function variance(ps: readonly number[], mu: number): number {
  let v = 0;
  for (let i = 0; i < ps.length; i++) {
    const d = VALUES[i] - mu;
    v += ps[i] * d * d;
  }
  return v;
}

type Preset = "uniform" | "peaked" | "skewed" | "bimodal";

const PRESETS: Record<Preset, { raw: number[]; en: string; ko: string }> = {
  uniform: { raw: [1, 1, 1, 1, 1], en: "uniform", ko: "균등" },
  peaked: { raw: [1, 3, 8, 3, 1], en: "peaked", ko: "집중" },
  skewed: { raw: [8, 5, 3, 1.5, 0.5], en: "skewed", ko: "치우침" },
  bimodal: { raw: [6, 1, 0.5, 1, 6], en: "bimodal", ko: "쌍봉" },
};

export function DistributionShapeLab({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  // Raw weights, not probabilities — we normalize on render. Default = peaked
  // so the mean visibly sits on outcome 3 and the variance is non-trivial.
  const [raw, setRaw] = useState<number[]>([...PRESETS.peaked.raw]);

  const sum = raw.reduce((s, v) => s + v, 0) || 1;
  const ps = raw.map((v) => v / sum);
  const mu = mean(ps);
  const v = variance(ps, mu);
  const sigma = Math.sqrt(v);

  const setOne = (i: number, val: number) =>
    setRaw((prev) => {
      const next = prev.slice();
      next[i] = val;
      return next;
    });

  const innerW = W - PAD_X * 2;
  const innerH = H_PX - PAD_TOP - PAD_BOT;
  const barW = innerW / (VALUES.length * 1.7);
  const slotW = innerW / VALUES.length;

  // Cap the y-axis at 0.7 so peaked / skewed shapes don't slam the ceiling.
  // Reader sees relative height; readouts give exact numbers.
  const Y_MAX = 0.7;
  const yProb = (p: number) => PAD_TOP + (1 - Math.min(p, Y_MAX) / Y_MAX) * innerH;

  // Mean marker x-position (the mean lives in [1, 5] space, map onto slots).
  const meanX = PAD_X + slotW * (mu - 1 + 0.5);

  const matchesPreset = (id: Preset) => {
    const p = PRESETS[id];
    return p.raw.every((val, i) => Math.abs(val - raw[i]) < 0.05);
  };

  return (
    <WidgetShell
      kicker={pick(language, "Widget — Distribution shape lab", "위젯 — 분포 모양 실험실")}
    >
      <div className="mb-3.5 grid grid-cols-3 gap-x-6 gap-y-2 rounded-md bg-rule-soft px-3.5 py-2.5 font-mono text-[13.5px] max-md:grid-cols-2">
        <div className="flex justify-between gap-2">
          <span className="text-ink-mute">{pick(language, "mean E[X]", "평균 E[X]")}</span>
          <span className="font-medium text-acc">{mu.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-ink-mute">{pick(language, "variance Var", "분산 Var")}</span>
          <span className="font-medium text-ink">{v.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-ink-mute">{pick(language, "spread σ", "퍼짐 σ")}</span>
          <span className="font-medium text-ink">{sigma.toFixed(2)}</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H_PX}`}
        className="my-2 block h-auto w-full rounded-md border border-rule bg-bg-card"
        role="img"
        aria-label={pick(
          language,
          "probability bars over five outcomes with mean marker",
          "다섯 결과의 확률 바, 평균 표식",
        )}
      >
        {/* Bars */}
        {ps.map((p, i) => {
          const cx = PAD_X + slotW * (i + 0.5);
          const x = cx - barW / 2;
          const top = yProb(p);
          const bottom = PAD_TOP + innerH;
          return (
            <g key={`bar-${VALUES[i]}`}>
              <rect
                x={x}
                y={top}
                width={barW}
                height={Math.max(0, bottom - top)}
                fill={COLORS[i]}
                opacity={0.85}
              />
              <text
                x={cx}
                y={bottom + 16}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600 }}
                fill={COLORS[i]}
              >
                {VALUES[i]}
              </text>
              <text
                x={cx}
                y={Math.max(top - 6, PAD_TOP + 10)}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                className="fill-ink"
              >
                {p.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Mean marker — vertical dashed line plus a small triangle on the axis */}
        <line
          x1={meanX}
          y1={PAD_TOP}
          x2={meanX}
          y2={PAD_TOP + innerH}
          stroke={C.secant}
          strokeWidth={1.2}
          strokeDasharray="4 4"
          opacity={0.85}
        />
        <polygon
          points={`${meanX - 5},${PAD_TOP + innerH + 2} ${meanX + 5},${PAD_TOP + innerH + 2} ${meanX},${PAD_TOP + innerH - 4}`}
          fill={C.secant}
        />
        <text
          x={meanX}
          y={PAD_TOP - 4}
          textAnchor="middle"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}
          fill={C.secant}
        >
          μ = {mu.toFixed(2)}
        </text>

        {/* Y-axis label */}
        <text
          x={PAD_X - 24}
          y={PAD_TOP + innerH / 2}
          textAnchor="middle"
          transform={`rotate(-90 ${PAD_X - 24} ${PAD_TOP + innerH / 2})`}
          style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
          className="fill-ink-mute"
        >
          {pick(language, "probability", "확률")}
        </text>

        {/* X-axis label */}
        <text
          x={PAD_X + innerW / 2}
          y={H_PX - 6}
          textAnchor="middle"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
          className="fill-ink-mute"
        >
          {pick(language, "outcome value x", "결과값 x")}
        </text>
      </svg>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
          {pick(language, "preset", "프리셋")}
        </span>
        {(Object.keys(PRESETS) as Preset[]).map((id) => (
          <button
            key={`pre-${id}`}
            type="button"
            onClick={() => setRaw([...PRESETS[id].raw])}
            className={pillClass(matchesPreset(id))}
          >
            {pick(language, PRESETS[id].en, PRESETS[id].ko)}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5">
        {VALUES.map((val, i) => (
          <Slider
            key={`s-${val}`}
            label={
              <>
                {pick(language, `weight x = ${val}`, `가중치 x = ${val}`)}{" "}
                <span className="text-ink-mute">· p = {ps[i].toFixed(2)}</span>
              </>
            }
            value={raw[i]}
            onChange={(val_) => setOne(i, val_)}
            min={0}
            max={10}
            step={0.1}
            accent={COLORS[i]}
            display={raw[i].toFixed(1)}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 rounded-md bg-rule-soft px-3.5 py-2.5 text-[12.5px] max-md:grid-cols-2">
        <Stat label={pick(language, "max p", "최대 p")} value={Math.max(...ps).toFixed(2)} />
        <Stat
          label={pick(language, "active outcomes", "활성 결과")}
          value={String(ps.filter((p) => p > 0.005).length)}
        />
        <Stat label={pick(language, "sums to", "합")} value="1.00" />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Five outcomes with values <b>x = 1, 2, 3, 4, 5</b>. Drag a weight, the widget
            normalizes, the bars sum to <em>1</em>. Click <b>uniform</b>: each <em>p</em> = 0.20,
            mean lands on 3, variance is largest at 2. Click <b>peaked</b>: probability concentrates
            near 3, mean still 3, variance falls. Click <b>skewed</b>: small values are likely,
            large values rare — mean shifts left of 3. Click <b>bimodal</b>: probability splits
            between 1 and 5, mean lands back on 3 but variance jumps.{" "}
            <em>Same mean, very different shape.</em> That gap is why a distribution is the right
            object and the mean alone is not.
          </>,
          <>
            결과 다섯 개, 값 <b>x = 1, 2, 3, 4, 5</b>. 가중치를 끌면 위젯이 정규화해서 바의 합이{" "}
            <em>1</em>이 된다. <b>균등</b>을 누르면 각 <em>p</em> = 0.20, 평균은 3에 떨어지고 분산은
            2로 가장 크다. <b>집중</b>을 누르면 확률이 3 근처에 모이고, 평균은 여전히 3, 분산은
            줄어든다. <b>치우침</b>을 누르면 작은 값이 흔하고 큰 값은 드물어 평균이 3의 왼쪽으로
            옮긴다. <b>쌍봉</b>을 누르면 확률이 1과 5로 갈리고, 평균은 다시 3이지만 분산이 크게
            뛴다. <em>같은 평균, 전혀 다른 모양.</em> 그 차이가 분포가 올바른 대상이고 평균
            하나만으로는 부족한 이유다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
