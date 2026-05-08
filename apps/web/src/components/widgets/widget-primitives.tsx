import type { ReactNode } from "react";

// Shared widget primitives. Extracted because the same Slider, Stat, and pill
// button were inlined verbatim across most widgets. Keep this file small and
// behavior-preserving — primitives only earn a place here when a second
// consumer copies them.

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  accent = "var(--ink)",
  display,
  warn,
}: {
  label: ReactNode;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  accent?: string;
  display?: ReactNode;
  warn?: ReactNode;
}) {
  return (
    <label className="grid grid-cols-[140px_1fr_70px] items-center gap-3 text-[13px] max-md:grid-cols-[100px_1fr_56px]">
      <span className="inline-flex items-center gap-1.5 font-mono text-ink-mute">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
          style={{ background: accent }}
          aria-hidden
        />
        {label}
      </span>
      <input
        type="range"
        className="w-full"
        style={{ accentColor: accent }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <span className="text-right font-mono text-[12.5px] text-ink">{display ?? value}</span>
      {warn && <span className="col-span-3 mt-0.5 text-[11.5px] text-acc-deep">⚠ {warn}</span>}
    </label>
  );
}

export function Stat({
  label,
  value,
  color,
}: {
  label: ReactNode;
  value: ReactNode;
  color?: string;
}) {
  return (
    <div className="grid">
      <span className="text-ink-mute">{label}</span>
      <span className="text-ink" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

// `Row` keeps two values on one baseline (label · value), used inside
// computation panels. Stat stacks vertically; Row aligns horizontally.
export function Row({
  label,
  value,
  color,
}: {
  label: ReactNode;
  value: ReactNode;
  color?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-3">
      <span className="text-ink-mute">{label}</span>
      <span className="text-ink" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

export function pillClass(on: boolean): string {
  const base = "rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors";
  return on
    ? `${base} border-ink bg-ink text-bg`
    : `${base} border-rule bg-bg text-ink-soft hover:border-acc hover:text-acc`;
}
