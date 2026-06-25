# Current AI Social Thought Spectrum State

Last updated: 2026-06-24

## Active Cycle

- cycle: `2026-05-14-ai-social-thought-spectrum-seed-map`
- period: 2026-05-14 to 2026-05-28
- theme: turn the AI social thought map into a pilotable AI ideology quiz
- style: root homepage is now an English, ultra-minimal personal mother site linking to Blog, Projects, Posts, and AI Persona

## Current Aim

Build a first-pass map from AI doomerism and alignment safety through critical AI, Bitter Lesson scaling thought, pragmatic AI optimism, techno-optimism, e/acc, and Nick Land-style accelerationist anti-humanism. The current public layer should have two entry points: take the quiz, or directly browse the spectrum to see where the result types, people, and movements sit.

The desired state is not a definitive canon. It is a working map that makes it easy to ask:

- Which position is this text representing?
- What is its canonical primary source?
- What is its risk model?
- How human-centered is it?
- How influential is it, and through which channel?
- What should be read next?

## Current Deliverable

- `index.html` is now the first-pass English personal mother site for Linen Yu, with links to Blog, Projects, Posts, and AI Persona. Site-level AI Persona links default to `/en/`.
- 2026-06-14: Added the current no-profile standard CV to the homepage navigation and CV section. Stable public PDF path: `assets/cv/linen-yu-cv.pdf`.
- 2026-06-14: Cleaned the Projects index by removing the standalone `AI Persona Chinese` entry and pointing `AI Governance Spectrum` to the English spectrum page.
- 2026-06-14: Deployed the cleaned personal-site bundle to EdgeOne Makers project `ai-persona-overseas`; production deployment id `dp5gxowr4l8t`.
- 2026-06-14: Replaced the root homepage Contact placeholder with email and GitHub links.
- 2026-06-14: Deployed the Contact-link update to EdgeOne Makers project `ai-persona-overseas`; production deployment id `dphpzte7bis5`.
- 2026-06-20: Opened a deployment-cleanup track because the personal mother site, AI Persona quiz, custom domains, and EdgeOne deployments are still mixed in one repo and one active EdgeOne binding. See `planning/2026-06-20-site-deployment-cleanup.md` and `TODO.json`.
- 2026-06-20: Removed placeholder links from the personal-site Blog/Posts indexes, corrected the homepage writing date, and made the CV nav link consistent across personal-site pages.
- 2026-06-21: Switched deployment direction to Vercel Hobby. Added a Vercel dynamic bundle with static pages plus Vercel Functions under `api/`.
- 2026-06-21: Deployed the latest dynamic bundle to Vercel production project `linenyu-site`. Public Vercel URL: `https://linenyu-site.vercel.app`; latest production deployment id: `dpl_2BX5neQQXVHrm47wQ1exnXM9i6KM`. Live checks passed for root `/`, `/en/`, `/cn/`, `/admin/`, `/api/health`, the CV PDF, and `/api/submit-result`.
- 2026-06-21: Added `linenyu.com`, `www.linenyu.com`, and `ai-persona.linenyu.com` to the Vercel project. DNS still resolves to EdgeOne/Tencent (`43.174.246.100` / `43.174.247.100` and `pages.dnsoe*.com` CNAMEs). The current nameservers are `launch1.spaceship.net` and `launch2.spaceship.net`; update those DNS records to `A ... 76.76.21.21` or move nameservers to Vercel before the custom domains are fully live.
- 2026-06-24: Cut over Spaceship DNS for `linenyu.com`, `www.linenyu.com`, and `ai-persona.linenyu.com` away from EdgeOne. The first cutover used `A 76.76.21.21`, but real HTTPS custom-domain access failed because Vercel had no certificate entry yet and later recommended newer DNS records.
- 2026-06-24: Issued a Vercel certificate for `linenyu.com`, `www.linenyu.com`, and `ai-persona.linenyu.com`, then updated Spaceship DNS to Vercel's current recommended records: `@ A 216.198.79.1`, `@ A 64.29.17.1`, `www CNAME 33236d9ab28d641f.vercel-dns-017.com`, and `ai-persona CNAME 33236d9ab28d641f.vercel-dns-017.com`. Vercel now reports all three domains as configured correctly, and `https://ai-persona.linenyu.com/en/` returns 200. The remaining go-live blockers are missing Vercel `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `EXPORT_TOKEN` / `RESULTS_EXPORT_TOKEN`.
- 2026-06-21: Replaced the Vercel unconfigured-storage fallback with Supabase-ready routes. `/api/submit-result` writes to Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured, otherwise it explicitly returns `stored: false`. `/api/results` returns protected JSON rows, `/api/export.csv` downloads protected CSV, `/api/health` reports dynamic backend/storage status, `/api/storage-health` verifies the Supabase table is readable with the export token, and `/admin/` provides a token-protected results viewer. Schema: `supabase/quiz-results-schema.sql`.
- 2026-06-21: Hardened the release gate so `npm run release:check` now runs both the canonical quiz sync check and `scripts/check-vercel-dynamic-release.js`, which verifies the Vercel dynamic APIs, Supabase-ready behavior, host-routing config, and `/admin/` results viewer.
- 2026-06-21: Added `npm run vercel:verify:live` for live checks and updated `/admin/` so it shows Dynamic API, Storage, and Viewer Token status from `/api/health`, then calls `/api/storage-health` to confirm the database is actually readable when the token and Supabase env vars are configured.
- 2026-06-21: Added `scripts/set-vercel-production-env.sh` and `docs/vercel-supabase-go-live.md` so Supabase/Vercel production env setup can be completed without printing secret values.
- 2026-06-21: Added `npm run vercel:deploy`, which runs release checks, builds the Vercel dynamic bundle, deploys to production, and runs live verification. Use `npm run vercel:deploy -- --strict` after DNS and Supabase env are configured.
- 2026-06-21: Hardened go-live checks: `scripts/set-vercel-production-env.sh` now fails on missing required values, validates `SUPABASE_URL` and `SUPABASE_RESULTS_TABLE`, and `scripts/check-vercel-dynamic-release.js` requires `assets/cv/linen-yu-cv.pdf` to exist and be non-empty.
- 2026-06-21: Hardened strict live verification so final go-live requires a local `REMOTE_DATABASE_TOKEN`, `EXPORT_TOKEN`, or `RESULTS_EXPORT_TOKEN`, then verifies authenticated `/api/results` and `/api/export.csv` access and checks that the submitted verification row is visible.
- 2026-06-21: Compared live AI Persona pages against local HTML and cleaned the question-count/progress wording. The quiz now says `1 usage item plus 15 scored questions` / `1 道使用情况题 + 15 道计分题`, while progress remains `0/15` for scored questions only.
- 2026-06-21: Redeployed the protected storage-read check to Vercel production. `/api/storage-health` is live and currently reports missing `EXPORT_TOKEN` until Vercel env vars are configured; `/api/health` still reports `storage.configured=false` and `export.configured=false`. DNS recheck still shows all custom domains resolving to EdgeOne/Tencent.
- 2026-06-21: Added `npm run vercel:go-live:status`, a non-secret status command that checks Vercel dynamic health, Supabase/export-token configuration, protected storage-read readiness, current DNS records, and Vercel env-var names. It currently reports the exact remaining blockers: missing Vercel Supabase/export env vars and three custom domains still pointing to EdgeOne.
- 2026-06-21: Added `npm run vercel:supabase:check`, a non-secret Supabase readiness check for local shells with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` injected. It verifies table readability, writes one temporary test row, deletes it, and fails cleanly when env vars are missing.
- 2026-06-21: Improved `npm run vercel:go-live:status` so DNS checks are now Spaceship-record specific. On 2026-06-24, the expected records were updated to Vercel's current recommendation: `@ A 216.198.79.1`, `@ A 64.29.17.1`, `www CNAME 33236d9ab28d641f.vercel-dns-017.com`, and `ai-persona CNAME 33236d9ab28d641f.vercel-dns-017.com`.
- 2026-06-21: Extended `npm run vercel:go-live:status` with DNS propagation checks across the local resolver, Cloudflare, Google, and Quad9. Current propagation checks all still resolve the custom domains to EdgeOne records, so the issue is authoritative DNS configuration rather than local cache.
- 2026-06-21: Hardened `npm run vercel:go-live:status` so Vercel environment variable checks read `vercel env ls --format json` instead of parsing display text. Current Vercel project env remains empty.
- 2026-06-21: Added Vercel domain-inspection checks to `npm run vercel:go-live:status`. Vercel confirms `linenyu.com`, `www.linenyu.com`, and `ai-persona.linenyu.com` are bound to project `linenyu-site`; after the 2026-06-24 DNS and certificate fix, Vercel reports each domain as configured correctly.
- 2026-06-21: Added `npm run vercel:env:check` and wired it into `npm run vercel:deploy -- --strict` as a preflight. Strict deploy now fails before redeploy if Vercel production is missing `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and an export token name; the check reads env names only and does not print values.
- 2026-06-21: Strengthened strict live verification so final go-live now proves custom-domain HTTPS behavior too: `linenyu.com` serves the mother site, `www.linenyu.com` redirects to `linenyu.com`, and `ai-persona.linenyu.com` redirects to `/en/` and serves the English quiz.
- 2026-06-21: Added `npm run vercel:go-live:watch`, which polls the strict go-live status every 60 seconds and exits when all checks pass. `GO_LIVE_WATCH_MAX_ITERATIONS=1` runs a single automation-friendly poll.
- 2026-06-24: Started EdgeOne retirement after the Vercel DNS cutover. The active local EdgeOne binding is `ai-persona-overseas` (`makers-gcrdy5xwhnuw`), and the historical EdgeOne project is `ai-persona` (`pages-esxansdhquzd`). The EdgeOne CLI exposes deploy/link/env commands but no delete/disable command, so cloud cleanup needs the Tencent Cloud / EdgeOne console after login.
- `blog/`, `projects/`, and `posts/` provide simple English static section indexes for the personal site.
- `site.css` provides the shared ultra-minimal visual style for the personal site pages.
- `.github/workflows/deploy-pages.yml` deploys the static repository to GitHub Pages on pushes to `main`.
- `CNAME` is not committed for the preview deploy because `linenyu.com` is currently served by EdgeOne Pages. Add it back only when DNS is ready to point the mother site at GitHub Pages.
- 2026-06-14: Deployed the same personal-site bundle to EdgeOne Makers projects `ai-persona` (`dp9t04h63o6b`) and `ai-persona-overseas` (`dp08bq48tnqe`); `http://linenyu.com/` now serves the English personal homepage.
- `/cn/` is the Chinese production quiz/result/share page.
- `/en/` is the English production quiz/result/share page.
- `/ch/` remains a lightweight redirect to `/cn/`; root `/` is no longer a quiz redirect.
- `data/quiz.zh.json` and `data/quiz.en.json` are the canonical quiz/questionnaire data checked against the production HTML by `npm run release:check`.
- Both production quiz pages show the respondent's profile point against 20 reference thinkers and movements from `data/ai-thought-spectrum.json`.
- The result flow includes short profile copy, small explanatory copy, nearest-reference context, a two-axis position map, and a generated share image.
- `questionnaires/2026-05-19-ai-ideology-placement-battery.md` is the first pilot questionnaire battery for placing respondents on the two-axis map.
- `questionnaires/2026-05-19-ai-ideology-short-locator-zh.md` is the Chinese short locator for casual group testing.
- `questionnaires/2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md` is the closed-ended pilot questionnaire structure for data collection.
- Old standalone quiz experiments are archived under `archive/old-pages/`.
- `questionnaires/2026-05-19-ai-ideology-meme-profiles-zh.md` records the SBTI-style profile copy used by the HTML result cards.
- `questionnaires/2026-05-20-ai-ideology-scoring-rubric.md` records the active weighted scoring model and the semantic rationale for each core item.
- `questionnaires/2026-05-20-ideology-classification-method-review.md` benchmarks the quiz against Pew typology, World Values Survey, Moral Foundations, dual-process ideology models, and psychometric scale-development practice.
- `ai-governance-spectrum.html` and `ai-governance-spectrum-en.html` remain public browse-first spectrum pages, but their structure should follow the quiz's final result types rather than an internal taxonomy-first explanation.
- `ai-personality-profiles.html` and `ai-governance-persona-profiles-en.html` are the public profile catalog pages.
- `ROADMAP.md`, `questionnaires/README.md`, and `data/README.md` organize the current sprint, survey artifacts, and response-data rules.
- `research/2026-05-14-ai-social-thought-spectrum-source-map.md` records the source map.
- `planning/2026-05-19-ai-ideology-quiz-pilot.md` records the current pilot plan.

## Active Product Order

1. Finish retiring the old EdgeOne cloud projects after Tencent Cloud login, limited to exact project names `ai-persona-overseas` and `ai-persona`.
2. Create the Supabase `quiz_results` table and run `scripts/set-vercel-production-env.sh production` to set Vercel environment variables for persistent result storage, `/admin/` viewing, and CSV export.
3. Run final strict Vercel verification after Supabase env vars are configured, proving `stored:true` submissions, protected JSON/CSV export, and `/admin/` row display.
4. Commit or deliberately exclude the public CV PDF asset so deployments are reproducible; release checks now at least require the local public PDF to exist and be non-empty.
5. Replace placeholder Blog, Projects, and Post entries with real public content links.
6. Keep AI Persona reachable from the mother site via `/en/` by default, with `/cn/` preserved as the Chinese version.
7. Review the quiz items for difficulty, fun, accessibility, and measurement validity; many items currently feel too technical for the desired audience.
8. Incorporate useful external suggestions into the questionnaire and product design after review.
9. Simplify the share layer around screenshot-first sharing rather than complex generated share pages.

## 2026-06-07 Product Feedback Update

The current priority is project completeness and pilot-readiness, not immediate production replacement.

- Question design: keep technical seriousness, but reduce overly technical framing and add more accessible, interesting, scenario-like, or culturally legible material.
- External feedback: collect suggestions and decide which should update the questionnaire, scoring, copy, or page flow.
- Completeness: the Introduction and Index/homepage are not yet strong enough; explore multiple plain-but-distinctive demo directions first.
- Backend: prepare a design for collecting timestamps, answer vectors, version/language, scores/profile outputs, and an explicit IP address policy.
- Server: server purchase/provider choice remains a human decision.
- Sharing: retire overcomplicated share-page assumptions and move toward a screenshot-first result/share experience.

## 2026-06-11 V2 Test Feedback To-Do

- Question length: reduce reading cost. The data-training copyright/privacy/open-web item is too long in both prompt and options; discuss shorter framing before editing.
- Scenario length: shorten the validated research-tool item; current prompt is too long for mobile reading.
- Self-check wording: avoid saying "AI persona" in the final multiple-select question; frame it as the respondent's view of AI.
- Share image robustness: prevent text overflow across all 10 profile share cards, especially profile title text and closest-reference names.

## First Reading Order

1. Rich Sutton, `The Bitter Lesson`
2. Eliezer Yudkowsky, `Artificial Intelligence as a Positive and Negative Factor in Global Risk`
3. Nick Bostrom, `The Superintelligent Will` or chapters from `Superintelligence`
4. Bender, Gebru, McMillan-Major, and Shmitchell, `On the Dangers of Stochastic Parrots`
5. Dario Amodei, `Machines of Loving Grace`
6. Marc Andreessen, `Why AI Will Save the World`
7. Nick Land, `Meltdown` and `The Dark Enlightenment`

## Active Files

- `README.md`
- `ROADMAP.md`
- `_system/GUIDE.md`
- `cycles/2026-05-14-ai-social-thought-spectrum-seed-map.md`
- `_system/checks/spectrum-placement-check.md`
- `concepts/ai-thought-spectrum-map.md`
- `data/ai-thought-spectrum.json`
- `data/README.md`
- `questionnaires/README.md`
- `questionnaires/2026-05-19-ai-ideology-placement-battery.md`
- `questionnaires/2026-05-19-ai-ideology-short-locator-zh.md`
- `questionnaires/2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md`
- `questionnaires/2026-05-19-ai-ideology-meme-profiles-zh.md`
- `questionnaires/2026-05-20-ai-ideology-scoring-rubric.md`
- `questionnaires/2026-05-20-ideology-classification-method-review.md`
- `ch/index.html`
- `en/index.html`
- `index.html`
- `site.css`
- `blog/index.html`
- `projects/index.html`
- `posts/index.html`
- `.github/workflows/deploy-pages.yml`
- `ai-governance-spectrum.html`
- `ai-governance-spectrum-en.html`
- `ai-personality-profiles.html`
- `ai-governance-persona-profiles-en.html`
- `archive/old-pages/`
- `archive/old-demos/`
- `research/2026-05-14-ai-social-thought-spectrum-source-map.md`
- `planning/2026-05-19-ai-ideology-quiz-pilot.md`

## Next Session

1. After Tencent Cloud login, disable or delete the obsolete EdgeOne projects named `ai-persona-overseas` and `ai-persona`, then rerun `npm run vercel:go-live:status` to confirm Vercel remains clean.
2. Run `supabase/quiz-results-schema.sql`, verify Supabase with `npm run vercel:supabase:check` if local Supabase env vars are injected, run `scripts/set-vercel-production-env.sh production`, confirm with `npm run vercel:env:check`, set local `REMOTE_DATABASE_TOKEN` to the export token value, then run `npm run vercel:go-live:status` followed by `npm run vercel:deploy -- --strict`.
3. Confirm the custom domains still pass Vercel DNS checks after Supabase env setup; DNS was cut over to Vercel on 2026-06-24.
4. Create several index/introduction demo directions for user review.
5. Review the current item set for technical difficulty, fun, and audience fit.
6. Propose a screenshot-first sharing/result layout.

## Open Questions

- Should response collection use a simple form backend first, or a proper database from day one?
- Should mainland China respondents use a separate collection path because of access, latency, and consent-language differences?
- Should respondent IP addresses be stored raw, hashed, reduced to coarse geography, or retained only in server logs?
- Should profile labels remain meme-heavy, or should the production quiz use neutral labels and only expose meme profiles in the share layer?
- How much of the standalone Spectrum page should be browse-first map, and how much should be result-type catalog?
- Should `AI safety` be split into rationalist doom, academic beneficial AI, scalable oversight, evals/governance, and frontier-lab policy in the next instrument version?
