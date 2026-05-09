---
term: TF-IDF
related: [term-frequency, inverse-document-frequency, surprise, cosine-similarity]
---

`tf(단어, 문서) · idf(단어, 코퍼스)`를 쿼리의 각 단어에 대해 합한 문서 점수. tf는 문서가 그 단어를 많이 쓸수록 점수를 더하고, idf는 여러 문서에 흔히 나타나는 단어를 깎는다. 이 곱은 "결합 확률의 로그" 직관을 *흉내*낸다 — 하지만 흉내일 뿐: tf는 빈도지 확률이 아니라서 TF-IDF는 정보이론에서 영감을 받은 휴리스틱이지 진짜 확률모델은 아니다. 20년 동안 검색 순위 매기기의 지배적 점수였고, 지금도 모든 신경 검색기 (BM25 = TF-IDF + 포화 + 길이 정규화) 가 넘어야 할 베이스라인.
