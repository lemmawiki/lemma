---
term: lerp
related: [bezier-curve]
---

Linear interpolation between two values: `lerp(a, b, t) = (1 − t) · a + t · b`. At `t = 0` you get `a`, at `t = 1` you get `b`, in between you trace a straight line. Works on numbers, points, colors, transformations — anything that supports addition and scaling. The single primitive on which Bezier curves, animation tweening, gradient shading, and most computer-graphics interpolation are built.
