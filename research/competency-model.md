# The tutor competency model

**Version 1.0 · 2026-10-25 · LOCKED.** This one model drives the training modules, the annotated transcripts, the spot-the-move practice, the observation rubric and the fidelity metrics. What is trained is what is observed and what is measured. Do not reword domains or behaviors in other documents — link here.

**Context:** Bridge Math Tutoring (fictional) — a nonprofit whose paid part-time tutors (college students and community members) deliver in-school sessions to groups of 2–4 middle schoolers, 3 × 30 minutes per week, in Grade 7–8 linear equations. The move vocabulary is shared with the companion repo [Socratic AI Tutor](https://iwyusdaz.github.io/socratic-ai-tutor/) — [move names and hint ladder](../research/evidence-notes.md#5-the-tutoring-moves-what-to-train-and-observe).

**What counts as "observable":** every behavior below is something a coordinator could see or hear during a 30-minute in-person session, or check in a session log — no inferred mental states, no "builds rapport" language. Each domain has a **core routine** (what consistent looks like) and **failure modes** (what weak sessions actually show — each failure mode appears in the [transcript library](../docs/transcripts/index.md)).

---

## Domain 1 — Relationships

*Students learn more from a tutor who knows them and expects them to succeed. (NSSA's definition of high-impact tutoring is "relationship-based"; see [evidence notes §3](evidence-notes.md).)*

**Observable behaviors:**
- R1. Greets each student by name within the first minute of the session.
- R2. References something from a previous session ("Yesterday you cracked the sign problem on Question 2") at least once.
- R3. Keeps a visible record of each student's exit-ticket results and refers to it (names effort over outcome: "your work on the distributive step got cleaner").
- R4. Distributes attention across all 2–4 students — no student goes unaddressed for the session, and no one dominates.

**Failure modes:** tutor works 1:1 with one student while the others coast; cold open straight into the worksheet; generic "good job" applied to everyone equally.

## Domain 2 — Session structure

*The 30-minute routine is what makes quality repeatable at scale. (NSSA: structured, frequent, consistent sessions.)*

**Observable behaviors:**
- S1. Follows the five-part routine: **warm-up (5') → review of last exit ticket (5') → guided practice (12') → independent try (5') → exit ticket (3')**.
- S2. Starts within 2 minutes of the scheduled start; keeps each block within ±2 minutes of its time box.
- S3. Ends with the exit ticket administered, collected and logged — in every session.
- S4. Uses the [session plan template](../docs/tools/session-plan-template.md) with the week's skill and the targeted misconception written in.

**Failure modes:** no warm-up (start cold), guided practice that swallows the hour, exit ticket skipped when time runs out (the exact behavior that destroys the data loop), running over and cutting the independent try.

## Domain 3 — Questioning and errors

*The student, not the tutor, produces the key steps. This is the domain the companion repo encodes for an AI tutor.*

**Observable behaviors (move names in bold; hint ladder levels 0–5 as defined in [repo 03](https://iwyusdaz.github.io/socratic-ai-tutor/)):**
- Q1. **Opens every problem with a probing question** (hint ladder Level 0): asks the student what they tried or noticed before explaining anything. No unprompted explaining.
- Q2. **Escalates one ladder rung per turn** — conceptual nudge (L1), strategy hint (L2), partial step (L3) — never two rungs or two hints in one exchange.
- Q3. **Responds to an error with a probing question that exposes the misconception** (e.g., for `2(x − 4) = 2x − 4`: "What did the 2 multiply?") rather than correcting it ("you forgot to distribute") — one misconception at a time.
- Q4. **Wait time: pauses 3–5 seconds** after asking a question before speaking again — no answering for the student, no rephrasing the question into a giveaway within the pause.
- Q5. **Worked example after repeated failure:** if a student fails the same step ~3 times, works a *similar* problem fully (L4) instead of continuing to hint or handing over the solution.
- Q6. **Uses the full solution (L5) only as a last resort** — after L1–L4 have failed — and follows it with a fresh problem.

**Failure modes:** over-explaining (the tutor's solution monologue), answering for the student during the pause, naming the misconception instead of exposing it ("that's the distributive property error"), skipping rungs straight to "here's what you do".

## Domain 4 — Feedback and motivation

*Feedback at the process level; mistakes treated as normal and useful.*

**Observable behaviors:**
- F1. **Specific feedback:** names *what in the student's work* was right ("you moved the −4 to the other side and flipped its sign correctly") rather than generic praise ("great job"). No "good job" left standing alone.
- F2. **Normalizes mistakes** when errors surface ("that's exactly the trap in this problem — let's look at it") — no sighs, no "again?", no rescue before the student has worked.
- F3. **Confirm and ask why** after a correct answer: confirms briefly ("that's right — x = 5"), then asks the student to explain why it works. One why-question, then moves on.
- F4. **Offer a similar problem** after a solved problem, with one small variation, so the student proves the fix transfers.
- F5. Sets one small goal per session with the student ("today: keep the balance when you subtract").

**Failure modes:** flat "good job" ×20; skipping the why; assigning (not offering) extra problems as pseudo-punishment; praising speed ("fastest in the group") in ways that reward rushing.

## Domain 5 — Data use

*The exit ticket is the hinge between sessions. Without it, dosage and fidelity are guesses.*

**Observable behaviors:**
- D1. Gives the exit ticket in every session (matches S3); collects it even if incomplete.
- D2. Records results (1–4 mastery per skill tag) in the [progress tracker](../docs/tools/student-progress-tracker.md) the same day — initials only, per privacy rules.
- D3. Chooses next session's warm-up and misconception target from the recorded results (plan shows the source).
- D4. Flags a student stuck below mastery on the same skill for two consecutive tickets to the site coordinator (the escalation path), rather than waiting for the next observation.

**Failure modes:** exit tickets graded but never read; next session's plan ignores the results; data recorded weekly from memory instead of same-day.

---

## How the model maps to everything else

| Model element | Where it appears |
|---|---|
| Domain 1–5 | [Modules 1–5](../docs/modules/index.md) (one per domain) · [observation rubric rows](../docs/coaching/observation-rubric.md) · [fidelity metrics](../docs/program/measurement-plan.md) |
| **Moves + hint ladder** | Module 3 content · transcript annotations · [spot-the-move items](../docs/transcripts/practice/index.html) · rubric Domain 3 |
| Failure modes | Transcript library (2 strong / 2 mixed / 2 weak) · role-play cards · calibration activity |
| S1 routine | [session plan template](../docs/tools/session-plan-template.md) · role-play cards · "exit ticket administered" fidelity metric |
| D1–D4 | Module 5 · [exit-ticket bank](../docs/tools/exit-ticket-bank.md) · [measurement plan](../docs/program/measurement-plan.md) |

The full objective chain (objective → module → practice → rubric row → metric) is in the [alignment table](../docs/program/alignment-table.md).
