---
term: step size
related: [learning-rate, gradient, convergence]
---

How far each iteration moves through search space. Concretely, given a candidate `x` and a direction of improvement `d`, the next candidate is `x + α · d`, where `α` is the step size. Too small and the search creeps; too large and it overshoots the goal and may oscillate or diverge. The "right" step depends on the local geometry — a steep narrow valley wants a small step, a wide flat plateau wants a large one. In gradient descent the step size has a special name (the _learning rate_); the rest of optimization just calls it `α`. Modern algorithms either fix `α`, schedule it (decrease over time), or compute it adaptively (line search, trust regions) — three names for "one constant rarely works."
