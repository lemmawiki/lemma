---
term: temperature scaling
related: [calibration, temperature, logit, softmax]
---

The simplest fix for an overconfident classifier. The model produces _logits_ `z`, then a softmax converts them to probabilities. _Temperature scaling_ divides the logits by a single scalar `T > 0` _before_ the softmax: `softmax(z / T)`. `T = 1` leaves the model alone; `T > 1` flattens the distribution (less confident); `T < 1` sharpens it (more confident). Crucially, dividing every logit by the same constant _preserves the argmax_ — the predicted class never changes, so accuracy is unchanged. Only the confidence numbers move. `T` is fit on a held-out validation set by minimizing log loss; one parameter, one scalar, no architecture changes — usually the first thing to try when a reliability diagram bows below the diagonal.
