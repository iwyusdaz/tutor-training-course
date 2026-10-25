#!/usr/bin/env node
// keyboard-tests.mjs — scripted keyboard / focus / reflow tests for the
// spot-the-move practice tool (Playwright). Part of the "do now" evaluation:
// proves the FLOWS WORK keyboard-only — not learner experience.
//
// What is checked:
//   - the full practice-tool task completes by keyboard only: radios reached
//     and selected with Space, Check answer with Enter, the missing-answer
//     alert (role="alert"), feedback in the role="status" region with the
//     feedback heading focused, Next/Back cycle, the results table reached,
//     Start over returns to exchange 1
//   - no positive tabindex anywhere on the tool
//   - reflow at 320 px (no horizontal scroll) on the practice tool
//   - when run against a BUILT site (TEST_BASE_URL or --baseurl, e.g. the live
//     GitHub Pages URL): every content page exists, has one h1, and reflows
//     at 320 px. Against the local static server (raw docs/, no Jekyll) those
//     pages are recorded as SKIP, not failures.
//
// Usage:
//   node evaluation/tests/keyboard-tests.mjs                (self-contained: serves docs/ locally)
//   node evaluation/tests/keyboard-tests.mjs --baseurl https://iwyusdaz.github.io/tutor-training-course
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createServer } from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const docsDir = path.join(repoRoot, "docs");

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : fallback;
}

const EXTERNAL_BASE = process.env.TEST_BASE_URL || argValue("--baseurl", null);
const PORT = 8933;
const BASE = EXTERNAL_BASE || `http://127.0.0.1:${PORT}`;

// content pages = every docs/**/*.md (Jekyll renders each to .html). Only
// exists on a built site; local raw serving records them as SKIP.
const CONTENT_PAGES = [];
(function walk(dir, rel = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name === "assets") continue;
    const abs = path.join(dir, entry.name);
    const relPath = path.posix.join(rel, entry.name);
    if (entry.isDirectory()) walk(abs, relPath);
    else if (entry.name.endsWith(".md")) {
      const urlPath = "/" + (entry.name === "index.md" ? path.posix.join(path.dirname(relPath), "index.html") : relPath.replace(/\.md$/, ".html")).replace(/^\.\//, "");
      CONTENT_PAGES.push(urlPath);
    }
  }
})(docsDir);
CONTENT_PAGES.sort();

let passed = 0, failed = 0, skipped = 0;
const failures = [];
function record(name, ok, detail = "") {
  if (ok === "skip") { skipped++; console.log(`  SKIP  ${name}${detail ? " — " + detail : ""}`); return; }
  if (ok) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; failures.push(name + (detail ? ` — ${detail}` : "")); console.log(`  FAIL  ${name}${detail ? " — " + detail : ""}`); }
}

// tiny static server (local mode only; makes NO external network calls — the
// practice tool's only fetch is items.json from the same origin)
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

const PRACTICE = `${BASE}/transcripts/practice/index.html`;
const N_ITEMS = 10;

async function noHorizontalScroll(page, label) {
  const m = await page.evaluate(() => ({
    scrollWidth: document.scrollingElement.scrollWidth,
    clientWidth: document.scrollingElement.clientWidth
  }));
  record(`${label}: reflows without horizontal scroll`, m.scrollWidth <= m.clientWidth + 1, `scrollWidth=${m.scrollWidth}, clientWidth=${m.clientWidth}`);
}

async function answerCurrentItem(page) {
  // keyboard-only: focus the first radio of each group and select with Space,
  // then activate Check answer with Enter
  const firstMove = page.locator('fieldset >> nth=0 >> input[type="radio"]').first();
  await firstMove.focus();
  await page.keyboard.press("Space");
  const firstEff = page.locator('fieldset >> nth=1 >> input[type="radio"]').first();
  await firstEff.focus();
  await page.keyboard.press("Space");
  const check = page.getByRole("button", { name: "Check answer" });
  await check.focus();
  await page.keyboard.press("Enter");
}

async function testPracticeTool(browser) {
  console.log("\n== spot-the-move practice tool ==");
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(PRACTICE, { waitUntil: "load" });
  await page.waitForSelector("#item-heading", { timeout: 5000 });

  record("tool: renders 10 items", (await page.locator("#item-heading").textContent()).includes("of 10"));

  // initial focus lands on the item heading (focus management on load)
  record("tool: item heading receives focus on render", await page.evaluate(() => document.activeElement?.id === "item-heading"));

  // missing-answer alert: press Check with nothing selected
  const check = page.getByRole("button", { name: "Check answer" });
  await check.focus();
  await page.keyboard.press("Enter");
  record("tool: missing answer produces role=alert", (await page.locator('[role="alert"]').count()) === 1);
  const alertText = await page.locator('[role="alert"]').textContent();
  record("tool: alert names what is missing", /Choose (a move|which move)/.test(alertText || ""), (alertText || "").slice(0, 60));

  // keyboard-only answer flow
  await answerCurrentItem(page);
  record("tool: feedback renders in role=status region", (await page.locator('[role="status"]').count()) === 1);
  record("tool: feedback heading receives focus after check", await page.evaluate(() => document.activeElement?.id === "feedback-heading"));
  const fbHead = await page.locator("#feedback-heading").textContent();
  record("tool: feedback names the move outcome", /(Both right|Move identified correctly|Not quite)/.test(fbHead || ""), (fbHead || "").slice(0, 60));

  // Next: heading focused again
  await page.getByRole("button", { name: /Next exchange/ }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector("#item-heading", { timeout: 3000 });
  const h2 = await page.locator("#item-heading").textContent();
  record("tool: Next advances to exchange 2", /Exchange 2 of 10/.test(h2 || ""));
  record("tool: new item heading receives focus after Next", await page.evaluate(() => document.activeElement?.id === "item-heading"));

  // Back returns to exchange 1 (fresh, unanswered — by design)
  await page.getByRole("button", { name: "Back" }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector("#item-heading", { timeout: 3000 });
  record("tool: Back returns to exchange 1", /Exchange 1 of 10/.test(await page.locator("#item-heading").textContent()));
  record("tool: Back resets to unanswered state", (await page.locator('[role="status"]').count()) === 0);

  // complete all 10 items keyboard-only
  for (let i = 0; i < N_ITEMS; i++) {
    await answerCurrentItem(page);
    const isLast = i === N_ITEMS - 1;
    const btn = page.getByRole("button", { name: isLast ? /See your summary/ : /Next exchange/ });
    await btn.focus();
    await page.keyboard.press("Enter");
    if (!isLast) await page.waitForSelector("#item-heading", { timeout: 3000 });
  }
  record("tool: summary table reached after 10 keyboard-only items", (await page.locator("table").count()) === 1);
  record("tool: summary heading receives focus", await page.evaluate(() => document.activeElement?.id === "summary-heading"));
  const summaryRows = await page.locator("table tbody tr").count();
  record("tool: summary lists all 10 exchanges", summaryRows === N_ITEMS, `rows=${summaryRows}`);

  // Start over: keyboard, returns to exchange 1 clean
  await page.getByRole("button", { name: "Start over" }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector("#item-heading", { timeout: 3000 });
  record("tool: Start over returns to exchange 1", /Exchange 1 of 10/.test(await page.locator("#item-heading").textContent()));

  // nothing stored: reload shows a clean state, no persistence anywhere
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#item-heading", { timeout: 3000 });
  const stored = await page.evaluate(() => {
    let out = [];
    for (let i = 0; i < localStorage.length; i++) out.push(localStorage.key(i));
    for (let i = 0; i < sessionStorage.length; i++) out.push(sessionStorage.key(i));
    return out;
  });
  record("tool: nothing stored (no localStorage/sessionStorage keys)", stored.length === 0, stored.join(","));

  // no positive tabindex anywhere in the tool
  const badTabIndex = await page.evaluate(() =>
    [...document.querySelectorAll('#spot-the-move [tabindex]')].filter((n) => Number(n.getAttribute("tabindex")) > 0).length
  );
  record("tool: no positive tabindex", badTabIndex === 0, `found=${badTabIndex}`);

  // reflow at 320 px on the practice tool
  await page.setViewportSize({ width: 320, height: 800 });
  await noHorizontalScroll(page, "practice tool @320 CSS px (= 400% zoom at 1280)");
  // and the tool still works at 320: answer item 1 keyboard-only
  await answerCurrentItem(page);
  record("tool: still operable by keyboard at 320 px", (await page.locator('[role="status"]').count()) === 1);

  await context.close();
}

async function testContentPages(browser) {
  console.log("\n== content pages (built site only) ==");
  if (EXTERNAL_BASE) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    for (const urlPath of CONTENT_PAGES) {
      const res = await page.goto(`${BASE}${urlPath}`, { waitUntil: "load" }).catch(() => null);
      if (!res || !res.ok()) { record(`${urlPath}: page loads`, false, `status=${res ? res.status() : "error"}`); continue; }
      record(`${urlPath}: page loads`, true);
      const h1 = await page.locator("h1").count();
      record(`${urlPath}: exactly one h1`, h1 === 1, `h1 count=${h1}`);
      await page.setViewportSize({ width: 320, height: 800 });
      await noHorizontalScroll(page, urlPath);
      await page.setViewportSize({ width: 1280, height: 900 });
    }
    await context.close();
  } else {
    record(`content pages (${CONTENT_PAGES.length} pages: h1 + 320px reflow)`, "skip", "raw docs/ has no built HTML — run with --baseurl <built-site> to check");
  }
}

async function main() {
  const browser = await chromium.launch();
  try {
    await testPracticeTool(browser);
    await testContentPages(browser);
  } catch (err) {
    record("test run completed", false, String(err.message || err));
  } finally {
    await browser.close();
    if (server) await new Promise((r) => server.close(r));
  }
  console.log(`\n${passed}/${passed + failed} checks passed${skipped ? `, ${skipped} skipped` : ""}.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
