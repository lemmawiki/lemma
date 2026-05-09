---
term: term frequency
related: [tf-idf, inverse-document-frequency]
---

`tf(t, d) = count(t, d) / length(d)`. The fraction of words in document `d` that are equal to term `t`. Dividing by doc length is the "level the playing field" step — without it, longer docs would score higher just for using more of every word. Variants exist (raw count, log-scaled, augmented), but the normalized form is the standard intuition.
