---
term: bag of words (BoW)
related: [tf-idf, term-frequency]
---

문서를 토큰의 다중집합으로 보는 표현 — 빈도만 세고 순서는 버린다. "the cat sat"과 "sat the cat"은 같은 가방을 만든다. 거칠지만 (구문, 부정, 지시 관계를 잃는다), TF-IDF가 푸는 문제 — 어떤 단어를 포함하느냐로 문서 순위를 매기기 — 에는 딱 맞는 추상도. 텍스트의 모든 단어-세기 특징 (TF-IDF, 텍스트 나이브 베이즈, LDA) 이 이 표현 위에 얹힌다.
