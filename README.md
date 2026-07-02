# AI Governance Persona

This repository is now the standalone AI Governance Persona app.

The personal homepage lives in a separate repository:

```text
/Users/yuun/Documents/GitHub/linenyu-site
```

Public relationship:

- `https://ai-persona.linenyu.com/`: AI Governance Persona app, rooted at `/en/`.
- `https://linenyu.com/`: Linen Yu personal site, maintained by the `linenyu-site` repository.

## Current Boundary

- This repo owns the quiz, profile pages, spectrum pages, Vercel API routes, Supabase schema, and admin viewer.
- This repo does not own the personal homepage, blog index, project index, posts index, site CSS, or CV PDF.
- Vercel is the only active deployment route in this repo.
- The Vercel project for this repo should be named `ai-governance-persona`.
  Do not deploy this app to the personal-site project `linenyu-site`.
- EdgeOne and GitHub Pages deployment files have been removed from the active app repo.
- Root `/` redirects to `/en/`; it is not a personal homepage.

## Production Entry Points

- `/`: redirect/fallback page for `/en/`.
- `/en/`: English production quiz/result/share page.
- `/cn/`: Chinese production quiz/result/share page.
- `/fun/`: Lightweight Chinese persona variant using the same quiz/result/share shell as `/cn/`, with separate questions, count, and scoring.
- `/ch/`: legacy redirect to `/cn/`.
- `/admin/`: protected results viewer shell.
- `/api/`: Vercel dynamic API routes for submit, health, results, CSV export, and storage-health.
- `ai-governance-spectrum.html`: Chinese browse-first governance/persona spectrum page.
- `ai-governance-spectrum-en.html`: English browse-first spectrum page.
- `ai-personality-profiles.html`: Chinese persona profile catalog.
- `ai-governance-persona-profiles-en.html`: English persona profile catalog.

## Data-First Quiz Workflow

Treat these files as canonical:

- `data/quiz.zh.json`
- `data/quiz.en.json`

For quiz wording or scoring changes:

```sh
npm run quiz:sync-html
npm run release:check
```

`npm run quiz:extract-html` is an emergency recovery command for intentionally extracting JSON from existing HTML. Do not use it for normal copy edits.

## Deployment

Run the release gate before deployment:

```sh
npm run release:check
```

Build the Vercel upload bundle:

```sh
npm run release:bundle
```

Deploy through the Vercel dynamic flow:

```sh
npm run vercel:deploy
```

After Supabase env vars and DNS are configured:

```sh
export REMOTE_DATABASE_TOKEN="<same value as EXPORT_TOKEN>"
npm run vercel:deploy -- --strict
```

See `docs/vercel-supabase-go-live.md` for the full setup checklist.

GitHub Actions now runs the release gate and builds the curated Vercel bundle on pushes and pull requests to `main`. Production deploy is available as a manual workflow action after adding the `VERCEL_TOKEN` repository secret, and can later be switched to push-to-production with `AUTO_DEPLOY_PRODUCTION=true`.

## Structure

- `cn/`, `en/`, `fun/`, `ch/`: public quiz pages and locale routing.
- `data/`: canonical quiz JSON plus public spectrum/reference data.
- `api/`: Vercel Functions for result submit, health, export, and admin reads.
- `lib/`: shared server-side storage and export logic.
- `admin/`: protected browser viewer for stored submissions.
- `supabase/`: table schema for persistent result storage.
- `scripts/`: quiz sync, release checks, Vercel bundle/deploy, and go-live checks.
- `docs/`: Vercel/Supabase setup and secret-name documentation.
- `questionnaires/`: survey instruments, profile copy, scoring design, and method review.
- `research/`: source maps and durable research context for the spectrum.
- `concepts/`: conceptual maps and classification notes.
- `archive/`: old demos and old pages retained for audit/history, not production.

## Start Here

1. `CURRENT.md`
2. `AGENTS.md`
3. `TODO.json`
4. `data/quiz.zh.json` and `data/quiz.en.json`
5. `cn/index.html` and `en/index.html`
6. `docs/vercel-supabase-go-live.md`

## Product Aim

The quiz goal is not to collect every AI opinion. The goal is to build a reusable map of representative thinkers, texts, movements, and claims that shape debates about AI risk, progress, alignment, social harm, scaling, acceleration, and posthuman futures.

For a new AI essay, policy intervention, or public argument, the target is to answer:

- What tradition or movement does this belong to?
- What does it assume about human control, agency, and value?
- Does it treat AI mainly as existential risk, normal technology, social power, economic abundance, autonomous computation, or posthuman transition?
- What primary text best represents the position?
- Is the influence academic, institutional, cultural, memetic, policy-facing, or capital-facing?
