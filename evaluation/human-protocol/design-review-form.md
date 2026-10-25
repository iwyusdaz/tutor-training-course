# Design review form (Agent review)

Status: **used — one in-session pass (authoring agent, 2026-10-25); a separate fresh-context reviewer-agent pass is queued post-publish and will append to this file.**

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
| *(pass 1 — in-session, authoring agent)* | | | | |

## Pass log

| Pass | Reviewer | Date | Findings | Notes |
|---|---|---|---|---|
| 1 | Authoring agent (in-session; same-model limitation) | 2026-10-25 | *(see CHANGELOG)* | Fresh-context reviewer pass queued post-publish |
| 2 | *(separate reviewer agent — pending)* | | | |
