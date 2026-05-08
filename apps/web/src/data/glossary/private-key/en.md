---
term: private key
related: [public-key, digital-signature]
---

A secret integer the owner keeps. In ECDSA on a curve with generator `G` and subgroup order `n`, the private key `d` is a random element of `{1, …, n-1}`. The owner uses `d` to produce signatures; everyone else uses the matching public key `Q = dG` to verify them. Whoever learns `d` can sign on the owner's behalf indefinitely — that is the entire reason it must never leave the device.
