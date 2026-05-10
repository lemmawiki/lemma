---
term: covariance
related: [variance, correlation]
---

A two-variable cousin of variance. For two random quantities `X` and `Y`, `Cov(X, Y) = E[(X − μ_X)(Y − μ_Y)]`: the expected product of their joint deviations. Positive when they tend to move together (both above-average together, both below-average together), negative when they move apart, zero when their joint motion averages out. Variance is just `Cov(X, X)` — a special case. Covariance is what couples two assets in a portfolio: the cross-terms in the variance formula are `2 w_A w_B Cov(A, B)`, and that's the door diversification walks through.
