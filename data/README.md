# Data Inventory

This folder currently stores project data, not respondent data.

## Current Files

- `quiz.zh.json`
  - Canonical Chinese production quiz/questionnaire data.
  - Must match embedded constants in `cn/index.html`; enforced by `npm run release:check`.
- `quiz.en.json`
  - Canonical English production quiz/questionnaire data.
  - Must match embedded constants in `en/index.html`; enforced by `npm run release:check`.
- `ai-thought-spectrum.json`
  - Structured thinker, movement, coordinate, and source dataset for the two-axis AI social thought map.
  - Feeds the visualization and classification work.

## Release Rule

Before publishing, run:

```bash
npm run release:check
npm run release:bundle
```

For quiz wording or scoring changes, edit the canonical JSON first:

```bash
npm run quiz:sync-html
npm run release:check
```

`npm run quiz:extract-html` is an emergency recovery command for intentionally extracting JSON from production HTML. Do not use it for normal copy edits.

## Response Data Rule

Do not put raw identifiable respondent data in this repository.

The active Vercel pilot stores completed responses in Supabase when Vercel has `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and an export token configured. Server records wrap each payload as:

- `id`: random result id generated server-side
- `created_at`: server timestamp
- `source`: `vercel`
- `schema_version`: backend schema date
- `anti_abuse`: active backend controls
- `payload`: sanitized quiz result payload

Minimum accepted payload fields:

- `quiz_id`: must be `ai-ideology-quiz`
- `locale`: `zh-CN` or `en`
- `quiz_version`
- `measurement_version`
- `started_at`: browser session start timestamp, when available
- `completed_at`: browser completion timestamp
- `duration_ms`: browser-side quiz session duration in milliseconds, when available
- `answers`: closed answer vector for `U01`, `H02`, `C04`, `C02`, `C03`, `L01`, `I01`, `T01`, `D01`, `R01`, `R04`, `E01`, `H01`, and `H04`
- `answer_keys`: stable answer keys such as `A`, `B`, `C`, and `D`, when available
- `scenarios`: choice for `V3`
- `scenario_keys`: stable scenario answer keys, when available
- `closest_statement_keys`: stable keys for selected self-check statements, when available
- `scores`: fixed numeric scores including `x`, `y`, `c`, and `h`
- `labels`: displayed result labels
- `profile_code`, `profile_margin`, `profile_ranking`
- `projection`
- `respondent_vector`
- `diagnostics`

Privacy policy for the pilot:

- names: do not collect
- emails: do not collect
- raw IP addresses: do not store in the payload or committed files
- provider logs: allowed for security/debugging only
- free-text identity fields: do not collect
- Turnstile/CAPTCHA tokens: verify server-side if enabled, then discard

If pilot responses are exported here later, use an anonymized subfolder such as `responses/` and include only the minimum fields needed to reproduce results:

- timestamp bucket or coarse timestamp
- language
- quiz_version
- core answer vector
- scenario choice vector
- fixed self-placement choice
- x_score
- y_score
- profile_code

Keep names, emails, IP addresses, referral identifiers, and free-text identity details out of committed files.
