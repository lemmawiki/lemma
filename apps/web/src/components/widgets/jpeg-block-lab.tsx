import { useContext, useMemo, useState } from "react";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — JPEG Block Lab.
//
// One 8×8 grayscale block in three views:
//   • Original pixels (left)
//   • DCT coefficients, 8×8 grid colored by magnitude (middle)
//   • Reconstructed pixels after keeping only top-K coefficients (right)
//
// Reader picks a preset block (flat / gradient / texture / checkerboard) and
// drags a 'kept coefficients' slider K ∈ [1, 64]. K = 64 → exact recovery
// (DCT is lossless if you keep everything). K small → most coefficients
// zeroed; reconstruction smooths and rings. The page in one widget: lossy
// compression isn't 'compression' — it's *prioritization*.

const N = 8;
const NN = N * N;

// ---- Preset 8×8 blocks (values in [0, 255]) ----------------------------

function flatBlock(): number[] {
  return new Array(NN).fill(128);
}

function gradientBlock(): number[] {
  // Diagonal gradient — smooth, low-frequency.
  const out = new Array(NN);
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) out[i * N + j] = Math.round(((i + j) / 14) * 255);
  return out;
}

function textureBlock(): number[] {
  // Smooth-ish natural texture: a couple of low-frequency sinusoids,
  // deterministic so the picture doesn't shift between renders.
  const out = new Array(NN);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const v =
        128 + 50 * Math.cos(((2 * Math.PI) / 8) * i) + 30 * Math.cos(((2 * Math.PI) / 4) * j + 0.7);
      out[i * N + j] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }
  return out;
}

function checkerboardBlock(): number[] {
  // 1×1 checker — pure high frequency (energy concentrated at u=v=4).
  const out = new Array(NN);
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) out[i * N + j] = (i + j) % 2 === 0 ? 230 : 30;
  return out;
}

type Preset = "flat" | "gradient" | "texture" | "checkerboard";
const PRESETS: Record<Preset, { en: string; ko: string; fn: () => number[] }> = {
  flat: { en: "flat", ko: "단색", fn: flatBlock },
  gradient: { en: "gradient", ko: "그라디언트", fn: gradientBlock },
  texture: { en: "texture", ko: "질감", fn: textureBlock },
  checkerboard: { en: "checkerboard", ko: "체스판", fn: checkerboardBlock },
};

// ---- 2D DCT-II / IDCT for an 8×8 block --------------------------------
// Direct sum form (O(N⁴) = 4096 ops). Plenty fast for one block on the
// client; we don't bother with the FFT factorization.

const PI = Math.PI;
const ALPHA0 = 1 / Math.sqrt(N); // = 1/√8
const ALPHAK = Math.sqrt(2 / N); // = √(1/4)

function alpha(k: number): number {
  return k === 0 ? ALPHA0 : ALPHAK;
}

function dct2(block: number[]): number[] {
  const out = new Array(NN).fill(0);
  for (let u = 0; u < N; u++) {
    for (let v = 0; v < N; v++) {
      let s = 0;
      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          s +=
            block[x * N + y] *
            Math.cos(((2 * x + 1) * u * PI) / (2 * N)) *
            Math.cos(((2 * y + 1) * v * PI) / (2 * N));
        }
      }
      out[u * N + v] = alpha(u) * alpha(v) * s;
    }
  }
  return out;
}

function idct2(coef: number[]): number[] {
  const out = new Array(NN).fill(0);
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      let s = 0;
      for (let u = 0; u < N; u++) {
        for (let v = 0; v < N; v++) {
          s +=
            alpha(u) *
            alpha(v) *
            coef[u * N + v] *
            Math.cos(((2 * x + 1) * u * PI) / (2 * N)) *
            Math.cos(((2 * y + 1) * v * PI) / (2 * N));
        }
      }
      out[x * N + y] = s;
    }
  }
  return out;
}

// Keep top-K coefficients by absolute magnitude; zero the rest.
function keepTopK(coef: number[], k: number): number[] {
  if (k >= NN) return coef.slice();
  if (k <= 0) return new Array(NN).fill(0);
  const idx = Array.from({ length: NN }, (_, i) => i);
  idx.sort((a, b) => Math.abs(coef[b]) - Math.abs(coef[a]));
  const keep = new Set(idx.slice(0, k));
  return coef.map((c, i) => (keep.has(i) ? c : 0));
}

// ---- Layout / colors ---------------------------------------------------

const CELL = 24;
const PANEL_W = N * CELL;
const PANEL_H = N * CELL;

// Stable per-cell ID for React keys (oxlint hates raw indices).
const CELL_IDS = (() => {
  const ids: string[] = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) ids.push(`c${i}${j}`);
  return ids;
})();

// Map pixel value 0..255 → warm grayscale.
function pxColor(v: number): string {
  const t = Math.max(0, Math.min(255, v)) / 255;
  const r = Math.round(20 + t * 230);
  const g = Math.round(17 + t * 224);
  const b = Math.round(13 + t * 215);
  return `rgb(${r},${g},${b})`;
}

// Map DCT coefficient (signed, can be wide) → diverging palette
// (negative blue, zero white, positive terracotta).
function coefColor(c: number, scale: number): string {
  const t = Math.max(-1, Math.min(1, scale > 0 ? c / scale : 0));
  if (t > 0) {
    // 0 → white, 1 → terracotta
    const r = Math.round(255 - t * (255 - 0xb6));
    const g = Math.round(255 - t * (255 - 0x45));
    const b = Math.round(255 - t * (255 - 0x1e));
    return `rgb(${r},${g},${b})`;
  }
  const tt = -t;
  // 0 → white, 1 → curve blue #1e6da6
  const r = Math.round(255 - tt * (255 - 0x1e));
  const g = Math.round(255 - tt * (255 - 0x6d));
  const b = Math.round(255 - tt * (255 - 0xa6));
  return `rgb(${r},${g},${b})`;
}

// ---- Component ---------------------------------------------------------

const fmt = (n: number, d = 2) => n.toFixed(d);

export function JpegBlockLab({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [preset, setPreset] = useState<Preset>("texture");
  const [k, setK] = useState(8);

  const original = useMemo(() => PRESETS[preset].fn(), [preset]);
  const coef = useMemo(() => dct2(original), [original]);
  const coefScale = useMemo(() => Math.max(...coef.map((c) => Math.abs(c)), 1), [coef]);
  const keptCoef = useMemo(() => keepTopK(coef, k), [coef, k]);
  const reconstructed = useMemo(() => idct2(keptCoef), [keptCoef]);

  // Mean absolute error and max error over the block.
  const errors = useMemo(() => {
    let mae = 0;
    let max = 0;
    for (let i = 0; i < NN; i++) {
      const d = Math.abs(reconstructed[i] - original[i]);
      mae += d;
      if (d > max) max = d;
    }
    return { mae: mae / NN, max };
  }, [original, reconstructed]);

  return (
    <WidgetShell kicker={pick(language, "Widget — JPEG block lab", "위젯 — JPEG 블록 실험실")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "kept coefs", "남긴 계수")}
          value={`${k} / 64`}
          color={k < 16 ? C.secant : C.curveAlt}
        />
        <Stat
          label={pick(language, "compression (rough)", "압축 (대략)")}
          value={`${fmt(64 / Math.max(1, k), 1)}×`}
        />
        <Stat
          label={pick(language, "mean abs error", "평균 절대 오차")}
          value={fmt(errors.mae, 1)}
          color={errors.mae > 8 ? C.secant : C.curveAlt}
        />
        <Stat label={pick(language, "max error", "최대 오차")} value={fmt(errors.max, 0)} />
      </div>

      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
        {/* Original block */}
        <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
          <div className="border-b border-rule px-3 pt-2 pb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            {pick(language, "original 8×8", "원본 8×8")}
          </div>
          <svg
            viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
            width="100%"
            style={{ display: "block", maxWidth: PANEL_W }}
            role="img"
            aria-label={pick(language, "original pixel block", "원본 픽셀 블록")}
          >
            {original.map((v, idx) => {
              const i = Math.floor(idx / N);
              const j = idx % N;
              return (
                <rect
                  key={CELL_IDS[idx]}
                  x={j * CELL}
                  y={i * CELL}
                  width={CELL}
                  height={CELL}
                  fill={pxColor(v)}
                />
              );
            })}
          </svg>
        </div>

        {/* DCT coefficients */}
        <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
          <div className="border-b border-rule px-3 pt-2 pb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            {pick(language, "DCT · kept (color), zeroed (gray)", "DCT · 유지 (색), 제거 (회색)")}
          </div>
          <svg
            viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
            width="100%"
            style={{ display: "block", maxWidth: PANEL_W }}
            role="img"
            aria-label={pick(language, "DCT coefficient grid", "DCT 계수 그리드")}
          >
            {coef.map((c, idx) => {
              const u = Math.floor(idx / N);
              const v = idx % N;
              const isKept = keptCoef[idx] !== 0 || c === 0;
              const fill = isKept ? coefColor(c, coefScale) : "#e6dfd2";
              return (
                <g key={CELL_IDS[idx]}>
                  <rect
                    x={v * CELL}
                    y={u * CELL}
                    width={CELL}
                    height={CELL}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={0.5}
                  />
                  {/* DC marker */}
                  {u === 0 && v === 0 && (
                    <text
                      x={v * CELL + CELL / 2}
                      y={u * CELL + CELL / 2 + 3}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 8 }}
                      fill={C.axis}
                    >
                      DC
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Reconstruction */}
        <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
          <div className="border-b border-rule px-3 pt-2 pb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            {pick(language, "reconstructed", "복원")}
          </div>
          <svg
            viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
            width="100%"
            style={{ display: "block", maxWidth: PANEL_W }}
            role="img"
            aria-label={pick(
              language,
              `reconstructed block from top ${k} coefficients`,
              `상위 ${k}개 계수로 복원한 블록`,
            )}
          >
            {reconstructed.map((v, idx) => {
              const i = Math.floor(idx / N);
              const j = idx % N;
              return (
                <rect
                  key={CELL_IDS[idx]}
                  x={j * CELL}
                  y={i * CELL}
                  width={CELL}
                  height={CELL}
                  fill={pxColor(v)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "kept coefficients", "남길 계수 수")}
          value={k}
          onChange={(v) => setK(Math.round(v))}
          min={1}
          max={64}
          step={1}
          accent={C.secant}
          display={`${k}`}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {(Object.keys(PRESETS) as Preset[]).map((id) => (
            <button
              key={`preset-${id}`}
              type="button"
              onClick={() => setPreset(id)}
              className={pillClass(preset === id)}
            >
              {pick(language, PRESETS[id].en, PRESETS[id].ko)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setK(64)}
            className="rounded-full border border-rule bg-bg px-3.5 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-acc hover:text-acc"
          >
            {pick(language, "keep all (lossless)", "전부 유지 (무손실)")}
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Three views, one block. Left: <em>original pixels</em>, the standard view. Middle:{" "}
            <em>DCT coefficients</em>, the same data in a basis where natural images are sparse —
            the <span className="font-mono">DC</span> term (top-left) carries the average; high
            frequencies (bottom-right) are usually small. Right: what you get back if you keep only
            the top <span className="font-mono">K</span> coefficients (by magnitude) and run the
            inverse DCT. <span className="font-mono">K = 64</span> is exact (DCT is lossless when
            you keep everything). For the <em>flat</em> block, even{" "}
            <span className="font-mono">K = 1</span> is exact — the block lives entirely on one
            basis vector. For the <em>texture</em>, you can drop most coefficients before the eye
            notices. For the <em>checkerboard</em>, the energy is concentrated near the
            high-frequency corner, and dropping it produces visible damage. *Same data, different
            basis, different lossiness profile* — the page in one widget.
          </>,
          <>
            세 시점, 한 블록. 왼쪽: <em>원본 픽셀</em>, 표준 시점. 가운데: <em>DCT 계수</em>, 자연
            이미지가 희소해지는 기저로 본 같은 데이터 — <span className="font-mono">DC</span> 항
            (왼쪽 위) 이 평균을 운반하고, 고주파 (오른쪽 아래) 는 보통 작다. 오른쪽: 크기 기준 상위{" "}
            <span className="font-mono">K</span>개 계수만 남기고 역 DCT를 한 결과.{" "}
            <span className="font-mono">K = 64</span>면 정확 (DCT는 모두 유지하면 무손실).{" "}
            <em>단색</em> 블록은 <span className="font-mono">K = 1</span>로도 정확 — 블록 전체가 한
            기저 벡터 위에 산다. <em>질감</em>은 눈이 알아채기 전에 대부분의 계수를 버릴 수 있다.{" "}
            <em>체스판</em>은 에너지가 고주파 코너에 집중돼 있어, 그걸 버리면 눈에 보이는 손상이
            생긴다. *같은 데이터, 다른 기저, 다른 손실 프로파일* — 한 위젯의 페이지.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
