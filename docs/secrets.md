# Local Secrets

This repository should track only secret names and setup instructions, never real token values.

## Local Development

1. Copy the template:

```sh
cp .env.example .env.local
```

2. Edit `.env.local` yourself and paste the real token there.

3. Confirm Git ignores the real file:

```sh
git check-ignore -v .env.local
```

Expected result: Git reports a `.gitignore` rule for `.env.local`.

## Remote Deployment

Store production tokens in the hosting provider's environment variables or secret manager, not in Git.

For this project, the remote data store is EdgeOne Pages Blob, not a traditional database URL. The deployed namespace is `ai-ideology-results`, and `edge-functions/api/export.csv.js` reads the production secret as `EXPORT_TOKEN` or `RESULTS_EXPORT_TOKEN`.

Locally, use `REMOTE_DATABASE_TOKEN`. It should contain the same secret value as the deployed `EXPORT_TOKEN`, but agents and scripts should refer to the local name:

```sh
scripts/set-local-secret.sh REMOTE_DATABASE_TOKEN
npm run data:export
```

The deployed export endpoint is:

```text
https://ai-persona-qxad5fjx.edgeone.cool/api/export.csv
```

## Working With Codex

Codex should not read `.env`, `.env.*`, or other files containing real tokens. If Codex needs to access the remote database, start the relevant command or dev server from a shell where the token is already injected. Codex can run the command and observe non-secret outputs, but it should not inspect the token file or print environment values.

For one-off shell commands, prefer this pattern:

```sh
set -a
. ./.env.local
set +a
npm run <script-that-uses-env>
```

Do not ask Codex to run `cat .env.local`, `env`, `printenv`, or any command that echoes the token.
