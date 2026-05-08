---
term: De Casteljau's algorithm
related: [bezier-curve, lerp]
---

A recursive way to evaluate a Bezier curve at a parameter `t`. Given `n+1` control points, lerp every adjacent pair at `t` to get `n` new points; lerp those to get `n−1`; repeat until one point remains — that point is `B(t)`. Numerically stable, geometrically transparent, no Bernstein-coefficient bookkeeping, and the intermediate "layers" double as the construction lines a designer can see in any vector tool. Mathematically equivalent to the Bernstein-polynomial form, but kinder to hand.
