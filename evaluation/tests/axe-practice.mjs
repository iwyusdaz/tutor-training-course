#!/usr/bin/env node
// axe-practice.mjs — axe-core audit of the spot-the-move practice tool in its
// LIVE-RENDERED STATES (initial, missing-answer alert, feedback, summary),
// not just the initial DOM. The tool renders its controls in JavaScript, so a
// static-page audit would miss the states learners actually occupy.
//
// Same pinned axe-core as the shared audit script (4.11.1, root node_modules);
// same rule set (WCAG 2.1 A/AA + best practice). Writes one JSON per state to
// docs/audit/ and exits 1 on any critical/serious violation.
//
// Usage: node evaluation/tests/axe-practice.mjs [--baseurl <built-site-url>]
//   (default: serves docs/ locally on 127.0.0.1:8935; no external calls)
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createServer } from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const axeSource = require("axe-core") ? fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8") : null;

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const docsDir = path.join(repoRoot, "docs");
const outDir = path.join(repoRoot, "docs", "audit");
fs.mkdirSync(outDir, { recursive: true });

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : fallback;
}
const BASE = process.env.TEST_BASE_URL || argValue("--baseurl", null) || (() => null)();
const PORT = 8935;
const base = BASE || `http://127.0.0.1:${PORT}`;

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
let server = null;
if (!BASE) {
  server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const fp = path.join(docsDir, p);
    try {
      const data = fs.readFileSync(fp);
      res.writeHead(200, { "content-type": types[path.extname(fp)] || "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404); res.end("not found");
    }
  });
  await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function audit(state) {
  const results = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
      resultTypes: ["violations", "incomplete"]
    });
    return { violations: r.violations, incomplete: r.incomplete };
  });
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const v of results.violations) counts[v.impact] = (counts[v.impact] || 0) + 1;
  fs.writeFileSync(
    path.join(outDir, `practice-state-${state}.json`),
    JSON.stringify({ url: `${base}/transcripts/practice/index.html`, state, timestamp: new Date().toISOString(), axe: "4.11.1 (workspace pin)", ...results }, null, 2) + "\n"
  );
  console.log(`${state}: violations=${results.violations.length} (critical=${counts.critical}, serious=${counts.serious}, moderate=${counts.moderate}, minor=${counts.minor}), incomplete=${results.incomplete.length}`);
  return counts;
}

let worst = { critical: 0, serious: 0 };
try {
  await page.goto(`${base}/transcripts/practice/index.html`, { waitUntil: "load" });
  await page.waitForSelector("#item-heading", { timeout: 5000 });
  await page.addScriptTag({ content: axeSource });

  let c = await audit("initial");
  worst.critical = Math.max(worst.critical, c.critical); worst.serious = Math.max(worst.serious, c.serious);

  // alert state
  await page.getByRole("button", { name: "Check answer" }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector('[role="alert"]', { timeout: 3000 });
  c = await audit("missing-answer-alert");
  worst.critical = Math.max(worst.critical, c.critical); worst.serious = Math.max(worst.serious, c.serious);

  // feedback state
  await page.locator('fieldset >> nth=0 >> input[type="radio"]').first().focus();
  await page.keyboard.press("Space");
  await page.locator('fieldset >> nth=1 >> input[type="radio"]').first().focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Check answer" }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector('[role="status"]', { timeout: 3000 });
  c = await audit("feedback");
  worst.critical = Math.max(worst.critical, c.critical); worst.serious = Math.max(worst.serious, c.serious);

  // summary state
  await page.getByRole("button", { name: /Next exchange/ }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector("#item-heading", { timeout: 3000 });
  for (let i = 2; i <= 10; i++) {
    await page.locator('fieldset >> nth=0 >> input[type="radio"]').first().focus();
    await page.keyboard.press("Space");
    await page.locator('fieldset >> nth=1 >> input[type="radio"]').first().focus();
    await page.keyboard.press("Space");
    await page.getByRole("button", { name: "Check answer" }).focus();
    await page.keyboard.press("Enter");
    const isLast = i === 10;
    const btn = page.getByRole("button", { name: isLast ? /See your summary/ : /Next exchange/ });
    await btn.focus();
    await page.keyboard.press("Enter");
  }
  await page.waitForSelector("#summary-heading", { timeout: 3000 });
  c = await audit("summary");
  worst.critical = Math.max(worst.critical, c.critical); worst.serious = Math.max(worst.serious, c.serious);
} catch (err) {
  console.error("axe-practice run failed:", String(err.message || err));
  process.exit(1);
} finally {
  await browser.close();
  if (server) await new Promise((r) => server.close(r));
}
process.exit(worst.critical > 0 || worst.serious > 0 ? 1 : 0);
