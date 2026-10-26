---
title: "Evaluation"
has_children: true
nav_order: 8
description: How these training materials themselves are evaluated — methods, what's done, what's pending, and the human protocol.
---

# Evaluation of these materials

The [pilot report](pilot-report.md) is the landing page for testing these materials *with real people* — currently pending. The full methods statement (what was evaluated, by what method, by whom, and what each piece of evidence can and cannot show) lives in [`evaluation/METHODS.md`](https://github.com/iwyusdaz/tutor-training-course/blob/main/evaluation/METHODS.md) in the repository — summarized here:

| Evaluation | Method | Status |
|---|---|---|
| Evidence verification | Primary-source tracing (CALDER working paper, NSSA briefs, dosage-analysis press release) — [research notes](https://github.com/iwyusdaz/tutor-training-course/blob/main/research/evidence-notes.md) | Complete |
| Automated accessibility | axe-core 4.11.1, WCAG 2.1 AA, every page + the practice tool | Complete |
| Keyboard & reflow | Playwright 1.57 scripted keyboard-only task tests + 320px reflow + [aria snapshots](https://playwright.dev/docs/aria-snapshots) | Complete |
| Design review | **Agent review** against a structured form — two passes: in-session by the authoring agent (2026-10-25), then a separate fresh-context reviewer agent (2026-10-26, [agent review](https://github.com/iwyusdaz/tutor-training-course/blob/main/evaluation/agent-review.md), whose findings were applied the same day) | Complete |
| Transcript realism review | **Agent review** of the six fictional transcripts against the cited misconception research — same two passes (in-session 2026-10-25; fresh-context reviewer 2026-10-26); multi-model review panel pipeline ready | Complete (two agent passes; no practitioner review yet) / panel pending |
| Simulated tutor-trainees | 9+ AI-simulated trainees across personas, scored pre/post on error-response tasks with the rubric's Domain 3 anchors, descriptive only | **PENDING: requires API key** |
| Review panel (transcript realism, multi-model) | ≥2 models reviewing realism + agreement reported | **PENDING: requires API key** |
| Pilot with real people | 3–5 adults, pre/post error-response tasks, blind rubric scoring | Not run — [protocol prepared](pilot-report.md) |
| Screen reader testing | Guidepup/VoiceOver unavailable on the build OS (macOS 27) — **no screen reader testing performed**; manual protocol prepared | Not run — [protocol prepared](https://github.com/iwyusdaz/tutor-training-course/blob/main/evaluation/human-protocol/voiceover-manual-check.md) |

**Honesty labels:** every review on this site is labeled **"Agent review"** — never "educator review" or "expert feedback." Pending items stay marked pending; nothing is fabricated; no learning gains are claimed anywhere.
