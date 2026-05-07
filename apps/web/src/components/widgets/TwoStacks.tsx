import { useState } from "react";
import { useApp, pick } from "../../context/AppContext";

const W = 720;
const H = 260;
const PAD_L = 56;
const PAD_R = 32;
const TOP_Y = 70;
const BOT_Y = 190;

// Widget A — Two Stacks.
// Two parallel axes. Top: linear 0..1000. Bottom: log10 1..1000. Drag a, b on
// the bottom (log) axis. The product a·b appears on BOTH axes — landing on the
// product on top, and on the SUM of log-distances on bottom. Same point.
export function TwoStacks() {
  const { language } = useApp();
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);

  const innerW = W - PAD_L - PAD_R;

  // Linear (top) axis: 0..1000.
  const TOP_MIN = 0;
  const TOP_MAX = 1000;
  const xLin = (v: number) => PAD_L + ((v - TOP_MIN) / (TOP_MAX - TOP_MIN)) * innerW;

  // Log (bottom) axis: 1..1000.
  const LOG_LO = 0; // log10(1)
  const LOG_HI = 3; // log10(1000)
  const xLog = (v: number) => PAD_L + ((Math.log10(v) - LOG_LO) / (LOG_HI - LOG_LO)) * innerW;

  const product = a * b;
  const productClampedTop = Math.min(Math.max(product, TOP_MIN), TOP_MAX);
  const productClampedLog = Math.min(Math.max(product, 1), 1000);

  const linTicks = [0, 200, 400, 600, 800, 1000];
  const logTicks = [1, 10, 100, 1000];

  const fmt = (v: number) => (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2));

  return (
    <div className="widget">
      <div className="widget-title">
        {pick(language, "Widget A — Two Stacks", "위젯 A — 두 자")}
      </div>

      <div className="widget-readout">
        <div className="readout-row">
          <span className="readout-label">log₁₀(a)</span>
          <span className="readout-value">{Math.log10(a).toFixed(2)}</span>
        </div>
        <div className="readout-row">
          <span className="readout-label">log₁₀(b)</span>
          <span className="readout-value">{Math.log10(b).toFixed(2)}</span>
        </div>
        <div className="readout-row">
          <span className="readout-label">log₁₀(a) + log₁₀(b)</span>
          <span className="readout-value">{(Math.log10(a) + Math.log10(b)).toFixed(2)}</span>
        </div>
        <div className="readout-row readout-result">
          <span className="readout-label">a · b</span>
          <span className="readout-value readout-big">{fmt(product)}</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="widget-plot" role="img">
        {/* Top (linear) axis */}
        <line x1={PAD_L} y1={TOP_Y} x2={W - PAD_R} y2={TOP_Y} className="plot-axis" />
        <text x={PAD_L - 8} y={TOP_Y - 14} className="plot-tick" textAnchor="end">
          {pick(language, "linear", "선형")}
        </text>
        {linTicks.map((v) => (
          <g key={`lin-${v}`}>
            <line x1={xLin(v)} y1={TOP_Y - 4} x2={xLin(v)} y2={TOP_Y + 4} className="plot-axis" />
            <text x={xLin(v)} y={TOP_Y - 8} className="plot-tick" textAnchor="middle">
              {v}
            </text>
          </g>
        ))}

        {/* Bottom (log) axis */}
        <line x1={PAD_L} y1={BOT_Y} x2={W - PAD_R} y2={BOT_Y} className="plot-axis" />
        <text x={PAD_L - 8} y={BOT_Y + 18} className="plot-tick" textAnchor="end">
          {pick(language, "log₁₀", "log₁₀")}
        </text>
        {logTicks.map((v) => (
          <g key={`log-${v}`}>
            <line x1={xLog(v)} y1={BOT_Y - 4} x2={xLog(v)} y2={BOT_Y + 4} className="plot-axis" />
            <text x={xLog(v)} y={BOT_Y + 18} className="plot-tick" textAnchor="middle">
              {v}
            </text>
          </g>
        ))}

        {/* Connecting line: product on linear top to product on log bottom */}
        {product <= TOP_MAX && (
          <line
            x1={xLin(productClampedTop)}
            y1={TOP_Y}
            x2={xLog(productClampedLog)}
            y2={BOT_Y}
            className="plot-grid"
            strokeDasharray="3 3"
          />
        )}

        {/* a handle on log axis */}
        <line
          x1={xLog(a)}
          y1={BOT_Y - 28}
          x2={xLog(a)}
          y2={BOT_Y}
          className="plot-grid"
          strokeDasharray="2 3"
        />
        <text
          x={xLog(a)}
          y={BOT_Y - 32}
          className="plot-tick"
          textAnchor="middle"
          style={{ fill: "var(--acc)", fontWeight: 600 }}
        >
          a = {fmt(a)}
        </text>
        <circle cx={xLog(a)} cy={BOT_Y} r={6} style={{ fill: "var(--acc)" }} />

        {/* b handle on log axis */}
        <line
          x1={xLog(b)}
          y1={BOT_Y - 50}
          x2={xLog(b)}
          y2={BOT_Y}
          className="plot-grid"
          strokeDasharray="2 3"
        />
        <text
          x={xLog(b)}
          y={BOT_Y - 54}
          className="plot-tick"
          textAnchor="middle"
          style={{ fill: "var(--acc-deep)", fontWeight: 600 }}
        >
          b = {fmt(b)}
        </text>
        <circle cx={xLog(b)} cy={BOT_Y} r={6} style={{ fill: "var(--acc-deep)" }} />

        {/* a·b on log axis (sum of log-distances) */}
        {product >= 1 && product <= 1000 && (
          <>
            <circle
              cx={xLog(productClampedLog)}
              cy={BOT_Y}
              r={7}
              className="plot-dot"
              style={{ filter: "drop-shadow(0 0 4px var(--acc))" }}
            />
            <text
              x={xLog(productClampedLog)}
              y={BOT_Y + 36}
              className="plot-tick"
              textAnchor="middle"
              style={{ fontWeight: 600 }}
            >
              a·b = {fmt(product)}
            </text>
          </>
        )}

        {/* a·b on linear axis */}
        {product <= TOP_MAX && (
          <>
            <circle
              cx={xLin(productClampedTop)}
              cy={TOP_Y}
              r={7}
              className="plot-dot"
              style={{ filter: "drop-shadow(0 0 4px var(--acc))" }}
            />
            <text
              x={xLin(productClampedTop)}
              y={TOP_Y - 22}
              className="plot-tick"
              textAnchor="middle"
              style={{ fontWeight: 600 }}
            >
              a·b
            </text>
          </>
        )}

        {product > TOP_MAX && (
          <text
            x={W - PAD_R}
            y={TOP_Y - 22}
            className="plot-tick"
            textAnchor="end"
            style={{ fill: "var(--acc-deep)" }}
          >
            {pick(
              language,
              `a·b = ${fmt(product)} (off linear axis)`,
              `a·b = ${fmt(product)} (선형 축 밖)`,
            )}
          </text>
        )}
      </svg>

      <div className="widget-controls">
        <label className="ctrl">
          <span>
            <span className="swatch" style={{ background: "var(--acc)" }} aria-hidden />a
          </span>
          <input
            type="range"
            min={1}
            max={100}
            step={0.1}
            value={a}
            onChange={(e) => setA(+e.target.value)}
          />
          <span className="ctrl-val">{fmt(a)}</span>
        </label>
        <label className="ctrl">
          <span>
            <span className="swatch" style={{ background: "var(--acc-deep)" }} aria-hidden />b
          </span>
          <input
            type="range"
            min={1}
            max={100}
            step={0.1}
            value={b}
            onChange={(e) => setB(+e.target.value)}
          />
          <span className="ctrl-val">{fmt(b)}</span>
        </label>
      </div>

      <div className="widget-caption">
        {pick(
          language,
          <>
            Drag <b>a = 2</b> and <b>b = 3</b>. The marker lands on <b>6</b> — but you never
            multiplied. You added two log-distances. Drag <b>b</b> to <b>5</b>. The marker jumps to{" "}
            <b>10</b>. Same trick.
          </>,
          <>
            <b>a = 2</b>, <b>b = 3</b>으로 드래그. 마커가 <b>6</b>에 떨어진다 — 곱한 적은 한 번도
            없다. 두 로그 거리를 더했을 뿐. <b>b</b>를 <b>5</b>로 드래그하면 마커가 <b>10</b>으로
            점프. 같은 트릭.
          </>,
        )}
      </div>
    </div>
  );
}
