import { useContext, useEffect, useState } from "react";
import { AppContext, type Language } from "../../context/app-context";
import { journeyById, type DayKind } from "../../data/journeys";

// Render a journey's day list as numbered cards. Each card links to the
// destination page; opening a card marks it visited (localStorage). Visited
// cards get a checkmark and a softer treatment; the next unvisited card is
// the implicit "today" focus.
//
// localStorage key: lemma:journey:<id>:visited
//   stored as JSON array of day numbers visited.

const KIND_LABEL_EN: Record<DayKind, string> = {
  module: "module",
  application: "application",
  review: "review",
};
const KIND_LABEL_KO: Record<DayKind, string> = {
  module: "모듈",
  application: "응용",
  review: "복습",
};

function storageKey(id: string): string {
  return `lemma:journey:${id}:visited`;
}

function readVisited(id: string): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey(id));
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((n) => typeof n === "number"));
  } catch {
    return new Set();
  }
}

function writeVisited(id: string, set: Set<number>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(id), JSON.stringify([...set]));
  } catch {
    // Ignore quota / privacy-mode errors — progress is best-effort.
  }
}

export function JourneyDays({ id, language: langProp }: { id: string; language?: Language }) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const journey = journeyById[id];
  const [visited, setVisited] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    setVisited(readVisited(id));
  }, [id]);

  if (!journey) {
    return <div style={{ background: "#ffeeee" }}>?journey:{id}?</div>;
  }

  const langPrefix = `/${language}`;
  const kindLabel = language === "en" ? KIND_LABEL_EN : KIND_LABEL_KO;
  const labelDay = language === "en" ? "day" : "일차";
  const labelVisited = language === "en" ? "visited" : "방문";
  const labelReset = language === "en" ? "reset progress" : "진척도 초기화";
  const labelNext = language === "en" ? "next" : "다음";

  // Find the next unvisited day to mark "next".
  const nextDay = journey.days.find((d) => !visited.has(d.day))?.day ?? null;

  function markVisited(day: number) {
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(day);
      writeVisited(id, next);
      return next;
    });
  }

  function reset() {
    setVisited(new Set());
    writeVisited(id, new Set());
  }

  const completed = visited.size;
  const total = journey.days.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="mt-9">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
          {language === "en" ? "the path" : "경로"} · {completed}/{total} · {pct}%
        </div>
        {completed > 0 && (
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-rule px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute transition-colors hover:border-acc hover:text-acc"
          >
            {labelReset}
          </button>
        )}
      </div>

      <ol className="m-0 grid list-none gap-3 p-0">
        {journey.days.map((d) => {
          const isVisited = visited.has(d.day);
          const isNext = d.day === nextDay;
          const fullPath = `${langPrefix}${d.page}`;
          return (
            <li
              key={d.day}
              className={
                "group rounded-[10px] border bg-bg-card transition-colors " +
                (isNext
                  ? "border-acc shadow-[0_0_0_3px_rgba(0,0,0,0.0)]"
                  : isVisited
                    ? "border-rule opacity-70"
                    : "border-rule hover:border-acc")
              }
            >
              <a
                href={fullPath}
                onClick={() => markVisited(d.day)}
                className="grid grid-cols-[64px_1fr_auto] items-baseline gap-4 px-5 py-4 text-inherit no-underline max-md:grid-cols-[44px_1fr] max-md:gap-3"
              >
                <div className="font-serif text-[28px] font-medium leading-none text-acc [font-feature-settings:'lnum'] max-md:text-[22px]">
                  {d.day}
                </div>
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
                    <span className="font-semibold text-acc">{kindLabel[d.kind]}</span>
                    <span className="text-rule">·</span>
                    <span>
                      {labelDay} {d.day}
                    </span>
                    {isVisited && (
                      <>
                        <span className="text-rule">·</span>
                        <span className="text-acc-deep">✓ {labelVisited}</span>
                      </>
                    )}
                    {isNext && !isVisited && (
                      <>
                        <span className="text-rule">·</span>
                        <span className="text-acc-deep">→ {labelNext}</span>
                      </>
                    )}
                  </div>
                  <div className="font-mono text-[14px] text-ink-soft">{d.page}</div>
                  <div className="mt-1.5 font-serif text-[15.5px] leading-[1.55] text-ink-soft [&_em]:italic [&_em]:text-acc-deep">
                    {d.why[language]}
                  </div>
                </div>
                <div className="self-center font-mono text-[11px] uppercase tracking-[0.06em] text-acc max-md:hidden">
                  {language === "en" ? "open →" : "열기 →"}
                </div>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
