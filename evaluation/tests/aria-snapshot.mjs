#!/usr/bin/env node
// aria-snapshot.mjs — accessibility-tree captures (Playwright ariaSnapshot())
// of the spot-the-move practice tool at every state. This is the documented
// fallback for Guidepup/VoiceOver automation, which does not function on
// macOS 27 (see TOOLS.md). Captures verify names/roles/values/announcements
// structurally — they are NOT screen-reader testing, and none is claimed.
//
// Captures:
//   practice-initial.yaml    — exchange 1, unanswered
//   practice-alert.yaml      — Check answer with nothing selected (role=alert)
//   practice-feedback.yaml   — answered: role=status feedback + focused heading
//   practice-summary.yaml    — results table after all items
//   transcripts-page.yaml    — transcript library page (built site only)
//
// Usage:
//   node evaluation/tests/aria-snapshot.mjs                (self-contained: serves docs/ locally)
//   node evaluation/tests/aria-snapshot.mjs --baseurl <built-site-url>
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createServer } from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const docsDir = path.join(repoRoot, "docs");
const snapDir = path.join(repoRoot, "evaluation", "tests", "aria-snapshots");
fs.mkdirSync(snapDir, { recursive: true });

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : fallback;
}
const EXTERNAL_BASE = process.env.TEST_BASE_URL || argValue("--baseurl", null);
const PORT = 8934;
const BASE = EXTERNAL_BASE || `http://127.0.0.1:${PORT}`;

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
let server = null;
if (!EXTERNAL_BASE) {
  server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    let fp = path.join(docsDir, p);
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

let saved = 0;
async function save(page, name) {
  const snap = await page.locator("#spot-the-move").ariaSnapshot({ ref: false }).catch(() => null);
  if (snap) {
    fs.writeFileSync(path.join(snapDir, name), snap + "\n");
    saved++;
    console.log(`  saved  ${name}`);
  } else {
    console.log(`  MISS   ${name} (ariaSnapshot unavailable)`);
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

try {
  await page.goto(`${BASE}/transcripts/practice/index.html`, { waitUntil: "load" });
  await page.waitForSelector("#item-heading", { timeout: 5000 });
  await save(page, "practice-initial.yaml");

  // alert state
  await page.getByRole("button", { name: "Check answer" }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector('[role="alert"]', { timeout: 3000 });
  await save(page, "practice-alert.yaml");

  // feedback state (answer both, check)
  await page.locator('fieldset >> nth=0 >> input[type="radio"]').first().focus();
  await page.keyboard.press("Space");
  await page.locator('fieldset >> nth=1 >> input[type="radio"]').first().focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Check answer" }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector('[role="status"]', { timeout: 3000 });
  await save(page, "practice-feedback.yaml");

  // run items 2–10 to summary (item 1 is already answered from the capture above)
  await page.getByRole("button", { name: /Next exchange/ }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector("#item-heading", { timeout: 3000 });
  for (let i = 2; i <= 10; i++) {
    const move = page.locator('fieldset >> nth=0 >> input[type="radio"]').first();
    await move.focus();
    await page.keyboard.press("Space");
    const eff = page.locator('fieldset >> nth=1 >> input[type="radio"]').first();
    await eff.focus();
    await page.keyboard.press("Space");
    await page.getByRole("button", { name: "Check answer" }).focus();
    await page.keyboard.press("Enter");
    const isLast = i === 10;
    const btn = page.getByRole("button", { name: isLast ? /See your summary/ : /Next exchange/ });
    await btn.focus();
    await page.keyboard.press("Enter");
  }
  await page.waitForSelector("#summary-heading", { timeout: 3000 });
  await save(page, "practice-summary.yaml");

  // transcript library page — only exists on a built site
  const res = await page.goto(`${BASE}/transcripts/index.html`, { waitUntil: "load" }).catch(() => null);
  if (res && res.ok() && (await page.locator("main").count())) {
    const snap = await page.locator("main").ariaSnapshot({ ref: false }).catch(() => null);
    if (snap) {
      fs.writeFileSync(path.join(snapDir, "transcripts-page.yaml"), snap + "\n");
      saved++;
      console.log("  saved  transcripts-page.yaml");
    }
  } else {
    console.log("  SKIP   transcripts-page.yaml (needs a built site — run with --baseurl)");
  }
} catch (err) {
  console.error("aria-snapshot run failed:", String(err.message || err));
  process.exit(1);
} finally {
  await browser.close();
  if (server) await new Promise((r) => server.close(r));
}

console.log(`${saved} snapshot(s) written to evaluation/tests/aria-snapshots/`);
process.exit(saved > 0 ? 0 : 1);
