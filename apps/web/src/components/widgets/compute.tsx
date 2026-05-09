import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppContext, type Language } from "../../context/app-context";
import { computes } from "../../data/computes";
import { Slider } from "./widget-primitives";

// Inline executable formula. Renders a clickable chip in the prose:
//
//   F = P · (1 + r)^t  ≈  $1B
//
// Click → popover panel appears below with sliders for each var. Drag a
// slider, the chip's result updates live. The point of TRACE: math in
// Lemma is not quoted. It runs.
//
// Reads its config from /data/computes.ts by id, so the function lives in
// JS and doesn't need to cross the Astro Island JSON boundary.

export function Compute({ id, language: langProp }: { id: string; language?: Language }) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const meta = computes[id];

  const [vars, setVars] = useState<Record<string, number>>(() => {
    if (!meta) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(meta.vars)) out[k] = v.value;
    return out;
  });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  // Close on outside click — same idiom as <Term/>.
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const result = useMemo(() => {
    if (!meta) return NaN;
    try {
      return meta.fn(vars);
    } catch {
      return NaN;
    }
  }, [meta, vars]);

  if (!meta) {
    return <span style={{ background: "#ffeeee" }}>?compute:{id}?</span>;
  }

  const formatted = meta.format(result, vars);
  const reset = () => {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(meta.vars)) out[k] = v.value;
    setVars(out);
  };
  const isDirty = Object.entries(meta.vars).some(([k, v]) => vars[k] !== v.value);

  const labelOpen = language === "en" ? "show inputs" : "입력 보기";
  const labelClose = language === "en" ? "hide" : "닫기";
  const labelReset = language === "en" ? "reset" : "초기화";
  const labelResult = language === "en" ? "result" : "결과";

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          "inline-flex max-w-full items-center gap-1.5 rounded-sm border border-dotted px-1.5 py-px font-mono text-[0.95em] transition-colors " +
          (open
            ? "border-acc-deep bg-acc-soft text-ink"
            : isDirty
              ? "border-acc bg-acc-soft/60 text-ink"
              : "border-acc bg-rule-soft text-ink hover:bg-acc-soft hover:text-ink")
        }
        aria-expanded={open}
        title={open ? labelClose : labelOpen}
      >
        <span className="whitespace-nowrap">{meta.formula}</span>
        <span className="text-acc-deep">≈</span>
        <span className="whitespace-nowrap font-semibold text-acc-deep">{formatted}</span>
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
          className="absolute left-0 top-[calc(100%+6px)] z-20 block w-[420px] max-w-[calc(100vw-32px)] cursor-default rounded-lg border border-rule bg-bg-card px-4 py-3.5 text-left text-sm font-normal leading-[1.5] text-ink-soft shadow-[0_8px_24px_rgba(20,17,13,0.12)] max-md:left-[-18px]"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <span className="mb-3 flex items-baseline gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
              {meta.formula}
            </span>
            {isDirty && (
              <button
                type="button"
                onClick={reset}
                className="ml-auto rounded-full border border-rule px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-mute hover:border-acc hover:text-acc"
              >
                {labelReset}
              </button>
            )}
          </span>

          <span className="block grid gap-2">
            {Object.entries(meta.vars).map(([key, v]) => {
              const cur = vars[key] ?? v.value;
              return (
                <span key={key} className="block">
                  <Slider
                    label={
                      <>
                        <span className="font-mono">{key}</span>{" "}
                        <span className="text-ink-mute">· {v.label[language]}</span>
                      </>
                    }
                    value={cur}
                    onChange={(nv) => setVars((prev) => ({ ...prev, [key]: nv }))}
                    min={v.range[0]}
                    max={v.range[1]}
                    step={v.step ?? 0.01}
                    accent="var(--color-acc)"
                    display={v.format ? v.format(cur) : cur.toString()}
                  />
                </span>
              );
            })}
          </span>

          <span className="mt-3 flex items-baseline justify-between gap-3 border-t border-dashed border-rule pt-2.5 font-mono text-[12.5px]">
            <span className="text-ink-mute">{labelResult}</span>
            <span className="font-semibold text-acc-deep">{formatted}</span>
          </span>

          {meta.caption && (
            <span className="mt-2 block border-t border-dashed border-rule pt-2 text-[12.5px] italic text-ink-soft [&_em]:text-acc-deep">
              {meta.caption[language]}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
