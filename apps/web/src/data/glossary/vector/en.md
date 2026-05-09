---
term: vector
related: [component, scalar, displacement]
---

A quantity that has both magnitude and direction. Concretely a tuple of numbers — `(3, 4)` in 2D, `(1, 0, −2)` in 3D — but the _meaning_ of those numbers depends on what you're doing. In graphics they describe a control-point offset; in physics, a velocity or force; in ML, a parameter update or a feature representation. The tuple is the same; the _role_ changes. The arithmetic — addition component-wise, scaling by a number — is the same in every role, which is why one set of math serves all of them.
