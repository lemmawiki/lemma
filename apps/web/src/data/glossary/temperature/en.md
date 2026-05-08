---
term: temperature
---

A positive scalar `T` applied as `softmax(z/T)`. Low `T` _sharpens_ the distribution — the largest logit dominates, and the model looks more confident. High `T` _flattens_ it — every class gets a similar share, and the model looks more uncertain. `T = 1` is the unaltered softmax. Crucially, `T` does not change _which_ class wins, only how strongly the winning probability is reported. Used for sampling control in language models, for soft targets in distillation, and for repairing overconfidence in calibration.
