# Policy Examples

Reproducible demo of the platform's Kyverno admission policies.

These manifests are applied **manually with `kubectl`** — they are **not**
reconciled by Argo CD (they live outside every Argo-synced path on purpose, so
a deliberately-broken manifest never puts an Argo app into a permanent
`OutOfSync` state).

## Prerequisite: clone the repo on the machine that runs `kubectl`

The cluster has no local checkout of this repo, so clone it once on the box with
cluster access:

```bash
git clone https://github.com/devshinthant/internal-developer-platform.git
cd internal-developer-platform
```

(Later, `git pull` to pick up changes.)

## Passing — admitted

```bash
kubectl apply -f examples/passing/good-deployment.yaml
```

Satisfies all policies: required labels, non-`latest` tag, probes (liveness ≠
readiness), resource requests + limits, `runAsNonRoot`, and
`allowPrivilegeEscalation: false`.

## Rejected — denied at admission

```bash
kubectl apply -f examples/rejected/bad-deployment.yaml
```

Denied by Kyverno with messages from `disallow-latest-tag`, `require-probes`,
`require-resources`, and `check-labels`.

## Cleanup

```bash
kubectl delete -f examples/passing/good-deployment.yaml --ignore-not-found
```

(The rejected deployment is never created, so there is nothing to delete for it.)
