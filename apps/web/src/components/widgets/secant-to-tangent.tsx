import { useState } from "react";
import { Mafs, Coordinates, Plot, Line, MovablePoint } from "mafs";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Secant to Tangent.
// Plot y = x². Two points P = (a, a²) and Q = (a+h, (a+h)²). The
// secant line through P and Q has slope (2a + h). The tangent at P has
// slope 2a. As h → 0, the secant rotates onto the tangent — the limit
// the derivative is *defined* as. The widget makes the limit visible:
// drag Q toward P (or shrink h on the slider) and watch the orange
// secant collapse onto the brown dashed tangent.

const F = (x: number) => x * x;
const FPRIME = (x: number) => 2 * x;

const A_MIN = 0.2;
const A_MAX = 2;
const H_MIN = 0.01;
const H_MAX = 1.5;

const fmt = (n: number, d = 3) => (Number.isFinite(n) ? n.toFixed(d) : "—");
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function SecantToTangent() {
  const { language } = useApp();
  const [a, setA] = useState(1);
  const [h, setH] = useState(1);

  const fa = F(a);
  const fb = F(a + h);
  const slopeSecant = (fb - fa) / h;
  const slopeTangent = FPRIME(a);

  return (
    <WidgetShell kicker={pick(language, "Widget — Secant → tangent", "위젯 — 할선 → 접선")}>
      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <Mafs
          viewBox={{ x: [-0.5, 2.8], y: [-0.6, 6.2] }}
          preserveAspectRatio={false}
          height={320}
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian />
          <Plot.OfX y={F} color={C.curve} weight={2} />
          <Line.PointSlope
            point={[a, fa]}
            slope={slopeTangent}
            color={C.tangent}
            weight={1.5}
            style="dashed"
          />
          <Line.PointSlope point={[a, fa]} slope={slopeSecant} color={C.secant} weight={2.2} />
          <MovablePoint
            point={[a, fa]}
            constrain={([x]) => [clamp(x, A_MIN, A_MAX), F(clamp(x, A_MIN, A_MAX))]}
            onMove={([x]) => setA(clamp(x, A_MIN, A_MAX))}
            color={C.point}
          />
          <MovablePoint
            point={[a + h, fb]}
            constrain={([x]) => {
              const xc = clamp(x, a + H_MIN, a + H_MAX);
              return [xc, F(xc)];
            }}
            onMove={([x]) => setH(clamp(x - a, H_MIN, H_MAX))}
            color={C.secant}
          />
        </Mafs>
      </div>

      <div
        role="status"
        aria-live="polite"
        className="mt-3 grid grid-cols-3 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-1"
      >
        <Stat
          label={pick(language, "secant slope", "할선 기울기")}
          value={`(f(a+h) − f(a))/h = ${fmt(slopeSecant, 4)}`}
          color={C.secant}
        />
        <Stat
          label={pick(language, "tangent slope", "접선 기울기")}
          value={`f'(${fmt(a, 2)}) = 2·${fmt(a, 2)} = ${fmt(slopeTangent, 4)}`}
          color={C.tangent}
        />
        <Stat
          label={pick(language, "difference (= h)", "차이 (= h)")}
          value={fmt(slopeSecant - slopeTangent, 4)}
        />
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "anchor a", "기준 a")}
          value={a}
          onChange={setA}
          min={A_MIN}
          max={A_MAX}
          step={0.05}
          accent={C.point}
          display={fmt(a, 2)}
        />
        <Slider
          label={pick(language, "interval h", "구간 h")}
          value={h}
          onChange={setH}
          min={H_MIN}
          max={H_MAX}
          step={0.01}
          accent={C.secant}
          display={fmt(h, 2)}
        />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Drag the orange <b>Q</b> toward the green <b>P</b> — or shrink <b>h</b> on the slider.
            The orange <b>secant</b> rotates and collapses onto the brown dashed <b>tangent</b>; the
            secant slope <span className="font-mono">2a + h</span> approaches the tangent slope{" "}
            <span className="font-mono">2a</span>; the difference shown above shrinks to{" "}
            <em>exactly h</em>. That number — what the secant slope *converges to* as the two points
            merge — is the derivative <span className="font-mono">f'(a)</span>. Drag <b>P</b> and
            the slope changes at a rate of 2 per unit: that is{" "}
            <span className="font-mono">d/da [2a] = 2</span> — one more derivative.
          </>,
          <>
            주황색 <b>Q</b>를 초록색 <b>P</b> 쪽으로 끌거나 슬라이더로 <b>h</b>를 줄여 보자. 주황색{" "}
            <b>할선</b>이 회전하며 갈색 점선 <b>접선</b>으로 무너진다. 할선 기울기{" "}
            <span className="font-mono">2a + h</span>가 접선 기울기{" "}
            <span className="font-mono">2a</span>로 다가가고, 위 차이 칸은 <em>정확히 h</em>로
            작아진다. 그 수 — 두 점이 합쳐질 때 할선 기울기가 *수렴하는* 값 — 이 미분{" "}
            <span className="font-mono">f'(a)</span>. <b>P</b>를 움직이면 기울기가 단위 당 2의
            속도로 바뀐다 — 그게 <span className="font-mono">d/da [2a] = 2</span>, 한 번 더 미분.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
