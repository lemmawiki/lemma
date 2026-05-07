---
term: log_softmax
related: [logarithm, log-likelihood, underflow, logsumexp]
---

softmax 확률을 직접 만들지 않고 log(softmax(x)) 를 계산하는 수치적으로 안정한 함수. softmax 는 점수 벡터를 확률로 바꾸지만, 그 결과에 그대로 로그를 씌우면 작은 항이 언더플로우한다. log_softmax 는 logsumexp 트릭으로 두 단계를 한 번에 계산한다. 정밀도를 잃지 않으면서 깔끔한 그래디언트를 주기 때문에 모든 현대 분류 손실의 기본으로 쓰인다.
