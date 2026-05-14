import { useEffect, useMemo } from "react";
import { useApp, pick } from "../context/app-context";
import { Link } from "../lib/router";
import { applications, PILLAR_LABEL } from "../data/applications";
import { modules } from "../data/modules";
import { spikes } from "../data/spikes";
import { journeys } from "../data/journeys";
import { glossary } from "../data/glossary";
import { shapes } from "../data/shapes";
import { HeaderInner } from "../components/header";
import { ProgressRecent } from "../components/page/progress-recent";

// Home redesigned as a digest, not a catalog. The full lists migrated to
// dedicated /<lang>/applications, /<lang>/modules, /<lang>/journeys, and
// /<lang>/shapes index pages — so the home stays a constant length
// regardless of how much content lands. Featured rotation is date-
// deterministic (same day → same picks) so the home doesn't shuffle on
// every refresh.

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

/** Days-since-epoch — stable across all visits on the same calendar day,
 *  so the rotation is "today's pick", not "this refresh's pick". */
function todayIndex(): number {
  return Math.floor(Date.now() / (24 * 60 * 60 * 1000));
}

function pickTodays<T>(items: readonly T[], salt: number): T | null {
  if (items.length === 0) return null;
  return items[(todayIndex() + salt) % items.length] ?? null;
}

function Featured() {
  const { language } = useApp();
  const liveApps = useMemo(() => applications.filter((a) => a.status === "available"), []);
  const liveModules = useMemo(() => modules.filter((m) => m.status === "available"), []);

  // Each category uses a different salt so today's app, module, shape, and
  // journey rotate independently rather than locking together.
  const app = pickTodays(liveApps, 0);
  const mod = pickTodays(liveModules, 1);
  const shape = pickTodays(shapes, 2);
  const journey = pickTodays(journeys, 3);

  if (!app && !mod && !shape && !journey) return null;

  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "today's pick", "오늘의 한 줌")}</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {app && (
          <FeaturedCard
            kicker={pick(
              language,
              `application · ${PILLAR_LABEL[app.pillar].en}`,
              `응용 · ${PILLAR_LABEL[app.pillar].ko}`,
            )}
            title={app.title[language]}
            body={app.hook[language]}
            href={`/${language}${app.href}`}
          />
        )}
        {mod && (
          <FeaturedCard
            kicker={pick(language, "module", "모듈")}
            title={mod.title[language]}
            body={mod.hook[language]}
            href={`/${language}${mod.href}`}
          />
        )}
        {shape && (
          <FeaturedCard
            kicker={pick(language, "shape", "골격")}
            title={shape.title[language]}
            body={shape.hook[language]}
            href={`/${language}/shapes/${shape.id}`}
          />
        )}
        {journey && (
          <FeaturedCard
            kicker={pick(
              language,
              `journey · ${journey.duration} days`,
              `여정 · ${journey.duration}일`,
            )}
            title={journey.title[language]}
            body={journey.tagline[language]}
            href={`/${language}/journey/${journey.id}`}
          />
        )}
      </div>
    </section>
  );
}

function FeaturedCard({
  kicker,
  title,
  body,
  href,
}: {
  kicker: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group block h-full rounded-[10px] border border-rule bg-bg-card px-5 py-5 text-inherit no-underline transition-[border] duration-[0.18s] hover:border-acc"
    >
      <div className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-mute">
        {kicker}
      </div>
      <h2 className="m-0 mb-2 font-serif text-[22px] font-semibold tracking-[-0.01em] text-ink group-hover:text-acc">
        {title}
      </h2>
      <p className="m-0 font-serif text-[15.5px] leading-[1.5] text-ink-soft">{body}</p>
    </Link>
  );
}

function IndexShortcuts() {
  const { language } = useApp();
  const liveApps = applications.filter((a) => a.status === "available").length;
  const liveModules = modules.filter((m) => m.status === "available").length;
  const cells = [
    {
      href: `/${language}/applications/`,
      count: liveApps,
      label: pick(language, "applications", "응용"),
    },
    {
      href: `/${language}/modules/`,
      count: liveModules,
      label: pick(language, "modules", "모듈"),
    },
    {
      href: `/${language}/journeys/`,
      count: journeys.length,
      label: pick(language, "journeys", "여정"),
    },
    {
      href: `/${language}/shapes/`,
      count: shapes.length,
      label: pick(language, "shapes", "골격"),
    },
  ];
  return (
    <section className="mt-10">
      <div className={KICKER}>{pick(language, "browse", "둘러보기")}</div>
      <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-4">
        {cells.map((c) => (
          <li key={c.href}>
            <Link
              to={c.href}
              className="group block rounded-md border border-rule bg-rule-soft px-3 py-3 no-underline hover:border-acc"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-[17px] font-semibold text-ink group-hover:text-acc">
                  {c.label}
                </span>
                <span className="font-mono text-[12px] text-ink-mute">{c.count}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SpikesList() {
  // Spikes are experiments — they appear on the home only when there are any
  // in flight. Empty registry → no slot at all.
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
            className="group rounded-[10px] border border-dashed border-rule bg-bg-card transition-[border] duration-[0.18s] hover:border-acc"
          >
            <Link to={s.href} className="block px-6 py-[22px] text-inherit no-underline">
              <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
                <span className="font-semibold text-acc-deep">
                  {pick(language, "spike", "스파이크")}
                </span>
                <span className="mx-1.5 text-rule">·</span>
                <span className="italic">{s.testing[language]}</span>
              </div>
              <h2 className="m-0 mb-2.5 font-serif text-[24px] font-semibold tracking-[-0.01em] text-ink group-hover:text-acc">
                {s.title[language]}
              </h2>
              <p className="m-0 font-serif text-[16px] leading-[1.55] text-ink-soft">
                {s.hook[language]}
              </p>
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
    {
      num: apps.length,
      label: pick(language, "applications", "응용"),
      href: `/${language}/applications/`,
    },
    {
      num: `${consumedModules.size}/${modules.length}`,
      label: pick(language, "modules · consumed", "모듈 · 소비됨"),
      href: `/${language}/modules/`,
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
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-center font-mono text-xs tracking-[0.04em] text-ink-mute [&_a]:text-ink-mute [&_a]:no-underline [&_a:hover]:text-acc">
        <Link to="/graph">{pick(language, "see the graph →", "그래프 보기 →")}</Link>
        <Link to={`/${language}/shapes/`}>
          {pick(language, "recognise the shapes →", "골격 알아보기 →")}
        </Link>
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
      <Featured />
      <IndexShortcuts />
      <SpikesList />
      <Status />
      <HomeFooter />
    </>
  );
}
