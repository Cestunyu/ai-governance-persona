#!/usr/bin/env bash
set -euo pipefail

env_file="${1:-.env.local}"

if [ -f "$env_file" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$env_file"
  set +a
fi

if [ -z "${REMOTE_DATABASE_TOKEN:-}" ]; then
  echo "REMOTE_DATABASE_TOKEN is not set. Run: scripts/set-local-secret.sh REMOTE_DATABASE_TOKEN" >&2
  exit 2
fi

endpoint="${REMOTE_DATABASE_URL:-https://ai-persona-qxad5fjx.edgeone.cool/api/export.csv}"
output="${REMOTE_DATABASE_EXPORT_PATH:-data/remote-results.csv}"

mkdir -p "$(dirname "$output")"

curl --fail --silent --show-error \
  --header "Authorization: Bearer ${REMOTE_DATABASE_TOKEN}" \
  "$endpoint" \
  --output "$output"

rows="$(wc -l < "$output" | tr -d ' ')"
echo "Downloaded remote results to $output ($rows lines)."
