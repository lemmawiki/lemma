---
term: gradient
flag: |
  In ML: the vector of partial derivatives of the loss with respect to every parameter. Optimization moves opposite the gradient ("gradient descent"). If a value used in the gradient becomes 0 from underflow, the entire chain collapses — that's why log-space matters.
related: [underflow, log-softmax]
---
The slope of a function in many directions at once. For a function f(x, y, z, ...), the gradient is the vector of partial derivatives — it points in the direction of steepest ascent. In machine learning, this vector tells the optimizer which way to step the parameters to reduce loss.
