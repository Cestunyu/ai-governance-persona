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

The current deployment target is Vercel. Store production secrets in Vercel project environment variables for the AI Governance Persona app project.

Use the go-live checklist for the full setup:

```text
docs/vercel-supabase-go-live.md
```

Required for persistent result storage:

- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service-role key used only by Vercel serverless functions.
- `SUPABASE_RESULTS_TABLE`: optional; defaults to `quiz_results`.

Required for CSV export and protected admin reads:

- `EXPORT_TOKEN` or `RESULTS_EXPORT_TOKEN`: bearer/query token for `/api/export.csv` and bearer token for `/api/results` and `/api/storage-health`.

Create the Supabase table by running:

```sql
-- supabase/quiz-results-schema.sql
```

in the Supabase SQL Editor.

The old EdgeOne Pages Blob route has been removed from this repository. The active Vercel API routes live under `api/`.

Locally, use `REMOTE_DATABASE_TOKEN`. It should contain the same secret value as the deployed `EXPORT_TOKEN`, but agents and scripts should refer to the local name:

```sh
scripts/set-local-secret.sh REMOTE_DATABASE_TOKEN
npm run data:export
```

The deployed export endpoint is:

```text
https://ai-persona.linenyu.com/api/export.csv
```

The deployed browser viewer is:

```text
https://ai-persona.linenyu.com/admin/
```

Use the same `EXPORT_TOKEN` or `RESULTS_EXPORT_TOKEN` value in the viewer's token field. The viewer calls `/api/results` for table rows and `/api/export.csv` for downloads.

The deployed dynamic health endpoint is:

```text
https://ai-persona.linenyu.com/api/health
```

To set Vercel production variables without printing secret values:

```sh
scripts/set-vercel-production-env.sh production
npm run vercel:env:check
```

After setting variables and updating DNS, redeploy and run strict verification:

```sh
export REMOTE_DATABASE_TOKEN="<same value as EXPORT_TOKEN>"
npm run vercel:deploy -- --strict
```

If Supabase values are injected locally, verify the table and service-role key without printing secret values:

```sh
npm run vercel:supabase:check
```

The strict verifier uses the local `REMOTE_DATABASE_TOKEN`, `EXPORT_TOKEN`, or `RESULTS_EXPORT_TOKEN` only as a bearer token for `/api/results` and `/api/export.csv`; it does not print the token.

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
