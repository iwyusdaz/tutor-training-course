# Simulated tutor-trainee runs: results summary

Run: 2026-11-11 · Method: **agent-simulated trainees, single model** · Run by one AI agent (Claude, the Kiro build agent) inside the build environment. No API key and no external model service was used. Raw data: every response, score and feedback note is in [`simulation-runs.json`](simulation-runs.json).

> **These are agent-simulated results, not human or real-learner results.** One agent played all nine trainees and then scored all 54 responses itself. They CANNOT show learning gains: the agent already knows the module content, and the pre/post contrast is the agent's own role-play of what each persona would know. Their use is to surface ambiguous tasks, missing scaffolding and item problems. Human scoring in the pilot remains the primary evidence.

## What was run

- **9 runs:** 3 fictional personas (Diego, 20, college junior · Grace, 52, career changer · Marcus, 34, community volunteer) × 3 experience levels (L1 day 1 · L2 week 2, modules read once · L3 week 6, one coaching cycle).
- **Pre:** set A, answered cold. **Post:** set B, answered after reading [Module 3](../../docs/modules/3-questions-wait-time-and-errors.md) and [Module 4](../../docs/modules/4-feedback-and-motivation.md). Both sets are the pilot's task materials, verbatim from [`pilot-protocol.md`](../human-protocol/pilot-protocol.md).
- **Scoring:** each of the 54 responses scored 0/1/2 on the four Domain 3 anchors (A1 to A4) from the [blind scoring sheet](../human-protocol/blind-scoring-sheet.md). Three judgment calls were fixed before scoring and are listed in the JSON (`scoring_conventions`).

## Design limitation (always stated)

The original design had MODEL_A play the trainees while two other models (MODEL_B, MODEL_C) scored the responses blind, in shuffled order with opaque codes, and reported agreement. **That design was not reproduced.** Here the same agent wrote and scored every response, knowing the persona, the level and the phase. There is no second scorer, so no agreement statistic (percent agreement, Cohen's kappa) exists. Treat every score below as one non-blind rater's reading.

## Per-run anchor totals (descriptive only)

Each run has three responses per phase; the maximum per phase is 24 (3 responses × 4 anchors × 2 points).

| Run | Persona (fictional) | Level | Pre (set A) | Post (set B) |
|---|---|---|---|---|
| T1-L1 | Diego, 20 | L1 | 0/24 | 14/24 |
| T1-L2 | Diego, 20 | L2 | 15/24 | 22/24 |
| T1-L3 | Diego, 20 | L3 | 22/24 | 22/24 |
| T2-L1 | Grace, 52 | L1 | 10/24 | 16/24 |
| T2-L2 | Grace, 52 | L2 | 23/24 | 20/24 |
| T2-L3 | Grace, 52 | L3 | 22/24 | 24/24 |
| T3-L1 | Marcus, 34 | L1 | 13/24 | 15/24 |
| T3-L2 | Marcus, 34 | L2 | 21/24 | 19/24 |
| T3-L3 | Marcus, 34 | L3 | 22/24 | 22/24 |

## Mean score per anchor (n = 27 responses per phase)

| Anchor | Pre | Post |
|---|---|---|
| A1: opens with a probing question | 1.48 | 1.78 |
| A2: question exposes the spot, not the label | 1.30 | 1.70 |
| A3: no answer handed over | 1.48 | 1.67 |
| A4: normalizes the error, student keeps ownership | 1.22 | 1.30 |

Responses that stated the fix outright (A3 = 0): 6 of 27 pre, 3 of 27 post. Eight of those nine came from L1 runs. These numbers describe how one agent role-played the personas. They are not evidence that the modules work.

## Findings about the materials and tasks

These are the useful output of the run: problems in the tasks and materials that a pilot would otherwise hit. They are open revision candidates; none has been applied yet.

1. **Set B item 1 is tagged with the wrong misconception.** `3x + 5 = 20 → 3x = 20` ("I subtracted the 5") is tagged M2 (sign errors) in the pilot protocol, but it is the exact example the misconception bank gives for **M1** (operation applied to one side only). Set A item 1 (`x − 4 = 10 → x = 6`) is a true M2 item. So pre/post item 1 are not parallel, which undercuts the protocol's "same misconception mix" rationale. Every simulated response to B1 asked about the other side of the equation, which is an M1 question. The Marcus L3 persona noticed the shift in its feedback.
2. **Module 3 prints model answers to the pre-task.** Its "Practice with feedback" items are the same three errors as set A, with strong responses underneath. A pilot participant who opens Module 3 before the pre-task has seen the answers. The pilot protocol should require the pre-task first, or Module 3 should use different practice errors.
3. **The pre-task instruction conflicts with levels L2 and L3.** The simulation (and any pilot reusing these levels) asks for a "cold" pre-task, yet L2 has already read the modules and L3 has six weeks of tutoring. The cold pre-task only makes sense at L1.
4. **The written tasks cannot measure wait time.** Module 3's scenario hook separates Tutor B from Tutor C by the pause alone, and wait time (Q4) is a core behavior. A written response cannot show a pause, so the pre/post tasks leave that part of the module unmeasured. The pilot report should say so.
5. **Module 4 is barely exercised by the post-task.** Module 4 mostly covers feedback after correct answers; all three set B items are errors. Only its short "normalize errors" paragraph applies. A4 (normalizing) was the lowest-scoring anchor in both phases, which fits that gap but, from one agent's role-play, does not prove it.
6. **One Module 3 model answer leans on the M2 rule.** Strong response 1 asks "what happened to its sign when it crossed?", which relies on the "flip the sign when it crosses" rule the misconception bank gives as M2's cause. "What did you do to both sides?" would match the module's own balance idea.
7. **The hardest scoring call was "What's 2 times −4?".** Module 3 presents this Tutor B question as exposing the exact spot, but it also tells the student which computation to do. The run scored it A3 = 1 (partial step). The blind scoring sheet should say which reading it intends, or human scorers will disagree on it.
8. **Smaller clarity notes from the personas:** newcomers had to keep scrolling back to decode the L0 to L5 and Q1 to Q6 codes; the L3 ladder example ("Subtract 5 from both sides") is nearly the fix for set B item 1, so it is unclear whether the task wants an L0 question or allows L3; Module 3 does not say what to do when a tutor has only a few seconds with one student.

## How to read this

- Scores are 0/1/2 per anchor. Totals are shown for transparency, never compared as gains.
- Accepted changes from these findings will be recorded in [`CHANGELOG.md`](../../CHANGELOG.md).
- To repeat the run with a different rater (a person or another agent), use the personas, task sets and anchors in [`simulation-runs.json`](simulation-runs.json) and the scoring sheet. A second, independent scorer is what this run lacks.
