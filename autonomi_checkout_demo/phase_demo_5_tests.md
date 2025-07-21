# Phase 5: End-to-End Test Suite

Goal: Achieve full automated coverage for checkout flow (backend + frontend) and integrate into CI.

---

## Stub A: Backend Integration Tests (Rust)

* **5-A-1** Use `actix_web::test` to spin up in-memory server.
* **5-A-2** Happy-path: quote → confirm → watcher success (mock RPC & antctl).
* **5-A-3** Negative: unknown product, duplicate confirm, RPC failure.

### Mandatory Pause for Testing

Automated: `cargo test --all` passes.  
User: Review coverage report ≥ 85% for checkout modules.

---

## Stub B: Playwright E2E Tests

* **5-B-1** Script loads cart with fixtures, does full checkout via stubbed wallet.
* **5-B-2** Insufficient funds scenario using wallet mock.
* **5-B-3** Wallet disconnect mid-flow → UI error path.

### Mandatory Pause for Testing

Automated: `pnpm test:e2e` passes in CI container.  
User: Run on local iPhone Safari; flow succeeds.

---

## Stub C: Performance & Load Tests

* **5-C-1** k6 script: 30 rps quote endpoint → p95 < 120 ms.
* **5-C-2** Watcher stress: 500 pending orders, confirm within 10 s.

### Mandatory Pause for Testing

Automated: k6 outputs thresholds met.  
User: Review Grafana dashboard for spikes.

---

## Stub D: CI Gating & Reporting

* **5-D-1** Update GitHub Action to run backend, Playwright, k6 jobs.
* **5-D-2** Fail build if any test fails; upload Playwright HTML report.
* **5-D-3** Slack webhook on failure.

### Mandatory Pause for Testing

Automated: Push branch, ensure failing test blocks merge.  
User: Confirm Slack alert received.

---

Advance to Phase 6 after tasks 5-A-1 … 5-D-3 are ✅ and CI green. 