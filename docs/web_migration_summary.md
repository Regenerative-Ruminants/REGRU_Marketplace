# Migration from Tauri Desktop to Web Application

This document outlines the architectural changes, deployment pipeline, and key configurations implemented during the migration of the REGRU Marketplace application from a Tauri-based desktop application to a fully containerized web application deployed on DigitalOcean.

## 1. Architectural Overview

The original application was a monolithic Tauri application, tightly coupling the frontend and backend logic. The primary goal of the refactor was to decouple these components to enable web deployment and improve maintainability.

### New Architecture

The new architecture consists of three main components within a single Rust workspace:

1.  **`crates/autonomi-core` (Shared Library):** A new Rust library created to house the core business logic, such as wallet management and file system access. This code is now shared between the web backend and could still be used by the Tauri application if needed.

2.  **`src-backend` (Web Server):** A new Actix-based web server responsible for:
    *   Exposing a REST API (e.g., `/health`, `/api/wallets`).
    *   Serving the compiled static frontend assets (HTML, CSS, JS) located in the `dist/` directory.

3.  **`src` (Frontend):** The existing Svelte/Vite-based frontend. The build process was reconfigured to be independent of Tauri, generating a standard, static web application in the `dist/` directory.

This separation allows for independent development, testing, and deployment of the frontend and backend components.

## 2. CI/CD and Deployment Pipeline

A full continuous integration and deployment (CI/CD) pipeline was established using **GitHub Actions**. The workflow is defined in `.github/workflows/deploy.yml` and automates the entire process from code push to live deployment.

### Pipeline Stages

1.  **Trigger:** The workflow is triggered on any push to the `web-deployment` branch.
2.  **Checkout Code:** The repository source code is checked out.
3.  **Build Frontend:**
    *   Node.js is set up.
    *   `npm install` is run to gather dependencies.
    *   `npm run build` is executed to compile the TypeScript/Svelte frontend into static HTML, CSS, and JS files in the `dist/` directory.
4.  **Build Docker Image:**
    *   Docker Buildx is set up.
    *   The runner logs into the **DigitalOcean Container Registry**.
    *   A multi-stage `Dockerfile` is used to build a lightweight, production-ready Docker image:
        *   A `chef` stage prepares the Rust build environment using `cargo-chef` for optimized, cached dependency building.
        *   A `builder` stage compiles the Rust backend (`src-backend`) and the shared `autonomi-core` library.
        *   The final, minimal stage copies the compiled backend executable and the static frontend assets (`dist/`) into a distroless container for a smaller footprint and improved security.
5.  **Push Docker Image:** The newly built image is tagged and pushed to the DigitalOcean Container Registry.
6.  **Deploy to Droplet:**
    *   An SSH connection is made to the DigitalOcean Droplet.
    *   The script on the droplet performs the following actions:
        1.  Installs Docker if it's not already present (`apt-get install -y docker.io`).
        2.  Logs into the DigitalOcean Container Registry using stored secrets.
        3.  Pulls the latest version of the application image.
        4.  Stops and removes the old running container.
        5.  Starts a new container from the new image, mapping the droplet's **port 80** (HTTP) to the container's **port 8000**.

## 3. Key Configuration Files

*   **`src-backend/src/main.rs`**: Configured to bind the Actix server to `0.0.0.0:8000`. This is crucial for accepting connections from outside the Docker container.
*   **`vite.config.ts`**: Updated with a `build` section to correctly bundle and hash frontend assets for production.
*   **`index.html`**: The root HTML file was reverted to reference the source TypeScript file (`/src/main.ts`). The Vite build process uses this as an entry point and automatically generates a new `dist/index.html` with correctly linked, compiled assets.
*   **`.github/workflows/deploy.yml`**: The heart of the automation. Contains all steps, secrets, and commands for the build and deploy process.
*   **`Dockerfile`**: Defines the environment and steps for creating the final, runnable application container.
*   **`src-backend/Cargo.toml`**: The dependency manifest for the backend, which includes `actix-files` for serving the frontend and a corrected `path` to the `autonomi-core` workspace member.

This migration successfully transformed the project into a modern, scalable, and automatically deployed web application. 