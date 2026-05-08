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
    arc4: `import numpy as np

# Naive: multiply 40 probabilities. Underflows in float32.
p = np.float32(0.1)
np.prod([p] * 40)               # → 0.0  (silent death)

# Log-space: add 40 log-probabilities. Survives.
np.sum(np.log([p] * 40))        # → -92.10  (well-defined)`,
  },
  confidentWrong: {
    arc2: `import numpy as np

# Three logits — raw scores. No truth check anywhere.
z = np.array([2.0, 1.0, 0.5])

# Numerically stable softmax: subtract max before exp.
def softmax(z, T=1.0):
    s = z / T
    s = s - s.max()
    e = np.exp(s)
    return e / e.sum()

p = softmax(z)
# p ≈ [0.659, 0.242, 0.099]   (sums to 1)
# Same logits + 100 give the same p — softmax depends only on differences.
softmax(z + 100)
# → [0.659, 0.242, 0.099]`,
    arc3: `# In PyTorch, log_softmax + nll_loss is the numerically stable cross-entropy.
import torch
import torch.nn.functional as F

z = torch.tensor([[2.0, 1.0, 0.5]])      # logits, batch of 1
y = torch.tensor([0])                     # true class — 'cat' at index 0

log_p = F.log_softmax(z, dim=1)           # avoids log(softmax) overflow
loss  = F.nll_loss(log_p, y)
# loss ≈ 0.417  =  −log p_true  =  −log(0.659)
#
# Why log_softmax not log(softmax)?
# log(softmax) computes exp() first → overflow when logits are large.
# log_softmax keeps things in log-space the whole way through.`,
    arc5: `# The trap: a wrong score can produce a confident probability.
import numpy as np

z = np.array([5.0, 1.0, 0.5])        # model is sure of class 0
true_idx = 1                          # but truth is class 1
p = softmax(z)
# p ≈ [0.978, 0.018, 0.011]
# 97.8% confidence — and wrong.
loss = -np.log(p[true_idx])
# loss ≈ 4.0   (huge — log explodes as p_true → 0)
#
# Lower the temperature, and confidence rises further while truth is unchanged.
softmax(z, T=0.5)[0]                 # ≈ 0.99964   (even more sure)`,
  },
  bezierCurves: {
    arc2: `# A point is a 2-tuple. Lerp is one line.
def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t)

lerp((0, 0), (4, 2), 0.0)    # → (0, 0)
lerp((0, 0), (4, 2), 0.5)    # → (2, 1)
lerp((0, 0), (4, 2), 1.0)    # → (4, 2)`,
    arc3: `# De Casteljau: lerp every adjacent pair, then again, until 1 point remains.
def bezier(controls, t):
    pts = list(controls)
    while len(pts) > 1:
        pts = [lerp(pts[i], pts[i+1], t) for i in range(len(pts) - 1)]
    return pts[0]

# Cubic Bezier — four control points
P = [(0, 0), (1, 2), (3, 2), (4, 0)]
bezier(P, 0.0)   # → (0, 0)            (= P[0], starts at first)
bezier(P, 1.0)   # → (4, 0)            (= P[-1], ends at last)
bezier(P, 0.5)   # → (2.0, 1.5)         (midpoint by recursion)`,
    arc4: `# Bernstein form — algebraically equivalent to De Casteljau.
def bezier_bernstein(P, t):
    s = 1 - t
    bx = (s**3 * P[0][0] + 3*s*s*t * P[1][0]
        + 3*s*t*t * P[2][0] + t**3 * P[3][0])
    by = (s**3 * P[0][1] + 3*s*s*t * P[1][1]
        + 3*s*t*t * P[2][1] + t**3 * P[3][1])
    return (bx, by)

bezier_bernstein(P, 0.5)  # → (2.0, 1.5)   same answer, different bookkeeping
#
# B'(0) = 3(P[1] - P[0])  →  tangent at start points along P0→P1
# B'(1) = 3(P[3] - P[2])  →  tangent at end points along P2→P3
# A designer reads "the curve leans into the next handle" off these two facts.`,
  },
  bitcoinSignature: {
    arc2: `# Toy curve E: y² = x³ + 7 over F_17.
# Same shape (a=0, b=7) as secp256k1, microscopic prime.
P, A, B = 17, 0, 7
INF = None  # the point at infinity is the group identity

def add(P_, Q_):
    if P_ is INF: return Q_
    if Q_ is INF: return P_
    x1, y1 = P_; x2, y2 = Q_
    if x1 == x2 and (y1 + y2) % P == 0:
        return INF
    if P_ == Q_:
        lam = (3 * x1 * x1 + A) * pow(2 * y1, -1, P) % P
    else:
        lam = (y2 - y1) * pow(x2 - x1, -1, P) % P
    x3 = (lam * lam - x1 - x2) % P
    y3 = (lam * (x1 - x3) - y1) % P
    return (x3, y3)

def scalar_mul(k, P_):
    R = INF
    while k > 0:
        if k & 1: R = add(R, P_)
        P_ = add(P_, P_)
        k >>= 1
    return R

G = (1, 5)             # generator
N = 9                  # order of G — 9G = INF
scalar_mul(2, G)       # → (2, 10)
scalar_mul(3, G)       # → (5, 9)
scalar_mul(9, G)       # → None (= O)`,
    arc4: `# Sign a message hash with private key d, nonce k.
def sign(d, h, k):
    R = scalar_mul(k, G)
    r = R[0] % N
    s = (h + r * d) * pow(k, -1, N) % N
    if r == 0 or s == 0:
        raise ValueError("retry with another k")
    return r, s

# Toy: d = 5 (private), h = 3 (message hash), k = 7 (nonce)
sign(5, 3, 7)  # → (2, 7)`,
    arc5: `# Verify uses only public information: h, (r, s), Q.
def verify(h, r, s, Q):
    s_inv = pow(s, -1, N)
    u1 = h * s_inv % N
    u2 = r * s_inv % N
    V = add(scalar_mul(u1, G), scalar_mul(u2, Q))
    return V is not INF and V[0] % N == r

Q = scalar_mul(5, G)            # public key matching d = 5
verify(3, 2, 7, Q)              # → True

# The algebra: V = u1·G + u2·Q
#                = (h/s)G + (r/s)·dG
#                = ((h + r·d)/s)·G
#                = ((h + r·d) · k / (h + r·d))·G   # because s = (h+r·d)/k
#                = k·G = R.   So V.x mod N = r.
# Verifier never sees d. The identity holds iff signer knew d.`,
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
