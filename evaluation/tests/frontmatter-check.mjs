#!/usr/bin/env node
// Front-matter YAML check — added 2026-10-26 after the agent review (finding F1).
//
// Background: two published pages (t1.md, pilot-report.md) had unquoted `description:`
// values containing ": ". Jekyll's YAML parser (Psych) rejects those files' front matter
// ("mapping values are not allowed in this context"), so the pages built with NO
// front-matter data: no title/parent/nav_order — which silently broke the live main
// navigation on every page while the whole verification suite (axe, linkcheck,
// keyboard tests) kept passing. This check closes that blind spot.
//
// Dependency-free on purpose (no YAML lib in devDependencies). It validates the
// properties that actually broke, rather than re-implementing YAML:
//   1. The file either has no front matter or a well-formed `---` block.
//   2. No plain (unquoted) scalar value contains ": " or ends with ":" — the exact
//      class Psych rejects.
//   3. No tab characters in the front-matter block (YAML forbids them).
//   4. Every page under docs/ has a `title:` (Just the Docs uses it for the nav).
//
// Usage: npm run test:frontmatter   (exit 1 on any failure)

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repoRoot = join(import.meta.dirname, "..", "..");
const failures = [];
let filesChecked = 0;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git" || entry.startsWith(".")) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (entry.endsWith(".md")) yield p;
  }
}

for (const file of walk(repoRoot)) {
  const rel = relative(repoRoot, file).split(sep).join("/");
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");

  if (lines[0]?.trim() !== "---") {
    if (rel.startsWith("docs/")) {
      failures.push(`${rel}:1 — no front-matter block; a docs page without one gets no title/parent/nav_order`);
    }
    continue;
  }
  filesChecked += 1;

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") { end = i; break; }
  }
  if (end === -1) {
    failures.push(`${rel}:1 — front matter opened with "---" but never closed`);
    continue;
  }

  let hasTitle = false;
  for (let i = 1; i < end; i += 1) {
    const line = lines[i];
    const lineNo = i + 1;
    if (line.includes("\t")) {
      failures.push(`${rel}:${lineNo} — tab character in front matter (YAML forbids tabs for indentation)`);
    }
    // Top-level "key: value" lines only (no leading whitespace, not a list item).
    const m = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(.*)$/);
    if (!m) continue;
    const key = m[1];
    const value = m[2].trim();
    if (key === "title") hasTitle = true;
    if (value === "" || value === "|" || value === ">") continue;
    const quoted = (value.startsWith('"') && value.endsWith('"') && value.length >= 2)
      || (value.startsWith("'") && value.endsWith("'") && value.length >= 2);
    if (quoted) continue;
    if (value.includes(": ") || value.endsWith(":")) {
      failures.push(
        `${rel}:${lineNo} — unquoted "${key}:" value contains ":" followed by a space; ` +
        "Psych rejects this (\"mapping values are not allowed in this context\") and Jekyll drops the whole front matter. Quote the value or remove the colon.",
      );
    }
  }

  if (rel.startsWith("docs/") && !hasTitle) {
    failures.push(`${rel}:1 — docs page front matter has no "title:" (the nav falls back to the first heading)`);
  }
}

if (failures.length > 0) {
  console.error(`frontmatter-check: ${failures.length} problem(s) found\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`frontmatter-check: OK — ${filesChecked} front-matter block(s) validated (plain scalars, tabs, docs titles)`);
