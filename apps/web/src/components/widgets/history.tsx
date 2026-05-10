import { useContext, useEffect, useRef, useState } from "react";
import { AppContext, type Language } from "../../context/app-context";
import { provenanceByConcept } from "../../data/provenance";

// Provenance sidenote — when, where, by whom, and *for what real problem*
// the concept was invented. Lemma-flavored historical aside, not trivia.
//
// Renders as a small inline chip showing the year + person; click to expand
// for the one-paragraph context and a source link. Keep the chip dense so
// the prose flow isn't disturbed; let the panel hold the substance.

export function History({ concept, language: langProp }: { concept: string; language?: Language }) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const meta = provenanceByConcept[concept];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  if (!meta) {
    return <span style={{ background: "#ffeeee" }}>?history:{concept}?</span>;
  }

  const yearText = meta.yearLabel ? meta.yearLabel[language] : meta.year.toString();
  const labelHistory = language === "en" ? "history" : "역사";
  const labelSource = language === "en" ? "source" : "출처";

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          "inline-flex max-w-full items-center gap-1.5 rounded-sm border border-dotted px-1.5 py-px font-mono text-[0.93em] transition-colors max-md:px-2 max-md:py-0.5 " +
          (open
            ? "border-acc-deep bg-acc-soft text-ink"
            : "border-rule text-ink-mute hover:border-acc hover:bg-rule-soft hover:text-ink")
        }
        aria-expanded={open}
        title={labelHistory}
      >
        <svg aria-hidden width="11" height="11" viewBox="0 0 11 11" className="shrink-0">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M5.5 2.5 L5.5 5.5 L7.5 6.8" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
        <span className="lowercase tracking-[0.04em]">{yearText}</span>
        <span className="text-rule">·</span>
        <span className="truncate text-ink">{meta.who.split(",")[0].split("&")[0].trim()}</span>
        <svg
          aria-hidden
          width="9"
          height="9"
          viewBox="0 0 9 9"
          className={"shrink-0 text-ink-mute transition-transform " + (open ? "rotate-180" : "")}
        >
          <path d="M1 3 L4.5 6 L8 3" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </button>

      {open && (
        <span
          role="presentation"
          className="absolute left-0 top-[calc(100%+6px)] z-20 block w-[440px] max-w-[calc(100vw-32px)] cursor-default rounded-lg border border-rule bg-bg-card px-4 py-3.5 text-left text-sm font-normal leading-[1.5] text-ink-soft shadow-[0_8px_24px_rgba(20,17,13,0.12)] max-md:left-[-18px]"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <span className="mb-2 block">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
              {labelHistory}
            </span>
            <span className="mt-1 block grid grid-cols-[80px_1fr] gap-x-3 gap-y-1 text-[12.5px] [&_dt]:font-mono [&_dt]:uppercase [&_dt]:tracking-[0.06em] [&_dt]:text-ink-mute [&_dd]:text-ink">
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">
                {language === "en" ? "year" : "연도"}
              </span>
              <span className="font-mono text-[12.5px] text-ink">{yearText}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">
                {language === "en" ? "who" : "누가"}
              </span>
              <span className="text-[13px] text-ink">{meta.who}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">
                {language === "en" ? "where" : "어디서"}
              </span>
              <span className="text-[13px] text-ink">{meta.where}</span>
            </span>
          </span>

          <span className="mt-3 block border-t border-dashed border-rule pt-2.5 font-serif text-[14px] italic leading-[1.6] text-ink-soft [&_em]:text-acc-deep">
            {meta.oneLiner[language]}
          </span>

          {meta.source && (
            <span className="mt-2 block font-mono text-[11px] tracking-[0.04em] [&_a]:text-ink-mute [&_a]:no-underline hover:[&_a]:text-acc">
              <a href={meta.source} target="_blank" rel="noopener noreferrer">
                {labelSource} →
              </a>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
