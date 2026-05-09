import { useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";

// Widget — Shannon Bars.
// Four outcomes (A, B, C, D) with raw weights the user drags. The widget
// normalizes every render so the bars always sum to 1 and the formulas
// always make sense. Live readout: entropy H = −Σ p log₂ p (bits) and the
// per-outcome surprise −log₂ p. Toggle between bar = probability and bar
// = surprise so the same widget shows both halves of the entropy story:
// rare outcomes are short bars in probability, tall bars in surprise.

const LABELS = ["A", "B", "C", "D"] as const;
const COLORS = ["#1e6da6", "#b6451e", "#7a5c2c", "#3a8c4a"] as const; // blue, accent-deep, brown, green

const W = 520;
const H_PX = 220;
const PAD_X = 36;
const PAD_TOP = 18;
const PAD_BOT = 38;

// log₂(0) is −∞; surprise is plotted up to a finite ceiling so the bar
// stays in-frame. The number readout still says "∞" honestly.
const SURPRISE_CEILING = 8; // bits

function entropy(ps: number[]): number {
  let h = 0;
  for (const p of ps) {
    if (p > 0) h -= p * Math.log2(p);
  }
  return h;
}

export function ShannonBars() {
  const { language } = useApp();
  // Raw weights, not probabilities — we normalize on render. Default: a
  // mildly-tilted distribution so H is visibly less than log₂(4) = 2.
  const [raw, setRaw] = useState<number[]>([4, 3, 2, 1]);
  const [view, setView] = useState<"prob" | "surprise">("prob");

  const sum = raw.reduce((s, v) => s + v, 0) || 1;
  const ps = raw.map((v) => v / sum);
  const H = entropy(ps);
  const Hmax = Math.log2(LABELS.length);

  const setOne = (i: number, v: number) =>
    setRaw((prev) => {
      const next = prev.slice();
      next[i] = v;
      return next;
    });

  const innerW = W - PAD_X * 2;
  const innerH = H_PX - PAD_TOP - PAD_BOT;
  const barW = innerW / (LABELS.length * 1.7);
  const slotW = innerW / LABELS.length;

  const yProb = (p: number) => PAD_TOP + (1 - p) * innerH;
  const ySurp = (s: number) =>
    PAD_TOP + Math.max(0, 1 - Math.min(s, SURPRISE_CEILING) / SURPRISE_CEILING) * innerH;

  const fmt = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : "∞");

  const presets: { id: string; raw: number[]; label: { en: string; ko: string } }[] = [
    { id: "uniform", raw: [1, 1, 1, 1], label: { en: "uniform", ko: "균등" } },
    { id: "tilted", raw: [4, 3, 2, 1], label: { en: "tilted", ko: "기울임" } },
    { id: "spike", raw: [10, 1, 1, 1], label: { en: "spike", ko: "집중" } },
    { id: "binary", raw: [1, 1, 0, 0], label: { en: "binary", ko: "두 결과" } },
    { id: "certain", raw: [1, 0, 0, 0], label: { en: "certain", ko: "확정" } },
  ];

  const matchesPreset = (id: string) => {
    const p = presets.find((x) => x.id === id);
    if (!p) return false;
    return p.raw.every((v, i) => v === raw[i]);
  };

  return (
    <WidgetShell kicker={pick(language, "Widget — Shannon bars", "위젯 — 섀넌 바")}>
      <div className="mb-3.5 grid grid-cols-2 gap-x-6 gap-y-2 rounded-md bg-rule-soft px-3.5 py-2.5 font-mono text-[13.5px]">
        <div className="flex justify-between gap-2">
          <span className="text-ink-mute">{pick(language, "entropy H", "엔트로피 H")}</span>
          <span className="font-medium text-acc">{fmt(H)} bits</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-ink-mute">
            {pick(language, "uniform max", "균등 한계")} log₂({LABELS.length})
          </span>
          <span className="font-medium text-ink">{Hmax.toFixed(2)} bits</span>
        </div>
        <div className="col-span-full flex justify-between gap-2 border-t border-dashed border-rule pt-2 text-[12.5px]">
          <span className="text-ink-mute">{pick(language, "fraction of max", "한계 대비")}</span>
          <span className="font-medium text-ink">
            {Hmax > 0 ? ((H / Hmax) * 100).toFixed(0) : "0"}%
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H_PX}`}
        className="my-2 block h-auto w-full rounded-md border border-rule bg-bg-card"
        role="img"
        aria-label={pick(
          language,
          view === "prob"
            ? "probability bars over four outcomes"
            : "surprise bars over four outcomes",
          view === "prob" ? "네 결과의 확률 바" : "네 결과의 놀람도 바",
        )}
      >
        {/* Reference line: max-entropy line at 1/N for prob view, log₂(N) for surprise view */}
        {view === "prob" && (
          <line
            x1={PAD_X}
            y1={yProb(1 / LABELS.length)}
            x2={W - PAD_X}
            y2={yProb(1 / LABELS.length)}
            className="stroke-rule"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}

        {/* Bars */}
        {ps.map((p, i) => {
          const cx = PAD_X + slotW * (i + 0.5);
          const x = cx - barW / 2;
          const surprise = p > 0 ? -Math.log2(p) : SURPRISE_CEILING;
          const top = view === "prob" ? yProb(p) : ySurp(surprise);
          const bottom = PAD_TOP + innerH;
          const label = view === "prob" ? p.toFixed(2) : `${fmt(surprise)} b`;
          return (
            <g key={LABELS[i]}>
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
                {LABELS[i]}
              </text>
              <text
                x={cx}
                y={Math.max(top - 6, PAD_TOP + 10)}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                className="fill-ink"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Y-axis label */}
        <text
          x={PAD_X - 24}
          y={PAD_TOP + innerH / 2}
          textAnchor="middle"
          transform={`rotate(-90 ${PAD_X - 24} ${PAD_TOP + innerH / 2})`}
          style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
          className="fill-ink-mute"
        >
          {view === "prob"
            ? pick(language, "probability", "확률")
            : pick(
                language,
                `surprise (bits, capped ${SURPRISE_CEILING})`,
                `놀람도 (비트, 상한 ${SURPRISE_CEILING})`,
              )}
        </text>
      </svg>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={pillClass(view === "prob")}
          onClick={() => setView("prob")}
        >
          {pick(language, "show probability", "확률 보기")}
        </button>
        <button
          type="button"
          className={pillClass(view === "surprise")}
          onClick={() => setView("surprise")}
        >
          {pick(language, "show surprise", "놀람도 보기")}
        </button>
        <span className="ml-auto inline-flex flex-wrap items-center gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setRaw(preset.raw.slice())}
              className={
                "rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] transition-colors " +
                (matchesPreset(preset.id)
                  ? "border-acc bg-acc/10 text-acc"
                  : "border-rule text-ink-mute hover:border-acc hover:text-acc")
              }
            >
              {pick(language, preset.label.en, preset.label.ko)}
            </button>
          ))}
        </span>
      </div>

      <div className="grid gap-2.5">
        {LABELS.map((label, i) => (
          <Slider
            key={label}
            label={
              <>
                {pick(language, `weight ${label}`, `가중치 ${label}`)}{" "}
                <span className="text-ink-mute">· p = {ps[i].toFixed(2)}</span>
              </>
            }
            value={raw[i]}
            onChange={(v) => setOne(i, v)}
            min={0}
            max={10}
            step={0.1}
            accent={COLORS[i]}
            display={raw[i].toFixed(1)}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 rounded-md bg-rule-soft px-3.5 py-2.5 text-[12.5px]">
        <Stat label={pick(language, "max p", "최대 p")} value={Math.max(...ps).toFixed(2)} />
        <Stat label={pick(language, "min p", "최소 p")} value={Math.min(...ps).toFixed(2)} />
        <Stat
          label={pick(language, "active outcomes", "활성 결과")}
          value={String(ps.filter((p) => p > 0).length)}
        />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Click <b>uniform</b>: all four bars equal, every <em>p</em> = 0.25, surprise per outcome
            = 2 bits, H = 2 bits — the maximum for four outcomes. Click <b>spike</b>: one bar
            swallows the rest, surprise on the spike near 0, surprise on the others ≥ 2.5, H falls
            below 1. Click <b>certain</b>: one outcome at probability 1, three at 0, H = 0. The bar
            height in probability and bar height in surprise are <em>opposite</em> stories — entropy
            is the average of the second one weighted by the first.
          </>,
          <>
            <b>균등</b> 누르면 네 바가 같고, 각 <em>p</em> = 0.25, 결과당 놀람도 2 비트, H = 2 비트
            — 네 결과에서의 최대값. <b>집중</b> 누르면 한 바가 나머지를 삼키고, 그 바의 놀람도는 0
            근처, 나머지 셋은 ≥ 2.5, H는 1 아래로 떨어진다. <b>확정</b> 누르면 한 결과가 확률 1,
            셋이 0, H = 0. 확률 막대 높이와 놀람도 막대 높이는 <em>반대</em> 이야기 — 엔트로피는 두
            번째 이야기를 첫 번째로 가중평균한 결과다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
