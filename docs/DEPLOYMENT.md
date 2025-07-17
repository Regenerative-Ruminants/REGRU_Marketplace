# Deployment Architecture

This document outlines the deployment architecture for the Regenerative Marketplace application, which uses a continuous deployment pipeline to a DigitalOcean Droplet.

## Overview

The architecture is composed of several key components:
1.  **GitHub Actions:** For continuous integration and deployment (CI/CD).
2.  **Docker:** To containerize the application.
3.  **DigitalOcean:** For hosting the Droplet and the Container Registry.
4.  **Caddy:** As a reverse proxy and for automatic HTTPS.

The process is triggered by a push to the `web-deployment` branch.

---

## 1. GitHub Actions Workflow

The workflow is defined in `.github/workflows/deploy.yml`.

### Steps:

1.  **Checkout Code:** The workflow begins by checking out the latest commit from the `web-deployment` branch.

2.  **Build Frontend:**
    - It sets up Node.js.
    - It runs `npm install` to get dependencies.
    - It runs `npm run build` to compile the frontend TypeScript and CSS into static assets in the `dist/` directory.
    - During this step, it injects the `VITE_API_BASE_URL` environment variable. This variable's value comes from the `DO_API_URL` GitHub secret and tells the compiled frontend where to send API requests (e.g., `https://regru.org`).

3.  **Build and Push Docker Image:**
    - The `Dockerfile` compiles the Rust backend in a build stage.
    - In the final stage, it creates a minimal image containing the compiled Rust binary and the static frontend assets from the `dist/` directory.
    - This Docker image is then pushed to the private DigitalOcean Container Registry.

4.  **Deploy to Droplet:**
    - The workflow connects to the DigitalOcean Droplet via SSH.
    - It pulls the latest Docker image from the registry.
    - It stops and removes the old running container.
    - It starts the new container with the following configuration:
        - The `SECRET_KEY` and `EVM_NETWORK` environment variables are passed into the container. The backend uses these to interact with the blockchain.
        - The container's port 8000 is mapped to `127.0.0.1:8000` on the Droplet, meaning the application is **only accessible from the server itself** and not directly from the public internet.
    - Finally, it runs `systemctl restart caddy` to ensure Caddy picks up the newly running application container.

---

## 2. Caddy Server Configuration

Caddy is installed directly on the Droplet and runs as a `systemd` service, ensuring it's always running. Its configuration is in `/etc/caddy/Caddyfile`.

### Responsibilities:

1.  **Automatic HTTPS:** Caddy automatically provisions and renews SSL/TLS certificates from Let's Encrypt for `regru.org` and `www.regru.org`. It handles all TLS termination, so the backend application does not need to worry about HTTPS.

2.  **Reverse Proxy:** It listens for public traffic on ports 80 and 443. It forwards all incoming requests for `regru.org` to the backend service running inside the Docker container at `http://localhost:8000`. This is how the public accesses the application securely.

## 3. Environment Variables and Secrets

These are configured in the GitHub repository under **Settings > Secrets and variables > Actions**.

-   `DO_API_URL`: The public URL of the site (e.g., `https://regru.org`). Used to build the frontend.
-   `DO_DROPLET_HOST`: The IP address of the DigitalOcean Droplet.
-   `DO_DROPLET_USER`: The user for SSH access (e.g., `root`).
-   `DO_DROPLET_KEY`: The private SSH key for accessing the Droplet.
-   `DO_REGISTRY_USER` / `DO_REGISTRY_PASSWORD`: Credentials for the DigitalOcean Container Registry.
-   `SECRET_KEY`: The wallet private key used by the backend service for on-chain operations.

### Product Pointer Configuration

A new file `src-backend/config/products.toml` must be present in the Docker image.  The CI pipeline copies this during the `cargo-chef` stage so the backend can resolve live catalogue data at runtime. 