# AGENTS

This repository contains the AI Governance Persona app and its underlying AI Social Thought Spectrum materials.

## Operating Rules

- Treat `data/quiz.zh.json` and `data/quiz.en.json` as the canonical quiz/questionnaire data.
- For quiz wording or scoring changes, edit `data/quiz.*.json` first, then run `npm run quiz:sync-html`; do not hand-edit only the embedded constants in `/cn/` or `/en/`.
- Treat `/cn/` and `/en/` as the production pilot pages.
- Treat `/ch/` as a redirect to `/cn/`.
- Treat `/` as an app redirect/fallback to `/en/`, not as a personal homepage.
- Keep personal-site work in `/Users/yuun/Documents/GitHub/linenyu-site`.
- Treat Vercel as the active deployment path for this repo.
- Use `ai-governance-persona` as the Vercel project name for this repo.
  `linenyu-site` is reserved for the separate personal website.
- Do not reintroduce EdgeOne or GitHub Pages deployment files unless the user explicitly asks for a new migration path.
- Do not edit archived quiz pages as production surfaces.
- Before building or deploying, run `npm run release:check`.
- Build the active public upload bundle with `npm run release:bundle`; do not upload the whole repository.
- Keep respondent data out of git unless it is explicitly anonymized, documented, and small enough to inspect.
- Do not read or commit `.env` files.
- Keep the quiz usable as standalone static HTML unless a backend change is deliberate.

## Folder Roles

- `questionnaires/`: survey instruments, profile copy, scoring design, and method review.
- `data/`: canonical quiz data, structured public/reference data, and visualization data.
- `research/`: source maps and durable research context for the spectrum.
- `planning/`: project plans, sprint notes, and pilot coordination.
- `concepts/`: conceptual maps and classification notes.
- `_system/`: reusable classification and learning guides.
- `api/`: Vercel dynamic API routes.
- `lib/`: shared server-side result storage/export logic.
- `admin/`: protected browser viewer for stored submissions.
