---
term: lossless
related: [lossy, entropy, shannon-bound]
---

A compression scheme that _throws nothing away_: decompressing the file gives back the exact original bits. PNG, ZIP, FLAC are lossless; the file is smaller because the encoder finds a more compact representation of the same information, not because it dropped any. The Shannon bound is the floor: no lossless scheme, no matter how clever, beats the entropy of the source. The opposite of _lossy_, which trades fidelity for size.
