import type { ReactNode } from "react";

// Reusable card shell shared by every widget. On desktop: rounded card with
// generous padding. On mobile: bleeds to the page edge (cancels Base.astro's
// 18px main padding via -mx) and shrinks inner padding so charts get the full
// viewport width minus a small gutter.
export function WidgetShell({
  kicker,
  children,
  className = "",
}: {
  kicker?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-9 rounded-[10px] border border-rule bg-bg-card px-6 py-[22px] max-md:-mx-[18px] max-md:rounded-none max-md:border-x-0 max-md:px-3 max-md:py-4 ${className}`}
    >
      {kicker && (
        <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute">
          {kicker}
        </div>
      )}
      {children}
    </div>
  );
}
