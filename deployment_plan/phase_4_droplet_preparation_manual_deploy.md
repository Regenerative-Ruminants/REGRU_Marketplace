# Phase 4: Droplet Preparation & Initial Manual Deployment

**Goal:** Configure the DigitalOcean droplet and manually deploy the first version of the web application to see it running live. Focus is on getting a functional, manually deployed version online using the existing Autonomi-backed logic.

---
## Stub P4.A: Droplet OS Configuration & Security Basics

*   **P4.A.1:** Connect to Droplet (SSH as `root`).
*   **P4.A.2:** Create Deploy User (`your_deploy_user`), add to `sudo` group, set up SSH key authentication.
*   **P4.A.3:** Secure SSH (disable root login, password auth). **Verify key login first!**
*   **P4.A.4:** System Updates (`sudo apt update && sudo apt upgrade -y`).
*   **P4.A.5:** Configure Firewall (UFW): `sudo ufw allow OpenSSH`, `http`, `https`, then `sudo ufw enable`.

---
## Stub P4.B: Install Dependencies on Droplet

*(Run as `your_deploy_user`, use `sudo` where needed)*

*   **P4.B.6:** Install Git: `sudo apt install git -y`.
*   **P4.B.7:** Install Rust Toolchain: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`; `source $HOME/.cargo/env`; install build tools (`sudo apt install build-essential pkg-config libssl-dev -y`).
*   **P4.B.8:** Install Node.js & pnpm: Use NodeSource to get LTS Node.js, then `sudo npm install -g pnpm`.
*   **P4.B.9:** Install Nginx: `sudo apt install nginx -y`; `sudo systemctl start nginx`; `sudo systemctl enable nginx`. Verify Nginx default page.

---
## Stub P4.C: Manual Code Deployment & Build

*   **P4.C.10:** Create Project Directory: `sudo mkdir -p /var/www/your_project_name`; `sudo chown -R your_deploy_user:your_deploy_user /var/www/your_project_name`; `cd /var/www/your_project_name`.
*   **P4.C.11:** Clone Repository: `git clone YOUR_GITHUB_REPO_URL .`; `git checkout web-deployment`.
*   **P4.C.12:** Build Frontend: `pnpm install`; `pnpm build`. Note output directory (e.g., `dist/`).
*   **P4.C.13:** Build Backend: `cd src-backend/` (or your backend crate); `cargo build --release`. Note executable path (e.g., `target/release/your_backend_executable_name`).

---
## Stub P4.D: Backend Configuration & Service Setup (systemd)

*   **P4.D.14:** Backend Environment Configuration on Server:
    *   Navigate to backend directory (`/var/www/your_project_name/src-backend/`).
    *   Create `.env` (`nano .env`).
    *   Populate with **production values**:
        *   `APP_HOST=0.0.0.0` (or `127.0.0.1` for local proxy)
        *   `APP_PORT=8000` (internal backend port)
        *   `RUST_LOG="info"`
        *   `AUTONOMI_NETWORK_URL="URL_OF_YOUR_ACCESSIBLE_AUTONOMI_NODE"` (This is critical - ensure your droplet can reach your Autonomi network node. If running Autonomi locally for dev, this needs to be a publicly accessible node or a tunnel for production.)
        *   `SECRET_KEY="your_VERY_STRONG_production_secret_key"`
    *   Secure `.env` file: `chmod 600 .env`.
    *   **Critical Pitfall:** The `AUTONOMI_NETWORK_URL` must point to an Autonomi node that this deployed Actix backend can reach. If you were using `./scripts/start-local-autonomi.sh` for development, that local Autonomi node is *not* accessible from the droplet unless the droplet *is* your local machine or you set up specific network configurations (e.g., VPN, ngrok for temporary testing - not for production). For a real deployment, the Actix backend on the droplet needs to connect to a persistent, accessible Autonomi node (testnet or mainnet).

*   **P4.D.15:** Create systemd Service for Backend (`your_backend_app.service`):
    *   `sudo nano /etc/systemd/system/your_backend_app.service`.
    *   Configure `User`, `Group`, `WorkingDirectory`, `EnvironmentFile`, `ExecStart` (path to release executable), `Restart=always`.
    *   Set up logging (e.g., `StandardOutput=append:/var/log/your_backend_stdout.log`).
    *   `sudo systemctl daemon-reload`; `sudo systemctl start your_backend_app.service`; `sudo systemctl enable your_backend_app.service`.
    *   Check status and logs: `sudo systemctl status your_backend_app.service`; `sudo journalctl -u your_backend_app.service -f`.

---
## Stub P4.E: Nginx Configuration for Web App

*   **P4.E.16:** Configure Nginx Server Block (`your_project_name_web`):
    *   `sudo nano /etc/nginx/sites-available/your_project_name_web`.
    *   Set `listen 80`, `server_name YOUR_DROPLET_IP_OR_DOMAIN`.
    *   Set `root /var/www/your_project_name/dist;` (frontend build output).
    *   `location / { try_files $uri $uri/ /index.html; }`.
    *   `location /api { proxy_pass http://127.0.0.1:8000; ... (standard proxy headers) ... }` (Ensure backend port matches).
    *   Set up access and error logs. Add basic security headers.
    *   `sudo ln -s /etc/nginx/sites-available/your_project_name_web /etc/nginx/sites-enabled/`.
    *   Remove default Nginx site if conflicting.
    *   Test Nginx config: `sudo nginx -t`. Reload: `sudo systemctl reload nginx`.

---
## Stub P4.F: Initial Live Test

*   **P4.F.17:** Access Application via `http://YOUR_DROPLET_IP`.
*   **P4.F.18:** Test converted features.
*   **P4.F.19:** **Troubleshooting:**
    *   Browser console, Nginx logs, backend service logs (`journalctl`, file logs).
    *   `curl http://127.0.0.1:8000/api/health` from droplet to test backend directly.
    *   **Connectivity to Autonomi Network is key.** If the Actix app on the droplet cannot reach the configured Autonomi node, API calls will fail.

*   **P4.F.20:** Iterate and Fix: Adjust server configs. For code changes, manually pull and rebuild on server for now.

---
**End of Phase 4** 