---
term: correlation
related: [covariance, variance]
---

Covariance, normalized to live on `[−1, 1]`. `ρ(X, Y) = Cov(X, Y) / (σ_X · σ_Y)`. The advantage over raw covariance: it's _unit-free_ and _scale-free_, which makes "more correlated" mean the same thing whether you're comparing daily returns or yearly returns. `ρ = 1`: the two variables move in lockstep (same direction, fixed ratio). `ρ = -1`: perfect anti-lockstep. `ρ = 0`: linearly uncorrelated, though _not_ necessarily independent — correlation only sees the linear part of joint motion. The whole point of diversification is to find `ρ < 1` pairs.
