# Data Inventory

This folder currently stores project data, not respondent data.

## Current Files

- `ai-thought-spectrum.json`
  - Structured thinker, movement, coordinate, and source dataset for the two-axis AI social thought map.
  - Feeds the visualization and classification work.

## Response Data Rule

Do not put raw identifiable respondent data in this repository.

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
