---
term: cosine similarity
related: [vector, tf-idf]
---

`cos(u, v) = (u · v) / (‖u‖ ‖v‖)`. The cosine of the angle between two vectors — a value in `[−1, 1]` (or `[0, 1]` when components are non-negative, as in TF-IDF). It measures _direction_, not _magnitude_: doubling a doc (concatenating it with itself) leaves cosine unchanged but blows up Euclidean distance. That length-invariance is why retrieval ranks by cosine, not by raw dot product or Euclidean.
