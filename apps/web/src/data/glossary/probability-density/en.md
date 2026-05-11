---
term: probability density
related: [distribution, random-variable, probability-mass]
---

The _rate at which a continuous distribution accumulates probability around a point_. For a continuous random variable `X` with density `f(x)`, the probability that `X` falls in a small interval `[x, x + dx]` is approximately `f(x) · dx`. The density is _not_ a probability — it can exceed 1 — but its integral over any interval gives a probability, and its integral over the whole line is 1. Asking "what is `P(X = 3.7)`?" for a continuous `X` is a category error; the right question is "what is `P(3.6 ≤ X ≤ 3.8)`?" — an area under the density curve. Continuous distributions live as densities; integrals turn densities back into probabilities.
