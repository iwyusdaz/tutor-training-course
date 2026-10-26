# STATUS

**Updated:** 2026-10-26 (revision round from the agent review) · **Repo state:** built, verified, published — https://github.com/iwyusdaz/tutor-training-course (Pages: https://iwyusdaz.github.io/tutor-training-course/)

**Build note (resume):** the build started 2026-10-25 and was interrupted by a transient error after 10 commits (scaffold through the evaluation pages), with `evaluation/` untracked. The 2026-10-26 session reviewed the committed work against the specs, kept it unchanged where it passed (content conventions, move names, alignment table), and finished: the pending pipelines, tests, human-protocol additions, site-link repair, governance files, verification and publish. Full record in [DECISIONS.md](DECISIONS.md) D14.

**Revision note (2026-10-26, post-publish):** a separate fresh-context reviewer agent that did not build the repo audited the published site ([`evaluation/agent-review.md`](evaluation/agent-review.md)); its 7 must-fix + 5 should-fix findings were applied the same day — headlined by invalid front-matter YAML that had broken the live navigation invisibly (fixed + a new `test:frontmatter` check), transcript math/label/rubric-score corrections, and module excerpts replaced with verbatim transcript text or relabeled as constructed. Full record in [DECISIONS.md](DECISIONS.md) D17 and [CHANGELOG.md](CHANGELOG.md) 1.0.1.

## Done

- Scaffold: `.gitignore`, dual license (CC BY 4.0 content / MIT code), `.env.example` (MODEL_A/B/C slots exactly per the portfolio spec), Just the Docs pinned v0.12.0, Pages from `/docs`.
- Research: [evidence notes](research/evidence-notes.md) with primary-source verification (URLs + access dates; one plan-level claim corrected against the primary source) and the locked five-domain competency model.
- Site: home page, modules 1–5 + safeguarding placeholder, transcript library (6 fictional annotated transcripts: 2 strong / 2 mixed / 2 weak), spot-the-move practice tool (10 items), live-practice guides + role-play cards, 4 tutor tools, coaching system (rubric, cycle, conversation guide, calibration), program pages (measurement plan, simulated dashboard, onboarding timeline, alignment table), evaluation pages.
- Evaluation: [METHODS.md](evaluation/METHODS.md); human-protocol pack (pilot protocol, consent text, blind scoring sheet, realism-review form, usability script, manual VoiceOver check); pending pipelines (`run-simulations.mjs`: 9 AI-simulated trainees with blind pre/post Domain-3-anchor scoring; `run-review-panel.mjs`: MODEL_B/C realism panel with agreement) + env gate (`lib/env.mjs`); results skeletons ("PENDING: requires API key"); in-session agent design review + transcript realism review (labeled with the same-model limitation).
- Agent review, pass 2 (2026-10-26): separate fresh-context reviewer agent ([evaluation/agent-review.md](evaluation/agent-review.md)) — full report committed; its findings applied the same day (revision round, DECISIONS D17 / CHANGELOG 1.0.1).
- Tests: keyboard/reflow/focus suite, aria-tree captures (all states, local + live), axe state audit script for the tool, axe audit of all 36 live pages (evidence committed under `docs/audit/`), front-matter YAML check (added 2026-10-26 after the review's nav finding).
- Governance: README case study, DECISIONS (D1–D16), CHANGELOG, ATTRIBUTION, this file. Social preview generated at `docs/assets/social-preview.png`.

## Verification (2026-10-26, re-runnable — re-run after the revision round; see the revision note for what changed)

| Check | Result |
|---|---|
| Front-matter YAML check (`npm run test:frontmatter` — added 2026-10-26) | **36/36 front-matter blocks valid** (plain scalars, tabs, docs titles); would have caught the nav-breaking t1/pilot-report defect (F1) |
| gitleaks detect (all commits + tree) | no leaks found |
| `.env` in git history (`git log --all --name-only`) | absent (only `.env.example` with placeholders) |
| Files > 50 MB | none |
| Move-name consistency vs repo 03 `spec/pedagogy-rules.md` v1.0 | all 7 canonical names used (probing question · hint ladder 0–5 · wait time · specific feedback · worked example after repeated failure · confirm and ask why · offer a similar problem); zero non-canonical move labels |
| axe-core audit, all 36 live pages (WCAG 2.1 A/AA + best practice) | **0 violations** (critical/serious/moderate/minor) |
| axe-core on the practice tool, 4 live-rendered states | **0 violations** per state (1 axe "incomplete" heuristic item recorded, not a violation) |
| Keyboard/reflow/focus tests, local + against the live site | **127/127 pass** (full tool flow keyboard-only, focus assertions, 320 px reflow on every page, one h1 per page, nothing stored) |
| Playwright aria snapshots | committed in `evaluation/tests/aria-snapshots/` (tool: initial / alert / feedback / summary; transcripts page) |
| Pipeline dry-runs (`--dry-run` both) | pass; stubs in `dry-run/` headed "DRY RUN – NOT REAL RESULTS"; `evaluation/results/` untouched |
| Placeholder `.env` behavior | both pipelines exit 1 with a clear message, zero network calls |
| linkcheck, local raw serve + live site | live: 38 pages, **0 broken** (fixed en route: modules-index same-dir links, absolute `/tutor-training-course/*.md` paths, practice-page Markdown-in-.html, four malformed targets) |
| GitHub Pages | enabled (main `/docs`); build `built` on the final commit; live URL HTTP 200 on all pages |

## Pending (requires owner action or future runs)

1. **API keys** in `.env` (MODEL_A/B/C), then `npm run eval:pending` — produces the simulated-trainee runs and the multi-model realism panel; refresh `evaluation/results/` summaries, METHODS.md and the README notice per the rerun procedure written in METHODS §6.
2. **Pilot with 3–5 real adults** — protocol, consent text, blind scoring sheet and report template ready in `evaluation/human-protocol/` + `docs/evaluation/pilot-report.md`; results must stay descriptive (no gains claims).
3. **Manual VoiceOver check** — protocol ready ([voiceover-manual-check.md](evaluation/human-protocol/voiceover-manual-check.md)); Guidepup automation does not function on macOS 27; **no screen-reader testing has been performed** and none is claimed anywhere.
4. **Owner tasks:** upload `docs/assets/social-preview.png` as the repo social preview (no upload API), fill `[Email]`/`[LinkedIn]` in the README, optional repo pinning.

## Known limitations (disclosed, not hidden)

- No real results of any kind yet; every results table reads "PENDING: requires API key"; no simulated transcripts, scores or verdicts exist in the repo.
- Simulated trainees cannot show learning; the pipeline surfaces task clarity and realism problems only.
- Agent reviews: in-session pass (2026-10-25) + separate fresh-context pass (2026-10-26, did not build the repo) — but both may share the same underlying model family, so neither is an independent expert judgment; the practitioner realism review remains open.
- No VoiceOver/screen-reader pass and no daily-AT-user review; the manual protocol is the prepared path.
- All transcripts and program data are fictional (labeled on every artifact); the practitioner realism review of the transcripts remains open.
