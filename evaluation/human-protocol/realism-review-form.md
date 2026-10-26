# Transcript realism review form

Status: **used twice — pass 1 in-session (authoring agent, 2026-10-25, results below); pass 2 by a separate fresh-context reviewer agent (2026-10-26 — verdicts and corrections in the pass-2 section below and in [`evaluation/agent-review.md`](../agent-review.md) §6); multi-model panel pending via `run-review-panel.mjs`; practitioner review open.**

Two uses:
1. **Agent review (done, see limitation):** each fictional transcript is checked against the misconception research it claims to depict. Pass 1 was performed **by the authoring agent itself**; pass 2 (2026-10-26) by a **separate fresh-context reviewer agent that did not build the repo**. The form is written so any reviewer — agent or human — can re-run it unchanged.
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
| T1 strong | pass — M3 error (2x−4) matches documented distribution behavior | pass | pass (13 exchanges) | pass | **pass** |
| T2 strong | pass — M2 sign-move profile and reveal logic match the bank | pass — L4 worked example plausible in time | pass (12 exchanges) | pass | **pass** |
| T3 mixed | pass — one-side subtraction and check-confusion both documented patterns | pass — the "rescue" moment is a realistic near-miss | pass | pass | **pass** |
| T4 mixed | pass — the "x = 7 after the x" line is the canonical M5 disclosure | pass | pass | pass — note: check that the "quick student" role is not gender-coded by name choice → names rotated, no pattern | **pass** (C4 note resolved) |
| T5 weak | pass — M3 error repeats; the monologue is the documented over-explaining failure mode | pass — sympathetic over-explainer, not a caricature | pass (fewer exchanges — consistent with monologue) | pass | **pass** |
| T6 weak | pass — M2 named-and-patched; M5 dismissal ("don't worry about it") is a documented missed-opportunity pattern | pass — speed-reward framing realistic | pass | pass | **pass** |

**Findings and edits (all applied):**

1. T4's reviewer note on name-role pairing: all six transcripts were re-checked — student names carry no consistent ability/role pattern across the library (fast finishers, avoidant students and struggling students appear under varied names and backgrounds). No change needed beyond the check.
2. T6 annotation 4 originally implied Mateo's work was an error; the review confirmed `x = 0` is mathematically correct — annotation reworded to "probably right but nobody knows" to keep the point about dismissed questions without a false claim about the math. *(Pass-2 correction, 2026-10-26: "probably right" was still hedged — the work is simply right; reworded again and the transcript header's M4 claim removed, since no M4 behavior occurs in T6.)*
3. T3's check-confusion exchange was flagged as *two stacked errors* (one-side operation + check mix-up); annotation 6 now names both explicitly so trainers don't misread it. *(Pass-2 correction, 2026-10-26: the applied wording mislabeled the pair as "the M4 one-side divide AND an arithmetic slip" — no division error and no arithmetic slip exist in T3; corrected to "the M1 one-side subtraction + a check run against the wrong equation," per agent review F3.)*

**Corrections to the pass-1 record (2026-10-26, from the fresh-context pass):**

- T1 has **13** exchanges, not the 11 first recorded (fixed in the table above).
- The C3 criterion ("10–14 exchanges per session") was **not met by T4 (8), T5 (7) or T6 (7)** and passed without a recorded rationale — a silent criterion failure. Rationales, now recorded: T5 is a monologue session (one ~90-second tutor turn replaces a run of exchanges); T4 and T6 are individual-work/speed-round sessions where much of the 30 minutes is students working off-page between shown exchanges. Pass-2 marks all three **pass-with-note** on pacing rather than silent passes.
- Pass 1 recorded T3's realism as a clean "pass"; pass 2 finds the *dialogue* sound but the *labels* wrong (header promised M4; the exchange shows M1 + a check-basis error) — **needs-rework on labels/annotations**, fixed 2026-10-26. Pass 2 also finds T2 **pass-with-edits** (Mei's check values were −11/−11 for a problem whose correct check is −7/−7), fixed 2026-10-26.

## Results — Agent review pass 2 (separate fresh-context reviewer agent, 2026-10-26)

**Reviewer:** a separate agent in fresh context that did not build the repo (it may share the underlying model — stated in the report). **Full report:** [`evaluation/agent-review.md`](../agent-review.md) (§6 realism, §7 timing, §8 move-name grep).

| Transcript | C1 misconception match | C2 response plausibility | C3 pacing | C4 representation | Verdict (pass 2) |
|---|---|---|---|---|---|
| T1 strong | pass — M3 review integrated aloud; no in-session error needed | pass — 13 exchanges, all tutor turns short, wait time counted | pass (block timestamps 0:00/5/10/24/29) — note: Luis's why-answer is rule-flavored and accepted | pass | **pass** (with notes) |
| T2 strong | pass — Tomás's error is canonical M2; the L4 example targets the exact step | pass — L1 nudge, wait time under pressure, worked example + hand-back | pass (12 exchanges) | pass | **pass-with-edits** — Mei's check values were wrong for her problem (fixed 2026-10-26) |
| T3 mixed | fail-as-labeled — header promised M4; the exchange shows M1 + a check-basis error (fixed 2026-10-26) | pass — the near-miss rescue is realistic | pass (struggle arc 0:10–0:22) | pass | **needs-rework (labels only; dialogue sound)** — fixed 2026-10-26 |
| T4 mixed | pass — Andre's line is the canonical M5 disclosure | pass — recognizable weak-attention patterns | pass-with-note — 8 exchanges; ~9 minutes of individual work not shown | pass | **pass-with-edits** — Domain 5 rubric read re-scored (fixed 2026-10-26) |
| T5 weak | pass — Imani's error is canonical M3; naming-and-correcting is the documented failure | pass — the sympathetic over-explainer is the key realism question, answered yes | pass-with-note — 7 exchanges; monologue + slow "fast" run defensible for a new tutor | pass | **pass** |
| T6 weak | pass-with-edit — Aaliyah's error is canonical M2; header's M4 claim unsupported (fixed 2026-10-26); Mateo's `x = 0` is correct, not M4 | pass — takeover over "But—" and the speed round highly recognizable | pass-with-note — 7 exchanges + speed round; middle thin (individual work implied) | pass | **pass-with-edits** — Domain 2 rubric read re-scored + header fixed (2026-10-26) |

**What these reviews cannot establish:** that real middle-schoolers produce these lines with this frequency; that the weak-session tutors are recognizable to real coordinators; anything about actual classrooms. Pass 1 was *self-review* — the same agent that wrote the transcripts checked them; pass 2 added a fresh-context reviewer, but both may share the underlying model family, so neither is an independent expert judgment. The pending multi-model panel and the practitioner review exist to correct exactly that — the form above is ready for the practitioner.
