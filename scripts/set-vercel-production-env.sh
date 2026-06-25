#!/usr/bin/env bash
set -euo pipefail

environment="${1:-production}"
mode="${2:-prompt}"

case "$environment" in
  production|preview|development) ;;
  *)
    echo "Usage: scripts/set-vercel-production-env.sh [production|preview|development] [prompt|from-env]" >&2
    exit 2
    ;;
esac

case "$mode" in
  prompt|from-env) ;;
  *)
    echo "Usage: scripts/set-vercel-production-env.sh [production|preview|development] [prompt|from-env]" >&2
    exit 2
    ;;
esac

set +x

restore_tty() {
  stty echo 2>/dev/null || true
}

trap restore_tty EXIT

add_env() {
  local name="$1"
  local value="$2"
  local sensitivity="$3"

  if [ "$sensitivity" = "sensitive" ]; then
    printf "%s" "$value" | npx vercel env add "$name" "$environment" --force --sensitive --yes >/dev/null
  else
    printf "%s" "$value" | npx vercel env add "$name" "$environment" --force --no-sensitive --yes >/dev/null
  fi
  echo "Set $name for Vercel $environment."
}

read_secret() {
  local name="$1"
  local value
  printf "Paste %s (input hidden), then press Enter: " "$name" >&2
  stty -echo
  IFS= read -r value
  restore_tty
  printf "\n" >&2
  printf "%s" "$value"
}

read_visible() {
  local name="$1"
  local default_value="${2:-}"
  local value
  if [ -n "$default_value" ]; then
    printf "Enter %s [%s]: " "$name" "$default_value" >&2
  else
    printf "Enter %s: " "$name" >&2
  fi
  IFS= read -r value
  printf "%s" "${value:-$default_value}"
}

value_from_env() {
  local name="$1"
  printenv "$name" 2>/dev/null || true
}

require_value() {
  local name="$1"
  local value="$2"
  if [ -z "$value" ]; then
    echo "$name is required." >&2
    exit 2
  fi
}

require_table_name() {
  local value="$1"
  if [[ "$value" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
    return
  fi
  echo "SUPABASE_RESULTS_TABLE must be a plain table name such as quiz_results." >&2
  exit 2
}

if [ "$mode" = "from-env" ]; then
  supabase_url="$(value_from_env SUPABASE_URL)"
  service_role_key="$(value_from_env SUPABASE_SERVICE_ROLE_KEY)"
  results_table="$(value_from_env SUPABASE_RESULTS_TABLE)"
  export_token="$(value_from_env EXPORT_TOKEN)"
else
  supabase_url="$(read_visible SUPABASE_URL)"
  service_role_key="$(read_secret SUPABASE_SERVICE_ROLE_KEY)"
  results_table="$(read_visible SUPABASE_RESULTS_TABLE quiz_results)"
  export_token="$(read_secret EXPORT_TOKEN)"
fi

require_value SUPABASE_URL "$supabase_url"
require_value SUPABASE_SERVICE_ROLE_KEY "$service_role_key"
require_value EXPORT_TOKEN "$export_token"
results_table="${results_table:-quiz_results}"
require_table_name "$results_table"

case "$supabase_url" in
  https://*) ;;
  *)
    echo "SUPABASE_URL must start with https://." >&2
    exit 2
    ;;
esac

add_env SUPABASE_URL "$supabase_url" regular
add_env SUPABASE_SERVICE_ROLE_KEY "$service_role_key" sensitive
add_env SUPABASE_RESULTS_TABLE "$results_table" regular
add_env EXPORT_TOKEN "$export_token" sensitive

echo "Vercel $environment environment variable setup complete."
echo "Redeploy with: npm run release:check && npm run release:bundle:vercel -- /tmp/ai-persona-vercel-dynamic-dist && npx vercel /tmp/ai-persona-vercel-dynamic-dist --prod --yes --project linenyu-site"
