---
term: document frequency
related: [inverse-document-frequency, tf-idf]
---

`df(t)` = the number of documents in the corpus that contain term `t` at least once. Binary presence per doc (a doc with the term ten times still counts as 1). Distinct from _collection frequency_ (total occurrences across the corpus). IDF is built on `df`, not collection frequency, because "appears at all" is the signal a query cares about.
