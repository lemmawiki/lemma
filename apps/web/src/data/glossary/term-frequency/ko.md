---
term: 단어 빈도 (TF)
related: [tf-idf, inverse-document-frequency]
---

`tf(t, d) = count(t, d) / length(d)`. 문서 `d`에서 단어들 중 `t`인 것의 비율. 문서 길이로 나누는 건 "공정하게 만드는" 단계다 — 안 그러면 긴 문서가 모든 단어를 더 많이 썼다는 이유로 점수를 더 받는다. 변형 (원시 빈도, 로그 스케일, 증강 형) 도 있지만, 정규화된 형태가 표준 직관이다.
