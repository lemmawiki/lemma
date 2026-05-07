// Python code snippets shown in "code mode" on each application/module page.
// Highlighted at build time by Shiki in the .astro page frontmatter, then
// passed to the React island as pre-rendered HTML.

export const pythonCode = {
  bitcoinPizza: {
    arc1: `def future_value(P, r, t):
    return P * (1 + r) ** t

future_value(41, 1.89, 16)     # ≈ 1.0e9    (Laszlo today)
future_value(1e9, 1.89, 20)    # ≈ 1.7e18   (BTC in 2046, if it keeps pace)`,
    arc2: `from math import log

def years_to_target(P, F, r):
    return log(F / P) / log(1 + r)

years_to_target(41, 1e6, 1.89)  # ≈ 9.5  (years since May 2010)`,
    arc3: `def implied_rate(P, F, t):
    return (F / P) ** (1 / t) - 1

implied_rate(41, 1e9, 16)     # ≈ 1.89   (189% / yr — Bitcoin)
implied_rate(100, 1000, 30)   # ≈ 0.08   (8% — boring SPY-ish)`,
  },
  logarithm: {
    arc1: `import math

# every log law from one identity:
math.log10(2 * 50)              # ≈ math.log10(2) + math.log10(50)
math.log10(2 ** 10)             # ≈ 10 * math.log10(2)
math.log10(1)                   # 0.0`,
    arc3: `import numpy as np

# Naive: multiply 40 probabilities. Underflows in float32.
p = np.float32(0.1)
np.prod([p] * 40)               # → 0.0  (silent death)

# Log-space: add 40 log-probabilities. Survives.
np.sum(np.log([p] * 40))        # → -92.10  (well-defined)`,
  },
} as const;

export type CodeMap = Record<string, string>;
