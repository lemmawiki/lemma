import { useMemo, useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Widget — Launch.
// Two motions, one ball. Slide θ (launch angle), v₀ (initial speed),
// and g (gravity), and the trajectory recomputes — same parametric form,
// same image (a parabola) every time. The current-time slider drives
// a moving dot with its velocity vector decomposed into horizontal and
// vertical components: the horizontal arrow stays the same length, the
// vertical arrow shrinks toward the apex and grows past it. That is the
// independence-of-motion picture made visible.

const W = 600;
const H = 260;
const PAD_X = 26;
const PAD_Y = 26;
const SAMPLES = 80;
const RAD = Math.PI / 180;

const COLOR = {
  axis: "var(--color-rule)",
  ground: "#9ca3a4",
  trace: "#b6451e", // accent-deep — the parabola
  ball: "#1e6da6",
  vTotal: "#3a8c4a", // green — net velocity
  vx: "#7a5c2c", // brown — horizontal component
  vy: "#1e6da6", // blue — vertical component
} as const;

function fmt(n: number, d = 2): string {
  return Number.isFinite(n) ? n.toFixed(d) : "—";
}

export function Launch() {
  const { language } = useApp();
  const [theta, setTheta] = useState(45);
  const [v0, setV0] = useState(20);
  const [g, setG] = useState(9.8);

  const trig = useMemo(() => {
    const r = theta * RAD;
    return { c: Math.cos(r), s: Math.sin(r) };
  }, [theta]);

  const tLand = useMemo(() => (g > 0 && trig.s > 0 ? (2 * v0 * trig.s) / g : 0), [v0, trig.s, g]);
  const range = useMemo(() => v0 * trig.c * tLand, [v0, trig.c, tLand]);
  const yMax = useMemo(() => (v0 * v0 * trig.s * trig.s) / (2 * g), [v0, trig.s, g]);
  const tPeak = useMemo(() => tLand / 2, [tLand]);

  const [tFrac, setTFrac] = useState(0.5);
  const t = tLand * tFrac;
  const xT = v0 * trig.c * t;
  const yT = v0 * trig.s * t - 0.5 * g * t * t;
  const vxT = v0 * trig.c;
  const vyT = v0 * trig.s - g * t;

  // Auto-fit: pick scale so the trajectory plus padding fits the box.
  // Slight headroom on top so labels don't clip.
  const xSpan = Math.max(range * 1.05, 1);
  const ySpan = Math.max(yMax * 1.4, 1);
  const scaleX = (W - 2 * PAD_X) / xSpan;
  const scaleY = (H - 2 * PAD_Y) / ySpan;
  const scale = Math.min(scaleX, scaleY);
  const sx = (xm: number) => PAD_X + xm * scale;
  const sy = (ym: number) => H - PAD_Y - ym * scale;

  // 80 multiplications per render — too small to memoize. The sx/sy
  // closures capture `scale`, which itself derives from range/yMax, so
  // any change that would invalidate a memo recomputes scale anyway.
  const pathPoints = (() => {
    const pts: string[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const tt = (i / SAMPLES) * tLand;
      const x = v0 * trig.c * tt;
      const y = v0 * trig.s * tt - 0.5 * g * tt * tt;
      pts.push(`${sx(x)},${sy(y)}`);
    }
    return pts.join(" ");
  })();

  // Velocity arrows are rendered in m/s; pick a visual scale so a 20 m/s
  // arrow is roughly 60 px on a typical setup (independent of trajectory
  // scale so vector magnitudes stay legible at small ranges too).
  const VEC_PX_PER_MS = 3.0;
  const ax = vxT * VEC_PX_PER_MS;
  const ay = vyT * VEC_PX_PER_MS;
  const headSize = 5;

  const arrowDef = (id: string, color: string) => (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth={headSize}
      markerHeight={headSize}
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
  );

  return (
    <WidgetShell kicker={pick(language, "Widget — Launch", "위젯 — 발사")}>
      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label={pick(
            language,
            "projectile trajectory with velocity decomposition",
            "속도 성분이 분해된 포물선 궤적",
          )}
        >
          <defs>
            {arrowDef("arrow-total", COLOR.vTotal)}
            {arrowDef("arrow-vx", COLOR.vx)}
            {arrowDef("arrow-vy", COLOR.vy)}
          </defs>

          {/* ground */}
          <line
            x1={PAD_X - 8}
            y1={sy(0)}
            x2={W - PAD_X + 8}
            y2={sy(0)}
            stroke={COLOR.ground}
            strokeWidth={1.2}
          />

          {/* trajectory */}
          <polyline
            points={pathPoints}
            fill="none"
            stroke={COLOR.trace}
            strokeWidth={2.2}
            opacity={0.9}
          />

          {/* peak marker */}
          <line
            x1={sx(range / 2)}
            y1={sy(yMax)}
            x2={sx(range / 2)}
            y2={sy(0)}
            stroke={COLOR.ground}
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />

          {/* ball at current t */}
          <circle cx={sx(xT)} cy={sy(yT)} r={6} fill={COLOR.ball} />

          {/* horizontal component arrow (constant) */}
          <line
            x1={sx(xT)}
            y1={sy(yT)}
            x2={sx(xT) + ax}
            y2={sy(yT)}
            stroke={COLOR.vx}
            strokeWidth={1.6}
            strokeDasharray="4 3"
            markerEnd="url(#arrow-vx)"
          />
          {/* vertical component arrow (linear in t, can flip sign) */}
          <line
            x1={sx(xT)}
            y1={sy(yT)}
            x2={sx(xT)}
            y2={sy(yT) - ay}
            stroke={COLOR.vy}
            strokeWidth={1.6}
            strokeDasharray="4 3"
            markerEnd="url(#arrow-vy)"
          />
          {/* total velocity vector */}
          <line
            x1={sx(xT)}
            y1={sy(yT)}
            x2={sx(xT) + ax}
            y2={sy(yT) - ay}
            stroke={COLOR.vTotal}
            strokeWidth={2}
            markerEnd="url(#arrow-total)"
          />

          {/* labels */}
          <text
            x={sx(range)}
            y={sy(0) + 16}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
            fill={COLOR.trace}
          >
            range = {fmt(range, 1)} m
          </text>
          <text
            x={sx(range / 2) + 4}
            y={sy(yMax) - 4}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
            fill={COLOR.ground}
          >
            y_max = {fmt(yMax, 1)} m
          </text>
        </svg>
      </div>

      <div
        role="status"
        aria-live="polite"
        className="mt-3 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat label={pick(language, "t_peak", "t_정점")} value={`${fmt(tPeak, 2)} s`} />
        <Stat label={pick(language, "t_land", "t_착지")} value={`${fmt(tLand, 2)} s`} />
        <Stat
          label={pick(language, "vₓ (constant)", "vₓ (일정)")}
          value={`${fmt(vxT, 2)} m/s`}
          color={COLOR.vx}
        />
        <Stat
          label={pick(language, "v_y (current)", "v_y (현재)")}
          value={`${fmt(vyT, 2)} m/s`}
          color={COLOR.vy}
        />
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "angle θ (deg)", "각도 θ (도)")}
          value={theta}
          onChange={setTheta}
          min={5}
          max={85}
          step={1}
          accent="var(--ink)"
          display={`${theta}°`}
        />
        <Slider
          label={pick(language, "speed v₀ (m/s)", "속력 v₀ (m/s)")}
          value={v0}
          onChange={setV0}
          min={5}
          max={30}
          step={0.5}
          accent={COLOR.trace}
          display={`${v0.toFixed(1)} m/s`}
        />
        <Slider
          label={pick(language, "gravity g (m/s²)", "중력 g (m/s²)")}
          value={g}
          onChange={setG}
          min={1}
          max={25}
          step={0.5}
          accent="var(--ink-mute)"
          display={`${g.toFixed(1)} m/s²`}
        />
        <Slider
          label={pick(language, "time t / t_land", "시간 t / t_착지")}
          value={tFrac}
          onChange={setTFrac}
          min={0}
          max={1}
          step={0.005}
          accent={COLOR.ball}
          display={`${(tFrac * 100).toFixed(0)}%`}
        />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Slide <b>t</b> across the bottom and watch the brown <b>vₓ</b> arrow stay the same
            length while the blue <b>v_y</b> arrow shrinks to nothing at the apex and flips downward
            after. The horizontal motion <em>does not know</em> about gravity; the vertical motion{" "}
            <em>does not know</em> about horizontal velocity. Their independent stories — uniform
            horizontal, constant-acceleration vertical — meet only in the picture, and that picture
            is a parabola.
          </>,
          <>
            <b>t</b> 슬라이더를 끌어보면 갈색 <b>vₓ</b> 화살표는 길이가 일정한데 파란 <b>v_y</b>{" "}
            화살표는 정점에서 0이 되었다가 그 뒤로 아래로 뒤집힌다. 가로 방향 운동은 중력을{" "}
            <em>알지 못하고</em>, 세로 방향 운동은 가로 속도를 <em>알지 못한다</em>. 서로 독립인 두
            이야기 — 가로는 등속, 세로는 등가속 — 는 그림에서만 만나고, 그 그림이 포물선이다.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  accent,
  display,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  accent: string;
  display: string;
}) {
  return (
    <label className="grid grid-cols-[140px_1fr_70px] items-center gap-3 text-[13px] max-md:grid-cols-[100px_1fr_56px]">
      <span className="inline-flex items-center gap-1.5 font-mono text-ink-mute">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
          style={{ background: accent }}
          aria-hidden
        />
        {label}
      </span>
      <input
        type="range"
        className="w-full"
        style={{ accentColor: accent }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <span className="text-right font-mono text-[12.5px] text-ink">{display}</span>
    </label>
  );
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
