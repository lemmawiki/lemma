---
term: convergence
related: [objective-function, local-minimum, step-size]
---

The state where further iterations no longer change the objective function meaningfully. Concretely: the change `|f(xₙ₊₁) − f(xₙ)|` falls below some tolerance, or the gradient magnitude `‖∇f‖` falls below it, or the iterate `xₙ` itself stops moving. Convergence is the _stopping condition_ — without one, an optimizer would run forever. It is also where the danger lives: convergence to a local minimum looks identical to convergence to a global one; both look like "no more improvement nearby." Whether the final answer is the _right_ answer depends on the problem's geometry (convex vs. not), the starting point, the step-size schedule, and luck. _Stopped_ and _solved_ are two different things.
