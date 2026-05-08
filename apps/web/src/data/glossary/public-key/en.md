---
term: public key
related: [private-key, digital-signature]
---

The point `Q = dG` on the curve, where `d` is the private key and `G` is the generator. Computing `Q` from `d` is fast (repeated point addition); recovering `d` from `Q` is the discrete logarithm problem and is believed to be infeasible at scale. The owner publishes `Q` freely — it identifies them on the network without revealing `d`. Bitcoin addresses are derived from the public key by hashing.
