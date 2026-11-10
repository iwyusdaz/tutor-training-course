# Transcript-realism review: results summary

Run: 2026-11-11 · Method: **agent review, single model** · One AI agent (Claude, the Kiro build agent) re-reviewed all six fictional transcripts inside the build environment. No API key and no external model service was used. Criteria C1 to C4 and the verdict scale come from the [realism-review form](../human-protocol/realism-review-form.md); the misconception reference is M1 to M5 from the companion repo's misconception bank (the same reference the earlier passes used). Every algebra line was re-derived.

> **Limitation (always stated):** this is one AI reviewer, not a panel, and not human, educator or practitioner feedback. It may share the underlying model family with the agent that drafted the transcripts and with the two earlier agent passes. The planned design (two or more different models reviewing independently, with agreement reported) was **not reproduced**, so no agreement statistic exists. A realism review can find inconsistency with the cited misconception research; it cannot certify that real classrooms sound like this.

## Verdicts per transcript

| Transcript | C1 misconception match | C2 response plausibility | C3 pacing | C4 representation | Verdict |
|---|---|---|---|---|---|
| T1 strong | pass | pass, with note 1 | pass | pass | **pass** |
| T2 strong | pass | **fail** (note 2) | pass | pass | **needs-rework** (one exchange) |
| T3 mixed | **fail as labeled** (note 3) | pass | pass | pass | **pass-with-edits** |
| T4 mixed | pass, with note 4 | pass | pass, with note 5 | pass | **pass-with-edits** |
| T5 weak | pass, with note 6 | pass | pass | pass | **pass-with-edits** (minor) |
| T6 weak | pass, with note 7 | pass | pass | pass | **pass-with-edits** (minor) |

Compared with the 2026-10-26 fresh-context pass ([agent-review.md §6](../agent-review.md)): this pass agrees on T1, T5 and T6 overall, and on the T4 pacing gap. It newly finds the T2 repair error (note 2), which the earlier pass rated C1/C2 pass. On T3 the revision round replaced the header's M4 label with M1, but this pass finds that M1 is never actually committed in the dialogue (note 3).

## Notes and proposed edits

1. **T1 [10]:** Luis justifies "plus 5" with "the sign flips because we're subtracting minus 5", which is the memorized flip rule, and Nina replies "You kept both sides balanced". The praise names a process Luis did not state. Realistic, but a level-4 anchor should have Nina ask once more ("plus 5 to which sides?") or praise what he actually said.
2. **T2 [5] and [6] (the important one):** Tomás has written `7x − 4 = 3x + 8 → 7x + 4 = 3x + 8` (a correct M2 depiction). Grace asks what operation "moving the −4" really is. The right answer is *adding* 4 to both sides. Tomás answers "subtracting", subtracts 4 from both sides and gets `7x − 8 = 3x + 4`. That line is valid algebra, but it does not remove the −4; it doubles it. Grace then has him "say that last part again for the group", and annotation [5] states the goal as reconnecting "moving" to "subtracting". So the strong calibration anchor broadcasts a wrong repair and the annotation endorses it. **Edit:** Tomás should arrive at "add 4 to both sides: `7x = 3x + 12`", and annotation [5] should say "moving a −4 means adding 4 to both sides".
3. **T3 header and [5]:** the header lists M1 as in play, and annotation [5] says "Jayla applied the operation to one side only, the canonical M1 pattern", while [6] and [8] establish that her solve was correct and only her check was wrong. M1 appears only as Jayla's mistaken self-diagnosis, which Diego confirms with "There it is." [Module 3](../../docs/modules/3-questions-wait-time-and-errors.md)'s "Model" section quotes this exchange and says Jayla "names her own mistake", which repeats the problem. **Edit:** relabel the header and [5] as a wrong self-diagnosis (and flag Diego's "There it is" as a missed probe), and update Module 3's "What to notice" to match. The dialogue itself is a realistic near-miss and can stay.
4. **T4 [2] and [3]:** Marcus says the missed ticket item "was the `= 7` one. Answer was 2", and Andre says he "had `x + 4 = 7`". `x + 4 = 7` gives 3, not 2. If Andre's line is his rewrite of a different item, the transcript does not say so. **Edit:** name the ticket item (for example `2x + 3 = 7`) or fix the answer.
5. **T4 pacing:** 0:16 to 0:25 shows only four exchanges for nine minutes (also noted on 2026-10-26). Add one line of stage direction for the missing time.
6. **T5 [4]:** the annotation says "we don't know *why* she wrote it", but in the dialogue Nadia writes `2(x − 4) = 2x − 4` and asks Imani to judge it; Imani only agrees. **Edit:** "why she accepted it".
7. **T6 [3]:** Aaliyah reports x = 2, but the bug Felix names (`3x + 2 = 10`) leads to `3x = 8`, not x = 2. Students do stack errors, but none is shown. **Edit:** change her reported answer to match the named bug, or show the second slip.

## How to read this

- Verdicts use the realism-review form's scale: pass / pass-with-edits / needs-rework.
- These are proposed edits only. None has been applied to the transcripts or modules yet; accepted edits will be recorded in [`CHANGELOG.md`](../../CHANGELOG.md).
- The real validation is still a practitioner (tutor or teacher) review, prepared in the [human protocol](../human-protocol/realism-review-form.md) and not yet run.
