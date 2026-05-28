# AI Ideology Quiz Methodology Critique Under Current Item Count

Date: 2026-05-28
Branch: `codex/ideology-quiz-methodology-revision`
Status: candidate methodology note. This is not the public main methodology yet.

## Constraint

This critique keeps the current quiz shape. It does **not** add more core questions.

The scientific improvement should come from structure:

1. Make the position score more internally consistent.
2. Treat scenarios as behavioral consistency checks, not as extra hidden coordinate items.
3. Treat self-confirmation as convergent-validity evidence, not as the main classifier.
4. Use external AI narrative clustering as a benchmark for whether the project is capturing real discourse frames.

## Current Scientific Weaknesses

### 1. Position Items Mix Constructs

Some current items ask about more than one construct at once. For example, a response can encode capability skepticism, governance preference, and value commitment in a single option. That creates ambiguous score movement:

- "AI may not reach that level soon" is a capability/timeline view, not a human-accountability view.
- "The strongest AI phrase is inflated by hype" is a hype-skeptic view, not necessarily an open-vs-control governance view.
- "AI can outperform humans" is a capability belief, while "AI should replace human judgment" is a normative authority belief.

The fix is not more questions. The fix is to score current answers as evidence for multiple latent signals:

- `risk_salience`
- `opportunity_salience`
- `governance_control`
- `openness_build`
- `human_accountability`
- `intelligence_centrality`
- `capability_skepticism`

The public result can still be two-dimensional.

### 2. Scenarios Are Doing Too Much Classification Work

The scenarios currently add profile evidence directly. That makes the result more entertaining, but weaker scientifically, because scenario choices are conditional tradeoff judgments. They should be interpreted as stability checks:

- Abstract openness plus cyber-release pause means conditional openness, not necessarily profile contradiction.
- Abstract human accountability plus AI-scientist deployment means institution-specific trust, not necessarily posthumanism.
- Abstract anti-regulation plus public-service appeal rights means anti-centralization with rights constraints.

Scenarios should mostly affect tie-breaks and confidence.

### 3. Self-Confirmation Can Overpower Measurement

Self-confirmation is valuable because political identity is partly narrative. But if it carries too much weight, respondents can select an identity statement and override their own item pattern.

Self-confirmation should be used for:

- convergent validity: "does the respondent's narrative match their item pattern?"
- confidence: "is this profile stable or self-conflicted?"
- tie-breaks among nearby profiles

It should not move the coordinate.

### 4. Two-Axis Display Is Useful But Should Not Pretend Orthogonality

External political-science examples show that readable maps are useful, but empirical dimensions often correlate. The World Values Survey map derives broad value dimensions from many survey items, while Pew typology uses many values questions and weighted clustering around medoids rather than assigning identity labels from one or two questions.

For this project, the two-axis map should be described as an interpretive projection:

```text
position layer -> two-axis projection -> profile anchor -> scenario/self consistency report
```

## External AI Narrative Clustering Benchmarks

### AI Objectives Institute / Talk to the City

AOI mapped Twitter conversations about AI safety and ethics using Talk to the City. The workflow filtered tweets for relevance, clustered text content with UMAP and HDBSCAN, and used GPT-4 plus manual relabeling for cluster labels. Their six perspectives were:

1. Ethical approaches to current harms
2. AI is inscrutable and difficult to control
3. Independent and democratic oversight
4. Dangers of rapid development
5. Human interests are hard to formalize
6. Optimistic AI futures

Source: https://ai.objectives.institute/blog/mapping-the-discourse-on-ai-safety-amp-ethics

Implication: our typology should not collapse everything into "doomer vs accelerationist." The existing quiz already has the right narrative families, but scenarios and self-confirmation should preserve overlaps instead of forcing a hard side.

### Reddit AI Safety Discourse Clustering

A 2026 exploratory Reddit analysis used sentence embeddings, UMAP, HDBSCAN, RoBERTa sentiment, and human/LLM discourse framing on 6,374 Reddit posts. It recovered 24 interpretable clusters and concluded that public concern is not dominated by abstract AGI x-risk. Strong negative sentiment concentrated around lived disruption: fake content, trust breakdown, job insecurity, school/work harms, and creative displacement.

Source: https://github.com/kelukes/reddit-ai-safety-discourse-2026

Implication: present-harm and trust/authenticity frames are external clusters, not just internal additions. The current quiz should keep `AUDT`, `SKEP`, and `NORM` as real public-discourse positions, but they need confidence handling because the short core has limited item coverage.

### AI Ethics Twitter Narrative Mapping

Wei, Zhang, and Chen analyze 539,743 AI ethics tweets from 2015-2022 and build a hierarchical topic structure with seven top-level topics and 64 fine-grained topics. They use semantic similarity with sentence-transformer representations to track topic evolution.

Source: https://www.nature.com/articles/s41599-025-04469-9

Implication: public AI ethics discourse is long-tailed. A quiz taxonomy should allow niche and hybrid profiles, not only dominant ideology camps.

### CSET Contending Frames

CSET compares four rhetorical frames in AI media discourse: AI Competition, Killer Robots, Economic Gold Rush, and World Without Work. They show that AI narratives change over time and can shape policy space.

Source: https://cset.georgetown.edu/publication/contending-frames/

Implication: some quiz profiles are policy-response ideologies, while others are media/narrative frames. The result page should not present every profile as a fully coherent political ideology.

## Local Text-Processing Sanity Check

I ran a lightweight local TF-IDF + cosine + hierarchical clustering sanity check on `data/ai-thought-spectrum.json`, using each reference point's stance summary, cluster label, coordinate note, and representative-work rationale.

This is not a validated embedding model, but it is a useful internal consistency test.

Observed pattern:

- X-risk/safety references cluster together: Yudkowsky, Bostrom, Russell, Hendrycks/CAIS, Statement on AI Risk.
- Critical AI and hype-skeptic references sit close in text space because their language overlaps around critique, power, deep-learning limits, and present harms.
- Techno-optimist, pragmatic-optimist, and singularity references cluster around AGI, abundance, scaling, and optimism language.
- Some hand-placed references are semantically hybrid: Christiano is safety but shares "scalable" language with Sutton; Bratton is not open-accelerationist even though he is posthuman/anti-humanist.

Implication: the current profile system is plausible as a narrative map, but final classification should report ambiguity when nearest profile, scenario evidence, and self-confirmation disagree.

## Recommended Structural Model

Use three distinct evidence layers:

```text
Layer 1: Position score
  - estimates x/y coordinates
  - highest weight
  - based only on current core items

Layer 2: Scenario consistency
  - checks whether abstract scores survive concrete tradeoffs
  - light tie-break evidence
  - contributes to confidence, not coordinate

Layer 3: Self-confirmation
  - checks whether respondent narrative matches the item pattern
  - light-to-moderate tie-break evidence
  - strong mismatch lowers confidence
```

## Concrete Branch Changes To Make

Without adding questions:

1. Lower the classifier weight of self-confirmation from strong identity override to tie-break evidence.
2. Lower scenario profile evidence and make it mostly confidence/tie-break evidence.
3. Add a `classificationConfidence` output based on agreement among position, scenario, and self-confirmation.
4. Reword or reinterpret capability-skeptic options so they feed an ability/hype-skeptic narrative rather than contaminating governance/humanism.
5. Document that `AUDT`, `SKEP`, and `NORM` are externally supported discourse frames but weaker short-quiz estimates because the current core has fewer direct present-harm and normal-technology items.

## Validation Plan

After pilot data exists:

1. Run item-response checks on the current core items.
2. Compute self-confirmation agreement rate by profile.
3. Cluster the answer vectors using k-medoids or latent-class analysis.
4. Separately embed optional open-ended explanations and compare text clusters with numeric profiles.
5. Report mismatches as information, not failure. Hybrid respondents are expected in AI discourse.
