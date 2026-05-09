import { useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Widget — Vector Roles.
// One pair of tuples: a "point" A = (a_x, a_y) and a "displacement" v =
// (v_x, v_y). The same picture (A, v, A+v, components decomposed) is
// re-labelled by the role toggle: graphics, physics, ML, generic. Same
// math; same numbers; the costume is what the application slots them
// into. The crisis the widget answers: a tuple has no inherent role —
// you give it one by what you do with it.

const W = 540;
const H = 320;
const PAD_X = 38;
const PAD_Y = 32;

const X_MIN = -1;
const X_MAX = 8;
const Y_MIN = -1;
const Y_MAX = 6;

const sx = (x: number) => PAD_X + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD_X);
const sy = (y: number) => H - PAD_Y - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD_Y);

const COLOR = {
  axis: "#9ca3a4",
  grid: "var(--color-rule)",
  pointA: "#1e6da6",
  vector: "#b6451e",
  result: "#3a8c4a",
  component: "#7a5c2c",
} as const;

type Role = "generic" | "graphics" | "physics" | "ml";

const ROLE_LABELS: Record<
  Role,
  {
    en: { name: string; A: string; v: string; res: string; story: string };
    ko: { name: string; A: string; v: string; res: string; story: string };
  }
> = {
  generic: {
    en: {
      name: "generic",
      A: "point A",
      v: "displacement v",
      res: "A + v",
      story:
        "A is a location. v is how to move. A + v is where you end up. The most stripped-down reading.",
    },
    ko: {
      name: "기본",
      A: "점 A",
      v: "변위 v",
      res: "A + v",
      story: "A는 위치. v는 어떻게 움직일지. A + v는 도착점. 가장 군더더기 없는 읽기.",
    },
  },
  graphics: {
    en: {
      name: "graphics",
      A: "control point P",
      v: "tangent direction",
      res: "next handle",
      story:
        "A Bezier control point and the tangent the curve leaves it along. Translating the curve = adding the same v to every control point.",
    },
    ko: {
      name: "그래픽",
      A: "제어점 P",
      v: "접선 방향",
      res: "다음 핸들",
      story:
        "베지에 제어점과 그 점에서 곡선이 떠나는 접선 방향. 곡선 전체를 평행 이동 = 모든 제어점에 같은 v를 더하기.",
    },
  },
  physics: {
    en: {
      name: "physics",
      A: "position x⃗",
      v: "velocity × Δt",
      res: "position after Δt",
      story:
        "A position vector and the small displacement made by velocity over a short time interval. Repeating gives a trajectory; the projectile-motion widget runs exactly this loop.",
    },
    ko: {
      name: "물리",
      A: "위치 x⃗",
      v: "속도 × Δt",
      res: "Δt 후 위치",
      story:
        "위치 벡터와 짧은 시간 동안 속도가 만드는 작은 변위. 반복하면 궤적이 되고, 포물선-운동 위젯이 정확히 이 루프를 돈다.",
    },
  },
  ml: {
    en: {
      name: "ml",
      A: "current weights w⃗",
      v: "−η · gradient",
      res: "updated weights",
      story:
        "A parameter vector and the descent step the gradient-descent widget applies. The same arithmetic; the optimization story replaces the geometric one.",
    },
    ko: {
      name: "ML",
      A: "현재 가중치 w⃗",
      v: "−η · 기울기",
      res: "갱신된 가중치",
      story:
        "매개변수 벡터와 경사하강법 위젯이 적용하는 한 스텝. 산술은 같고, 최적화 이야기가 기하 이야기를 대체한다.",
    },
  },
};

function fmt(n: number, d = 1): string {
  return n.toFixed(d);
}

export function VectorRoles() {
  const { language } = useApp();
  const [ax, setAx] = useState(2);
  const [ay, setAy] = useState(1);
  const [vx, setVx] = useState(3);
  const [vy, setVy] = useState(3);
  const [role, setRole] = useState<Role>("generic");
  const [scaleC, setScaleC] = useState(1);

  const rx = ax + scaleC * vx;
  const ry = ay + scaleC * vy;
  const labels = ROLE_LABELS[role][language];

  return (
    <WidgetShell kicker={pick(language, "Widget — Vector roles", "위젯 — 벡터의 역할")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-3 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-1"
      >
        <div>
          <span className="text-ink-mute">{labels.A} · </span>
          <span className="text-ink" style={{ color: COLOR.pointA }}>
            ({fmt(ax)}, {fmt(ay)})
          </span>
        </div>
        <div>
          <span className="text-ink-mute">{labels.v} · </span>
          <span className="text-ink" style={{ color: COLOR.vector }}>
            ({fmt(scaleC * vx)}, {fmt(scaleC * vy)})
          </span>
        </div>
        <div>
          <span className="text-ink-mute">{labels.res} · </span>
          <span className="text-ink" style={{ color: COLOR.result }}>
            ({fmt(rx)}, {fmt(ry)})
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label={pick(
            language,
            "vector A, displacement v, and result A + cv on a grid",
            "격자 위의 벡터 A, 변위 v, 결과 A + cv",
          )}
        >
          {/* grid */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => X_MIN + i).map((gx) => (
            <line
              key={`gx-${gx}`}
              x1={sx(gx)}
              y1={sy(Y_MIN)}
              x2={sx(gx)}
              y2={sy(Y_MAX)}
              stroke={COLOR.grid}
              strokeWidth={0.5}
              opacity={gx === 0 ? 0.8 : 0.3}
            />
          ))}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => Y_MIN + i).map((gy) => (
            <line
              key={`gy-${gy}`}
              x1={sx(X_MIN)}
              y1={sy(gy)}
              x2={sx(X_MAX)}
              y2={sy(gy)}
              stroke={COLOR.grid}
              strokeWidth={0.5}
              opacity={gy === 0 ? 0.8 : 0.3}
            />
          ))}

          {/* axis ticks at integers */}
          {[0, 2, 4, 6, 8].map((v) => (
            <text
              key={`tx-${v}`}
              x={sx(v)}
              y={sy(0) + 14}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
              fill={COLOR.axis}
            >
              {v}
            </text>
          ))}
          {[0, 2, 4].map((v) => (
            <text
              key={`ty-${v}`}
              x={sx(0) - 6}
              y={sy(v) + 3}
              textAnchor="end"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
              fill={COLOR.axis}
            >
              {v}
            </text>
          ))}

          {/* component decomposition: dashed horizontal then vertical */}
          <line
            x1={sx(ax)}
            y1={sy(ay)}
            x2={sx(rx)}
            y2={sy(ay)}
            stroke={COLOR.component}
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
          <line
            x1={sx(rx)}
            y1={sy(ay)}
            x2={sx(rx)}
            y2={sy(ry)}
            stroke={COLOR.component}
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
          <text
            x={(sx(ax) + sx(rx)) / 2}
            y={sy(ay) - 4}
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}
            fill={COLOR.component}
          >
            {fmt(scaleC * vx)}
          </text>
          <text
            x={sx(rx) + 6}
            y={(sy(ay) + sy(ry)) / 2 + 3}
            style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}
            fill={COLOR.component}
          >
            {fmt(scaleC * vy)}
          </text>

          {/* the v vector arrow from A to A + cv */}
          <defs>
            <marker
              id="arrow-v"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth={5}
              markerHeight={5}
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={COLOR.vector} />
            </marker>
          </defs>
          <line
            x1={sx(ax)}
            y1={sy(ay)}
            x2={sx(rx)}
            y2={sy(ry)}
            stroke={COLOR.vector}
            strokeWidth={2.4}
            markerEnd="url(#arrow-v)"
          />

          {/* point A */}
          <circle
            cx={sx(ax)}
            cy={sy(ay)}
            r={7}
            fill={COLOR.pointA}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={sx(ax) - 14}
            y={sy(ay) + 18}
            textAnchor="end"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600 }}
            fill={COLOR.pointA}
          >
            A
          </text>

          {/* point A + cv */}
          <circle
            cx={sx(rx)}
            cy={sy(ry)}
            r={6}
            fill={COLOR.result}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={sx(rx) + 9}
            y={sy(ry) - 9}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600 }}
            fill={COLOR.result}
          >
            A + {scaleC === 1 ? "" : `${scaleC}·`}v
          </text>
        </svg>
      </div>

      {/* role toggle */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={
              "rounded-full border px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors " +
              (role === r
                ? "border-acc bg-acc/10 text-acc"
                : "border-rule text-ink-mute hover:border-acc hover:text-acc")
            }
          >
            {ROLE_LABELS[r][language].name}
          </button>
        ))}
      </div>

      {/* sliders */}
      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "A · x", "A · x")}
          value={ax}
          onChange={setAx}
          min={X_MIN}
          max={X_MAX}
          step={0.5}
          accent={COLOR.pointA}
          display={fmt(ax)}
        />
        <Slider
          label={pick(language, "A · y", "A · y")}
          value={ay}
          onChange={setAy}
          min={Y_MIN}
          max={Y_MAX}
          step={0.5}
          accent={COLOR.pointA}
          display={fmt(ay)}
        />
        <Slider
          label={pick(language, "v · x", "v · x")}
          value={vx}
          onChange={setVx}
          min={-5}
          max={5}
          step={0.5}
          accent={COLOR.vector}
          display={fmt(vx)}
        />
        <Slider
          label={pick(language, "v · y", "v · y")}
          value={vy}
          onChange={setVy}
          min={-5}
          max={5}
          step={0.5}
          accent={COLOR.vector}
          display={fmt(vy)}
        />
        <Slider
          label={pick(language, "scalar c", "스칼라 c")}
          value={scaleC}
          onChange={setScaleC}
          min={-2}
          max={2}
          step={0.1}
          accent="var(--ink)"
          display={fmt(scaleC, 1)}
        />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {labels.story}
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
    <label className="grid grid-cols-[100px_1fr_60px] items-center gap-3 text-[13px] max-md:grid-cols-[80px_1fr_50px]">
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
