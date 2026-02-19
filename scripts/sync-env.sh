#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../frontend/.env"
SA_FILE="${SCRIPT_DIR}/../frontend/service-account.json"

# Flags
GITHUB_ONLY=false
FIREBASE_ONLY=false
DRY_RUN=false

usage() {
  echo "Usage: $0 [--github-only] [--firebase-only] [--dry-run]"
  echo ""
  echo "Syncs frontend/.env values and service account to GitHub Secrets"
  echo "and Firebase App Hosting secrets."
  echo ""
  echo "Options:"
  echo "  --github-only    Only push to GitHub Secrets"
  echo "  --firebase-only  Only push to Firebase App Hosting secrets"
  echo "  --dry-run        Print what would be done without executing"
  exit 0
}

for arg in "$@"; do
  case "$arg" in
    --github-only)  GITHUB_ONLY=true ;;
    --firebase-only) FIREBASE_ONLY=true ;;
    --dry-run)      DRY_RUN=true ;;
    --help|-h)      usage ;;
    *) echo "Unknown option: $arg"; usage ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

echo "Reading from $ENV_FILE"
echo ""

while IFS= read -r line || [[ -n "$line" ]]; do
  # Skip empty lines and comments
  [[ -z "$line" || "$line" =~ ^# ]] && continue

  # Parse key=value
  key="${line%%=*}"
  value="${line#*=}"

  # Strip surrounding quotes from value
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"

  # Skip if key is empty or value is empty
  [[ -z "$key" || -z "$value" ]] && continue

  if [[ "$FIREBASE_ONLY" != true ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "[dry-run] gh secret set $key"
    else
      echo "Setting GitHub secret: $key"
      echo "$value" | gh secret set "$key"
    fi
  fi

  if [[ "$GITHUB_ONLY" != true ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "[dry-run] firebase apphosting:secrets:set $key"
    else
      echo "Setting Firebase secret: $key"
      echo "$value" | firebase apphosting:secrets:set "$key"
    fi
  fi
done < "$ENV_FILE"

# Handle service account file separately
if [[ -f "$SA_FILE" ]]; then
  echo ""
  echo "Found $SA_FILE"

  if [[ "$FIREBASE_ONLY" != true ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "[dry-run] gh secret set FIREBASE_SERVICE_ACCOUNT < $SA_FILE"
    else
      echo "Setting GitHub secret: FIREBASE_SERVICE_ACCOUNT"
      gh secret set FIREBASE_SERVICE_ACCOUNT < "$SA_FILE"
    fi
  fi
else
  echo ""
  echo "Warning: $SA_FILE not found, skipping FIREBASE_SERVICE_ACCOUNT"
fi

echo ""
echo "Done."
