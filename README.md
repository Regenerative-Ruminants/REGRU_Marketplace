# Regenerative Marketplace • Rust / Tauri / Autonomi

Desktop-first, mobile-friendly marketplace for regenerative-farm products.  
All catalogues, orders, media and receipts live on **Autonomi**; writes are paid in **ANT**.

---

## ✨ Why Autonomi?
* **Immutable & mutable primitives** – Chunks, Files, Scratchpads, Pointers for flexible storage. 
* **Pay-once** – ANT fees on upload, zero cost to read.  
* **Local network** – run an entire network stack locally for CI tests.  

---

## 🛠️ Stack

| Layer | Tech | Docs |
|-------|------|------|
| Runtime | Rust 1.78   `tokio` |  |
| Storage & Payments | `autonomi` crate ≥ 0.3 |  |
| Shell | **Tauri** 1.x |  |
| Styling | **TailwindCSS** 3.x |  |
| E2E | **Playwright** |  |

---

## 🚀 Quick-start

```bash
git clone https://github.com/Regenerative-Ruminants/REGRU_Marketplace.git
cd REGRU_Marketplace

# install front-end & Tauri CLI
pnpm install
cargo install --locked tauri-cli

# start single-node local Autonomi network
./scripts/start-local-autonomi.sh      # see LOCAL_NETWORK.md

# run dev app (hot reload)
pnpm tauri dev
```

## 🔑 Wallets & Environments
| Env   | Wallet             | Network Flag     | Funding      |
|-------|--------------------|------------------|--------------|
| local | wallets/local.key  | none (localhost) | auto-mint    |
| test  | wallets/test.key   | --testnet        | faucet ANT   |
| prod  | wallets/prod.key   | --mainnet        | manual top-up |

Keys are age-encrypted; CI injects TAURI_PRIVATE_KEY_B64 (see WALLETS.md).

## 🧪 Tests
```bash
cd src-tauri && cargo test      # Rust logic
pnpm exec playwright test       # opens Tauri, adds item, pays ANT, verifies Scratchpad
```

### UI Wallet Verification
In addition to the automated tests, you can manually verify wallet loading via the UI:
1.  Ensure the application is running (`pnpm tauri dev`).
2.  Click the "Wallets" icon in the left navigation panel.
3.  A modal will appear displaying the available wallets detected by the `get_available_wallets` command.
    *   **With `SECRET_KEY_ENV` set:** The modal should show the wallet derived from this environment variable.
    *   **Without `SECRET_KEY_ENV` and with `.key` files:** If key files (e.g., `wallets/local.key`) are present as per the "🔑 Wallets & Environments" table, their corresponding wallets should be listed.
    *   **No wallets configured:** The modal should show an empty list `[]` or an appropriate error message.

## 📦 Build & Sign
| OS      | Command                                                              | Reference                                       |
|---------|----------------------------------------------------------------------|-------------------------------------------------|
| macOS   | `pnpm tauri build --target dmg && xcrun notarytool submit ...`         | Apple notarization docs                         |
| Windows | `signtool sign /fd SHA256 /a path\to\bundle.msi`                       | Microsoft SignTool                              |

## 🛤️ Roadmap
**MVP** – single-merchant catalogue → shipping form → ANT checkout.

**Post-MVP** – multi-merchant, distance filters, NFTs, more pay rails.

**Long-term** – social feed, carbon-credit exchange, Tauri mobile 2.0. 

---

## 📚 Additional Docs

| File                 | Contents                                                                                             |
|----------------------|------------------------------------------------------------------------------------------------------|
| `docs/CONTRIBUTING.md` | Branch naming (`feat/*`, `fix/*`), Conventional Commits, code-style gates, "all PRs must keep tests ≥ 90 % pass." |
| `docs/SECURITY.md`     | Contact e-mail, CVSS triage SLA, key-rotation timetable, ANT-wallet incident steps.                    |
| `docs/LOCAL_NETWORK.md`| Step-by-step for `autonomi local-network` spawner, faucet script, teardown.                          |
| `docs/WALLETS.md`      | Generate keys (`autonomi wallet create`), encrypt with `age`, load via env vars.                       |
| `.github/workflows/tauri.yml` | Uses `tauri-action` to build macOS/Windows/Linux, runs local network, executes tests.                    |

# REGRU Marketplace

This repository contains the web application for the REGRU Marketplace, a platform connecting farms directly to customers. The application is built with a Rust backend (Actix), a Svelte/Vite frontend, and is deployed as a Docker container to DigitalOcean.

## 1. Project Architecture

The project is a Rust workspace designed to separate concerns between backend, frontend, and shared core logic.

*   **`crates/autonomi-core`**: A shared Rust library containing core business logic (e.g., wallet management). This allows code to be reused and tested independently.
*   **`src-backend`**: The Actix web server. It provides a REST API and serves the compiled frontend application.
*   **`src`**: The Svelte and TypeScript source code for the frontend user interface.
*   **`dist`**: The output directory for the compiled frontend assets. This directory is generated by the build process and is not checked into git.
*   **`docs`**: Contains project documentation, including a detailed summary of the migration from the original desktop application.

For a deep dive into the architectural decisions and the migration process, please see the **[Web Migration Summary](docs/web_migration_summary.md)**.

## 2. Local Development Setup

To run the application locally, you will need to run the frontend and backend services simultaneously.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 20.x or later)
*   [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
*   `pnpm` (or `npm`/`yarn`) for managing Node.js dependencies.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd src-backend
    ```

2.  **Create your environment file.** Copy the example file and customize if necessary.
    ```bash
    cp env_template.txt .env
    ```

3.  **Run the backend server:**
    ```bash
    cargo run
    ```
    The backend API will be available at `http://localhost:8000`. You can test it by visiting the health check endpoint: `http://localhost:8000/health`.

### Frontend Setup

1.  **Navigate to the project root.**
2.  **Install frontend dependencies:**
    ```bash
    npm install 
    ```
3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:1420`. The Vite development server is configured with a proxy, so any requests to `/api` will be automatically forwarded to the backend server running on port 8000.

## 3. Deployment & Infrastructure

The application is deployed automatically to a DigitalOcean Droplet via a GitHub Actions CI/CD pipeline.

### Deployment Trigger

Any push to the **`web-deployment`** branch will trigger the workflow defined in `.github/workflows/deploy.yml`.

### Required Infrastructure

To replicate or manage the deployment environment, the following DigitalOcean services are required:

1.  **DigitalOcean Droplet:** A standard Ubuntu droplet where the Docker container runs.
2.  **DigitalOcean Container Registry:** A private registry to store the application's Docker images.

### Required Secrets

The CI/CD pipeline relies on several secrets configured in the GitHub repository's "Settings > Secrets and variables > Actions" section:

*   **`DO_DROPLET_HOST`**: The public IP address of the DigitalOcean droplet.
*   **`DO_DROPLET_USER`**: The username for SSH access to the droplet (e.g., `root`).
*   **`DO_DROPLET_KEY`**: The private SSH key used to authenticate with the droplet.
*   **`DO_REGISTRY_USER`**: The username for the DigitalOcean Container Registry.
*   **`DO_REGISTRY_PASSWORD`**: An access token with write privileges for the DigitalOcean Container Registry.
*   **`SECRET_KEY`**: The production secret key that will be injected into the running container as an environment variable.
