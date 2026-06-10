# Data Inventory

This folder currently stores project data, not respondent data.

## Current Files

- `ai-thought-spectrum.json`
  - Structured thinker, movement, coordinate, and source dataset for the two-axis AI social thought map.
  - Feeds the visualization and classification work.

## Response Data Rule

Do not put raw identifiable respondent data in this repository.

The EdgeOne Pages pilot stores completed responses in the configured Blob store, not in git. The server record wraps each payload as:

- `id`: random result id generated server-side
- `created_at`: server timestamp
- `source`: `edgeone-pages`
- `schema_version`: backend schema date
- `anti_abuse`: active backend controls
- `payload`: sanitized quiz result payload

Minimum accepted payload fields:

- `quiz_id`: must be `ai-ideology-quiz`
- `locale`: `zh-CN` or `en`
- `quiz_version`
- `measurement_version`
- `completed_at`: browser completion timestamp
- `answers`: closed answer vector for `U01`, `H02`, `C04`, `C02`, `C03`, `L01`, `I01`, `T01`, `D01`, `R01`, `R04`, `E01`, `H01`, and `H04`
- `scenarios`: choice for `V3`
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
