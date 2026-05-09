---
term: entropy
related: [bit, surprise, information-gain, logarithm]
---

`H(X) = −Σ pᵢ log₂ pᵢ`. The expected number of yes/no questions needed, on average, to identify which outcome occurred. Reaches `log₂ N` when all `N` outcomes are equally likely (maximum); collapses to 0 when one outcome has probability 1 (no uncertainty). The base of the log picks the unit: log₂ → bits, ln → nats, log₁₀ → bans. Built on `log` so that the entropy of independent variables adds: `H(X, Y) = H(X) + H(Y)` when X and Y are independent.
