# Agent review — tutor-training-course

**Reviewer:** separate AI reviewer agent (fresh context), 2026-10-26. Limitation: the reviewer may share the same underlying model as the author. This is not human or educator review.

**Label:** Agent review (heuristic evaluation + cognitive walkthrough + structured review + transcript realism review + citation verification). Per the portfolio rules (00-portfolio-overview.md §2), this pass is the *separate fresh-context reviewer* that the in-session review (2026-10-25) queued; it does not substitute for a practitioner/educator review or the pending multi-model panel.

---

## 1 · What the reviewer did

1. Read the spec (`implementation-plans/07-tutor-training.md`) and portfolio standards (`00-portfolio-overview.md` §2) in a fresh context.
2. Read every repo artifact: README, STATUS, DECISIONS, research/ (evidence notes, competency model), all docs/ pages (modules 1–5 + safeguarding, transcripts T1–T6 + practice tool source `index.html`/`practice.js`/`items.json`, live practice, tools, coaching, program, evaluation pages), evaluation/ (METHODS, human-protocol pack, results skeletons, pipelines), CHANGELOG, ATTRIBUTION.
3. Cognitive walkthrough of the live site (https://iwyusdaz.github.io/tutor-training-course/) as three personas, including completing Module 3, playing the spot-the-move tool end-to-end (10 items), reading transcripts, and working the observation rubric's print sheet during a mock 30-minute observation.
4. Heuristic evaluation (Nielsen's 10) against the live site with severity ratings.
5. Transcript realism review of all six transcripts against the M1–M5 misconception bank (repo 03 `spec/misconceptions.md` v1.1) and the repo's own realism-review form criteria (C1–C4), including re-derivation of every algebra line in every transcript.
6. Move-name grep across both repos against `socratic-ai-tutor/spec/pedagogy-rules.md` v1.0.
7. Citation verification: Kraft/Schueler/Falken abstract re-fetched from edworkingpapers.com and checked against the claims; dosage figures traced; one misdirected citation found (see F6).
8. Accessibility: axe-core audit of 3 live pages including the practice tool (`audit-axe.mjs`, output `/tmp/review07-axe`); live interaction with the practice tool (fieldset/legend/radio structure, role=alert validation, role=status feedback, focus management, summary, restart); re-ran the repo's keyboard/reflow suite locally (19/19 pass, content-page checks SKIP on raw docs/, as documented).
9. Live-build integrity check: main-nav HTML of the live site inspected; front matter of all docs pages YAML-validated (two pages fail; see F1 — the headline finding).

**Verified live build state:** the Pages build (commit `03a7fab`, built 2026-10-25T22:11Z) matches local HEAD exactly; the live site is current, so every defect below is live, not stale-cache.

---

## 2 · Verdict summary

The repo is substantially stronger than the plan requires: the competency model genuinely drives modules, rubric and metrics; the transcripts are mostly mathematically sound and annotated with canonical move names; the evaluation governance (PENDING discipline, dry-run separation, honest limitations) is exemplary; accessibility work is real and verified. Move-name consistency with repo 03 is exact (7/7 canonical names, zero non-canonical move labels; grep-verified).

However, the review found **five must-fix defects** that the in-session reviews missed, three of which sit inside artifacts the repo itself designates as calibration anchors or headline content:

- **F1 (must fix):** two pages have invalid YAML front matter (`t1.md`, `pilot-report.md` — unquoted colons in `description`), which breaks the live main navigation on every page (T1 missing from the Transcripts menu, a stray top-level "Transcript T1" item, "Pilot report" orphaned, "Evaluation" showing no children) and strips both pages' `<title>`/og:title/description meta.
- **F2 (must fix):** T2 — a *strong* calibration-anchor transcript — contains a student check line with wrong arithmetic (`−11 and −11` should be `−7 and −7`), which the annotation praises as Mei "checking her own work."
- **F3 (must fix):** T3's header and annotations 5–6 mislabel the misconception (M4 "one-side divide" is named where the exchange shows an M1 one-side *subtraction* and a conceptual check-basis error; no division error occurs anywhere in T3), and annotation 8 calls a tutor move "genuinely good" while the tutor himself models a broken hybrid check.
- **F4 (must fix):** the transcripts' published "Rubric read" scores contradict the rubric's own anchors for T3, T6 and T4 (skipped exit ticket must cap Domain 2 at 1; both transcripts say 2) — a direct collision inside the calibration activity that uses these transcripts.
- **F5 (must fix):** Modules 2, 3, 4 and 5 each present a fabricated dialogue labeled "Excerpt from Transcript Tn" that does not exist in the cited transcript, and the fabricated excerpts mix student names across transcripts (Jayden in a T2/T5 excerpt, DeShawn in a T3 excerpt, Elena in a T1 excerpt).
- **F6 (must fix):** README cites Nickow, Oreopoulos & Quan (2020) with the URL of the *Kraft, Schueler & Falken* paper — two different works sharing one link.
- **F7 (must fix):** the live evaluation-index table describes the completed design review as by a "reviewer agent, did not build this repo," contradicting METHODS §4 and the review form, which both state it was the authoring agent in-session.

None of these are structural: all are fixable with small, local edits plus one rebuild. The program design, measurement spine and honesty infrastructure are sound.

---

## 3 · Ranked findings

Severity: **MUST FIX** (breaks trust, correctness, or a claimed verification) / **SHOULD FIX** (confuses users or undermines a design claim) / **Minor**.

### F1 · MUST FIX — Invalid YAML front matter breaks the live navigation and page metadata on every page

- **Files:** `docs/transcripts/t1.md` (line 4), `docs/evaluation/pilot-report.md` (line 4).
- **Evidence:** both `description:` values are unquoted and contain `: ` sequences ("…three students: greeting…", "…Status: NOT RUN…"). Psych rejects them (`mapping values are not allowed in this context`, verified locally with the same YAML library class Jekyll uses). Jekyll therefore builds both pages with no front-matter data.
- **Live consequence (verified on the deployed site):**
  - The main navigation on **every** page shows a stray top-level item **"Transcript T1 · A strong session"** (title falls back to the H1) after "Pilot report", and T1 is **missing from the Transcripts submenu** (its siblings T2–T6 and the practice tool are there).
  - **"Pilot report"** is orphaned at top level (title fallback "Pilot report" instead of the front-matter title), and "Program measurement" is missing its pilot-report child; **"Evaluation" shows no children at all**.
  - Both pages' `<title>`/og:title lose their descriptive titles (t1 live `<title>` is "Transcript T1 · A strong session"; pilot-report's is "Pilot report"), and their `description` meta falls back to the site-wide description.
- **Why it matters:** T1 is the calibration anchor and the first transcript new tutors are told to read (suggested sequence "T1 → T5 → …"); it is effectively invisible in the site's primary wayfinding. The repo's verification suite (axe, linkcheck, keyboard tests) cannot catch this class of failure — all its checks pass while the nav is broken.
- **Fix:** quote the description values in both files (`description: "…"`), or remove the internal `: `. Then rebuild and spot-check the nav. Add the two-line YAML check (any unquoted `description` containing `: `) to the verification list in STATUS so it cannot regress.

### F2 · MUST FIX — Wrong arithmetic, praised by its annotation, in strong transcript T2 (a calibration anchor)

- **File:** `docs/transcripts/t2.md`, exchange before annotation [11].
- **Evidence:** Mei's problem is `6x + 5 = 2x − 3`. Her solution `x = −2` is correct, and the correct check is `6(−2) + 5 = −7` and `2(−2) − 3 = −7` — i.e. **−7 and −7**. The transcript instead reads: "*(checks)* **−11 and −11!**" — which is the *worked example's* check (`6(−2) + 1 = −11`, `2(−2) − 7 = −11`), not her own problem's. Annotation [11] then says "Note Mei *checked her own work* — Grace never touched the pen," endorsing the wrong check.
- **Why it matters:** T2 is the designated calibration anchor for "Domain 3's L4 row" and one of the two model sessions ("What to steal from T2"). A coordinator or math-confident trainee will catch it instantly, and it undercuts the transcript library's core promise ("errors students make in them are the errors real tutors will meet" — here the *transcript* makes the error). An experienced tutor would not recognize this as realistic strong tutoring; it reads as a transcription slip.
- **Fix:** change the line to "*(checks)* −7 and −7!" (and optionally have Grace confirm the check aloud, which strengthens the L4 hand-back), or have Mei almost-parrot the −11 and Grace catch it — but the simplest honest repair is the correct check.

### F3 · MUST FIX — T3 misconception labels and annotation 8 are inaccurate

- **File:** `docs/transcripts/t3.md` (header, annotations [5], [6], [8]).
- **Evidence:**
  1. Header: "misconception targeted: dividing only some terms (M4)" — **no M4 error occurs anywhere in T3**. The in-session error (Jayla subtracts 2x on the left only) is M1 (operation applied to one side); the second stacked error is a *conceptual check-basis error* (she compares the modified equation's left side, 19, with the original equation's right side, 27 — her arithmetic is correct both times).
  2. Annotation [5] calls the error "M4-flavored, via balance" — mislabel; it is M1 per the M-bank ("applies an operation to only one side" is the canonical M1 behavior, verbatim in repo 03's misconceptions.md).
  3. Annotation [6] says "two errors stacked (the M4 one-side divide AND an arithmetic slip in the check)" — doubly wrong: no division error, and no arithmetic slip (2(4)+19=27 is computed correctly; the error is *which equation* she is checking).
  4. Annotation [8] calls Diego's teach "genuinely good," but Diego's own line ("Recompute the check with x = 4: left is 3(4) + 7 = 19. Right is 2(4) + 19…") is itself a hybrid check mixing two different equations — the annotation never names that the tutor models the same confusion he is diagnosing. A strong algebra tutor reading T3 will trip on this before they trip on anything else.
- **Why it matters:** the in-session realism review records "annotation 6 now names both explicitly" as a *completed fix* — the fix introduced its own mislabels. T3 is a calibration anchor (split scoring) and the model excerpt source for Module 3.
- **Fix:** header → "misconceptions in play: applying an operation to only one side (M1) + misapplied check"; annotation [5] → "M1"; annotation [6] → "two stacked errors: the M1 one-side subtraction, and a check run against the wrong equation (the arithmetic itself is correct)"; annotation [8] → keep the credit for Jayla's recovery but add one clause acknowledging that Diego's recomputation *continues* the mixed-equation framing, and that the level-4 move is "check the *original* equation: substitute x = 4 into 5x + 7 and into 2x + 19 — what do you get?"

### F4 · MUST FIX — Published "Rubric read" scores contradict the rubric's own anchors

- **Files:** `docs/transcripts/t3.md`, `docs/transcripts/t6.md`, `docs/transcripts/t4.md` vs `docs/coaching/observation-rubric.md` (Domain 2 level 1; Domain 5 level 3).
- **Evidence:**
  1. Rubric Domain 2 level 1: "…**exit ticket skipped** (this alone caps the domain at 1…)". T3's rubric read: "Domain 2 = 2 (…; **no exit ticket**)". T6's rubric read: "Domain 2 = 2 (blocks exist but collapse into 'speed round'; **no ticket**)". Both directly violate the cap rule the rubric states in bold.
  2. T4's rubric read: "Domain 5 = 3 (ticket given and collected; **no evidence results shaped the next plan**)" — the Domain 5 level-3 anchor requires "plan shows a data-informed choice"; the parenthetical describes level 2 ("next plan identical regardless of results").
  3. Related wobble: T3's "Domain 1 = 4" requires "a *specific* reference to *each* student's recorded work appears unprompted" — Omar receives only "good to see you, man" (no recorded-work reference), so the anchor text supports 3, not 4.
- **Why it matters:** these transcripts are the calibration activity's anchor set (T1, T3, T5) and the practice ground for "the annotations settle disputes." Coordinators calibrating T3's Domain 2 with the rubric in hand will land on 1 while the page says 2 — the calibration exercise would manufacture disagreement instead of resolving it.
- **Fix:** re-score the three rubric reads to the anchors (T3 Domain 2 → 1, or amend the anchor if the intent was "structure otherwise strong"; T6 Domain 2 → 1; T4 Domain 5 → 2; T3 Domain 1 → 3), and add one sentence to the calibration activity noting the corrected scores.

### F5 · MUST FIX — Modules 2–5 attribute fabricated dialogues to transcripts that do not contain them

- **Files:** `docs/modules/2-the-30-minute-session.md` ("Excerpt from Transcript T2 … minute 22 of 30"), `docs/modules/3-questions-wait-time-and-errors.md` ("Excerpt from Transcript T3"), `docs/modules/4-feedback-and-motivation.md` ("Excerpt from Transcript T1"), `docs/modules/5-using-exit-tickets-and-data.md` ("Excerpt from Transcript T5 … coordinator's data check").
- **Evidence (verified line-by-line against the transcript library):**
  - Module 2's "T2 minute-22" dialogue (`3(x + 2) − 4 = 11`, "Hold that thought — that's exactly our review item tomorrow", "Jayden's is half-finished") appears nowhere in T2; T2's Mei works on `6x + 5 = 2x − 3`, and Jayden is T1's student.
  - Module 3's "T3" excerpt is a DeShawn dialogue on `3x + 5 = 20 → 3x = 20` that exists nowhere in the library; DeShawn is T2's student, T3's students are Jayla/Omar/Sofia.
  - Module 4's "T1" excerpt stars **Elena** (T2's student) on `2(x − 4) = 2x − 4` — not in T1 (whose students are Amara/Jayden/Luis, and whose Elena-less M3 moment is handled differently).
  - Module 5's "T5 coordinator's data check" shows a tutor recording Amara/Jayden/Luis's tickets — T5's students are Imani/Ravi/Cole, and T5's entire plot is that the ticket is *skipped*. The excerpt depicts exactly the behavior T5 exists to condemn, attributed to T5.
- **Why it matters:** this is a credibility defect in a program whose differentiator is traceability ("one model, three uses"; "every claim carries a URL"). Module pages tell learners "Excerpt from [T2]" with a link; any learner who clicks through finds a different session with different names. It also violates the repo's own realism-form premise that everything is checked against its cited source. Module 1 is the near-miss: its T1 excerpt is a light paraphrase of real T1 lines plus an invented "Luis: Ha! Okay." reply.
- **Fix (choose one policy and apply consistently):** (a) replace each fabricated excerpt with a genuine excerpt from the named transcript (preferred — T2 annotation 8, T3 annotation 4–5, T1 annotation 1, and for Module 5 the *coach-side data check* can be relabeled as a constructed scenario), or (b) relabel them honestly as "Constructed example in the style of Tn — not an excerpt." Do not leave "Excerpt from" on text that is not in the source.

### F6 · MUST FIX — README cites Nickow et al. 2020 with the Kraft et al. 2024 URL

- **File:** `README.md`, "The problem" paragraph: "small-scale trials pool at 0.37 SD ([Nickow, Oreopoulos & Quan 2020](https://edworkingpapers.com/ai24-1031)) … 282-RCT meta-analysis ([Kraft, Schueler & Falken 2024](https://edworkingpapers.com/ai24-1031))".
- **Evidence:** `ai24-1031` is the Kraft/Schueler/Falken EdWorking Paper. Nickow, Oreopoulos & Quan (2020) is a different paper (EdWorking Paper 20-267). `research/evidence-notes.md` correctly traces Nickow via CALDER WP 338-0426 §2 and gives no direct Nickow URL — the README link is a copy-paste error, and it is the first citation on the first screen.
- **Fix:** link Nickow to `https://edworkingpapers.com/ai20-267` (or to the CALDER quote as the evidence notes do), and add the URL to evidence-notes §1a.

### F7 · MUST FIX — Live evaluation-index table misstates who performed the completed review

- **File:** `docs/evaluation/index.md`: "Design review | **Agent review** (reviewer agent, did not build this repo) against a structured form | Complete".
- **Evidence:** `evaluation/METHODS.md` §4 and `evaluation/human-protocol/design-review-form.md` both state the completed review was performed **by the authoring agent in-session**, with the separate reviewer pass queued. The live page currently claims the independence that METHODS explicitly disclaims — precisely the labeling error the portfolio's honesty rules prohibit (§2 rule 1–2).
- **Fix:** change the parenthetical to "(in-session authoring-agent pass; separate fresh-context reviewer pass logged 2026-10-26 — see agent review)" once this review is appended, and keep the two statements in sync when the pending panel runs. (If this review's findings are accepted, the row becomes true for *this* pass — but the "Complete" status must not retroactively describe the in-session pass as independent.)

### F8 · SHOULD FIX — README's headline contrast table misdescribes T5's exchange; practice item q7 does the same

- **Files:** `README.md` ("Student shows `2(x − 4) = 2x − 4` and asks 'is that right?'"), `docs/transcripts/practice/items.json` q7 (renders "Imani: 2(x − 4) = 2x − 4… I think so?").
- **Evidence:** in T5 the **tutor** writes the line on the board as her guided-practice prompt and asks Imani "is that right, Imani?"; Imani never shows work or asks. The annotation itself notes the question was "Nadia herself framed." The README and q7 both re-attribute the line to the student.
- **Why it matters:** this is the repo's showcase before/after pair on the first screen. The pedagogical point survives (the fix is named and performed by the tutor; nobody learns what the student was thinking), but the description should match the transcript it cites — especially because q7's feedback sends learners to read the full transcript.
- **Fix:** README: "The tutor poses `2(x − 4) = 2x − 4`, Imani says 'I think so…?', and the tutor names and performs the fix…". q7: render the exchange as in T5 (two tutor turns + Imani's one line).

### F9 · SHOULD FIX — Rubric print sheet has four time blanks for five blocks

- **File:** `docs/coaching/observation-rubric.md`, print version: "D2 Warm-up ≤5′ / Review ≤5′ / GP ≤12′ / IT ≤5′ / ET ≤3′ (actual times) ____ ____ ____ ____".
- **Evidence:** five time boxes, four blanks (verified on the live HTML too). A coordinator filling this during the walkthrough stumbles at exactly the moment the sheet is supposed to prevent friction ("where does the exit-ticket time go?").
- **Fix:** add a fifth blank.

### F10 · SHOULD FIX — T5/T6 annotations cite dashboard numbers that exist nowhere in the repo

- **Files:** `docs/transcripts/t5.md` annotation [7] ("…sessions-with-ticket rate at 40%…"), `docs/transcripts/t6.md` annotation [7] ("…this site's ticket rate at 62% against the ≥90% target").
- **Evidence:** the simulated dashboard's lowest ticket rate is 88% (Maple Ridge); no 40% or 62% figure appears anywhere. The annotations state these as facts about the fictional program's data.
- **Fix:** either phrase them hypothetically ("a group like this can sit at 40% while the school average hides it") or add the two sites to the dashboard table.

### F11 · SHOULD FIX — Practice item q2 relocates the wait-time moment and drops a tutor turn; q9 quotes a line that does not exist

- **Files:** `docs/transcripts/practice/items.json` q2, q9.
- **Evidence:** T1's four-second pause occurs *before* "…plus 5 both sides? So `2x = 16`" (annotation 9), after Luis's "So `2x − 5 = 11`", and Nina's "Say why plus" turn follows. q2 renders the silence *after* `2x = 16` and deletes "Say why plus," so the exchange no longer matches its source. q9's feedback claims "The very next line of T2 is … 'One more, same shape…'" — T2's next line is "Everyone — one solo problem, then it's the ticket. `8x − 3 = 4x + 5`"; the quoted wording does not appear.
- **Fix:** render q2's exchange in T1's order; reword q9's feedback to "the next line of T2 offers the group a similar problem (`8x − 3 = 4x + 5`)".

### F12 · SHOULD FIX — In-session realism review's own records are inaccurate

- **File:** `evaluation/human-protocol/realism-review-form.md`.
- **Evidence:** (a) it records T1 at "11 exchanges" — T1 has 13; (b) its C3 criterion is "10–14 exchanges per session," yet T4 (8), T5 (7), T6 (7) were passed on pacing without a recorded rationale; (c) it records the T3 annotation-6 fix that introduced the F3 mislabels; (d) the design-review form's findings ledger for pass 1 is empty ("*(pass 1 — in-session, authoring agent)*" row, no findings), with accepted findings only traceable via CHANGELOG.
- **Fix:** this review's §6 below supplies corrected per-transcript verdicts; copy them (or rerun the form) so the form reflects an accurate record. Add the C3 short-exchange rationale for T4–T6 (monologue/individual-work sessions) or mark them "pass-with-note."

### Minor findings

- **M1.** `docs/live-practice/session-a.md` label: "60 minutes · Weeks 1" → "Week 1".
- **M2.** `docs/tools/tutor-self-reflection.md` uses "Questions and errors" and the home-page nav shorthand "questioning & errors" for the domain the rest of the repo calls "Questioning and errors" — cosmetic; align if touched.
- **M3.** Module 3's practice answer 3 ("You divided the 4x by 4. What else is on that side…") — "what else is on that side" is confusing for the actual M4 error (nothing else is on the left side; the un-divided terms are on the *right*). Suggest: "You divided the 4x — what did you divide on the other side?" (The exit-ticket bank's item 16 carries the same "what else is on that side" wording; fix both.)
- **M4.** T1's annotation [10] praises Luis's why-answer ("the sign flips because we're subtracting minus 5") — that explanation is itself procedural "flip-rule" language of the kind the repo warns produces M1/M2 errors; Nina accepts it without a follow-up. Fine for a strong-but-human session, but the annotation could name it ("her why-question is asked; Luis's answer is still rule-flavored — a level-4 tutor would probe once more or note it for the tracker").
- **M5.** T1's "Rubric read" awards D4 = 4 partly via anchors ("one small goal set with the group") that the transcript only implies ("that's where we start today"); consider a one-clause justification.
- **M6.** Practice tool: ~1 s flash of the static intro before the engine renders the first exchange (fetch latency); the noscript fallback covers no-JS. Acceptable; could reserve space or render synchronously via an inline JSON script tag.
- **M7.** `evaluation/human-protocol/design-review-form.md` Part B contains an absolute repo-path link (`[T3](/tutor-training-course/transcripts/t3.md)`) that is dead in the repo-file context (works on the live site). Cosmetic.
- **M8.** Module 3 links the phrase "misconception bank" to the exit-ticket bank; the M1–M5 *definitions* actually live in evidence-notes §5 and repo 03's misconceptions.md. Relabel the link.

---

## 4 · Cognitive walkthrough (three personas)

### 4.1 Diego (college-student tutor, no teaching experience)

| Step | Path | Result |
|---|---|---|
| 1 | Land on home | 1 h1, one-line summary, fictional disclaimer, "What's in the program" table. Clear. 0 clicks to understand the offer. |
| 2 | Home → onboarding timeline | 1 click; four-week table with links into every artifact; "course content, not a build schedule" disambiguation is stated on the page. Good. |
| 3 | Home → Modules → Module 3 | 2 clicks. Objective, hook (Tutor A/B/C), ladder table, model, practice with inline strong/weak feedback, "in your next session, try…", reflection, check-yourself. The applied task (write three first lines, then compare with the feedback block) works as self-graded practice. |
| 4 | Module 3 → spot-the-move | 1 click. Played all 10 items end-to-end (see §8). |
| 5 | Module 3's "Excerpt from Transcript T3" | **Stumble (F5):** clicks through to T3 to see the modeled exchange in context; finds no DeShawn and no `3x + 5 = 20 → 3x = 20` anywhere. Trust hit at the module's most important moment. |
| 6 | Transcripts index → T1 | Stumble (F1): T1 is not in the sidebar under Transcripts; a stray top-level "Transcript T1" item exists. Reachable from the index table, so the task completes — but the nav fights the suggested reading order. |

Step counts: home → Module 3 applied task = 3 clicks + one written exercise; home → practice tool summary = 4 clicks + 20 radio selections + 10 checks. All within reason for a ≤25-minute module.

### 4.2 Grace (career changer, 52)

- Her persona is used well: she is the tutor in T2 (strong), and Module 2's failure-mode hook is a Grace-like over-runner — she can see herself on both sides, which is the right design.
- Session plan template: the copy-block template plus a fully worked fictional example is exactly right for a method-rusty career changer; the "exit ticket chosen BEFORE the session" rule is impossible to miss.
- **Stumble (F5, Module 2):** the "Excerpt from Transcript T2, minute 22 of 30" sends her to T2, where neither the dialogue nor "Jayden" exists. A detail-oriented former accountant is precisely the reader who checks.
- Module 4's three-habit structure (specific feedback / confirm-why-once / offer-similar) is skimmable and jargon-free; the "one detail that couldn't be said to any other student" bar is a memorable heuristic.
- Tools page → progress tracker and self-reflection: printable, privacy rules stated inline (initials only). No stumbles.

### 4.3 Ms. Okafor (site coordinator)

- Rubric: one page, five domains × four levels, all anchors behavioral ("what you'd see and hear"), with a print tick-sheet and "lower level wins" scoring rule. Usable in 30 minutes — with two snags: **four blanks for five time boxes (F9)** during the mock observation, and the calibration anchors' published scores that contradict the anchors themselves (F4).
- Mock observation using T3 as the "live" session: marking ticks while reading works; the D2 row forces the ticket question, which is the sheet's best design feature ("exit ticket skipped" is unmissable).
- Calibration activity: the four-round protocol (independent → compare → severity → split scoring) is concrete and the sample dialogue is realistic. **Stumble (F4):** Round 4 says "questioning at 4, data use at 1" for T3, which matches — but any scorer who reads T3's own "Rubric read" sees Domain 2 = 2 with "no exit ticket," against the level-1 cap. The exercise would teach that the anchors lose to the transcript pages.
- Coaching cycle: SVG renders with title/desc; Mermaid source retained; text description present. The "choosing the focus move" overrides (data-loop first; D3 at 2; relationships can't be first focus) are operationally sensible.
- Dashboard: simulated, labeled; Maple Ridge read → interpretation → owner'd action plan → week-9 re-check. The "calibration re-check before concluding a weak site" line on Summit is a nice honest touch.

### 4.4 Where personas stumble — summary

Every stumble found is in the F-list (F1, F4, F5, F9); no dead ends, no broken task flows, no place where a persona could not complete the assigned task. The live site's navigation (F1) is the only wayfinding defect.

---

## 5 · Heuristic evaluation (Nielsen's 10) — live site

Severity: 0 = no problem, 1 = cosmetic, 2 = minor, 3 = major, 4 = catastrophic.

| # | Heuristic | Severity | Evidence |
|---|---|---|---|
| H1 | Visibility of system status | 1 | Practice tool shows "Exchange n of 10" and a heading that receives focus — good. First ~1 s shows the static intro before the engine renders (M6). |
| H2 | Match with the real world | 0 | Audience language ("exit ticket", "warm-up"); move names defined before use; hint-ladder table in Module 3. |
| H3 | User control and freedom | 0 | Tool has Back / Start over; module pages skimmable; noscript fallback; "Back to top". |
| H4 | Consistency and standards | **3** | F1 (nav shows T1 outside its section, orphaned Pilot report, childless Evaluation) and F4/F5 (rubric scores and module excerpts that contradict their cited sources). |
| H5 | Error prevention | 1 | Tool blocks empty checks with a clear alert naming what is missing. Rubric print sheet's 4-blank bug (F9) is a small capture-error invite. |
| H6 | Recognition over recall | 0 | Annotations repeat move names in full each time; tool feedback restates the move name and rule. |
| H7 | Flexibility and efficiency | 0 | Keyboard path equals mouse path (suite 19/19 locally; live interaction verified); online-delivery variants for both live sessions. |
| H8 | Aesthetic and minimalist design | 0 | One job per page; tables only where tabular; labels/badges used sparingly. |
| H9 | Help users recognize and recover from errors | 0 | Wrong answers get "the move was X" + why + transcript link; "Lower scores are information, not verdicts." |
| H10 | Help and documentation | 1 | Check-yourself answers, facilitator notes, glossary-in-place; M8's mislabeled "misconception bank" link is a small wayfinding miss inside help content. |

**Overall:** no severity-4 issues; one 3 (H4, entirely attributable to F1/F4/F5); the interaction design of the practice tool is genuinely good.

---

## 6 · Transcript realism review (the key required check)

Method: each transcript re-read against repo 03 `spec/misconceptions.md` v1.1 (M1–M5) and `pedagogy-rules.md` v1.0; **every algebra line in every transcript re-derived**; tutor behavior compared with the documented failure modes; the repo's realism-form criteria C1–C4 applied. Verdicts use the form's scale.

| Transcript | C1 misconception match | C2 response plausibility | C3 pacing | C4 representation | Verdict (this review) |
|---|---|---|---|---|---|
| T1 strong | pass — M3 review integrated aloud ("Did the 3 hit both terms?"); no in-session error needed | pass — 13 exchanges, all tutor turns ≤ ~20 words, wait time counted on the page | pass (block timestamps 0:00/5/10/24/29; ticket +2 min within S2's ±2′) — minor: Luis's why-answer is rule-flavored and accepted (M4) | pass | **pass** (with M4/M5 notes) |
| T2 strong | pass — Tomás's `7x − 4 → 7x + 4` is canonical M2; the L4 worked example targets the exact step | pass — L1 nudge, wait time under pressure, worked example + hand-back are all textbook | pass (12 exchanges, 0:00→0:29) | pass | **pass-with-edits — F2: Mei's check values (−11/−11) are wrong for her problem (−7/−7) and the annotation endorses them** |
| T3 mixed | **fail-as-labeled — header promises M4; the exchange shows M1 (one-side subtraction) + a conceptual check-basis error; no division error exists** (F3) | pass — the near-miss rescue is a realistic mixed-session moment, and annotation [7]'s "compute it for her" flag is fair | pass (struggle arc consumes 0:10–0:22 believably) | pass | **needs-rework (labels/annotations only; the dialogue itself is sound)** |
| T4 mixed | pass — Andre's "put 7 after the x" is the canonical M5 disclosure; Camila's x = 2 is a plausible M2 slip | pass — "Good job ×3", the board re-derivation, and the deferred M5 moment are all recognizable weak-attention patterns | pass-with-note — 8 exchanges; **9 unexplained minutes 0:16→0:25 with zero shown exchanges** | pass (name/role check clean) | **pass-with-edits — F4 (Domain 5 score) + pacing note** |
| T5 weak | pass — Imani's `2x − 4` is canonical M3; Nadia's naming-and-correcting is the documented failure | **pass — and the key realism question is yes**: the sympathetic over-explainer (prepared, warm, "I stayed up making it") is exactly what conscientious beginners drift into; the monologue is mathematically correct throughout, which is what makes it believable | pass-with-note — 7 exchanges/27 min; the monologue's word count (~90 s claimed) and the 0:17–0:27 "fast" run are stretched but defensible for a slow new tutor; only start/mid/end timestamps given | pass | **pass** |
| T6 weak | pass-with-edit — Aaliyah's M2 ("moved the 2 but added it") is canonical; **header claims M4 in play, but no M4 behavior occurs** (Mateo's `x = 0` is simply correct); annotation [4]'s "M4-adjacent" label is unsupported | pass — the takeover over "But—" and the speed-round economy are highly recognizable; the dismissed `x = 0` question ("Weird one, right? Zero's allowed, don't worry about it") is exactly the real moment the annotation says it is | pass-with-note — 7 exchanges + 90-second speed round in 25 min; middle is thin (individual work implied, not shown) | pass | **pass-with-edits — F4 (Domain 2 score) + header M4 claim** |

**Direct answers to the questions posed:**

- **Do T5's monologue and T6's takeover read like real over-explainers rather than strawmen?** Yes. Both weak tutors are given competent math, plausible warmth, and internally consistent motives (Nadia: preparation as care; Felix: pace as engagement). The failure modes are the documented ones (over-explaining; answering for the student; speed-as-prize; skipped ticket). Two caveats keep them from "experienced-tutor recognizable" without edits: T2's check-value error (F2) sits in the *strong* anchor, and T6's header/annotation M4 claim (above) mislabels its own content.
- **Is T6's dismissed-question moment plausible?** Yes — it is the best-realism moment in the library. Mateo's `9x + 4 = 4x + 4 → x = 0` is mathematically correct (re-derived: 5x = 0 → x = 0; check 4 = 4 ✓), the question "is that allowed? Zero?" is the genuine conceptual ask, and "don't worry about it" is the exact wave-away real fast tutors produce. The annotation's repair of the earlier draft (no longer implying a math error) is correct.
- **Are the annotations accurate about which move is used and its effect?** Mostly yes — move *names* are used correctly in all 60+ annotations (grep-verified against the canonical seven). The accuracy failures are in misconception *labels* (T3, T6 header) and two effect claims (T2 annotation [11] endorsing a wrong check; T3 annotation [8] over-praising a tutor line that models the confusion it diagnoses).
- **Would an experienced tutor recognize these sessions as realistic?** T1, T5, T6: yes. T2: yes except the check line (F2). T3: the dialogue yes; the labels no. T4: yes.

---

## 7 · Timing plausibility (30 minutes, 2–4 students, routine blocks)

| Transcript | Exchanges | Word profile | Block timeline | Verdict |
|---|---|---|---|---|
| T1 | 13 | Tutor turns ~10–20 words; 1 counted 4-s pause | 0:00 greet → 0:05 warm-up+review → 0:10 guided (14′ for 9 turns incl. board work) → 0:24 independent → 0:29 ticket (+2′, inside ±2′) | **Plausible** |
| T2 | 12 | Grace's turns longer; L4 worked example ~100 words | 0:00 → 0:04 warm-up (90 s solo) → 0:08 guided (17′: Tomás repair + Mei L4 arc + hand-back + retry + check) → 0:25 independent+ticket | **Plausible** |
| T3 | 10 | Moderate; struggle arc has short turns | 0:10–0:22 check-confusion arc: 12′ is realistic for that repair; 0:22–0:26 independent try cut short | **Plausible** |
| T4 | 8 | Quick exchanges | **0:16 → 0:25 contains zero shown exchanges (9 unexplained minutes)**; blocks otherwise on time | **Pass with note** — add one exchange (e.g., Priya/Camila solo work) or a stage direction |
| T5 | 7 | Nadia ~250 words of monologue across the session | 0:00–0:09 monologue + 2 worked examples (generous but defensible with board copying); 0:17–0:27 "together really fast" run of 3 examples in 10′ is slow for the words shown | **Pass with note** — weak sessions under-timestamped vs T1's block markers |
| T6 | 7 + speed round | Fast exchanges; 3-problem, 90-s race | 0:02 → 0:27; per-student problems imply unseen individual work between exchanges | **Pass with note** |

The realism form's own C3 band ("10–14 exchanges") is not met by T4/T5/T6; the right response is a recorded rationale (monologue and individual-work sessions legitimately compress shown exchanges), not a silent pass (F12). No transcript is *impossible* in 30 minutes; T1's arithmetic is exact throughout (2(x−4)+3=11 → x=8; 3(x+2)−5=16 → x=5; ticket 4(x−1)+2=14 → x=2 ✓).

---

## 8 · Move-name consistency with repo 03 (binding check)

Grep of both repos (`docs/`, `research/`, `items.json`, README) vs `socratic-ai-tutor/spec/pedagogy-rules.md` v1.0:

| Canonical move | Occurrences (this repo) | Verdict |
|---|---|---|
| probing question | 74 | exact |
| hint ladder (levels 0–5) | 23 + 5 bare "levels 0–5" | exact; L0–L5 rung names (conceptual nudge / strategy hint / partial step / worked example / full solution) match repo 03's ladder table |
| wait time | 50 (40 unhyphenated; 26 "wait-time" attributive uses — grammatical, not naming drift) | exact |
| specific feedback | 26 | exact |
| worked example after repeated failure | 17 | exact |
| confirm and ask why | 20 | exact |
| offer a similar problem | 18 | exact |

Non-canonical distractor labels from the plan ("telling", "praise for effort", "redirect") appear **nowhere as move labels** (D11 honored); "none of these — …" failure-mode options in the tool name the failure, not a fake move. Domain names: 5/5 exact across competency model, modules, rubric, alignment table, measurement plan (two cosmetic shorthands: M2). **No move-name deviations to report.** The M1–M5 taxonomy in evidence-notes §5 matches repo 03's misconception bank v1.1 definitions and probes (the *labels used inside T3/T6* are the problem — F3 — not the taxonomy).

---

## 9 · Competency-model coherence

Trace of each domain through model → module → rubric → metric:

| Domain | Module | Rubric row | Metric (measurement plan / dashboard) | Coherent? |
|---|---|---|---|---|
| 1 Relationships | M1 (R1–R4 behaviors quoted) | D1 4-level behavioral anchors | Rubric mean D1 ≥3.0; observation ticks | yes |
| 2 Session structure | M2 (five-block table = S1 verbatim) | D2 (block times 5/5/12/5/3 identical to S1) | Sessions-with-ticket ≥90%; observed block timings | yes — but transcript "Rubric read" applications contradict D2's level-1 cap (F4) |
| 3 Questioning and errors | M3 (Q1–Q6; ladder table matches repo 03) | D3 (L0/L1–L4/wait-time/L4 anchors) | Rubric D3; observation ticks (rung sequence logged) | yes |
| 4 Feedback and motivation | M4 (F1–F4 chain) | D4 (specific/confirm-why/similar-problem/normalize) | Rubric D4; observation tick chain | yes |
| 5 Data use | M5 (D1–D4 loop; tracker) | D5 (ticket/tracker/derive/flag) | Tracker same-day check; flag rate; sessions-with-ticket | yes |

The alignment table's rows are all fillable (spot-checked against every linked artifact; the "empty-row test" is real, not decorative). The single coherence failure is application-level (F4), not naming-level.

**Rubric behavioral anchors (binding check):** all 4 levels × 5 domains are phrased as observable events ("count them", "×N — count it", "'good job' ×N"), each level-4 behavior maps to a print-sheet tick, and the sheet fits one page. Two anchor-implementation defects: the 4-blank/5-box bug (F9) and the transcripts' non-conforming published scores (F4). Usable in a 30-minute observation: yes, with the L4 row marked "n/a" provision — good design for sessions where no student fails 3×.

---

## 10 · Dosage / effect-size citation verification

| Claim (where used) | Source check | Verdict |
|---|---|---|
| Small-scale trials pool ≈ 0.37 SD (README; evidence-notes §1a) | Traced to CALDER WP 338-0426 §2, quoted verbatim | **supported** — but the README's inline URL points to the wrong paper (F6) |
| Large programs 0.16–0.21 SD in preferred samples; virtual ~0.07 SD (README; evidence-notes §1b; docs home "a third to a half as much") | EdWorking Papers ai24-1031 abstract re-fetched 2026-10-26: "expanded meta-analysis of 282 randomized control trials"; "only a third to a half as large as those from our full sample"; "stark declines in pooled effect sizes as tutoring program scale increases" — all three quoted phrases match the evidence notes verbatim; the specific 0.16/0.21/0.07 figures are in the PDF body, which the notes claim to have read with quotes | **supported at abstract level; no contradiction found** |
| Dosage ~90 min/week; typical student ~72 (README; M2; measurement plan; dashboard) | Pearl Education & Whiteboard Advisors press release + report page quoted in evidence-notes §2 with URLs and access date; 883,882 sessions / 64,044 students / 28 programs; "91% of the difference in weekly minutes was among students in the same program" | **supported; used consistently** (README "~884,000" = the precise 883,882; plan's "~900,000" headline correctly superseded) |
| Plan correction (0.03–0.10 SD → 0.16–0.21/0.07) | Documented in evidence-notes §1b/§6, DECISIONS D1, CHANGELOG, METHODS §1 — four places, consistent | **exemplary** |
| ≥85% same-tutor; +0.5 rubric growth; ≥3.0 mean; ≥90% ticket rate | Plan's targets, restated identically in measurement plan, rubric aggregates, dashboard reading rules, alignment table | **consistent** |

One additional nit: measurement plan attributes the at-scale drop to implementation citing Kraft et al. — the paper supports decline-with-scale; the *implementation attribution* is the repo's (reasonable) reading layered on CALDER's case study. The wording "attributes… substantially to implementation" slightly overstates Kraft et al., which reports the decline; CALDER supplies the implementation mechanism. Suggest "the at-scale evidence documents the drop (Kraft et al.); the Guilford case study shows the implementation levers (CALDER)."

---

## 11 · Honesty sweep

| Check | Result |
|---|---|
| Every transcript labeled "Fictional transcript, constructed for training purposes" | **pass** — all six verified, plus the library index, practice tool page, items.json meta, and site-wide footer |
| No fabricated pilot results | **pass** — pilot report is a template with an explicit empty-results commitment; results tables read "PENDING: requires API key" (32 markers); `dry-run/` outputs headed "DRY RUN – NOT REAL RESULTS" and separated from `evaluation/results/`; D15 documents the decision to use designed examples instead of inventing pilot quotes |
| Simulated-dashboard labeling | **pass** — page-level label + footer + "What a simulated dashboard can and cannot show" section |
| Safeguarding placeholder only | **pass** — names categories, no legal guidance, explicitly "no fictional 'policy'", outranks-the-loop line |
| AI-assisted authorship disclosed | **pass** — README "Tools used" discloses and describes the review process |
| [Email]/[LinkedIn] untouched | **pass** — README line 108 |
| README evaluation-status line matches reality | **pass with one exception** — README/METHODS/STATUS are accurate and mutually consistent; the *site's* evaluation-index table overstates review independence (F7). Also: this review is the "separate reviewer pass queued" that STATUS §Pending item 4 promised — after this file is reviewed, STATUS/METHODS should record it |
| No learning-gain / "validated" claims | **pass** — grep-clean; can/cannot tables present on README, METHODS, dashboard, pilot report, measurement plan |
| Move/author labeling of reviews ("Agent review", never "educator") | **pass** everywhere except F7's parenthetical |

---

## 12 · Accessibility spot-check

- **axe-core (audit-axe.mjs, 2026-10-26):** live home, live practice tool, live observation rubric — **0 violations** (critical/serious/moderate/minor) on all three; 1 incomplete heuristic item each (matching the repo's committed audit summaries). Reproduces the repo's claimed all-pages result on the sampled pages.
- **Practice tool, live interaction (10 items played):** fieldset/legend groups exposed as named radio groups; all options labeled; empty check → `role="alert"` "Choose a move and whether it worked, then check your answer."; feedback in `role="status"` with the feedback `<h3 tabindex="-1">` receiving focus after every item (verified 10/10); summary table with caption and scoped column headers; "Start over" returns to Exchange 1; nothing stored (repo test asserts no storage; page states it in text too). Noscript fallback present and equivalent-in-intent.
- **Repo keyboard/reflow suite re-run locally:** 19/19 pass (content-page h1/reflow checks SKIP on raw docs/ as documented — they require a built site).
- **Not verified by this review (and not claimed by the repo):** screen-reader listening experience; the manual VoiceOver protocol remains the open item.
- One caveat: the nav defect (F1) is invisible to axe (it is correct-but-confusing structure) — a reminder that the verification suite needs a content/nav-integrity check (suggested in F1's fix).

---

## 13 · Structured form completion (design-review-form.md, Part A/B/C)

**Part A — heuristic scores (0–2 scale of the form):** H1 1 · H2 2 · H3 2 · H4 **0** (F1/F4/F5) · H5 1 · H6 2 · H7 2 · H8 2 · H9 2 · H10 1.

**Part B — walkthrough tasks:**
- T1 (complete Module 3's practice): **pass** — written task works; inline feedback; one link-label nit (M8).
- T2 (run the spot-the-move tool to summary): **pass** — 10/10 items, alert/status/focus verified live; q2/q9 fidelity notes (F11).
- T3 (fill the session plan template for tomorrow): **pass** — copy-block + worked example; misconception-target-has-a-source rule is enforced by the form's own fields.
- T4 (coordinator scores T3 with the rubric print sheet): **pass with defects** — the sheet works but 4 blanks/5 boxes (F9); the printed "Rubric read" on T3 collides with the anchors (F4).
- T5 (new coordinator runs the calibration activity): **pass with defects** — protocol is runnable end-to-end; F4 makes round 4's anchor inconsistent with the transcript pages it points at.

**Part C — honest-labeling audit:** all rows pass except the "No 'educator/expert review' language" row needs the F7 correction on docs/evaluation/index.md.

**Findings ledger (pass 2 — separate fresh-context reviewer agent, 2026-10-26):** F1–F12 above + M1–M8. Recommended disposition: F1–F7 = accept and fix before any further evaluation runs reference the affected artifacts; F8–F12 = accept; minors = accept or decline with a logged reason.

---

## 14 · What is genuinely good (kept brief, but said)

- The **dosage/effect-size correction** (0.03–0.10 → 0.16–0.21/0.07) is exactly what evidence discipline should look like: caught, documented in four places, and propagated consistently.
- The **evaluation governance** — PENDING discipline, dry-run separation, `.env` gate with exit-1, blind-scoring mechanics, labeled reviews, can/cannot tables everywhere — meets the portfolio's honesty rules better than most human-written repos would.
- The **practice tool** is a model of small-scope accessible design: correct semantics, alert/status/focus choreography, honest "nothing is stored," graceful noscript and load-failure fallbacks.
- The **coaching system** (rubric → cycle → conversation guide → calibration) is operationally coherent, and the conversation guide's defensiveness scripts are the best writing in the repo.
- **Move-vocabulary discipline** with repo 03 is exact — the portfolio's cross-repo thread actually holds under grep.
- T6's dismissed-question moment and T5's sympathetic over-explainer are the two strongest realism achievements; T1's block timestamps make it a genuinely usable pacing model.

## 15 · Reviewer's closing note

The defects found are concentrated in *cross-reference integrity* (transcripts ↔ annotations ↔ rubric scores ↔ module excerpts ↔ nav), which is precisely the failure mode the repo's own alignment-table philosophy warns about — "an objective with no metric is decoration" has a sibling: *a link that points at text that isn't there is a liability*. All fixes are small; none require redesign. After F1–F7 are fixed and this file is acknowledged in METHODS/STATUS, the repo's remaining open items (API-key runs, pilot, VoiceOver, practitioner realism review) are correctly queued and honestly gated.

*End of agent review — separate fresh-context reviewer agent, 2026-10-26. Same-model limitation applies.*
