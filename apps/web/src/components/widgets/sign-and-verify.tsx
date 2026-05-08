import { useMemo, useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Toy curve E: y² = x³ + 7  over F_17.
// Same a=0, b=7 as secp256k1, with a microscopic prime so the entire
// subgroup of the generator G = (1, 5) has just 9 elements: G, 2G, …, 8G, O.
// All ECDSA arithmetic below runs inside this 9-element subgroup so users
// can verify every step on paper.
const FP = 17;
const A = 0;
const B = 7;
const N = 9; // order of G — chosen so 9G = O
const GX = 1;
const GY = 5;

function mod(a: number, m: number): number {
  return ((a % m) + m) % m;
}

// Modular inverse via extended Euclidean. Caller must ensure gcd(a, m) = 1.
function modInv(a: number, m: number): number {
  let [oldR, r] = [mod(a, m), m];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return mod(oldS, m);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

type Point = { inf: true } | { inf: false; x: number; y: number };
const O: Point = { inf: true };
const finite = (x: number, y: number): Point => ({ inf: false, x: mod(x, FP), y: mod(y, FP) });

function eq(P: Point, Q: Point): boolean {
  if (P.inf && Q.inf) return true;
  if (P.inf || Q.inf) return false;
  return P.x === Q.x && P.y === Q.y;
}

function add(P: Point, Q: Point): Point {
  if (P.inf) return Q;
  if (Q.inf) return P;
  if (P.x === Q.x && mod(P.y + Q.y, FP) === 0) return O;
  let lambda: number;
  if (eq(P, Q)) {
    const num = mod(3 * P.x * P.x + A, FP);
    const den = modInv(mod(2 * P.y, FP), FP);
    lambda = mod(num * den, FP);
  } else {
    const num = mod(Q.y - P.y, FP);
    const den = modInv(mod(Q.x - P.x, FP), FP);
    lambda = mod(num * den, FP);
  }
  const xR = mod(lambda * lambda - P.x - Q.x, FP);
  const yR = mod(lambda * (P.x - xR) - P.y, FP);
  return finite(xR, yR);
}

function scalarMul(k: number, P: Point): Point {
  let result: Point = O;
  let addend = P;
  let kk = mod(k, N);
  while (kk > 0) {
    if (kk & 1) result = add(result, addend);
    addend = add(addend, addend);
    kk >>= 1;
  }
  return result;
}

const G: Point = finite(GX, GY);

// Enumerate every affine point on the curve once, used to draw the backdrop.
const ALL_AFFINE: Point[] = (() => {
  const pts: Point[] = [];
  for (let x = 0; x < FP; x++) {
    const rhs = mod(x * x * x + A * x + B, FP);
    for (let y = 0; y < FP; y++) {
      if (mod(y * y, FP) === rhs) pts.push(finite(x, y));
    }
  }
  return pts;
})();

// G's subgroup, as an ordered list — index `i` is iG (1..N-1), plus O at the
// end for completeness. Membership test uses x-coordinate equality.
const SUBGROUP_AFFINE: Point[] = (() => {
  const pts: Point[] = [];
  for (let i = 1; i < N; i++) pts.push(scalarMul(i, G));
  return pts;
})();

type Sig = { r: number; s: number };

function sign(d: number, h: number, k: number): Sig | { error: string } {
  if (gcd(k, N) !== 1) return { error: "k_not_coprime" };
  const R = scalarMul(k, G);
  if (R.inf) return { error: "R_inf" };
  const r = mod(R.x, N);
  if (r === 0) return { error: "r_zero" };
  const kInv = modInv(k, N);
  const s = mod((h + r * d) * kInv, N);
  if (s === 0) return { error: "s_zero" };
  return { r, s };
}

type VerifyResult = {
  u1: number;
  u2: number;
  u1G: Point;
  u2Q: Point;
  V: Point;
  matches: boolean;
};

function verify(h: number, sig: Sig, Q: Point): VerifyResult {
  const sInv = modInv(sig.s, N);
  const u1 = mod(h * sInv, N);
  const u2 = mod(sig.r * sInv, N);
  const u1G = scalarMul(u1, G);
  const u2Q = scalarMul(u2, Q);
  const V = add(u1G, u2Q);
  const matches = !V.inf && mod(V.x, N) === sig.r;
  return { u1, u2, u1G, u2Q, V, matches };
}

function ptStr(P: Point): string {
  return P.inf ? "O" : `(${P.x}, ${P.y})`;
}

// SVG layout — a 17x17 grid in field coordinates with margin for axis ticks.
const PLOT_W = 380;
const PLOT_H = 380;
const PLOT_PAD = 36;
const CELL = (PLOT_W - PLOT_PAD * 2) / (FP - 1);
const sx = (x: number) => PLOT_PAD + x * CELL;
const sy = (y: number) => PLOT_H - PLOT_PAD - y * CELL;

const COLOR = {
  G: "#1e6da6", // blue
  Q: "#b6451e", // accent-deep
  R: "#7a5c2c", // brown / nonce
  V: "#3a8c4a", // green
} as const;

const SLIDER = {
  d: { min: 1, max: N - 1, step: 1 },
  h: { min: 0, max: N - 1, step: 1 },
  k: { min: 1, max: N - 1, step: 1 },
};

export function SignAndVerify() {
  const { language } = useApp();
  const [d, setD] = useState(5);
  const [h, setH] = useState(3);
  const [k, setK] = useState(7);
  const [showVerify, setShowVerify] = useState(true);

  const Q = useMemo(() => scalarMul(d, G), [d]);
  const R = useMemo(() => scalarMul(k, G), [k]);
  const sigOrErr = useMemo(() => sign(d, h, k), [d, h, k]);
  const sig = "error" in sigOrErr ? null : sigOrErr;
  const ver = useMemo(() => (sig ? verify(h, sig, Q) : null), [sig, h, Q]);

  const kInvalid = "error" in sigOrErr;

  const subgroupSet = useMemo(
    () => new Set(SUBGROUP_AFFINE.map((p) => (p.inf ? "O" : `${p.x},${p.y}`))),
    [],
  );
  const isSubgroupMember = (p: Point) => (p.inf ? true : subgroupSet.has(`${p.x},${p.y}`));

  // Highlights with collision-aware label offsets.
  type Highlight = { name: string; pt: Point; color: string; show: boolean };
  const highlights: Highlight[] = [
    { name: "G", pt: G, color: COLOR.G, show: true },
    { name: `Q=${d}G`, pt: Q, color: COLOR.Q, show: !Q.inf },
    { name: `R=${k}G`, pt: R, color: COLOR.R, show: !R.inf },
    {
      name: "V",
      pt: ver?.V ?? O,
      color: COLOR.V,
      show: showVerify && !!ver && !ver.V.inf,
    },
  ];

  const bgPoints = ALL_AFFINE.filter((p) => !p.inf);

  return (
    <WidgetShell kicker={pick(language, "Widget — Sign & verify", "위젯 — 서명 & 검증")}>
      <div
        role="status"
        aria-live="polite"
        className="mb-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12.5px]"
      >
        <span>
          <span className="text-ink-mute">{pick(language, "curve", "곡선")} · </span>
          <span className="text-ink">y² = x³ + 7 (mod 17)</span>
        </span>
        <span>
          <span className="text-ink-mute">{pick(language, "generator", "생성점")} · </span>
          <span className="text-ink">G = (1, 5)</span>
        </span>
        <span>
          <span className="text-ink-mute">{pick(language, "order", "차수")} · </span>
          <span className="text-ink">n = 9</span>
        </span>
      </div>

      <div className="grid gap-5 max-md:gap-4 md:grid-cols-[380px_1fr]">
        {/* Plot */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
            width="100%"
            style={{ display: "block", maxWidth: PLOT_W }}
            role="img"
            aria-label={pick(
              language,
              "elliptic curve points over F_17",
              "F_17 위의 타원곡선 점들",
            )}
          >
            <rect
              x={PLOT_PAD - 6}
              y={PLOT_PAD - 6}
              width={PLOT_W - 2 * PLOT_PAD + 12}
              height={PLOT_H - 2 * PLOT_PAD + 12}
              rx={6}
              className="fill-bg-card stroke-rule"
              strokeWidth={1}
            />
            {/* light grid lines every 4 */}
            {[0, 4, 8, 12, 16].map((v) => (
              <g key={`grid-${v}`}>
                <line
                  x1={sx(v)}
                  y1={PLOT_PAD - 4}
                  x2={sx(v)}
                  y2={PLOT_H - PLOT_PAD + 4}
                  className="stroke-rule"
                  strokeWidth={0.6}
                  strokeDasharray="2 3"
                />
                <line
                  x1={PLOT_PAD - 4}
                  y1={sy(v)}
                  x2={PLOT_W - PLOT_PAD + 4}
                  y2={sy(v)}
                  className="stroke-rule"
                  strokeWidth={0.6}
                  strokeDasharray="2 3"
                />
                <text
                  x={sx(v)}
                  y={PLOT_H - PLOT_PAD + 18}
                  textAnchor="middle"
                  className="fill-ink-mute"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
                >
                  {v}
                </text>
                <text
                  x={PLOT_PAD - 12}
                  y={sy(v) + 3}
                  textAnchor="end"
                  className="fill-ink-mute"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
                >
                  {v}
                </text>
              </g>
            ))}
            {/* All affine points: subgroup darker, off-subgroup lighter */}
            {bgPoints.map((p) => {
              if (p.inf) return null;
              const inG = isSubgroupMember(p);
              return (
                <circle
                  key={`bg-${p.x}-${p.y}`}
                  cx={sx(p.x)}
                  cy={sy(p.y)}
                  r={3}
                  className={inG ? "fill-ink-mute" : "fill-rule"}
                  opacity={inG ? 0.55 : 0.35}
                />
              );
            })}
            {/* Highlights */}
            {highlights
              .filter((h_) => h_.show && !h_.pt.inf)
              .map((h_) => {
                const p = h_.pt as { inf: false; x: number; y: number };
                return (
                  <g key={h_.name}>
                    <circle
                      cx={sx(p.x)}
                      cy={sy(p.y)}
                      r={7}
                      fill={h_.color}
                      stroke="white"
                      strokeWidth={1.5}
                    />
                    <text
                      x={sx(p.x) + 9}
                      y={sy(p.y) - 8}
                      className="fill-ink"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
                    >
                      {h_.name}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>

        {/* Computation panels */}
        <div className="grid gap-4 self-start font-mono text-[13px]">
          {/* Signer */}
          <div className="rounded-md border border-rule px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-ink-mute">
              <span
                className="inline-block h-2 w-2 rounded-sm"
                style={{ background: COLOR.Q }}
                aria-hidden
              />
              {pick(language, "signer · knows d", "서명자 · d를 알고 있음")}
            </div>
            <Slider
              label={pick(language, "private key d", "개인키 d")}
              value={d}
              onChange={setD}
              cfg={SLIDER.d}
              accent={COLOR.Q}
            />
            <Slider
              label={pick(language, "message hash h", "메시지 해시 h")}
              value={h}
              onChange={setH}
              cfg={SLIDER.h}
              accent="var(--ink)"
            />
            <Slider
              label={pick(language, "nonce k", "nonce k")}
              value={k}
              onChange={setK}
              cfg={SLIDER.k}
              accent={COLOR.R}
              warn={
                kInvalid
                  ? pick(language, "k must be coprime to n=9", "k는 n=9와 서로소여야 함")
                  : null
              }
            />
            <div className="mt-3 grid gap-1 text-[12.5px]">
              <Row label={`Q = ${d}G`} value={ptStr(Q)} color={COLOR.Q} />
              <Row label={`R = ${k}G`} value={ptStr(R)} color={COLOR.R} />
              {sig && (
                <>
                  <Row label="r = R.x mod 9" value={String(sig.r)} />
                  <Row label="s = (h + r·d)·k⁻¹ mod 9" value={String(sig.s)} />
                  <div className="mt-1 border-t border-rule pt-2 text-ink">
                    {pick(language, "signature ", "서명 ")}
                    <span className="font-semibold">
                      (r, s) = ({sig.r}, {sig.s})
                    </span>
                  </div>
                </>
              )}
              {!sig && (
                <div className="mt-1 border-t border-rule pt-2 text-acc-deep">
                  {pick(
                    language,
                    "no valid signature for this k — pick another",
                    "이 k로는 서명 불가 — 다른 값",
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Verifier */}
          <div className="rounded-md border border-rule px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-ink-mute">
              <span
                className="inline-block h-2 w-2 rounded-sm"
                style={{ background: COLOR.V }}
                aria-hidden
              />
              {pick(language, "verifier · only knows h, (r, s), Q", "검증자 · h, (r, s), Q만 앎")}
              <button
                type="button"
                onClick={() => setShowVerify((v) => !v)}
                className="ml-auto rounded-full border border-rule px-2 py-0.5 text-[10.5px] uppercase tracking-[0.06em] text-ink-mute hover:border-acc hover:text-acc"
              >
                {showVerify ? pick(language, "hide", "숨김") : pick(language, "show", "보기")}
              </button>
            </div>
            {showVerify && sig && ver && (
              <div className="grid gap-1 text-[12.5px]">
                <Row label="u₁ = h·s⁻¹ mod 9" value={String(ver.u1)} />
                <Row label="u₂ = r·s⁻¹ mod 9" value={String(ver.u2)} />
                <Row label={`u₁G + u₂Q = V`} value={ptStr(ver.V)} color={COLOR.V} />
                <div className="mt-1 border-t border-rule pt-2">
                  <span className="text-ink">V.x mod 9 = {ver.V.inf ? "—" : mod(ver.V.x, N)}</span>
                  <span className="mx-2 text-ink-mute">·</span>
                  <span className="text-ink">r = {sig.r}</span>
                  <span
                    className="ml-3 font-semibold"
                    style={{ color: ver.matches ? COLOR.V : COLOR.Q }}
                  >
                    {ver.matches ? "✓ valid" : "✗ invalid"}
                  </span>
                </div>
              </div>
            )}
            {showVerify && !sig && (
              <div className="text-[12.5px] text-ink-mute">
                {pick(language, "(no signature to verify)", "(검증할 서명 없음)")}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Drag <b>d</b> — only <b>Q</b> moves on the plot, never <b>G</b>. Anyone can compute{" "}
            <span className="font-mono">{`${d}G`}</span> from <b>d</b>; nobody can recover <b>d</b>{" "}
            from <span className="font-mono">{`Q = ${ptStr(Q)}`}</span> without trying every{" "}
            multiple. That's the one-way street the signature stands on. Drag <b>h</b> or <b>k</b>{" "}
            and watch <em>both sides agree</em>: the verifier never asks for <b>d</b> and yet
            arrives at <b>V = R</b>, so <span className="font-mono">V.x ≡ r</span>.
          </>,
          <>
            <b>d</b>를 끌면 <b>Q</b>만 움직이고 <b>G</b>는 그대로다. 누구나 <b>d</b>로{" "}
            <span className="font-mono">{`${d}G`}</span>를 계산할 수 있지만, 모든 배수를 다 시도하지
            않고는 <span className="font-mono">{`Q = ${ptStr(Q)}`}</span>에서 <b>d</b>를 복구할 수
            없다. 서명이 서 있는 그 일방통행. <b>h</b>나 <b>k</b>를 끌어보면{" "}
            <em>양쪽이 맞아 떨어진다</em>: 검증자는 <b>d</b>를 묻지 않고도 <b>V = R</b>에 도달하고,
            따라서 <span className="font-mono">V.x ≡ r</span>이 된다.
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
  cfg,
  accent,
  warn,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  cfg: { min: number; max: number; step: number };
  accent: string;
  warn?: string | null;
}) {
  return (
    <label className="mt-2 grid grid-cols-[140px_1fr_40px] items-center gap-3 max-md:grid-cols-[100px_1fr_36px]">
      <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-mute">
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-sm"
          style={{ background: accent }}
          aria-hidden
        />
        {label}
      </span>
      <input
        type="range"
        className="w-full"
        style={{ accentColor: accent }}
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <span className="text-right text-[12.5px] text-ink">{value}</span>
      {warn && <span className="col-span-3 mt-0.5 text-[11.5px] text-acc-deep">⚠ {warn}</span>}
    </label>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-3">
      <span className="text-ink-mute">{label}</span>
      <span className="text-ink" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}
