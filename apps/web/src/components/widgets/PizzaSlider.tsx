import { useState, useMemo } from "react";
import { futureValue, formatCurrency } from "../../lib/finance";
import { useApp, pick } from "../../context/AppContext";

const W = 720;
const H = 280;
const PAD_L = 64;
const PAD_R = 24;
const PAD_T = 18;
const PAD_B = 36;
const START_YEAR = 2010;

// Widget A — The Pizza Slider.
// Drag P, r, t. Watch F. Toggle linear ↔ log. The exponential becomes a line in log space.
export function PizzaSlider() {
  const { language } = useApp();
  const [P, setP] = useState(41);
  const [r, setR] = useState(1.89); // 189% CAGR — the actual BTC rate, $41 → ~$1B in 16 years
  const [t, setT] = useState(16);
  const [logScale, setLogScale] = useState(true);
  const [frozen, setFrozen] = useState<{ P: number; r: number; t: number; F: number } | null>(null);

  const F = futureValue(P, r, t);
  const points = useMemo(() => {
    const pts: { year: number; bal: number }[] = [];
    const N = 200;
    for (let i = 0; i <= N; i++) {
      const yr = (i / N) * t;
      pts.push({ year: yr, bal: futureValue(P, r, yr) });
    }
    return pts;
  }, [P, r, t]);

  const yMax = Math.max(F, P) * 1.05;
  const yMinLin = 0;
  const yMinLog = Math.max(P * 0.5, 1e-2);

  const xScale = (yr: number) => PAD_L + (yr / Math.max(t, 1)) * (W - PAD_L - PAD_R);
  const yScaleLin = (b: number) =>
    H - PAD_B - ((b - yMinLin) / (yMax - yMinLin)) * (H - PAD_T - PAD_B);
  const yScaleLog = (b: number) => {
    const lo = Math.log10(yMinLog);
    const hi = Math.log10(yMax);
    const v = Math.log10(Math.max(b, yMinLog));
    return H - PAD_B - ((v - lo) / (hi - lo)) * (H - PAD_T - PAD_B);
  };
  const yScale = logScale ? yScaleLog : yScaleLin;

  const path = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.year).toFixed(2)} ${yScale(p.bal).toFixed(2)}`,
    )
    .join(" ");

  const yTicks = useMemo(() => {
    if (logScale) {
      const lo = Math.ceil(Math.log10(yMinLog));
      const hi = Math.floor(Math.log10(yMax));
      const ticks: number[] = [];
      for (let k = lo; k <= hi; k++) ticks.push(Math.pow(10, k));
      return ticks;
    } else {
      return [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];
    }
  }, [logScale, yMinLog, yMax]);

  const yearMarks = useMemo(() => {
    const marks: number[] = [];
    const step = t > 30 ? 10 : t > 10 ? 4 : 2;
    for (let y = 0; y <= t; y += step) marks.push(y);
    if (marks[marks.length - 1] !== t) marks.push(t);
    return marks;
  }, [t]);

  return (
    <div className="mt-9 rounded-[10px] border border-rule bg-bg-card px-6 py-[22px]">
      <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute">
        {pick(language, "Widget A — The Pizza Slider", "위젯 A — 피자 슬라이더")}
      </div>

      <div className="mb-3.5 grid grid-cols-2 gap-x-6 gap-y-2 rounded-md bg-rule-soft px-3.5 py-2.5 font-mono text-[13.5px]">
        <div className="flex justify-between gap-2">
          <span className="text-ink-mute">
            {pick(language, "Laszlo's $41 (P)", "라즐로의 $41 (P)")}
          </span>
          <span className="font-medium text-ink">{formatCurrency(P)}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-ink-mute">{pick(language, "annual rate r", "연이율 r")}</span>
          <span className="font-medium text-ink">{(r * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-ink-mute">{pick(language, "years t", "햇수 t")}</span>
          <span className="font-medium text-ink">{t.toFixed(0)} yr</span>
        </div>
        <div className="col-span-full mt-1 flex justify-between gap-2 border-t border-dashed border-rule pt-2">
          <span className="text-ink-mute">
            F = P(1+r)<sup>t</sup>
          </span>
          <span className="text-lg font-semibold text-acc">{formatCurrency(F)}</span>
        </div>
        <div className="col-span-full flex justify-between gap-2 text-xs text-ink-mute">
          <span>{pick(language, "year reached", "도달 연도")}</span>
          <span className="font-medium text-ink">{(START_YEAR + t).toFixed(0)}</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="my-3.5 mb-1.5 block h-auto w-full rounded-md border border-rule bg-plot-bg"
        role="img"
      >
        <rect
          x={PAD_L}
          y={PAD_T}
          width={W - PAD_L - PAD_R}
          height={H - PAD_T - PAD_B}
          className="plot-bg"
        />
        {yTicks.map((v) => (
          <g key={`y-${v}`}>
            <line x1={PAD_L} y1={yScale(v)} x2={W - PAD_R} y2={yScale(v)} className="plot-grid" />
            <text x={PAD_L - 8} y={yScale(v) + 3} className="plot-tick">
              {formatCurrency(v)}
            </text>
          </g>
        ))}
        {yearMarks.map((y) => (
          <g key={`year-${y}`}>
            <line
              x1={xScale(y)}
              y1={H - PAD_B}
              x2={xScale(y)}
              y2={H - PAD_B + 4}
              className="plot-axis"
            />
            <text x={xScale(y)} y={H - PAD_B + 18} className="plot-tick" textAnchor="middle">
              {(START_YEAR + y).toFixed(0)}
            </text>
          </g>
        ))}
        <path d={path} className="plot-line" fill="none" />
        <circle cx={xScale(t)} cy={yScale(F)} r={4.5} className="plot-dot" />
      </svg>

      <div className="mt-2 grid gap-2.5">
        <label className="grid grid-cols-[220px_1fr_90px] items-center gap-3 text-[13.5px] max-md:grid-cols-[100px_1fr_70px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-mute">
            {pick(language, "principal P (BTC value, May 2010)", "원금 P (BTC, 2010년 5월)")}
          </span>
          <input
            type="range"
            className="w-full accent-acc"
            min={1}
            max={1000}
            step={1}
            value={P}
            onChange={(e) => setP(+e.target.value)}
          />
          <span className="text-right font-mono text-[12.5px] text-ink">{formatCurrency(P)}</span>
        </label>
        <label className="grid grid-cols-[220px_1fr_90px] items-center gap-3 text-[13.5px] max-md:grid-cols-[100px_1fr_70px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-mute">
            {pick(language, "annual rate r (BTC actual ≈ 189%)", "연이율 r (BTC 실제 ≈ 189%)")}
          </span>
          <input
            type="range"
            className="w-full accent-acc"
            min={0}
            max={2.5}
            step={0.01}
            value={r}
            onChange={(e) => setR(+e.target.value)}
          />
          <span className="text-right font-mono text-[12.5px] text-ink">
            {(r * 100).toFixed(0)}%
          </span>
        </label>
        <label className="grid grid-cols-[220px_1fr_90px] items-center gap-3 text-[13.5px] max-md:grid-cols-[100px_1fr_70px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-mute">
            {pick(language, "years t (since 2010)", "햇수 t (2010년부터)")}
          </span>
          <input
            type="range"
            className="w-full accent-acc"
            min={0}
            max={40}
            step={1}
            value={t}
            onChange={(e) => setT(+e.target.value)}
          />
          <span className="text-right font-mono text-[12.5px] text-ink">{t.toFixed(0)}</span>
        </label>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <button className={pillClass(logScale)} onClick={() => setLogScale((v) => !v)}>
          {pick(
            language,
            logScale ? "y-axis: log (try linear)" : "y-axis: linear (try log)",
            logScale ? "y축: 로그 (선형으로 바꾸기)" : "y축: 선형 (로그로 바꾸기)",
          )}
        </button>
        <button className={pillClass(false)} onClick={() => setFrozen({ P, r, t, F })}>
          {pick(language, "freeze & solve", "고정 후 풀기")}
        </button>
        {frozen && (
          <button className={`${pillClass(false)} text-ink-mute`} onClick={() => setFrozen(null)}>
            {pick(language, "clear freeze", "고정 해제")}
          </button>
        )}
      </div>

      {frozen && (
        <div className="mt-3.5 rounded-md border border-dashed border-rule bg-rule-soft px-3.5 py-3">
          <div className="mb-1.5 font-mono text-xs text-ink-mute">
            {pick(
              language,
              "Frozen — solve on paper, then check.",
              "고정됨 — 종이로 풀어보고 답을 확인하라.",
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 font-mono text-[13px] text-ink max-md:grid-cols-1 [&_b]:font-semibold [&_b]:text-acc">
            <div>
              <b>P</b> = {formatCurrency(frozen.P)}
            </div>
            <div>
              <b>r</b> = {(frozen.r * 100).toFixed(1)}%
            </div>
            <div>
              <b>t</b> = {frozen.t.toFixed(0)} yr
            </div>
            <div className="text-acc-deep">
              <b>F = ?</b>
            </div>
          </div>
          <details className="mt-2.5 font-mono text-xs">
            <summary className="cursor-pointer text-ink-mute">
              {pick(language, "show F", "F 보기")}
            </summary>
            <div className="mt-1.5 font-mono font-medium text-green">
              F = {formatCurrency(frozen.F)}
            </div>
          </details>
        </div>
      )}

      <div className="mt-3.5 border-t border-rule pt-3 text-[14.5px] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc">
        {pick(
          language,
          <>
            Try this: drop r to <b>10%</b> (SPY's long-run rate). The line on the log axis goes
            shallow — barely tilted. Crank r back to <b>189%</b>. It steepens.{" "}
            <em>The slope on a log axis is the rate.</em> You're reading exponential growth as one
            number: how steep.
          </>,
          <>
            해보기: r을 <b>10%</b>(SPY 장기 수익률)까지 내려보자. 로그 축 위의 선이 거의 평평해진다.
            다시 <b>189%</b>로 올려보자. 선이 가팔라진다. <em>로그 축의 기울기 = 이율.</em> 지수
            성장을 단 하나의 수 — '얼마나 가파른가' — 로 읽고 있는 셈이다.
          </>,
        )}
      </div>
    </div>
  );
}

function pillClass(on: boolean): string {
  const base = "rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors";
  return on
    ? `${base} border-ink bg-ink text-bg`
    : `${base} border-rule bg-bg text-ink-soft hover:border-acc hover:text-acc`;
}
