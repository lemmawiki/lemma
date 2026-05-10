---
term: quantization
related: [dct, lossy]
---

Replacing a continuous (or fine-grained) value with the nearest entry from a coarse table. In JPEG: each DCT coefficient is divided by an integer in a _quantization table_, then rounded to the nearest whole number. Small coefficients (typically the high-frequency ones) round straight to zero; large coefficients survive with reduced precision. _This is where the loss happens_ — the original coefficient cannot be recovered from the rounded value. JPEG quality settings adjust the quantization table: lower quality → larger divisors → more zeros → smaller files but more visible blocks and ringing. Quantization is the bridge from real-valued DCT output to a stream of integers that entropy coding (Huffman/run-length) can pack tightly.
