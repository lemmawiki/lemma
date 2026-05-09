---
term: bag of words
related: [tf-idf, term-frequency]
---

A representation that treats a document as a multiset of its tokens — counts only, no order. "the cat sat" and "sat the cat" produce the same bag. Crude (it loses syntax, negation, anaphora), but the right level of abstraction for the task TF-IDF solves: ranking docs by which words they contain. Every word-counting feature for text — TF-IDF, naive Bayes on text, latent Dirichlet allocation — sits on top of this representation.
