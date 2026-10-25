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

## [Unreleased]
- Simulated trainee runs + multi-model realism panel — pending API keys (`npm run eval:pending`); summaries in `evaluation/results/` are hand-committed after a real run.
- Pilot with 3–5 real adults (protocol prepared in `evaluation/human-protocol/`); report goes to `docs/evaluation/pilot-report.md`.
- Manual VoiceOver check (protocol prepared; Guidepup automation non-functional on macOS 27 — no screen-reader testing claimed meanwhile).
- Separate-context reviewer-agent pass on the in-session reviews.
