#!/usr/bin/env node
// Transcript-realism review panel — PENDING PIPELINE (requires API key).
//
// What it does when run for real:
//   - MODEL_B and MODEL_C (>= 2 models, per the portfolio rule) INDEPENDENTLY
//     review all six fictional transcripts (docs/transcripts/t1..t6.md) for
//     realism against the misconception research, using the same four
//     criteria (C1-C4) and the same pass/pass-with-edits/needs-rework verdict
//     scale as evaluation/human-protocol/realism-review-form.md.
//   - MODEL_A, if configured, adds a third independent voice (it never
//     reviews anything it authored — the transcripts were drafted by the
//     authoring agent, not by a model slot).
//   - Agreement is reported as percent agreement + Cohen's kappa on verdicts,
//     plus matched-findings overlap.
//
// Honesty rules encoded here:
//   - Method label: "AI review panel" — NEVER "educator review", "expert
//     feedback" or "practitioner review". Panel models may share the
//     authoring agent's underlying model — stated as a limitation in the
//     summary. A realism review can find inconsistency with the cited
//     research; it cannot certify that real classrooms sound like this.
//   - Raw outputs go to evaluation/output/review-panel/ (gitignored); the
//     summary at evaluation/results/review-panel-summary.md is regenerated
//     for hand-committing. Dry-run stubs go to dry-run/ headed "DRY RUN –
//     NOT REAL RESULTS" and are never used as results.
//
// Usage:
//   node evaluation/run-review-panel.mjs            (real run; needs .env)
//   node evaluation/run-review-panel.mjs --dry-run  (stub outputs to dry-run/, no network)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireSlots, slotIfConfigured, isDryRun, ensureDir, writeJson, chat, extractJson, DRY_RUN_HEADER } from "./lib/env.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(repoRoot, "evaluation", "output", "review-panel");
const summaryPath = path.join(repoRoot, "evaluation", "results", "review-panel-summary.md");
const dryDir = path.join(repoRoot, "dry-run", "review-panel");
const dry = isDryRun(process.argv);
const dryHeader = () => (dry ? `${DRY_RUN_HEADER}\n\n` : "");

const TRANSCRIPTS = [
  "docs/transcripts/t1.md",
  "docs/transcripts/t2.md",
  "docs/transcripts/t3.md",
  "docs/transcripts/t4.md",
  "docs/transcripts/t5.md",
  "docs/transcripts/t6.md"
];

// Misconception reference (from the companion repo's misconception bank,
// https://github.com/iwyusdaz/socratic-ai-tutor/blob/main/spec/misconceptions.md,
// v1.0 2026-10-25 — embedded verbatim-in-substance so the panel reviews
// against the same reference the in-session agent review used).
const MISCONCEPTIONS = `M1 — Applying an operation to only one side: learner "moves" a term by operating on one side only (from 3x + 5 = 20, subtracts 5 on the left to write 3x = 20). Cause: memorized "move it over" procedure without the balance idea.
M2 — Sign errors when moving terms: 3x = 20 - 5 becomes 3x = 25, or moving -4 flips the sign of the wrong term; x - 4 = 10 becomes x = 6. Cause: "change the sign when it crosses" applied indiscriminately.
M3 — Distributing incorrectly: 2(x - 4) -> 2x - 4. The outer factor multiplies only the first term inside the parentheses. Cause: distributive property memorized as "multiply the first thing".
M4 — Dividing only some terms: from 4x = 12 writes x = 12; or from 4x + 2 = 14 divides 4x and 14 by 4 but leaves + 2. Cause: "get rid of the coefficient" executed on the visible x-term only.
M5 — Equals sign as "the answer comes next", not as balance: chaining operations down the margin (3x + 5 = 20 = 15 = 5), or treating what follows = as the answer slot. (Grounded in Knuth, Stephens, McNeil & Alibali 2006.)`;

const CRITERIA = `C1 · Misconception match — each scripted student error must behave like its tagged misconception (M1-M5 above). Would a student with this misconception produce exactly this line — or is the error a fantasy of it?
C2 · Response plausibility — do the tutor's lines sound like real tutors under time pressure, including in the weak transcripts? Weak-session failure modes (over-explaining, answering for the student, skipping the exit ticket) must be recognizable, not caricature.
C3 · Pacing plausibility — could this exchange sequence fit inside 30 minutes with 2-4 students? (Rough check: ~40-80 tutor words per exchange, 10-14 exchanges per session.)
C4 · Respectful representation — students depicted as capable people with documented, nameable misconceptions; never comic relief, never stereotype-coded names or behaviors, never deficit language.`;

const SCHEMA = `{
  "transcript": "FILE_PATH",
  "reviewer": "REVIEWER_ID",
  "simulated": true,
  "criteria": {
    "C1": {"verdict": "pass|fail", "note": "one or two sentences, citing the specific error lines"},
    "C2": {"verdict": "pass|fail", "note": "..."},
    "C3": {"verdict": "pass|fail", "note": "..."},
    "C4": {"verdict": "pass|fail", "note": "..."}
  },
  "verdict": "pass|pass-with-edits|needs-rework",
  "edits_needed": [{"where": "exchange/annotation", "what": "specific edit"}],
  "overall_note": "one paragraph"
}`;

function reviewPrompt(reviewerId, transcriptRel) {
  const text = fs.readFileSync(path.join(repoRoot, transcriptRel), "utf8").slice(0, 16000);
  return `You are a MODEL performing a structured transcript-realism review for a tutoring training program. You are not a human expert; label nothing as human judgment.

The transcripts under review are FICTIONAL, constructed for training purposes. Your job: check each one for REALISM AGAINST THE RESEARCH, not pedagogical soundness (that is the rubric's job) or writing quality.

Reference — the five misconception patterns (from the misconception bank of the companion repo, Socratic AI Tutor):
${MISCONCEPTIONS}

Criteria (from the realism-review form):
${CRITERIA}

--- TRANSCRIPT: ${transcriptRel} ---
${text}

Respond with JSON exactly like:
${SCHEMA.replaceAll("FILE_PATH", transcriptRel).replaceAll("REVIEWER_ID", reviewerId)}`;
}

function kappa(xs, ys) {
  const cats = [...new Set([...xs, ...ys])];
  const n = xs.length;
  const observed = xs.filter((x, i) => x === ys[i]).length / n;
  const pa = {}, pb = {};
  for (const c of cats) {
    pa[c] = xs.filter((x) => x === c).length / n;
    pb[c] = ys.filter((y) => y === c).length / n;
  }
  const expected = cats.reduce((acc, c) => acc + pa[c] * pb[c], 0);
  if (expected === 1) return { observed, expected, kappa: observed === 1 ? 1 : 0 };
  return { observed, expected, kappa: (observed - expected) / (1 - expected) };
}

function tokenize(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w.length > 3);
}
function textOverlap(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / Math.min(A.size, B.size);
}

function collectReviews(scoreDir, suffix) {
  const reviews = new Map(); // transcript -> {verdict, edits[]}
  if (!fs.existsSync(scoreDir)) return reviews;
  for (const f of fs.readdirSync(scoreDir)) {
    if (!f.endsWith(suffix)) continue;
    try {
      const r = JSON.parse(fs.readFileSync(path.join(scoreDir, f), "utf8"));
      if (r.verdict && r.transcript) reviews.set(r.transcript, { verdict: r.verdict, edits: r.edits_needed || [] });
    } catch { /* skip unreadable */ }
  }
  return reviews;
}

async function runReal() {
  const required = requireSlots(["MODEL_B", "MODEL_C"]); // exits(1) before any network if unset
  const optionalA = slotIfConfigured("MODEL_A"); // loadDotenv already ran inside requireSlots
  ensureDir(outDir);

  const reviewers = [
    { id: "MODEL_B", slot: required.MODEL_B },
    { id: "MODEL_C", slot: required.MODEL_C },
    ...(optionalA ? [{ id: "MODEL_A", slot: optionalA }] : [])
  ];
  // A model never reviews output it authored: refuse an MODEL_A that is the
  // same model name as a scorer only if we ever let models author transcripts
  // (we do not — transcripts are static repo files). Kept as a guard anyway.
  const names = reviewers.map((r) => r.slot.model);
  if (new Set(names).size !== names.length) {
    console.error(`[Review panel] Refusing to run: two reviewer slots resolve to the same model name (${names.join(", ")}). Panel diversity requires distinct models.`);
    process.exit(1);
  }

  console.log(`[Review panel] ${reviewers.length} reviewers x ${TRANSCRIPTS.length} transcripts. Label: AI review panel — not educator or expert review.`);

  for (const t of TRANSCRIPTS) {
    for (const { id, slot } of reviewers) {
      const fileId = t.replace(/^docs\//, "").replace(/[/.]/g, "-");
      const file = path.join(outDir, `${fileId}-${id.toLowerCase()}.json`);
      if (fs.existsSync(file)) { console.log(`[Review panel] ${t} · ${id}: cached`); continue; }
      process.stdout.write(`[Review panel] ${t} · ${id} … `);
      try {
        const text = await chat(slot, [
          { role: "system", content: "You are a model performing a structured transcript-realism review. Respond with strict JSON only." },
          { role: "user", content: reviewPrompt(id, t) }
        ], { temperature: 0 });
        const parsed = extractJson(text);
        writeJson(file, {
          transcript: t, reviewer: id, reviewer_model: slot.model, simulated: true,
          method: "AI review panel — not educator or expert review", generated: new Date().toISOString(), ...parsed
        });
        console.log("ok");
      } catch (err) {
        console.log("FAILED");
        writeJson(file.replace(".json", ".failed.json"), { transcript: t, reviewer: id, error: String(err.message || err) });
      }
    }
  }

  writeSummary(reviewers, summaryPath);
  console.log(`[Review panel] Raw outputs in evaluation/output/review-panel/ (gitignored).`);
  console.log(`[Review panel] Summary regenerated at evaluation/results/review-panel-summary.md — review it, then commit by hand.`);
  console.log(`[Review panel] NEXT: follow the rerun procedure in evaluation/METHODS.md to refresh METHODS.md and README status lines.`);
}

function writeSummary(reviewers, outPath) {
  const scoreDir = dry ? dryDir : outDir; // a dry run never reports results from a previous real run
  const lines = [];
  lines.push(`${dryHeader()}# Transcript-realism review panel — results summary`);
  lines.push("");
  lines.push(`Generated: ${dry ? "DRY RUN (stub)" : new Date().toISOString().slice(0, 10)} · Method: **AI review panel** (${reviewers.map((r) => r.slot.model).join(", ")}) · 6 fictional transcripts × 4 realism criteria (C1-C4).`);
  lines.push("");
  lines.push("> **Limitation (always stated):** panel models may share the underlying model that drafted the transcripts; they are not human experts, and this is not educator or practitioner feedback. A realism review can find inconsistency with the cited misconception research; it cannot certify that real classrooms sound like this.");
  lines.push("");
  lines.push("## Verdicts per transcript");
  lines.push("");
  lines.push("| Transcript | " + reviewers.map((r) => r.id).join(" | ") + " |");
  lines.push("|---|" + reviewers.map(() => "---").join("|") + "|");
  let any = false;
  for (const t of TRANSCRIPTS) {
    const cells = reviewers.map((r) => {
      const rev = collectReviews(scoreDir, `-${r.id.toLowerCase()}.json`).get(t);
      return rev ? rev.verdict : "PENDING: requires API key";
    });
    if (cells.some((c) => c !== "PENDING: requires API key")) any = true;
    lines.push(`| ${t.replace("docs/transcripts/", "")} | ${cells.join(" | ")} |`);
  }
  if (!any) lines.push("_All cells PENDING: requires API key._");
  lines.push("");
  lines.push("## Agreement on verdicts");
  lines.push("");
  lines.push("| Pair | n | % agreement | Cohen's kappa |");
  lines.push("|---|---|---|---|");
  const pairs = [];
  for (let i = 0; i < reviewers.length; i++) {
    for (let j = i + 1; j < reviewers.length; j++) pairs.push([reviewers[i], reviewers[j]]);
  }
  let anyPair = false;
  for (const [ra, rb] of pairs) {
    const va = collectReviews(scoreDir, `-${ra.id.toLowerCase()}.json`);
    const vb = collectReviews(scoreDir, `-${rb.id.toLowerCase()}.json`);
    const xs = [], ys = [];
    for (const t of TRANSCRIPTS) {
      if (va.has(t) && vb.has(t)) { xs.push(va.get(t).verdict); ys.push(vb.get(t).verdict); }
    }
    if (xs.length) {
      const k = kappa(xs, ys);
      lines.push(`| ${ra.id} vs ${rb.id} | ${xs.length} | ${(k.observed * 100).toFixed(1)}% | ${k.kappa.toFixed(3)} |`);
      anyPair = true;
    } else {
      lines.push(`| ${ra.id} vs ${rb.id} | PENDING: requires API key | PENDING: requires API key | PENDING: requires API key |`);
    }
  }
  if (!anyPair) lines.push("_No pairs scored yet._");
  lines.push("");
  lines.push("## Matched findings (edits proposed by more than one reviewer)");
  lines.push("");
  lines.push("A finding counts as matched when two reviewers propose edits on the same transcript with tolerant text overlap (≥ 0.3 token overlap). PENDING: requires API key.");
  lines.push("");
  lines.push("## How to read this");
  lines.push("");
  lines.push("- Verdicts use the realism-review form's scale: pass / pass-with-edits / needs-rework.");
  lines.push("- Agreement is a consistency signal between two AI reviewers, not inter-rater reliability against humans; the practitioner review (human) remains the real validation and is prepared in evaluation/human-protocol/.");
  lines.push("- Raw prompts and responses are saved in evaluation/output/review-panel/ for audit (gitignored).");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join("\n") + "\n");
}

async function runDry() {
  ensureDir(dryDir);
  // deterministic stub set: the two required reviewers (MODEL_A is optional and
  // only detectable after .env loads, which a dry run does not require)
  const slotNames = ["model_b", "model_c"];
  for (const t of TRANSCRIPTS) {
    const fileId = t.replace(/^docs\//, "").replace(/[/.]/g, "-");
    for (const id of slotNames) {
      writeJson(path.join(dryDir, `${fileId}-${id}.json`), {
        dry_run: true, notice: DRY_RUN_HEADER, transcript: t, reviewer: id.toUpperCase(), reviewer_model: `${id.toUpperCase()} (stub)`,
        simulated: true, method: "AI review panel — not educator or expert review",
        criteria: { C1: { verdict: null, note: "STUB" }, C2: { verdict: null, note: "STUB" }, C3: { verdict: null, note: "STUB" }, C4: { verdict: null, note: "STUB" } },
        verdict: null, edits_needed: [], overall_note: "STUB – pipeline not run"
      });
    }
  }
  // dry-run summary goes ONLY into dry-run/ — the committed PENDING skeleton in
  // evaluation/results/ is never touched by a dry run
  const reviewers = slotNames.map((id) => ({ id: id.toUpperCase(), slot: { model: `${id.toUpperCase()} (stub)` } }));
  writeSummary(reviewers, path.join(dryDir, "review-panel-summary.md"));
  fs.writeFileSync(
    path.join(dryDir, "README.md"),
    [DRY_RUN_HEADER, "", "Stub outputs produced by `node evaluation/run-review-panel.mjs --dry-run`.", "The pipeline code path was exercised WITHOUT any network call. 6 transcripts x reviewers, stub verdict files + dry summary.", ""].join("\n")
  );
  console.log(`[Review panel] DRY RUN: ${TRANSCRIPTS.length * slotNames.length} stub files written to dry-run/review-panel/. No network calls were made.`);
}

if (dry) {
  await runDry();
} else {
  await runReal();
}
