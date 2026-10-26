---
title: "Module 3: Questions, wait time and errors"
parent: Modules
nav_order: 3
description: The heart of tutor skill — the probing question, the hint ladder (levels 0–5), wait time, and how to respond to errors without taking over. About 25 minutes.
---

# Module 3 · Questions, wait time and errors

{: .label .label-green }
About 25 minutes · Competency domain: **Questioning and errors** · [competency model](https://github.com/iwyusdaz/tutor-training-course/blob/main/research/competency-model.md)

## Objective

By the end of this module you can: **given a student's incorrect step, respond with a probing question that leads the student to find and fix the error themselves** — without stating the correction, naming the misconception, or answering for the student during the pause. (Behaviors Q1–Q6; scored in [rubric Domain 3](../coaching/observation-rubric.md); the same moves the [Socratic AI Tutor](https://iwyusdaz.github.io/socratic-ai-tutor/) encodes as testable rules.)

## Scenario hook: three responses to one error

A student writes on her paper: `2(x − 4) = 2x − 4`. Three tutors, three responses:

> **Tutor A:** "You forgot to distribute — it should be 2x − 8. Fix that."
>
> **Tutor B:** "Hmm, look at the left side again. What's 2 times −4?"
>
> **Tutor C:** *(4 seconds of silence)* "What did the 2 multiply?"

Tutor A fixed the math and taught nothing — next week the same error returns. Tutor B exposed the exact spot but answered within the student's thinking pause. Tutor C asked the same question **and then waited**. The difference between A, B and C is the entire content of this module.

## Key idea: three habits that keep the student thinking

**1. Open with a probing question — Level 0 of the [hint ladder](https://github.com/iwyusdaz/socratic-ai-tutor/blob/main/spec/hint-ladder.md) (shared vocabulary with the [Socratic AI Tutor](https://iwyusdaz.github.io/socratic-ai-tutor/)).** Before any explaining: "What have you tried?" or "Talk me through your first step." The student's attempt is the diagnosis: it shows you *which* misconception is operating (the [exit-ticket bank](../tools/exit-ticket-bank.md) tags every item with one — applying an operation to only one side · sign errors when moving terms · distributing incorrectly · dividing only some terms · equals sign treated as "the answer comes next"; the M1–M5 definitions live in the [evidence notes](https://github.com/iwyusdaz/tutor-training-course/blob/main/research/evidence-notes.md)).

**2. Escalate one rung per turn.** Never two hints in one breath, never a rung-skipping jump to "here's what you do":

| Ladder level | What it sounds like | When |
|---|---|---|
| L0 · probing question | "What have you tried?" | Every fresh problem |
| L1 · conceptual nudge | "What does the equals sign tell you about the two sides?" | Attempt made, misconception suspected |
| L2 · strategy hint | "The 2 is multiplying everything in the parentheses — what does that mean?" | L1 didn't unblock |
| L3 · partial step | "Subtract 5 from both sides. What do you get?" | L2 didn't unblock |
| L4 · worked example after repeated failure | "Let me show you one like it, all the way through — watch the parentheses step." | Same step failed ~3 times |
| L5 · full solution + a new problem | Last resort. Always followed by a fresh problem to try | L4 exhausted |

**3. Wait time: 3–5 seconds of silence after a question.** Silence feels long to the adult and short to the thinker. The failure mode that kills this move is *answering for the student* — rephrasing your question into a giveaway, or filling the pause with "so, the 2, right?" Count silently. If the student truly can't start, that's information: go down a ladder rung, not up the volume.

**On errors, one more rule:** expose, don't correct. Name the *spot*, never the *label*. "What did the 2 multiply?" is a question the student can act on. "You forgot to distribute" is a verdict the student can only receive. Self-found fixes stick; received fixes don't.

## Model: the ladder in live motion

Verbatim excerpt from [Transcript T3](../transcripts/t3.md) (**fictional, constructed for training**). Jayla has solved `5x + 7 = 2x + 19` (x = 4) correctly, but her check came out unequal:

> **Diego:** *(three seconds — real wait time)* And check it?
>
> **Jayla:** 3(4) + 7 = 19. And 2(4) + 19 = 27… that's not equal?
>
> **Diego:** Right, so where's the mismatch — left side or right? [probing question at the exact spot]
>
> **Jayla:** The right side. I moved the 19 over but… oh. I subtracted 2x on the left but not the right?
>
> **Diego:** There it is. What does the equals sign promise? [conceptual nudge — L1]
>
> **Jayla:** Both sides stay equal. So I needed `2x` gone from both… [she names her own error]

**What to notice:** the tutor never states the correction — one question at the spot of the error, one conceptual nudge, and Jayla names her own mistake. Diego's largest contribution is the silence before "And check it?". (The session later wobbles — annotation 7 has Diego computing *for* her — which is exactly the habit this module trains against; the transcript keeps that in on purpose.)

## Practice with feedback

**Your turn — three written responses.** Write your first line to each student (aim: a probing question at the exact spot, no corrections):

1. Luis writes `x − 4 = 10 → x = 6`.
2. Amara writes `2(x − 4) = 2x − 4` (again — second time this week).
3. Mei writes `4x = 12 → x = 12` (divided the left side only).

{: .feedback }
**Strong responses** (any probing question that exposes the specific spot earns full credit):
1. "You moved the 4 — where did it start, and what happened to its sign when it crossed?" *(exposes sign error when moving terms)*
2. "You caught this yesterday too — let's slow down: what does the 2 multiply? Say both of them out loud." *(exposes the distribution; referencing the recurrence is specific, not shaming)*
3. "You divided the 4x — what did you divide on the other side… and what does the equals sign promise?" *(exposes dividing only some terms via the balance idea)*
**Weak responses** to avoid: "Check your sign" (no handle), "You forgot to distribute" (names the label — the misconception does the learning, not the student), "Almost! Try again" (no direction, no wait).

Then try the [spot-the-move practice](../transcripts/practice/index.html) — ten exchanges, you name the move and whether it worked. This is also the pre-task used in the [pilot protocol](https://github.com/iwyusdaz/tutor-training-course/blob/main/evaluation/human-protocol/pilot-protocol.md) for measuring your own growth.

## In your next session, try…

1. Pick **one** recurring error in your group. Write its probing question on your session plan before the session ([template](../tools/session-plan-template.md)).
2. Count your pauses: aim for at least three 3–5 second waits. Tick each on your plan.
3. If a student fails the same step three times: stop hinting, work a *similar* problem fully (L4), then hand them back their own problem.

## Reflection

In the [tutor self-reflection form](../tools/tutor-self-reflection.md): *When did I last answer my own question? What was I afraid would happen if I stayed quiet?*

## Check yourself

- Student: "Just tell me if it's 4." You say: ? *(A guess is data, not an answer: "Let's test it — substitute 4 back in. What does the left side give you?")*
- When is it right to hand over a partial step (L3)? *(After L1–L2 have failed on that step — the mechanical part unblocks; the arithmetic stays with the student.)*
- After a correct answer, why ask "why" once and then move on? *(Self-explanation at the moment of success is where the learning consolidates — but endless interrogation teaches students that being right earns more pressure.)*
