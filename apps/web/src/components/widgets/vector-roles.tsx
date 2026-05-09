import { useState } from "react";
import { Mafs, Coordinates, Vector, Line, MovablePoint, Point } from "mafs";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, pillClass } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Vector Roles.
// One pair of tuples: a "point" A = (a_x, a_y) and a "displacement" v =
// (v_x, v_y). The same picture (A, v, A+v, components decomposed) is
// re-labelled by the role toggle: graphics, physics, ML, generic. Same
// math; same numbers; the costume is what the application slots them
// into. The crisis the widget answers: a tuple has no inherent role —
// you give it one by what you do with it.

const X_MIN = -1;
const X_MAX = 8;
const Y_MIN = -1;
const Y_MAX = 6;

const POINT_A = "#1e6da6"; // blue — the anchor "point"
const VECTOR = C.secant; // terracotta — the displacement
const RESULT = C.point; // green — the destination
const COMPONENT = C.tangent; // brown — decomposition

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

const fmt = (n: number, d = 1) => n.toFixed(d);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function VectorRoles() {
  const { language } = useApp();
  const [ax, setAx] = useState(2);
  const [ay, setAy] = useState(1);
  const [vx, setVx] = useState(3);
  const [vy, setVy] = useState(3);
  const [role, setRole] = useState<Role>("generic");
  const [scaleC, setScaleC] = useState(1);

  const cvx = scaleC * vx;
  const cvy = scaleC * vy;
  const rx = ax + cvx;
  const ry = ay + cvy;
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
          <span style={{ color: POINT_A }}>
            ({fmt(ax)}, {fmt(ay)})
          </span>
        </div>
        <div>
          <span className="text-ink-mute">{labels.v} · </span>
          <span style={{ color: VECTOR }}>
            ({fmt(cvx)}, {fmt(cvy)})
          </span>
        </div>
        <div>
          <span className="text-ink-mute">{labels.res} · </span>
          <span style={{ color: RESULT }}>
            ({fmt(rx)}, {fmt(ry)})
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <Mafs
          viewBox={{ x: [X_MIN, X_MAX], y: [Y_MIN, Y_MAX] }}
          preserveAspectRatio={false}
          height={320}
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian subdivisions={false} />
          {/* component decomposition: dashed horizontal then vertical */}
          <Line.Segment
            point1={[ax, ay]}
            point2={[rx, ay]}
            color={COMPONENT}
            weight={1.2}
            style="dashed"
          />
          <Line.Segment
            point1={[rx, ay]}
            point2={[rx, ry]}
            color={COMPONENT}
            weight={1.2}
            style="dashed"
          />
          {/* the v vector A → A + cv */}
          <Vector tail={[ax, ay]} tip={[rx, ry]} color={VECTOR} weight={2.4} />
          {/* destination point */}
          <Point x={rx} y={ry} color={RESULT} />
          {/* draggable A */}
          <MovablePoint
            point={[ax, ay]}
            onMove={([nx, ny]) => {
              setAx(clamp(nx, X_MIN, X_MAX));
              setAy(clamp(ny, Y_MIN, Y_MAX));
            }}
            color={POINT_A}
          />
        </Mafs>
      </div>

      {/* role toggle */}
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="vector role">
        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={role === r}
            onClick={() => setRole(r)}
            className={pillClass(role === r)}
          >
            {ROLE_LABELS[r][language].name}
          </button>
        ))}
      </div>

      {/* sliders */}
      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "v · x", "v · x")}
          value={vx}
          onChange={setVx}
          min={-5}
          max={5}
          step={0.5}
          accent={VECTOR}
          display={fmt(vx)}
        />
        <Slider
          label={pick(language, "v · y", "v · y")}
          value={vy}
          onChange={setVy}
          min={-5}
          max={5}
          step={0.5}
          accent={VECTOR}
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
