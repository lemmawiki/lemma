---
term: softmax
---

The function that turns a vector of logits `z = (z₁, …, zₙ)` into a vector of positive numbers summing to 1: `softmax(z)ᵢ = exp(zᵢ) / Σⱼ exp(zⱼ)`. Two facts to keep close. (1) It depends only on differences `zᵢ − zⱼ` — adding the same constant to every logit changes nothing. (2) It never outputs exactly 0 or 1, only their limits. The output _looks like_ a probability distribution; it does not guarantee that the assigned probability matches any real-world frequency.
