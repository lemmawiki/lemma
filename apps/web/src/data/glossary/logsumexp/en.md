---
term: logsumexp
flag: |
  The "max-shift" trick — log(Σ exp(xᵢ)) = max(x) + log(Σ exp(xᵢ − max(x))) — keeps the inner exponents ≤ 0, avoiding both overflow and underflow.
related: [logarithm, underflow, log-softmax]
---
A numerically stable function for computing log of a sum of exponentials. Available as torch.logsumexp and scipy.special.logsumexp. The building block of softmax, log_softmax, and almost every probabilistic loss.
