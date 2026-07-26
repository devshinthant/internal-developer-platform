#!/usr/bin/env bash
# Setting Shell Behaviours - (Exit on command failure, unset vars, pipeline failure)
set -euo pipefail

CLUSTER_NAME="idp"
ARGOCD_NS="argo-cd"
SECRET_NS="platform-secrets"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check requisities
for tool in kind kubectl helm docker; do
  command -v "$tool" 1>/dev/null 2>&1 || {
    echo "ERROR: '$tool' is not installed. See README prerequisites."
    exit 1
  }
done

# Create Kind Cluster
kind get clusters | grep -qx "$CLUSTER_NAME" || kind create cluster --name "$CLUSTER_NAME"

# Install ArgoCD
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm upgrade --install argo-cd argo/argo-cd \
  --namespace "$ARGOCD_NS" --create-namespace \
  --version 9.5.21 --wait --timeout 5m

# Wait for ArgoCD server to be ready
kubectl -n "$ARGOCD_NS" rollout status deployment argo-cd-argocd-server --timeout=300s

# Seed Secrets
kubectl create namespace "$SECRET_NS" --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic -n "$SECRET_NS" node-api-source-secret \
  --from-literal=DEMO_SECRET='super-secret-value' \
  --dry-run=client -o yaml | kubectl apply -f -

# Apply the Argo Bootstrap Definition
kubectl apply -f "$SCRIPT_DIR/root-application.yaml"
echo "Bootstrapped. Watch: kubectl -n $ARGOCD_NS get applications -w"
