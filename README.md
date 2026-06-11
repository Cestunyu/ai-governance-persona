# AI Ideology Quiz / AI Social Thought Spectrum

This repository contains a lightweight AI ideology quiz and a two-axis AI Social Thought Spectrum. The homepage should offer two public paths: start the quiz, or directly browse the spectrum.

The goal is not to collect every AI opinion. The goal is to build a reusable map of the representative thinkers, texts, movements, and claims that shape debates about AI risk, progress, alignment, social harm, scaling, acceleration, and posthuman futures.

## Target Ability

For a new AI essay, policy intervention, or public argument, the target is to answer:

- What tradition or movement does this belong to?
- What does it assume about human control, agency, and value?
- Does it treat AI mainly as existential risk, normal technology, social power, economic abundance, autonomous computation, or posthuman transition?
- What primary text best represents the position?
- Is the influence academic, institutional, cultural, memetic, policy-facing, or capital-facing?

## Core Design

Do not force the material onto one left-to-right line. Use two axes:

- Risk/governance axis: shutdown or pause -> safety-first governance -> normal technology -> build-oriented optimism -> accelerationism.
- Humanism axis: democratic/human-centered control -> human-compatible alignment -> neutral technical empiricism -> computation-centered anti-anthropocentrism -> anti-humanist/posthuman acceleration.

This separates positions that are often conflated:

- AI safety doomers are high-risk and human-protective.
- Critical AI scholars are human-centered but usually focused on present social harms rather than AGI extinction.
- Bitter Lesson thinking is not a policy ideology, but it is anti-anthropocentric in its technical epistemology.
- e/acc and Nick Land-style accelerationism are optimistic about acceleration but weakly or openly anti-humanist.
- Pragmatic AI optimists are pro-deployment without necessarily endorsing posthuman acceleration.

## Source Buckets

Use these buckets when collecting texts:

1. X-risk and alignment safety
2. Managed frontier-lab safety and governance
3. Critical AI, social harm, and justice
4. Normal-technology and hype skepticism
5. Scaling, Bitter Lesson, and computation-centered empiricism
6. Pragmatic AI optimism
7. Singularitarian and techno-optimist abundance
8. Accelerationism, e/acc, and anti-humanist/posthuman thought

## Current Entry Points

- `/cn/`: Chinese production quiz/result/share page.
- `/en/`: English production quiz/result/share page.
- `/ch/`: legacy redirect to `/cn/`.
- `index.html`: lightweight redirect to `/cn/`.
- `data/quiz.zh.json`: canonical Chinese quiz/questionnaire data.
- `data/quiz.en.json`: canonical English quiz/questionnaire data.
- `ai-governance-spectrum.html`: Chinese browse-first governance/persona spectrum page.
- `ai-governance-spectrum-en.html`: English browse-first spectrum page; should mirror the Chinese result-led structure.
- `ai-personality-profiles.html`: Chinese persona profile catalog.
- `ai-governance-persona-profiles-en.html`: English persona profile catalog.
- `archive/old-pages/`: old quiz and spectrum pages retained for audit/history, not production.
- `archive/old-demos/`: share-card demos and generated artifacts retained for design history.
- `ROADMAP.md`: current two-day build plan and publication path.
- `CURRENT.md`: active state, active files, and next actions.
- `research/2026-05-14-ai-social-thought-spectrum-source-map.md`: source map for the spectrum and representative positions.
- `planning/2026-05-19-ai-ideology-quiz-pilot.md`: pilot plan and near-term coordination.

## Project Lines

The project now has four product lines:

- Measurement: turn AI attitudes into a closed questionnaire and two-axis coordinates.
- Spectrum browsing: let users directly see where result types, people, and movements sit.
- Result explanation: make each quiz result legible through profile copy, nearby positions, dimensions, and shareable interpretation.
- Meme layer: convert coordinates into short shareable profiles without letting the joke replace the measurement.
- Data pipeline: collect pilot responses, store only the fields needed for analysis, and keep raw identifiable data out of this repository.

## Folder Structure

- `CURRENT.md`: active cycle and next actions
- `ROADMAP.md`: near-term build, pilot, and deployment plan
- `_system/GUIDE.md`: learning and classification rules
- `concepts/ai-thought-spectrum-map.md`: current spectrum and placement notes
- `data/ai-thought-spectrum.json`: structured thinker/work dataset
- `data/README.md`: data inventory and response-data rules
- `questionnaires/`: survey instruments for placing respondents on the two-axis spectrum
  - `README.md`: questionnaire inventory and status
  - `2026-05-19-ai-ideology-placement-battery.md`: full pilot battery and scoring design
  - `2026-05-19-ai-ideology-short-locator-zh.md`: Chinese short locator for casual pilots
  - `2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md`: closed-ended pilot questionnaire structure for data collection
  - `2026-05-19-ai-ideology-meme-profiles-zh.md`: short profile copy for result cards
- `cn/index.html`: current Chinese production quiz/result/share page
- `ch/index.html`: legacy redirect to `/cn/`
- `en/index.html`: current English production quiz/result/share page
- `index.html`: lightweight redirect to `/cn/`
- `data/quiz.zh.json`: canonical Chinese quiz/questionnaire data
- `data/quiz.en.json`: canonical English quiz/questionnaire data
- `ai-governance-spectrum.html`: Chinese interactive/result-led spectrum visualization
- `ai-governance-spectrum-en.html`: English interactive/result-led spectrum visualization
- `ai-personality-profiles.html`: Chinese profile catalog
- `ai-governance-persona-profiles-en.html`: English profile catalog
- `archive/old-pages/`: old standalone quiz and spectrum experiments
- `archive/old-demos/`: share-card demo HTML, scripts, and generated images
- `cycles/`: dated learning cycles
- `_system/checks/`: reusable checks for classifying new texts
- `research/`: durable source maps and research context
- `planning/`: pilot and project coordination notes

## Start Here

1. `CURRENT.md`
2. `ROADMAP.md`
3. `ch/index.html`
4. `en/index.html`
5. `questionnaires/README.md`
6. `questionnaires/2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md`
7. `questionnaires/2026-05-19-ai-ideology-meme-profiles-zh.md`
8. `ai-governance-spectrum.html`
9. `ai-governance-spectrum-en.html`
10. `ai-personality-profiles.html`
11. `ai-governance-persona-profiles-en.html`
12. `concepts/ai-thought-spectrum-map.md`
13. `data/ai-thought-spectrum.json`
14. `_system/GUIDE.md`
15. `research/2026-05-14-ai-social-thought-spectrum-source-map.md`
16. `planning/2026-05-19-ai-ideology-quiz-pilot.md`

## Current Default

When in doubt, treat `data/quiz.zh.json` and `data/quiz.en.json` as the canonical quiz data, and treat `/cn/` and `/en/` as the production quiz/result/share pages. Treat `ai-governance-spectrum.html`, `ai-governance-spectrum-en.html`, `ai-personality-profiles.html`, and `ai-governance-persona-profiles-en.html` as supporting browse/profile pages. Old quiz and share experiments live under `archive/` and should not be edited as production surfaces. Run `npm run release:check` and `npm run release:bundle` before any deploy.
