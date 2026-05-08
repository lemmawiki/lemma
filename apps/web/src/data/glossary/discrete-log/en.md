---
term: discrete logarithm
related: [scalar-multiplication, elliptic-curve]
---

The problem: given a group element `g` of known order and another element `h` known to lie in the cyclic subgroup `⟨g⟩`, find the integer `x` such that `g^x = h` (or in additive notation on a curve, `xG = Q`). For elliptic curves chosen carefully — like secp256k1 — the best known algorithms still take roughly `√n` group operations, where `n` is the subgroup order. With `n ≈ 2²⁵⁶`, that is about `2¹²⁸` operations — far beyond what any current or near-future computer can do.
