# Phase 2 – Staging / Devnet Continuous Flow

Goal: Validate the CLI-driven catalogue pipeline in a shared staging environment.

## Stub A – CI-Driven Catalogue Upload
| Serial | Task | Description | Pause? |
|--------|------|-------------|--------|
| 2-A-1 | Add GitHub Action that runs CLI import on push to `catalogue/*` | Generates new pointer file artifact | |
| 2-A-2 | Securely inject staging `SECRET_KEY` via repo secrets | Key rotation policy | |
| 2-A-3 | Persist printed pointer to workflow output | For downstream deploy | |
| 2-A-4 | Publish pointer as environment variable in staging deploy step | Back-end uses env var | |
| 2-A-5 | Automated smoke – backend boot & fetch pointer | CI curl check | |
| 2-A-6 | User test – staging UI shows new products | **Required pause** | ✔️ |

## Stub B – End-to-End Checkout Smoke
| Serial | Task | Description | Pause? |
|--------|------|-------------|--------|
| 2-B-1 | Run Playwright suite against staging | Checkout flow using new catalogue | |
| 2-B-2 | Capture HAR file & performance metrics | Baseline | |
| 2-B-3 | Alert on test failures via Slack | Use webhook | |
| 2-B-4 | User test – manual checkout on staging | **Required pause** | ✔️ | 