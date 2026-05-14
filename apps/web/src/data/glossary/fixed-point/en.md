---
term: fixed point
related: [equilibrium, derivative, convergence]
---

A value that stays put when fed through a function or rule. For an iteration `x ← f(x)`, a fixed point `x*` satisfies `f(x*) = x*` — apply the rule and nothing changes. For a differential equation `dx/dt = g(x)`, a fixed point is where `g(x*) = 0` and the system stops evolving. _Equilibrium_ in physics, _minimum_ in optimization, and _steady state_ in numerical methods all name the same object: the place where the next step lands you back on yourself. Two flavours matter — _stable_ (small disturbances die out, system returns) and _unstable_ (small disturbances grow, system escapes); the difference is the sign of the local derivative `g'(x*)`.
