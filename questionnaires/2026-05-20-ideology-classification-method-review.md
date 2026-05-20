# Ideology Classification Method Review

Last updated: 2026-05-20

This note translates lessons from ideology classification, value surveys, and scale-development practice into design rules for the AI ideology quiz.

## External Benchmarks

### Pew Political Typology

Pew's political typology does not simply place people on a left-right line. The 2021 typology used many questions across substantive dimensions and then grouped respondents with clustering around medoids. This is useful because it treats types as empirical clusters in a high-dimensional response space, not as labels mechanically assigned from one or two items.

Implication for this project:

- Keep the two-axis map as an interpretable front end.
- Treat the meme profiles as provisional labels.
- After pilot data, run clustering on item responses and compare the empirical clusters with `STOP`, `SAFE`, `AUDT`, `NORM`, `GPUC`, `BOOM`, `SING`, `VROM`, and `POST`.

Source: [Pew Research Center, 2021 typology methodology](https://www.pewresearch.org/politics/2021/11/09/political-typology-appendix-b/)

### World Values Survey and the Inglehart-Welzel Map

The World Values Survey cultural map is the closest serious analogue to a two-dimensional ideology/value map. It compresses many survey items into two broad dimensions: traditional vs. secular-rational values, and survival vs. self-expression values. A key lesson is that two-dimensional maps are useful visual summaries, but the dimensions are empirical reductions of many items and can be correlated.

Implication for this project:

- Do not present the AI map as a validated orthogonal coordinate system.
- Report the X/Y correlation once pilot data exists.
- If the two axes are correlated, use oblique factor methods rather than forcing an orthogonal rotation.
- Use the map for interpretation, not as proof that the ideology space has exactly two independent dimensions.

Sources: [World Values Survey findings](https://www.worldvaluessurvey.org/WVSContents.jsp?CMSID=Findings), [World Values Survey 2023 map](https://www.worldvaluessurvey.org/WVSContents.jsp?CMSID=Findings)

### Moral Foundations Questionnaire

The Moral Foundations Questionnaire is a useful model because it does not use one item per moral dimension. It uses multiple items per foundation and distinguishes different modes of response, such as abstract relevance judgments and concrete moral judgments.

Implication for this project:

- Each AI ideology facet should eventually have multiple items, not a single representative question.
- Separate abstract beliefs from applied scenario judgments.
- Do not let one colorful wording carry a whole construct.

Sources: [Moral Foundations questionnaires](https://moralfoundations.org/questionnaires/), [Graham et al. 2011 MFQ paper](https://www.projectimplicit.net/nosek/papers/GNHIKD2011.pdf)

### RWA / SDO Dual-Process Ideology Models

Political psychology often treats ideology as multiple related but distinct motivational dimensions. The dual-process model separates authoritarian/security-cohesion motivation from dominance/hierarchy motivation. These dimensions are often correlated, but the theory still distinguishes them because they express different motivational sources.

Implication for this project:

- It is acceptable if `governance-first` and `human-centered` are correlated.
- The important question is whether they represent different motivational stories:
  - fear of catastrophic or institutional risk
  - concern for human agency and accountability
  - belief in scaling and intelligence growth
  - belief in openness, diffusion, and anti-control
- Classification should tolerate contradictions rather than treating them as invalid answers.

Sources: [Duckitt and Sibley dual-process overview](https://www.researchgate.net/publication/47642855_Personality_Ideology_Prejudice_and_Politics_A_Dual-Process_Motivational_Model), [Scientific Reports 2023 on dual dimensions](https://www.nature.com/articles/s41598-023-31721-6)

### Psychometric Scale Development

Scale-development practice usually separates content validity, structural validity, reliability, cross-cultural validity, and interpretability. A high reliability coefficient alone is not enough; content coverage matters first.

Implication for this project:

- The current quiz is a pilot locator, not a validated scale.
- Before calling it scientific, collect pilot data and inspect:
  - item distributions
  - item-total correlations by facet
  - factor structure with oblique rotation
  - reliability by facet, preferably omega in addition to alpha
  - profile stability under resampling
  - Chinese/English measurement invariance
- Keep a manual explaining what each item is supposed to measure.

Sources: [COSMIN taxonomy of measurement properties](https://www.cosmin.nl/), [COSMIN checklist paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC2852520/), [Scale development limitations and recommendations](https://link.springer.com/article/10.1186/s41155-016-0057-1), [Watkins 2018 EFA best practice](https://journals.sagepub.com/doi/10.1177/0095798418771807)

### Political Compass and Viral Quiz Practice

Two-axis political quizzes are good at communication because users can understand and share a map quickly. But many online ideology quizzes are opaque about item weighting, validation, sampling, and classification rules.

Implication for this project:

- Borrow the simple map and shareability.
- Do not borrow opaque scoring.
- Make the scoring logic inspectable and keep the meme layer separate from the measurement layer.

## Recommended Measurement Architecture

The next serious version should separate four conceptual subscales:

1. **Risk governance**
   - evidence thresholds
   - pause rights
   - evals and liability
   - dangerous capability gates

2. **Deployment orientation**
   - opportunity cost of delay
   - open source and diffusion
   - productivity and abundance
   - anti-overregulation

3. **Human accountability**
   - democratic legitimacy
   - appeal rights
   - dignity and agency
   - accountable human authority

4. **Intelligence centrality**
   - scaling and compute
   - AI judgment over human judgment
   - long-run intelligence growth
   - posthuman or singularity orientation

The public map can still show two axes, but internally the questionnaire should know which subscale each item belongs to. This allows later pilot analysis to decide whether the four subscales collapse into two dimensions or require a richer model.

## Off-Diagonal Items to Add Later

The current quiz needs more items that intentionally break the correlation between axes:

- Pro-deployment but human-centered:
  - "I support rapid AI deployment, but only if humans remain clearly accountable for high-stakes decisions."
- Governance-first but not human-centered:
  - "Even if advanced AI may surpass human values, development should still be slowed until the transition is better understood."
- Social-critical but anti-centralized-control:
  - "I worry about labor and surveillance harms, but I do not trust governments or frontier labs to centralize AI control."
- Safety-focused but pro-open-science:
  - "Frontier models should face strict release thresholds, but safety research and evaluation tools should be widely shared."

## Current Project Rule

For now, the active quiz should be described as:

> a closed pilot locator for AI ideology positions, with transparent hand weights and meme-style profiles.

It should not yet be described as:

> a validated psychological scale or a scientifically proven ideology taxonomy.
