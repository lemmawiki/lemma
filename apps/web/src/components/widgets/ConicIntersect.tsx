import { useMemo, useState } from "react";
import { useApp, pick } from "../../context/AppContext";

// Widget — Two Conics, Four Intersections.
// Shows two conics on the plane and their (up to four) intersections, computed
// by eliminating y via the Sylvester resultant and solving the resulting
// quartic with Durand–Kerner. Toggles reveal the *complex* roots and the
// *multiplicity* of coincident ones, so the reader can see Bezout's count
// re-assembling into 4 every time.

// ── Conic data: a x² + b xy + c y² + d x + e y + k = 0 ───────────────────
type Conic = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  k: number;
};

type Preset = "general" | "tangent" | "disjoint" | "partial";

// All four presets use ellipses whose leading degree-2 forms are NOT
// proportional, so no Bezout count is "stolen" by points at infinity.
// Every count visible in the widget is a count of *finite* intersections.
const PRESETS: Record<Preset, { c1: Conic; c2: Conic }> = {
  // 4 real: two perpendicular ellipses.  x²/4 + y² = 1   and   x² + y²/4 = 1
  general: {
    c1: { a: 1 / 4, b: 0, c: 1, d: 0, e: 0, k: -1 },
    c2: { a: 1, b: 0, c: 1 / 4, d: 0, e: 0, k: -1 },
  },
  // 3 distinct real, one of multiplicity 2 at (0, -1).
  // x²/4 + y² = 1   and   x² + (y-1)²/4 = 1
  tangent: {
    c1: { a: 1 / 4, b: 0, c: 1, d: 0, e: 0, k: -1 },
    c2: { a: 1, b: 0, c: 1 / 4, d: 0, e: -1 / 2, k: -3 / 4 },
  },
  // 0 real, 4 complex: two ellipses far apart, different shape.
  // x²/4 + y² = 1   and   9x² + (y-5)² = 1
  disjoint: {
    c1: { a: 1 / 4, b: 0, c: 1, d: 0, e: 0, k: -1 },
    c2: { a: 9, b: 0, c: 1, d: 0, e: -10, k: 24 },
  },
  // 2 real + 2 complex: small narrow ellipse partially clipping the wide one.
  // x²/4 + y² = 1   and   9x² + (y-0.5)² = 1
  partial: {
    c1: { a: 1 / 4, b: 0, c: 1, d: 0, e: 0, k: -1 },
    c2: { a: 9, b: 0, c: 1, d: 0, e: -1, k: -3 / 4 },
  },
};

// ── Polynomial helpers (real coefficients, low degree, increasing-order) ──
type Poly = number[];

function polyAdd(p: Poly, q: Poly): Poly {
  const n = Math.max(p.length, q.length);
  const r: Poly = new Array(n).fill(0);
  for (let i = 0; i < n; i++) r[i] = (p[i] ?? 0) + (q[i] ?? 0);
  return r;
}
function polyScale(p: Poly, s: number): Poly {
  return p.map((c) => c * s);
}
function polySub(p: Poly, q: Poly): Poly {
  return polyAdd(p, polyScale(q, -1));
}
function polyMul(p: Poly, q: Poly): Poly {
  const r: Poly = new Array(p.length + q.length - 1).fill(0);
  for (let i = 0; i < p.length; i++) {
    for (let j = 0; j < q.length; j++) {
      r[i + j] += p[i] * q[j];
    }
  }
  return r;
}
function stripLeadingZeros(p: Poly, eps = 1e-10): Poly {
  let n = p.length;
  while (n > 1 && Math.abs(p[n - 1]) < eps) n--;
  return p.slice(0, n);
}

// ── Complex helpers ───────────────────────────────────────────────────────
type Cx = { re: number; im: number };
const C0: Cx = { re: 0, im: 0 };
const cAdd = (a: Cx, b: Cx): Cx => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a: Cx, b: Cx): Cx => ({ re: a.re - b.re, im: a.im - b.im });
const cMul = (a: Cx, b: Cx): Cx => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const cDiv = (a: Cx, b: Cx): Cx => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};
const cAbs = (z: Cx): number => Math.hypot(z.re, z.im);
const cSqrt = (z: Cx): Cx => {
  const r = Math.sqrt(cAbs(z));
  const phi = Math.atan2(z.im, z.re) / 2;
  return { re: r * Math.cos(phi), im: r * Math.sin(phi) };
};

function evalPolyAtCx(coeffs: Poly, z: Cx): Cx {
  let r: Cx = C0;
  for (let i = coeffs.length - 1; i >= 0; i--) {
    r = cAdd(cMul(r, z), { re: coeffs[i], im: 0 });
  }
  return r;
}

// Durand–Kerner: simultaneous all-roots solver. Reliable for low-degree
// polynomials with real coefficients; converges to all complex roots.
function solveAllRoots(coeffs: Poly): Cx[] {
  const stripped = stripLeadingZeros(coeffs);
  const n = stripped.length - 1;
  if (n <= 0) return [];
  const lead = stripped[n];
  const monic = stripped.map((c) => c / lead);
  const radius = 1 + Math.max(...monic.slice(0, -1).map((c) => Math.abs(c)));
  const roots: Cx[] = [];
  for (let i = 0; i < n; i++) {
    const phi = (2 * Math.PI * i) / n + 0.4;
    roots.push({ re: radius * Math.cos(phi), im: radius * Math.sin(phi) });
  }
  for (let iter = 0; iter < 80; iter++) {
    let maxDelta = 0;
    for (let i = 0; i < n; i++) {
      const num = evalPolyAtCx(monic, roots[i]);
      let den: Cx = { re: 1, im: 0 };
      for (let j = 0; j < n; j++) {
        if (j !== i) den = cMul(den, cSub(roots[i], roots[j]));
      }
      if (cAbs(den) < 1e-30) continue;
      const delta = cDiv(num, den);
      roots[i] = cSub(roots[i], delta);
      if (cAbs(delta) > maxDelta) maxDelta = cAbs(delta);
    }
    if (maxDelta < 1e-12) break;
  }
  return roots;
}

// ── Resultant of two conics in y → quartic in x ──────────────────────────
// Each conic, treated as a polynomial in y with coefficients depending on x:
//   C_i(x, y) = c_i · y² + (b_i x + e_i) · y + (a_i x² + d_i x + k_i)
// The Sylvester resultant in y of two such quadratics is:
//   R(x) = (A1 C2 − A2 C1)² − (A1 B2 − A2 B1)(B1 C2 − B2 C1)
// where A_i = c_i (poly degree 0), B_i = b_i x + e_i (degree 1),
//       C_i = a_i x² + d_i x + k_i (degree 2).
function conicResultant(c1: Conic, c2: Conic): Poly {
  const A1 = c1.c;
  const A2 = c2.c;
  const B1: Poly = [c1.e, c1.b];
  const B2: Poly = [c2.e, c2.b];
  const C1: Poly = [c1.k, c1.d, c1.a];
  const C2: Poly = [c2.k, c2.d, c2.a];
  const term1 = polySub(polyScale(C2, A1), polyScale(C1, A2));
  const term2 = polyMul(term1, term1);
  const term3 = polySub(polyScale(B2, A1), polyScale(B1, A2));
  const term4 = polySub(polyMul(B1, C2), polyMul(B2, C1));
  return polySub(term2, polyMul(term3, term4));
}

function evalConic(c: Conic, x: Cx, y: Cx): number {
  const x2 = cMul(x, x);
  const y2 = cMul(y, y);
  const xy = cMul(x, y);
  const v: Cx = {
    re: c.a * x2.re + c.b * xy.re + c.c * y2.re + c.d * x.re + c.e * y.re + c.k,
    im: c.a * x2.im + c.b * xy.im + c.c * y2.im + c.d * x.im + c.e * y.im,
  };
  return cAbs(v);
}

// Both y candidates from c1's quadratic in y at the given x.
function yCandidatesFromConic(c: Conic, x: Cx): [Cx, Cx] {
  const A: Cx = { re: c.c, im: 0 };
  const B: Cx = { re: c.b * x.re + c.e, im: c.b * x.im };
  const x2 = cMul(x, x);
  const C: Cx = {
    re: c.a * x2.re + c.d * x.re + c.k,
    im: c.a * x2.im + c.d * x.im,
  };
  const disc = cSub(cMul(B, B), cMul({ re: 4, im: 0 }, cMul(A, C)));
  const sq = cSqrt(disc);
  const negB: Cx = { re: -B.re, im: -B.im };
  const twoA: Cx = { re: 2 * A.re, im: 0 };
  return [cDiv(cAdd(negB, sq), twoA), cDiv(cSub(negB, sq), twoA)];
}

// ── Pair x-roots with the right y candidate ──────────────────────────────
// Each x root yields two y candidates from c1. If only one also satisfies c2,
// pick that one. If both do (y-symmetric case, e.g. x²/4 + y² = 1), the
// resultant has the x as a doubled root — Durand-Kerner returns two close
// x's that should map to the *two* different y values, not the same one.
type Intersection = {
  x: Cx;
  y: Cx;
  isReal: boolean;
  multiplicity: number;
};

function intersectConics(c1: Conic, c2: Conic): Intersection[] {
  const xRoots = solveAllRoots(conicResultant(c1, c2));
  const candidates = xRoots.map((x) => {
    const [y1, y2] = yCandidatesFromConic(c1, x);
    return [
      { y: y1, residual: evalConic(c2, x, y1) },
      { y: y2, residual: evalConic(c2, x, y2) },
    ];
  });

  // Initial pick: lowest-residual candidate per root.
  const picked: number[] = candidates.map((cs) => (cs[0].residual <= cs[1].residual ? 0 : 1));

  // Fix the y-symmetric case: when two x-roots cluster (same x, multiplicity ≥
  // 2 in the resultant) AND both candidates pass through c2, the two roots
  // must take the *two different* y candidates rather than collapsing onto one.
  const CLUSTER_EPS = 1e-2;
  const PASS_EPS = 1e-4;
  for (let i = 0; i < xRoots.length; i++) {
    for (let j = i + 1; j < xRoots.length; j++) {
      if (cAbs(cSub(xRoots[i], xRoots[j])) > CLUSTER_EPS) continue;
      if (picked[i] !== picked[j]) continue;
      const otherForJ = 1 - picked[j];
      if (candidates[j][otherForJ].residual < PASS_EPS) {
        picked[j] = otherForJ;
      }
    }
  }

  const points = xRoots.map((x, i) => ({ x, y: candidates[i][picked[i]].y }));

  // Group nearby (x, y) pairs into one Intersection with that multiplicity.
  const REAL_EPS = 1e-5;
  const SAME_EPS = 5e-3;
  const used = new Array(points.length).fill(false);
  const groups: Intersection[] = [];
  for (let i = 0; i < points.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    let mult = 1;
    for (let j = i + 1; j < points.length; j++) {
      if (used[j]) continue;
      const dx = cAbs(cSub(points[i].x, points[j].x));
      const dy = cAbs(cSub(points[i].y, points[j].y));
      if (dx < SAME_EPS && dy < SAME_EPS) {
        used[j] = true;
        mult++;
      }
    }
    const xi = points[i].x;
    const yi = points[i].y;
    const isReal = Math.abs(xi.im) < REAL_EPS && Math.abs(yi.im) < REAL_EPS;
    groups.push({
      x: isReal ? { re: xi.re, im: 0 } : xi,
      y: isReal ? { re: yi.re, im: 0 } : yi,
      isReal,
      multiplicity: mult,
    });
  }
  return groups;
}

// ── Render conic as a sampled polyline (screen space) ────────────────────
// Walks x left→right tracing the upper branch (+√), then right→left tracing
// the lower branch (−√), so an ellipse comes out as one continuous closed
// shape (visually).
function conicPath(
  c: Conic,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  toScreen: (x: number, y: number) => [number, number],
): string {
  const N = 240;
  const segments: [number, number][][] = [];
  let current: [number, number][] = [];

  const trace = (direction: 1 | -1) => {
    const start = direction === 1 ? 0 : N;
    const cmp = direction === 1 ? (i: number) => i <= N : (i: number) => i >= 0;
    for (let i = start; cmp(i); i += direction) {
      const x = xMin + ((xMax - xMin) * i) / N;
      const A = c.c;
      const B = c.b * x + c.e;
      const Ck = c.a * x * x + c.d * x + c.k;
      const disc = B * B - 4 * A * Ck;
      if (disc < 0 || A === 0) {
        if (current.length) segments.push(current);
        current = [];
        continue;
      }
      const root = (-B + direction * Math.sqrt(disc)) / (2 * A);
      if (root >= yMin && root <= yMax) {
        current.push(toScreen(x, root));
      } else {
        if (current.length) segments.push(current);
        current = [];
      }
    }
    if (current.length) segments.push(current);
    current = [];
  };

  trace(1);
  trace(-1);

  return segments
    .map((seg) =>
      seg
        .map(([sx, sy], i) => `${i === 0 ? "M" : "L"} ${sx.toFixed(2)} ${sy.toFixed(2)}`)
        .join(" "),
    )
    .join(" ");
}

// ── Per-preset bounds for the main canvas ────────────────────────────────
function viewBounds(preset: Preset): { xMin: number; xMax: number; yMin: number; yMax: number } {
  if (preset === "disjoint") return { xMin: -2.6, xMax: 2.6, yMin: -1.6, yMax: 6.4 };
  return { xMin: -2.6, xMax: 2.6, yMin: -1.7, yMax: 1.9 };
}

// ── Component ────────────────────────────────────────────────────────────
const W_PLOT = 460;
const H_PLOT = 360;
const W_SIDE = 220;
const H_SIDE = 220;
const PAD = 28;

const PRESET_LABELS: Record<Preset, { en: string; ko: string }> = {
  general: { en: "general", ko: "일반" },
  tangent: { en: "tangent", ko: "접" },
  disjoint: { en: "disjoint", ko: "분리" },
  partial: { en: "partial", ko: "부분" },
};

function pillClass(on: boolean): string {
  const base = "rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors";
  return on
    ? `${base} border-ink bg-ink text-bg`
    : `${base} border-rule bg-bg text-ink-soft hover:border-acc hover:text-acc`;
}

export function ConicIntersect() {
  const { language } = useApp();
  const [preset, setPreset] = useState<Preset>("general");
  const [showComplex, setShowComplex] = useState(false);
  const [showMult, setShowMult] = useState(false);

  const { c1, c2 } = PRESETS[preset];
  const intersections = useMemo(() => intersectConics(c1, c2), [c1, c2]);
  const bounds = viewBounds(preset);

  const realCount = intersections.filter((p) => p.isReal).reduce((s, p) => s + p.multiplicity, 0);
  const complexCount = intersections
    .filter((p) => !p.isReal)
    .reduce((s, p) => s + p.multiplicity, 0);
  const multHits = intersections.filter((p) => p.multiplicity > 1).length;
  const total = realCount + complexCount;

  const sx = (x: number) =>
    PAD + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * (W_PLOT - 2 * PAD);
  const sy = (y: number) =>
    H_PLOT - PAD - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * (H_PLOT - 2 * PAD);
  const toScreen = (x: number, y: number): [number, number] => [sx(x), sy(y)];

  const path1 = conicPath(c1, bounds.xMin, bounds.xMax, bounds.yMin, bounds.yMax, toScreen);
  const path2 = conicPath(c2, bounds.xMin, bounds.xMax, bounds.yMin, bounds.yMax, toScreen);

  const sideRange = preset === "disjoint" ? 2.5 : 1.5;
  const csx = (re: number) => W_SIDE / 2 + (re / sideRange) * (W_SIDE / 2 - PAD);
  const csy = (im: number) => H_SIDE / 2 - (im / sideRange) * (H_SIDE / 2 - PAD);

  const realPoints = intersections.filter((p) => p.isReal);
  const complexPoints = intersections.filter((p) => !p.isReal);

  return (
    <div className="mt-9 rounded-[10px] border border-rule bg-bg-card px-6 py-[22px]">
      <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute">
        {pick(language, "Widget — Two Conics, Four Intersections", "위젯 — 두 원뿔곡선, 네 교점")}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-2 rounded-md bg-rule-soft px-3.5 py-2.5 font-mono text-[13.5px]">
        <div className="flex justify-between gap-3">
          <span className="text-ink-mute">{pick(language, "real", "실수")}</span>
          <span className="font-medium text-ink">{realCount}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-ink-mute">{pick(language, "complex", "복소")}</span>
          <span className="font-medium text-ink">{complexCount}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-ink-mute">
            {pick(language, "with multiplicity > 1", "중복도 > 1")}
          </span>
          <span className="font-medium text-ink">{multHits}</span>
        </div>
        <div className="flex justify-between gap-3 border-t border-dashed border-rule pt-2">
          <span className="text-ink-mute">{pick(language, "total (Bezout)", "총합 (베주)")}</span>
          <span className="font-semibold text-acc">{total} = 2 · 2</span>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <svg
          viewBox={`0 0 ${W_PLOT} ${H_PLOT}`}
          role="img"
          aria-label={pick(language, "two conics on the plane", "평면 위 두 원뿔곡선")}
          className="block h-auto w-full max-w-[460px] flex-1 rounded-md border border-rule bg-plot-bg"
        >
          <rect
            x={PAD}
            y={PAD}
            width={W_PLOT - 2 * PAD}
            height={H_PLOT - 2 * PAD}
            className="plot-bg"
          />
          {[bounds.xMin, 0, bounds.xMax]
            .filter((v) => v >= bounds.xMin && v <= bounds.xMax)
            .map((v) => (
              <line
                key={`gx-${v}`}
                x1={sx(v)}
                y1={PAD}
                x2={sx(v)}
                y2={H_PLOT - PAD}
                className="plot-grid"
                strokeDasharray={v === 0 ? "" : "2,3"}
              />
            ))}
          {[bounds.yMin, 0, bounds.yMax]
            .filter((v) => v >= bounds.yMin && v <= bounds.yMax)
            .map((v) => (
              <line
                key={`gy-${v}`}
                x1={PAD}
                y1={sy(v)}
                x2={W_PLOT - PAD}
                y2={sy(v)}
                className="plot-grid"
                strokeDasharray={v === 0 ? "" : "2,3"}
              />
            ))}
          <path d={path1} fill="none" stroke="var(--color-acc)" strokeWidth={2} />
          <path d={path2} fill="none" stroke="#1e6da6" strokeWidth={2} />
          {realPoints.map((p) => {
            const cx = sx(p.x.re);
            const cy = sy(p.y.re);
            return (
              <g key={`r-${cx.toFixed(2)}-${cy.toFixed(2)}`}>
                <circle cx={cx} cy={cy} r={5.5} className="plot-dot" />
                {showMult && p.multiplicity > 1 && (
                  <text x={cx + 9} y={cy - 9} fontSize={13} fontWeight={600} className="fill-acc">
                    ×{p.multiplicity}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <svg
          viewBox={`0 0 ${W_SIDE} ${H_SIDE}`}
          role="img"
          aria-label={pick(language, "complex x-plane", "복소 x-평면")}
          className={`block h-auto w-full max-w-[220px] flex-none rounded-md border border-rule bg-plot-bg transition-opacity duration-200 ${
            showComplex ? "opacity-100" : "opacity-30"
          }`}
        >
          <rect
            x={PAD}
            y={PAD}
            width={W_SIDE - 2 * PAD}
            height={H_SIDE - 2 * PAD}
            className="plot-bg"
          />
          <line
            x1={PAD}
            y1={H_SIDE / 2}
            x2={W_SIDE - PAD}
            y2={H_SIDE / 2}
            className="plot-grid"
            strokeDasharray=""
          />
          <line
            x1={W_SIDE / 2}
            y1={PAD}
            x2={W_SIDE / 2}
            y2={H_SIDE - PAD}
            className="plot-grid"
            strokeDasharray=""
          />
          <text x={W_SIDE - PAD - 4} y={H_SIDE / 2 - 6} className="plot-tick">
            Re x
          </text>
          <text x={W_SIDE / 2 + 6} y={PAD + 10} className="plot-tick" textAnchor="start">
            Im x
          </text>
          {showComplex &&
            complexPoints.map((p) => {
              const cx = csx(p.x.re);
              const cy = csy(p.x.im);
              return (
                <circle
                  key={`c-${cx.toFixed(2)}-${cy.toFixed(2)}`}
                  cx={cx}
                  cy={cy}
                  r={5.5}
                  fill="none"
                  stroke="var(--color-acc)"
                  strokeWidth={1.6}
                />
              );
            })}
          <text x={W_SIDE / 2} y={H_SIDE - 6} textAnchor="middle" className="plot-tick">
            {pick(language, "complex x-plane", "복소 x-평면")}
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(PRESETS) as Preset[]).map((p) => (
          <button key={p} className={pillClass(preset === p)} onClick={() => setPreset(p)}>
            {pick(language, PRESET_LABELS[p].en, PRESET_LABELS[p].ko)}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button className={pillClass(showComplex)} onClick={() => setShowComplex((v) => !v)}>
          {pick(language, "show complex", "복소 보기")}
        </button>
        <button className={pillClass(showMult)} onClick={() => setShowMult((v) => !v)}>
          {pick(language, "show multiplicity", "중복도 표시")}
        </button>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:font-semibold [&_b]:text-ink [&_em]:italic [&_em]:text-acc">
        {pick(
          language,
          <>
            Try the four presets in order. <b>General</b> gives 4 real intersections (Bezout
            satisfied without help). <b>Tangent</b> drops to 3 visible — turn on{" "}
            <em>show multiplicity</em>: the tangent point counts twice. <b>Disjoint</b> gives 0
            visible — turn on <em>show complex</em>: the four intersections live off the real plane.{" "}
            <b>Partial</b> mixes both fixes. Every preset totals 4.
          </>,
          <>
            네 프리셋을 순서대로 눌러보자. <b>일반</b>은 4개의 실수 교점 (베주가 도움 없이 성립).{" "}
            <b>접</b>은 3개로 떨어져 보인다 — <em>중복도 표시</em>를 켜면 접점이 두 번으로 센다.{" "}
            <b>분리</b>는 0개로 보인다 — <em>복소 보기</em>를 켜면 네 교점이 실평면 바깥에 있는 게
            드러난다. <b>부분</b>은 두 보정이 섞인다. 모든 프리셋의 총합은 4.
          </>,
        )}
      </div>
    </div>
  );
}
