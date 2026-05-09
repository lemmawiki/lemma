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
  derivatives: {
    arc2: `# Average rate of change — the secant slope. Two points, one division.
def average_rate(f, a, b):
    return (f(b) - f(a)) / (b - a)

f = lambda t: t * t            # x(t) = t² — toy "position"
average_rate(f, 1, 3)          # → 4.0   (position went 1 → 9 in 2 seconds)`,
    arc3: `# Instantaneous rate — shrink the interval and watch the secant slope
# converge to the tangent slope. No epsilon-delta; just shrink and look.
def secant_slope(f, a, h):
    return (f(a + h) - f(a)) / h

[secant_slope(f, 3, h) for h in (1, 0.1, 0.01, 0.0001)]
# → [7.0, 6.1, 6.01, 6.0001]
# The pattern: 6 + h. The limit as h → 0 is 6.
# That's f'(3) for f(t) = t².  In general, f'(t) = 2t.`,
    arc5: `# Position → velocity → acceleration. Same machine, applied twice.
# Projectile: y(t) = v₀ sin θ · t − ½ g t²    (from /physics/projectile-motion)
#   dy/dt = v₀ sin θ − g t                    (vertical velocity)
#   d²y/dt² = −g                              (vertical acceleration — constant)
#
# Pendulum (small-angle): θ(t) = θ₀ cos(ω t),  ω = √(g/L)
#   dθ/dt  = −θ₀ ω sin(ω t)
#   d²θ/dt² = −θ₀ ω² cos(ω t) = −ω² · θ(t)   ← simple harmonic motion
#
# Each application's equation of motion is one or two derivatives applied
# to the position function. The derivative is the shared tool.`,
  },
  gradientDescent: {
    arc2: `# Toy: one parameter w, one example (x, y) = (2, 6).
# Loss(w) = (w·x − y)²   = quadratic in w, minimum at w* = y/x = 3.
def loss(w, x, y):
    return (w * x - y) ** 2

def grad(w, x, y):
    # d/dw [(wx − y)²] = 2x(wx − y).
    return 2 * x * (w * x - y)

x, y = 2, 6
loss(0.0, x, y)        # → 36     (way off)
loss(3.0, x, y)        # → 0      (perfect)
grad(0.0, x, y)        # → −24    (loss decreases as w grows)
grad(3.0, x, y)        # → 0      (no signal at the minimum)`,
    arc4: `# The descent loop, in five lines. The shape that scales to neural nets.
def descent(w0, lr, x, y, steps=20):
    w = w0
    for _ in range(steps):
        w = w - lr * grad(w, x, y)
    return w

descent(0.0, lr=0.04, x=x, y=y, steps=20)   # → 2.95   slow but stable
descent(0.0, lr=0.12, x=x, y=y, steps=20)   # → 3.00   fast, near-Newton
descent(0.0, lr=0.27, x=x, y=y, steps=20)   # → ~10⁵  diverged

# The single requirement for stability on a quadratic with second
# derivative c is η < 2/c. Here c = L''(w) = 2x² = 8, so η < 0.25.
# Beyond that, every "step" overshoots more than it corrects, and
# the iterates explode geometrically.`,
    arc6: `# Same loop, real ML.
# Replace the toy parameter w with a parameter VECTOR θ.
# Replace the toy gradient with the partial derivatives ∂L/∂θᵢ.
# Replace the single example with a SUM (or mini-batch average) over data.
#
# Pseudocode for a one-layer linear classifier with cross-entropy loss
# (the loss from /ml/confident-wrong) — same descent, more axes:
#
# for batch in data_loader:
#     ŷ = softmax(W @ batch.x)            # forward
#     L = cross_entropy(ŷ, batch.y)       # loss
#     g = autograd.grad(L, W)             # ∇_W L  via reverse-mode autodiff
#     W = W - lr * g                       # one step
#
# autograd ≠ a new idea; it's *bookkeeping for the chain rule* applied
# to the same gradient operation arc 3 derives by hand. Walk downhill,
# but with millions of axes and a clock.`,
  },
  curveIntersections: {
    arc4: `# Engine pipeline: solve, classify, render. Bezout count = 4 always
# for two conics; the picture only shows the real-affine subset.
import numpy as np

def conic_resultant(c1, c2):
    """y-resultant of two conics → quartic in x. (Same as bezout module.)"""
    a1, b1, cc1, d1, e1, k1 = c1
    a2, b2, cc2, d2, e2, k2 = c2
    P = np.polynomial.Polynomial
    A1, A2 = cc1, cc2
    B1, B2 = P([e1, b1]), P([e2, b2])
    C1, C2 = P([k1, d1, a1]), P([k2, d2, a2])
    return (A1*C2 - A2*C1)**2 - (A1*B2 - A2*B1)*(B1*C2 - B2*C1)

def classify(roots, eps=1e-6):
    """Group complex roots into 'real-affine' (visible) and 'complex' (off-plane)."""
    visible, off_plane = [], []
    for r in roots:
        if abs(r.imag) < eps:
            visible.append(r.real)
        else:
            off_plane.append(r)
    return visible, off_plane

# Two ellipses, perpendicular major axes — the "general" preset.
c1 = (1/4, 0, 1,    0, 0, -1)
c2 = (1,   0, 1/4,  0, 0, -1)
roots = conic_resultant(c1, c2).roots()
visible, hidden = classify(roots)
len(visible), len(hidden)        # → (4, 0)   four visible crossings

# Two disjoint ellipses — the "disjoint" preset.
c2_far = (9, 0, 1, 0, -10, 24)
roots2 = conic_resultant(c1, c2_far).roots()
v2, h2 = classify(roots2)
len(v2), len(h2)                 # → (0, 4)   nothing on screen, all complex
# Bezout 4 = 0 visible + 4 hidden. The "disjoint" pair never lost the count;
# the renderer just had no place to draw the imaginary parts.`,
  },
  pendulumClock: {
    arc4: `import math

# Linearized pendulum: small-angle solution.
# θ̈ = −(g/L)·sin θ   →   (sin θ ≈ θ)   →   θ̈ = −(g/L)·θ
# Solutions are simple harmonic: θ(t) = θ₀·cos(ω·t),  ω = √(g/L).
def theta(t, L, g, theta0):
    omega = math.sqrt(g / L)
    return theta0 * math.cos(omega * t)

def period_small(L, g):
    return 2 * math.pi * math.sqrt(L / g)

period_small(1.0, 9.8)            # ≈ 2.007 s   (1-meter rod on Earth)
period_small(1.0, 1.62)           # ≈ 4.929 s   (same rod on the Moon)`,
    arc6: `# What the small-angle formula is missing — Borda's leading correction.
# Real period grows with amplitude: T(θ₀) ≈ T₀ · (1 + θ₀²/16).
def period_corrected(L, g, theta0_rad):
    return period_small(L, g) * (1 + theta0_rad**2 / 16)

# How much does the clock drift if the bob actually swings 30°?
T0  = period_small(1.0, 9.8)
T30 = period_corrected(1.0, 9.8, math.radians(30))
(T30 - T0) / T0 * 100              # ≈ 1.7 %   slow, every period

# 60° (a wild swing) gives ~6.9 % slow — many minutes per day. The
# actual clocks of the 17th century constrained the bob to small
# arcs (the cycloidal-cheek trick); modern ones use escapements that
# keep the amplitude small enough for the linear approximation to
# stay nearly true. The whole technology is built around the lie.`,
  },
  projectileMotion: {
    arc2: `import math

# Two motions, independent. The horizontal one ignores gravity;
# the vertical one ignores horizontal velocity.
def position(t, v0, theta_deg, g):
    th = math.radians(theta_deg)
    x = v0 * math.cos(th) * t           # uniform velocity → linear in t
    y = v0 * math.sin(th) * t - 0.5 * g * t**2  # constant accel → quadratic
    return x, y

def velocity(t, v0, theta_deg, g):
    th = math.radians(theta_deg)
    return v0 * math.cos(th), v0 * math.sin(th) - g * t

position(0.0, 20, 45, 9.8)   # → (0.0, 0.0)         start
position(1.0, 20, 45, 9.8)   # → (14.14, 9.24)
velocity(1.0, 20, 45, 9.8)   # → (14.14, 4.34)      vy decreased`,
    arc3: `# Eliminate t. Substitute t = x / (v0 cos θ) into y(t):
#   y = (tan θ) · x  −  g · x² / (2 v0² cos²θ)
# That's a quadratic in x — a parabola. The motion's image, with
# the time-axis collapsed.
def trajectory(x, v0, theta_deg, g):
    th = math.radians(theta_deg)
    a = -g / (2 * v0**2 * math.cos(th)**2)
    b = math.tan(th)
    return a * x**2 + b * x

trajectory(14.14, 20, 45, 9.8)  # → 9.24   (matches y from arc2 — same image)`,
    arc4: `# Standard closed forms — read off the parabola without solving anything.
def t_peak(v0, theta_deg, g):
    return v0 * math.sin(math.radians(theta_deg)) / g

def t_land(v0, theta_deg, g):
    return 2 * t_peak(v0, theta_deg, g)        # symmetric flight

def range_(v0, theta_deg, g):
    return v0**2 * math.sin(math.radians(2 * theta_deg)) / g

def y_max(v0, theta_deg, g):
    return v0**2 * math.sin(math.radians(theta_deg))**2 / (2 * g)

range_(20, 45, 9.8)   # → 40.82  (max range at 45° on a flat field)
y_max(20, 45, 9.8)    # → 10.20`,
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
  vectors: {
    arc3: `# A vector is a tuple. Component-wise addition. Scalar multiplication.
# That's the whole arithmetic — every role uses these two operations.
def add(u, v):
    return tuple(a + b for a, b in zip(u, v))

def scale(c, v):
    return tuple(c * a for a in v)

A = (2, 1)
v = (3, 4)
add(A, v)              # → (5, 5)        (location → location)
scale(2, v)            # → (6, 8)        (twice the displacement)
scale(-1, v)           # → (-3, -4)      (the reverse)
add(A, scale(-1, v))   # → (-1, -3)      (going backward from A)`,
    arc4: `# Same arithmetic, four roles. The tuple is the same; the application slot
# is what gives it meaning.

# graphics: shift one Bezier control point by v.
control = (200, 60)
new_control = add(control, v)            # the curve translates with it.

# physics: a position-and-velocity update.
pos     = (0.0, 0.0)
vel     = (10.0, 14.0)         # m/s
dt      = 0.05                  # s
new_pos = add(pos, scale(dt, vel))        # one Euler step.

# ML: one gradient-descent step on a 2-parameter weight vector.
weights = (0.0, 0.0)
grad    = (-2.4, -1.8)         # ∇L at current weights
lr      = 0.1
new_weights = add(weights, scale(-lr, grad))

# In every block: add(point, scale(c, vector)). Same six characters of math.`,
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
