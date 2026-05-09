---
term: BM25
related: [tf-idf, term-frequency]
---

`Okapi BM25` — TF-IDF with two empirical fixes. (1) **Saturation:** raw `tf` grows linearly, but the 5th occurrence of a term in a doc shouldn't count as much as the 1st. BM25 replaces `tf` with `(k₁+1)·tf / (k₁+tf)`, which saturates around `k₁ ≈ 1.2`. (2) **Length normalization:** docs longer than the average get their `tf` damped further. Both corrections were tuned on retrieval evaluations (TREC) in the 1990s and held up: BM25 is still the default sparse-retrieval baseline that dense neural retrievers must beat to claim progress.
