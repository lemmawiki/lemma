import { useEffect, useMemo } from "react";
import { useApp, pick } from "../context/app-context";
import { Link } from "../lib/router";
import { applications, PILLAR_LABEL, type Pillar } from "../data/applications";
import { modules } from "../data/modules";
import { spikes } from "../data/spikes";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";
const MONO = "font-mono text-[0.93em]";

const COL_X = { app: 130, mod: 400, spike: 670 } as const;
const NODE_W = 200;
const NODE_H = 60;
const ROW_GAP = 28;
const TOP_PAD = 28;
const SVG_W = 800;

type Node = {
  id: string;
  kind: "app" | "mod" | "spike";
  title: string;
  sub: string;
  x: number;
  y: number;
  href: string;
  orphan?: boolean;
};

function buildNodes(language: "en" | "ko"): {
  nodes: Node[];
  edges: { from: string; to: string }[];
  svgH: number;
} {
  const apps = applications.filter((a) => a.status === "available");
  const mods = modules.filter((m) => m.status === "available");

  const moduleConsumers = new Map<string, number>();
  apps.forEach((a) =>
    a.modules.forEach((m) => moduleConsumers.set(m, (moduleConsumers.get(m) ?? 0) + 1)),
  );

  const colCount = Math.max(apps.length, mods.length, spikes.length);
  const svgH = TOP_PAD + colCount * (NODE_H + ROW_GAP) + 8;

  const stack = (count: number, i: number): number => {
    const totalH = count * NODE_H + (count - 1) * ROW_GAP;
    const startY = TOP_PAD + (svgH - TOP_PAD - 8 - totalH) / 2;
    return startY + i * (NODE_H + ROW_GAP);
  };

  const nodes: Node[] = [];

  apps.forEach((a, i) => {
    nodes.push({
      id: `app:${a.id}`,
      kind: "app",
      title: a.title[language],
      sub: PILLAR_LABEL[a.pillar][language],
      x: COL_X.app,
      y: stack(apps.length, i),
      href: a.href,
    });
  });

  mods.forEach((m, i) => {
    const consumers = moduleConsumers.get(m.id) ?? 0;
    nodes.push({
      id: `mod:${m.id}`,
      kind: "mod",
      title: m.title[language],
      sub:
        consumers === 0
          ? pick(language, "orphan · 0 consumers", "고립 · 소비자 0")
          : pick(language, `${consumers} consumer`, `소비자 ${consumers}`),
      x: COL_X.mod,
      y: stack(mods.length, i),
      href: m.href,
      orphan: consumers === 0,
    });
  });

  spikes.forEach((s, i) => {
    nodes.push({
      id: `spike:${s.id}`,
      kind: "spike",
      title: s.title[language],
      sub: pick(language, "spike · standalone", "스파이크 · 독립"),
      x: COL_X.spike,
      y: stack(spikes.length, i),
      href: s.href,
    });
  });

  const edges: { from: string; to: string }[] = [];
  apps.forEach((a) =>
    a.modules.forEach((m) => edges.push({ from: `app:${a.id}`, to: `mod:${m}` })),
  );

  return { nodes, edges, svgH };
}

function Breadcrumb() {
  const { language } = useApp();
  return (
    <nav className="mt-7 font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
      <Link to="/">Lemma</Link>
      <span className="mx-2 text-rule">/</span>
      <span className="uppercase tracking-[0.06em] text-ink">
        {pick(language, "graph · what's connected", "그래프 · 무엇이 연결됐나")}
      </span>
    </nav>
  );
}

function Hero() {
  const { language } = useApp();
  return (
    <section className="mb-10 mt-12">
      <div className={KICKER}>{pick(language, "modular graph", "모듈 그래프")}</div>
      <h1 className="m-0 mb-5 font-serif text-[36px] font-medium leading-[1.18] tracking-[-0.015em] text-ink max-md:text-[26px]">
        {pick(
          language,
          <>The graph the manifesto promises — honestly drawn.</>,
          <>매니페스토가 약속한 그래프 — 정직하게 그린다.</>,
        )}
      </h1>
      <p className="m-0 max-w-[680px] font-serif text-[18px] leading-[1.55] text-ink-soft [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Lemma claims a <em>modular graph, not a sequence</em>. A graph means edges. A graph
            means a module that no application consumes is a <em>tool gathering dust</em>. This page
            draws what's actually connected today — and what isn't.
          </>,
          <>
            Lemma는 <em>시퀀스가 아닌 모듈 그래프</em>를 표방한다. 그래프는 엣지가 있어야 그래프.
            그래프라면 어떤 응용에도 소비되지 않는 모듈은 <em>먼지 쌓이는 도구</em>다. 이 페이지는
            오늘 시점에 *실제로* 연결된 것과 *연결되지 않은 것*을 그대로 그린다.
          </>,
        )}
      </p>
    </section>
  );
}

function PillarStatus() {
  const { language } = useApp();
  const counts = useMemo(() => {
    const m = new Map<Pillar, number>();
    applications
      .filter((a) => a.status === "available")
      .forEach((a) => m.set(a.pillar, (m.get(a.pillar) ?? 0) + 1));
    return m;
  }, []);
  const pillars: Pillar[] = ["graphics", "physics", "ml", "finance"];
  const active = pillars.filter((p) => (counts.get(p) ?? 0) > 0).length;
  return (
    <section className="mt-2 mb-10">
      <div className={KICKER}>
        {pick(language, `pillars · ${active}/4 active`, `필러 · ${active}/4 활성`)}
      </div>
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
        {pillars.map((p) => {
          const n = counts.get(p) ?? 0;
          const empty = n === 0;
          return (
            <div
              key={p}
              className={
                "rounded-[10px] border p-4 transition-colors " +
                (empty ? "border-dashed border-rule bg-transparent" : "border-acc bg-bg-card")
              }
            >
              <div
                className={
                  "font-mono text-[11px] uppercase tracking-[0.08em] " +
                  (empty ? "text-ink-mute" : "text-acc")
                }
              >
                {PILLAR_LABEL[p][language]}
              </div>
              <div className="mt-1.5 font-serif text-[22px] font-semibold leading-none text-ink [font-feature-settings:'lnum']">
                {n}
              </div>
              <div className="mt-1 text-[12px] text-ink-mute">
                {empty
                  ? pick(language, "no applications yet", "응용 없음")
                  : pick(language, `${n} application${n === 1 ? "" : "s"}`, `응용 ${n}개`)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function GraphSvg() {
  const { language } = useApp();
  const { nodes, edges, svgH } = useMemo(() => buildNodes(language), [language]);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const colHeader = (x: number, label: string) => (
    <text
      x={x}
      y={16}
      textAnchor="middle"
      className="fill-ink-mute"
      style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em" }}
    >
      {label.toUpperCase()}
    </text>
  );

  return (
    <section className="mt-2">
      <div className={KICKER}>{pick(language, "the graph", "그래프")}</div>
      <div className="overflow-x-auto rounded-[10px] border border-rule bg-bg-card p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${svgH}`}
          width="100%"
          style={{ display: "block", minWidth: 640 }}
          role="img"
          aria-label={pick(language, "Lemma content graph", "Lemma 콘텐츠 그래프")}
        >
          {colHeader(COL_X.app, pick(language, "applications", "응용"))}
          {colHeader(COL_X.mod, pick(language, "modules", "모듈"))}
          {colHeader(COL_X.spike, pick(language, "spikes", "스파이크"))}

          {edges.map((e) => {
            const a = nodeMap.get(e.from);
            const b = nodeMap.get(e.to);
            if (!a || !b) return null;
            const x1 = a.x + NODE_W / 2;
            const y1 = a.y + NODE_H / 2;
            const x2 = b.x - NODE_W / 2;
            const y2 = b.y + NODE_H / 2;
            const cx = (x1 + x2) / 2;
            return (
              <path
                key={`${e.from}->${e.to}`}
                d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                fill="none"
                className="stroke-acc"
                strokeWidth={1.5}
              />
            );
          })}

          {nodes.map((n) => (
            <a key={n.id} href={n.href}>
              <g
                transform={`translate(${n.x - NODE_W / 2}, ${n.y})`}
                className="cursor-pointer [&>rect]:transition-colors [&:hover>rect]:stroke-acc"
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  className={
                    n.orphan
                      ? "fill-bg stroke-rule [stroke-dasharray:4_3]"
                      : n.kind === "spike"
                        ? "fill-bg stroke-rule [stroke-dasharray:4_3]"
                        : "fill-bg stroke-rule"
                  }
                  strokeWidth={1.5}
                />
                <text
                  x={14}
                  y={24}
                  className="fill-ink"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {n.title.length > 22 ? n.title.slice(0, 21) + "…" : n.title}
                </text>
                <text
                  x={14}
                  y={44}
                  className={n.orphan ? "fill-acc-deep" : "fill-ink-mute"}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.06em",
                  }}
                >
                  {n.sub}
                </text>
              </g>
            </a>
          ))}
        </svg>
      </div>
    </section>
  );
}

function Reading() {
  const { language } = useApp();
  const apps = applications.filter((a) => a.status === "available");
  const mods = modules.filter((m) => m.status === "available");
  const consumed = new Set<string>();
  apps.forEach((a) => a.modules.forEach((m) => consumed.add(m)));
  const orphans = mods.filter((m) => !consumed.has(m.id));
  const pillars: Pillar[] = ["graphics", "physics", "ml", "finance"];
  const populated = new Set(apps.map((a) => a.pillar));
  const emptyPillars = pillars.filter((p) => !populated.has(p));

  return (
    <section className="mt-12">
      <div className={KICKER}>
        {pick(language, "what the graph says today", "오늘 그래프가 말하는 것")}
      </div>
      <ul className="m-0 list-none space-y-3 p-0 font-serif text-[16.5px] leading-[1.55] text-ink-soft [&_b]:font-semibold [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        <li className="border-l-[3px] border-rule pl-4">
          {pick(
            language,
            <>
              <b>{`${apps.length} application${apps.length === 1 ? "" : "s"} consume${apps.length === 1 ? "s" : ""} ${consumed.size} of ${mods.length} modules.`}</b>{" "}
              The "modular graph" claim is a graph with{" "}
              <span
                className={MONO}
              >{`${apps.flatMap((a) => a.modules).length} edge${apps.flatMap((a) => a.modules).length === 1 ? "" : "s"}`}</span>{" "}
              right now.
            </>,
            <>
              <b>{`응용 ${apps.length}개가 모듈 ${mods.length}개 중 ${consumed.size}개를 소비한다.`}</b>{" "}
              지금의 "모듈 그래프"는 엣지{" "}
              <span className={MONO}>{`${apps.flatMap((a) => a.modules).length}개`}</span>짜리.
            </>,
          )}
        </li>
        {orphans.length > 0 && (
          <li className="border-l-[3px] border-acc-deep pl-4">
            {pick(
              language,
              <>
                <b>Orphan modules:</b>{" "}
                {orphans.map((m, i) => (
                  <span key={m.id}>
                    <em>{m.title.en}</em>
                    {i < orphans.length - 1 ? ", " : ""}
                  </span>
                ))}
                . Built but not yet consumed by any application — proof the manifesto's promise
                hasn't paid off here yet.
              </>,
              <>
                <b>고립된 모듈:</b>{" "}
                {orphans.map((m, i) => (
                  <span key={m.id}>
                    <em>{m.title.ko}</em>
                    {i < orphans.length - 1 ? ", " : ""}
                  </span>
                ))}
                . 만들어졌지만 아직 어떤 응용도 소비하지 않음 — 매니페스토 약속이 여기선 아직
                결제되지 않았다는 증거.
              </>,
            )}
          </li>
        )}
        {emptyPillars.length > 0 && (
          <li className="border-l-[3px] border-acc-deep pl-4">
            {pick(
              language,
              <>
                <b>{`Empty pillars (${emptyPillars.length}/4):`}</b>{" "}
                {emptyPillars.map((p, i) => (
                  <span key={p}>
                    <em>{PILLAR_LABEL[p].en}</em>
                    {i < emptyPillars.length - 1 ? ", " : ""}
                  </span>
                ))}
                . The four-pillar architecture is currently <em>1 / 4 verified</em>.
              </>,
              <>
                <b>{`빈 필러 (${emptyPillars.length}/4):`}</b>{" "}
                {emptyPillars.map((p, i) => (
                  <span key={p}>
                    <em>{PILLAR_LABEL[p].ko}</em>
                    {i < emptyPillars.length - 1 ? ", " : ""}
                  </span>
                ))}
                . 4-필러 아키텍처는 현재 <em>1/4 검증</em>.
              </>,
            )}
          </li>
        )}
        <li className="border-l-[3px] border-rule pl-4">
          {pick(
            language,
            <>
              Glossary terms aren't drawn here on purpose. Adding 36 nodes would dilute the signal
              we came to read: <em>which modules are tools, and which are still shelves</em>.
            </>,
            <>
              용어 노드는 일부러 그리지 않았다. 36개 노드가 들어오면 우리가 읽으려는 신호 —{" "}
              <em>어떤 모듈이 도구이고 어떤 게 아직 선반인가</em> — 가 묻힌다.
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
  return (
    <>
      <Breadcrumb />
      <Hero />
      <PillarStatus />
      <GraphSvg />
      <Reading />
    </>
  );
}
