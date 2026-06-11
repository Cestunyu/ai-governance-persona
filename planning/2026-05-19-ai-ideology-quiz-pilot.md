# AI Ideology Quiz Pilot

Date: 2026-05-19

## Goal

Turn the AI social thought spectrum project into a pilotable closed questionnaire with a two-path homepage: users can start the quiz or directly browse the spectrum.

## Current Decisions

- Use `/ch/` and `/en/` as the current production quiz/result/share pages.
- Keep the production quiz closed-ended.
- Remove background questions, quality checks, and open text from the active quiz page.
- Archive older standalone quiz/share experiments under `archive/old-pages/`.
- Treat SBTI-style profiles as presentation copy, not as the source of measurement logic.
- Keep the Spectrum page as a public browse-first option from the homepage.
- Organize the Spectrum page around the quiz final result types: profile, nearby positions, result dimensions, and shareable interpretation.

## Two-Day Plan

1. Stabilize the Chinese closed quiz and result logic.
2. Decide a lightweight response storage/export path.
3. Run a 10-20 person friendly pilot.
4. Revise confusing items and profile labels.
5. Rework the Spectrum page so it follows the quiz result types while still letting users directly browse the map.

## Open Questions

- What backend should store pilot responses?
- Should mainland China respondents use a separate deployment and data path?
- Should the public-facing result use neutral profile names first and meme names only in the share layer?
- What venue, if any, should this become: demo, essay, survey paper, or AIES-style position/measurement paper?
- How much should the bilingual Spectrum pages foreground the map versus the quiz result catalog?
