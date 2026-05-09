import { useContext, useEffect, useState } from "react";
import { Mafs, Coordinates, Plot, Point } from "mafs";
import { AppContext, type Language } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Spike widget — Same Curve?
// Three parametrizations of the same image (y = x², x ∈ [-1, 1]). Animating
// each with constant time spacing makes the speed differences visible as trail
// density. The crisis: three motions produce the same picture — so what *is*
// the curve?
//
// Mafs handles the static figure (axes, grid, parabola, live dot, trail dots).
// The animation timer + trail capture stay in React state — Mafs has no
// time-domain primitive, and the discrete-dots-at-constant-time mechanism is
// the entire pedagogical point (density = speed).

const ANIM_DURATION_MS = 3000;
const TRAIL_INTERVAL_MS = 50;

type ParamIdx = 0 | 1 | 2;

// Each parametrization maps u ∈ [0, 1] → (x, y) on y = x², x ∈ [-1, 1].
function gamma(idx: ParamIdx, u: number): [number, number] {
  if (idx === 0) {
    const s = 2 * u - 1;
    return [s, s * s];
  }
  if (idx === 1) {
    const s = 2 * u - 1;
    const x = s * s * s;
    return [x, x * x];
  }
  const x = Math.cos(2 * Math.PI * u);
  return [x, x * x];
}

const COLORS: Record<ParamIdx, string> = {
  0: "#b6451e", // --color-acc — terracotta
  1: "#7a2c10", // --color-acc-deep — burnt sienna
  2: "#2c6f4a", // --color-green — moss
};
const PARABOLA = "#9a8d75"; // muted, so trails read on top

const LABELS = {
  en: {
    title: "Spike — Same Curve?",
    g1: "γ₁: uniform x",
    g2: "γ₂: cubic",
    g3: "γ₃: round trip",
    g1formula: "(2u−1, (2u−1)²)",
    g2formula: "((2u−1)³, (2u−1)⁶)",
    g3formula: "(cos 2πu, cos² 2πu)",
    parameter: "u",
    reset: "reset",
    playing: "playing…",
    punchlineSetup: <>Three motions. One picture.</>,
    punchlineHit: <>The picture is not the curve.</>,
    helpIdle: "Click a γ to play. Drag u to scrub the dot manually.",
    helpRunning: "Animating — drag u or press reset to interrupt.",
    codeHeader: "code · why the naive form drops information",
    codeBody: `# What ONE function is "the curve"?
def curve(x): return x * x        # the image — no time

# curve(0) == 0. But did γ visit x=0 once, or twice?
#   γ₁: once.    γ₃: twice (out and back).
# 'curve' has no clock — it can't count visits.

# γ takes time as input.
g1 = lambda u: (2*u - 1, (2*u - 1)**2)            # uniform x
g3 = lambda u: (cos(2*pi*u), cos(2*pi*u)**2)      # round trip

# g3(0)=(1,1); g3(0.5)=(-1,1); g3(1)=(1,1)   # back to start.`,
  },
  ko: {
    title: "스파이크 — 같은 곡선인가?",
    g1: "γ₁: x 등속",
    g2: "γ₂: 세제곱",
    g3: "γ₃: 왕복",
    g1formula: "(2u−1, (2u−1)²)",
    g2formula: "((2u−1)³, (2u−1)⁶)",
    g3formula: "(cos 2πu, cos² 2πu)",
    parameter: "u",
    reset: "초기화",
    playing: "재생 중…",
    punchlineSetup: <>세 가지 움직임. 한 장의 그림.</>,
    punchlineHit: <>그림은 곡선이 아니다.</>,
    helpIdle: "γ를 눌러 재생. u를 끌어 점을 손으로 움직일 수도 있다.",
    helpRunning: "재생 중 — u를 끌거나 초기화하면 중단된다.",
    codeHeader: "code · 함수 형태가 정보를 잃는 이유",
    codeBody: `# "그 곡선"이 단 하나의 함수라면, 어떤 함수일까?
def curve(x): return x * x        # 이미지 — 시간 정보 없음

# curve(0) == 0. 그런데 γ가 x=0을 한 번 지나갔나, 두 번 지나갔나?
#   γ₁: 한 번.   γ₃: 두 번 (갔다가 되돌아옴).
# 'curve'에는 시계가 없다 — 방문 횟수를 셀 수 없다.

# γ는 시간을 입력으로 받는다.
g1 = lambda u: (2*u - 1, (2*u - 1)**2)            # x 등속
g3 = lambda u: (cos(2*pi*u), cos(2*pi*u)**2)      # 왕복

# g3(0)=(1,1); g3(0.5)=(-1,1); g3(1)=(1,1)   # 출발점으로 복귀.`,
  },
} as const;

type ButtonInfo = {
  idx: ParamIdx;
  label: string;
  formula: string;
};

type TrailPoint = {
  id: string;
  x: number;
  y: number;
};

const PILL_BASE =
  "inline-flex items-center gap-2 rounded-full border bg-bg-card px-3.5 py-1.5 font-mono text-[12.5px] transition disabled:cursor-not-allowed disabled:opacity-50";

export function SameCurve({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const mode = ctx?.mode ?? "general";
  const L = LABELS[language];

  const [active, setActive] = useState<ParamIdx>(0);
  const [u, setU] = useState(0);
  const [playing, setPlaying] = useState<ParamIdx | null>(null);
  const [trails, setTrails] = useState<Partial<Record<ParamIdx, TrailPoint[]>>>({});

  // Animation: when `playing` becomes a value, animate u from 0→1 over
  // ANIM_DURATION_MS, capturing trail points every TRAIL_INTERVAL_MS. On
  // completion, replace that parametrization's trail. On interrupt, the
  // partial trail is dropped.
  useEffect(() => {
    if (playing === null) return;
    const idx = playing;
    let rafId = 0;
    const startTime = performance.now();
    let lastTrailTime = startTime;
    let counter = 0;
    const runId = `${idx}-${startTime.toFixed(3)}`;
    const collected: TrailPoint[] = [];

    const addPoint = (uValue: number) => {
      const [x, y] = gamma(idx, uValue);
      collected.push({ id: `${runId}-${counter++}`, x, y });
    };

    addPoint(0);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const newU = Math.min(elapsed / ANIM_DURATION_MS, 1);
      setU(newU);

      if (now - lastTrailTime >= TRAIL_INTERVAL_MS) {
        addPoint(newU);
        lastTrailTime = now;
      }

      if (newU < 1) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      addPoint(1);
      setTrails((prev) => ({ ...prev, [idx]: collected }));
      setPlaying(null);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing]);

  function handlePlay(idx: ParamIdx) {
    if (playing !== null) return;
    setActive(idx);
    setU(0);
    setPlaying(idx);
  }

  function handleSlide(value: number) {
    if (playing !== null) setPlaying(null);
    setU(value);
  }

  function handleReset() {
    setPlaying(null);
    setU(0);
    setActive(0);
    setTrails({});
  }

  const [liveX, liveY] = gamma(active, u);
  const allPlayed = Boolean(trails[0] && trails[1] && trails[2]);

  const buttons: ButtonInfo[] = [
    { idx: 0, label: L.g1, formula: L.g1formula },
    { idx: 1, label: L.g2, formula: L.g2formula },
    { idx: 2, label: L.g3, formula: L.g3formula },
  ];

  return (
    <WidgetShell kicker={L.title}>
      <div className="my-3.5 mb-1.5 overflow-hidden rounded-md border border-rule bg-bg-card">
        <Mafs
          viewBox={{ x: [-1, 1], y: [0, 1] }}
          preserveAspectRatio={false}
          height={360}
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian />
          <Plot.OfX y={(x) => x * x} color={PARABOLA} weight={2} />

          {/* Only the active γ's trail is rendered. The other γ's trails stay
              in `trails` state so the ✓ marks and punchline keep working —
              the comparison happens in memory across sequential plays, not by
              piling all three onto the same image (which read as noise). */}
          {trails[active]?.map((pt) => (
            <Point
              key={pt.id}
              x={pt.x}
              y={pt.y}
              color={COLORS[active]}
              opacity={0.75}
              svgCircleProps={{ r: 4 }}
            />
          ))}

          <Point
            x={liveX}
            y={liveY}
            color={COLORS[active]}
            svgCircleProps={{
              r: 7,
              style: { filter: "drop-shadow(0 0 5px rgba(20,17,13,0.25))" },
            }}
          />
        </Mafs>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {buttons.map(({ idx, label, formula }) => {
          const isActive = active === idx;
          const isPlaying = playing === idx;
          const wasPlayed = Boolean(trails[idx]);
          return (
            <button
              key={idx}
              type="button"
              className={`${PILL_BASE} ${
                isActive
                  ? "bg-acc-soft text-acc-deep hover:text-acc-deep"
                  : "border-rule text-ink-soft hover:border-acc hover:text-acc"
              }`}
              onClick={() => handlePlay(idx)}
              disabled={playing !== null && !isPlaying}
              style={{
                borderColor: isActive ? COLORS[idx] : undefined,
              }}
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: COLORS[idx] }}
                aria-hidden
              />
              <span>{label}</span>
              <span className="text-[0.85em] opacity-65">{formula}</span>
              {wasPlayed && !isPlaying ? <span aria-hidden>✓</span> : null}
              {isPlaying ? <span className="opacity-70">· {L.playing}</span> : null}
            </button>
          );
        })}
        <button
          type="button"
          className={`${PILL_BASE} border-dashed border-rule text-ink-mute hover:border-solid hover:border-acc hover:text-acc`}
          onClick={handleReset}
          disabled={playing !== null}
        >
          {L.reset}
        </button>
      </div>

      <div className="mt-3.5 grid grid-cols-[80px_1fr_90px] items-center gap-3 text-[13.5px] max-md:grid-cols-[60px_1fr_70px]">
        <span className="font-mono text-xs text-ink-mute">{L.parameter}</span>
        <input
          type="range"
          className="w-full accent-acc"
          min={0}
          max={1}
          step={0.001}
          value={u}
          onChange={(e) => handleSlide(+e.target.value)}
        />
        <span className="text-right font-mono text-[12.5px] text-ink">{u.toFixed(3)}</span>
      </div>

      <div className="mt-3.5 border-t border-rule pt-3 text-[14.5px] text-ink-soft">
        {playing !== null ? L.helpRunning : L.helpIdle}
      </div>

      {allPlayed ? (
        <div className="mt-[18px] rounded-r-md border-l-4 border-acc bg-acc-soft px-[22px] py-[18px] text-base leading-[1.55] text-acc-deep">
          <span className="opacity-80">{L.punchlineSetup}</span> <b>{L.punchlineHit}</b>
        </div>
      ) : null}

      {mode === "code" ? (
        <div className="mt-[18px]">
          <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
            {L.codeHeader}
          </div>
          <pre className="overflow-x-auto rounded-md border border-rule bg-rule-soft px-4 py-3.5 font-mono text-[13.5px] leading-[1.5] text-ink-soft">
            {L.codeBody}
          </pre>
        </div>
      ) : null}
    </WidgetShell>
  );
}
