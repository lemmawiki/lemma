---
term: cash flow
related: [present-value, discount-factor]
---

A schedule of money in (positive) and money out (negative) over time. Discrete cash flows are a list of amounts at specified dates: `C_1` at `t_1`, `C_2` at `t_2`, …. Continuous cash flows are a _rate_: `c(t)` dollars per unit time, so the amount received in a small interval `dt` is `c(t) dt`. Bond coupons are discrete; payroll seen at the second granularity is essentially continuous; rent is borderline. The distinction matters for valuation — discrete sums become continuous integrals when payment frequency is high. Either way, a stream's worth today is the _present value_ of the stream — each entry discounted to time 0 and added up.
