---
term: discrete cosine transform
related: [basis, quantization, lossy]
---

A change of _basis_ for a finite signal — same data, different coordinates. Applied to an 8×8 image block, the DCT produces 64 coefficients indexed `(u, v)` from 0 to 7: the `(0, 0)` coefficient (the _DC_ term) carries the block's average brightness; coefficients toward `(7, 7)` carry progressively higher spatial frequencies. For natural images, most of the energy lives in the low-frequency corner, and the high-frequency entries are tiny. JPEG exploits exactly that: throw away the small high-frequency coefficients, keep the large low-frequency ones, and the picture survives with most of its perceptual content intact. The DCT itself is _lossless_ and _invertible_; the loss happens in the next step (quantization).
