---
term: secp256k1
related: [elliptic-curve, bitcoin]
---

비트코인이 키와 서명에 쓰는 특수 타원곡선: `p = 2²⁵⁶ − 2³² − 977` 위의 `y² = x³ + 7`. 생성점 `G`와 부분군 차수 `n`은 표준에 고정된 상수. `secg.org` (Standards for Efficient Cryptography Group)이 정의한 규격 이름이 `secp256k1`. 토이 타원곡선과 _완전히 같은_ 군 법칙, _같은_ ECDSA 식 — 숫자만 더 클 뿐. 256-bit 소수 덕에 `√n ≈ 2¹²⁸` 만큼의 이산 로그 작업이 불가능에 가깝다.
