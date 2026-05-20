# AI Ideology Quiz Scoring Rubric

Last updated: 2026-05-20

This note documents the active scoring logic used by `ai-ideology-quiz.html` and `ai-ideology-quiz-en.html`.

## Axes

- **X: governance-first <-> build-and-accelerate**
  - Negative X means pause, restrict, gate, audit, or require safety evidence before deployment.
  - Positive X means build, deploy, open, diffuse, and treat delay or regulation as a major cost.
- **Y: human-centered <-> compute/intelligence-centered**
  - Positive Y means human dignity, democratic legitimacy, appeal rights, accountable authority, and human-compatible goals matter intrinsically.
  - Negative Y means current human judgment, preference, and institutions can be discounted when intelligence growth, compute, or more advanced value forms dominate.

The two axes are not assumed to be statistically independent. Some items have small cross-loadings because their wording carries secondary semantic content. These are design weights for a pilot quiz, not validated factor loadings.

## Formula

For each 1-7 Likert item:

```text
centered = (answer - 4) / 3
axis_score = 2 * sum(centered * axis_weight) / sum(abs(axis_weight))
```

This keeps each coordinate roughly in `[-2, 2]`. The coordinate appears only on the map; the result type also uses scenario choices and the final multi-select self-placement as tie-break evidence.

## Core Item Semantics

| ID | Main facet | X weight | Y weight | Why |
|---|---:|---:|---:|---|
| X01 | Frontier risk evidence threshold | -1.00 | +0.25 | Slowing frontier AI is mainly governance-first; the safety/alignment framing also implies human-compatible constraints. |
| X02 | Anti-overregulation and deployment-risk tradeoff | +0.85 | -0.10 | The core claim favors deployment over regulation; it weakly discounts human institutional control. |
| X03 | Dangerous capability threshold and state pause authority | -1.00 | +0.10 | This is a direct pause/gatekeeping item, with a mild human-accountability component through government authority. |
| X04 | Rapid buildout and opportunity cost | +1.00 | -0.05 | This is the cleanest acceleration/deployment item; the Y loading stays minimal because opportunity-cost arguments can be human-benefit oriented. |
| X05 | Pre-release safety proof and human compatibility | -0.90 | +0.30 | This combines deployment caution with stronger human-compatible safety evidence. |
| X06 | Open competition and anti-centralized control | +0.75 | -0.25 | Openness pushes toward diffusion/building; the anti-control language overlaps slightly with decentralist or anti-human-institution instincts. |
| Y01 | Democratic goal selection and human sovereignty | -0.15 | +1.00 | The main signal is human-centered legitimacy; democratic governance also mildly resists unchecked acceleration. |
| Y02 | Anti-finalizing-current-preferences and advanced value | +0.15 | -1.00 | The main signal is posthuman or intelligence-centered value; it weakly favors moving beyond current governance constraints. |
| Y03 | Dignity, agency, and control | -0.10 | +1.00 | This is a pure human-centered item, with a small cautionary implication for automation. |
| Y04 | Long-run intelligence growth over institutions | +0.25 | -1.00 | This strongly discounts current human institutions and also tilts toward acceleration. |
| Y05 | Rights, opportunities, and accountable human authority | -0.15 | +1.00 | This anchors human accountability and mildly supports governance before deployment. |
| Y06 | AI judgment priority over low-quality human judgment | +0.20 | -1.00 | This strongly shifts toward compute/intelligence authority and mildly toward deployment or delegation. |

## Current Design Implications

- The center should no longer collapse as easily into `NORM`, because final self-placement and scenario choices can break central ties.
- Contradictory answer patterns are allowed. The quiz should not pretend they are measurement errors.
- Left-bottom answers are especially unstable: they combine strong governance caution with anti-human-centered value assumptions. Because there is no active meme type for that quadrant, scenario and self-placement evidence should dominate classification there.
- If this becomes a research instrument, the next step is not more clever hand weighting. The next step is a pilot dataset, item-total checks, factor analysis with oblique rotation, and item revisions based on observed cross-loadings.
