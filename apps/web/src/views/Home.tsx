import { useEffect } from "react";
import { useApp, pick } from "../context/AppContext";
import { Link } from "../lib/router";
import { applications, PILLAR_LABEL } from "../data/applications";
import { modules } from "../data/modules";
import { glossary } from "../data/glossary";

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";

function Hero() {
  const { language } = useApp();
  return (
    <section className="mb-9 mt-16">
      <h1 className="m-0 mb-[18px] max-w-[720px] font-serif text-[44px] font-medium leading-[1.15] tracking-[-0.02em] text-ink max-md:text-[30px]">
        {pick(
          language,
          "An interactive math textbook built backwards.",
          "거꾸로 만든 인터랙티브 수학 교과서.",
        )}
      </h1>
      <p className="m-0 max-w-[640px] font-serif text-[22px] italic leading-[1.5] text-ink-soft max-md:text-[18px]">
        {pick(
          language,
          <>We start with the question. The math comes after.</>,
          <>질문에서 시작합니다. 수학은 그 다음입니다.</>,
        )}
      </p>
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

function Status() {
  const { language } = useApp();
  return (
    <section className="mt-14">
      <div className={KICKER}>{pick(language, "status", "현재 상태")}</div>
      <p className="m-0 max-w-[720px] font-serif text-[17.5px] leading-[1.6] text-ink-soft [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Early. One application live, more in progress. The bar is one question:{" "}
            <em>
              does this make a curious learner understand something they could not understand
              before?
            </em>{" "}
            Yes — it ships. No — it doesn't, however polished.
          </>,
          <>
            초기. 응용 하나 공개, 더 작업 중. 기준은 단 하나:{" "}
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
  return (
    <section className="mt-10 grid grid-cols-4 gap-3 border-y border-rule py-[22px] max-md:grid-cols-2">
      {[
        {
          num: applications.filter((a) => a.status === "available").length,
          label: pick(language, "applications", "응용"),
        },
        { num: modules.length, label: pick(language, "modules", "모듈") },
        { num: glossary.length, label: pick(language, "glossary terms", "용어") },
        { num: 2, label: pick(language, "languages", "언어") },
      ].map((c) => (
        <div key={c.label} className="text-center">
          <div className="font-serif text-[38px] font-semibold leading-none text-acc [font-feature-settings:'lnum']">
            {c.num}
          </div>
          <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            {c.label}
          </div>
        </div>
      ))}
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

export function Home() {
  useEffect(() => {
    document.title = "Lemma";
  }, []);
  return (
    <>
      <Hero />
      <Counters />
      <ApplicationsList />
      <ModulesList />
      <Status />
      <HomeFooter />
    </>
  );
}
