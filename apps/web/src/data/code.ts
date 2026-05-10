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
  linearization: {
    arc2: `import math

# Linearization of f at a:  L_a(x) = f(a) + f'(a) · (x − a).
# Choose anchor a, compare with the true value over a range of x.
def linearize(f, fprime, a):
    fa, slope = f(a), fprime(a)
    return lambda x: fa + slope * (x - a)

L0 = linearize(math.sin, math.cos, a=0)    # tangent at 0 is y = x
[(round(x, 2), round(math.sin(x), 4), round(L0(x), 4))
 for x in (0.05, 0.2, 0.5, 1.0)]
# → [(0.05, 0.0500, 0.0500),    # < 0.0001 error
#    (0.2,  0.1987, 0.2000),    # 0.001
#    (0.5,  0.4794, 0.5000),    # 0.02
#    (1.0,  0.8415, 1.0000)]    # 0.16  — visibly bad`,
    arc3: `# Error scales as (x − a)², not as (x − a). Quadratic, not linear.
# Doubling the deviation quadruples the error.
def error_ratio(f, L, a, x):
    return (f(x) - L(x)) / (x - a) ** 2 if x != a else None

[error_ratio(math.sin, L0, 0, x) for x in (0.05, 0.1, 0.2, 0.4, 0.8)]
# → roughly all near −0.166  (≈ −1/6)
# The leading Taylor remainder for sin near 0 is −x³/6, so dividing by
# (x − a)² gives roughly −x/6, drifting slowly with x. The shape "error
# = constant·deviation²" is the dominant term in every linearization;
# all you have to read off is the constant.`,
    arc4: `# Newton's method: solve f(x) = 0 by repeatedly linearizing at the
# current guess, then finding where THAT line crosses zero.
def newton(f, fprime, x0, steps=5):
    x = x0
    for _ in range(steps):
        x = x - f(x) / fprime(x)         # the root of the tangent line
    return x

# Fixed point of cos:  solve cos(x) − x = 0 starting near 0.5.
newton(lambda x: math.cos(x) - x,
       lambda x: -math.sin(x) - 1,
       x0=0.5)
# → 0.7390851332151607     (the Dottie number)
#
# Each Newton step IS a linearization step. Gradient descent is the
# same recipe applied to ∇L instead of f, with a fixed-size step (η)
# instead of the exact root of the tangent.`,
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
  tfIdf: {
    arc2: `# tf — count, normalized by doc length.
docs = [
    "the cat sat on the mat",
    "the dog ran fast",
    "cat and dog are friends",
    "the quick brown fox",
]
toks = [d.split() for d in docs]

def tf(term, doc):
    return doc.count(term) / len(doc)

# 'cat' in each doc — note doc 0 is longer, so its tf is smaller
# even though both contain 'cat' once.
[round(tf("cat", d), 3) for d in toks]
# → [0.167, 0.0, 0.2, 0.0]
#
# That length normalization is the whole reason: doc 2 "wins" between
# the two cat-containing docs because its sentence is shorter.`,
    arc3: `from math import log2

N = len(toks)

def df(term):
    return sum(1 for d in toks if term in d)

def idf(term):
    d = df(term)
    return log2(N / d) if d else 0.0

[(t, df(t), round(idf(t), 2)) for t in ("the", "cat", "fox")]
# → [('the', 3, 0.42),    # 3 of 4 docs → barely any signal
#    ('cat', 2, 1.00),    # half the corpus → 1 bit
#    ('fox', 1, 2.00)]    # rarest → 2 bits
#
# A query word that lives in every doc gives 0 bits — the score
# learned to ignore stopwords without anyone hard-coding them.`,
    arc5: `# The score: tf · idf, summed over query terms.
def score(query, doc):
    return sum(tf(t, doc) * idf(t) for t in query.split())

ranking = sorted(
    range(N),
    key=lambda i: -score("the", toks[i]),  # try also "fox", "cat dog"
)

# Compare to the raw-count baseline.
def raw(query, doc):
    return sum(doc.count(t) for t in query.split())

# Query "the": raw count picks doc 0 (uses 'the' twice, longest doc).
# TF-IDF picks... barely anything — every score is near zero, because
# log2(4/3) ≈ 0.42 bits. The trap of "popular doc wins" is closed.
[round(raw("the", d), 3)   for d in toks]   # → [2, 1, 0, 1]
[round(score("the", d), 3) for d in toks]   # → [0.139, 0.104, 0, 0.104]`,
  },
  dampedOscillator: {
    arc2: `import numpy as np

# Equation: ẍ + 2γ·ẋ + ω₀²·x = F·cos(ω·t)
# Three free-decay regimes (F = 0), determined by γ vs ω₀.
omega0 = 1.0

def simulate(gamma, omega_drive=0.0, F=0.0, T=30, dt=0.05, x0=1, v0=0):
    """RK4 integration of the damped driven oscillator."""
    n = int(T / dt) + 1
    t = np.zeros(n); x = np.zeros(n); v = np.zeros(n)
    x[0], v[0] = x0, v0
    accel = lambda x_, v_, t_: (-2*gamma*v_ - omega0**2*x_
                                 + F*np.cos(omega_drive*t_))
    for i in range(1, n):
        t[i] = i * dt
        k1x, k1v = v[i-1], accel(x[i-1], v[i-1], t[i-1])
        k2x = v[i-1] + dt/2 * k1v
        k2v = accel(x[i-1] + dt/2 * k1x, v[i-1] + dt/2 * k1v, t[i-1] + dt/2)
        k3x = v[i-1] + dt/2 * k2v
        k3v = accel(x[i-1] + dt/2 * k2x, v[i-1] + dt/2 * k2v, t[i-1] + dt/2)
        k4x = v[i-1] + dt * k3v
        k4v = accel(x[i-1] + dt * k3x, v[i-1] + dt * k3v, t[i])
        x[i] = x[i-1] + dt/6 * (k1x + 2*k2x + 2*k3x + k4x)
        v[i] = v[i-1] + dt/6 * (k1v + 2*k2v + 2*k3v + k4v)
    return t, x

# Three free-decay regimes from displaced start (x=1, v=0):
[(name, simulate(gamma=g)[1][-1]) for name, g in
 (("undamped", 0.0), ("under-damped", 0.1),
  ("critical", 1.0), ("over-damped", 2.0))]
# undamped:    final x oscillates near ±1   (no decay)
# under:       final x near 0 after many cycles, but visibly oscillates
# critical:    final x essentially 0, no oscillation (fastest return)
# over:        final x slightly above 0, slow exponential return`,
    arc4: `# Steady-state amplitude as a function of driving frequency:
# A(ω) = F / sqrt((ω₀² − ω²)² + (2γω)²)
# — a closed-form 'frequency response' that emerges by plugging
# x(t) = A·cos(ωt − φ) into the forced equation and collecting cos / sin.
def amplitude(omega, gamma, omega0=1.0, F=1.0):
    a = omega0**2 - omega**2
    b = 2 * gamma * omega
    return F / np.sqrt(a*a + b*b)

# Peak location (where the response is largest):
# d/dω [A] = 0  →  ω_peak = sqrt(ω₀² − 2γ²)   (for γ < ω₀/√2)
# For very small γ, ω_peak ≈ ω₀ — the natural frequency.
def peak_omega(gamma, omega0=1.0):
    if gamma >= omega0 / np.sqrt(2):
        return 0.0  # no peak — overdamped frequency response
    return np.sqrt(omega0**2 - 2*gamma**2)

[(g, peak_omega(g), amplitude(peak_omega(g) or 0.001, g))
 for g in (0.05, 0.1, 0.3, 0.7, 1.0)]
# γ=0.05  → peak at 0.997, A ≈ 10        sharp resonance
# γ=0.1   → peak at 0.990, A ≈ 5.0
# γ=0.3   → peak at 0.906, A ≈ 1.7
# γ=0.7   → peak at ~0,    A ≈ 1.4       no real resonance peak
# Lighter damping → sharper peak. The Q-factor 1/(2γ/ω₀) measures this
# 'sharpness' directly; a high-Q oscillator (laser cavity, atomic clock)
# is the same equation with γ pushed near zero.`,
    arc5: `# Resonance with energy bookkeeping: average the power F·v over a few
# cycles and watch energy build up coherently when ω = ω₀.
def energy_input(gamma, omega_drive, F=1.0, T=50, dt=0.01):
    omega0 = 1.0
    t = np.arange(0, T, dt)
    A = amplitude(omega_drive, gamma)
    a = omega0**2 - omega_drive**2
    b = 2 * gamma * omega_drive
    phi = np.arctan2(b, a)
    v = -A * omega_drive * np.sin(omega_drive * t - phi)
    forcing = F * np.cos(omega_drive * t)
    return float(np.mean(forcing * v))

[(omega_drive, energy_input(0.1, omega_drive))
 for omega_drive in (0.5, 0.9, 1.0, 1.1, 1.5)]
# ω=0.5 → avg power ≈ 0.05
# ω=0.9 → avg power ≈ 0.45
# ω=1.0 → avg power ≈ 2.5     ← resonance: 50× more energy in / cycle
# ω=1.1 → avg power ≈ 0.45
# ω=1.5 → avg power ≈ 0.05
# 'Pushing on the beat' is literally an integral identity — F·v averages
# to a positive number only when forcing is in phase with velocity.`,
  },
  presentValue: {
    arc2: `import math

# Discrete: pay $C every year for N years, discount at rate r per year.
# PV = sum_{i=1..N} C / (1 + r)^i
def pv_discrete(C, r, N):
    return sum(C / (1 + r)**i for i in range(1, N + 1))

# At r = 5%, $1/year for 10 years is worth less than $10 today.
[pv_discrete(1, 0.05, N) for N in (1, 5, 10, 20)]
# → [0.95, 4.33, 7.72, 12.46]
# Past 20 years, additional payments contribute almost nothing — distant
# money discounts away, no matter the cash flow's nominal size.`,
    arc3: `# Continuous version: discount factor is e^(-r*t), which is what
# 'continuous compounding' gives in the limit of (1 + r/n)^(n*t) as n → ∞.
# Why exponential? log of (1 + r/n)^(n*t) = n*t * log(1 + r/n) → r*t,
# so (1 + r/n)^(n*t) → e^(r*t). The log module's identity surfaces here
# directly: continuous discount = inverse of continuous growth.

def discount_continuous(t, r):
    return math.exp(-r * t)

[(t, round(discount_continuous(t, 0.05), 4)) for t in (0, 1, 5, 10, 30)]
# → [(0, 1.0), (1, 0.9512), (5, 0.7788), (10, 0.6065), (30, 0.2231)]
# 30 years out at 5% — a future dollar is worth ~22 cents today.`,
    arc4: `# Continuous cash flow at rate c (dollars/year) over [0, T]:
# PV = ∫_0^T c · e^(-r*t) dt = (c/r) * (1 - e^(-r*T))
# For r → 0, the limit is c*T (no discount). For T → ∞, the limit is
# c/r — the perpetuity formula. Both are readable from the closed form.
def pv_continuous(c, r, T):
    if abs(r) < 1e-9:
        return c * T
    return (c / r) * (1 - math.exp(-r * T))

# Compare a $1/year stream's PV under different (r, T):
[(r, T, round(pv_continuous(1, r, T), 2))
 for r in (0.02, 0.05, 0.10) for T in (10, 30, 100)]
# → [(0.02, 10, 9.06),  (0.02, 30, 22.55),  (0.02, 100, 43.23),
#    (0.05, 10, 7.87),  (0.05, 30, 15.54),  (0.05, 100, 19.87),
#    (0.10, 10, 6.32),  (0.10, 30, 9.50),   (0.10, 100, 9.99)]
# At 10% the perpetuity limit is c/r = 10. At 100 years we're already
# at $9.99 — basically the limit. *5/r is roughly when extending
# matters less than the next decimal place.*`,
  },
  integration: {
    arc2: `# Riemann sum — turn 'area under the curve' into a finite computation.
# Chop [a, b] into N strips, evaluate f once per strip, multiply by Δx,
# add. Three rule choices give different errors at the same N.
def riemann(f, a, b, n, rule="midpoint"):
    dx = (b - a) / n
    s = 0.0
    for i in range(n):
        if   rule == "left":     x = a + i * dx
        elif rule == "right":    x = a + (i + 1) * dx
        else:                    x = a + (i + 0.5) * dx
        s += f(x) * dx
    return s

# ∫_0^1 x² dx — the exact answer is 1/3 ≈ 0.333.
[(rule, riemann(lambda x: x*x, 0, 1, n=20, rule=rule))
 for rule in ("left", "right", "midpoint")]
# → [('left',     0.30875),    a bit under 1/3
#    ('right',    0.35875),    a bit over 1/3
#    ('midpoint', 0.333125)]   essentially exact at N=20
# Midpoint converges as ~1/N², the others as ~1/N. That's why every
# practical numerical integrator picks midpoint or higher (Simpson, Gauss).`,
    arc4: `# Antiderivative — the function whose derivative is f.
# For polynomials, the rule is mechanical: x^n → x^(n+1)/(n+1).
# But the antiderivative isn't unique — F(x) and F(x) + 5 both differentiate
# to the same f. The +C is a fixed point of the operation.
def antideriv_poly(coeffs):
    """Coefficients of polynomial Σ c_i x^i → coeffs of antiderivative
       Σ c_i x^(i+1)/(i+1).  The constant C is dropped (you supply it)."""
    return [0.0] + [c / (i + 1) for i, c in enumerate(coeffs)]

# f(x) = 3x² + 2x + 1  →  F(x) = x³ + x² + x  (+ C)
antideriv_poly([1, 2, 3])
# → [0.0, 1.0, 1.0, 1.0]   coefficients of x⁰, x¹, x², x³`,
    arc5: `# Fundamental Theorem of Calculus, Part 2:
#   ∫_a^b f(x) dx = F(b) − F(a)
# for any antiderivative F of f. The infinite limit of Riemann sums
# becomes two function evaluations and a subtraction.
def evaluate_poly(coeffs, x):
    return sum(c * x**i for i, c in enumerate(coeffs))

def integral_via_ftc(coeffs, a, b):
    F = antideriv_poly(coeffs)
    return evaluate_poly(F, b) - evaluate_poly(F, a)

# ∫_0^2 (3t² + 2t + 1) dt — by FTC.
integral_via_ftc([1, 2, 3], 0, 2)
# → 14.0      F(2) − F(0) = (8 + 4 + 2) − 0 = 14
#
# Sanity check via Riemann at N=10000 with the lambda form:
def f(t): return 3*t*t + 2*t + 1
riemann(f, 0, 2, n=10000, rule="midpoint")
# → 13.99999...   matches FTC to four decimals
#
# The Riemann sum 'is what the integral is.' FTC says you almost never
# have to take the limit — pick an antiderivative and subtract.`,
  },
  jpegCompression: {
    arc3: `import numpy as np

# 8x8 DCT-II in matrix form. The cosine matrix M is the same one JPEG uses;
# applying it twice (rows then columns) gives the 2D DCT.
N = 8

def dct_matrix(N=8):
    M = np.zeros((N, N))
    for k in range(N):
        for n in range(N):
            M[k, n] = np.cos((2*n + 1) * k * np.pi / (2*N))
    M[0, :] *= 1 / np.sqrt(N)
    M[1:, :] *= np.sqrt(2 / N)
    return M

M = dct_matrix(N)

def dct2d(block):
    return M @ block @ M.T   # rows, then columns

def idct2d(coef):
    return M.T @ coef @ M    # inverse: just transpose

# DCT itself is lossless. Round-trip an 8x8 block and the error is zero
# (up to floating point).
block = np.random.default_rng(0).integers(0, 256, size=(8, 8)).astype(float)
coef  = dct2d(block)
back  = idct2d(coef)
np.allclose(block, back)   # → True   the transform alone loses nothing`,
    arc4: `# Keep top K coefficients by magnitude; zero the rest. JPEG's quantization
# step is more elaborate (a per-coefficient divisor table), but the
# qualitative effect — kill small / high-frequency entries — is the same.
def keep_top_k(coef, k):
    flat = coef.flatten()
    if k >= flat.size: return coef.copy()
    threshold = np.sort(np.abs(flat))[-k]
    out = coef.copy()
    out[np.abs(out) < threshold] = 0
    return out

def reconstruct(coef, k):
    return idct2d(keep_top_k(coef, k))

# Compare four block types: how many of 64 coefficients does each one need?
def kept_to_target_error(block, target_mae=2.0):
    coef = dct2d(block)
    for k in range(1, 65):
        err = np.mean(np.abs(reconstruct(coef, k) - block))
        if err <= target_mae:
            return k, err
    return 64, np.mean(np.abs(reconstruct(coef, 64) - block))

# (assumes flat / gradient / texture / checker block builders defined elsewhere)
[(name, *kept_to_target_error(b()))
 for name, b in (("flat", lambda: np.full((8,8), 128.0)),
                 ("gradient", lambda: np.add.outer(*[np.linspace(0,255,8)]*2) / 2),
                 ("checker", lambda: 130 + 100*((np.indices((8,8)).sum(0) % 2)*2 - 1)))]
# → [('flat',     1, 0.0),    DC alone reconstructs perfectly
#    ('gradient', 3, ~1.5),   a handful of low-freq entries
#    ('checker',  1, 0.0)]    surprisingly: ALL energy at one high-freq cell
# Same data, very different sparsity in the DCT basis.`,
    arc5: `# Why the file actually shrinks: after quantization, the coefficient
# stream has lots of zeros and small ints; entropy coding (Huffman or
# arithmetic) packs that stream tightly. Same entropy module that bounds
# tf-idf and the lossless image-compression page — JPEG just feeds it a
# stream that's already been pre-sparsified by DCT + quantization.
from collections import Counter
from math import log2

def entropy(symbols):
    counts = Counter(symbols)
    N = len(symbols)
    return sum(-(c / N) * log2(c / N) for c in counts.values() if c > 0)

# Pretend a 256-block image. Compare the entropy of the raw pixel stream
# to the entropy of the kept-DCT-coefficient stream after rounding.
rng = np.random.default_rng(1)
img = rng.integers(50, 200, size=(8, 32))   # 8 high × 32 wide = 32 blocks of 8x8

# This is illustrative; real JPEG quantizes per coefficient (zigzag table).
raw_h = entropy(img.flatten().tolist())
print(f"raw pixel H ≈ {raw_h:.2f} bits/symbol")

# After DCT + top-8-of-64 + integer rounding, most symbols are zero.
coef_stream = []
for bj in range(4):
    block = img[:, bj*8:(bj+1)*8].astype(float)
    kept = keep_top_k(dct2d(block), k=8)
    coef_stream.extend(np.round(kept).astype(int).flatten().tolist())
sparse_h = entropy(coef_stream)
print(f"kept-8 DCT stream H ≈ {sparse_h:.2f} bits/symbol")
# Typical run: raw ~7 bits/symbol, sparse-DCT ~1-2 bits/symbol.
# Same entropy bound, very different alphabet — the gap is what JPEG
# saves in file size on top of what discarding coefficients already saved.`,
  },
  terminalVelocity: {
    arc3: `import math

# Per-unit-mass equation of motion: dv/dt = g - k*v.
# Two competing forces, both per unit mass:
#   gravity  →  +g  (constant, pulls v upward in magnitude)
#   drag     →  -k*v  (proportional to current speed, opposes motion)
g = 9.8

def dvdt(v, k):
    return g - k * v

# At v = 0, drag is zero; gravity is unopposed; full acceleration.
# As v grows, drag grows proportionally; net force shrinks; acceleration
# shrinks. The shrink is the whole point — the system has a built-in
# governor.
[(v, round(dvdt(v, k=0.5), 2)) for v in (0, 5, 10, 15, 19.6, 25)]
# → [(0,    9.8),    free fall — nothing opposing
#    (5,    7.3),    drag has eaten 2.5 of g
#    (10,   4.8),
#    (15,   2.3),
#    (19.6, 0.0),    EQUILIBRIUM — v_t exactly
#    (25,  -2.7)]    above v_t: drag wins, deceleration`,
    arc4: `# Solve dv/dt = 0 for terminal velocity. One line of algebra.
#   g - k*v_t = 0  →  v_t = g/k.
def terminal_velocity(k, g=9.8):
    return g / k

# Linear-drag terminal velocities for a few familiar k values.
[(name, k, round(terminal_velocity(k), 1))
 for name, k in (("feather", 6.0), ("raindrop", 1.6),
                 ("skydiver", 0.4), ("bowling ball", 0.05))]
# → [('feather',      6.0,  1.6),     reaches ~1.6 m/s in well under a second
#    ('raindrop',     1.6,  6.1),
#    ('skydiver',     0.4, 24.5),     classic ~50 mph free-fall figure
#    ('bowling ball', 0.05, 196.0)]   approaches very slowly, in practice
#                                      it'd hit the ground long before
# Real raindrops sit closer to 9 m/s because actual drag is closer to
# v² than v; the linear case is a teaching simplification.`,
    arc5: `# Closed-form solution from rest, by separation of variables.
#   v(t) = v_t * (1 - exp(-k*t))
# At t = 0, v = 0 (rest). As t → ∞, v → v_t. Half of v_t is reached at
# t = ln(2)/k ≈ 0.693/k. After 5 'time-constants' (5/k seconds), v is
# within 1% of v_t.
def v_of_t(t, k, g=9.8):
    return (g / k) * (1 - math.exp(-k * t))

[(t, round(v_of_t(t, k=0.4), 2)) for t in (0, 1, 3, 5, 10, 20)]
# → [(0,   0.0),
#    (1,   8.1),     a third of v_t
#    (3,  17.1),     two-thirds
#    (5,  21.2),     ~87% of v_t = 24.5
#    (10, 24.0),     ~98%
#    (20, 24.5)]     within 0.001
# Same shape as a charging capacitor, a heating cup of coffee, a leaky
# bucket — every first-order linear ODE with a stable fixed point traces
# this curve. The terminal value is the fixed point; k is the rate at
# which deviation from the fixed point decays.`,
  },
  portfolioRisk: {
    arc2: `import numpy as np

# Two assets: same mean return 5%, same standard deviation σ = 1.
# We'll compute portfolio mean and variance for any (weight, correlation).
mu_A, mu_B = 0.05, 0.05
sig_A, sig_B = 1.0, 1.0

def portfolio(w, rho):
    """w: fraction in A; (1-w) in B. rho: correlation of returns."""
    mu  = w * mu_A + (1 - w) * mu_B
    var = (w**2 * sig_A**2
         + (1 - w)**2 * sig_B**2
         + 2 * w * (1 - w) * rho * sig_A * sig_B)
    return mu, var

# Same expected return regardless of weight (because mu_A == mu_B).
# Variance is what moves.
[(rho, *portfolio(w=0.5, rho=rho)) for rho in (1.0, 0.0, -1.0)]
# → [(1.0,  0.05, 1.00),    perfect lockstep — no diversification benefit
#    (0.0,  0.05, 0.50),    independent — variance halves at 50/50
#    (-1.0, 0.05, 0.00)]    perfect anti — risk literally vanishes`,
    arc3: `# Minimum-variance weight, closed form.
# Take d/dw of σ²_p(w) and set to zero:
#   w* = (σ_B² − ρ σ_A σ_B) / (σ_A² + σ_B² − 2 ρ σ_A σ_B)
def min_var_weight(rho, sig_A=1.0, sig_B=1.0):
    num = sig_B**2 - rho * sig_A * sig_B
    den = sig_A**2 + sig_B**2 - 2 * rho * sig_A * sig_B
    return num / den if abs(den) > 1e-12 else 0.5

[(rho, min_var_weight(rho)) for rho in (-1, -0.5, 0, 0.5, 0.99)]
# → [(-1,    0.50),    A and B equally weighted — perfect cancellation
#    (-0.5, 0.50),    still 50/50 because σ_A = σ_B
#    (0,    0.50),
#    (0.5,  0.50),
#    (0.99, 0.50)]
# With σ_A = σ_B the answer is always 0.5; differing σ's would tilt w*.`,
    arc4: `# Sanity check via Monte Carlo: simulate joint returns at given ρ,
# form the 50/50 portfolio, measure realized variance, compare to formula.
import numpy as np

def simulate(rho, n=200_000, seed=0):
    rng = np.random.default_rng(seed)
    z1 = rng.standard_normal(n)
    z2 = rng.standard_normal(n)
    a = mu_A + sig_A * z1
    b = mu_B + sig_B * (rho * z1 + np.sqrt(1 - rho**2) * z2)
    p = 0.5 * a + 0.5 * b
    return p.mean(), p.var()

formula = portfolio(w=0.5, rho=-0.5)
sim     = simulate(rho=-0.5)
formula, sim
# → ((0.05, 0.25), (0.0501, 0.2503))
# Closed form and simulation agree to three decimals.
# The whole MPT machinery from Markowitz onward sits on top of this single
# scalar identity; the rest is generalizing to N assets and adding
# constraints (no shorts, sector caps, etc.).`,
  },
  imageCompression: {
    arc2: `import numpy as np
from collections import Counter
from math import log2

# A 16x16 patch with each of 16 grayscale levels appearing exactly 16 times.
# We'll build three layouts that share this histogram and compare entropies.
def gradient():
    img = np.zeros((16, 16), dtype=np.int32)
    for i in range(16):
        img[i, :] = i           # row i is constant level i
    return img

def blocks():
    img = np.zeros((16, 16), dtype=np.int32)
    for i in range(16):
        for j in range(16):
            img[i, j] = (i // 4) * 4 + (j // 4)
    return img

def scrambled(seed=0):
    rng = np.random.default_rng(seed)
    flat = gradient().flatten()
    rng.shuffle(flat)
    return flat.reshape(16, 16)

# Histogram entropy — bits/pixel if you encoded each pixel independently.
def histogram_entropy(img):
    flat = img.flatten()
    counts = Counter(flat)
    N = len(flat)
    return sum(-(c / N) * log2(c / N) for c in counts.values() if c > 0)

[histogram_entropy(p()) for p in (gradient, blocks, scrambled)]
# → [4.0, 4.0, 4.0]   identical — same histogram, same H.`,
    arc3: `# Neighbor-difference entropy — what a real compressor sees.
# For each pair of adjacent pixels (right + down), count abs(diff). The
# resulting distribution carries the spatial structure the histogram missed.
def neighbor_diff_entropy(img):
    diffs = []
    H, W = img.shape
    for i in range(H):
        for j in range(W):
            if j + 1 < W: diffs.append(abs(int(img[i, j]) - int(img[i, j+1])))
            if i + 1 < H: diffs.append(abs(int(img[i, j]) - int(img[i+1, j])))
    counts = Counter(diffs)
    N = len(diffs)
    return sum(-(c / N) * log2(c / N) for c in counts.values() if c > 0)

[neighbor_diff_entropy(p()) for p in (gradient, blocks, scrambled)]
# → [0.34, 1.34, 4.07]   gradient ~0, scrambled ~log2(16) ≈ 4.
# Histograms saw three identical sources; neighbor differences see three
# very different ones. That gap is the entire point of spatial compression.`,
    arc4: `# Real-world check: encode all three with PNG and compare file sizes.
# PNG uses filter prediction (essentially neighbor differences) followed by
# DEFLATE (LZ77 + Huffman). Same pixel multiset, very different output.
import io
from PIL import Image

def png_size(img):
    buf = io.BytesIO()
    Image.fromarray((img * 16).astype('uint8'), mode='L').save(buf, 'PNG')
    return len(buf.getvalue())

sizes = {p.__name__: png_size(p()) for p in (gradient, blocks, scrambled)}
# → {'gradient': ~120, 'blocks': ~140, 'scrambled': ~310}
#
# The histograms predicted 4 bits × 256 pixels = 128 bits = 16 bytes of
# *symbol payload*; PNG's framing overhead is fixed. The interesting number
# is the ratio of payloads: gradient ≈ 1×, scrambled ≈ 2-3× larger. Same
# histogram, different file size — the signature of spatial compression.`,
  },
  modelCalibration: {
    arc2: `import numpy as np

# Bin predictions; for each bin compute mean predicted prob and observed
# accuracy. The vertical gaps are the calibration error, by bin.
def reliability(probs, labels, n_bins=10):
    edges = np.linspace(0, 1, n_bins + 1)
    out = []
    for lo, hi in zip(edges[:-1], edges[1:]):
        mask = (probs >= lo) & (probs < hi if hi < 1 else probs <= hi)
        if mask.sum() == 0:
            out.append((float((lo + hi) / 2), None, 0))
            continue
        mean_p   = float(probs[mask].mean())
        accuracy = float(labels[mask].mean())   # labels ∈ {0, 1}
        out.append((mean_p, accuracy, int(mask.sum())))
    return out

# Toy: 1000 examples drawn from a known truth(p), with labels sampled
# Bernoulli(truth(p)). The model SAYS p; reality returns truth(p).
rng = np.random.default_rng(0)
probs = rng.uniform(0, 1, size=1000)
truth = lambda p, T=0.55: 1 / (1 + np.exp(-np.log(p / (1 - p)) / T))
labels = rng.binomial(1, truth(probs))
reliability(probs, labels, n_bins=10)
# → [(0.05, 0.18, ...), ..., (0.95, 0.78, ...)]
# At "95% confident", reality returns ~78% — the model is overconfident.`,
    arc3: `# Expected calibration error (ECE): weighted average of bin gaps.
def ece(probs, labels, n_bins=10):
    bins = reliability(probs, labels, n_bins)
    n = sum(c for _, _, c in bins)
    return sum(c * abs(p - a) for p, a, c in bins if a is not None) / n

ece(probs, labels, 10)        # ≈ 0.13   (13% calibration gap on average)
# 0 means perfect — every bar lies on the diagonal. ~0.05 is "lab-grade
# calibrated"; modern deep nets often start at 0.10–0.30 out of the box.`,
    arc4: `# Local linearization at one bin: y ≈ accuracy(c) + slope·(p - c).
# If slope ≈ 1, the curve is parallel to truth — a constant shift, easy to
# fix. If slope ≠ 1, the gap CHANGES with confidence, which is exactly
# what one scalar (temperature) can rotate away.
def local_slope(p_centers, accuracies, i):
    # central difference; falls back to one-sided at the edges.
    if i == 0:
        return (accuracies[1] - accuracies[0]) / (p_centers[1] - p_centers[0])
    if i == len(p_centers) - 1:
        return (accuracies[-1] - accuracies[-2]) / (p_centers[-1] - p_centers[-2])
    return (accuracies[i+1] - accuracies[i-1]) / (p_centers[i+1] - p_centers[i-1])

# At the bin centered at 0.85, the slope tells you the "local fix":
# slope == 1 means subtract a constant; slope < 1 means stretch toward 0.5.`,
    arc5: `# Temperature scaling: divide every logit by T before softmax.
# argmax is preserved (accuracy unchanged); only confidence is rescaled.
def softmax(z, T=1.0):
    s = z / T
    s = s - s.max(axis=-1, keepdims=True)
    e = np.exp(s)
    return e / e.sum(axis=-1, keepdims=True)

# Fit T on a held-out validation set by minimizing log-loss in T.
from scipy.optimize import minimize_scalar

def fit_temperature(logits, y):
    def nll(T):
        p = softmax(logits, T=T)
        # negative log-likelihood of the true class
        return -np.log(p[np.arange(len(y)), y] + 1e-12).mean()
    res = minimize_scalar(nll, bounds=(0.05, 10.0), method="bounded")
    return float(res.x)

# T > 1 → softer; T < 1 → sharper. Modern LLMs ship with T ≈ 1.5–3 to
# tame overconfidence in the high-probability tail.`,
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
