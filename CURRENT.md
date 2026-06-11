# Current AI Social Thought Spectrum State

Last updated: 2026-06-11

## Active Cycle

- cycle: `2026-05-14-ai-social-thought-spectrum-seed-map`
- period: 2026-05-14 to 2026-05-28
- theme: turn the AI social thought map into a pilotable AI ideology quiz
- style: homepage offers two paths: start the quiz or browse the result-led spectrum

## Current Aim

Build a first-pass map from AI doomerism and alignment safety through critical AI, Bitter Lesson scaling thought, pragmatic AI optimism, techno-optimism, e/acc, and Nick Land-style accelerationist anti-humanism. The current public layer should have two entry points: take the quiz, or directly browse the spectrum to see where the result types, people, and movements sit.

The desired state is not a definitive canon. It is a working map that makes it easy to ask:

- Which position is this text representing?
- What is its canonical primary source?
- What is its risk model?
- How human-centered is it?
- How influential is it, and through which channel?
- What should be read next?

## Current Deliverable

- `/cn/` is the Chinese production quiz/result/share page.
- `/en/` is the English production quiz/result/share page.
- `/ch/` and `index.html` are lightweight redirects to `/cn/` so neither path carries a third copy of the quiz.
- `data/quiz.zh.json` and `data/quiz.en.json` are the canonical quiz/questionnaire data checked against the production HTML by `npm run release:check`.
- Both production quiz pages show the respondent's profile point against 20 reference thinkers and movements from `data/ai-thought-spectrum.json`.
- The result flow includes short profile copy, small explanatory copy, nearest-reference context, a two-axis position map, and a generated share image.
- `questionnaires/2026-05-19-ai-ideology-placement-battery.md` is the first pilot questionnaire battery for placing respondents on the two-axis map.
- `questionnaires/2026-05-19-ai-ideology-short-locator-zh.md` is the Chinese short locator for casual group testing.
- `questionnaires/2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md` is the closed-ended pilot questionnaire structure for data collection.
- Old standalone quiz experiments are archived under `archive/old-pages/`.
- `questionnaires/2026-05-19-ai-ideology-meme-profiles-zh.md` records the SBTI-style profile copy used by the HTML result cards.
- `questionnaires/2026-05-20-ai-ideology-scoring-rubric.md` records the active weighted scoring model and the semantic rationale for each core item.
- `questionnaires/2026-05-20-ideology-classification-method-review.md` benchmarks the quiz against Pew typology, World Values Survey, Moral Foundations, dual-process ideology models, and psychometric scale-development practice.
- `ai-governance-spectrum.html` and `ai-governance-spectrum-en.html` remain public browse-first spectrum pages, but their structure should follow the quiz's final result types rather than an internal taxonomy-first explanation.
- `ai-personality-profiles.html` and `ai-governance-persona-profiles-en.html` are the public profile catalog pages.
- `ROADMAP.md`, `questionnaires/README.md`, and `data/README.md` organize the current sprint, survey artifacts, and response-data rules.
- `research/2026-05-14-ai-social-thought-spectrum-source-map.md` records the source map.
- `planning/2026-05-19-ai-ideology-quiz-pilot.md` records the current pilot plan.

## Active Product Order

1. Explore several stronger index/introduction demos before replacing production pages.
2. Review the quiz items for difficulty, fun, accessibility, and measurement validity; many items currently feel too technical for the desired audience.
3. Incorporate useful external suggestions into the questionnaire and product design after review.
4. Decide the backend/data collection plan before collecting real responses, including whether IP addresses are stored raw, hashed, reduced to coarse location, or left only in server logs.
5. Design server deployment for both mainland China and overseas access before purchase/configuration.
6. Simplify the share layer around screenshot-first sharing rather than complex generated share pages.
7. After these decisions, stabilize `/cn/` and `/en/` as the pilot pages and run 10-20 friendly pilot responses.

## 2026-06-07 Product Feedback Update

The current priority is project completeness and pilot-readiness, not immediate production replacement.

- Question design: keep technical seriousness, but reduce overly technical framing and add more accessible, interesting, scenario-like, or culturally legible material.
- External feedback: collect suggestions and decide which should update the questionnaire, scoring, copy, or page flow.
- Completeness: the Introduction and Index/homepage are not yet strong enough; explore multiple plain-but-distinctive demo directions first.
- Backend: prepare a design for collecting timestamps, answer vectors, version/language, scores/profile outputs, and an explicit IP address policy.
- Server: server purchase/provider choice remains a human decision.
- Sharing: retire overcomplicated share-page assumptions and move toward a screenshot-first result/share experience.

## 2026-06-11 V2 Test Feedback To-Do

- Question length: reduce reading cost. The data-training copyright/privacy/open-web item is too long in both prompt and options; discuss shorter framing before editing.
- Scenario length: shorten the validated research-tool item; current prompt is too long for mobile reading.
- Self-check wording: avoid saying "AI persona" in the final multiple-select question; frame it as the respondent's view of AI.
- Share image robustness: prevent text overflow across all 10 profile share cards, especially profile title text and closest-reference names.

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
- `ch/index.html`
- `en/index.html`
- `index.html`
- `ai-governance-spectrum.html`
- `ai-governance-spectrum-en.html`
- `ai-personality-profiles.html`
- `ai-governance-persona-profiles-en.html`
- `archive/old-pages/`
- `archive/old-demos/`
- `research/2026-05-14-ai-social-thought-spectrum-source-map.md`
- `planning/2026-05-19-ai-ideology-quiz-pilot.md`

## Next Session

1. Create several index/introduction demo directions for user review.
2. Review the current item set for technical difficulty, fun, and audience fit.
3. Draft backend options for CSV-only, lightweight database, and hosted/server deployment.
4. Propose a screenshot-first sharing/result layout.
5. Only after user confirmation, implement the selected index/introduction and backend direction.

## Open Questions

- Should response collection use a simple form backend first, or a proper database from day one?
- Should mainland China respondents use a separate collection path because of access, latency, and consent-language differences?
- Should respondent IP addresses be stored raw, hashed, reduced to coarse geography, or retained only in server logs?
- Should profile labels remain meme-heavy, or should the production quiz use neutral labels and only expose meme profiles in the share layer?
- How much of the standalone Spectrum page should be browse-first map, and how much should be result-type catalog?
- Should `AI safety` be split into rationalist doom, academic beneficial AI, scalable oversight, evals/governance, and frontier-lab policy in the next instrument version?
