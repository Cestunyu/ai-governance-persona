# AI Ideology Quiz Roadmap

Last updated: 2026-06-11

## Current Shape

This project has moved from a reading map into a lightweight measurement product with two public entry paths: start the quiz, or directly browse the spectrum.

The current production quiz/result/share pages are `/cn/` and `/en/`. The root `index.html` and legacy `/ch/` path redirect to `/cn/`; old standalone quiz experiments live under `archive/old-pages/`.

## Current Priority Shift

The project should not immediately lock the existing index/introduction/share/backend design. The current priority is to record feedback, explore better product directions, and only then implement the chosen path.

Key new concerns:

- The item set may be too technical; revise toward a balance of rigor, accessibility, and fun.
- External suggestions should be reviewed and routed into questionnaire, copy, scoring, or product flow changes.
- The Introduction and Index/homepage need a stronger plain-but-distinctive presentation; create multiple demos before choosing.
- Backend design should consider mainland China and overseas accessibility, timestamps, answer vectors, version/language fields, scores/profile outputs, and IP address policy.
- Server purchase/provider choice is a human decision and should not be automated.
- Sharing should become screenshot-first rather than relying on complex generated share pages.

## Immediate Exploration Sprint

### Track 1: Index / Introduction Demos

- Produce several alternative first-screen and introduction directions.
- Keep each version plain, credible, and visually distinctive rather than marketing-heavy.
- Do not replace production files until the user confirms a preferred direction.

### Track 2: Instrument Accessibility

- Review whether the current core items are too technical or too narrow.
- Identify items to keep, rewrite, soften, or replace.
- Add scenario-like or more culturally legible material without weakening the scoring construct.

### Track 3: Backend / Data Collection Design

- Compare CSV-only, lightweight database, and hosted/server deployment.
- Define a minimum response schema.
- Decide IP address policy before implementation.
- Keep raw respondent data out of git.

### Track 4: Screenshot-First Sharing

- Retire overcomplicated share-poster assumptions where appropriate.
- Design result pages that are naturally screenshot-friendly on mobile and desktop.
- Preserve result clarity while increasing social spread potential.

## Previous Two-Day Sprint

### Day 1: Stabilize The Instrument

- Lock the production pages as `/cn/` and `/en/`, with one-question-at-a-time interaction rather than a long form.
- Keep the active quiz closed-ended: no background module, no open text, no quality-check module.
- Review the core items for balance across the two axes and the 10-dimensional prototype classifier.
- Confirm every item maps cleanly to `x_score` or `y_score`.
- Confirm scenario questions and fixed self-placement are auxiliary checks, not coordinate inputs.
- Run the page locally and test at least one full answer path for each quadrant.

### Day 2: Prepare Data Collection

- Decide where responses are stored.
- Define the response schema before collecting real users.
- Add a submit/export path that captures only necessary fields.
- Run a 10-20 person friendly pilot.
- Inspect whether the result profile feels plausible to respondents.
- Revise labels and confusing items before broader release.
- Keep the homepage as a two-choice entry: start the quiz or directly browse the spectrum.
- Rework the Spectrum page so it is browse-first but organized around the quiz final result types.

## Artifact Roles

- Chinese production page: `/cn/`
- English production page: `/en/`
- Root entry: `index.html` redirects to `/cn/`
- Archived quiz/share experiments: `archive/old-pages/`
- Archived share-card demos: `archive/old-demos/`
- Public spectrum: `ai-governance-spectrum.html` and `ai-governance-spectrum-en.html`
- Public profile catalogs: `ai-personality-profiles.html` and `ai-governance-persona-profiles-en.html`
- Full survey design: `questionnaires/2026-05-19-ai-ideology-placement-battery.md`
- Closed questionnaire source: `questionnaires/2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md`
- Meme profile source: `questionnaires/2026-05-19-ai-ideology-meme-profiles-zh.md`

## Data Collection Decision

For the pilot, do not store raw names, email addresses, IP addresses, or free-text identity details in this repository. If a backend is added, the minimum useful fields are:

- timestamp
- language
- quiz_version
- answer vector for core items
- scenario choices
- fixed self-placement choice
- x_score
- y_score
- profile_code
- user agent class if needed for debugging

## Release Sequence

1. Chinese closed pilot.
2. Chinese profile/share layer.
3. English pilot and cultural adaptation.
4. Optional mainland-specific collection path if access or compliance requires it.
5. Research note or short paper framing after pilot data exists.

## Done Criteria For Pilot V1

- The quiz can be completed without any open-ended input.
- The result is reproducible from the answer vector.
- The homepage clearly offers two options: start the quiz or browse the spectrum.
- The Spectrum page explains result types and positions without feeling like an internal taxonomy dump.
- Response data can be exported or stored in a clean tabular schema.
- The meme profile layer is clearly separated from the measurement layer.
