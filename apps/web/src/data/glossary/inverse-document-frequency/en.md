---
term: inverse document frequency
related: [tf-idf, term-frequency, document-frequency, surprise]
---

`idf(t) = log(N / df(t))`, where `N` is the corpus size and `df(t)` is the number of docs containing term `t`. A term in every doc gives `log(1) = 0` — no signal. A term in 1 doc gives `log(N)` — maximum signal. The log isn't a tuning knob: treating `df/N` as "the probability a random doc contains this term", IDF is exactly the self-information `−log P(t)` from the entropy module — the bits of surprise the term carries. The probability frame is heuristic (assumes uniform random doc, binary presence), but the intuition is rigorous: rarity is signal.
