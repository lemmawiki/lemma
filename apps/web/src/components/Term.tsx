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
      className="term"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setPinned((p) => !p);
      }}
    >
      {primary}
      {open && (
        <span className="term-pop" onClick={(e) => e.stopPropagation()}>
          <span className="term-pop-head">
            <span className={`term-pop-lang lang-${counterpartLang}`}>{counterpartLang.toUpperCase()}</span>
            <strong>{counterpart}</strong>
          </span>
          <span className="term-pop-body">{body}</span>
          {flag && <span className="term-pop-flag">⚠ {flag}</span>}
        </span>
      )}
    </span>
  );
}
