# Transcript realism review form

Status: **used once (agent review, performed in-session by the authoring agent — results below); multi-model panel pending via `run-review-panel.mjs`; practitioner review open.**

Two uses:
1. **Agent review (done, see limitation):** each fictional transcript is checked against the misconception research it claims to depict. The completed pass below was performed **by the authoring agent itself** (same-model limitation; a separate reviewer-agent pass is queued post-publish), and the form is written so any reviewer — agent or human — can re-run it unchanged.
2. **Practitioner review (open to the owner):** the same form, given to a real tutor or teacher, answers the question an agent cannot: *do real students sound like this?*

---

## Reviewer instructions

You are reviewing fictional tutoring transcripts for **realism against research**, not for pedagogical soundness (that is the rubric's job) or writing quality. For each transcript, check the four criteria below and give a verdict.

### C1 · Misconception match

Each scripted student error must behave like its tagged misconception (M1 one-side operations · M2 sign-when-moving · M3 partial distribution · M4 partial division · M5 equals-sign-as-answer-slot). The reference descriptions live in the [misconception bank](https://github.com/iwyusdaz/socratic-ai-tutor/blob/main/spec/misconceptions.md). Ask: *would a student with this misconception produce exactly this line — or is the error a fantasy of it?*

### C2 · Response plausibility

Do the tutor's lines sound like real tutors under time pressure — including the *weak* transcripts? Weak-session failure modes must be recognizable as real failure modes (over-explaining, answering for the student, skipping the exit ticket), not caricature.

### C3 · Pacing plausibility

Could this exchange sequence fit inside 30 minutes with 2–4 students? (Rough check: ~40–80 tutor words per exchange, 10–14 exchanges per session.)

### C4 · Respectful representation

Students are depicted as capable people with documented, nameable misconceptions — never as comic relief, never with stereotype-coded names or behaviors, never with deficit language ("slow," "hopeless").

### Verdict per transcript: **pass / pass-with-edits / needs-rework**, plus the specific lines that drove it.

---

## Results — Agent review (in-session, authoring agent as reviewer, 2026-10-25)

**Reviewer:** the authoring agent (same session; **not** a fresh-context reviewer — see the limitation). **Label:** Agent review. **Reference used:** repo 03's misconception bank v1.0 + the same literature base.

| Transcript | C1 misconception match | C2 response plausibility | C3 pacing | C4 representation | Verdict |
|---|---|---|---|---|---|
| T1 strong | pass — M3 error (2x−4) matches documented distribution behavior | pass | pass (11 exchanges) | pass | **pass** |
| T2 strong | pass — M2 sign-move profile and reveal logic match the bank | pass — L4 worked example plausible in time | pass (12 exchanges) | pass | **pass** |
| T3 mixed | pass — one-side subtraction and check-confusion both documented patterns | pass — the "rescue" moment is a realistic near-miss | pass | pass | **pass** |
| T4 mixed | pass — the "x = 7 after the x" line is the canonical M5 disclosure | pass | pass | pass — note: check that the "quick student" role is not gender-coded by name choice → names rotated, no pattern | **pass** (C4 note resolved) |
| T5 weak | pass — M3 error repeats; the monologue is the documented over-explaining failure mode | pass — sympathetic over-explainer, not a caricature | pass (fewer exchanges — consistent with monologue) | pass | **pass** |
| T6 weak | pass — M2 named-and-patched; M5 dismissal ("don't worry about it") is a documented missed-opportunity pattern | pass — speed-reward framing realistic | pass | pass | **pass** |

**Findings and edits (all applied):**

1. T4's reviewer note on name-role pairing: all six transcripts were re-checked — student names carry no consistent ability/role pattern across the library (fast finishers, avoidant students and struggling students appear under varied names and backgrounds). No change needed beyond the check.
2. T6 annotation 4 originally implied Mateo's work was an error; the review confirmed `x = 0` is mathematically correct — annotation reworded to "probably right but nobody knows" to keep the point about dismissed questions without a false claim about the math.
3. T3's check-confusion exchange was flagged as *two stacked errors* (one-side operation + check mix-up); annotation 6 now names both explicitly so trainers don't misread it.

**What this review cannot establish:** that real middle-schoolers produce these lines with this frequency; that the weak-session tutors are recognizable to real coordinators; anything about actual classrooms. It is also *self-review* — the same agent that wrote the transcripts checked them, which is exactly the weakness the pending multi-model panel and the practitioner review exist to correct. That is the practitioner review's job — the form above is ready for it.
