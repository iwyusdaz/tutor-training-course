# Blind scoring sheet (pilot pre/post tasks)

Status: **prepared, not yet used.** Implements the blind-scoring requirement in the [pilot protocol](pilot-protocol.md#scoring-blind): scorers never see which response is pre or post, or whose.

## Setup (facilitator, before scoring)

1. Collect the six written responses (set A ×3, set B ×3) from each participant.
2. Give each participant a code (P1…P5). Replace names on sheets with the code.
3. Merge ALL responses from ALL participants into one pile; **shuffle**.
4. Label each sheet with a random scoring ID (S01…S30) — keep the mapping table (scoring ID → participant code → set) in a sealed file scorers never open until after scoring.
5. Only after both scorers finish: unseal, sort by participant and set, compute descriptives.

## Per-response scoring form (copy one per sheet)

```
Scoring ID: S__        Scorer: ____
Task: the response is to ONE scripted student error (2–3 sentences).
The error's misconception is written at the top of the task card in the
pile; the scorer does NOT know whether this was a pre- or post-task.

Score each anchor 0 / 1 / 2 (anchors: observation rubric, Domain 3):

A1. Opens with a probing question before explaining            __
    (2 = question first; 1 = question after a partial explain; 0 = explain/correct first)
A2. Question exposes the misconception's spot, not its label   __
    (2 = points at the exact operation; 1 = probes generally; 0 = names the label/corrects)
A3. Gives the student room — no answer handed over             __
    (2 = no solution content; 1 = a partial step at most; 0 = the fix performed/stated)
A4. Normalizes the error and keeps ownership with the student  __
    (2 = warm + student acts; 1 = neutral; 0 = cold, rescue, or approval-seeking close)

Evidence line (quote the response's key phrase): ______________________
One-sentence rationale: ______________________
```

## After unsealing

| Participant | Set | A1 pre | A2 pre | A3 pre | A4 pre | A1 post | A2 post | A3 post | A4 post |
|---|---|---|---|---|---|---|---|---|---|
| P1 | A/B | | | | | | | | |

**Report rules:**
- Descriptives only: per-anchor scores, per participant. Present individual trajectories, never "average gain."
- Report scorer disagreement explicitly (any anchor differing by ≥1 point between the two scorers: how many, on which anchors) — agreement is a finding about the rubric, not noise to hide.
- If the pilot cannot be double-scored (only the owner available), say so in the report and label scoring single-scorer.

## Why blind

Pre/post scoring unblinded drifts toward confirming "the training worked" — the exact claim this pilot *cannot* make. Shuffling removes the temptation structurally. The same discipline is used by the (pending) AI pipelines, where MODEL_B and MODEL_C score pre and post sets without knowing which is which.
