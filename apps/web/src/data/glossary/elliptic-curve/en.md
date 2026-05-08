---
term: elliptic curve
related: [discrete-log, scalar-multiplication]
---

A curve of the form `y² = x³ + ax + b` (with `4a³ + 27b² ≠ 0`, so the curve has no cusps or self-intersections). When taken over a finite field `F_p`, the affine solutions plus a single _point at infinity_ form a finite abelian group under the chord-and-tangent construction inherited from Bezout's theorem. ECDSA, EdDSA, and most modern public-key cryptography stand on this group. Bitcoin uses the specific curve `y² = x³ + 7` over the prime `p = 2²⁵⁶ − 2³² − 977`, called secp256k1.
