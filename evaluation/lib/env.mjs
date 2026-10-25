// Shared environment loader/validator for the pending evaluation pipelines.
// Rules (binding, from the portfolio build spec):
//  - Read configuration from .env (never committed; see .env.example).
//  - If any needed value is missing OR still starts with "YOUR_", exit(1) with
//    a clear message and make ZERO network calls.
//  - Never log secret values.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function loadDotenv() {
  // .env lives at the repo root; dotenv also walks up if absent
  const envPath = path.join(repoRoot, ".env");
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, quiet: true });
  } else {
    dotenv.config({ quiet: true }); // may pick up a .env above the repo (none expected)
  }
}

function slotStatus(prefix, required = ["BASE_URL", "API_KEY", "NAME"]) {
  const missing = [];
  const placeholder = [];
  for (const suffix of required) {
    const key = `${prefix}_${suffix}`;
    const value = process.env[key];
    if (value === undefined || String(value).trim() === "") missing.push(key);
    else if (String(value).trim().startsWith("YOUR_")) placeholder.push(key);
  }
  return { prefix, missing, placeholder, ok: missing.length === 0 && placeholder.length === 0 };
}

/**
 * Validate that every required model slot is fully configured.
 * Exits the process (code 1) with a clear message if not — BEFORE any
 * network-capable code runs.
 * @param {string[]} prefixes e.g. ["MODEL_A"] or ["MODEL_A","MODEL_B"]
 */
export function requireSlots(prefixes) {
  loadDotenv();
  const statuses = prefixes.map((p) => slotStatus(p));
  const bad = statuses.filter((s) => !s.ok);
  if (bad.length > 0) {
    console.error(`
[tutor-training-course pipelines] This pipeline needs real API configuration.
It will not run, and no network calls have been made.

Add a .env file at the repository root (copy .env.example) and fill in:
`);
    for (const s of bad) {
      if (s.missing.length) console.error(`  ${s.prefix}: missing      -> ${s.missing.join(", ")}`);
      if (s.placeholder.length)
        console.error(`  ${s.prefix}: placeholder -> ${s.placeholder.join(", ")} (still starts with YOUR_)`);
    }
    console.error(`
Slots use OpenAI-compatible chat completion endpoints. MODEL_A plays the
simulated trainee; MODEL_B and MODEL_C are the blinded scorers/reviewers (a
model never judges its own output). After a real run, follow the rerun
procedure in evaluation/METHODS.md to refresh the results tables and status
lines.`);
    process.exit(1);
  }
  return Object.fromEntries(
    statuses.map((s) => [
      s.prefix,
      {
        baseUrl: process.env[`${s.prefix}_BASE_URL`].replace(/\/+$/, ""),
        apiKey: process.env[`${s.prefix}_API_KEY`],
        model: process.env[`${s.prefix}_NAME`]
      }
    ])
  );
}

/** Probe a slot without exiting; returns the slot object or null. Assumes loadDotenv() already ran. */
export function slotIfConfigured(prefix) {
  const status = slotStatus(prefix);
  if (!status.ok) return null;
  return {
    baseUrl: process.env[`${prefix}_BASE_URL`].replace(/\/+$/, ""),
    apiKey: process.env[`${prefix}_API_KEY`],
    model: process.env[`${prefix}_NAME`]
  };
}

export function isDryRun(argv) {
  return argv.includes("--dry-run");
}

export const DRY_RUN_HEADER = "DRY RUN – NOT REAL RESULTS";

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n");
}

/** Minimal OpenAI-compatible chat completion call. Only ever invoked after requireSlots() passed. */
export async function chat(slot, messages, options = {}) {
  const res = await fetch(`${slot.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${slot.apiKey}`
    },
    body: JSON.stringify({
      model: slot.model,
      messages,
      temperature: options.temperature ?? 0.4,
      ...(options.responseFormat ? { response_format: options.responseFormat } : {})
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status} from ${slot.prefix || "model slot"}: ${body.slice(0, 400)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

export function extractJson(text) {
  // tolerant JSON extraction: first {...} or [...] block
  const start = text.search(/[[{]/);
  if (start === -1) throw new Error("No JSON found in model output");
  const openChar = text[start];
  const closeChar = openChar === "{" ? "}" : "]";
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === openChar) depth++;
    else if (text[i] === closeChar) {
      depth--;
      if (depth === 0) return JSON.parse(text.slice(start, i + 1));
    }
  }
  throw new Error("Unbalanced JSON in model output");
}
