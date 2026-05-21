# AI Ideology Quiz Scoring Rubric

Last updated: 2026-05-20

This note documents the active scoring logic used by `ai-ideology-quiz.html` and `ai-ideology-quiz-en.html`.

## Framework

The quiz now uses three internal dimensions and projects them into a two-dimensional map.

- **R: risk / harm diagnosis**
  - This is not a single left-right score. It asks what kind of AI problem the respondent thinks is primary.
  - Four diagnosis types are scored separately: civilizational risk, current social harm, normal technology / hype, and opportunity cost.
- **C: control / openness-build response**
  - Negative C means release thresholds, licensing, audits, liability, and controlled access.
  - Positive C means open competition, capability diffusion, faster deployment, and correction through use.
- **H: humanism / posthumanism**
  - Positive H means democratic human choice, human dignity, appeal rights, and accountable human authority.
  - Negative H means current human preference and institutions should not be treated as final constraints on more advanced intelligence or future value.

The displayed map is:

```text
X = 0.65 * C - 0.35 * R_projection
Y = H
R_projection = civilizational_risk - opportunity_cost
```

So X mostly shows the control-versus-open-deployment response, while still moving catastrophic-risk respondents left and opportunity-cost respondents right. Y directly shows human-centered versus posthuman/intelligence-centered values.

## Core Items

There are 12 core Likert items: 4 R, 4 C, and 4 H.

For each 1-7 item:

```text
centered = (answer - 4) / 3
item_score = 2 * centered
```

This keeps each scored component in `[-2, 2]`.

| ID | Dimension | Scoring role |
|---|---|---|
| R01 | R | Civilizational-risk diagnosis |
| R02 | R | Current-social-harm diagnosis |
| R03 | R | Normal-technology / hype diagnosis |
| R04 | R | Opportunity-cost diagnosis |
| C01 | C | Control threshold, direction -1 |
| C02 | C | Licensing / audit / liability, direction -1 |
| C03 | C | Open competition / anti-gatekeeping, direction +1 |
| C04 | C | Faster real-world deployment, direction +1 |
| H01 | H | Democratic human goal selection, direction +1 |
| H02 | H | Accountable human authority, direction +1 |
| H03 | H | Anti-finalizing-current-human-preferences, direction -1 |
| H04 | H | AI judgment priority over low-quality human judgment, direction -1 |

## Dimension Scores

R items are preserved as four separate diagnosis scores:

```text
civilizational_risk = score(R01)
current_social_harm = score(R02)
normal_technology = score(R03)
opportunity_cost = score(R04)
```

C and H are averaged directional scores:

```text
C = 2 * average(centered(answer) * item_direction) over C01-C04
H = 2 * average(centered(answer) * item_direction) over H01-H04
```

The result panel shows the dominant R diagnosis by highest R subscore, plus numeric C and H scores.

## Classification

The visible coordinate is only one part of the profile assignment. The profile classifier also uses:

- Core R/C/H evidence derived from the three-dimensional scores.
- Scenario choices as light cross-check evidence.
- Final self-placement statements as stronger tie-break evidence.
- Nearest projected profile anchor when evidence is tied or weak.

This is still a pilot locator, not a validated psychometric instrument. The design goal is clearer construct separation: diagnosis first, response second, value frame third.

## Next Validation Step

If this becomes a research instrument, the next step is not more hand-tuned weighting. The next step is a pilot dataset, item-total checks, factor analysis with oblique rotation, and revisions based on observed cross-loadings and classification instability.
