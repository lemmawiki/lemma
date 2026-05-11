---
term: local minimum
related: [objective-function, convergence, gradient]
---

A point where the objective function is no worse than every nearby point — but not necessarily the lowest point anywhere. A function with a single bowl shape (a _convex_ function) has only one minimum; finding it solves the optimization completely. A function with multiple valleys has multiple local minima; descending from a starting point only guarantees landing in _whichever valley you happened to start near_, not the deepest one (the _global minimum_). Most real-world optimization problems are non-convex — neural network training, portfolio selection with constraints, physics with non-quadratic potentials — and the math of "is this the best?" usually collapses to "does anywhere nearby look better?" The honest answer is: not always.
