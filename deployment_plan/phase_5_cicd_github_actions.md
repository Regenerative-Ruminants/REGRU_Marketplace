# Phase 5: CI/CD Automation with GitHub Actions

**Goal:** Automate the build and deployment process from the `web-deployment` branch to the DigitalOcean droplet using GitHub Actions.

---
## Stub P5.A: GitHub Repository Secrets

*   **P5.A.1:** Identify Necessary Secrets:
    *   `DO_HOST`: Droplet's IP address.
    *   `DO_USER`: `your_deploy_user`.
    *   `DO_SSH_PRIVATE_KEY`: Private SSH key for `your_deploy_user`.
    *   `BACKEND_ENV_PRODUCTION`: The content of your production `.env` file for the backend (ensure this doesn't contain actual secrets if possible, or manage them securely. For `AUTONOMI_NETWORK_URL`, this might be okay. For `SECRET_KEY`, consider if it can be set directly in systemd service or other secure ways if this secret is too sensitive for GitHub Actions secrets). For now, assume it contains necessary backend runtime config.

*   **P5.A.2:** Add Secrets to GitHub Repository (`Settings` -> `Secrets and variables` -> `Actions`).

---
## Stub P5.B: GitHub Actions Workflow File (`.github/workflows/deploy.yml`)

*   **P5.B.3:** Create `.github/workflows/deploy.yml` on `web-deployment` branch.
*   **P5.B.4:** Define Workflow Triggers: `on: push: branches: [ web-deployment ] workflow_dispatch:`.
*   **P5.B.5:** Define Deployment Job (`build-and-deploy`, `runs-on: ubuntu-latest`).
*   **P5.B.6:** Step: Checkout Code (`actions/checkout@v4`).
*   **P5.B.7:** Step: Cache Dependencies (Optional but Recommended):
    *   Cache Rust (Cargo) dependencies (`Swatinem/rust-cache@v2`).
    *   Cache Node.js (pnpm) dependencies (`pnpm/action-setup@v2`, `actions/setup-node@v4` with pnpm caching).
*   **P5.B.8:** Step: Build Backend: `working-directory: ./src-backend`; `cargo build --release --verbose`.
*   **P5.B.9:** Step: Build Frontend: `pnpm install`; `pnpm build`.
*   **P5.B.10:** Step: Deploy to Server (using `appleboy/ssh-action@master`):
    *   Inputs: `host`, `username`, `key` from secrets.
    *   Script:
        '''bash
        set -e # Exit on error
        PROJECT_DIR="/var/www/your_project_name"
        BACKEND_DIR="$PROJECT_DIR/src-backend" # Or your backend crate path

        echo "Changing to project directory: $PROJECT_DIR"
        cd $PROJECT_DIR

        echo "Putting site into maintenance mode (optional - create maintenance.html and adjust Nginx)"
        # sudo cp $PROJECT_DIR/maintenance.html $PROJECT_DIR/dist/index.html # Example

        echo "Pulling latest changes from web-deployment branch..."
        git checkout web-deployment
        git fetch origin web-deployment
        git reset --hard origin/web-deployment # Force update to match remote
        git pull origin web-deployment # Should be up-to-date, but good practice

        echo "Writing production .env file for backend..."
        echo "${{ secrets.BACKEND_ENV_PRODUCTION }}" > $BACKEND_DIR/.env
        sudo chmod 600 $BACKEND_DIR/.env # Secure it

        echo "Building backend..."
        cd $BACKEND_DIR
        # Assuming Rust toolchain is already on PATH for your_deploy_user due to rustup install
        # Add 'source $HOME/.cargo/env' if necessary or use absolute path to cargo
        source $HOME/.cargo/env 
        cargo build --release --verbose
        cd $PROJECT_DIR # Back to project root

        echo "Building frontend..."
        # Assuming Node/pnpm are on PATH
        pnpm install --frozen-lockfile # Ensure consistent dependencies
        pnpm build

        echo "Restarting backend service..."
        sudo systemctl restart your_backend_app.service # Use the correct service name

        echo "Reloading Nginx (if config changes, otherwise not strictly needed for content deploy)"
        # sudo nginx -t && sudo systemctl reload nginx # Only if Nginx config is part of repo

        echo "Taking site out of maintenance mode (optional)"
        # sudo rm $PROJECT_DIR/dist/index.html # Example, restore original Nginx config

        echo "Deployment successful!"
        '''
    *   **Pitfall:** Ensure `your_deploy_user` has passwordless `sudo` rights for `systemctl restart/reload` or configure specific `sudoers` rules.
    *   **Pitfall:** The `source $HOME/.cargo/env` might be needed if the SSH session isn't a full login shell.

---
## Stub P5.C: Testing the CI/CD Pipeline

*   **P5.C.11:** Make a small, non-critical change to the `web-deployment` branch (e.g., update a text string in the frontend).
*   **P5.C.12:** Push the change to GitHub.
*   **P5.C.13:** Monitor the GitHub Actions workflow execution in the "Actions" tab of your repository.
*   **P5.C.14:** Verify the changes are live on your droplet after a successful deployment.
*   **P5.C.15:** Troubleshoot any workflow errors by examining logs in GitHub Actions.

---
## Stub P5.D: Workflow Enhancements (Future Considerations)

*   **P5.D.16:** Add Linting and Testing Steps: Before build/deploy, run `cargo fmt`, `cargo clippy`, `cargo test`, `pnpm lint`, `pnpm test` (Playwright E2E tests against a staging environment or local setup within Actions if feasible).
*   **P5.D.17:** Slack/Discord Notifications: Notify on deployment success/failure.
*   **P5.D.18:** Staging Environment: Implement a similar workflow for a staging droplet before deploying to production.
*   **P5.D.19:** Atomic Deployments / Blue-Green: For zero-downtime, explore symlinking release directories or using Nginx for traffic switching (more advanced).

---
**End of Phase 5** 