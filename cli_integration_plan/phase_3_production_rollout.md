# Phase 3 – Production Roll-Out & Observability

## Stub A – Production Catalogue Publish
| Serial | Task | Description | Pause? |
|--------|------|-------------|--------|
| 3-A-1 | Generate production wallet & fund with ANT | Offline ceremony | |
| 3-A-2 | Store `SECRET_KEY` in prod secret store | Vault integration | |
| 3-A-3 | Operator runs CLI import with production flag (no `--local`) | Upload official catalogue | |
| 3-A-4 | Copy pointer address into production deployment config | Terraform/Ansible vars | |
| 3-A-5 | User test – verify prod site lists catalogue correctly | **Required pause** | ✔️ |

## Stub B – Monitoring & Regression
| Serial | Task | Description | Pause? |
|--------|------|-------------|--------|
| 3-B-1 | Add Prometheus check for `/api/products` latency | | |
| 3-B-2 | Grafana dashboard showing catalogue freshness (pointer hash) | | |
| 3-B-3 | Monthly catalogue rotation playbook | Documented SOP | |
| 3-B-4 | User test – quarterly DR drill uploading a new catalogue | **Required pause** | ✔️ | 