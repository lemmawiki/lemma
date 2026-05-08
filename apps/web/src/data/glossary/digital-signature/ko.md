---
term: 디지털 서명
related: [private-key, public-key, nonce]
---

개인키 `d`의 소유자가 메시지 해시 `h`에 대해 만들어내는 짧은 값 `(r, s)`. 대응 공개키 `Q = dG`를 가진 누구나 `d`를 모르고도 서명을 검증할 수 있다. ECDSA에서는 서명자가 임의의 nonce `k`를 골라 `R = kG`를 계산하고, `r = R.x mod n`, `s = (h + r·d) · k⁻¹ mod n`. 검증자는 `u₁ = h/s`, `u₂ = r/s`를 계산해 `(u₁G + u₂Q).x ≡ r (mod n)`이 맞는지 확인 — 이 등식은 서명자가 `d`를 알고 있었을 때만 성립한다.
