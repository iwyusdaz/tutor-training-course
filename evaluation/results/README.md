# Results (pending pipelines)

Output summaries for the pending evaluation pipelines. **Nothing here is real until a pipeline is run with a configured `.env`.** Raw model outputs from a real run go to `evaluation/output/` (gitignored); the two summary files below are the only results files that get committed — by hand, after the run, per the rerun procedure in [`evaluation/METHODS.md`](../METHODS.md).

| File | Written by | Status |
|---|---|---|
| `simulations-summary.md` | `evaluation/run-simulations.mjs` (real run) | Pre-run placeholder — all results "PENDING: requires API key" |
| `review-panel-summary.md` | `evaluation/run-review-panel.mjs` (real run) | Pre-run placeholder — all results "PENDING: requires API key" |

Dry-run stubs (never results) go to `dry-run/` at the repository root and are gitignored; every stub file is headed "DRY RUN – NOT REAL RESULTS". A dry run never writes into `evaluation/results/`.

**Until a real run exists: no simulated transcripts, no scores, no verdicts exist anywhere in this repo.** The committed pages state pending status; nothing is fabricated.
