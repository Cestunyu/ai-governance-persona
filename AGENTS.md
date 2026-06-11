# AGENTS

This repository contains the AI Ideology Quiz and its underlying AI Social Thought Spectrum materials.

## Operating Rules

- Treat `data/quiz.zh.json` and `data/quiz.en.json` as the canonical quiz/questionnaire data.
- Treat `/cn/` and `/en/` as the production pilot pages.
- Treat `/ch/` and `/` as redirects to `/cn/`.
- Do not edit archived quiz pages as production surfaces.
- Before building or deploying, run `npm run release:check`.
- Build public upload bundles with `npm run release:bundle`; do not upload the whole repository.
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
