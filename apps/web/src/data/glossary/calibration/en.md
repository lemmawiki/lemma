---
term: calibration
related: [linearization, cross-entropy]
---

The match between a model's predicted probabilities and actual frequencies. A model is _calibrated_ if, on examples it labels "70% confident," it is correct close to 70% of the time. Calibration is plotted as a _reliability diagram_: predicted probability on the x-axis, observed accuracy on the y-axis; perfect calibration is the diagonal `y = x`. Most modern neural networks are _overconfident_ — their high-probability predictions are correct less often than they claim — and the standard fix is _temperature scaling_, a single dial that pulls the curve back toward the diagonal. Calibration is distinct from accuracy: a perfectly accurate classifier on a tiny dataset can be wildly miscalibrated, and a calibrated model can be wrong about every individual prediction as long as the _frequencies_ line up.
