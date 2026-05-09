---
term: loss function
related: [gradient-descent, learning-rate]
---

A function that turns "the model is wrong" into a single number. Given the model's predictions `ŷ` and the true labels `y`, the loss is `L(ŷ, y)` — small when the predictions are close, large when they're far. Squared error `(ŷ − y)²` is the standard choice for regression because it's smooth and its derivative is easy. Cross-entropy is the standard for classification. Training a model means changing its parameters until the loss, summed over the dataset, gets as small as possible.
