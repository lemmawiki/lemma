---
term: 엔트로피
related: [bit, surprise, information-gain, logarithm]
---

`H(X) = −Σ pᵢ log₂ pᵢ`. 어떤 결과가 나왔는지 식별하는 데 평균적으로 필요한 예/아니오 질문의 수. `N`개 결과가 모두 같은 확률이면 `log₂ N`(최대)에 도달하고, 한 결과가 확률 1이면 0(불확실성 없음)으로 무너진다. 로그 밑이 단위를 정한다: log₂ → bit, ln → nat, log₁₀ → ban. `log` 위에 서 있어서 독립인 두 확률변수의 엔트로피가 더해진다: X, Y가 독립이면 `H(X, Y) = H(X) + H(Y)`.
