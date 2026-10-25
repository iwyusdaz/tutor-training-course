# Manual VoiceOver check — macOS script

**Status: script provided, NOT run.** VoiceOver automation (Guidepup) does not work on macOS 27 in this build environment, and no human operator ran VoiceOver during the build. This script exists so the repo owner (or any sighted+VoiceOver user) can complete the check in about 20 minutes. **Do not describe VoiceOver testing as done until this has been run and the log filled in.**

Fallback already performed at build time: Playwright `ariaSnapshot()` accessibility-tree captures of the practice tool at every state ([`evaluation/tests/aria-snapshot.mjs`](../tests/aria-snapshot.mjs)), scripted keyboard/focus/reflow tests ([`evaluation/tests/keyboard-tests.mjs`](../tests/keyboard-tests.mjs)), and an axe-core audit. These verify structure — **not the listening experience**. Until this script is run, the repo claims **no screen-reader testing of any kind**.

---

## Setup (2 min)

1. macOS: System Settings → Accessibility → VoiceOver. Turn on "Use VoiceOver" or press **Cmd+F5**.
2. VoiceOver Utility → Verbosity: keep Speech default; make sure "Announce live regions" is enabled.
3. Open Safari (VoiceOver works best there) and load the live site (or `python3 -m http.server` of `docs/` for the practice tool).
4. Start the log below. Write down anything that differs from "Expected".

## Check A — Spot-the-move practice tool (`/transcripts/practice/`)

The practice tool renders its own controls in JavaScript, so it gets the full pass.

| # | Action | Expected VoiceOver output |
|---|---|---|
| A1 | VO+U → rotor → navigate by headings | "Spot the move", then "Exchange 1 of 10" |
| A2 | Read the privacy note (VO+A or arrow down) | "Nothing you answer is stored — the tool runs entirely in your browser…" present before the first question |
| A3 | Tab into the first fieldset | Legend announced with the group: "Which move is the tutor using (or which failure mode replaced it)?, radio group, 1 of 5" |
| A4 | Arrow through the radio options | Each option reads its full text with state ("selected" / "not selected"); exactly one per group is selectable |
| A5 | Tab to the second fieldset | Legend: "Did the move work for the student?, radio group" |
| A6 | Press "Check answer" with only one question answered | A role="alert" message is announced immediately: "Choose which move the tutor used, then check your answer." (or the effectiveness variant) |
| A7 | Answer both questions, press "Check answer" | Feedback announces automatically (role="status"): the heading "Both right — …" or "Not quite — the move was: …", followed by the explanation and the transcript link |
| A8 | After feedback appears, press Tab | Focus lands on (or near) the focused feedback heading — not lost at the top of the page |
| A9 | Press "Next exchange" | Heading "Exchange 2 of 10" is announced (the new heading receives focus) |
| A10 | Use "Back" mid-set | The previous exchange renders; focus is on its heading; your earlier answers are NOT restored (stated design) — check the page says so or the behavior is understandable |
| A11 | Answer all 10 and press "See your summary" | "Your summary" heading announced; the results table reads row-wise: exchange number, source, move result, effectiveness result |
| A12 | Press "Start over" | Returns to Exchange 1; nothing persisted (a page reload also shows a clean state) |
| A13 | Set the window to ~320 px wide, repeat A3–A7 | No horizontal scrolling; all controls still reachable and legible by VoiceOver |

## Check B — Transcript pages (spot check two: one strong, e.g. T1; one weak, e.g. T5)

| # | Action | Expected |
|---|---|---|
| B1 | VO+A (read all) on the transcript | Speaker labels read naturally ("Nina:", "Amara:"); the fictional-data note is read BEFORE the dialogue; numbered annotations read after their exchange, in order, as part of the text flow (not skipped or visually-only) |
| B2 | Navigate the annotations with VO+arrows | Each blockquote annotation reads with its number and move name (e.g. "[4] Q1 (probing question, L0 …)") |
| B3 | Links list (VO+U → Links) | No bare "click here"; transcript links and the moves-vocabulary link make sense out of context |

## Check C — General pages (spot check 3: home, a module, the observation rubric)

| # | Action | Expected |
|---|---|---|
| C1 | VO+A on a module page | Heading order logical; tables read with headers; the onboarding timeline table reads row-wise |
| C2 | Links list on the home page | Section links make sense out of context; the companion-project link reads as "Socratic AI Tutor" |
| C3 | Tab through a module page | Focus visible at every stop; no keyboard trap; skip-to-content works if present |

## Log

| Check | Result (match / differs) | Notes |
|---|---|---|
| A1–A13 | | |
| B1–B3 | | |
| C1–C3 | | |

Any "differs": note the page, the step, and what VoiceOver actually said — then file it as an accessibility issue in the repository issue tracker, and only describe "manual VoiceOver check passed" once every diff is fixed or explicitly accepted in writing.

*When done: record the date, operator role (owner/volunteer), and results in `STATUS.md`, the README accessibility statement, and `evaluation/METHODS.md` §7.*
