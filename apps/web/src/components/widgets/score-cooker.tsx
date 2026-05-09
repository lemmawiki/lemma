import { useContext, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Three classes — kept in English so they read like a real classifier output
// in either locale ("dog" the label is the same string the model would emit).
const CLASSES = ["cat", "dog", "fox"] as const;
type ClassIdx = 0 | 1 | 2;

type View = "scores" | "probs" | "loss";

// Numerically stable softmax: subtract max before exponentiating.
function softmax(z: number[], T: number): number[] {
  const s = z.map((v) => v / T);
  const m = Math.max(...s);
  const e = s.map((v) => Math.exp(v - m));
  const total = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / total);
}

const LOGIT_MIN = -3;
const LOGIT_MAX = 5;
const T_MIN = 0.1;
const T_MAX = 5;

const BAR_W = 110;
const BAR_GAP = 32;
const PLOT_H = 160;
const PLOT_PAD_X = 28;
const PLOT_PAD_T = 18;
const PLOT_PAD_B = 28;
const SVG_W = PLOT_PAD_X * 2 + CLASSES.length * BAR_W + (CLASSES.length - 1) * BAR_GAP;
const SVG_H = PLOT_H + PLOT_PAD_T + PLOT_PAD_B;

function format(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return n > 0 ? "∞" : "−∞";
  return n.toFixed(digits);
}

// Widget — Score Cooker.
// Three logits, one true label, one temperature dial. Bars view-toggles
// between raw scores, post-softmax probabilities, and the loss column.
// Punchline lives in the readout: confidence and truth are unrelated.
export function ScoreCooker({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [logits, setLogits] = useState<number[]>([2.0, 1.0, 0.5]);
  const [T, setT] = useState<number>(1.0);
  const [trueIdx, setTrueIdx] = useState<ClassIdx>(0);
  const [view, setView] = useState<View>("probs");

  const probs = softmax(logits, T);
  const pTrue = probs[trueIdx];
  const loss = -Math.log(pTrue);
  const winner = probs.indexOf(Math.max(...probs)) as ClassIdx;
  const correct = winner === trueIdx;

  const setLogit = (i: ClassIdx, v: number) => {
    setLogits((prev) => {
      const next = prev.slice();
      next[i] = v;
      return next;
    });
  };

  // Bar heights per view. Scores view scales by absolute logit range so
  // negative logits fall below the zero line.
  const logitsAbsMax = Math.max(LOGIT_MAX, ...logits.map(Math.abs));
  const baseY = PLOT_PAD_T + PLOT_H;

  type Bar = { h: number; from: "bottom" | "zero"; sign: 1 | -1; label: string };
  const bars: Bar[] = CLASSES.map((_, i) => {
    if (view === "scores") {
      const v = logits[i];
      const h = (Math.abs(v) / logitsAbsMax) * (PLOT_H / 2);
      return {
        h,
        from: "zero" as const,
        sign: (v >= 0 ? 1 : -1) as 1 | -1,
        label: format(v, 2),
      };
    }
    if (view === "probs") {
      const v = probs[i];
      return { h: v * PLOT_H, from: "bottom" as const, sign: 1, label: format(v * 100, 1) + "%" };
    }
    // loss view — show p, but emphasise the true-class column with a loss
    // overlay scaled into the same plot.
    const v = probs[i];
    return { h: v * PLOT_H, from: "bottom" as const, sign: 1, label: format(v * 100, 1) + "%" };
  });

  const zeroY = view === "scores" ? PLOT_PAD_T + PLOT_H / 2 : baseY;

  return (
    <WidgetShell kicker={pick(language, "Widget — Score cooker", "위젯 — 점수 요리기")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-3 items-baseline gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-1 max-md:gap-1"
      >
        <div>
          <span className="text-ink-mute">{pick(language, "winner", "승자")} · </span>
          <span className="font-semibold text-ink">{CLASSES[winner]}</span>
          <span className="ml-1.5 text-ink-mute">({format(probs[winner] * 100, 1)}%)</span>
        </div>
        <div>
          <span className="text-ink-mute">
            {pick(language, "true label", "정답")} · {CLASSES[trueIdx]} →{" "}
            {pick(language, "p_true", "p_정답")}{" "}
          </span>
          <span className="font-semibold text-ink">{format(pTrue * 100, 1)}%</span>
        </div>
        <div>
          <span className="text-ink-mute">
            {pick(language, "loss · −log p_true", "손실 · −log p_정답")}{" "}
          </span>
          <span className={`font-semibold ${correct ? "text-ink" : "text-acc-deep"}`}>
            {format(loss, 3)}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ display: "block", minWidth: 360 }}
          role="img"
          aria-label={pick(language, "score / probability bars", "점수/확률 막대")}
        >
          {/* baseline */}
          <line
            x1={PLOT_PAD_X - 6}
            y1={zeroY}
            x2={SVG_W - PLOT_PAD_X + 6}
            y2={zeroY}
            className="stroke-rule"
            strokeWidth={1}
          />

          {/* bars */}
          {bars.map((b, i) => {
            const x = PLOT_PAD_X + i * (BAR_W + BAR_GAP);
            const y = b.from === "zero" ? (b.sign === 1 ? zeroY - b.h : zeroY) : baseY - b.h;
            const isTrue = i === trueIdx;
            const isWinner = i === winner;
            const fill = isTrue ? "fill-acc" : isWinner ? "fill-ink" : "fill-rule";
            return (
              <g key={CLASSES[i]}>
                <rect
                  x={x}
                  y={y}
                  width={BAR_W}
                  height={b.h}
                  rx={3}
                  className={fill}
                  opacity={isTrue ? 1 : isWinner ? 0.9 : 0.55}
                />
                {/* class label */}
                <text
                  x={x + BAR_W / 2}
                  y={SVG_H - 8}
                  textAnchor="middle"
                  className="fill-ink-mute"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                >
                  {CLASSES[i]}
                  {isTrue ? "  ★" : ""}
                </text>
                {/* value label */}
                <text
                  x={x + BAR_W / 2}
                  y={Math.max(y - 6, PLOT_PAD_T - 2)}
                  textAnchor="middle"
                  className="fill-ink"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600 }}
                >
                  {b.label}
                </text>
              </g>
            );
          })}

          {/* Loss view — a column rises from the top of the true-class bar
              with height proportional to −log p_true. As you lower T into a
              wrong-winner setup, the prob bar shrinks AND the loss column
              climbs: the picture of "more confident, more wrong, bigger loss". */}
          {view === "loss" &&
            (() => {
              const x = PLOT_PAD_X + trueIdx * (BAR_W + BAR_GAP);
              const probH = bars[trueIdx].h;
              const top = baseY - probH;
              const LOSS_PX_PER_UNIT = 26;
              const lossH = Math.min(loss * LOSS_PX_PER_UNIT, PLOT_H - 4);
              const lossTop = top - lossH;
              const colX = x + BAR_W * 0.22;
              const colW = BAR_W * 0.56;
              const capped = loss * LOSS_PX_PER_UNIT > PLOT_H - 4;
              return (
                <g>
                  <line
                    x1={x}
                    y1={top}
                    x2={x + BAR_W}
                    y2={top}
                    className="stroke-acc-deep"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <rect
                    x={colX}
                    y={lossTop}
                    width={colW}
                    height={lossH}
                    rx={2}
                    className="fill-acc-deep"
                    opacity={0.85}
                  />
                  {capped && (
                    <text
                      x={colX + colW / 2}
                      y={lossTop + 10}
                      textAnchor="middle"
                      className="fill-bg-card"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700 }}
                    >
                      ↑
                    </text>
                  )}
                  <text
                    x={x + BAR_W / 2}
                    y={Math.max(lossTop - 6, PLOT_PAD_T - 2)}
                    textAnchor="middle"
                    className="fill-acc-deep"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}
                  >
                    −log p = {format(loss, 3)}
                  </text>
                </g>
              );
            })()}
        </svg>
      </div>

      {/* view toggle */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(["scores", "probs", "loss"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={
              "rounded-full border px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors " +
              (view === v
                ? "border-acc bg-acc/10 text-acc"
                : "border-rule text-ink-mute hover:border-acc hover:text-acc")
            }
          >
            {v === "scores"
              ? pick(language, "scores", "점수")
              : v === "probs"
                ? pick(language, "probabilities", "확률")
                : pick(language, "loss", "손실")}
          </button>
        ))}
      </div>

      {/* logit sliders */}
      <div className="mt-4 grid gap-2.5">
        {CLASSES.map((cls, i) => (
          <label
            key={cls}
            className="grid grid-cols-[120px_1fr_70px] items-center gap-3 text-[13px] max-md:grid-cols-[80px_1fr_56px]"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-ink-mute">
              <span
                className={`inline-block h-2.5 w-2.5 shrink-0 rounded-sm ${
                  i === trueIdx ? "bg-acc" : "bg-rule"
                }`}
                aria-hidden
              />
              {pick(language, `logit · ${cls}`, `로짓 · ${cls}`)}
            </span>
            <input
              type="range"
              className={i === trueIdx ? "w-full accent-acc" : "w-full accent-ink-soft"}
              min={LOGIT_MIN}
              max={LOGIT_MAX}
              step={0.1}
              value={logits[i]}
              onChange={(e) => setLogit(i as ClassIdx, +e.target.value)}
            />
            <span className="text-right font-mono text-[12.5px] text-ink">
              {format(logits[i], 2)}
            </span>
          </label>
        ))}

        <label className="mt-1 grid grid-cols-[120px_1fr_70px] items-center gap-3 border-t border-rule pt-3 text-[13px] max-md:grid-cols-[80px_1fr_56px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-ink-mute">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm bg-ink" aria-hidden />
            {pick(language, "temperature T", "온도 T")}
          </span>
          <input
            type="range"
            className="w-full accent-ink"
            min={T_MIN}
            max={T_MAX}
            step={0.05}
            value={T}
            onChange={(e) => setT(+e.target.value)}
          />
          <span className="text-right font-mono text-[12.5px] text-ink">{format(T, 2)}</span>
        </label>
      </div>

      {/* true label radio */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-ink-soft">
        <span className="font-mono text-ink-mute">
          {pick(language, "true label · ★", "정답 · ★")}
        </span>
        {CLASSES.map((cls, i) => (
          <label
            key={cls}
            className={
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11.5px] transition-colors " +
              (trueIdx === i
                ? "border-acc bg-acc/10 text-acc"
                : "border-rule text-ink-mute hover:border-acc hover:text-acc")
            }
          >
            <input
              type="radio"
              name="true-label"
              className="sr-only"
              checked={trueIdx === i}
              onChange={() => setTrueIdx(i as ClassIdx)}
            />
            {cls}
          </label>
        ))}
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Try this. Set <b>cat</b> as the true label, switch the view to <b>loss</b>, then drag{" "}
            <b>fox</b>'s logit up to <span className="font-mono">5.0</span>. The bars show{" "}
            <b>fox</b> winning at ~95%; the orange column above the <b>cat</b> bar is the loss and
            climbs past 4. The model is <em>confident and wrong</em>. Now drag temperature toward{" "}
            <span className="font-mono">0.1</span>: confidence rises and the loss column climbs{" "}
            <em>further</em>. The truth never moved. Softmax doesn't check it; it only compares
            scores.
          </>,
          <>
            이걸 해보자. 정답을 <b>cat</b>으로 두고, 뷰를 <b>손실</b>로 바꾼 다음, <b>fox</b>의
            로짓을 <span className="font-mono">5.0</span>까지 올려라. 막대는 <b>fox</b>가 ~95%로
            이기고, <b>cat</b> 막대 위로 솟은 주황색 기둥이 손실 — 4를 넘긴다. 모델은{" "}
            <em>자신만만하게 틀렸다</em>. 이제 온도를 <span className="font-mono">0.1</span> 쪽으로
            끌어라: 자신감이 올라가고, 손실 기둥은 <em>더</em> 솟는다. 진실은 한 번도 안 움직였다.
            softmax는 진실을 확인하지 않는다 — 점수끼리 비교할 뿐이다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
