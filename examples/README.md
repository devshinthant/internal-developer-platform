# Policy Examples

Reproducible demo of the platform's Kyverno admission policies.

These manifests are applied **manually with `kubectl`** — they are **not**
reconciled by Argo CD (they live outside every Argo-synced path on purpose, so
a deliberately-broken manifest never puts an Argo app into a permanent
`OutOfSync` state).

Because the cluster has no local checkout of this repo, apply them straight
from the GitHub raw URL.

## Passing — admitted

```bash
kubectl apply -f https://raw.githubusercontent.com/devshinthant/internal-developer-platform/main/examples/passing/good-deployment.yaml
```

Satisfies all policies: required labels, non-`latest` tag, probes (liveness ≠
readiness), resource requests + limits, `runAsNonRoot`, and
`allowPrivilegeEscalation: false`.

## Rejected — denied at admission

```bash
kubectl apply -f https://raw.githubusercontent.com/devshinthant/internal-developer-platform/main/examples/rejected/bad-deployment.yaml
```

Denied by Kyverno with messages from `disallow-latest-tag`, `require-probes`,
`require-resources`, and `check-labels`.

## Cleanup

```bash
kubectl delete -f https://raw.githubusercontent.com/devshinthant/internal-developer-platform/main/examples/passing/good-deployment.yaml --ignore-not-found
```

(The rejected deployment is never created, so there is nothing to delete for it.)
