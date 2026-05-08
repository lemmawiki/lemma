---
term: secp256k1
related: [elliptic-curve, bitcoin]
---

The specific elliptic curve Bitcoin uses for keys and signatures: `y² = x³ + 7` over the prime field `F_p` with `p = 2²⁵⁶ − 2³² − 977`. Generator `G` and subgroup order `n` are fixed constants in the standard. The curve is defined by `secg.org` (Standards for Efficient Cryptography Group), spec named `secp256k1`. Same group law and same ECDSA equations as any toy elliptic curve — only the numbers are bigger. The 256-bit prime makes `√n ≈ 2¹²⁸` discrete-log work intractable.
