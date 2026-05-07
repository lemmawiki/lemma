import { useState, useRef, useEffect } from "react";
import { glossaryById, type Locale } from "../data/glossary";
import { useApp } from "../context/AppContext";
import { useTermsRegistry } from "../context/TermsContext";

// A term in either language; hover shows the counterpart and a one-line gloss.
// Click pins the popover open. Self-registers in the page's TermsContext so
// the page's Glossary section can show only the terms actually used here.
export function Term({ id, children }: { id: string; children?: React.ReactNode }) {
  const { language } = useApp();
  const registry = useTermsRegistry();
  const entry = glossaryById[id];
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (entry) registry?.register(id);
  }, [id, entry, registry]);

  useEffect(() => {
    if (!pinned) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPinned(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [pinned]);

  if (!entry) {
    return <span style={{ background: "#ffeeee" }}>?{id}?</span>;
  }

  const counterpartLang: Locale = language === "en" ? "ko" : "en";
  const view = entry.locales[language] ?? entry.locales.en;
  const counterView = entry.locales[counterpartLang];

  const open = pinned || hovered;
  const primary = children ?? view?.term ?? id;
  const counterpart = counterView?.term ?? "—";
  const body = view?.body ?? "";
  const flag = view?.flag;

  return (
    <span
      ref={ref}
      className="relative cursor-help border-b border-dotted border-acc font-medium text-ink hover:text-acc"
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setPinned((p) => !p);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setPinned((p) => !p);
        } else if (e.key === "Escape") {
          setPinned(false);
        }
      }}
    >
      {primary}
      {open && (
        <span
          role="presentation"
          className="absolute left-0 top-[calc(100%+8px)] z-20 block w-80 cursor-default rounded-lg border border-rule bg-bg-card px-3.5 py-3 text-left text-sm font-normal leading-[1.5] text-ink-soft shadow-[0_8px_24px_rgba(20,17,13,0.12)]"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <span className="mb-1.5 flex items-center gap-2">
            <span className="rounded-sm bg-rule-soft px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em] text-ink-mute">
              {counterpartLang.toUpperCase()}
            </span>
            <strong className="text-[15px] font-semibold text-ink">{counterpart}</strong>
          </span>
          <span className="block">{body}</span>
          {flag && (
            <span className="mt-2 block border-t border-dashed border-rule pt-2 text-[13px] text-acc-deep">
              ⚠ {flag}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
