import { useEffect } from "react";
import { useApp, pick } from "../context/app-context";
import { Link } from "../lib/router";
import { applications, PILLAR_LABEL } from "../data/applications";
import { modules } from "../data/modules";
import { spikes } from "../data/spikes";
import { journeys } from "../data/journeys";
import { glossary } from "../data/glossary";
import { HeaderInner } from "../components/header";
import { ProgressRecent } from "../components/page/progress-recent";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";

function Hero() {
  const { language } = useApp();
  return (
    <section className="relative mx-[calc(50%-50vw)] -mt-8 h-screen w-screen overflow-hidden max-md:-mt-5">
      <img
        src="/hero.webp"
        alt={pick(language, "A leaf, very close.", "잎사귀, 아주 가까이.")}
        className="absolute inset-0 block h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/0 to-black/25" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h1
          className={`m-0 text-center text-[120px] leading-[0.95] tracking-[-0.035em] text-white max-md:text-[64px] ${
            language === "ko" ? "font-['Diphylleia'] font-normal" : "font-serif font-medium"
          }`}
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.45)" }}
        >
          {pick(language, "Look closer.", "가까이 보세요.")}
        </h1>
      </div>
    </section>
  );
}

function ApplicationsList() {
  const { language } = useApp();
  const live = applications.filter((a) => a.status === "available");
  return (
    <section className="mt-14">
      <div className={KICKER}>
        {pick(
          language,
          `applications · available · ${live.length}`,
          `응용 · 공개됨 · ${live.length}`,
        )}
      </div>
      <ul className="m-0 grid list-none gap-3.5 p-0">
        {live.map((app) => (
          <li
            key={app.id}
            className="group rounded-[10px] border border-rule bg-bg-card transition-[border,transform] duration-[0.18s] hover:border-acc"
          >
            <Link to={app.href} className="block px-6 py-[22px] text-inherit no-underline">
              <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
                <span className="font-semibold text-acc">{PILLAR_LABEL[app.pillar][language]}</span>
                <span className="mx-1.5 text-rule">·</span>
                <span>{app.modules.join(" · ")}</span>
              </div>
              <h2 className="m-0 mb-2.5 font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink group-hover:text-acc">
                {app.title[language]}
              </h2>
              <p className="m-0 mb-3.5 font-serif text-[17px] leading-[1.55] text-ink-soft">
                {app.hook[language]}
              </p>
              <span className="font-mono text-xs lowercase tracking-[0.06em] text-acc">
                {pick(language, "open →", "열기 →")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ModulesList() {
  const { language } = useApp();
  const live = modules.filter((m) => m.status === "available");
  return (
    <section className="mt-14">
      <div className={KICKER}>
        {pick(language, `modules · available · ${live.length}`, `모듈 · 공개됨 · ${live.length}`)}
      </div>
      <ul className="m-0 grid list-none gap-3.5 p-0">
        {live.map((m) => (
          <li
            key={m.id}
            className="group rounded-[10px] border border-rule bg-bg-card transition-[border,transform] duration-[0.18s] hover:border-acc"
          >
            <Link to={m.href} className="block px-6 py-[22px] text-inherit no-underline">
              <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
                <span className="font-semibold text-acc">{pick(language, "module", "모듈")}</span>
              </div>
              <h2 className="m-0 mb-2.5 font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink group-hover:text-acc">
                {m.title[language]}
              </h2>
              <p className="m-0 mb-3.5 font-serif text-[17px] leading-[1.55] text-ink-soft">
                {m.hook[language]}
              </p>
              <span className="font-mono text-xs lowercase tracking-[0.06em] text-acc">
                {pick(language, "open →", "열기 →")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function pathSlugs(j: (typeof journeys)[number]): string[] {
  // Unique slugs in order of first appearance — re-reads collapse, so the
  // path reads as a clean breadcrumb of stops the journey hits. Deduping on
  // the displayed slug (not the full page path) lets the slug itself serve
  // as a stable React key downstream.
  const seen = new Set<string>();
  const out: string[] = [];
  for (const d of j.days) {
    const slug = d.page.split("/").filter(Boolean).pop() ?? d.page;
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
  }
  return out;
}

function JourneysList() {
  const { language } = useApp();
  if (journeys.length === 0) return null;
  return (
    <section className="mt-14">
      <div className={KICKER}>
        {pick(
          language,
          `journeys · curated paths · ${journeys.length}`,
          `여정 · 큐레이션 경로 · ${journeys.length}`,
        )}
      </div>
      <ul className="m-0 grid list-none gap-3.5 p-0">
        {journeys.map((j) => {
          const path = pathSlugs(j);
          return (
            <li
              key={j.id}
              className="group rounded-[10px] border border-rule bg-bg-card transition-[border,transform] duration-[0.18s] hover:border-acc"
            >
              <Link
                to={`/${language}/journey/${j.id}`}
                className="block px-6 py-[22px] text-inherit no-underline"
              >
                <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
                  <span className="font-semibold text-acc">
                    {pick(language, "journey", "여정")}
                  </span>
                  <span className="mx-1.5 text-rule">·</span>
                  <span>
                    {j.duration} {pick(language, "days", "일")}
                  </span>
                  <span className="mx-1.5 text-rule">·</span>
                  <span>→ {j.destination[language]}</span>
                </div>
                <h2 className="m-0 mb-2 font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink group-hover:text-acc">
                  {j.title[language]}
                </h2>
                <p className="m-0 mb-3 font-serif text-[16.5px] leading-[1.55] text-ink-soft">
                  {j.tagline[language]}
                </p>
                <div className="flex flex-wrap items-center gap-x-1 gap-y-1 font-mono text-[11.5px] text-ink-mute">
                  {path.map((slug, i) => (
                    <span key={slug} className="inline-flex items-center gap-1">
                      {i > 0 && <span className="text-rule">→</span>}
                      <span className="text-ink-soft">{slug}</span>
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SpikesList() {
  const { language } = useApp();
  if (spikes.length === 0) return null;
  return (
    <section className="mt-14">
      <div className={KICKER}>
        {pick(
          language,
          `spikes · in progress · ${spikes.length}`,
          `스파이크 · 작업 중 · ${spikes.length}`,
        )}
      </div>
      <ul className="m-0 grid list-none gap-3.5 p-0">
        {spikes.map((s) => (
          <li
            key={s.id}
            className="group rounded-[10px] border border-dashed border-rule bg-bg-card transition-[border,transform] duration-[0.18s] hover:border-acc"
          >
            <Link to={s.href} className="block px-6 py-[22px] text-inherit no-underline">
              <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
                <span className="font-semibold text-acc-deep">
                  {pick(language, "spike", "스파이크")}
                </span>
                <span className="mx-1.5 text-rule">·</span>
                <span className="italic">{s.testing[language]}</span>
              </div>
              <h2 className="m-0 mb-2.5 font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink group-hover:text-acc">
                {s.title[language]}
              </h2>
              <p className="m-0 mb-3.5 font-serif text-[17px] leading-[1.55] text-ink-soft">
                {s.hook[language]}
              </p>
              <span className="font-mono text-xs lowercase tracking-[0.06em] text-acc">
                {pick(language, "open →", "열기 →")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Status() {
  const { language } = useApp();
  const apps = applications.filter((a) => a.status === "available");
  const consumedModules = new Set(apps.flatMap((a) => a.modules));
  const activePillars = new Set(apps.map((a) => a.pillar));
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "status", "현재 상태")}</div>
      <p className="m-0 max-w-[720px] font-serif text-[17.5px] leading-[1.6] text-ink-soft [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Proof-of-system stage. {apps.length} live applications span {activePillars.size}/4
            pillars; {consumedModules.size}/{modules.length} modules are consumed by at least one
            application; {glossary.length} bilingual terms backfill the gaps. Still early — most of
            math is missing — but the graph now has working evidence. The bar remains one question:{" "}
            <em>
              does this make a curious learner understand something they could not understand
              before?
            </em>{" "}
            Yes — it ships. No — it doesn't, however polished.
          </>,
          <>
            시스템 검증 단계. 공개 응용 {apps.length}개가 {activePillars.size}/4개 기둥에 걸쳐 있고,
            모듈 {consumedModules.size}/{modules.length}개가 적어도 하나의 응용에 의해 소비되며,
            이중언어 용어 {glossary.length}개가 빈틈을 메웁니다. 아직 초기입니다 — 수학의 대부분은
            비어 있습니다 — 하지만 그래프에는 이제 작동하는 증거가 있습니다. 기준은 여전히 단 하나:{" "}
            <em>호기심 있는 학습자가 이전엔 이해하지 못한 것을 이해하게 만드는가?</em> 예 —
            들어옵니다. 아니오 — 아무리 다듬어졌어도 들어오지 않습니다.
          </>,
        )}
      </p>
    </section>
  );
}

function Counters() {
  const { language } = useApp();
  const apps = applications.filter((a) => a.status === "available");
  const consumedModules = new Set(apps.flatMap((a) => a.modules));
  const cells: Array<{ num: number | string; label: string; href?: string }> = [
    { num: apps.length, label: pick(language, "applications", "응용") },
    {
      num: `${consumedModules.size}/${modules.length}`,
      label: pick(language, "modules · consumed", "모듈 · 소비됨"),
    },
    {
      num: glossary.length,
      label: pick(language, "glossary terms", "용어"),
      href: `/${language}/glossary/`,
    },
    { num: 2, label: pick(language, "languages", "언어") },
  ];
  return (
    <section className="mt-10 border-y border-rule py-[22px]">
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
        {cells.map((c) => {
          const inner = (
            <>
              <div className="font-serif text-[38px] font-semibold leading-none text-acc [font-feature-settings:'lnum']">
                {c.num}
              </div>
              <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
                {c.label}
              </div>
            </>
          );
          return (
            <div key={c.label} className="text-center">
              {c.href ? (
                <Link
                  to={c.href}
                  className="block no-underline hover:[&_div:first-child]:text-acc-deep"
                >
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-center font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
        <Link to="/graph">{pick(language, "see the graph →", "그래프 보기 →")}</Link>
        <Link to={`/${language}/glossary/`}>
          {pick(language, "browse the glossary →", "용어집 보기 →")}
        </Link>
      </div>
    </section>
  );
}

function HomeFooter() {
  const { language } = useApp();
  return (
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-[18px] font-mono text-xs text-ink-mute">
      <div>
        {pick(
          language,
          <>
            Lemma is bilingual at the term level. Hover any underlined word to see its counterpart.
          </>,
          <>
            Lemma는 용어 단위로 이중언어입니다. 밑줄 그어진 단어 위에 마우스를 올리면 반대 언어가
            보입니다.
          </>,
        )}
      </div>
      <div className="text-[11px] [&_a]:border-b [&_a]:border-dotted [&_a]:border-ink-mute [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:border-acc hover:[&_a]:text-acc">
        <a href="https://github.com/lemmawiki/lemma" target="_blank" rel="noopener noreferrer">
          github
        </a>
        <span className="text-rule"> · </span>
        CC BY 4.0 (content) · MIT (code)
      </div>
    </footer>
  );
}

function StickyHeader() {
  return (
    <div className="sticky top-0 z-20 mx-[calc(50%-50vw)] mb-2 w-screen bg-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-[880px] px-7 pt-4 max-md:px-[18px]">
        <HeaderInner pathname="/" />
      </div>
    </div>
  );
}

export function Home() {
  useEffect(() => {
    document.title = "Lemma";
  }, []);
  return (
    <>
      <Hero />
      <StickyHeader />
      <Counters />
      <ProgressRecent />
      <ApplicationsList />
      <ModulesList />
      <JourneysList />
      <SpikesList />
      <Status />
      <HomeFooter />
    </>
  );
}
