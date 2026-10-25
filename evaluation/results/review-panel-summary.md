# Transcript-realism review panel — results summary

Generated: not yet run · Method: **AI review panel** (MODEL_B, MODEL_C; MODEL_A optional third voice — slots configured in `.env`) · Planned: 6 fictional transcripts × 4 realism criteria (C1–C4).

> **Limitation (always stated):** panel models may share the underlying model that drafted the transcripts; they are not human experts, and this is not educator or practitioner feedback. A realism review can find inconsistency with the cited misconception research; it cannot certify that real classrooms sound like this.

## Verdicts per transcript

| Transcript | MODEL_B | MODEL_C |
|---|---|---|
| t1.md | PENDING: requires API key | PENDING: requires API key |
| t2.md | PENDING: requires API key | PENDING: requires API key |
| t3.md | PENDING: requires API key | PENDING: requires API key |
| t4.md | PENDING: requires API key | PENDING: requires API key |
| t5.md | PENDING: requires API key | PENDING: requires API key |
| t6.md | PENDING: requires API key | PENDING: requires API key |

## Agreement on verdicts

| Pair | n | % agreement | Cohen's kappa |
|---|---|---|---|
| MODEL_B vs MODEL_C | PENDING: requires API key | PENDING: requires API key | PENDING: requires API key |

## Matched findings (edits proposed by more than one reviewer)

A finding counts as matched when two reviewers propose edits on the same transcript with tolerant text overlap (≥ 0.3 token overlap). PENDING: requires API key.

## How to read this

- Verdicts use the [realism-review form](../human-protocol/realism-review-form.md)'s scale: pass / pass-with-edits / needs-rework.
- Agreement is a consistency signal between two AI reviewers, not inter-rater reliability against humans; the practitioner review (human) remains the real validation and is prepared in [evaluation/human-protocol/](../human-protocol/).
- Raw prompts and responses are saved in evaluation/output/review-panel/ on a real run for audit (gitignored).
