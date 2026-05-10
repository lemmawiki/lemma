import { useContext, useState } from "react";
import { AppContext, type Language } from "../../context/app-context";
import { proofById } from "../../data/proofs";

// The Lean layer, embedded.
//
// Each <Proof id="..."> resolves to one entry in proofs.ts. The widget shows:
//   1. The plain-math statement (the headline).
//   2. The "why formalisation matters" one-liner.
//   3. A click-to-expand Lean source block with two affordances:
//        - Copy: clipboard.
//        - Open in Lean Web: opens https://live.lean-lang.org in a new tab.
//          The source is also copied so the user pastes once and runs.
//
// We deliberately do not embed a Lean compiler. The Mathlib bundle is hundreds
// of MB; offloading to live.lean-lang.org is the honest trade — we cite the
// theorem; the user runs it on the canonical playground.

const LEAN_PLAYGROUND = "https://live.lean-lang.org/";

export function Proof({ id, language: langProp }: { id: string; language?: Language }) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const entry = proofById[id];
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!entry) {
    return <span style={{ background: "#ffeeee" }}>?proof: {id}?</span>;
  }

  const statement = entry.statement[language] ?? entry.statement.en;
  const why = entry.why[language] ?? entry.why.en;

  const labelHeader = language === "en" ? "the formal contract" : "형식 계약";
  const labelWhy = language === "en" ? "what Lean reveals" : "Lean이 드러내는 것";
  const labelShow = language === "en" ? "show Lean source" : "Lean 소스 보기";
  const labelHide = language === "en" ? "hide Lean source" : "소스 숨기기";
  const labelCopy = language === "en" ? "copy" : "복사";
  const labelCopied = language === "en" ? "copied" : "복사됨";
  const labelOpen = language === "en" ? "open in Lean Web ↗" : "Lean Web에서 열기 ↗";
  const labelMathlib = language === "en" ? "mathlib" : "mathlib";
  const labelHint =
    language === "en"
      ? "Source is copied — paste it into the Lean Web editor."
      : "소스가 복사됐다 — Lean Web 에디터에 붙여넣어 실행.";

  async function copySource() {
    try {
      await navigator.clipboard.writeText(entry.lean);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard rejected (insecure context, etc.) — let the user select manually.
    }
  }

  async function openInPlayground() {
    await copySource();
    window.open(LEAN_PLAYGROUND, "_blank", "noopener,noreferrer");
  }

  return (
    <aside
      className="my-6 rounded-md border border-rule bg-rule-soft p-4 font-sans text-[14px] leading-relaxed"
      data-no-print="true"
    >
      <header className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-mute">
          {labelHeader}
        </span>
        <span className="font-mono text-[11px] text-ink-mute">
          {labelMathlib}: <span className="text-ink-soft">{entry.mathlib}</span>
        </span>
      </header>

      <p className="mb-3 font-mono text-[14.5px] text-ink">{statement}</p>

      <p className="mb-3 text-ink-soft">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute">
          {labelWhy}
        </span>
        <span className="ml-2">{why}</span>
      </p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="rounded-full border border-rule px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute hover:border-acc hover:text-acc"
        aria-expanded={expanded}
      >
        {expanded ? labelHide : labelShow}
      </button>

      {expanded && (
        <div className="mt-3">
          <pre className="overflow-x-auto rounded border border-rule bg-bg-card p-3 font-mono text-[12.5px] leading-snug text-ink">
            <code>{entry.lean}</code>
          </pre>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copySource}
              className="rounded-full border border-rule px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute hover:border-acc hover:text-acc"
            >
              {copied ? `✓ ${labelCopied}` : labelCopy}
            </button>
            <button
              type="button"
              onClick={openInPlayground}
              className="rounded-full border border-acc px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-acc hover:bg-acc-soft"
            >
              {labelOpen}
            </button>
            {copied && <span className="font-mono text-[11px] text-ink-mute">{labelHint}</span>}
          </div>
        </div>
      )}
    </aside>
  );
}
