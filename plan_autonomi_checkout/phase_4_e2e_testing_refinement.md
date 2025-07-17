# Phase 4: End-to-End Testing, CI, and Final Polish

Goal: Ensure the entire purchase flow works reliably on local, staging, and production with automated coverage ≥ 90 % and zero critical bugs.

---

## Stub A: Playwright E2E Suite Expansion

* **4-A-1** Add test “Happy Path Purchase” (connect wallet → browse → add → checkout → receipt).
* **4-A-2** Add test “Mobile Safari WalletConnect” via iOS emulation.
* **4-A-3** Integrate tests into GitHub Actions (`web-deployment` pipeline) with trace + video artifacts.

### Mandatory Pause for Testing

* CI run must be green twice consecutively.
* User test: Trigger manual workflow dispatch, watch Playwright report, confirm recordings.

---

## Stub B: Load & Soak Tests

* **4-B-1** Use k6 or artillery to simulate 100 concurrent checkouts/min for 10 min.
* **4-B-2** Monitor droplet CPU/mem; verify <70 % utilisation and no 5xx.
* **4-B-3** Record metrics to Grafana (ant-metrics stack).

### Mandatory Pause for Testing

* Automated: load test script must finish with <1 % error rate.
* User: Review Grafana dashboard screenshot and approve.

---

## Stub C: Security & Edge Audits

* **4-C-1** Run `npm audit`, `cargo audit`, fix criticals.
* **4-C-2** Static analysis with `cargo clippy --all -- -D warnings`.
* **4-C-3** Dependency licence scan (FOSSA / licence-checker).

### Mandatory Pause for Testing

* Automated: CI gates fail on any new critical vuln.
* User: Sign-off security report PDF.

---

## Stub D: Release & Rollback Docs

* **4-D-1** Write `RELEASE_CHECKLIST.md` (version bump, tag, CI, droplet health checks).
* **4-D-2** Add `ROLLBACK.md` for quick redeploy of previous Docker digest.
* **4-D-3** Create GitHub release draft with changelog auto-generated from Conventional Commits.

### Mandatory Pause for Testing

* Automated: Dry-run release in staging repo.
* User: Approve release draft formatting.

---

Completion Criteria: All 4-?-* tasks done, every pause approved, Playwright & load tests green on main and `web-deployment`. Project deemed production-ready. 