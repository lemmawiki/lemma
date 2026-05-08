---
term: digital signature
related: [private-key, public-key, nonce]
---

A short value `(r, s)` produced by the owner of a private key `d` over a message hash `h`, such that anyone with the matching public key `Q = dG` can verify the signature without learning `d`. In ECDSA, the signer picks a random nonce `k`, computes `R = kG`, sets `r = R.x mod n`, and `s = (h + r·d) · k⁻¹ mod n`. The verifier computes `u₁ = h/s`, `u₂ = r/s`, then checks that `(u₁G + u₂Q).x ≡ r (mod n)` — an equality that holds if and only if the signer knew `d`.
