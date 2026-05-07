---
term: logsumexp
flag: |
  "max-shift" 트릭 — log(Σ exp(xᵢ)) = max(x) + log(Σ exp(xᵢ − max(x))) — 내부 지수를 ≤ 0 로 유지하여 오버플로우와 언더플로우를 모두 피한다.
related: [logarithm, underflow, log-softmax]
---
지수 합의 로그를 수치적으로 안정하게 계산하는 함수. torch.logsumexp 와 scipy.special.logsumexp 로 제공된다. softmax, log_softmax, 거의 모든 확률 기반 손실 함수의 기본 부품.
