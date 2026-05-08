---
term: logit
---

A real-valued score a model produces before normalization — the raw output of a final linear layer, with no constraint to be positive or sum to anything. Logits can be any size; only their differences matter, since softmax depends only on `zᵢ − zⱼ`. A logit means nothing on its own. It only acquires interpretation as a "probability" after softmax — and even then, only in the same sense as any number between 0 and 1.
