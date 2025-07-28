# Phase 1 – CLI Build & Local Operator Workflow

This phase focuses on getting the REGRU CLI built locally, exercising it against a local Autonomi devnet, and wiring the backend to accept a pointer address via environment variable.

## Stub A – Repository Structure & Build Artefacts
| Serial | Task | Description | Pause? |
|--------|------|-------------|--------|
| 1-A-1 | Create `cli_integration_plan/` directory & baseline phase files | Scaffold directory for plans and phase docs | |
| 1-A-2 | Build CLI in release mode for Windows & Linux | `cargo build --release` inside `cli/` | |
| 1-A-3 | Copy artifacts to `/bin/` and add to `.gitignore` | Ensure binaries are not committed | |
| 1-A-4 | Document build steps in `docs/CLI.md` | Include prerequisites and common flags | |
| 1-A-5 | Add CI job to compile CLI & run `cargo check` | GitHub Actions matrix x86_64-windows / x86_64-linux | |
| 1-A-6 | User test – operator builds CLI and runs `regru --help` | **Required pause for manual confirmation** | ✔️ |

## Stub B – Local Devnet Import & Verification
| Serial | Task | Description | Pause? |
|--------|------|-------------|--------|
| 1-B-1 | Start local Autonomi devnet container | Use upstream docker-compose | |
| 1-B-2 | Export funded `SECRET_KEY` env var | Use genesis key | |
| 1-B-3 | Run `regru --local import products --json input/products.json` | Upload sample catalogue | |
| 1-B-4 | Record printed pointer addresses | Save into `.env.dev` | |
| 1-B-5 | Automated tests – backend fetch & UI render | Playwright script hits `/api/products` | |
| 1-B-6 | User test – manual browse http://localhost:1420 | **Required pause** | ✔️ |

## Stub C – Backend Config Wiring
| Serial | Task | Description | Pause? |
|--------|------|-------------|--------|
| 1-C-1 | Add `PRODUCTS_POINTER_ADDRESS` env support in backend | Update config loader | |
| 1-C-2 | Fallback to local toml when env missing | Keep dev UX | |
| 1-C-3 | Update README section “Updating Catalogue” | Clear operator steps | |
| 1-C-4 | Regression tests | Ensure pointer fetch succeeds | |
| 1-C-5 | User test – end-to-end local checkout | **Required pause** | ✔️ | 