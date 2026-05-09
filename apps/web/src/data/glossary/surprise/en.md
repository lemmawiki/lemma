---
term: surprise
related: [entropy, bit, logarithm]
---

`I(x) = −log₂ p(x)`, the bits of information you gain by learning that outcome `x` occurred. Rare outcomes (small p) carry high surprise; certain outcomes (p = 1) carry zero. Entropy is the _expected_ surprise — `H = E[I(X)] = Σ p log₂(1/p)`. The Morse code intuition lives here: 'E' is most frequent in English, so its surprise per occurrence is small, so it earns a short code.
