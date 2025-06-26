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

A regenerative marketplace for local producers and consumers.

## Development

To run the application locally, you will need to have Node.js and Rust installed.

```
npm install
npm run dev
```

The application will be available at `http://localhost:1420`.

The backend server will be available at `http://localhost:8000`.

To run the backend server:

```
cd src-backend
cargo run
```


## Deployment

Deployment is handled automatically by a GitHub Actions workflow. Any push to the `web-deployment` branch will trigger a new deployment. 