---
term: log_softmax
related: [logarithm, log-likelihood, underflow, logsumexp]
---

A numerically stable function that computes log(softmax(x)) without ever forming the underflowing softmax probabilities. softmax turns a vector of scores into probabilities; taking the log of that directly would underflow on small entries. log_softmax computes both at once via the logsumexp trick. Used in every modern classifier loss because it gives clean gradients without losing precision.
