---
term: Bezier curve
related: [control-point, de-casteljau, lerp, parametrized-curve]
---

A parametric curve `B: [0, 1] → ℝ²` defined by a small list of control points and one operation: linear interpolation, applied recursively. For four control points `P₀, P₁, P₂, P₃`, the cubic Bezier curve is `B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃` — equivalent to De Casteljau's recursive lerp. The curve starts at `P₀`, ends at `P₃`, and bends toward the middle controls without passing through them. Every smooth path in fonts, vector art, motion graphics, and CAD is built from these.
