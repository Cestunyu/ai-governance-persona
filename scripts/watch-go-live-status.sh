#!/usr/bin/env bash
set -euo pipefail

interval="${GO_LIVE_WATCH_INTERVAL:-60}"
max_iterations="${GO_LIVE_WATCH_MAX_ITERATIONS:-0}"

case "$interval" in
  ''|*[!0-9]*)
    echo "GO_LIVE_WATCH_INTERVAL must be a positive integer number of seconds." >&2
    exit 2
    ;;
esac

case "$max_iterations" in
  ''|*[!0-9]*)
    echo "GO_LIVE_WATCH_MAX_ITERATIONS must be a non-negative integer." >&2
    exit 2
    ;;
esac

if [ "$interval" -lt 10 ]; then
  echo "GO_LIVE_WATCH_INTERVAL must be at least 10 seconds." >&2
  exit 2
fi

echo "Watching Vercel go-live status every ${interval}s. Press Ctrl-C to stop."

iteration=0
while true; do
  iteration=$((iteration + 1))
  echo
  echo "=== $(date -u '+%Y-%m-%dT%H:%M:%SZ') run ${iteration} ==="
  if node scripts/check-go-live-status.js --strict; then
    echo "All go-live status checks passed."
    exit 0
  fi
  if [ "$max_iterations" -gt 0 ] && [ "$iteration" -ge "$max_iterations" ]; then
    echo "Reached GO_LIVE_WATCH_MAX_ITERATIONS=${max_iterations}; go-live checks are still pending."
    exit 1
  fi
  echo "Go-live checks are still pending. Rechecking in ${interval}s..."
  sleep "$interval"
done
