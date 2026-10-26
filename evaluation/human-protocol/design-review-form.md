# Design review form (Agent review)

Status: **used twice — pass 1 in-session (authoring agent, 2026-10-25); pass 2 by a separate fresh-context reviewer agent (2026-10-26, full report in [`evaluation/agent-review.md`](../agent-review.md), findings applied the same day). The multi-model panel (pending pipelines) is a separate instrument.**

This form structures the agent review of the training materials: heuristic evaluation + cognitive walkthrough. It exists so any reviewer (agent or human) produces comparable output.

## Part A · Heuristic evaluation (Nielsen's set, adapted to training materials)

Score each 0 (problem) / 1 (minor issue) / 2 (fine), with an evidence line for anything below 2:

| # | Heuristic | What it means here | Score | Evidence |
|---|---|---|---|---|
| H1 | Visibility of system status | Learner always knows where they are in a module/practice (progress "Exchange 3 of 10", block timers in guides) | | |
| H2 | Match with the real world | Language of the audience: "exit ticket" not "formative assessment artifact"; move names defined before used | | |
| H3 | User control | Practice tool: Back / Start over; modules skimmable via ToC; no dead ends | | |
| H4 | Consistency | Move names, hint-ladder levels, domain names identical across modules, transcripts, tool, rubric, metrics (checked by grep against repo 03's spec — see METHODS §5) | | |
| H5 | Error prevention | The tool warns before evaluating with nothing selected; templates label required fields | | |
| H6 | Recognition over recall | Transcript annotations repeat the move name in full, not "same move as before" | | |
| H7 | Flexibility | Keyboard and mouse paths equal; guides have online-delivery variants | | |
| H8 | Aesthetic minimalism | Pages carry one job each; no decorative charts; tables only where tabular | | |
| H9 | Error recovery | Tool feedback explains why, links the transcript; wrong answers are framed as the useful case | | |
| H10 | Help | Check-yourself answers, facilitator notes, and the glossary of moves inline | | |

## Part B · Cognitive walkthrough (per task, four questions each)

Tasks walked: (T1) complete Module 3's practice; (T2) run the spot-the-move tool to summary; (T3) fill the session plan template for tomorrow; (T4) a coordinator scores [T3](/tutor-training-course/transcripts/t3.md) with the rubric print sheet; (T5) a new coordinator runs the calibration activity.

For each: Will the learner know what to do at this step? · Will they see the control? · Will they connect the outcome with the intent? · Where do they most plausibly go wrong, and does the material catch it?

## Part C · Honest-labeling audit

| Check | Where verified |
|---|---|
| No "educator/expert review" language anywhere; only "Agent review" | grep audit |
| No fabricated pilot/results; pilot page says PENDING; dashboard says SIMULATED | pages |
| All transcripts say fictional/constructed | each transcript |
| AI-assisted authorship disclosed | README |
| No learning-gain claims | grep for "gain", "effective", "proven" in results contexts |

## Findings ledger (fill per pass)

| # | Finding | Severity | Decision | Where fixed |
|---|---|---|---|---|
| *(pass 1 — in-session, authoring agent; findings fixed en route and recorded in [CHANGELOG](../../CHANGELOG.md), not itemized here at the time — a record-keeping gap noted by pass 2)* | | | | |
| P2-1 | Invalid YAML front matter (t1.md, pilot-report.md) breaks live nav + page metadata | MUST FIX | accepted | front matter quoted; new `test:frontmatter` check added |
| P2-2 | T2: Mei's check values wrong (−11/−11 should be −7/−7), annotation endorses them | MUST FIX | accepted | t2.md exchange + annotation 11 corrected |
| P2-3 | T3: header + annotations 5/6/8 mislabel the misconception (M4 named; actually M1 + check-basis error) | MUST FIX | accepted | t3.md header + annotations corrected |
| P2-4 | Published "Rubric read" scores contradict the rubric's anchors (T3 D1/D2, T6 D2, T4 D5) | MUST FIX | accepted | t3.md, t4.md, t6.md re-scored to the anchors |
| P2-5 | Modules 2–5 attribute fabricated dialogues to transcripts that don't contain them | MUST FIX | accepted | modules 1–5 replaced with verbatim excerpts or relabeled constructed |
| P2-6 | README cites Nickow et al. 2020 with the Kraft et al. 2024 URL | MUST FIX | accepted | README + evidence-notes §1a corrected |
| P2-7 | Evaluation index overstated review independence vs METHODS §4 | MUST FIX | accepted | index, METHODS, this form and STATUS synced |
| P2-8 | README/q7 re-attribute the T5 posed line to the student | SHOULD FIX | accepted | README + items.json q7 corrected |
| P2-9 | Rubric print sheet: 4 time blanks for 5 blocks | SHOULD FIX | accepted | fifth blank added |
| P2-10 | T5/T6 annotations cite dashboard numbers (40%/62%) that exist nowhere | SHOULD FIX | accepted | reworded to the metric + real dashboard column |
| P2-11 | q2 relocates the wait-time moment / drops "Say why plus"; q9 quotes a line not in T2 | SHOULD FIX | accepted | items.json q2, q9 corrected |
| P2-12 | Realism-form records inaccurate (T1 exchange count; C3 criterion silently failed for T4–T6; T3 note) | SHOULD FIX | accepted | realism-review-form.md corrected + pass-2 verdicts added |
| P2-M | Minors: M1 (Week 1 label), M3 (M4 probe wording), M8 ("misconception bank" link label) fixed; M2, M4, M5, M6, M7 deferred with reasons in DECISIONS.md D17 | Minor | mixed | see DECISIONS.md |

## Pass log

| Pass | Reviewer | Date | Findings | Notes |
|---|---|---|---|---|
| 1 | Authoring agent (in-session; same-model limitation) | 2026-10-25 | *(see CHANGELOG)* | Fresh-context reviewer pass queued post-publish |
| 2 | Separate fresh-context reviewer agent (did not build the repo; may share the underlying model — stated in the report) | 2026-10-26 | F1–F12 + minors M1–M8 — full report: [`evaluation/agent-review.md`](../agent-review.md) | All must-fix + should-fix findings applied 2026-10-26; minors dispositioned in the ledger above and DECISIONS.md |
