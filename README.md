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

Point an Argo CD instance at the bootstrap application:

```bash
kubectl apply -f bootstrap/root-application.yaml
```

Argo CD then syncs the rest of the platform automatically.

To try the admission policies, see [`examples/README.md`](examples/README.md).

## License

[MIT](LICENSE)
