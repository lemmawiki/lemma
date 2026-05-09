import { useEffect, useMemo } from "react";
import { useApp, pick } from "../context/app-context";
import { Link } from "../lib/router";
import { applications, PILLAR_LABEL, type Pillar } from "../data/applications";
import { modules } from "../data/modules";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const MONO = "font-mono text-[0.93em]";

// Stable per-module color palette. Module color is inherited by every edge
// that lands on that module, so a quick scan shows "all the orange edges
// converge here" — that *is* the module's reuse story, made visible.
const MODULE_COLOR: Record<string, string> = {
  "parametric-curves": "#b6451e",
  derivatives: "#3a8c4a",
  log: "#1e6da6",
  bezout: "#9a7a1a",
  linearization: "#7a4ea0",
  vectors: "#2c8a8c",
  entropy: "#a83b80",
};
const ORPHAN_COLOR = "#9ca3a4";
const PILLAR_ORDER: Pillar[] = ["graphics", "physics", "ml", "finance"];

const SVG_W = 820;
const NODE_W = 220;
const NODE_H = 56;
const NODE_GAP = 14;
const PILLAR_HEADER_H = 26;
const PILLAR_GAP = 22;
const TOP_PAD = 30;
const COL_LEFT_X = 130; // app column center
const COL_RIGHT_X = 600; // module column center

type AppNode = { kind: "app"; id: string; pillar: Pillar; title: string; href: string; y: number };
type ModNode = {
  kind: "mod";
  id: string;
  title: string;
  href: string;
  y: number;
  consumers: number;
  pillarsReached: Pillar[];
  color: string;
};
type Edge = { from: string; to: string; color: string };

function moduleColor(id: string): string {
  return MODULE_COLOR[id] ?? ORPHAN_COLOR;
}

// Stable, data-derived offsets for the consumer-count dots — using the
// offset itself as the React key satisfies the no-array-index-key rule
// while keeping the same visual.
function dotPositions(count: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(-i * 9);
  return out;
}

// Build the graph layout: applications in pillar groups on the left,
// modules ordered by consumer count on the right. Returns positioned
// nodes and the edges that connect them.
function buildLayout(language: "en" | "ko") {
  const apps = applications.filter((a) => a.status === "available");
  const mods = modules.filter((m) => m.status === "available");

  // Module → consumer apps (preserves applications.ts order).
  const consumersByModule = new Map<string, typeof apps>();
  for (const a of apps) {
    for (const m of a.modules) {
      const list = consumersByModule.get(m) ?? [];
      list.push(a);
      consumersByModule.set(m, list);
    }
  }

  // Apps grouped by pillar in PILLAR_ORDER, preserving applications.ts order.
  const appsByPillar = new Map<Pillar, typeof apps>();
  for (const p of PILLAR_ORDER) appsByPillar.set(p, []);
  for (const a of apps) appsByPillar.get(a.pillar)?.push(a);
  const appsByPillarOrdered = PILLAR_ORDER.filter((p) => (appsByPillar.get(p)?.length ?? 0) > 0);

  // Lay out apps on the left, with a small pillar header before each group.
  const appNodes: AppNode[] = [];
  let cursorY = TOP_PAD;
  for (const p of appsByPillarOrdered) {
    cursorY += PILLAR_HEADER_H;
    for (const a of appsByPillar.get(p) ?? []) {
      appNodes.push({
        kind: "app",
        id: a.id,
        pillar: a.pillar,
        title: a.title[language],
        href: a.href,
        y: cursorY,
      });
      cursorY += NODE_H + NODE_GAP;
    }
    cursorY += PILLAR_GAP - NODE_GAP;
  }
  const appsBottomY = cursorY;

  // Lay out modules on the right, ordered by consumer count desc, then
  // alphabetical id for stability.
  const sortedMods = mods.slice().sort((a, b) => {
    const ca = consumersByModule.get(a.id)?.length ?? 0;
    const cb = consumersByModule.get(b.id)?.length ?? 0;
    if (cb !== ca) return cb - ca;
    return a.id.localeCompare(b.id);
  });
  const modNodes: ModNode[] = [];
  cursorY = TOP_PAD;
  for (const m of sortedMods) {
    const consumers = consumersByModule.get(m.id) ?? [];
    const pillarsReached = Array.from(new Set(consumers.map((c) => c.pillar)));
    modNodes.push({
      kind: "mod",
      id: m.id,
      title: m.title[language],
      href: m.href,
      y: cursorY,
      consumers: consumers.length,
      pillarsReached,
      color: moduleColor(m.id),
    });
    cursorY += NODE_H + NODE_GAP;
  }
  const modsBottomY = cursorY;

  const svgH = Math.max(appsBottomY, modsBottomY) + 8;

  // Edges: for each app, one edge to each module it consumes.
  // Color = the target module's color.
  const edges: Edge[] = [];
  for (const a of apps) {
    for (const mid of a.modules) {
      edges.push({ from: a.id, to: mid, color: moduleColor(mid) });
    }
  }

  return {
    appNodes,
    modNodes,
    edges,
    svgH,
    pillarOrder: appsByPillarOrdered,
    appsByPillar,
    edgeCount: edges.length,
    multiConsumerCount: sortedMods.filter((m) => (consumersByModule.get(m.id)?.length ?? 0) >= 2)
      .length,
  };
}

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="mt-7 font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
      <Link to="/">Lemma</Link>
      <span className="mx-2 text-rule">/</span>
      <span className="uppercase tracking-[0.06em] text-ink">
        {pick(language, "graph · what reuses what", "그래프 · 무엇이 무엇을 재사용하는가")}
      </span>
    </nav>
  );
}

function Hero({
  appCount,
  modCount,
  edgeCount,
  multiCount,
}: {
  appCount: number;
  modCount: number;
  edgeCount: number;
  multiCount: number;
}) {
  const { language } = useApp();
  return (
    <section className="mb-9 mt-12">
      <div className={KICKER}>{pick(language, "modular graph", "모듈 그래프")}</div>
      <h1 className="m-0 mb-5 font-serif text-[36px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[26px]">
        {pick(
          language,
          <>The promise the manifesto made — drawn in real edges.</>,
          <>매니페스토가 한 약속 — 진짜 엣지로 그린다.</>,
        )}
      </h1>
      <p className="m-0 max-w-[680px] font-serif text-[18px] leading-[1.55] text-ink-soft [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Lemma claims a <em>modular graph, not a sequence</em>. Today the claim is paid:{" "}
            <b>{appCount} applications</b> consume <b>{modCount} modules</b> along{" "}
            <b>{edgeCount} edges</b>, and{" "}
            <b>
              {multiCount} of {modCount} modules
            </b>{" "}
            have more than one consumer. Each module gets a colour; every edge into a module
            inherits it, so the picture below is also the answer to{" "}
            <em>"which math is doing the most work for the most pillars?"</em>
          </>,
          <>
            Lemma는 <em>시퀀스가 아닌 모듈 그래프</em>를 표방한다. 오늘 그 약속이 결제됐다:{" "}
            <b>응용 {appCount}개</b>가 <b>모듈 {modCount}개</b>를 <b>엣지 {edgeCount}개</b>로
            소비하고,{" "}
            <b>
              {modCount}개 모듈 중 {multiCount}개
            </b>
            는 소비자가 둘 이상이다. 각 모듈은 고유 색을 가지고, 그 모듈로 들어오는 모든 엣지가 그
            색을 상속한다 — 그래서 아래 그림은{" "}
            <em>"어느 수학이 어느 필러들에서 가장 많이 일하는가?"</em>의 답이기도 하다.
          </>,
        )}
      </p>
    </section>
  );
}

function Snapshot({
  appCount,
  modCount,
  modConsumed,
  edgeCount,
  multiCount,
}: {
  appCount: number;
  modCount: number;
  modConsumed: number;
  edgeCount: number;
  multiCount: number;
}) {
  const { language } = useApp();
  return (
    <section className="mb-9">
      <div className={KICKER}>{pick(language, "snapshot", "스냅샷")}</div>
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
        <Stat big={`${appCount}`} label={pick(language, "applications", "응용")} />
        <Stat
          big={`${modConsumed}/${modCount}`}
          label={pick(language, "modules consumed", "모듈 소비됨")}
        />
        <Stat big={`${edgeCount}`} label={pick(language, "edges", "엣지")} />
        <Stat
          big={`${multiCount}/${modCount}`}
          label={pick(language, "multi-consumer modules", "다중 소비 모듈")}
        />
      </div>
    </section>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div className="rounded-[10px] border border-rule bg-bg-card p-4 text-center">
      <div className="font-serif text-[28px] font-semibold leading-none text-acc [font-feature-settings:'lnum']">
        {big}
      </div>
      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
        {label}
      </div>
    </div>
  );
}

function GraphSvg() {
  const { language } = useApp();
  const layout = useMemo(() => buildLayout(language), [language]);
  const { appNodes, modNodes, edges, svgH, pillarOrder, appsByPillar } = layout;

  const appById = new Map(appNodes.map((n) => [n.id, n]));
  const modById = new Map(modNodes.map((n) => [n.id, n]));

  // Edge endpoints: from right side of app box to left side of module box.
  function edgePath(e: Edge): string | null {
    const a = appById.get(e.from);
    const m = modById.get(e.to);
    if (!a || !m) return null;
    const x1 = COL_LEFT_X + NODE_W / 2;
    const y1 = a.y + NODE_H / 2;
    const x2 = COL_RIGHT_X - NODE_W / 2;
    const y2 = m.y + NODE_H / 2;
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  }

  // Pillar header position = the y of the first app in that pillar minus PILLAR_HEADER_H/2.
  function pillarHeaderY(p: Pillar): number {
    const first = appsByPillar.get(p)?.[0];
    if (!first) return 0;
    const node = appById.get(first.id);
    if (!node) return 0;
    return node.y - PILLAR_HEADER_H / 2 - 4;
  }

  return (
    <section className="mt-2">
      <div className={KICKER}>{pick(language, "the graph", "그래프")}</div>
      <div className="overflow-x-auto rounded-[10px] border border-rule bg-bg-card p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${svgH}`}
          width="100%"
          style={{ display: "block", minWidth: 720 }}
          role="img"
          aria-label={pick(language, "Lemma application-module graph", "Lemma 응용-모듈 그래프")}
        >
          {/* Column headers */}
          <text
            x={COL_LEFT_X}
            y={16}
            textAnchor="middle"
            className="fill-ink-mute"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}
          >
            {pick(language, "APPLICATIONS", "응용").toUpperCase()}
          </text>
          <text
            x={COL_RIGHT_X}
            y={16}
            textAnchor="middle"
            className="fill-ink-mute"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}
          >
            {pick(language, "MODULES (sorted by reuse)", "모듈 (재사용 순)").toUpperCase()}
          </text>

          {/* Pillar headers */}
          {pillarOrder.map((p) => (
            <text
              key={`pillar-${p}`}
              x={COL_LEFT_X - NODE_W / 2}
              y={pillarHeaderY(p)}
              className="fill-ink-mute"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {PILLAR_LABEL[p][language]}
            </text>
          ))}

          {/* Edges — drawn first so node boxes paint on top */}
          {edges.map((e) => {
            const d = edgePath(e);
            if (!d) return null;
            return (
              <path
                key={`${e.from}->${e.to}`}
                d={d}
                fill="none"
                stroke={e.color}
                strokeWidth={1.6}
                opacity={0.78}
              />
            );
          })}

          {/* Application nodes */}
          {appNodes.map((n) => (
            <a key={`app-${n.id}`} href={n.href}>
              <g
                transform={`translate(${COL_LEFT_X - NODE_W / 2}, ${n.y})`}
                className="[&>rect]:transition-colors [&:hover>rect]:stroke-acc"
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  className="fill-bg stroke-rule"
                  strokeWidth={1.4}
                />
                <text
                  x={14}
                  y={22}
                  className="fill-ink"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {n.title.length > 26 ? n.title.slice(0, 25) + "…" : n.title}
                </text>
                <text
                  x={14}
                  y={42}
                  className="fill-ink-mute"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.06em",
                  }}
                >
                  {PILLAR_LABEL[n.pillar][language]}
                </text>
              </g>
            </a>
          ))}

          {/* Module nodes */}
          {modNodes.map((n) => {
            const emphasized = n.consumers >= 2;
            const orphan = n.consumers === 0;
            return (
              <a key={`mod-${n.id}`} href={n.href}>
                <g
                  transform={`translate(${COL_RIGHT_X - NODE_W / 2}, ${n.y})`}
                  className="[&>rect]:transition-colors [&:hover>rect]:stroke-acc"
                >
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx={8}
                    fill={emphasized ? `${n.color}15` : "var(--color-bg)"}
                    stroke={orphan ? ORPHAN_COLOR : n.color}
                    strokeWidth={emphasized ? 2 : 1.4}
                    strokeDasharray={orphan ? "4 3" : undefined}
                  />
                  <text
                    x={14}
                    y={22}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "-0.005em",
                    }}
                    fill={n.color}
                  >
                    {n.title.length > 26 ? n.title.slice(0, 25) + "…" : n.title}
                  </text>
                  <text
                    x={14}
                    y={42}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      letterSpacing: "0.06em",
                    }}
                    fill={orphan ? ORPHAN_COLOR : n.color}
                    opacity={0.85}
                  >
                    {orphan
                      ? pick(language, "orphan · 0 consumers", "고립 · 소비자 0")
                      : pick(
                          language,
                          `${n.consumers} consumer${n.consumers === 1 ? "" : "s"} · ${n.pillarsReached.length} pillar${n.pillarsReached.length === 1 ? "" : "s"}`,
                          `소비자 ${n.consumers} · 필러 ${n.pillarsReached.length}`,
                        )}
                  </text>
                  {/* consumer-count dots — one per consumer (cap 5) */}
                  <g transform={`translate(${NODE_W - 14}, 16)`}>
                    {dotPositions(Math.min(n.consumers, 5)).map((dx) => (
                      <circle key={`dot-${n.id}-${dx}`} cx={dx} cy={0} r={3} fill={n.color} />
                    ))}
                  </g>
                </g>
              </a>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function Reading({
  appCount,
  modCount,
  edgeCount,
  multiCount,
}: {
  appCount: number;
  modCount: number;
  edgeCount: number;
  multiCount: number;
}) {
  const { language } = useApp();
  const apps = applications.filter((a) => a.status === "available");
  const mods = modules.filter((m) => m.status === "available");

  const consumersByModule = new Map<string, typeof apps>();
  for (const a of apps) {
    for (const m of a.modules) {
      const list = consumersByModule.get(m) ?? [];
      list.push(a);
      consumersByModule.set(m, list);
    }
  }

  // Sort modules by consumer count desc, alpha tiebreak.
  const sortedMods = mods.slice().sort((a, b) => {
    const ca = consumersByModule.get(a.id)?.length ?? 0;
    const cb = consumersByModule.get(b.id)?.length ?? 0;
    if (cb !== ca) return cb - ca;
    return a.id.localeCompare(b.id);
  });

  const orphanMods = sortedMods.filter((m) => (consumersByModule.get(m.id)?.length ?? 0) === 0);
  const singleMods = sortedMods.filter((m) => (consumersByModule.get(m.id)?.length ?? 0) === 1);
  const multiMods = sortedMods.filter((m) => (consumersByModule.get(m.id)?.length ?? 0) >= 2);

  const pillarsActive = new Set(apps.map((a) => a.pillar));

  function pillarReachStr(modId: string): string {
    const cs = consumersByModule.get(modId) ?? [];
    const counts = new Map<Pillar, number>();
    for (const c of cs) counts.set(c.pillar, (counts.get(c.pillar) ?? 0) + 1);
    return Array.from(counts.entries())
      .map(([p, n]) => (n > 1 ? `${PILLAR_LABEL[p][language]} × ${n}` : PILLAR_LABEL[p][language]))
      .join(" · ");
  }

  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "what the graph says today", "오늘 그래프가 말하는 것")}
      </div>
      <ul className="m-0 list-none space-y-3 p-0 font-serif text-[16.5px] leading-[1.55] text-ink-soft [&_b]:font-semibold [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep [&_code]:rounded-sm [&_code]:bg-rule-soft [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.9em]">
        <li className="border-l-[3px] border-acc pl-4">
          {pick(
            language,
            <>
              <b>The manifesto's modular-graph promise has paid off.</b>{" "}
              <span className={MONO}>{pillarsActive.size}/4</span> pillars active,{" "}
              <span className={MONO}>
                {appCount - orphanMods.length}/{modCount}
              </span>{" "}
              modules consumed, <span className={MONO}>{edgeCount}</span> edges drawn,{" "}
              <span className={MONO}>
                {multiCount}/{modCount}
              </span>{" "}
              modules shared by more than one application. The graph is no longer a sketch — it's a
              count.
            </>,
            <>
              <b>매니페스토의 모듈 그래프 약속이 결제됐다.</b>{" "}
              <span className={MONO}>{pillarsActive.size}/4</span> 필러 활성,{" "}
              <span className={MONO}>
                {modCount - orphanMods.length}/{modCount}
              </span>{" "}
              모듈 소비 중, <span className={MONO}>{edgeCount}</span> 엣지,{" "}
              <span className={MONO}>
                {multiCount}/{modCount}
              </span>{" "}
              모듈은 응용 둘 이상이 공유. 그래프는 더 이상 스케치가 아니라 *셈*이다.
            </>,
          )}
        </li>

        {multiMods.length > 0 && (
          <li className="border-l-[3px] border-rule pl-4">
            {pick(
              language,
              <>
                <b>Cross-application module reuse</b> — each module's edge colour traces its
                consumers in the picture above:
              </>,
              <>
                <b>응용 간 모듈 재사용</b> — 위 그림에서 각 모듈의 엣지 색이 곧 소비자 목록:
              </>,
            )}
            <ul className="mt-1.5 list-none space-y-1 pl-0">
              {multiMods.map((m) => {
                const c = moduleColor(m.id);
                const n = consumersByModule.get(m.id)?.length ?? 0;
                return (
                  <li key={`reuse-${m.id}`} className="flex items-baseline gap-2 pl-3">
                    <span
                      className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ background: c }}
                      aria-hidden
                    />
                    <span>
                      <Link to={`/modules/${m.id}`} className="font-semibold text-ink">
                        {m.title[language]}
                      </Link>
                      <span className="text-ink-mute">
                        {" "}
                        — {pick(language, `${n} consumers`, `소비자 ${n}`)}, {pillarReachStr(m.id)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        )}

        {singleMods.length > 0 && (
          <li className="border-l-[3px] border-rule pl-4">
            {pick(
              language,
              <>
                <b>Single-consumer modules</b> — built but only used once so far. Most natural place
                for a future application to plug in:
              </>,
              <>
                <b>단일 소비 모듈</b> — 아직 한 번만 쓰임. 다음 응용이 가장 자연스럽게 붙을 자리:
              </>,
            )}
            <ul className="mt-1.5 list-none space-y-1 pl-0">
              {singleMods.map((m) => {
                const c = moduleColor(m.id);
                return (
                  <li key={`single-${m.id}`} className="flex items-baseline gap-2 pl-3">
                    <span
                      className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ background: c }}
                      aria-hidden
                    />
                    <span>
                      <Link to={`/modules/${m.id}`} className="font-semibold text-ink">
                        {m.title[language]}
                      </Link>
                      <span className="text-ink-mute"> — {pillarReachStr(m.id)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        )}

        {orphanMods.length > 0 && (
          <li className="border-l-[3px] border-acc-deep pl-4">
            {pick(
              language,
              <>
                <b>Orphan modules</b> — built but not yet consumed:
              </>,
              <>
                <b>고립 모듈</b> — 만들어졌지만 아직 소비되지 않음:
              </>,
            )}
            <ul className="mt-1.5 list-none space-y-1 pl-0">
              {orphanMods.map((m) => (
                <li key={`orphan-${m.id}`} className="pl-3">
                  <Link to={`/modules/${m.id}`} className="font-semibold text-ink">
                    {m.title[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        )}

        <li className="border-l-[3px] border-rule pl-4">
          {pick(
            language,
            <>
              Glossary terms aren't drawn here on purpose. The application–module structure already
              carries enough signal to reason from; adding term nodes would dilute the "
              <em>which math is shared, and how widely?</em>" question this view was built to
              answer.
            </>,
            <>
              용어 노드는 일부러 그리지 않는다. 응용–모듈 구조만으로도 충분히 신호가 잡힌다 — 용어
              노드를 더하면 이 뷰가 답하려는 "<em>어느 수학이 얼마나 공유되는가?</em>" 질문이
              희석된다.
            </>,
          )}
        </li>
      </ul>
    </section>
  );
}

export function Graph() {
  useEffect(() => {
    document.title = "Graph · Lemma";
  }, []);

  const { appCount, modCount, modConsumed, edgeCount, multiCount } = useMemo(() => {
    const apps = applications.filter((a) => a.status === "available");
    const mods = modules.filter((m) => m.status === "available");
    const consumed = new Set<string>();
    let edges = 0;
    const consumerCount = new Map<string, number>();
    for (const a of apps) {
      for (const m of a.modules) {
        consumed.add(m);
        edges++;
        consumerCount.set(m, (consumerCount.get(m) ?? 0) + 1);
      }
    }
    const multi = Array.from(consumerCount.values()).filter((n) => n >= 2).length;
    return {
      appCount: apps.length,
      modCount: mods.length,
      modConsumed: consumed.size,
      edgeCount: edges,
      multiCount: multi,
    };
  }, []);

  return (
    <>
      <Breadcrumb />
      <Hero appCount={appCount} modCount={modCount} edgeCount={edgeCount} multiCount={multiCount} />
      <Snapshot
        appCount={appCount}
        modCount={modCount}
        modConsumed={modConsumed}
        edgeCount={edgeCount}
        multiCount={multiCount}
      />
      <GraphSvg />
      <Reading
        appCount={appCount}
        modCount={modCount}
        edgeCount={edgeCount}
        multiCount={multiCount}
      />
    </>
  );
}
