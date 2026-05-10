---
term: present value
related: [discount-factor, cash-flow, compound-interest]
---

What a future payment is worth _right now_. A dollar received in a year is worth less than a dollar in hand: the recipient could have invested today's dollar at rate `r` and held `1 + r` (or `e^r` for continuous compounding) by next year. Reversing that — _discounting_ — answers "how much do I need today to match `$1` in a year?". Notation: `PV = C / (1 + r)^t` for one payment of `C` after `t` years (discrete), or `PV = C · e^(−rt)` for continuous compounding. For a stream of payments — bond coupons, dividends, salaries, insurance flows — present value sums (or integrates) each future amount times its discount factor. The unit of all of finance pricing.
