import { useContext, useState } from "react";
import { Mafs, Coordinates, Plot, Line, MovablePoint, Point } from "mafs";
import { AppContext, pick, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";
import { Slider, Stat } from "./widget-primitives";
import { figureColors as C } from "../figures/theme";

// Widget — Tangent Approximation.
// f(x) = sin(x) over [-π, π], with the tangent line at a slidable anchor a.
// The reader chooses an evaluation point x and reads off three numbers:
// true f(x), the linear approximation tangent(x), and the error
// |f(x) - tangent(x)|. The error scales as ~(x-a)²/2 for smooth f, so
// doubling the deviation quadruples the error — the entire content of
// "linear works only in a small regime" made directly visible.

const PI = Math.PI;
const F = Math.sin;
const FPRIME = Math.cos;

const X_MIN = -PI;
const X_MAX = PI;

const fmt = (n: number, d = 4) => n.toFixed(d);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Lemma's secondary plot blue — used for the curve (true value) and to
// distinguish from the green anchor/movable points.
const CURVE = "#1e6da6";

export function TangentApproximation({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [a, setA] = useState(0);
  const [x, setX] = useState(0.8);

  const fa = F(a);
  const fpa = FPRIME(a);
  const tangentAt = (xx: number) => fa + fpa * (xx - a);
  const trueVal = F(x);
  const approxVal = tangentAt(x);
  const error = trueVal - approxVal;
  const dev = x - a;
  const errorOverDevSq = Math.abs(dev) > 1e-6 ? error / (dev * dev) : 0;

  return (
    <WidgetShell kicker={pick(language, "Widget — Tangent approximation", "위젯 — 접선 근사")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 grid grid-cols-4 gap-3 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px] max-md:grid-cols-2"
      >
        <Stat
          label={pick(language, "f(x) — true", "f(x) — 실제")}
          value={fmt(trueVal)}
          color={CURVE}
        />
        <Stat
          label={pick(language, "approx — tangent", "근사 — 접선")}
          value={fmt(approxVal)}
          color={C.secant}
        />
        <Stat
          label={pick(language, "error", "오차")}
          value={fmt(error)}
          color={Math.abs(error) > 0.05 ? C.secant : undefined}
        />
        <Stat
          label={pick(language, "error / (x − a)²", "오차 / (x − a)²")}
          value={Math.abs(dev) > 0.01 ? fmt(errorOverDevSq, 3) : "—"}
        />
      </div>

      <div className="overflow-hidden rounded-md border border-rule bg-bg-card">
        <Mafs
          viewBox={{ x: [X_MIN, X_MAX], y: [-1.4, 1.4] }}
          preserveAspectRatio={false}
          height={320}
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian />
          <Plot.OfX y={F} color={CURVE} weight={2} />
          <Line.PointSlope
            point={[a, fa]}
            slope={fpa}
            color={C.tangent}
            weight={1.6}
            style="dashed"
          />
          {Math.abs(error) > 1e-3 && (
            <Line.Segment
              point1={[x, approxVal]}
              point2={[x, trueVal]}
              color={C.secant}
              weight={1.6}
              style="dashed"
            />
          )}
          {/* eval point on tangent (approximation) */}
          <Point x={x} y={approxVal} color={C.secant} />
          {/* anchor — drag along the curve to move a */}
          <MovablePoint
            point={[a, fa]}
            constrain={([xx]) => {
              const xc = clamp(xx, X_MIN, X_MAX);
              return [xc, F(xc)];
            }}
            onMove={([xx]) => setA(clamp(xx, X_MIN, X_MAX))}
            color={C.point}
          />
          {/* eval point on curve — drag along the curve to move x */}
          <MovablePoint
            point={[x, trueVal]}
            constrain={([xx]) => {
              const xc = clamp(xx, X_MIN, X_MAX);
              return [xc, F(xc)];
            }}
            onMove={([xx]) => setX(clamp(xx, X_MIN, X_MAX))}
            color={CURVE}
          />
        </Mafs>
      </div>

      <div className="mt-4 grid gap-2.5">
        <Slider
          label={pick(language, "anchor a", "기준 a")}
          value={a}
          onChange={setA}
          min={-PI}
          max={PI}
          step={0.05}
          accent={C.point}
          display={fmt(a, 2)}
        />
        <Slider
          label={pick(language, "evaluate at x", "평가점 x")}
          value={x}
          onChange={setX}
          min={-PI}
          max={PI}
          step={0.05}
          accent={CURVE}
          display={fmt(x, 2)}
        />
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            With the anchor at <span className="font-mono">a = 0</span>, the tangent line is{" "}
            <span className="font-mono">y = x</span> — the famous{" "}
            <span className="font-mono">sin x ≈ x</span>. Drag <b>x</b>: at{" "}
            <span className="font-mono">x = 0.1</span> the error is below{" "}
            <span className="font-mono">0.001</span>; at <span className="font-mono">x = 1</span>{" "}
            it's near <span className="font-mono">−0.16</span>; at{" "}
            <span className="font-mono">x = π/2</span> the tangent says{" "}
            <span className="font-mono">π/2 ≈ 1.57</span> while the true value is{" "}
            <span className="font-mono">1</span>. The "error / (x − a)²" column is roughly constant
            near the anchor — that's the <em>error grows as the square of deviation</em> rule, made
            directly visible.
          </>,
          <>
            기준이 <span className="font-mono">a = 0</span>일 때 접선은{" "}
            <span className="font-mono">y = x</span> — 그 유명한{" "}
            <span className="font-mono">sin x ≈ x</span>. <b>x</b>를 끌어보면:{" "}
            <span className="font-mono">x = 0.1</span>에서 오차는{" "}
            <span className="font-mono">0.001</span> 아래; <span className="font-mono">x = 1</span>
            에서 약 <span className="font-mono">−0.16</span>;{" "}
            <span className="font-mono">x = π/2</span>에서 접선은{" "}
            <span className="font-mono">π/2 ≈ 1.57</span>이라 하지만 실제값은{" "}
            <span className="font-mono">1</span>. "오차 / (x − a)²" 칸은 기준 근처에서 거의 상수 —
            그게 <em>오차가 편차의 제곱으로 자란다</em>는 규칙, 눈으로 보이는 형태.
          </>,
        )}
      </div>
    </WidgetShell>
  );
}
