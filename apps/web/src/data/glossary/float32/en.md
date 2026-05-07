---
term: float32
flag: |
  Different from float64. float32 underflows below ~1e-38 and overflows above ~3.4e38. Most ML frameworks default to float32 because GPU memory bandwidth is the bottleneck.
related: [underflow]
---

The 32-bit IEEE-754 floating-point format. About 7 decimal digits of precision, magnitude range roughly 1e-38 to 3.4e38. Numbers outside that range round to zero (underflow) or infinity (overflow).
