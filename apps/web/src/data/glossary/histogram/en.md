---
term: histogram
related: [entropy, bit, surprise]
---

A count of how often each _value_ appears in a dataset. For an image: how many pixels are this dark, how many are that light, ignoring _where_ in the picture they sit. The histogram throws away spatial structure on purpose — it answers "what's the distribution of brightness?" but not "is the picture smooth or noisy?". When you compute _entropy_ over a histogram, you get a lower bound on the bits-per-symbol needed to encode each value _independently_; for an image, that's almost always a loose bound, because real pixels aren't independent of their neighbors.
