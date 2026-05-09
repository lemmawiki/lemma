---
term: learning rate
related: [gradient-descent, loss-function]
---

The step size used in gradient descent: at each iteration, the parameter `w` updates as `w ← w − η · ∇L(w)`, where `η` (eta) is the learning rate. Too small and convergence crawls; too large and the iterates overshoot the minimum and may diverge. The "Goldilocks" range depends on the curvature of the loss — for a quadratic loss with second derivative `c`, the upper bound for stable convergence is `η < 2/c`. Real ML training uses schedules (decreasing `η` over time) and adaptive rules (per-parameter `η`) — both born from the same observation: one constant rarely works.
