# Vercel + Supabase Go-Live

This checklist finishes the AI Governance Persona dynamic deployment after the code is deployed.

## Current Production URLs

- App: `https://ai-persona.linenyu.com/`
- English quiz: `https://ai-persona.linenyu.com/en/`
- Chinese quiz: `https://ai-persona.linenyu.com/cn/`
- Admin viewer: `https://ai-persona.linenyu.com/admin/`
- Dynamic health: `https://ai-persona.linenyu.com/api/health`

The personal homepage is handled by the separate `linenyu-site` repository.

## 1. Create Supabase Storage

In the Supabase SQL Editor, run the contents of:

```text
supabase/quiz-results-schema.sql
```

The table name defaults to:

```text
quiz_results
```

If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are already injected into the local shell, verify the table and service-role permission before configuring Vercel:

```sh
npm run vercel:supabase:check
```

This writes one temporary readiness row and deletes it immediately. Use `npm run vercel:supabase:check -- --read-only` if you only want to verify table readability.

## 2. Set Vercel Environment Variables

From a local terminal in this repository, run:

```sh
scripts/set-vercel-production-env.sh production
```

The script prompts for:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_RESULTS_TABLE`, default `quiz_results`
- `EXPORT_TOKEN`

It sends values to Vercel through stdin and does not print secret values.

If those variables are already injected into the shell, use:

```sh
scripts/set-vercel-production-env.sh production from-env
```

Confirm the Vercel production env names are present before the final strict deploy:

```sh
npm run vercel:env:check
```

## 3. Redeploy Vercel

```sh
npm run vercel:deploy
```

After Supabase env vars and DNS are configured, use strict mode. This first checks that production env variable names exist, then redeploys so Vercel Functions receive the new values:

```sh
export REMOTE_DATABASE_TOKEN="<same value as EXPORT_TOKEN>"
npm run vercel:deploy -- --strict
```

Strict mode writes one test result row and requires `stored: true`. It also uses `REMOTE_DATABASE_TOKEN`, `EXPORT_TOKEN`, or `RESULTS_EXPORT_TOKEN` from the local shell to verify `/api/results` and `/api/export.csv` with authenticated requests. Do not paste the token into committed files.

## 4. DNS

The app domain should be attached to the Vercel project for this repository:

```text
ai-persona.linenyu.com
```

Current expected DNS record:

```text
CNAME  ai-persona.linenyu.com  33236d9ab28d641f.vercel-dns-017.com
```

Run this after editing DNS to see the exact remaining records:

```sh
npm run vercel:go-live:status
```

The status command checks the local resolver plus Cloudflare, Google, and Quad9. DNS is ready when the app domain and propagation checks show `[ok]`.

To keep checking automatically after DNS or Vercel env changes:

```sh
npm run vercel:go-live:watch
```

It checks every 60 seconds by default and exits when all go-live status checks pass. To change the interval:

```sh
GO_LIVE_WATCH_INTERVAL=30 npm run vercel:go-live:watch
```

For a single status poll, useful in automation:

```sh
GO_LIVE_WATCH_MAX_ITERATIONS=1 npm run vercel:go-live:watch
```

## 5. Final Verification

Before Supabase and DNS are fully configured, this checks that the app deployment is alive:

```sh
npm run vercel:verify:live
```

To see the remaining go-live checklist as a machine-checked status report:

```sh
npm run vercel:go-live:status
```

After Supabase env vars and DNS are configured, run:

```sh
export REMOTE_DATABASE_TOKEN="<same value as EXPORT_TOKEN>"
npm run vercel:verify:live -- --require-configured --submit
```

The strict final check must prove:

- `ai-persona.linenyu.com` resolves to Vercel.
- `https://ai-persona.linenyu.com/` redirects to `/en/`.
- `https://ai-persona.linenyu.com/en/` serves the English quiz.
- `/api/health` reports `dynamic: true`.
- `/api/health` reports storage and export configured.
- `/api/storage-health` is usable with the export token and confirms the Supabase table is readable.
- `/api/submit-result` returns `stored: true` for a test row.
- `/api/results` and `/api/export.csv` are protected and usable with the export token.
- `/admin/` can display stored rows with the export token.
