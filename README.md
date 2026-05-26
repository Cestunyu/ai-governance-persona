# AI Ideology Quiz / AI Social Thought Spectrum

This repository contains a lightweight AI ideology quiz and the underlying two-axis AI Social Thought Spectrum. It maps major social, political, philosophical, and technical positions around advanced AI.

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

- `ai-ideology-quiz.html`: Chinese clean quiz-only page with one-question-at-a-time flow and reference points from the two-axis thinker map.
- `ai-ideology-quiz-en.html`: English clean quiz-only page with the same scoring logic, reference points, and language switch.
- `ai-ideology-placement-quiz.html`: richer experimental page with live profile, copyable summary, and PNG share-poster logic.
- `ai-thought-spectrum-visualization.html`: Chinese public-facing map for explaining the AI thought spectrum and browsing thinkers, movements, and representative works.
- `ai-thought-spectrum-visualization-en.html`: English public-facing version of the same spectrum map.
- `ROADMAP.md`: current two-day build plan and publication path.
- `CURRENT.md`: active state, active files, and next actions.
- `research/2026-05-14-ai-social-thought-spectrum-source-map.md`: source map for the spectrum and representative positions.
- `planning/2026-05-19-ai-ideology-quiz-pilot.md`: pilot plan and near-term coordination.

## Project Lines

The project now has four parallel lines:

- Measurement: turn AI attitudes into a closed questionnaire and two-axis coordinates.
- Explanation: make the spectrum map legible through the bilingual visualization pages and source map.
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
- `ai-ideology-quiz.html`: standalone quiz-only Chinese page for data collection, using an MBTI-style one-question-at-a-time flow
- `ai-ideology-quiz-en.html`: standalone quiz-only English page for international respondents
- `ai-ideology-placement-quiz.html`: standalone Chinese HTML quiz that scores, plots, profiles, and generates PNG share posters for respondents
- `ai-thought-spectrum-visualization.html`: standalone Chinese interactive visualization
- `ai-thought-spectrum-visualization-en.html`: standalone English interactive visualization
- `cycles/`: dated learning cycles
- `_system/checks/`: reusable checks for classifying new texts
- `research/`: durable source maps and research context
- `planning/`: pilot and project coordination notes

## Start Here

1. `CURRENT.md`
2. `ROADMAP.md`
3. `ai-ideology-quiz.html`
4. `ai-ideology-quiz-en.html`
5. `questionnaires/README.md`
6. `questionnaires/2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md`
7. `questionnaires/2026-05-19-ai-ideology-meme-profiles-zh.md`
8. `ai-ideology-placement-quiz.html`
9. `ai-thought-spectrum-visualization.html`
10. `ai-thought-spectrum-visualization-en.html`
11. `concepts/ai-thought-spectrum-map.md`
12. `data/ai-thought-spectrum.json`
13. `_system/GUIDE.md`
14. `research/2026-05-14-ai-social-thought-spectrum-source-map.md`
15. `planning/2026-05-19-ai-ideology-quiz-pilot.md`

## Current Default

When in doubt, treat `ai-ideology-quiz.html` as the Chinese production candidate, `ai-ideology-quiz-en.html` as the English production candidate, and `ai-ideology-placement-quiz.html` as the experimental social-sharing version.
