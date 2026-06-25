# EdgeOne Pages + Blob Deployment Runbook

Date: 2026-06-09

Status: legacy reference. As of 2026-06-25, the active deployment path is Vercel dynamic project `linenyu-site`; use `npm run release:bundle` / `npm run release:bundle:vercel` for active bundles. Use this runbook only for historical audit or emergency EdgeOne recovery.

## Current Decision

Use EdgeOne Pages + Pages Functions + Pages Blob for the first public pilot. Use the default free EdgeOne Pages URL first. Do not buy a VPS or custom domain until the default URL can serve the quiz, record completed results, and export CSV reliably.

## Deployment Record

- EdgeOne project name: `ai-persona`
- EdgeOne project id: `pages-esxansdhquzd`
- Production deployment id: `dpjnak91lllf` as of 2026-06-10
- Default deployment host: `https://ai-persona-qxad5fjx.edgeone.cool`
- `EXPORT_TOKEN` is configured in EdgeOne environment variables.
- Smoke result ids:
  - deploy-token URL: `6d82c60e-8c30-43d2-a2d5-5d8d76821e73`
  - public host URL: `ccefd9b1-7bf3-475c-9dd1-ce02d5cf8c0c`

The deploy used a temporary public bundle at `/tmp/ai-ideology-edgeone-dist` rather than uploading the whole working repository. The bundle includes public HTML pages, `assets/`, `data/ai-thought-spectrum.json`, `edge-functions/`, and package files.

Follow-up fix on 2026-06-09:

- Re-deployed after finding that `ai-governance-spectrum.html` and `ai-ideology-quiz-en.html` were stale on EdgeOne.
- Added `edgeone.json` so HTML routes use `Cache-Control: no-cache, must-revalidate`; assets keep long immutable cache.
- Added the new public page `ai-governance-persona-profiles-en.html` to the deployment bundle.
- Verified all deployed public HTML files match the current bundle by SHA-256:
  - `index.html`
  - `ai-ideology-quiz.html`
  - `ai-ideology-quiz-en.html`
  - `ai-ideology-placement-quiz.html`
  - `ai-personality-profiles.html`
  - `ai-governance-persona-profiles-en.html`
  - `ai-governance-spectrum.html`
  - `ai-thought-spectrum-visualization.html`
  - `ai-governance-spectrum-en.html`
- Replaced the root `index.html` entry with the full quiz page content from `ai-ideology-quiz.html`, so `https://ai-persona-qxad5fjx.edgeone.cool/` opens the current quiz experience directly instead of the older two-card entry page.

## Backend API Audit

### `POST /api/submit-result`

- Function file: `edge-functions/api/submit-result.js`
- Storage: `@edgeone/pages-blob`
- Blob store name: `ai-ideology-results`
- Key format: `results/YYYY-MM-DD/YYYYMMDDhhmmssmmm-<uuid>.json`
- Body limit: 64 KB, checked by `content-length` and actual encoded body size
- Accepted quiz id: `ai-ideology-quiz`
- Accepted locales: `zh-CN`, `en`
- Required completion fields: quiz/version fields, locale, profile code, answer vector, scenario vector, scores, labels, projection, respondent vector, diagnostics, and profile ranking
- Privacy behavior: strips non-schema fields, does not store raw IP fields, names, email fields, free-text identity fields, referrer fields, or Turnstile token
- Anti-abuse behavior: strict schema and malformed-payload rejection are always active; Turnstile verification is available when `REQUIRE_TURNSTILE=true` and `TURNSTILE_SECRET_KEY` are configured

### `GET /api/export.csv`

- Function file: `edge-functions/api/export.csv.js`
- Auth: requires `EXPORT_TOKEN` or `RESULTS_EXPORT_TOKEN`
- Token input: `?token=...` or `Authorization: Bearer ...`
- Export prefix: `results/`
- CSV includes timestamp, locale, quiz version, answer vector, scores, profile code, profile margin/ranking, projection, diagnostics, and scenario/self-agreement fields

## EdgeOne Console Checklist

1. Create or select an EdgeOne Pages project for this repository.
2. Connect the GitHub repo.
3. Use static project settings:
   - build command: none
   - output directory: repository root
4. Enable Pages Functions for `edge-functions/api/`.
5. Create or bind the Pages Blob store named `ai-ideology-results`.
6. Set one export secret:
   - `EXPORT_TOKEN`, or
   - `RESULTS_EXPORT_TOKEN`
7. For broader sharing, enable Turnstile:
   - add frontend token capture on final submission
   - set `REQUIRE_TURNSTILE=true`
   - set `TURNSTILE_SECRET_KEY`

## First Smoke Checks

Use the EdgeOne preview/production URL after deploy:

1. Open `/` and confirm it redirects to `/cn/`.
2. Open `/cn/`.
3. Open `/en/`.
4. Complete one Chinese quiz and confirm the result/share page still appears.
5. Complete one English quiz and confirm the result/share page still appears.
6. Confirm `GET /api/export.csv` without a token returns `401 Unauthorized`.
7. Confirm `GET /api/export.csv?token=<token>` downloads CSV with the smoke rows.

## Known Limits Before Broader Sharing

- Turnstile is server-supported but not yet wired into the static quiz pages.
- Coarse provider-side rate limiting is not configured in this repository.
- The default deployment host is publicly reachable without the EdgeOne deploy-token query parameters.
- Public HTML routes now return `Cache-Control: no-cache, must-revalidate`, so users should see updates after refresh rather than being pinned to old immutable HTML.
- CSV export returned 3 lines after smoke testing: header plus two smoke rows.
- The pilot should not be described as validated survey evidence until exported rows are reviewed.

## 2026-06-10 Question-Structure Deployment

- Updated production pages and backend schema for the current 16-question flow:
  - usage/background: `U01`
  - core answers: `H02`, `C04`, `C02`, `C03`, `L01`, `I01`, `T01`, `D01`, `R01`, `R04`, `E01`, `H01`, `H04`
  - scenario: `V3`
  - self-check: persona multi-select
- Removed required backend/export references to old `R02`, `R03`, `C01`, `H03`, `V2`, and `V4`.
- Deployed clean bundle from `/tmp/ai-persona-edgeone-dist` with EdgeOne CLI.
- Deployment id: `dpjnak91lllf`.
- Public page smoke:
  - `/en/` contains `16 questions` and `T01`.
  - `/cn/` contains `16 个问题` and `T01`.
- Backend smoke:
  - `GET /api/export.csv` without token returns `401 Unauthorized`.
  - `POST /api/submit-result` accepted the new answer/scenario shape.
  - Smoke result id: `c396b8f3-77f8-47e7-8531-09d6c84318bf`.

## 2026-06-11 Repository Cleanup

- Current production quiz/result/share entry points are `/cn/` and `/en/`.
- Legacy note from the EdgeOne phase: root `index.html` and `/ch/` were lightweight redirects to `/cn/` at that time. The current root page is the English personal mother site.
- Old standalone quiz and spectrum experiments were moved to `archive/old-pages/`.
- Share-card demo files and generated demo images were moved to `archive/old-demos/`.
- Local state file `STATE.json` is ignored and should not be committed.

## Release Harness

- Canonical quiz data:
  - `data/quiz.zh.json`
  - `data/quiz.en.json`
- Production HTML:
  - `cn/index.html`
  - `en/index.html`
- Pre-release check:
  - `npm run release:check`
- Bundle command:
- `npm run release:bundle:edgeone`
- For quiz wording changes, edit `data/quiz.*.json`, run `npm run quiz:sync-html`, inspect the HTML diff, then rerun `npm run release:check`.

## 2026-06-11 Production Launch

- Deployed clean public bundle from `/tmp/ai-persona-edgeone-dist` with EdgeOne CLI.
- Deployment id: `dpm23zdcd3n5`.
- Project id: `pages-esxansdhquzd`.
- Public host: `https://ai-persona-qxad5fjx.edgeone.cool`.
- Local `curl` smoke from the USZ guest network returned a network gateway 403 for `.edgeone.cool`, so direct local checks were blocked by the network rather than by the app.
- External fetch smoke passed:
  - `/cn/` renders the current Chinese 16-question AI persona page.
  - `/en/` renders the current English 16-question AI Governance Persona page.
  - `/ai-governance-spectrum.html` renders the current spectrum page.
  - `/api/export.csv` without a token returns `401 Unauthorized`.
