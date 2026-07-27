# Internal Developer Platform

A GitOps-based internal developer platform on Kubernetes. Argo CD reconciles
everything in this repo, Kyverno enforces admission policies, and External
Secrets syncs secrets — with a Node.js service as the golden-path template.

## How it works

An Argo CD [root application](bootstrap/root-application.yaml) recursively syncs
[`apps/`](apps), where each manifest is an Argo `Application` pointing at the
platform component it owns.

## Layout

| Path | Purpose |
| --- | --- |
| [`bootstrap/`](bootstrap) | Root Argo CD app that bootstraps everything else |
| [`apps/`](apps) | Argo `Application` definitions (app-of-apps) |
| [`platform/`](platform) | Cluster components — Kyverno policies, External Secrets |
| [`charts/`](charts) | Helm charts for platform services |
| [`services/`](services) | Application source code (`node-api`) |
| [`previews/`](previews) | Per-PR preview environments |
| [`examples/`](examples) | Demo manifests for the Kyverno policies |
| [`.github/workflows/`](.github/workflows) | CI, preview, and cleanup pipelines |

## Getting started

Prerequisites: `kind`, `kubectl`, `helm`, and `docker`. Your user must be able to
reach the Docker socket — add yourself to the `docker` group rather than running
the script with `sudo`, which would write the kubeconfig to root's home.

```bash
./bootstrap/install.sh
```

This creates the `idp` kind cluster, installs Argo CD, seeds the demo secret
backend, and applies the root application. Argo CD then syncs the rest of the
platform automatically.

Watch it converge:

```bash
kubectl -n argo-cd get applications -w
```

If you already have a cluster with Argo CD installed, apply the root application
on its own instead:

```bash
kubectl apply -f bootstrap/root-application.yaml
```

To try the admission policies, see [`examples/README.md`](examples/README.md).

## License

[MIT](LICENSE)
