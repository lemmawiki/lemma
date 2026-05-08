---
term: negative log-likelihood
---

Abbreviated NLL. Given a probabilistic model and observed data, the _likelihood_ is the probability the model assigns to the data; the _log-likelihood_ is its logarithm; the _negative_ log-likelihood flips the sign so that minimization makes sense. For a single classification example with true class `y` and predicted distribution `p`, NLL is `−log p_y` — identical to cross-entropy in the one-hot case. The `−log p` form makes independent observations _add_, and makes confident-but-wrong predictions diverge to infinity.
