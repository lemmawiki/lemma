---
term: scalar multiplication
related: [elliptic-curve, discrete-log]
---

Repeated point addition on an elliptic curve: `kP = P + P + ⋯ + P` (k times). Computing `kP` from `(k, P)` is fast — double-and-add finishes in `O(log k)` group operations. Recovering `k` from `(P, kP)` is the discrete logarithm problem and is believed to take exponentially many group operations. This asymmetry — easy to multiply, hard to undo — is the entire cryptographic content of every elliptic-curve scheme: keys, signatures, key exchange.
