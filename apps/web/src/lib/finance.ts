// F = P · (1 + r)^t
// Three operations to extract three unknowns.

export function futureValue(P: number, r: number, t: number): number {
  return P * Math.pow(1 + r, t);
}

// Solve for t: log answers "how many doublings / years / steps?"
export function yearsToTarget(P: number, F: number, r: number): number {
  return Math.log(F / P) / Math.log(1 + r);
}

// Solve for r: nth root answers "what rate per step?"
export function impliedRate(P: number, F: number, t: number): number {
  return Math.pow(F / P, 1 / t) - 1;
}

export function formatCurrency(x: number): string {
  if (!isFinite(x)) return "∞";
  if (x >= 1e12) return `$${(x / 1e12).toFixed(2)}T`;
  if (x >= 1e9) return `$${(x / 1e9).toFixed(2)}B`;
  if (x >= 1e6) return `$${(x / 1e6).toFixed(2)}M`;
  if (x >= 1e3) return `$${(x / 1e3).toFixed(2)}K`;
  return `$${x.toFixed(2)}`;
}

export function formatYears(t: number): string {
  if (!isFinite(t) || isNaN(t)) return "—";
  return `${t.toFixed(1)} yr`;
}

export function formatPercent(r: number): string {
  if (!isFinite(r) || isNaN(r)) return "—";
  return `${(r * 100).toFixed(2)}%`;
}
