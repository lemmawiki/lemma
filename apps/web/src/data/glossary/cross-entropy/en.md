---
term: cross-entropy
---

The loss function used to train classifiers. Given a true class `y` and a predicted distribution `p` over `n` classes, cross-entropy is `−log p_y` — the negative log of the probability the model assigned to the correct answer. Equal to negative log-likelihood when the target is one-hot. It punishes confident wrong answers harshly (`p_y → 0` sends loss `→ ∞`) and rewards confident right ones (`p_y → 1` sends loss `→ 0`). Built on log because log turns the product of independent likelihoods into a sum.
