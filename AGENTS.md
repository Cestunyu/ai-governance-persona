# AGENTS

This repository contains the AI Ideology Quiz and its underlying AI Social Thought Spectrum materials.

## Operating Rules

- Treat `data/quiz.zh.json` and `data/quiz.en.json` as the canonical quiz/questionnaire data.
- For quiz wording or scoring changes, edit `data/quiz.*.json` first, then run `npm run quiz:sync-html`; do not hand-edit only the embedded constants in `/cn/` or `/en/`.
- Treat `/cn/` and `/en/` as the production pilot pages.
- Treat `/ch/` as a redirect to `/cn/`.
- Treat `/` as the English personal mother site for `linenyu.com`, not as a quiz redirect.
- Treat Vercel as the active deployment path. EdgeOne and GitHub Pages files are legacy/reference paths unless the user explicitly asks for them.
- Do not edit archived quiz pages as production surfaces.
- Before building or deploying, run `npm run release:check`.
- Build the active public upload bundle with `npm run release:bundle`; do not upload the whole repository.
- For Vercel dynamic deployments, `npm run release:bundle` and `npm run release:bundle:vercel` both build the upload bundle with static pages plus Vercel Functions under `api/`.
- Use `npm run release:bundle:edgeone` only for legacy EdgeOne recovery.
- Keep respondent data out of git unless it is explicitly anonymized, documented, and small enough to inspect.
- Do not read or commit `.env` files.
- Keep the quiz usable as standalone static HTML unless a backend is deliberately introduced.

## Folder Roles

- `questionnaires/`: survey instruments, profile copy, scoring design, and method review.
- `data/`: canonical quiz data, structured public/reference data, and visualization data.
- `research/`: source maps and durable research context for the spectrum.
- `planning/`: project plans, sprint notes, and pilot coordination.
- `concepts/`: conceptual maps and classification notes.
- `_system/`: reusable classification and learning guides.
