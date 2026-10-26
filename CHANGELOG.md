# Changelog

All notable changes to this repository. Dates are build dates; the build started 2026-10-25 and was completed 2026-10-26 after an interrupted session (see [DECISIONS.md](DECISIONS.md) D14 for the resume record).

## [1.0.0] — 2026-10-26

### Added
- Scaffold: `.gitignore`, dual license (CC BY 4.0 content / MIT code), `.env.example` with MODEL_A/B/C slots, Just the Docs pinned v0.12.0, home page with program overview and onboarding timeline.
- Research: evidence notes with primary-source verification (URLs + access dates, 2026-10-25) and the locked five-domain competency model.
- Modules 1–5 (one per competency domain, ≤ 25 min each) + safeguarding placeholder.
- Transcript library: six fictional annotated transcripts (2 strong, 2 mixed, 2 weak) with numbered inline annotations; spot-the-move practice tool (10 items, accessible engine, nothing stored).
- Live practice: Sessions A & B facilitator guides + role-play cards.
- Tutor tools: session plan template, 20-item exit-ticket bank, privacy-safe progress tracker, self-reflection form.
- Coaching system: 5×4 behavioral-anchor observation rubric, coaching cycle (Mermaid + text), conversation guide, calibration activity.
- Program: measurement plan (6 layers), simulated six-school dashboard with action plan, onboarding timeline, alignment table.
- Evaluation: `evaluation/METHODS.md`; human-protocol pack (pilot protocol, consent text, blind scoring sheet, realism-review form, usability test script, manual VoiceOver check); pending pipelines (`run-simulations.mjs`, `run-review-panel.mjs`) with shared env gate (`evaluation/lib/env.mjs`); keyboard/reflow tests and aria-snapshot captures (`evaluation/tests/`); results skeletons ("PENDING: requires API key"); pilot report template; agent design review + transcript realism review (labeled, in-session).
- Governance: README case study, DECISIONS, CHANGELOG, ATTRIBUTION, STATUS.

### Changed (from evaluation, before any pending data exists)
- **Evidence correction:** the build plan's at-scale effect-size range "0.03–0.10 SD" is not supported by the primary source; the site uses the verified numbers (0.16–0.21 SD large in-person programs; 0.07 SD virtual; 0.37 SD small-scale trials) with the source quoted in [`research/evidence-notes.md`](research/evidence-notes.md) §1b and §6. Direction of the claim unchanged.
- **Realism review fixes (agent review, in-session):** T6 annotation 4 reworded so it no longer implies a mathematically-correct step (`x = 0`) was an error; T3's stacked-error exchange (one-side operation + check mix-up) now named explicitly in annotation 6; all six transcripts re-checked for name/ability stereotyping (none found).
- **Link repair (pre-publish):** all intra-site links converted from absolute `/tutor-training-course/*.md` paths (which 404 on GitHub Pages) to relative `.md` links (rewritten by Jekyll's relative-links plugin at build); links to repo-only files (`research/`, `evaluation/`, `CHANGELOG.md`, `README.md`) pointed at GitHub blob URLs; four malformed link targets fixed (module 3 filename, calibration activity, practice tool path, METHODS.md casing).

### Security
- `gitleaks detect` clean before publish; `.env` never committed (placeholder `.env.example` only); pipelines refuse to run — exit 1, zero network calls — on missing or placeholder values.

## [1.0.1] — 2026-10-26

### Added
- **Separate-context agent review** ([`evaluation/agent-review.md`](evaluation/agent-review.md)): a fresh-context reviewer agent that did not build the repo re-read every artifact, walked the live site as three personas, re-derived every algebra line in all six transcripts, and re-verified citations (same-model limitation stated in the report). This is the separate pass the in-session review queued (STATUS pending item 4).
- **Front-matter YAML check** (`evaluation/tests/frontmatter-check.mjs`, `npm run test:frontmatter`, part of `npm run verify`): catches unquoted front-matter scalars containing `": "` — the defect class that broke the live nav invisibly (see Changed). Validation suite now covers content/nav integrity, not just markup.

### Fixed (from the agent review, F1–F7 must-fix)
- **F1 — broken live nav from invalid YAML:** `docs/transcripts/t1.md` and `docs/evaluation/pilot-report.md` had unquoted `description:` values containing `": "`; Jekyll's YAML parser rejected the front matter, so both pages built with no title/parent — T1 vanished from the Transcripts menu, a stray top-level "Transcript T1" entry appeared, the Pilot report was orphaned, and Evaluation showed no children. Both descriptions quoted; all other `.md` front matter grep-verified clean; the new YAML check prevents regression.
- **F2 — wrong math praised in T2 (calibration anchor):** Mei's check of `6x + 5 = 2x − 3` read "−11 and −11" (the worked example's numbers); corrected to −7 and −7, and annotation 11 now notes the distinction between the example's check and her own. Practice item q9's exchange updated to match.
- **F3 — T3 misconception labels:** header promised M4 (dividing only some terms) but no division error occurs — the exchange shows M1 (one-side subtraction) plus a check-basis error (the arithmetic is correct; the wrong equation is checked). Header and annotations 5, 6, 8 corrected; annotation 8 no longer calls the tutor's hybrid-check modeling "genuinely good" unqualified.
- **F4 — "Rubric read" scores contradicted the rubric's anchors:** T3 Domain 2 → 1 (skipped exit ticket caps the domain at 1, per the rubric's bold rule) and Domain 1 → 3 (Omar gets no recorded-work reference); T6 Domain 2 → 1 (same cap); T4 Domain 5 → 2 (no data-informed choice = level 2). The calibration activity notes the re-scoring.
- **F5 — fabricated module excerpts:** modules 2–5 attributed invented dialogues to transcripts that don't contain them ("T2 minute 22", a T3 DeShawn exchange, a T1 Elena exchange, a "T5 coordinator's data check" depicting the exact ticket-recording T5 skips). Module 1's near-miss paraphrase included. All replaced with verbatim excerpts from the named transcripts (modules 1–4) or relabeled as a constructed example (module 5's data check, with T5's real final line quoted as the failure it prevents).
- **F6 — misdirected citation:** README linked Nickow, Oreopoulos & Quan (2020) to the Kraft, Schueler & Falken (2024) URL (both pointed at `ai24-1031`). Nickow now links to `edworkingpapers.com/ai20-267`; the URL is recorded in `research/evidence-notes.md` §1a.
- **F7 — review attribution synced:** the evaluation index claimed the completed design review was by a "reviewer agent, did not build this repo," contradicting METHODS §4 (in-session authoring agent). Index, METHODS, README, design-review form and STATUS now state both passes accurately (in-session 2026-10-25; separate fresh-context reviewer 2026-10-26).

### Fixed (should-fix, from the same review)
- **F8:** README showcase contrast + practice item q7 re-attributed the T5 posed line (`2(x − 4) = 2x − 4`) to the student; in T5 the tutor poses it. Both corrected to the transcript's actual turns.
- **F9:** rubric print sheet had four time blanks for five blocks — fifth blank added.
- **F10:** T5/T6 annotations cited dashboard figures (40%, 62%) that exist nowhere in the repo; reworded to the metric and the dashboard's actual ticket column.
- **F11:** practice item q2 relocated T1's wait-time moment and dropped the "Say why plus" turn; q9 quoted "One more, same shape…", which isn't in T2. Both now match the transcripts.
- **F12:** realism-review form records corrected (T1 = 13 exchanges; the silently-failed C3 band for T4–T6 now carries recorded rationales; the pass-1 T3 note's mislabels flagged) and a pass-2 results section added with the fresh reviewer's per-transcript verdicts.
- **Minors:** "Weeks 1" → "Week 1" (Session A); M4 probe wording fixed in Module 3 practice and exit-ticket bank item 16 ("what else is on that side" → "what did you divide on the other side"); Module 3's "misconception bank" link relabeled (the M1–M5 definitions live in the evidence notes). Remaining minors (M2, M4, M5, M6, M7) deferred with reasons — DECISIONS.md D17.

## [Unreleased]
- Simulated trainee runs + multi-model realism panel — pending API keys (`npm run eval:pending`); summaries in `evaluation/results/` are hand-committed after a real run.
- Pilot with 3–5 real adults (protocol prepared in `evaluation/human-protocol/`); report goes to `docs/evaluation/pilot-report.md`.
- Manual VoiceOver check (protocol prepared; Guidepup automation non-functional on macOS 27 — no screen-reader testing claimed meanwhile).
- Practitioner (tutor/teacher) realism review — the two agent passes (2026-10-25, 2026-10-26) are logged; a human practitioner review remains open.
