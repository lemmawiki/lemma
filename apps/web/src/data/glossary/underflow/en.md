---
term: underflow
flag: |
  Different from overflow. Underflow rounds *to zero*, silently — no exception, no warning. Gradients that touched it die.
related: [logarithm, log-likelihood]
---
When a number is too small in magnitude for the float type to represent, hardware rounds it to zero. float32 underflows below ~1e-38, float64 below ~1e-308.
