#!/usr/bin/env node
// Simulated tutor-trainee runs — PENDING PIPELINE (requires API key).
//
// What it does when run for real:
//   - Plays each fictional trainee persona at three experience levels
//     (3 personas x 3 levels = 9 runs, spec requires >= 8) through the pilot's
//     pre/post design: answer three scripted student errors (set A, cold),
//     "study" Modules 3-4 (the actual content files from docs/), then answer
//     three parallel errors (set B). MODEL_A plays every trainee.
//   - MODEL_B and MODEL_C independently score EVERY response against the four
//     Domain 3 anchors (A1-A4, 0/1/2) from the blind scoring sheet — blinded:
//     responses arrive as opaque codes in shuffled order, with no persona, no
//     pre/post label, and no run id. A model never judges its own output.
//   - Reports percent agreement + Cohen's kappa between the two scorers per
//     anchor, and per-run pre/post anchor scores DESCRIPTIVELY ONLY.
//
// Honesty rules encoded here:
//   - Every output is labeled "AI-simulated trainee". Simulated personas may
//     already know the content, so pre/post differences CANNOT be read as
//     learning gains — the pipeline exists to surface ambiguous tasks, missing
//     scaffolding and unrealistic error scripts.
//   - Raw outputs go to evaluation/output/simulations/ (gitignored); the
//     summary at evaluation/results/simulations-summary.md is regenerated for
//     hand-committing. Dry-run stubs go to dry-run/ headed "DRY RUN – NOT
//     REAL RESULTS" and are never used as results.
//
// Usage:
//   node evaluation/run-simulations.mjs            (real run; needs .env)
//   node evaluation/run-simulations.mjs --dry-run  (stub outputs to dry-run/, no network)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { requireSlots, isDryRun, ensureDir, writeJson, chat, extractJson, DRY_RUN_HEADER } from "./lib/env.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(repoRoot, "evaluation", "output", "simulations");
const summaryPath = path.join(repoRoot, "evaluation", "results", "simulations-summary.md");
const dryDir = path.join(repoRoot, "dry-run", "simulations");
const dry = isDryRun(process.argv);

// ---- Personas (fictional; drawn from the build plan's learner personas, plan 07 §3) ----
const PERSONAS = [
  {
    id: "T1",
    name: "Diego, 20 — college junior, first tutoring job (fictional)",
    background: "Good at math, no teaching experience; tends to explain rather than ask."
  },
  {
    id: "T2",
    name: "Grace, 52 — career changer, former accountant (fictional)",
    background: "Patient and encouraging; rusty on current methods; worried about tech tools."
  },
  {
    id: "T3",
    name: "Marcus, 34 — community volunteer, week 6 of onboarding (fictional)",
    background: "Works with youth programs; comfortable with students, improvises under pressure."
  }
];
const LEVELS = [
  { id: "L1", name: "day 1 — no modules studied yet, no tutoring experience beyond observation" },
  { id: "L2", name: "onboarding week 2 — has read the modules once, has not tutored students yet" },
  { id: "L3", name: "week 6 — tutoring solo, one coaching cycle completed" }
];

// ---- Task sets (verbatim from evaluation/human-protocol/pilot-protocol.md "Task materials") ----
const SET_A = [
  { id: "A1", error: "Student writes: x - 4 = 10 -> x = 6. Student says: 'I moved the 4 over.'", misconception: "M2 sign errors when moving terms" },
  { id: "A2", error: "Student writes: 2(x - 4) = 2x - 4. Student asks: 'Is this right?'", misconception: "M3 distributing incorrectly: 2(x-4) -> 2x-4" },
  { id: "A3", error: "Student writes: 4x = 12 -> x = 12. Student says: 'I divided. Wait... did I?'", misconception: "M4 dividing only some terms" }
];
const SET_B = [
  { id: "B1", error: "Student writes: 3x + 5 = 20 -> 3x = 20. Student says: 'I subtracted the 5.'", misconception: "M2 sign errors when moving terms" },
  { id: "B2", error: "Student writes: 3(x + 2) = 12 -> 3x + 2 = 12. Student says: 'I distributed.'", misconception: "M3 distributing incorrectly (partial)" },
  { id: "B3", error: "Student writes: 4x + 2 = 14 -> x + 2 = 3.5 -> x = 1.5. Student says: 'I divided everything by 4.'", misconception: "M4 dividing only some terms" }
];

// ---- Scoring anchors (verbatim from evaluation/human-protocol/blind-scoring-sheet.md) ----
const ANCHORS = [
  { id: "A1", text: "Opens with a probing question before explaining (2 = question first; 1 = question after a partial explain; 0 = explain/correct first)" },
  { id: "A2", text: "Question exposes the misconception's spot, not its label (2 = points at the exact operation; 1 = probes generally; 0 = names the label/corrects)" },
  { id: "A3", text: "Gives the student room — no answer handed over (2 = no solution content; 1 = a partial step at most; 0 = the fix performed/stated)" },
  { id: "A4", text: "Normalizes the error and keeps ownership with the student (2 = warm + student acts; 1 = neutral; 0 = cold, rescue, or approval-seeking close)" }
];

const MODULES = [
  "docs/modules/3-questions-wait-time-and-errors.md",
  "docs/modules/4-feedback-and-motivation.md"
];

const nowIso = () => new Date().toISOString();
const dryHeader = () => (dry ? `${DRY_RUN_HEADER}\n\n` : "");

const TRAINEE_SYSTEM = `You are role-playing a trainee math tutor in a SIMULATION that tests whether training materials are clear. This is not a real person and produces no evidence of learning.
- Role-play the persona faithfully, including what they would NOT yet know. Do not import tutoring knowledge the persona has not studied.
- Respond to scripted student errors exactly as this persona would speak to a student, in one or two sentences per error.
- Respond in strict JSON only, matching the requested schema.`;

function prePrompt(persona, level) {
  return `Persona: ${persona.name}
Background: ${persona.background}
Where they are in training: ${level.name}

The persona has NOT yet studied any modules (answer "cold", before training). Respond to each scripted student error in writing, one or two sentences, exactly as this persona would speak to that student:

${SET_A.map((t, i) => `${i + 1}. ${t.error}`).join("\n")}

Respond with JSON exactly like:
{
  "run_id": "RUN_ID",
  "phase": "pre",
  "simulated": true,
  "responses": [{"item": "A1", "response": "one or two sentences, as spoken to the student"}, {"item": "A2", "response": "..."}, {"item": "A3", "response": "..."}]
}`;
}

function postPrompt(persona, level) {
  const moduleText = MODULES.map((rel) => {
    const text = fs.readFileSync(path.join(repoRoot, rel), "utf8");
    return `--- STUDIED MATERIAL: ${rel} ---\n${text.slice(0, 14000)}`;
  }).join("\n\n");
  return `Persona: ${persona.name}
Background: ${persona.background}
Where they are in training: ${level.name}

The persona has now studied the two modules below (study them as this persona would — some parts stick, some do not). Respond to each NEW scripted student error in writing, one or two sentences, exactly as this persona would now speak to that student:

${SET_B.map((t, i) => `${i + 1}. ${t.error}`).join("\n")}

${moduleText}

Respond with JSON exactly like:
{
  "run_id": "RUN_ID",
  "phase": "post",
  "simulated": true,
  "responses": [{"item": "B1", "response": "one or two sentences, as spoken to the student"}, {"item": "B2", "response": "..."}, {"item": "B3", "response": "..."}],
  "materials_feedback": [{"where": "module/section", "what": "anything confusing, missing or unrealistic IN THE MATERIALS"}]
}`;
}

function scorerPrompt(scoringId, task) {
  return `You are a blinded scorer. Score ONE written trainee response to ONE scripted student error, using the four anchors below (0 / 1 / 2 each). You do NOT know who wrote it, when, or with what training. Score only what is on the page.

Scripted student error: ${task.error}
Trainee response (scoring ID ${scoringId}): "${task.response}"

Anchors:
${ANCHORS.map((a, i) => `${i + 1}. ${a.id}: ${a.text}`).join("\n")}

Respond with JSON exactly like:
{
  "scoring_id": "${scoringId}",
  "scores": {"A1": 0|1|2, "A2": 0|1|2, "A3": 0|1|2, "A4": 0|1|2},
  "evidence": "quote the response's key phrase",
  "rationale": "one sentence"
}`;
}

// ---- blind pool: all responses, shuffled, opaque codes ----
function buildBlindPool(runs) {
  const pool = [];
  for (const run of runs) {
    for (const phase of ["pre", "post"]) {
      const set = phase === "pre" ? SET_A : SET_B;
      for (let i = 0; i < set.length; i++) {
        pool.push({ scoringId: null, runId: run.runId, phase, item: set[i].id, error: set[i].error, response: run[phase]?.responses?.[i]?.response ?? null });
      }
    }
  }
  const usable = pool.filter((p) => typeof p.response === "string" && p.response.trim().length > 0);
  // deterministic per-run shuffle seed, recorded for audit
  const seed = crypto.randomInt(0, 2 ** 31);
  let s = seed;
  const shuffled = [...usable];
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2 ** 31;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  shuffled.forEach((p, i) => { p.scoringId = `S${String(i + 1).padStart(3, "0")}`; });
  return { pool: shuffled, seed };
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

function collectScores(outDir, suffix) {
  const scores = new Map(); // scoringId -> {A1..A4}
  if (!fs.existsSync(outDir)) return scores;
  for (const f of fs.readdirSync(outDir)) {
    if (!f.endsWith(suffix)) continue;
    try {
      const r = JSON.parse(fs.readFileSync(path.join(outDir, f), "utf8"));
      if (r.scores) scores.set(r.scoring_id, r.scores);
    } catch { /* skip unreadable */ }
  }
  return scores;
}

async function runReal() {
  const slots = requireSlots(["MODEL_A", "MODEL_B", "MODEL_C"]); // exits(1) before any network if unset
  ensureDir(outDir);

  const runs = [];
  for (const persona of PERSONAS) {
    for (const level of LEVELS) {
      runs.push({ runId: `${persona.id}-${level.id}`, persona, level });
    }
  }
  console.log(`[Simulations] 9 trainee runs (3 personas x 3 levels). Label: AI-simulated trainees — not real learners. Pre/post differences are descriptive only, never learning gains.`);

  // 1) production runs (MODEL_A plays every trainee)
  for (const run of runs) {
    for (const [phase, promptFn] of [["pre", prePrompt], ["post", postPrompt]]) {
      const file = path.join(outDir, `${run.runId}-${phase}.json`);
      process.stdout.write(`[Simulations] ${run.runId} ${phase} … `);
      if (fs.existsSync(file)) { console.log("cached"); continue; }
      try {
        const text = await chat(slots.MODEL_A, [
          { role: "system", content: TRAINEE_SYSTEM },
          { role: "user", content: promptFn(run.persona, run.level).replaceAll("RUN_ID", run.runId) }
        ]);
        const parsed = extractJson(text);
        const record = {
          run_id: run.runId, persona: run.persona.name, level: run.level.id,
          phase, simulated: true, notice: "AI-simulated trainee run — not a real person; not evidence of learning",
          model: "MODEL_A", model_name: slots.MODEL_A.model, generated: nowIso(), ...parsed
        };
        writeJson(file, record);
        run[phase] = parsed;
        console.log("ok");
      } catch (err) {
        console.log("FAILED");
        writeJson(file.replace(".json", ".failed.json"), { run_id: run.runId, phase, error: String(err.message || err) });
      }
    }
  }

  // 2) blinded scoring (MODEL_B + MODEL_C)
  const { pool, seed } = buildBlindPool(runs);
  writeJson(path.join(outDir, "blind-map.json"), {
    generated: nowIso(), seed,
    note: "scoring ID -> run/phase/item. GITIGNORED (evaluation/output/). Do not commit; scorers never see this until after scoring.",
    map: Object.fromEntries(pool.map((p) => [p.scoringId, { run: p.runId, phase: p.phase, item: p.item }]))
  });
  console.log(`[Simulations] Blinded pool: ${pool.length} responses (seed ${seed}). Scorers: MODEL_B, MODEL_C.`);

  for (const scorer of ["MODEL_B", "MODEL_C"]) {
    for (const task of pool) {
      const file = path.join(outDir, `${task.scoringId}-${scorer.toLowerCase()}.json`);
      if (fs.existsSync(file)) continue;
      process.stdout.write(`[Simulations] score ${task.scoringId} · ${scorer} … `);
      try {
        const text = await chat(slots[scorer], [
          { role: "system", content: "You are a blinded rubric scorer for a training-materials evaluation. Respond with strict JSON only." },
          { role: "user", content: scorerPrompt(task.scoringId, task) }
        ], { temperature: 0 });
        const parsed = extractJson(text);
        writeJson(file, { scoring_id: task.scoringId, scorer, scorer_model: slots[scorer].model, method: "AI judge (blinded) — not a human scorer", ...parsed });
        console.log("ok");
      } catch (err) {
        console.log("FAILED");
        writeJson(file.replace(".json", ".failed.json"), { scoring_id: task.scoringId, scorer, error: String(err.message || err) });
      }
    }
  }

  writeSummary(summaryPath, runs, pool, slots);
  console.log(`[Simulations] Raw outputs in evaluation/output/simulations/ (gitignored).`);
  console.log(`[Simulations] Summary regenerated at evaluation/results/simulations-summary.md — review it, then commit by hand.`);
  console.log(`[Simulations] NEXT: follow the rerun procedure in evaluation/METHODS.md to refresh METHODS.md and README status lines.`);
}

function writeSummary(outPath, runs, pool, slots) {
  const scoreDir = dry ? dryDir : outDir; // a dry run never reports scores from a previous real run
  const b = collectScores(scoreDir, "-model_b.json");
  const c = collectScores(scoreDir, "-model_c.json");

  const lines = [];
  lines.push(`${dryHeader()}# Simulated tutor-trainee runs — results summary`);
  lines.push("");
  lines.push(`Generated: ${dry ? "DRY RUN (stub)" : new Date().toISOString().slice(0, 10)} · Method: **AI-simulated trainees** (MODEL_A produces: ${slots.MODEL_A.model}; blinded AI scorers: ${slots.MODEL_B.model}, ${slots.MODEL_C.model}) · 9 runs (3 personas × 3 experience levels), 54 responses scored against the rubric's Domain 3 anchors.`);
  lines.push("");
  lines.push("> **These are simulated runs. Pre/post differences CANNOT be read as learning gains** (simulated personas may already know the content). The pipeline surfaces ambiguous tasks, missing scaffolding and unrealistic error scripts only. Scorers are AI models, not human scorers; human scoring (the pilot) remains primary.");
  lines.push("");
  lines.push("## Judge agreement (MODEL_B vs MODEL_C, blinded, per anchor)");
  lines.push("");
  lines.push("| Anchor | n | % agreement | Cohen's kappa |");
  lines.push("|---|---|---|---|");
  let agreementRow = false;
  for (const a of ANCHORS) {
    const xs = [], ys = [];
    for (const [id] of b) {
      if (c.has(id)) { xs.push(String(b.get(id)[a.id])); ys.push(String(c.get(id)[a.id])); }
    }
    if (xs.length) {
      const k = kappa(xs, ys);
      lines.push(`| ${a.id} — ${a.text.split("(")[0].trim()} | ${xs.length} | ${(k.observed * 100).toFixed(1)}% | ${k.kappa.toFixed(3)} |`);
      agreementRow = true;
    } else {
      lines.push(`| ${a.id} — ${a.text.split("(")[0].trim()} | PENDING: requires API key | PENDING: requires API key | PENDING: requires API key |`);
    }
  }
  lines.push("");
  lines.push("## Per-run anchor scores (descriptive only — pre is set A cold, post is set B after studying Modules 3–4)");
  lines.push("");
  lines.push("| Run | Persona (fictional) | Level | Set | A1 | A2 | A3 | A4 | Materials feedback |");
  lines.push("|---|---|---|---|---|---|---|---|---|");
  let anyRun = false;
  for (const run of runs) {
    for (const phase of ["pre", "post"]) {
      const ids = pool.filter((p) => p.runId === run.runId && p.phase === phase).map((p) => p.scoringId);
      const cell = (anchor) => {
        const vals = ids.map((id) => b.get(id)?.[anchor]).filter((v) => v !== undefined);
        return vals.length ? `${(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)} (n=${vals.length}, MODEL_B)` : "PENDING: requires API key";
      };
      const fbFile = path.join(scoreDir, `${run.runId}-post.json`);
      const fb = fs.existsSync(fbFile) ? (JSON.parse(fs.readFileSync(fbFile, "utf8")).materials_feedback || []).length : 0;
      lines.push(`| ${run.runId}-${phase} | ${run.persona.name.split(" — ")[0]} | ${run.level.id} | ${phase === "pre" ? "A (cold)" : "B (after study)"} | ${cell("A1")} | ${cell("A2")} | ${cell("A3")} | ${cell("A4")} | ${phase === "post" ? fb : "–"} |`);
      if (ids.length) anyRun = true;
    }
  }
  if (!anyRun) lines.push("_All cells PENDING: requires API key._");
  lines.push("");
  lines.push("## How to read this");
  lines.push("");
  lines.push("- Scores are 0/1/2 per anchor (blind scoring sheet). Averages here are per-run means over three items — shown for transparency, never compared as gains.");
  lines.push("- Materials feedback counts feed the same revision log as the agent review; accepted changes go to CHANGELOG.md.");
  lines.push("- Raw prompts, responses and the blind map are saved in evaluation/output/simulations/ for audit (gitignored; the blind map must not be published before de-blinding is noted).");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join("\n") + "\n");
}

async function runDry() {
  ensureDir(dryDir);
  const stubResponses = (ids) => ids.map((id) => ({ item: id, response: "STUB – pipeline not run" }));
  for (const persona of PERSONAS) {
    for (const level of LEVELS) {
      const runId = `${persona.id}-${level.id}`;
      writeJson(path.join(dryDir, `${runId}-pre.json`), {
        dry_run: true, notice: DRY_RUN_HEADER, run_id: runId, persona: persona.name, level: level.id,
        phase: "pre", simulated: true, model: "MODEL_A (stub)", responses: stubResponses(["A1", "A2", "A3"])
      });
      writeJson(path.join(dryDir, `${runId}-post.json`), {
        dry_run: true, notice: DRY_RUN_HEADER, run_id: runId, persona: persona.name, level: level.id,
        phase: "post", simulated: true, model: "MODEL_A (stub)", responses: stubResponses(["B1", "B2", "B3"]), materials_feedback: []
      });
      for (let i = 1; i <= 6; i++) {
        const sid = `S${String((PERSONAS.indexOf(persona) * 3 + LEVELS.indexOf(level)) * 6 + i).padStart(3, "0")}`;
        for (const scorer of ["model_b", "model_c"]) {
          writeJson(path.join(dryDir, `${sid}-${scorer}.json`), {
            dry_run: true, notice: DRY_RUN_HEADER, scoring_id: sid, scorer: scorer.toUpperCase(), model: `${scorer.toUpperCase()} (stub)`,
            scores: { A1: null, A2: null, A3: null, A4: null }, evidence: "STUB", rationale: "STUB – pipeline not run"
          });
        }
      }
    }
  }
  const summaryRuns = PERSONAS.flatMap((p) => LEVELS.map((l) => ({ runId: `${p.id}-${l.id}`, persona: p, level: l })));
  // dry-run summary goes ONLY into dry-run/ — the committed PENDING skeleton in
  // evaluation/results/ is never touched by a dry run
  writeSummary(path.join(dryDir, "simulations-summary.md"), summaryRuns, [], { MODEL_A: { model: "MODEL_A (stub)" }, MODEL_B: { model: "MODEL_B (stub)" }, MODEL_C: { model: "MODEL_C (stub)" } });
  fs.writeFileSync(
    path.join(dryDir, "README.md"),
    [DRY_RUN_HEADER, "", "Stub outputs produced by `node evaluation/run-simulations.mjs --dry-run`.", "The pipeline code path was exercised WITHOUT any network call. 9 runs x 2 phases + 54 stub score files.", ""].join("\n")
  );
  console.log(`[Simulations] DRY RUN: ${PERSONAS.length * LEVELS.length * 2 + PERSONAS.length * LEVELS.length * 12} stub files written to dry-run/simulations/. No network calls were made.`);
}

if (dry) {
  await runDry();
} else {
  await runReal();
}
