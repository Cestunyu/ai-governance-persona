# Site Deployment Cleanup

Date: 2026-06-20

## Diagnosis

The deployment state is still muddled because the repository is doing two jobs at once:

- Personal mother site for `linenyu.com`.
- AI Persona quiz/app with EdgeOne Pages Functions and Blob storage.

The active local EdgeOne binding is `.edgeone/project.json`:

- project: `ai-persona-overseas`
- project id: `makers-gcrdy5xwhnuw`

The historical deployment task records `ai-persona.linenyu.com` as the primary AI Persona custom domain, while `CURRENT.md` also records production deploys of the root personal mother site to the same EdgeOne Makers project.

## Current Facts

- `linenyu.com`, `ai-persona.linenyu.com`, and the EdgeOne default host returned network 403/filter HTML from this local environment on 2026-06-20, so local CLI smoke checks are not a reliable source of truth for the live HTML.
- `.github/workflows/deploy-pages.yml` exists and can deploy the static repo to GitHub Pages on `main`.
- No root-level `CNAME` is currently present in the working tree.
- `assets/cv/linen-yu-cv.pdf` exists locally and is linked from the homepage, but it is not tracked by git yet.
- The release bundle includes `assets/`, so manual EdgeOne bundle deploys can include the CV even while GitHub-based deploys will miss it unless the PDF is committed.
- Blog/Posts had placeholder `href="#"` links; these were removed in the same cleanup pass.
- `npm run release:check` was still enforcing the old rule that root `index.html` must redirect to `/cn/`; this was updated so the check validates `/cn/`, `/en/`, and `/ch/` without rejecting the personal mother-site homepage.
- On 2026-06-21, the user reported that the currently deployed EdgeOne version is not the latest local version and is missing visible question-count/progress behavior in some places.
- External fetch on 2026-06-21 showed the live AI Persona pages do expose the count/progress layer, but with inconsistent copy: top text said `16 questions` / `16 个问题`, while the progress layer showed `0/15`, and the incomplete-result copy still said `11 core judgments` / `11 道核心判断`.
- Local `/en/` and `/cn/` were cleaned on 2026-06-21 to use one consistent framing: `1 usage item plus 15 scored questions` / `1 道使用情况题 + 15 道计分题`; progress remains `0/15` because it intentionally tracks scored questions only.
- `npm run release:check` passed after the progress-copy cleanup, and `scripts/build-release-bundle.js /tmp/ai-persona-progress-cleanup-dist` produced a deployable bundle containing the cleaned `/en/` and `/cn/` pages.

## Recommended Split

1. Treat `linenyu.com` as a static personal mother site.
2. Treat `ai-persona.linenyu.com` as the app domain for the quiz/backend.
3. Keep EdgeOne only for the app while Pages Functions/Blob are still needed.
4. Move or repoint the static mother site to a simpler static host after deciding the domain target.

## Next Decision

Decision on 2026-06-21: move the current public site to Vercel Hobby.

Implemented locally:

- Added `vercel.json`.
- Added `npm run release:bundle:vercel`.
- Added a Vercel dynamic bundle script at `scripts/build-vercel-dynamic-bundle.js`; the bundle includes static HTML plus Vercel Functions under `api/`.
- Added Supabase-ready Vercel API routes under `api/`, with shared storage/export logic in `lib/result-storage.js`.
- Added `scripts/check-vercel-dynamic-release.js` and wired it into `npm run release:check` so releases now verify both quiz sync and dynamic Vercel data/viewer behavior.
- Added `scripts/set-vercel-production-env.sh` so Vercel production env vars can be set through hidden prompts or already-injected shell env without printing secret values.
- Added `docs/vercel-supabase-go-live.md` as the final DNS, Supabase, Vercel env, redeploy, and verification checklist.
- Added `scripts/deploy-vercel-dynamic.sh` and `npm run vercel:deploy` to run release checks, build, production deploy, and live verification in one command.
- Hardened `scripts/set-vercel-production-env.sh` so missing `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, or `EXPORT_TOKEN` fails early instead of silently skipping values.
- Added release-check coverage for `assets/cv/linen-yu-cv.pdf`, because the homepage links this public PDF and Vercel bundles must include it.
- Hardened strict live verification so final go-live requires a local export token and proves authenticated `/api/results` and `/api/export.csv` access, including the submitted verification row.
- Added protected `/api/storage-health` so the final go-live check and `/admin/` can prove the Supabase table is actually readable, not just that env vars exist.
- Added `scripts/check-go-live-status.js` and `npm run vercel:go-live:status`, a non-secret status checker for Vercel dynamic health, Supabase/export-token configuration, protected storage-read readiness, custom-domain DNS, and Vercel env-var presence.
- Improved `scripts/check-go-live-status.js` so DNS checks report Spaceship record names directly: delete old `@` A records and stale `www` / `ai-persona` EdgeOne CNAMEs, then add the current Vercel-recommended records.
- Extended `scripts/check-go-live-status.js` with DNS propagation checks across the local resolver, Cloudflare, Google, and Quad9. Current results still show EdgeOne records everywhere, confirming the cutover has not happened at the authoritative DNS level.
- Hardened `scripts/check-go-live-status.js` so Vercel environment variable checks use `vercel env ls --format json` and parse env names from JSON rather than display text.
- Added Vercel domain-inspection checks to `scripts/check-go-live-status.js`; Vercel confirms all three custom domains are bound to project `linenyu-site`, and after the 2026-06-24 DNS/certificate fix reports them configured correctly.
- Added `scripts/check-vercel-env-ready.js` and `npm run vercel:env:check`; strict deploy now preflights Vercel production env variable names before redeploying and fails cleanly if Supabase/export env names are missing.
- Strengthened `scripts/verify-vercel-live.js` strict mode so final verification proves custom-domain HTTPS and redirects: root domain serves the mother site, `www` redirects to the root domain, and `ai-persona` redirects to `/en/` and serves the English quiz.
- Added `scripts/watch-go-live-status.sh` and `npm run vercel:go-live:watch`, which polls strict go-live status every 60 seconds and exits once all checks pass. `GO_LIVE_WATCH_MAX_ITERATIONS=1` provides a single-poll mode for automation.
- Added `scripts/check-supabase-ready.js` and `npm run vercel:supabase:check`, a non-secret local readiness check that verifies Supabase table readability, writes one temporary row, and deletes it when local Supabase env vars are injected.
- Updated the quiz submit status so the Vercel fallback does not claim persistent storage is configured.
- Built and smoke-checked `/tmp/ai-persona-vercel-dynamic-dist`.

Production deployment on 2026-06-21:

- Vercel account: `itmaybeyu-4904`
- Vercel project: `linenyu-site`
- Public production alias: `https://linenyu-site.vercel.app`
- Deployment URL: `https://linenyu-site-fcwdw7vco-linen-yu.vercel.app`
- Deployment id: `dpl_4ruKsP2kXiNQTvsopSivMPR7Ym73`
- Inspect URL: `https://vercel.com/linen-yu/linenyu-site/4ruKsP2kXiNQTvsopSivMPR7Ym73`

Follow-up production deployment on 2026-06-21:

- Deployment URL: `https://linenyu-site-2glqboihw-linen-yu.vercel.app`
- Deployment id: `dpl_C8AHGQY4mFfDw551tTx3XZ1w6kdP`
- Inspect URL: `https://vercel.com/linen-yu/linenyu-site/C8AHGQY4mFfDw551tTx3XZ1w6kdP`
- Stable public alias verified: `https://linenyu-site.vercel.app`
- The unique deployment URL is protected by Vercel authentication; use the stable public alias for public smoke checks.

Dynamic-data production deployment on 2026-06-21:

- Deployment URL: `https://linenyu-site-gzqwmbwbk-linen-yu.vercel.app`
- Deployment id: `dpl_ELiFrH9MVLoLGhtTL2pea6ygrBj9`
- Inspect URL: `https://vercel.com/linen-yu/linenyu-site/ELiFrH9MVLoLGhtTL2pea6ygrBj9`
- Stable public alias verified: `https://linenyu-site.vercel.app`
- Adds `/api/health`, `/api/results`, and `/admin/`.

Admin-status production deployment on 2026-06-21:

- Deployment URL: `https://linenyu-site-7jswjqaxw-linen-yu.vercel.app`
- Deployment id: `dpl_6Dkd5dhvZw1o5y3DdwMGga2FPwbF`
- Inspect URL: `https://vercel.com/linen-yu/linenyu-site/6Dkd5dhvZw1o5y3DdwMGga2FPwbF`
- Stable public alias verified: `https://linenyu-site.vercel.app`
- `/admin/` now shows Dynamic API, Storage, and Viewer Token status from `/api/health`.
- Added `scripts/verify-vercel-live.js` and `npm run vercel:verify:live`.

Storage-read-check production deployment on 2026-06-21:

- Deployment URL: `https://linenyu-site-bowx7m34g-linen-yu.vercel.app`
- Deployment id: `dpl_2BX5neQQXVHrm47wQ1exnXM9i6KM`
- Inspect URL: `https://vercel.com/linen-yu/linenyu-site/2BX5neQQXVHrm47wQ1exnXM9i6KM`
- Stable public alias verified: `https://linenyu-site.vercel.app`
- `/api/storage-health` is live and currently reports missing `EXPORT_TOKEN` until production env vars are configured.

Live smoke checks on `https://linenyu-site.vercel.app` passed for:

- root `/` personal mother site
- `/en/` English quiz
- `/cn/` Chinese quiz
- `/admin/` protected results viewer shell
- `/api/health`, returning `dynamic: true`
- `/api/health`, showing missing Supabase env vars and export token status
- `/api/storage-health`, returning the expected not-configured response before `EXPORT_TOKEN` is set
- `assets/cv/linen-yu-cv.pdf`
- `/api/submit-result`, returning `stored: false` until Supabase env vars are configured
- `/api/export.csv`, returning the expected not-configured response

Local release checks now cover:

- canonical `/cn/` and `/en/` quiz data sync
- required dynamic Vercel files
- `/api/health` dynamic status
- `/api/submit-result` valid-payload behavior without Supabase env vars
- `/api/results` token requirement and unconfigured-storage behavior
- `/admin/` viewer links to `/api/results` and `/api/export.csv`
- host-based Vercel routing for `www.linenyu.com` and `ai-persona.linenyu.com`
- live Vercel default-domain checks via `npm run vercel:verify:live`
- final strict go-live checks via `npm run vercel:verify:live -- --require-configured --submit`
- one-command redeploy plus verification via `npm run vercel:deploy`
- public CV PDF presence and non-empty file size
- authenticated storage-health, results, and CSV checks in strict mode
- non-secret go-live status checks via `npm run vercel:go-live:status`
- local Supabase table/service-role checks via `npm run vercel:supabase:check`

Vercel custom-domain setup completed on the Vercel side:

- `linenyu.com`
- `www.linenyu.com`
- `ai-persona.linenyu.com`

DNS is not cut over yet. Current nameservers are:

- `launch1.spaceship.net`
- `launch2.spaceship.net`

Current DNS still resolves through EdgeOne/Tencent:

- `linenyu.com` -> `43.174.246.100` / `43.174.247.100`
- `www.linenyu.com` -> `www.linenyu.com.pages.dnsoe6.com` -> EdgeOne IPs
- `ai-persona.linenyu.com` -> `ai-persona.linenyu.com.pages.dnsoe5.com` -> EdgeOne IPs

Current Vercel-requested DNS records after the 2026-06-24 certificate/DNS fix:

- `A linenyu.com 216.198.79.1`
- `A linenyu.com 64.29.17.1`
- `CNAME www.linenyu.com 33236d9ab28d641f.vercel-dns-017.com`
- `CNAME ai-persona.linenyu.com 33236d9ab28d641f.vercel-dns-017.com`

Spaceship record-level edits:

- Delete old `A @` records pointing to `43.174.246.100` and `43.174.247.100`.
- Delete old `CNAME www` pointing to `www.linenyu.com.pages.dnsoe6.com`.
- Delete old `CNAME ai-persona` pointing to `ai-persona.linenyu.com.pages.dnsoe5.com`.
- Add `A @ 216.198.79.1`.
- Add `A @ 64.29.17.1`.
- Add `CNAME www 33236d9ab28d641f.vercel-dns-017.com`.
- Add `CNAME ai-persona 33236d9ab28d641f.vercel-dns-017.com`.

Alternative DNS cutover:

- Change domain nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com` after copying any non-web DNS records that must be preserved.

Supabase-ready backend status:

- `api/submit-result.js` validates and sanitizes payloads, strips identity/IP/free-text/referrer fields, optionally verifies Turnstile, and writes to Supabase when configured.
- Without `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, `/api/submit-result` returns `stored: false` with missing env names.
- `api/results.js` requires `EXPORT_TOKEN` or `RESULTS_EXPORT_TOKEN`, then returns flattened JSON rows from Supabase.
- `api/export.csv.js` requires `EXPORT_TOKEN` or `RESULTS_EXPORT_TOKEN`, then exports rows from Supabase when configured.
- `api/health.js` reports Vercel Function runtime status and whether storage/export env vars are configured.
- `api/storage-health.js` requires the same export token, then checks whether the Supabase table can be read.
- `admin/index.html` provides a token-protected browser viewer for stored submissions and CSV download; it also calls `/api/storage-health` to show whether storage is genuinely readable.
- Supabase table schema lives at `supabase/quiz-results-schema.sql`.

Remaining deployment work:

- Update DNS so `linenyu.com`, `www.linenyu.com`, and `ai-persona.linenyu.com` no longer point at EdgeOne.
- Run `supabase/quiz-results-schema.sql` in Supabase.
- If Supabase env vars are injected locally, run `npm run vercel:supabase:check` to verify the table and service-role key before wiring Vercel.
- Set Vercel env vars with `scripts/set-vercel-production-env.sh production`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, optional `SUPABASE_RESULTS_TABLE`, and `EXPORT_TOKEN`.
- Set local `REMOTE_DATABASE_TOKEN` to the same value as `EXPORT_TOKEN`, then run `npm run vercel:deploy -- --strict` and verify `/api/submit-result` returns `stored: true`, `/api/results` returns rows with a valid token, `/api/export.csv` includes the verification row, and `/admin/` can view them.
- Until those external settings are changed, `npm run vercel:go-live:status` reports the remaining blockers directly.
