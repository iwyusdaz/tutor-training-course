---
title: "Measurement plan"
parent: Program measurement
nav_order: 1
description: Six metric layers with benchmarks and sources; leading-indicator rationale; equity check by subgroup; data-privacy rules. The fictional program's measurement spine.
---

# Measurement plan

{: .label .label-purple }
For the fictional Bridge Math Tutoring program (6 schools, ~60 part-time tutors, Grade 7–8 linear equations) · Metrics feed the [simulated dashboard](dashboard-simulated.md) · All data labeled fictional or simulated.

## The metric table

| Layer | Metric | Benchmark / target | Source | Cadence | Why this metric |
|---|---|---|---|---|---|
| **Dosage** | Minutes of tutoring per student per week | **~90** (research benchmark: three 30-min sessions); **flag any student <60** | Attendance logs | Weekly per student | The benchmark's own analysis found the typical student at ~72 min/week — and that averages hide the shortfallers; see [evidence §2](/tutor-training-course/research/evidence-notes.md) |
| **Consistency** | % of a student's sessions with the same tutor | ≥85% | Scheduling + attendance logs | Monthly | Tutor continuity is both a dosage enabler and the relationship mechanism ([evidence §2](/tutor-training-course/research/evidence-notes.md)) |
| **Fidelity (quality)** | Mean [rubric](/tutor-training-course/coaching/observation-rubric.md) score across 5 domains | ≥3.0 mean; no domain at 1 | Observations (30 min, calibrated) | Every 2–3 weeks per tutor; growth window obs 1→3 | What's trained is what's observed ([competency model](/tutor-training-course/research/competency-model.md)) |
| **Fidelity (routine)** | % of sessions with exit ticket administered & collected | ≥90% | Session logs + spot checks | Weekly | The data loop's precondition; skipping the ticket is [T5]'s signature failure ([evidence §1c](/tutor-training-course/research/evidence-notes.md)) |
| **Tutor development** | Rubric growth, observation 1 → 3 | **+0.5 average** | Observations | Per semester | Training that doesn't change observed behavior is retraining |
| **Student progress** | % of students at mastery (4/4) on each skill tag; flagged-student rate | Program-defined per site; flag rate falling = the loop working | [Exit-ticket tracker](/tutor-training-course/tools/student-progress-tracker.md) aggregates | Monthly | Tag-level, not item-level: "MOVE·M2 down from 6 flags to 2" is an action signal |
| **Retention** | Tutors completing the semester | ≥80% | Program records | Per semester | Turnover resets every relationship (and re-trains every tutor); continuity metric depends on it |

## Why dosage and fidelity lead, and outcomes lag

Student test scores arrive in months and answer no fixable question ("did it work?" ≠ "what do we change Monday?"). Implementation metrics answer the fixable one, early:

- The at-scale evidence ([Kraft, Schueler & Falken 2024](https://edworkingpapers.com/ai24-1031); [CALDER WP 338-0426](https://caldercenter.org/sites/default/files/2026-04/CALDER-WP-338-0426.pdf)) attributes the small-scale-to-large effect drop substantially to implementation: dosage thins, groups grow, tutors turn over, quality control fails.
- The strongest programs manage exactly these variables in real time — the CALDER case study shows a district raising sessions-per-student (26.2 → 30.1 over three years) against a 27-session target *because* dosage was tracked and acted on.
- Leading-indicator logic: **a school at 55 min/week cannot get research-level effects no matter how good its tutors are.** The dashboard's job is to find that school in week 3, not in June.

## The equity check (monthly, mandatory)

Program averages hide exactly the students the program exists for — the dosage analysis found **91% of within-program variation in weekly minutes** ([evidence §2](/tutor-training-course/research/evidence-notes.md)). So every layer above is disaggregated:

| Check | Cut | Trigger |
|---|---|---|
| Dosage | Per student, per school, and by subgroup (English learners, students with IEPs, free/reduced-price lunch) | Any subgroup mean <80% of school mean → investigate scheduling first |
| Exit-ticket rate | Per tutor, per school | Any tutor <90% for two weeks → coaching cycle focus |
| Flag rate | Per skill tag, per school | A tag spiking at one school → is it instruction or intake? |
| Retention | By tutor type (college / community) | A gap → fix onboarding or scheduling, whichever the exit reasons name |

The subgroup check uses only data the school already collects and shares under its data agreement — no new categories, no new collection.

## Data privacy

1. **Initials only at the tutor level.** The [tracker](/tutor-training-course/tools/student-progress-tracker.md) rule goes all the way up: no full student names in any program system; reports are tag-level counts.
2. **Aggregate for anything shared.** School and program dashboards show rates and means; no row identifies a child. Flags travel to coaches as tagged tickets, per the school's agreement.
3. **The school's data agreement outranks this page.** Where a district's rules are stricter, the stricter rule applies — and the [safeguarding placeholder](/tutor-training-course/modules/safeguarding.md) is where tutors get that training.
4. **Simulated ≠ real.** The [dashboard](dashboard-simulated.md) carries fictional data on purpose; no real student data appears anywhere in this portfolio.

## What this plan cannot show

- **Attribution.** Fidelity moving +0.5 alongside exit-ticket mastery moving tells a coherent story; it does not prove the training *caused* it. Small-group tutoring programs are confounded by everything else schools do.
- **Generalization.** Six schools, one subject, fictional. The plan is a design artifact — a demonstration of measurement thinking — not an evaluated system.
- **Anything about real children.** There are none here. Every number on the [dashboard](dashboard-simulated.md) is simulated and labeled.
