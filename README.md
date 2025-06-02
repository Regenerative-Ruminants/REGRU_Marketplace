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
cargo test                      # Rust logic
pnpm exec playwright test       # opens Tauri, adds item, pays ANT, verifies Scratchpad
```

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

</rewritten_file> 