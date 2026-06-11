# Questionnaire Inventory

This folder contains the survey instruments and profile copy for the AI ideology placement project.

## Current Production Source

- `2026-05-19-ai-ideology-closed-questionnaire-v1-zh.md`
  - Closed-ended Chinese questionnaire structure.
  - Historical questionnaire design source. The active production canonical data now lives in `data/quiz.zh.json` and `data/quiz.en.json`.
  - Background and quality-check modules are documented here for future research use, but they are not part of the active production pages.

## Supporting Instruments

- `2026-05-20-ai-ideology-scoring-rubric.md`
  - Active scoring rubric for the Chinese and English standalone quiz pages.
  - Documents the option-vector schema, prototype classifier, projection layer, and known limitations.

- `2026-05-20-ideology-classification-method-review.md`
  - Review of relevant ideology classification and psychometric practice.
  - Use as the methodological benchmark when deciding whether to add items, revise scoring, or call the instrument "scientific."

- `2026-05-28-ai-ideology-methodology-critique.md`
  - Branch-level critique under the current item-count constraint.
  - Reframes scientific improvement around position scoring, scenario consistency, self-confirmation, and external AI narrative clustering evidence.

- `2026-05-19-ai-ideology-short-locator-zh.md`
  - Earlier Chinese short locator.
  - Useful for casual manual pilots and for comparing wording changes.

- `2026-05-19-ai-ideology-placement-battery.md`
  - Full survey battery and scoring design.
  - Use when expanding from a viral quiz into a research instrument.

## Profile Layer

- `2026-05-19-ai-ideology-meme-profiles-zh.md`
  - SBTI-style result profiles.
  - This is presentation copy, not measurement logic.
  - Keep profile edits synchronized with the HTML result cards.

## Editing Rules

- Keep production quiz items closed-ended.
- Treat `data/quiz.zh.json` and `data/quiz.en.json` as the deployable questionnaire source of truth.
- Do not add open text to the active pilot unless the data plan explicitly supports reviewing and storing it.
- Do not let meme labels define the coordinates; coordinates come first, labels come second.
- When changing item wording, record whether the scoring direction changed.
