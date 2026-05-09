---
term: lossy
related: [lossless, entropy]
---

A compression scheme that _throws information away_ on purpose, picking what to drop based on what humans don't notice — slight color shifts, high-frequency texture, sub-millisecond audio detail. JPEG, MP3, H.264 are lossy. The decompressed file is _not_ the original bits; it's an approximation chosen to look (or sound) close enough at a much smaller size. Lossy compression is not bound by entropy of the source — only by what perceptual quality the encoder is willing to sacrifice. The opposite of _lossless_.
