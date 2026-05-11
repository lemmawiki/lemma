---
term: objective function
related: [loss-function, local-minimum, convergence]
---

The single number an optimization process tries to make as good as possible. _Good_ means small for a _loss_ (training a model, minimizing risk, fitting a curve) or large for a _reward_ (maximizing return, maximizing entropy under constraints, maximizing log-likelihood) — but the two cases are interchangeable: maximizing `f` is the same problem as minimizing `−f`. The objective locks an optimization problem in place. Without one, "make it better" has no agreed direction; with one, every candidate choice has a single number attached and the comparison becomes mechanical. Loss functions in ML, risk in portfolios, energy in physics, posterior likelihood in inference — all are objective functions wearing different clothes.
