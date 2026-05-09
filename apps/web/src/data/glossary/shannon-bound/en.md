---
term: Shannon bound
related: [entropy, bit]
---

The source-coding theorem (1948): no lossless code can use fewer than `H(X)` bits per symbol on average. Huffman codes get within 1 bit of the bound; arithmetic coding gets arbitrarily close. The reason a 5GB random file barely compresses and a 5GB English-text file compresses to a fifth: the English text has lower per-symbol entropy than its raw bytes suggest.
