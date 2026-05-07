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
  bezout: {
    arc4: `# The disjoint-circles example, hand-eliminated.
# C1: x² + y² − 1     = 0
# C2: (x − 3)² + y² − 1 = 0
# Subtract: −6x + 9 = 0  →  x = 3/2.
# Plug back into C1: y² = 1 − 9/4 = −5/4  →  y = ± i √5 / 2.
import cmath
x = 3 / 2
ys = (cmath.sqrt(1 - x**2), -cmath.sqrt(1 - x**2))
[(x, y) for y in ys]
# → [(1.5, 1.118j), (1.5, -1.118j)]   (two complex intersections)`,
    arc6: `# Sylvester resultant of two conics in y → quartic in x.
import numpy as np

def resultant_y(c1, c2):
    """Each conic c = (a, b, c, d, e, k) for a x² + b xy + c y² + d x + e y + k.
       In y: A_i y² + B_i(x) y + C_i(x), with A_i = c_i, B_i = b_i x + e_i,
       C_i = a_i x² + d_i x + k_i.  Resultant in y of two quadratics is
       (A1 C2 − A2 C1)² − (A1 B2 − A2 B1)(B1 C2 − B2 C1)."""
    a1, b1, cc1, d1, e1, k1 = c1
    a2, b2, cc2, d2, e2, k2 = c2
    P = np.polynomial.Polynomial
    A1, A2 = cc1, cc2
    B1, B2 = P([e1, b1]), P([e2, b2])
    C1, C2 = P([k1, d1, a1]), P([k2, d2, a2])
    return (A1*C2 - A2*C1)**2 - (A1*B2 - A2*B1)*(B1*C2 - B2*C1)

# General preset: x²/4 + y² − 1 = 0   and   x² + y²/4 − 1 = 0
c1 = (1/4, 0, 1,    0, 0, -1)
c2 = (1,   0, 1/4,  0, 0, -1)
sorted(np.round(resultant_y(c1, c2).roots(), 4))
# → [(-0.8944+0j), (-0.8944+0j), (0.8944+0j), (0.8944+0j)]
#   (each root with multiplicity 2; the two y-values per x come back from c1)`,
  },
} as const;

export type CodeMap = Record<string, string>;
