#!/usr/bin/env bash
set -euo pipefail

target="${VERCEL_DYNAMIC_DIST:-/tmp/ai-persona-vercel-dynamic-dist}"
project="${VERCEL_PROJECT_NAME:-ai-governance-persona}"
strict="${1:-}"

if [ "$project" = "linenyu-site" ] && [ "${ALLOW_PERSONAL_SITE_PROJECT_DEPLOY:-}" != "1" ]; then
  echo "Refusing to deploy AI Persona to Vercel project 'linenyu-site'." >&2
  echo "Use the separate AI Persona Vercel project, or set ALLOW_PERSONAL_SITE_PROJECT_DEPLOY=1 only for an intentional migration." >&2
  exit 2
fi

if [ "$strict" = "--strict" ] && \
  [ -z "${REMOTE_DATABASE_TOKEN:-}" ] && \
  [ -z "${EXPORT_TOKEN:-}" ] && \
  [ -z "${RESULTS_EXPORT_TOKEN:-}" ]; then
  echo "Strict verification requires REMOTE_DATABASE_TOKEN, EXPORT_TOKEN, or RESULTS_EXPORT_TOKEN in the local shell." >&2
  exit 2
fi

if [ "$strict" = "--strict" ]; then
  echo "Checking Vercel production environment variable names..."
  npm run vercel:env:check
fi

echo "Running release checks..."
npm run release:check

echo "Building Vercel dynamic bundle at $target..."
npm run release:bundle:vercel -- "$target"

echo "Deploying $target to Vercel project $project..."
vercel_args=("$target" "--prod" "--yes" "--project" "$project")
if [ -n "${VERCEL_TOKEN:-}" ]; then
  vercel_args+=("--token" "$VERCEL_TOKEN")
fi
if [ -n "${VERCEL_SCOPE:-}" ]; then
  vercel_args+=("--scope" "$VERCEL_SCOPE")
fi
npx vercel "${vercel_args[@]}"

if [ "$strict" = "--strict" ]; then
  echo "Running strict live verification. This writes one test result row."
  npm run vercel:verify:live -- --require-configured --submit
else
  echo "Running default live verification."
  npm run vercel:verify:live
  echo "For final go-live after DNS and Supabase env are configured, run:"
  echo "  scripts/deploy-vercel-dynamic.sh --strict"
fi
