---
term: expected value
related: [distribution, random-variable, variance]
---

The _weighted average_ of a random variable. For a discrete `X` with `P(X = xᵢ) = pᵢ`, the expected value is `E[X] = Σ xᵢ · pᵢ`. For a continuous `X` with density `f(x)`, `E[X] = ∫ x · f(x) dx`. It is the value you would converge to if you sampled `X` many times and averaged — the _center of mass_ of the distribution. "Expected" is a slightly misleading name: in `X ∈ {0, 1000}` with `P(0) = P(1000) = 0.5`, the expected value is 500 — a value `X` will _never_ take. The mean is a _summary_ of the distribution, not a _forecast_ of any one draw.
