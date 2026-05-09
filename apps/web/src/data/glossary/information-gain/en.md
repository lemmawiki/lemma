---
term: information gain
related: [entropy, surprise]
---

`IG(X | Y) = H(X) − H(X | Y)`. How many bits of uncertainty about X are removed, on average, by observing Y. The objective every Wordle solver, decision-tree split, and 20-questions strategy is implicitly maximizing. Bounded above by `H(X)`: you cannot gain more bits than the variable holds.
