# Current AI Governance Persona State

Last updated: 2026-06-25

## Current Boundary

- This repository is the AI Governance Persona app repo.
- The personal homepage has been split into `/Users/yuun/Documents/GitHub/linenyu-site`.
- `https://ai-persona.linenyu.com/` belongs to this repo.
- `https://linenyu.com/` belongs to the `linenyu-site` repo.
- Root `/` in this repo redirects to `/en/`.
- Vercel is the only active deployment route for this repo.
- EdgeOne and GitHub Pages deployment files have been removed from the active app repo.

## Current Deliverable

- `/en/` and `/cn/` are the production quiz/result/share pages.
- `data/quiz.en.json` and `data/quiz.zh.json` are the canonical quiz sources.
- `npm run quiz:sync-html` pushes canonical JSON into the embedded page constants.
- `api/`, `lib/`, `admin/`, and `supabase/` provide the Vercel + Supabase result-storage path.
- `ai-governance-spectrum*.html` and `ai-*profiles*.html` remain public supporting browse/profile pages.

## Recent Checkpoints

- 2026-06-25: Created branch `codex/structure-cleanup`.
- 2026-06-25: Committed checkpoint `fc87938` for the working Vercel dynamic state before restructuring.
- 2026-06-25: Committed `3cb86c1` to clarify Vercel as the default route and make quiz edits data-first.
- 2026-06-25: Split the personal homepage into `/Users/yuun/Documents/GitHub/linenyu-site`.
- 2026-06-25: Removed personal homepage assets and old EdgeOne/GitHub Pages deployment files from this app repo.
- 2026-06-25: User confirmed the two obsolete Tencent Cloud / EdgeOne projects were deleted externally.

## Active Product Order

1. Modularize the frontend so quiz data, scoring, rendering, sharing, and locale copy are no longer trapped inside monolithic HTML files.
2. Continue personal homepage work in `/Users/yuun/Documents/GitHub/linenyu-site`.
3. Finish Supabase/Vercel production env setup and strict live verification.
4. Keep quiz copy changes data-first: edit `data/quiz.*.json`, run `npm run quiz:sync-html`, then run `npm run release:check`.
5. Review quiz items for audience fit, fun, accessibility, and measurement validity.

## Active Files

- `README.md`
- `AGENTS.md`
- `TODO.json`
- `data/quiz.zh.json`
- `data/quiz.en.json`
- `cn/index.html`
- `en/index.html`
- `index.html`
- `api/`
- `lib/`
- `admin/`
- `supabase/quiz-results-schema.sql`
- `scripts/sync-html-from-canonical.js`
- `scripts/check-quiz-sync.js`
- `scripts/check-vercel-dynamic-release.js`
- `scripts/build-vercel-dynamic-bundle.js`
- `scripts/deploy-vercel-dynamic.sh`
- `docs/vercel-supabase-go-live.md`
- `docs/secrets.md`

## Next Session

1. Start frontend modularization from the current `/en/` and `/cn/` pages.
2. In the personal-site repo, decide the first homepage improvement pass.
3. If production storage is still needed, run the Supabase schema and set Vercel env vars using `docs/vercel-supabase-go-live.md`.

## Open Questions

- How far should frontend modularization go before moving to a framework?
- Should the app keep duplicated `/en/` and `/cn/` HTML during the first refactor, or generate both from shared modules?
- Should the production quiz use neutral profile labels while keeping meme labels only in share/result layers?
