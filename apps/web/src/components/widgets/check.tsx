import { useContext, useMemo, useState } from "react";
import { AppContext, type Language } from "../../context/app-context";
import { computes } from "../../data/computes";

// In-page grader. The reader does the calculation by hand, types the answer
// into a small input, and Lemma judges it against either:
//
//   <Check expected={970843754} unit="$" tolerance="1%" />     literal
//   <Check compute="bitcoin-pizza-future-value" unit="$" />    compute fn
//   <Check compute="bitcoin-pizza-future-value" vars={{ r: 0.5 }} />  override defaults
//
// Manifesto direct: P2 says "watch then solve by hand" — Compute already
// does the watching; Check makes the hand-solving *checkable* without
// flipping to a calculator app.
//
// Tolerance default: 1% — generous enough that a clean by-hand calc with
// rounding (log₁₀(2) ≈ 0.301, etc.) lands as correct. Author can tighten
// to "0.1%" or "exact" for tight problems, or widen to "10%" for ballparks.

type ToleranceMode = "exact" | "abs" | "rel";

interface ToleranceSpec {
  mode: ToleranceMode;
  value: number;
}

function parseTolerance(t: string | number | undefined): ToleranceSpec {
  if (t === undefined) return { mode: "rel", value: 0.01 };
  if (typeof t === "number") return { mode: "abs", value: Math.abs(t) };
  const trimmed = t.trim();
  if (trimmed === "exact" || trimmed === "0") return { mode: "exact", value: 0 };
  if (trimmed.endsWith("%")) {
    const v = parseFloat(trimmed.slice(0, -1));
    if (!Number.isFinite(v) || v < 0) return { mode: "rel", value: 0.01 };
    return { mode: "rel", value: v / 100 };
  }
  const v = parseFloat(trimmed);
  if (!Number.isFinite(v) || v < 0) return { mode: "rel", value: 0.01 };
  return { mode: "abs", value: v };
}

function judge(
  user: number,
  expected: number,
  tol: ToleranceSpec,
): { ok: boolean; offBy: number; offRel: number } {
  const offBy = user - expected;
  const offRel = expected !== 0 ? Math.abs(offBy) / Math.abs(expected) : Infinity;
  let ok = false;
  if (tol.mode === "exact") ok = user === expected;
  else if (tol.mode === "abs") ok = Math.abs(offBy) <= tol.value;
  else ok = offRel <= tol.value;
  return { ok, offBy, offRel };
}

function fmtSci(v: number): string {
  if (!Number.isFinite(v)) return "—";
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e6 || (a < 0.01 && a > 0)) return v.toExponential(2);
  return v.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function Check({
  expected: expectedProp,
  compute,
  vars,
  unit,
  tolerance,
  language: langProp,
}: {
  expected?: number;
  compute?: string;
  vars?: Record<string, number>;
  unit?: string;
  tolerance?: string | number;
  language?: Language;
}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";

  // Resolve expected: prefer literal `expected`, else evaluate the named
  // compute against its defaults overlaid with any `vars` overrides.
  const expected = useMemo(() => {
    if (typeof expectedProp === "number") return expectedProp;
    if (compute) {
      const meta = computes[compute];
      if (!meta) return null;
      const merged: Record<string, number> = {};
      for (const [k, v] of Object.entries(meta.vars)) merged[k] = v.value;
      if (vars) for (const [k, v] of Object.entries(vars)) merged[k] = v;
      try {
        return meta.fn(merged);
      } catch {
        return null;
      }
    }
    return null;
  }, [expectedProp, compute, vars]);

  const tol = useMemo(() => parseTolerance(tolerance), [tolerance]);
  const [raw, setRaw] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  if (expected === null) {
    return <span style={{ background: "#ffeeee" }}>?check: missing expected/compute?</span>;
  }

  const userValue = parseFloat(raw);
  const validInput = Number.isFinite(userValue);
  const verdict = validInput ? judge(userValue, expected, tol) : null;

  function submit() {
    if (validInput) setSubmitted(true);
  }

  const labelHand = language === "en" ? "your answer" : "내 답";
  const labelSubmit = language === "en" ? "check" : "확인";
  const labelCorrect = language === "en" ? "correct" : "정답";
  const labelClose = language === "en" ? "close — within" : "근접 — 오차";
  const labelOff = language === "en" ? "off" : "차이";
  const labelReveal = language === "en" ? "reveal answer" : "답 보기";
  const labelHide = language === "en" ? "hide answer" : "답 숨기기";
  const labelOrder = language === "en" ? "order of magnitude wrong" : "자릿수가 다름";

  return (
    <span
      className="mt-3 inline-flex max-w-full flex-wrap items-baseline gap-2 rounded-md border border-rule bg-rule-soft px-3 py-2 align-middle font-mono text-[13px]"
      data-no-print="true"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">
        {labelHand}
      </span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setSubmitted(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder={unit ?? "—"}
        className="min-w-0 max-w-[140px] flex-shrink rounded-sm border border-rule bg-bg-card px-2 py-0.5 font-mono text-[13px] text-ink focus:border-acc focus:outline-none"
        aria-label={labelHand}
      />
      {unit && <span className="text-ink-mute">{unit}</span>}
      <button
        type="button"
        onClick={submit}
        disabled={!validInput}
        className={
          "rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.06em] transition-colors " +
          (validInput
            ? "border-acc text-acc hover:bg-acc-soft"
            : "border-rule text-ink-mute opacity-50")
        }
      >
        {labelSubmit}
      </button>

      {submitted && verdict && (
        <span className="ml-1 inline-flex items-baseline gap-1.5">
          {verdict.ok ? (
            <span className="font-semibold text-green">✓ {labelCorrect}</span>
          ) : verdict.offRel < 1 ? (
            <span className="text-acc-deep">
              {labelClose} {(verdict.offRel * 100).toFixed(verdict.offRel < 0.1 ? 2 : 1)}%
            </span>
          ) : verdict.offRel < 9 ? (
            <span className="text-acc-deep">
              ✗ {labelOff} {fmtSci(verdict.offBy)}
            </span>
          ) : (
            <span className="text-acc-deep">✗ {labelOrder}</span>
          )}
        </span>
      )}

      <button
        type="button"
        onClick={() => setShowAnswer((s) => !s)}
        className="ml-auto rounded-full border border-rule px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute hover:border-acc hover:text-acc"
      >
        {showAnswer ? labelHide : labelReveal}
      </button>

      {showAnswer && (
        <span className="block w-full pt-1.5 font-mono text-[12.5px] text-ink-soft">
          {unit ?? ""}
          {fmtSci(expected)}
        </span>
      )}
    </span>
  );
}
