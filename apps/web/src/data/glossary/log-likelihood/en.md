---
term: log-likelihood
flag: |
  Always negative for probabilities in (0,1). Bigger (less negative) is better. "Negative log-likelihood" (NLL) flips the sign so loss can be minimized.
related: [logarithm, underflow]
---
The log of a probability (or product of probabilities). Used because products of small probabilities underflow floats; their logs sum cleanly.
