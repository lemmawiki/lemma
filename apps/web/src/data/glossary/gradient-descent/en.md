---
term: gradient descent
related: [loss-function, learning-rate, derivative]
---

The iterative recipe at the heart of every modern ML system. Compute the gradient of the loss with respect to the parameters; take a step in the _opposite_ direction (the steepest descent); repeat. In one dimension, `w ← w − η · L'(w)`. The same formula scales to a parameter vector — partial derivatives in each direction, vector subtraction. What separates research projects is rarely the algorithm itself; it's the choice of loss, the size and schedule of `η`, and tricks for noisy, stochastic, very-high-dimensional versions (mini-batches, momentum, Adam). The core idea has been the same since 1847: walk downhill.
