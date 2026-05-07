import type { ReactNode } from "react";

// Astro handles routing — anchors trigger full-page navigation. We keep the
// `Link` export so view components don't need to be touched during the Vite→
// Astro migration. View Transitions can be layered in later for SPA feel.
export function Link({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}
