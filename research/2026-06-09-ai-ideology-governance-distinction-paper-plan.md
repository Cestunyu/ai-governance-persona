# AI Ideology as a Distinction Paper Inside AI Governance

Date: 2026-06-09

## Core Reframe

This project should be framed less as a generic "AI ideology quiz" and more as a distinction article inside AI governance:

> AI governance debates are not only disagreements over particular policies. They are disagreements over risk models, authority, openness, evidence standards, human accountability, and the moral status of intelligence growth. The paper's contribution is to make those distinctions explicit and measurable.

The current strongest version is not "we discovered ten true AI tribes." It is:

> Existing AI governance and public-opinion work often asks whether people support regulation, trust institutions, or worry about AI. This misses the internal structure of disagreement. We propose a construct map of AI governance ideologies and a pilot instrument for locating positions in that space.

## What Is Still Missing Before This Is an Article

### 1. A sharper dependent object

The article needs to define what "AI ideology" means in a governance context. It should not mean a total worldview or ordinary left-right ideology. It should mean:

- a structured bundle of assumptions about AI risk and opportunity
- a preferred locus of legitimate authority
- a theory of evidence for deployment or restriction
- a view about openness, control, and diffusion
- a view about whether human accountability remains final

This lets the paper avoid sounding like an internet taxonomy and makes it legible to AI governance, political psychology, and science-and-technology studies readers.

### 2. A clean gap in the literature

The paper should position itself against four nearby literatures:

- AI governance research agendas and advanced AI governance maps: strong on actors, policy levers, strategic problems, and institutional proposals, weaker on respondent-level ideology structure.
- Public attitude surveys: strong on trust, regulation, perceived benefit/risk, and application contexts, weaker on the internal structure of governance disagreement.
- AI ethics / safety discourse mapping: strong on narrative clusters and public frames, but usually not built as a reusable closed-ended measurement instrument.
- Political-psychology typologies and value surveys: strong method analogues, but not AI-specific.

The article's gap:

> We lack a compact measurement framework that distinguishes AI governance positions by their underlying risk model, authority model, openness model, and human-accountability model.

Useful anchors:

- Dafoe, "AI Governance: A Research Agenda" / Oxford Handbook chapter: governance as norms and institutions shaping how AI is built and deployed.
- Zhang and Dafoe, "U.S. Public Opinion on the Governance of Artificial Intelligence": public trust and governance challenges.
- Schiff et al., "What governs attitudes toward artificial intelligence adoption and governance?": perceived benefit and cultural values across six applications.
- Dreksler et al. / AI SHARE: public opinion is multifaceted and dynamic.
- AOI discourse mapping: AI safety/ethics discourse contains multiple overlapping perspectives.
- CSET "Contending Frames": public AI discourse is shaped by frames such as competition, killer robots, economic gold rush, and world without work.

### 3. A theory section that separates dimensions from profiles

The current project already has a good measurement insight: high-dimensional response vectors are primary, and the two-axis map is a projection. The article should foreground this.

Recommended theory dimensions:

1. Risk model: extinction / loss-of-control risk vs present social harm vs hype skepticism.
2. Opportunity model: delay as caution vs delay as lost welfare, abundance, or intelligence growth.
3. Governance authority: democratic accountability, expert/professional control, market/user selection, or posthuman/intelligence-centered authority.
4. Openness and diffusion: licensed frontier control, regulated access, participatory oversight, or permissionless building.
5. Evidence standard: lab evals, staged rollout, affected-community audit, real-world iteration, or scaling/search/compute evidence.
6. Human finality: current human rights/preferences as final vs revisable value exploration vs nonhuman/posthuman intelligence priority.

Profiles should then be treated as named regions in this space, not primitive categories.

## Article Shape

### Version A: Conceptual Essay + Pilot Instrument

Best for a first article.

1. AI governance disagreement is not one-dimensional.
2. Existing debates collapse distinct positions: safety, ethics, normal technology, open acceleration, compute-centered empiricism, techno-optimism, and posthuman acceleration.
3. Define the construct space.
4. Present the pilot questionnaire as a measurement proof of concept.
5. Use 10-20 friendly pilot responses only as illustration, not validation.
6. End with a validation agenda.

### Version B: Measurement Paper

Only after pilot data.

Needs:

- sample and recruitment plan
- item distributions
- profile stability
- clustering or latent class analysis
- reliability only for constructs with enough items
- Chinese/English measurement invariance if using both languages
- transparent limitations

### Version C: Public Essay

Could be written now.

The public essay argument:

> AI governance is often framed as regulation vs innovation or safety vs acceleration. That is too coarse. The real disagreements are about what counts as risk, who gets authority, what evidence counts, whether openness is safety or danger, and whether human judgment remains final.

## Questionnaire Revision Priorities

### Immediate conceptual changes

1. Stop calling `U01` a core scoring item. It is a usage covariate.
2. Treat scenarios and self-positioning as diagnostics / confidence evidence, not core measurement.
3. Keep the meme profile layer clearly downstream from the measurement layer.
4. Add or revise items based on construct gaps, not because the quiz "needs more types."

### Highest-value item changes

1. Add a GPUC / computation-epistemology item.

Purpose: separate Bitter Lesson / scaling empiricism from generic optimism and e/acc.

Example construct:

> When experts disagree with what scaling, search, and large-scale experiments show, which should receive more weight?

2. Add a STOP vs SAFE threshold item.

Purpose: separate pause/stop logic from controlled-progress governance.

Example construct:

> If a frontier system crosses a dangerous capability threshold, should development pause broadly, or continue only inside licensed institutions with evals and restricted deployment?

3. Add a NORM vs BOOM item.

Purpose: separate normal-technology pragmatism from broad deployment optimism.

Example construct:

> Should AI be governed mostly sector by sector after evidence accumulates, or should society accept faster deployment because productivity gains are urgent?

4. Add a SING vs POST item.

Purpose: separate human flourishing / merger / abundance from technocapital or nonhuman autonomy.

Example construct:

> If advanced intelligence pushes society beyond current human values, is the goal human empowerment and abundance, or is exceeding human social control itself acceptable?

5. Add a hype-skeptic scenario.

Purpose: test capability skepticism in a concrete setting rather than only in abstract agreement.

Example construct:

> A benchmark result looks spectacular, but real-world failure modes are unclear. Do you treat this as evidence for rapid deployment, cautious pilots, or likely overclaiming?

### Items to rewrite before broad pilot

- `C02`: currently bundles licensing, audit, rights, social harms, openness, and hype skepticism. Split or rewrite into cleaner mechanism choices.
- `C03`: separates openness and control, but mixes public participation, open source, institutional access, and labor harm. Make the core tradeoff cleaner.
- `H01`: too many authority sources in one item: market, expert, public, posthuman judgment. Rewrite as "who has final veto authority?"
- `H03` and `H04`: important but abstract; make at least one of them a more concrete authority-conflict scenario.

## Minimal Next Draft Package

Before writing the full article, create:

1. A one-page argument memo:
   - claim
   - gap
   - contribution
   - audience
   - evidence standard

2. A construct table:
   - construct
   - definition
   - current items
   - missing item
   - profiles it separates

3. A revised questionnaire v2:
   - 11 or 12 scoring core items
   - `U01` as metadata
   - 3 or 4 scenarios
   - self-positioning as non-core diagnostic

4. A pilot analysis plan:
   - answer-vector export
   - profile margin/confidence
   - item distribution
   - scenario agreement
   - self-positioning mismatch
   - simple clustering after enough responses

## Provisional Verdict

This can become an article, but only if the claim moves from "there are ten AI ideologies" to:

> AI governance contains recurring ideological distinctions that current regulation-vs-innovation and safety-vs-ethics framings obscure. A useful map must distinguish risk model, authority model, openness model, evidence standard, and human-accountability commitment.

The questionnaire should be revised to serve that claim. The most important next move is not polishing profile names; it is improving the constructs that separate GPUC, NORM/BOOM, STOP/SAFE, and SING/POST.
