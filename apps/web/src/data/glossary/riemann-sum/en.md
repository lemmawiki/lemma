---
term: Riemann sum
related: [definite-integral, fundamental-theorem-of-calculus]
---

A finite approximation to a definite integral. Chop the interval `[a, b]` into `N` strips, evaluate `f` once per strip (at the left edge, the right edge, or the midpoint — different conventions, different errors), multiply each value by the strip's width `Δx`, and add. Symbolically: `S_N = Σ f(x_i) · Δx`. As `N → ∞` and `Δx → 0`, every reasonable convention converges to the same number — the definite integral. The Riemann sum is what the integral _is_, before the limit is taken; everything calculus does to integrals (by parts, substitution, change of variables) ultimately lands back as a finite sum on a computer.
