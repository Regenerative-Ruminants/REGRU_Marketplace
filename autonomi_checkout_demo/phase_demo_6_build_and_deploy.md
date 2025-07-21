# Phase 6: Build & Deploy Pipeline

Goal: Package antctl-enabled Docker image, update GitHub Actions, and perform canary deploy to production droplet.

---

## Stub A: Docker Image Enhancements

* **6-A-1** Add `RUN curl -L https://releases.autonomi.network/antctl > /usr/local/bin/antctl && chmod +x`.
* **6-A-2** Multi-stage build separates builder & runtime; final size < 150 MB.
* **6-A-3** Build arg `ANTCTL_VERSION` for pinning.

### Mandatory Pause for Testing

Automated: `docker build` in CI; `antctl --help` exits 0.
User: Run image locally, call pointer get; succeeds.

---

## Stub B: GitHub Actions Pipeline

* **6-B-1** Cache Rust & pnpm deps for faster builds.
* **6-B-2** Job matrix for `test`, `build`, `deploy`.
* **6-B-3** Push image to GHCR with tag `demo-${{ github.sha }}`.

### Mandatory Pause for Testing

Automated: Workflow run completes green on PR branch.
User: Review build logs; image size reported.

---

## Stub C: Secret & Config Management

* **6-C-1** Add `ETH_RPC_URL`, `PAYMENT_RECEIVER`, `CHAIN_ID` secrets.
* **6-C-2** Use GitHub Environments for `staging` vs `production`.
* **6-C-3** Fail deploy if secret missing.

### Mandatory Pause for Testing

Automated: Dry-run deploy prints env vars masked.
User: Manually revoke secret; deploy job should fail.

---

## Stub D: Canary Deploy & Rollback

* **6-D-1** Deploy container to droplet via SSH + Docker.
* **6-D-2** Health check endpoint `/api/health` must return 200.
* **6-D-3** Wait 5 min; if success, promote tag `latest`.  On failure, rollback to previous image.

### Mandatory Pause for Testing

Automated: Action runs health-check script; asserts curl 200.
User: Observe canary logs; confirm automatic rollback works by intentionally failing health check.

---

Project is **demo-ready** once Phase 6 tasks are complete and the smoke test on production passes with a real wallet transaction. 