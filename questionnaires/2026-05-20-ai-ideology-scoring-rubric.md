# AI Ideology Quiz Scoring Rubric

Last updated: 2026-05-28

This note documents the active scoring logic used by `ai-ideology-quiz.html` and `ai-ideology-quiz-en.html`.

## Framework

The quiz now uses a high-dimensional response-vector model. The two-dimensional map is a visualization projection, not the primary classifier.

Each selected option contributes an `option_vector` over ten construct dimensions:

- `civilizational_risk`
- `present_social_harm`
- `governance_control`
- `openness_build`
- `human_accountability`
- `intelligence_centrality`
- `capability_skepticism`
- `opportunity_cost`
- `permissionless_acceleration`
- `computation_epistemology`

The respondent's core measured position is:

```text
respondent_vector = weighted_mean(selected_option_vectors)
```

The result profile is assigned by nearest prototype in this high-dimensional vector space. The current prototype set is expert-coded and provisional. Prototypes are calibrated as attainable centroids under the current 10-item battery rather than abstract extremes, and should be replaced or recalibrated after pilot data and clustering checks.

The displayed map uses `projection.method = expert_seed_linear_projection_v1`. It compresses the high-dimensional vector into `x/y` for readability. It should not be described as the scientific scoring mechanism.

## Core Items

The active production quiz uses 10 core forced-choice items. This is intentionally shorter than the earlier full battery design. The scientific constraint is therefore to separate evidence layers clearly rather than silently adding more items.

Each answer option has an explicit vector code. A dimension value of `0` means no direct evidence, `±1` means a moderate signal, and `±2` means a strong signal. A question can target several dimensions at once, which makes cross-loading explicit rather than hidden. Several items are intentionally not ordinal sliders: they are mechanism choices whose options load onto different constructs.

| ID | Dimension | Scoring role |
|---|---|---|
| R01 | R | Mechanism of civilizational risk: hype skepticism, present social harm, loss of control, or posthuman technocapital logic |
| R04 | R | Mechanism of opportunity cost: necessary delay, overclaimed hype, regulatory capture, foregone near-term benefits, or suppressed intelligence growth |
| D01 | D | Democratic-society threat diagnosis |
| C02 | C | External constraint mechanism: open competition, ability-overclaim skepticism, governance engineering, rights/audit harms, or dangerous-capability licensing |
| C03 | C | Concentration/opening mechanism: dangerous-capability control, regulated plural access, participatory/open oversight, or permissionless diffusion |
| C04 | C | Source of deployment evidence: lab evals, staged rollout evidence, affected-community/social audit evidence, or fast real-world iteration |
| H01 | H | Final source of AI goals: market selection, expert/professional control, posthuman intelligence judgment, or democratic accountability |
| H02 | H | AI role in high-impact settings: practical service expansion, reliability skepticism, accountable key decisions, or final human judgment |
| H03 | H | Whether current human preferences should remain final: present responsibility, contestable human institutions, reversible value exploration, or posthuman/technical goal formation |
| H04 | H | AI judgment priority: human final authority, hype skepticism, computation-centered delegation, or intelligence-centered transfer |

## Derived Display Scores

For continuity with the existing UI, the result panel still reports derived display scores:

```text
R_projection = civilizational_risk - opportunity_cost
C = (openness_build - governance_control) / 2
H = (human_accountability - intelligence_centrality) / 2
```

These are labels and map helpers. They do not determine `profile_code`.

## Classification

The active classifier uses three evidence layers. The first layer is dominant; the final self-positioning layer is a light prior for near-ties:

1. **Core vector classification**: `respondent_vector` is compared against expert-coded `profilePrototypes`. The nearest prototype becomes `profile_code`.
2. **Scenario agreement**: concrete tradeoff choices are stored as agreement diagnostics only.
3. **Self-positioning prior**: final narrative statements apply a small distance bonus to matching or neighboring profiles. The bonus is intentionally small so it can break close ties but cannot override a large core-vector mismatch.

The result reports `classification_confidence`, `profile_margin`, `profile_distance`, `scenario_agreement`, and `self_agreement`. Low margin or disagreement should be read as mixed/conditional evidence, not as a decisive type.

This is still a pilot locator, not a validated psychometric instrument. The design goal is clearer construct separation: construct evidence first, prototype classification second, projection and entertainment copy third.

The scenario layer was reduced from four scenarios to three. The deleted `V1` software/cyber release scenario was too visibly mapped to profile labels and duplicated `C02/C03/C04`, so it had low diagnostic value as an agreement check.

## Key Profile Separation Signals

STOP, SAFE, and AUDT should not be interpreted as one governance-intensity scale:

- **STOP**: high `civilizational_risk`, strong `governance_control`, low `openness_build`, and strongly negative `opportunity_cost`. This represents a pause / dangerous-capability-threshold logic.
- **SAFE**: elevated `civilizational_risk`, high `human_accountability`, strong but less absolutist `governance_control`, and only moderately negative `opportunity_cost`. This represents controlled progress through evals, oversight, and alignment governance.
- **AUDT**: high `present_social_harm`, high `human_accountability`, and rights/institutional governance signals, without requiring high extinction-risk belief. This represents labor, discrimination, surveillance, procurement, appeal, and power-concentration concerns.

NORM and SKEP / hype skepticism are deliberately separated:

- **NORM**: context-specific governance, moderate human accountability, concrete deployment evidence, and only mild capability skepticism. This represents "AI as normal technology": useful, fallible, and governed by sector rather than by a single AGI narrative.
- **SKEP**: high `capability_skepticism` and negative `computation_epistemology`, with moderate governance rather than acceleration. This represents anti-hype / snake-oil critique: current systems and timelines are often overclaimed, so claims should be tested against concrete evidence.

POST and SING are also separated by mechanism rather than extremity:

- **SING**: high `intelligence_centrality` plus high `opportunity_cost` and positive abundance / transformation expectations.
- **POST**: high `intelligence_centrality` plus low `human_accountability`, with explicit signals that technical, capital, or posthuman dynamics may exceed human-social final control.

EACC, GPUC, and BOOM require separate signals because all three can look "pro-AI" on a two-axis map:

- **EACC**: high `permissionless_acceleration`, low `governance_control`, and high `openness_build`. This represents anti-gatekeeper acceleration and decentralized building.
- **GPUC**: high `computation_epistemology`, moderate `intelligence_centrality`, and low concern for human intuition as a privileged standard. This represents the Bitter Lesson / computation-centered view rather than political acceleration.
- **BOOM**: high `opportunity_cost` and `openness_build`, but with lower `permissionless_acceleration` and more `human_accountability`. This represents practical benefits in medicine, education, research, and productivity rather than an anti-governance ideology.

## Next Validation Step

If this becomes a research instrument, the next step is not more hand-tuned weighting. The next step is a pilot dataset, item-response checks, profile stability checks, k-medoids / hierarchical clustering of answer vectors, latent class analysis, and optional embedding analysis of open-ended explanations. Factor analysis is useful only after there are enough items per construct; the current 10-item production quiz should be described as a pilot locator, not a validated scale.

## Methodological Basis

- Pew political typology supports using multi-item response patterns and empirical clustering rather than hand-labeled coordinates.
- WVS / Inglehart-Welzel supports treating two-axis maps as projections of broader value structures, not as the original measurement.
- MFQ supports defining constructs first, then using item evidence to estimate them.
- COSMIN and scale-development guidance support content validity, internal structure, interpretability, and explicit limits on validation claims.
- AI discourse maps and clustering work, including AOI discourse mapping, Reddit AI safety clusters, AI ethics Twitter narrative mapping, and CSET contending frames, should constrain the construct map and profile families.
