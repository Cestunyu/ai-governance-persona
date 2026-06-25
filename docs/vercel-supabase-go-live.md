# Vercel + Supabase Go-Live

This checklist finishes the dynamic Vercel deployment after the code is deployed.

## Current Production URLs

- Site: `https://linenyu-site.vercel.app`
- Admin viewer: `https://linenyu-site.vercel.app/admin/`
- Dynamic health: `https://linenyu-site.vercel.app/api/health`

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

After Supabase env vars and DNS are configured, use the strict mode. This mode first checks that the production env variable names exist, then redeploys so the Vercel Functions receive the new values:

```sh
export REMOTE_DATABASE_TOKEN="<same value as EXPORT_TOKEN>"
npm run vercel:deploy -- --strict
```

Strict mode writes one test result row and requires `stored: true`. It also uses `REMOTE_DATABASE_TOKEN`, `EXPORT_TOKEN`, or `RESULTS_EXPORT_TOKEN` from the local shell to verify `/api/results` and `/api/export.csv` with authenticated requests. Do not paste the token into committed files.

## 4. Update DNS At Spaceship

Current nameservers are `launch1.spaceship.net` and `launch2.spaceship.net`, so update DNS in Spaceship unless nameservers are moved to Vercel.

Replace the old EdgeOne records with:

```text
A      linenyu.com             216.198.79.1
A      linenyu.com             64.29.17.1
CNAME  www.linenyu.com         33236d9ab28d641f.vercel-dns-017.com
CNAME  ai-persona.linenyu.com  33236d9ab28d641f.vercel-dns-017.com
```

In the Spaceship DNS editor, this usually means:

```text
Delete old A      @           -> 43.174.246.100 / 43.174.247.100
Delete old CNAME  www         -> www.linenyu.com.pages.dnsoe6.com
Delete old CNAME  ai-persona  -> ai-persona.linenyu.com.pages.dnsoe5.com

Add A             @           -> 216.198.79.1
Add A             @           -> 64.29.17.1
Add CNAME         www         -> 33236d9ab28d641f.vercel-dns-017.com
Add CNAME         ai-persona  -> 33236d9ab28d641f.vercel-dns-017.com
```

Run this after editing DNS to see the exact remaining records:

```sh
npm run vercel:go-live:status
```

The status command checks the local resolver plus Cloudflare, Google, and Quad9. DNS is ready when all three custom domains and their propagation checks show `[ok]`.

To keep checking automatically after editing DNS or Vercel env vars:

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

Alternative: move nameservers to:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Before moving nameservers, preserve any email or other non-web DNS records.

## 5. Final Verification

Before Supabase and DNS are fully configured, this checks that the default Vercel domain is alive:

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

- `linenyu.com`, `www.linenyu.com`, and `ai-persona.linenyu.com` resolve to Vercel.
- `https://linenyu.com/` serves the personal mother site.
- `https://www.linenyu.com/` redirects to `https://linenyu.com/`.
- `https://ai-persona.linenyu.com/` redirects to `/en/`, and `/en/` serves the English quiz.
- `/api/health` reports `dynamic: true`.
- `/api/health` reports storage and export configured.
- `/api/storage-health` is usable with the export token and confirms the Supabase table is readable.
- `/api/submit-result` returns `stored: true` for a test row.
- `/api/results` and `/api/export.csv` are protected and usable with the export token.
- `/admin/` can display stored rows with the export token.
