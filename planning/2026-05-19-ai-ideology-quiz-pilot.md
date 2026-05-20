# AI Ideology Quiz Pilot

Date: 2026-05-19

## Goal

Turn the AI social thought spectrum project into a pilotable closed questionnaire that can place respondents on a two-axis AI ideology map and return an interpretable profile.

## Current Decisions

- Use `ai-ideology-quiz.html` as the clean production candidate.
- Keep the production quiz closed-ended.
- Remove background questions, quality checks, open text, image generation, and share-card logic from the active quiz page.
- Keep `ai-ideology-placement-quiz.html` as the experimental share-card and viral-profile version.
- Treat SBTI-style profiles as presentation copy, not as the source of measurement logic.

## Two-Day Plan

1. Stabilize the Chinese closed quiz and result logic.
2. Decide a lightweight response storage/export path.
3. Run a 10-20 person friendly pilot.
4. Revise confusing items and profile labels.
5. Decide whether English and mainland China collection should share one backend or use separate paths.

## Open Questions

- What backend should store pilot responses?
- Should mainland China respondents use a separate deployment and data path?
- Should the public-facing result use neutral profile names first and meme names only in the share layer?
- What venue, if any, should this become: demo, essay, survey paper, or AIES-style position/measurement paper?
