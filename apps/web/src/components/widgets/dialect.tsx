import { useContext, useEffect, useRef, useState } from "react";
import { AppContext, type Language } from "../../context/app-context";
import { dialectByConcept, FIELD_LABEL } from "../../data/dialects";

// Inline notation dialect map. Renders a small chip in the prose:
//
//   notation across fields  →  4
//
// Click → expand panel showing how each field writes the same concept,
// with a one-line note about why. Same "Lemma is bilingual at the term
// level" DNA, extended one dimension: now also multi-dialect at the
// notation level. A reader coming from ML sees ML notation; a reader
// from physics sees physics notation. Both can see the others' too.
//
// Same close-on-outside idiom as <Term> and <Compute>.

export function Dialect({ concept, language: langProp }: { concept: string; language?: Language }) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const meta = dialectByConcept[concept];
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
    return <span style={{ background: "#ffeeee" }}>?dialect:{concept}?</span>;
  }

  const labelTitle = language === "en" ? "notation across fields" : "분야별 표기";
  const fieldsCount = meta.dialects.length;

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
        title={labelTitle}
      >
        <svg aria-hidden width="11" height="11" viewBox="0 0 11 11" className="shrink-0">
          <path
            d="M3 1 L3 10 M3 1 L7 1 L7 5 L3 5 M3 6 L8 6 L8 10 L3 10"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <span className="lowercase tracking-[0.04em]">{labelTitle}</span>
        <span className="text-acc-deep">·</span>
        <span className="text-acc-deep">{fieldsCount}</span>
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
              {labelTitle}
            </span>
            <span className="mt-1 block font-serif text-[15.5px] font-semibold text-ink">
              {meta.title[language]}
            </span>
            <span className="mt-1 block text-[13.5px] italic text-ink-soft">
              {meta.description[language]}
            </span>
          </span>

          <span className="mt-2 block divide-y divide-rule border-t border-rule">
            {meta.dialects.map((d) => (
              <span
                key={`${d.field}-${d.notation}`}
                className="grid grid-cols-[80px_1fr] gap-3 py-2"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-acc">
                  {FIELD_LABEL[d.field][language]}
                </span>
                <span className="block">
                  <span className="font-mono text-[14px] font-semibold text-ink">{d.notation}</span>
                  {d.note && (
                    <span className="mt-0.5 block text-[12.5px] text-ink-soft">
                      {d.note[language]}
                    </span>
                  )}
                </span>
              </span>
            ))}
          </span>
        </span>
      )}
    </span>
  );
}
