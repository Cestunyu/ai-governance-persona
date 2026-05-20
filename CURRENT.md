# Current AI Social Thought Spectrum State

Last updated: 2026-05-20

## Active Cycle

- cycle: `2026-05-14-ai-social-thought-spectrum-seed-map`
- period: 2026-05-14 to 2026-05-28
- theme: turn the AI social thought map into a pilotable AI ideology quiz
- style: closed questionnaire first, meme layer second, research map underneath

## Current Aim

Build a first-pass map from AI doomerism and alignment safety through critical AI, Bitter Lesson scaling thought, pragmatic AI optimism, techno-optimism, e/acc, and Nick Land-style accelerationist anti-humanism. The current product layer is a closed Chinese and English quiz pair that places respondents on the two-axis map.

The desired state is not a definitive canon. It is a working map that makes it easy to ask:

- Which position is this text representing?
- What is its canonical primary source?
- What is its risk model?
- How human-centered is it?
- How influential is it, and through which channel?
- What should be read next?

## Current Deliverable

- `ai-ideology-quiz.html` is the Chinese production candidate: a standalone quiz-only page with an MBTI-style one-question-at-a-time flow for clean pilot data collection.
- `ai-ideology-quiz-en.html` is the English production candidate with the same scoring logic, translated items, translated result copy, and language switching.
- Both production quiz pages now show the respondent's profile point against 20 reference thinkers and movements from `data/ai-thought-spectrum.json`.
- It removes background questions, quality checks, open text, image generation, and share-poster logic from the active quiz flow.
- `questionnaires/2026-05-19-ai-ideology-placement-battery.md` is the first pilot questionnaire battery for placing respondents on the two-axis map.
- `questionnaires/2026-05-19-ai-ideology-short-locator-zh.md` is the Chinese short locator for casual group testing.
- `questionnaires/2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md` is the closed-ended pilot questionnaire structure for data collection.
- `ai-ideology-placement-quiz.html` turns the Chinese short locator into a standalone browser quiz with live scoring, plotting, SBTI-style profiles, copyable summaries, and downloadable PNG share posters.
- `questionnaires/2026-05-19-ai-ideology-meme-profiles-zh.md` records the SBTI-style profile copy used by the HTML result cards.
- `questionnaires/2026-05-20-ai-ideology-scoring-rubric.md` records the active weighted scoring model and the semantic rationale for each core item.
- `questionnaires/2026-05-20-ideology-classification-method-review.md` benchmarks the quiz against Pew typology, World Values Survey, Moral Foundations, dual-process ideology models, and psychometric scale-development practice.
- `ai-thought-spectrum-visualization.html` is the standalone Chinese mother page for explaining the two-axis map.
- `ROADMAP.md`, `questionnaires/README.md`, and `data/README.md` organize the current sprint, survey artifacts, and response-data rules.
- `research/2026-05-14-ai-social-thought-spectrum-source-map.md` records the source map.
- `planning/2026-05-19-ai-ideology-quiz-pilot.md` records the current pilot plan.

## Active Product Order

1. Stabilize `ai-ideology-quiz.html` and `ai-ideology-quiz-en.html` as the pilot pages.
2. Decide response storage and export schema before collecting real responses.
3. Run 10-20 friendly pilot responses and inspect distribution, confusing items, and profile mismatch.
4. Only then polish `ai-ideology-placement-quiz.html` as the viral/share-card layer.

## First Reading Order

1. Rich Sutton, `The Bitter Lesson`
2. Eliezer Yudkowsky, `Artificial Intelligence as a Positive and Negative Factor in Global Risk`
3. Nick Bostrom, `The Superintelligent Will` or chapters from `Superintelligence`
4. Bender, Gebru, McMillan-Major, and Shmitchell, `On the Dangers of Stochastic Parrots`
5. Dario Amodei, `Machines of Loving Grace`
6. Marc Andreessen, `Why AI Will Save the World`
7. Nick Land, `Meltdown` and `The Dark Enlightenment`

## Active Files

- `README.md`
- `ROADMAP.md`
- `_system/GUIDE.md`
- `cycles/2026-05-14-ai-social-thought-spectrum-seed-map.md`
- `_system/checks/spectrum-placement-check.md`
- `concepts/ai-thought-spectrum-map.md`
- `data/ai-thought-spectrum.json`
- `data/README.md`
- `questionnaires/README.md`
- `questionnaires/2026-05-19-ai-ideology-placement-battery.md`
- `questionnaires/2026-05-19-ai-ideology-short-locator-zh.md`
- `questionnaires/2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md`
- `questionnaires/2026-05-19-ai-ideology-meme-profiles-zh.md`
- `questionnaires/2026-05-20-ai-ideology-scoring-rubric.md`
- `questionnaires/2026-05-20-ideology-classification-method-review.md`
- `ai-ideology-quiz.html`
- `ai-ideology-quiz-en.html`
- `ai-ideology-placement-quiz.html`
- `ai-thought-spectrum-visualization.html`
- `research/2026-05-14-ai-social-thought-spectrum-source-map.md`
- `planning/2026-05-19-ai-ideology-quiz-pilot.md`

## Next Session

1. Add a minimal submit/export path for `ai-ideology-quiz.html` and `ai-ideology-quiz-en.html`.
2. Choose a storage target for Chinese and English respondents.
3. Run a 10-20 person pilot and inspect item balance, confusing labels, and profile-result mismatch.
4. Review whether the English copy needs cultural adaptation beyond direct translation.

## Open Questions

- Should response collection use a simple form backend first, or a proper database from day one?
- Should mainland China respondents use a separate collection path because of access, latency, and consent-language differences?
- Should profile labels remain meme-heavy, or should the production quiz use neutral labels and only expose meme profiles in the share layer?
- Should `AI safety` be split into rationalist doom, academic beneficial AI, scalable oversight, evals/governance, and frontier-lab policy in the next instrument version?
