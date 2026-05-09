import { useContext, useMemo, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Stat, pillClass } from "./widget-primitives";

// Widget — Image Compression Cooker.
//
// Three 16×16 patches that all share the SAME pixel histogram (each of 16
// grayscale levels appears exactly 16 times). H_histogram is identical for
// all three. What differs is the *spatial layout*: gradient (smooth), blocks
// (chunked), scrambled (random permutation). H_neighbor_diff — the entropy
// of adjacent-pixel differences — sees this and reports very different
// numbers. That's the page in one widget: histograms don't see structure;
// real compressors do.

const SIZE = 16;
const N = SIZE * SIZE;
const LEVELS = 16;
const CELL_PX = 22; // 16 × 22 = 352 px wide patch
const CANVAS_W = SIZE * CELL_PX;

type Pattern = "gradient" | "blocks" | "scrambled";

// Each row is one constant level; row 0 = darkest, row 15 = lightest.
function gradientPixels(): number[] {
  const out: number[] = new Array(N);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) out[i * SIZE + j] = i;
  }
  return out;
}

// 4×4 block grid: each 4×4 block has a constant level 0..15.
function blocksPixels(): number[] {
  const out: number[] = new Array(N);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const blockI = Math.floor(i / 4);
      const blockJ = Math.floor(j / 4);
      out[i * SIZE + j] = blockI * 4 + blockJ;
    }
  }
  return out;
}

// Same multiset of pixel values as gradient/blocks (each level × 16),
// permuted with a deterministic seed so the picture is stable across
// re-renders but visibly random.
function scrambledPixels(seed: number): number[] {
  const out = gradientPixels();
  let s = seed >>> 0;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

function histogramEntropy(pixels: number[]): number {
  const counts = new Array(LEVELS).fill(0);
  for (const p of pixels) counts[p]++;
  let H = 0;
  for (const c of counts) {
    if (c === 0) continue;
    const p = c / pixels.length;
    H -= p * Math.log2(p);
  }
  return H;
}

// Entropy of |neighbor difference| over 4-neighbor edges. Same multiset,
// different layout → very different value.
function neighborDiffEntropy(pixels: number[]): number {
  const counts = new Array(LEVELS).fill(0);
  let total = 0;
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      if (j + 1 < SIZE) {
        counts[Math.abs(pixels[idx] - pixels[idx + 1])]++;
        total++;
      }
      if (i + 1 < SIZE) {
        counts[Math.abs(pixels[idx] - pixels[idx + SIZE])]++;
        total++;
      }
    }
  }
  let H = 0;
  for (const c of counts) {
    if (c === 0) continue;
    const p = c / total;
    H -= p * Math.log2(p);
  }
  return H;
}

// Map level 0..15 to a warm grayscale that fits Lemma's palette.
function levelColor(level: number): string {
  // 0 → near-ink, 15 → near-paper. Slight warm tint matches the page bg.
  const t = level / (LEVELS - 1);
  const r = Math.round(20 + t * 230);
  const g = Math.round(17 + t * 224);
  const b = Math.round(13 + t * 215);
  return `rgb(${r}, ${g}, ${b})`;
}

const PATTERNS: { id: Pattern; en: string; ko: string }[] = [
  { id: "gradient", en: "gradient", ko: "그라디언트" },
  { id: "blocks", en: "blocks", ko: "블록" },
  { id: "scrambled", en: "scrambled", ko: "뒤섞임" },
];

// Stable per-bin identifiers for histogram bars. oxlint's no-array-index-key
// rejects the level index even though every bin has a fixed algebraic identity
// (level 0 .. 15); these strings give it the stable key it wants.
const BIN_IDS = [
  "b00",
  "b01",
  "b02",
  "b03",
  "b04",
  "b05",
  "b06",
  "b07",
  "b08",
  "b09",
  "b10",
  "b11",
  "b12",
  "b13",
  "b14",
  "b15",
] as const;

const fmt = (n: number, d = 2) => n.toFixed(d);

export function ImageCompressionCooker({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [pattern, setPattern] = useState<Pattern>("gradient");
  const [seed, setSeed] = useState(7);

  const pixels = useMemo(() => {
    if (pattern === "gradient") return gradientPixels();
    if (pattern === "blocks") return blocksPixels();
    return scrambledPixels(seed);
  }, [pattern, seed]);

  const Hhist = useMemo(() => histogramEntropy(pixels), [pixels]);
  const Hdiff = useMemo(() => neighborDiffEntropy(pixels), [pixels]);
  const ratio = Hdiff / Hhist;

  // Histogram bars (level 0..15 counts).
  const counts = useMemo(() => {
    const c = new Array(LEVELS).fill(0);
    for (const p of pixels) c[p]++;
    return c;
  }, [pixels]);

  return (
    <WidgetShell kicker={pick(language, "Widget — Image compression", "위젯 — 이미지 압축")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-3 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-3"
      >
        <Stat
          label={pick(language, "H · histogram", "H · 히스토그램")}
          value={`${fmt(Hhist)} bits/px`}
        />
        <Stat
          label={pick(language, "H · neighbor diff", "H · 이웃 차이")}
          value={`${fmt(Hdiff)} bits/px`}
          color={Hdiff > Hhist - 0.5 ? "#b6451e" : "#3a8c4a"}
        />
        <Stat label={pick(language, "ratio", "비율")} value={`${fmt(ratio)}×`} />
      </div>

      <div className="grid grid-cols-[auto_1fr] items-start gap-5 max-md:grid-cols-1">
        {/* Pixel grid */}
        <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
          <svg
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_W}`}
            width="100%"
            style={{ display: "block", maxWidth: CANVAS_W }}
            role="img"
            aria-label={pick(
              language,
              `16 by 16 image patch — ${pattern}`,
              `16×16 이미지 패치 — ${pattern}`,
            )}
          >
            {pixels.map((level, idx) => {
              const i = Math.floor(idx / SIZE);
              const j = idx % SIZE;
              return (
                <rect
                  key={`${i}-${j}`}
                  x={j * CELL_PX}
                  y={i * CELL_PX}
                  width={CELL_PX}
                  height={CELL_PX}
                  fill={levelColor(level)}
                />
              );
            })}
          </svg>
        </div>

        {/* Histogram */}
        <div className="rounded-md border border-rule bg-bg-card p-3">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            {pick(language, "histogram (counts per level)", "히스토그램 (값별 개수)")}
          </div>
          <svg viewBox="0 0 320 120" width="100%" style={{ display: "block" }} aria-hidden>
            {counts.map((c, level) => {
              const x = level * 18 + 8;
              const h = (c / 32) * 100; // counts max ~16, scale to ~50px
              return (
                <g key={BIN_IDS[level]}>
                  <rect
                    x={x}
                    y={110 - h}
                    width={14}
                    height={h}
                    fill={levelColor(level)}
                    stroke="#9ca3a4"
                    strokeWidth={0.5}
                  />
                  <text
                    x={x + 7}
                    y={118}
                    textAnchor="middle"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 8 }}
                    fill="#897e6f"
                  >
                    {level}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-1 font-mono text-[11px] leading-[1.45] text-ink-mute">
            {pick(
              language,
              "All three patterns share this histogram — each level appears 16 times.",
              "세 패턴 모두 같은 히스토그램 — 각 값은 16번씩 등장.",
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPattern(p.id)}
            className={pillClass(pattern === p.id)}
          >
            {pick(language, p.en, p.ko)}
          </button>
        ))}
        {pattern === "scrambled" && (
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-full border border-rule bg-bg px-3.5 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-acc hover:text-acc"
          >
            {pick(language, "reshuffle", "다시 섞기")}
          </button>
        )}
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            All three patches use the <em>same 256 pixel values</em> — each of 16 grayscale levels
            appears 16 times. So the <b>histogram entropy is identical</b>:{" "}
            <span className="font-mono">{fmt(Hhist)}</span> bits/pixel everywhere. But the{" "}
            <em>neighbor-difference entropy</em> isn't: gradient sits near 0 (adjacent rows differ
            by 0 or 1), blocks sit a little higher (jumps at block boundaries), scrambled shoots up
            to ~{fmt(neighborDiffEntropy(scrambledPixels(0)))} bits — adjacent pixels are
            essentially independent. Histogram counts symbols; neighbor differences see structure.
            Real compressors (PNG, JPEG, gzip) exploit the second view; that's why same-histogram
            images can compress to wildly different sizes.
          </>,
          <>
            세 패치 모두 <em>같은 256개의 픽셀 값</em>을 쓴다 — 16단계 회색 각각이 16번씩 등장.
            그러니까 <b>히스토그램 엔트로피는 동일</b>:{" "}
            <span className="font-mono">{fmt(Hhist)}</span> bits/픽셀, 어느 패턴에서나. 하지만{" "}
            <em>이웃 차이 엔트로피</em>는 다르다: 그라디언트는 0 근처 (인접 행은 0 또는 1만 차이),
            블록은 조금 높음 (블록 경계에서 점프), 뒤섞임은 ~
            {fmt(neighborDiffEntropy(scrambledPixels(0)))} bits까지 치솟는다 — 인접 픽셀이
            본질적으로 독립이라는 뜻. 히스토그램은 *심볼*을 세고, 이웃 차이는 *구조*를 본다. 실제
            압축기 (PNG, JPEG, gzip) 는 두 번째 관점을 이용한다. 그래서 히스토그램이 같은 이미지가
            전혀 다른 크기로 압축될 수 있다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
