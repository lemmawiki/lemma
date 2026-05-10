---
term: fundamental theorem of calculus
related: [definite-integral, antiderivative, riemann-sum, derivative]
---

The bridge between integration and differentiation. Two halves, one statement.

_Part 1_: define `F(x) = ∫_a^x f(t) dt` (the running integral, treating one bound as a variable). Then `F'(x) = f(x)` — differentiation undoes integration. Whatever you accumulate, its rate of accumulation at `x` is just `f(x)`.

_Part 2_: if `F` is _any_ antiderivative of `f`, then `∫_a^b f(x) dx = F(b) − F(a)`. The integral is computed by subtracting two values of an antiderivative — no infinite sum required, just two function evaluations. This is why most definite integrals you ever compute are evaluated through antiderivatives, not Riemann limits.

The theorem turns the _area-under-the-curve_ picture and the _reverse-of-derivative_ picture into the _same_ picture. Which one is "the integral" is a choice of viewpoint; both are correct.
