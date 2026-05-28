# AI Narrative Clustering Source Map

Date: 2026-05-28
Purpose: external evidence for improving the AI Ideology Quiz without increasing question count.

## Why This Matters

The quiz should not be justified only by internal intuition. External discourse-mapping work shows that AI attitudes form multiple overlapping narratives: present harm, democratic oversight, control difficulty, rapid-development danger, abundance, competition, labor disruption, authenticity/trust breakdown, and posthuman/intelligence-centered futures.

This supports a three-layer quiz architecture:

1. position score
2. scenario consistency
3. self-confirmation / narrative identity

## External Clustering And Narrative-Mapping Examples

### AI Objectives Institute / Talk to the City

Source: https://ai.objectives.institute/blog/mapping-the-discourse-on-ai-safety-amp-ethics

Method:

- seed population of AI-and-society Twitter accounts
- relevance filtering with GPT-4
- UMAP dimensionality reduction
- HDBSCAN clustering
- GPT-4 cluster labels plus manual relabeling

Reported perspectives:

- ethical approaches to current harms
- AI is inscrutable and difficult to control
- calls for independent and democratic oversight
- dangers of rapid development
- human interests are hard to formalize
- optimistic AI futures

Relevance to quiz:

- The project's `AUDT`, `SAFE`, `STOP`, and `BOOM/SING` families have external analogues.
- The categories are not mutually exclusive; AOI explicitly describes overlap and the need for multi-threaded discourse.
- Scenario answers should therefore be treated as conditional evidence rather than hard type assignment.

### Reddit AI Safety Discourse 2026

Source: https://github.com/kelukes/reddit-ai-safety-discourse-2026

Method:

- 6,374 Reddit posts from a 30-day window
- sentence embeddings using `paraphrase-multilingual-MiniLM-L12-v2`
- UMAP reduction
- HDBSCAN clustering
- RoBERTa sentiment
- human-first discourse framing with blind local LLM comparison and human adjudication

Reported findings:

- 24 interpretable discourse clusters
- discourse is not simply pro-AI vs anti-AI
- strong negativity centers on lived disruption: synthetic-content trust collapse, job insecurity, school/work harms, lab trust, and creative displacement
- abstract x-risk is only one part of the discourse

Relevance to quiz:

- Present-harm and trust/authenticity narratives should remain visible.
- `AUDT`, `SKEP`, and `NORM` should not be treated as filler middle types.
- Short-form quiz classification should report confidence because a few items cannot fully separate all these public frames.

### AI Ethics Twitter Narrative Mapping

Source: https://www.nature.com/articles/s41599-025-04469-9

Method:

- 539,743 AI ethics tweets from 2015-2022
- hashtag-based corpus construction
- hierarchical topic structure
- semantic similarity with `all-MiniLM-L6-V2`
- narrative visualization and topic evolution

Reported structure:

- seven top-level topics:
  - legal and ethical
  - society and culture
  - technology
  - science and research
  - health and safety
  - education and learning
  - business and economics
- 64 fine-grained topics
- long-tail distribution: major legal/ethical head plus many smaller but meaningful topics

Relevance to quiz:

- A two-axis map is useful as a public projection, but the underlying narrative space is long-tailed.
- The quiz should avoid claiming that the profile taxonomy exhausts AI ideology.
- Scenario and self-confirmation layers help capture long-tail and hybrid responses.

### CSET Contending Frames

Source: https://cset.georgetown.edu/publication/contending-frames/

Method:

- searches more than seven million LexisNexis articles from 2012-2020
- compares four rhetorical frames:
  - AI Competition
  - Killer Robots
  - Economic Gold Rush
  - World Without Work

Reported findings:

- competition frame predominates
- economic opportunity frame peaks later than threat frames
- narratives shape public perception and policy space

Relevance to quiz:

- Some AI "ideologies" are media/policy frames rather than stable psychological types.
- The quiz should describe its result as stance/profile, not a deep personality diagnosis.

### Public And Expert AI Opinion

Source: https://www.pewresearch.org/internet/2025/04/03/how-the-us-public-and-ai-experts-view-artificial-intelligence/

Method:

- survey of U.S. adults
- survey of AI experts
- in-depth expert interviews

Relevance to quiz:

- Expertise/familiarity can change AI attitudes.
- Future pilot analysis should include familiarity/exposure as moderators.
- The current production quiz omits background items for simplicity, so interpretation should be cautious.

## Methodological Takeaways

1. **Use clustering as an external validity check, not as the whole method.**
   Clustering finds discourse structure, but label assignment still requires human judgment.

2. **Separate topic, frame, sentiment, and normative position.**
   Two people can discuss job loss with different frames: macro labor replacement, personal job-search friction, or institutional transition.

3. **Do not force one hard label.**
   AI narratives are overlapping. The quiz should return a profile plus confidence and mismatch notes.

4. **Use text embeddings after pilot collection.**
   If open-ended explanations are later added, embed full respondent explanations, not isolated keywords.

5. **Keep the current short quiz honest.**
   It can be a transparent pilot locator. It should not claim validated psychometric taxonomy.

## How This Changes The Current Quiz

No new questions are required. Instead:

- position answers keep the coordinate
- scenarios test conditional tradeoffs
- self-confirmation checks narrative identity
- confidence reports whether those three sources agree

This is the minimum scientifically defensible improvement under the current item-count constraint.
