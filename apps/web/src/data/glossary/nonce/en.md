---
term: nonce
related: [digital-signature, private-key]
---

A "number used once." In ECDSA, every signature requires a fresh random integer `k` from `{1, …, n-1}`, used to compute `R = kG` and then discarded. The nonce hides the private key inside `s = (h + r·d)·k⁻¹`: with `k` random, `s` looks random too. Two failures are catastrophic. (1) If `k` repeats across two signatures with the same key, anyone can solve a small linear system and recover `d`. (2) If `k` is predictable (weak RNG), the same recovery applies. Real wallets now derive `k` deterministically from the message and `d` so it cannot leak by accident.
