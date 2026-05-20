# AI Ideology Quiz Roadmap

Last updated: 2026-05-19

## Current Shape

This project has moved from a reading map into a lightweight measurement product. The underlying research object is still the two-axis AI social thought spectrum, but the immediate deliverable is a closed questionnaire that can place respondents and return an interpretable profile.

## Two-Day Sprint

### Day 1: Stabilize The Instrument

- Lock the production candidates as `ai-ideology-quiz.html` and `ai-ideology-quiz-en.html`, with one-question-at-a-time interaction rather than a long form.
- Keep the active quiz closed-ended: no background module, no open text, no quality-check module.
- Review the 12 core items for balance across the two axes.
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

## Artifact Roles

- Chinese production candidate: `ai-ideology-quiz.html`
- English production candidate: `ai-ideology-quiz-en.html`
- Viral/share experiment: `ai-ideology-placement-quiz.html`
- Research map: `ai-thought-spectrum-visualization.html`
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
- The page explains the two axes without overexplaining the project.
- Response data can be exported or stored in a clean tabular schema.
- The meme profile layer is clearly separated from the measurement layer.
