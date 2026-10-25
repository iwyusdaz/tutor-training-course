# Bridge Tutor Academy — a tutor training program

A blended training program that prepares new tutors — college students and community members, most with no teaching background — to deliver **high-impact math tutoring with consistency**: the same session routine, the same student-facing moves, every session, so quality survives scale. Built as a program-design case study for K-12 program managers, tutoring organizations and learning designers.

**[Live site](https://iwyusdaz.github.io/tutor-training-course/)** · **[Research and competency model](research/)** · Role: Sole designer

**Evaluation status:** Automated accessibility testing and agent-based design reviews are complete. AI-simulated learner and review-panel evaluations are pending. No real learners have tested this yet. See [evaluation/METHODS.md](evaluation/METHODS.md).

Bridge Math Tutoring is a **fictional organization**. All transcripts, dashboards and program data are fictional or simulated and labeled as such on every page.

## The problem

Tutoring is one of the best-evidenced interventions in education — small-scale trials pool at 0.37 SD ([Nickow, Oreopoulos & Quan 2020](https://edworkingpapers.com/ai24-1031)) — but the effect shrinks when programs scale: large programs deliver roughly **0.16–0.21 SD** (and virtual delivery ~0.07 SD) in the preferred samples of the 282-RCT meta-analysis ([Kraft, Schueler & Falken 2024](https://edworkingpapers.com/ai24-1031)). What erodes at scale is not the idea of tutoring but its *implementation*: dosage delivered (the research benchmark is ~90 min/week; a 2026 analysis of ~884,000 sessions found the typical student received ~72), consistency of the tutor, and the quality of each session. After ESSER funding ended, districts didn't hit a single cliff — they sorted onto different paths, and the programs that survived were the ones that could *show* quality with data ([CALDER WP 338-0426](https://caldercenter.org/sites/default/files/2026-04/CALDER-WP-338-0426.pdf); [NSSA brief](https://nssa.stanford.edu/briefs/how-is-high-impact-tutoring-enduring-after-esser)).

Most tutor training answers this with a slide deck on day one. This program treats tutoring as a **practice to be coached**: observable moves, annotated session transcripts, role-play rehearsal, an observation rubric with behavioral anchors, a coaching cycle, and fidelity metrics a program manager can actually watch.

## The competency model underneath it all

One model, three uses: what the modules train, what the rubric observes, what the metrics measure. Defined once in [research/competency-model.md](research/competency-model.md):

| Domain | Trained behaviors |
|---|---|
| 1 · Relationships | Greet each student by name; reference their recorded work; spread attention so every student produces |
| 2 · Session structure | The five-block 30-minute routine (warm-up → review → guided practice → independent try → exit ticket), inside its time boxes |
| 3 · Questioning and errors | Probing question before explaining; hint ladder (levels 0–5), one rung per turn; wait time 3–5 s; worked example after repeated failure |
| 4 · Feedback and motivation | Specific, process-focused feedback; confirm and ask why; offer a similar problem; normalize mistakes |
| 5 · Data use | Exit ticket every session; record and read results same day; adjust the next plan |

The move names and the hint ladder are shared with the companion project **[Socratic AI Tutor](https://iwyusdaz.github.io/socratic-ai-tutor/)** — the same moves, encoded for an AI.

## The design contrast (designed examples, not pilot results)

The same student moment — the documented *partial distribution* error `2(x − 4) = 2x − 4` — in the weak transcript (T5) and the strong transcript (T2). Both are fictional, constructed for training:

| | T5 — the over-explaining tutor | T2 — the coached move |
|---|---|---|
| Student shows `2(x − 4) = 2x − 4` and asks "is that right?" | "You're close, but no — when you distribute, the 2 has to multiply *both* things inside, so it's 2x − 8… Let me write it." — the fix is named and performed *by the tutor*; nobody learns what the student was thinking | "Hold on — walk me through what happened to the −4." — a probing question at the exact spot of the misconception; the student finds and owns the repair, then the tutor confirms and asks why it works |

The full sessions, with numbered annotations naming each move and its effect: [transcripts T1–T6](docs/transcripts/index.md) (2 strong, 2 mixed, 2 weak), plus the interactive [spot-the-move practice](https://iwyusdaz.github.io/tutor-training-course/transcripts/practice/).

## Audience and context

- **Trainees:** paid part-time tutors — college students and community members with no teaching background, onboarding into a fictional nonprofit ("Bridge Math Tutoring") partnering with six middle schools.
- **The program they join:** in-school sessions, groups of 2–4 students, 3 × 30 min/week in Grade 7–8 linear equations — deliberately inside the design characteristics the [NSSA definition](https://nssa.stanford.edu/about/high-impact-tutoring) names as conditions of impact.
- **Also served:** site coordinators (observation and coaching tools) and program managers (fidelity and outcomes measurement).
- **Out of scope:** real student data, recordings of real children, safeguarding legal content (a [placeholder module](docs/modules/safeguarding.md) directs tutors to their organization's own required training).

## My approach (analysis → design → build → evaluate)

1. **Analysis:** tutoring-effectiveness research traced to primary sources ([research/evidence-notes.md](research/evidence-notes.md)) — every claim carries a URL and access date, and one plan-level claim (the at-scale effect size) was **corrected against the primary source** during verification.
2. **Design:** a five-domain competency model; module objectives written as observable behaviors; an [alignment table](docs/program/alignment-table.md) forcing every objective → module → practice → rubric row → fidelity metric link to exist (an objective with no metric is decoration; a metric with no objective is surveillance).
3. **Build:** five self-paced modules (≤ 25 min each) + a safeguarding placeholder; six annotated fictional transcripts; the spot-the-move practice tool; two 60-minute live role-play facilitator guides with role-play cards; four tutor tools; a one-page observation rubric with behavioral anchors; the coaching cycle, conversation guide and a calibration activity; the measurement plan with a simulated six-school dashboard; the four-week onboarding timeline.
4. **Evaluate (in progress):** automated accessibility audit + scripted keyboard/reflow tests + aria-tree captures (done); agent design review and transcript-realism review (done, labeled, same-model limitation stated); simulated trainee runs and a multi-model realism panel (pipelines built and dry-run tested, **pending API keys** — one command: `npm run eval:pending`); a pilot with 3–5 real adults (protocol prepared, not run).

## Key design decisions

1. **One competency model driving training, observation and metrics** — not separate documents. What's trained is what's observed is what's measured; the [alignment table](docs/program/alignment-table.md) is the coherence check. *Alternative:* independent module/rubric/metrics docs — rejected as the exact drift that makes fidelity data meaningless.
2. **Written fictional transcripts, not videos** — privacy for minors, accessible by default (numbered inline annotations, not visual margin notes), easy to annotate and calibrate against. Every file is labeled "Fictional transcript, constructed for training purposes." *Evidence:* [transcript library](docs/transcripts/index.md).
3. **Dosage and fidelity as leading indicators, student outcomes lagging** — outcomes are noisy and arrive too late to fix; implementation metrics (minutes delivered, sessions with an exit ticket, rubric scores) are early and fixable ([measurement plan](docs/program/measurement-plan.md)). *Evidence:* the dosage analysis found 91% of within-program variation in weekly minutes is *between students in the same program* — averages hide the shortfallers.
4. **Blended delivery: self-paced modules + live role-play + coached field practice** — interpersonal skills need rehearsal with feedback, not information delivery; each module ends in an applied task and every live session is role-play, not lecture. *Alternative:* self-paced only — rejected.
5. **Shared move vocabulary with the AI tutor repo** — probing question, hint ladder (levels 0–5), wait time, specific feedback, worked example after repeated failure, confirm and ask why, offer a similar problem: identical names in both repos, so a tutor trained here and an AI built there are comparable ([repo 03's pedagogy rules](https://github.com/iwyusdaz/socratic-ai-tutor/blob/main/spec/pedagogy-rules.md)).

## Evidence and evaluation

**What was measured (done):**
- Automated WCAG 2.1 A/AA audit (axe-core 4.11.1) of every published page including the practice tool in all its states: **0 critical/serious violations** target — summaries in `docs/audit/`.
- Scripted keyboard/focus/reflow tests (Playwright): the practice tool worked start-to-finish keyboard-only, 19 checks pass ([evaluation/tests/keyboard-tests.mjs](evaluation/tests/keyboard-tests.mjs)).
- Accessibility-tree captures (Playwright `ariaSnapshot()`) of the practice tool at every state — the documented fallback for VoiceOver automation, which does not function on the build OS (macOS 27). **No screen-reader testing has been performed**; a manual VoiceOver protocol is prepared ([evaluation/human-protocol/voiceover-manual-check.md](evaluation/human-protocol/voiceover-manual-check.md)).
- Agent design review + transcript-realism review against the cited misconception research (labeled "Agent review"; performed by the authoring agent — the same-model limitation is stated in [evaluation/METHODS.md](evaluation/METHODS.md), and a separate reviewer pass is queued).

**Pending (built, dry-run tested; awaiting API keys):** simulated tutor-trainee runs (9 AI-simulated trainees across 3 personas × 3 experience levels, pre/post error-response tasks scored blind against the rubric's Domain 3 anchors — descriptive only) and a multi-model transcript-realism review panel (≥2 models, agreement reported). Run with `npm run eval:pending`. Until then the [results tables](evaluation/results/simulations-summary.md) read "PENDING: requires API key" and **no results exist anywhere in this repo.**

**Not run (protocol prepared):** a pilot with 3–5 real adults — pre/post error-response tasks, blind rubric scoring, usability walkthrough ([evaluation/human-protocol/](evaluation/human-protocol/), [report template](docs/evaluation/pilot-report.md)).

| Can show | Cannot show |
|---|---|
| Task clarity, scaffold gaps and realism flags from simulated runs (labeled AI-simulated) | Learning gains, statistical significance, or "validated with users" — simulated personas already know the content |
| That the content's claims trace to checkable primary sources | That the sources' own conclusions are correct (cited, not re-analyzed) |
| Standards conformance of the rendered DOM (axe) + keyboard operability (Playwright) | How a daily screen-reader or switch user experiences the site |
| Pilot participants' written error responses improving against rubric anchors (when run; small n, descriptive) | Effects on real students' learning, tutor behavior in real sessions, or results at scale |
| Coherence of the measurement design (alignment table fully linked) | That fidelity targets hold in a real program |

## Accessibility

- **Tested:** axe-core 4.11.1 (WCAG 2.1 A/AA + best practice) on every published page, including the practice tool in live-rendered states; scripted keyboard-only task tests with focus assertions (19/19 pass); 320 px reflow; aria-tree snapshots of the practice tool at every state; tables with real headers; transcripts use speaker labels and numbered inline annotations (never visual-only margin notes).
- **Known limitation, disclosed:** no VoiceOver/NVDA/JAWS listening test has happened — automation (Guidepup) does not work on the build OS, and no human screen-reader user has reviewed the site. The manual protocol above exists so the owner can run the check in ~20 minutes. No review by a daily assistive-technology user has happened; both are standing limitations of the accessibility claims.
- The practice tool works entirely in the browser; **nothing is stored** — no localStorage, no analytics, no server (verified by test).

## What I'd do differently / next steps

- Run the pilot *before* the final module polish — the report template commits to ≥3 revisions, and real trainee confusion would likely reorder module priorities.
- Add a second subject strand (e.g., ratios) to show the move vocabulary transfers beyond linear equations.
- Build the coordinator's observation app (the rubric as a scoring form with the calibration activity built in) rather than keeping observation on paper.
- After the pending runs: refresh [evaluation/METHODS.md](evaluation/METHODS.md), the results tables and the status lines above — the rerun procedure is written down.

## Tools used

- Markdown + Jekyll (Just the Docs v0.12.0, pinned) on GitHub Pages; vanilla HTML/JS for the practice tool.
- Node.js evaluation pipelines (OpenAI-compatible endpoints, key-gated, dry-run tested); Playwright 1.57 + axe-core 4.11.1 for accessibility verification; gitleaks before publish.
- AI-assisted authorship, disclosed: the modules, transcripts, tools and coaching materials were drafted with AI assistance under the author's design direction, then reviewed for evidence-tracing (every research claim was checked against its primary source), move-name consistency with the companion repo, and realism (an agent review is logged; a practitioner review remains open to the owner). All fictional content is labeled fictional.

## License and attribution

Learning content (modules, transcripts, rubrics, tools): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Code (practice tool, evaluation pipelines, tests): [MIT](https://opensource.org/license/mit). See [LICENSE](LICENSE), [LICENSE-CODE](LICENSE-CODE) and [ATTRIBUTION.md](ATTRIBUTION.md).

---

Contact: [Email] · [LinkedIn]
