---
term: reliability diagram
related: [calibration, linearization]
---

The standard plot for _calibration_. Bin predictions by their stated probability (`[0.0–0.1]`, `[0.1–0.2]`, …, `[0.9–1.0]`); for each bin, plot the _mean predicted probability_ on the x-axis against the _observed accuracy_ (fraction of those predictions that turned out correct) on the y-axis. A perfectly calibrated model traces the diagonal `y = x`. A bar that sits _below_ the diagonal at x=0.9 means the model says "90% confident" but is correct only — say — 75% of the time: _overconfident_. Above the diagonal is _underconfident_. The vertical gap at each bin, weighted by the number of predictions in that bin, sums to the _expected calibration error (ECE)_.
