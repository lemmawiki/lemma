import { useMemo, useRef, useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Widget — Control Points.
// Cubic Bezier with the four control points draggable on the canvas. A `t`
// slider drives the De Casteljau construction live: every intermediate
// linear-interpolation layer is drawn so the recursion is visible. The
// curve itself is the locus of the final layer's single point as t sweeps
// from 0 to 1.
//
// Math: B(t) = lerp_3(lerp_2(lerp_1(P_i, P_{i+1}, t), …), …) — exactly
// equivalent to the Bernstein form (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃.

type Pt = { x: number; y: number };

const CONTROL_IDS = ["P0", "P1", "P2", "P3"] as const;
// De Casteljau roles used as stable React keys: layer-k position-i has a
// fixed algebraic identity for a cubic (4 controls), independent of t.
const LAYER_ROLES = [
  ["P0", "P1", "P2", "P3"],
  ["L01", "L12", "L23"],
  ["M012", "M123"],
  ["B"],
] as const;

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// Return the De Casteljau layers at parameter t.
// layers[0] = controls; layers[k] is one shorter than layers[k-1];
// the last layer has length 1 — that point is B(t).
function deCasteljau(controls: Pt[], t: number): Pt[][] {
  const layers: Pt[][] = [controls.slice()];
  while (layers[layers.length - 1].length > 1) {
    const prev = layers[layers.length - 1];
    const next: Pt[] = [];
    for (let i = 0; i < prev.length - 1; i++) next.push(lerp(prev[i], prev[i + 1], t));
    layers.push(next);
  }
  return layers;
}

// Sample the curve densely for the smooth path.
function sampleCurve(controls: Pt[], samples = 80): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const layers = deCasteljau(controls, t);
    out.push(layers[layers.length - 1][0]);
  }
  return out;
}

const W = 520;
const H = 320;
const POINT_R = 8;

const COLOR = {
  control: "#1e6da6", // blue, draggable
  polygon: "#9ca3a4", // muted line connecting controls
  layer1: "#b6451e", // accent-deep
  layer2: "#7a5c2c", // brown
  curve: "#3a8c4a", // green
  point: "#3a8c4a",
} as const;

const DEFAULT_CONTROLS: Pt[] = [
  { x: 70, y: 240 },
  { x: 160, y: 60 },
  { x: 360, y: 60 },
  { x: 450, y: 240 },
];

export function ControlPoints() {
  const { language } = useApp();
  const [controls, setControls] = useState<Pt[]>(DEFAULT_CONTROLS);
  const [t, setT] = useState(0.5);
  const [showLayers, setShowLayers] = useState(true);
  const dragIdx = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const layers = useMemo(() => deCasteljau(controls, t), [controls, t]);
  const curve = useMemo(() => sampleCurve(controls, 80), [controls]);
  const final = layers[layers.length - 1][0];

  const toSvg = (clientX: number, clientY: number): Pt | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    const py = ((clientY - rect.top) / rect.height) * H;
    return {
      x: Math.max(POINT_R, Math.min(W - POINT_R, px)),
      y: Math.max(POINT_R, Math.min(H - POINT_R, py)),
    };
  };

  const onPointerDown = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    dragIdx.current = i;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragIdx.current === null) return;
    const p = toSvg(e.clientX, e.clientY);
    if (!p) return;
    setControls((prev) => {
      const next = prev.slice();
      next[dragIdx.current as number] = p;
      return next;
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragIdx.current === null) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    dragIdx.current = null;
  };

  const reset = () => {
    setControls(DEFAULT_CONTROLS);
    setT(0.5);
  };

  const polylinePoints = (pts: Pt[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  const fmt = (n: number) => n.toFixed(0);

  return (
    <WidgetShell kicker={pick(language, "Widget — Control points", "위젯 — 제어점")}>
      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", touchAction: "none" }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="img"
          aria-label={pick(
            language,
            "draggable cubic Bezier control points",
            "끌 수 있는 3차 베지에 제어점",
          )}
        >
          {/* Control polygon */}
          <polyline
            points={polylinePoints(controls)}
            fill="none"
            stroke={COLOR.polygon}
            strokeWidth={1.2}
            strokeDasharray="4 4"
          />

          {/* The Bezier curve itself */}
          <polyline
            points={polylinePoints(curve)}
            fill="none"
            stroke={COLOR.curve}
            strokeWidth={2.2}
          />

          {/* De Casteljau intermediate layers */}
          {showLayers &&
            layers.slice(1, -1).map((layer, idx) => {
              const layerIdx = idx + 1; // shifted because slice starts at 1
              const c = idx === 0 ? COLOR.layer1 : COLOR.layer2;
              const roles = LAYER_ROLES[layerIdx];
              return (
                <g key={roles.join(",")}>
                  <polyline
                    points={polylinePoints(layer)}
                    fill="none"
                    stroke={c}
                    strokeWidth={1.4}
                    opacity={0.9}
                  />
                  {layer.map((p, i) => (
                    <circle key={roles[i]} cx={p.x} cy={p.y} r={4} fill={c} opacity={0.9} />
                  ))}
                </g>
              );
            })}

          {/* Control point handles */}
          {controls.map((p, i) => {
            const id = CONTROL_IDS[i];
            return (
              <g key={id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={POINT_R}
                  fill="white"
                  stroke={COLOR.control}
                  strokeWidth={2}
                  style={{ cursor: "grab" }}
                  onPointerDown={onPointerDown(i)}
                />
                <text
                  x={p.x + 12}
                  y={p.y - 8}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
                  fill={COLOR.control}
                  pointerEvents="none"
                >
                  {id}
                </text>
              </g>
            );
          })}

          {/* Final point B(t) */}
          <circle
            cx={final.x}
            cy={final.y}
            r={6}
            fill={COLOR.point}
            stroke="white"
            strokeWidth={2}
            pointerEvents="none"
          />
          <text
            x={final.x + 10}
            y={final.y + 16}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}
            fill={COLOR.point}
            pointerEvents="none"
          >
            B(t)
          </text>
        </svg>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid grid-cols-[140px_1fr_60px] items-center gap-3 text-[13px] max-md:grid-cols-[100px_1fr_56px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-ink-mute">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: COLOR.curve }}
              aria-hidden
            />
            {pick(language, "parameter t", "매개변수 t")}
          </span>
          <input
            type="range"
            className="w-full"
            style={{ accentColor: COLOR.curve }}
            min={0}
            max={1}
            step={0.005}
            value={t}
            onChange={(e) => setT(+e.target.value)}
          />
          <span className="text-right font-mono text-[12.5px] text-ink">{t.toFixed(2)}</span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLayers((v) => !v)}
            className={
              "rounded-full border px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors " +
              (showLayers
                ? "border-acc bg-acc/10 text-acc"
                : "border-rule text-ink-mute hover:border-acc hover:text-acc")
            }
          >
            {pick(language, "show construction", "작도 보기")}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-rule px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-mute hover:border-acc hover:text-acc"
          >
            {pick(language, "reset", "초기화")}
          </button>
          <span className="ml-auto font-mono text-[11.5px] text-ink-mute">
            B({t.toFixed(2)}) = ({fmt(final.x)}, {fmt(final.y)})
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Drag any of <b>P₀ … P₃</b>. The dashed gray polygon is the <em>control polygon</em>; the
            green curve is the Bezier. Slide <b>t</b> from 0 to 1 and watch the orange / brown
            layers <em>collapse one by one</em> onto the green point. The curve <em>is</em> the
            trace of that final point as t sweeps the unit interval. Three lerps, each fed the
            result of the last — that's the entire algorithm.
          </>,
          <>
            <b>P₀ … P₃</b> 중 아무거나 끌어보자. 점선 회색은 <em>제어 다각형</em>, 초록 곡선이
            베지에. <b>t</b>를 0에서 1로 끌면 주황·갈색 층이 <em>차례로 무너져 내려</em> 초록 점에
            닿는다. 곡선은 그 마지막 점이 단위 구간을 지나며 *그리는 자취*. 한 번 lerp, 그 결과로 또
            lerp, 또 한 번 — 그게 알고리즘 *전부*.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
