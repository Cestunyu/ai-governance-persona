#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: scripts/set-local-secret.sh VARIABLE_NAME [ENV_FILE]" >&2
  echo "Example: scripts/set-local-secret.sh REMOTE_DATABASE_TOKEN" >&2
  exit 2
fi

name="$1"
env_file="${2:-.env.local}"

case "$name" in
  ''|*[!A-Z0-9_]*|[0-9]*)
    echo "Variable name must use uppercase letters, numbers, and underscores, and not start with a number." >&2
    exit 2
    ;;
esac

umask 077
touch "$env_file"
chmod 600 "$env_file"

printf "Paste %s (input hidden), then press Enter: " "$name" >&2
stty -echo
IFS= read -r value
stty echo
printf "\n" >&2

tmp_file="$(mktemp)"
trap 'rm -f "$tmp_file"' EXIT

grep -v "^${name}=" "$env_file" > "$tmp_file" 2>/dev/null || true
printf "%s=%s\n" "$name" "$value" >> "$tmp_file"
mv "$tmp_file" "$env_file"
chmod 600 "$env_file"
trap - EXIT

if git check-ignore -q "$env_file"; then
  echo "Saved $name to $env_file. Git is ignoring this file."
else
  echo "Saved $name to $env_file, but Git is NOT ignoring this file. Check .gitignore before committing." >&2
  exit 1
fi
