---
term: TF-IDF
related: [term-frequency, inverse-document-frequency, surprise, cosine-similarity]
---

A document score equal to `tf(term, doc) · idf(term, corpus)`, summed over the query terms. Term frequency rewards a doc for using the query word a lot; inverse document frequency discounts words that show up in many docs. The product mimics "log of a joint probability" intuition — but only mimics: tf is a count, not a probability, so TF-IDF is a heuristic motivated by information theory, not a true probabilistic model. It was the dominant search-ranking score for two decades and remains the baseline (BM25 = TF-IDF + saturation + length normalization) every neural retriever benchmarks against.
