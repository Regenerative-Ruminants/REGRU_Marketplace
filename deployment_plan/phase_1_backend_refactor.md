# Phase 1: Backend Refactoring (Rust/Actix Setup & Core API Conversion)

**Goal:** Transform the core Rust application logic from a Tauri command-based system to an Actix Web HTTP server, establishing the foundation for web deployment. Convert a few key API endpoints using the existing Autonomi client logic.

---
## Stub P1.A: Project Setup & Actix Integration

*   **P1.A.1:** **Decision: Backend Crate Structure.**
    *   **P1.A.1.1:** Evaluate refactoring `src-tauri/` directly versus creating a new crate (e.g., `src-backend/`).
    *   **P1.A.1.2:** **Recommendation:** Create `src-backend/` with its own `Cargo.toml`. Move shared Autonomi logic to a common library crate (e.g., `crates/autonomi-core/`) that both `src-tauri/` (for desktop) and `src-backend/` (for web) depend on. This promotes cleaner separation.
    *   **P1.A.1.3:** **Decision for this plan:** Assume creation of `src-backend/` and `autonomi-core/`.

*   **P1.A.2:** **Create `autonomi-core` Crate.**
    *   **P1.A.2.1:** Create `crates/autonomi-core/Cargo.toml` and `crates/autonomi-core/src/lib.rs`.
    *   **P1.A.2.2:** Move relevant Autonomi interaction logic, struct definitions (like `Wallet`, `Product`), and business logic from `src-tauri/src/` into `autonomi-core/src/lib.rs` or its submodules.
    *   **P1.A.2.3:** Update `src-tauri/Cargo.toml` to depend on `autonomi-core = { path = "../../crates/autonomi-core" }`.
    *   **P1.A.2.4:** Adjust paths and `use` statements in `src-tauri/` to reference logic from `autonomi-core`.

*   **P1.A.3:** **Create `src-backend` Crate.**
    *   **P1.A.3.1:** Create `src-backend/Cargo.toml` and `src-backend/src/main.rs`.
    *   **P1.A.3.2:** Add initial dependencies to `src-backend/Cargo.toml`:
        *   `actix-web = "4"`
        *   `actix-rt = "2"`
        *   `tokio = { version = "1", features = ["macros", "rt-multi-thread"] }`
        *   `serde = { version = "1", features = ["derive"] }`
        *   `serde_json = "1"`
        *   `dotenv = "0.15"`
        *   `env_logger = "0.9"` (or other logging framework like `tracing`)
        *   `autonomi-core = { path = "../../crates/autonomi-core" }`
    *   **P1.A.3.3:** Create a basic `main.rs` in `src-backend/src/` for the Actix server (see example in previous detailed plan, but without DB/ES client setup). Include a `/health` endpoint.

*   **P1.A.4:** **Environment Configuration Setup for Actix Backend.**
    *   **P1.A.4.1:** Create `.env.example` in `src-backend/` for:
        *   `APP_HOST=127.0.0.1`
        *   `APP_PORT=8000`
        *   `RUST_LOG="info,src_backend=debug"`
        *   `AUTONOMI_NETWORK_URL="http://localhost:8645"` (Example, if Autonomi client needs it)
        *   `SECRET_KEY="generate_a_strong_random_secret_key"` (For potential future use like sessions/JWTs)
    *   **P1.A.4.2:** Create `.env` in `src-backend/` for local development. Ensure `.env` is in root `.gitignore`.
    *   **P1.A.4.3:** Integrate `dotenv` and `env_logger` in `src-backend/src/main.rs`.

---
## Stub P1.B: Shared State (Autonomi Client)

*   **P1.B.5:** **Autonomi Client Initialization & Shared State.**
    *   **P1.B.5.1:** Design how `autonomi_core::Client` (or equivalent from your `autonomi-core` crate) will be initialized.
    *   **P1.B.5.2:** Initialize the Autonomi client once at application startup (reading necessary config like network URL from `.env`).
    *   **P1.B.5.3:** Share the initialized Autonomi client instance with Actix handlers using `web::Data`.
        '''rust
        // Example in src-backend/src/main.rs
        // use autonomi_core::Client as AutonomiClient; // Assuming this
        // pub struct AppState {
        //     autonomi_client: AutonomiClient,
        // }
        // ... in main()
        // let autonomi_config = // ... load from env vars ...
        // let autonomi_client = AutonomiClient::init(autonomi_config).await.expect("Failed to init Autonomi Client");
        // let app_state = web::Data::new(AppState { autonomi_client });
        // HttpServer::new(move || {
        //     App::new()
        //         .app_data(app_state.clone())
        //         // ... services
        // })
        '''
    *   **P1.B.5.4:** Ensure robust error handling during Autonomi client initialization.

---
## Stub P1.C: API Endpoint Conversion (Key Endpoints)

*   **P1.C.6:** **Convert `get_available_wallets` Endpoint.**
    *   **P1.C.6.1:** Create `src-backend/src/handlers/wallets.rs`.
    *   **P1.C.6.2:** Define an Actix handler for `GET /api/wallets` that uses the shared `AutonomiClient` from `web::Data` to fetch wallets.
    *   **P1.C.6.3:** Adapt existing logic from `autonomi-core` (originally in Tauri command).
    *   **P1.C.6.4:** Map errors from `autonomi-core` to appropriate Actix HTTP error responses.
    *   **P1.C.6.5:** Register handler in `src-backend/src/main.rs`.

*   **P1.C.7:** **Convert `get_products` Endpoint.**
    *   **P1.C.7.1:** Create/update `src-backend/src/handlers/products.rs`.
    *   **P1.C.7.2:** Define Actix handler for `GET /api/products` (accepting query params like `category`). Use shared `AutonomiClient`.
    *   **P1.C.7.3:** Adapt existing product fetching logic from `autonomi-core`.
    *   **P1.C.7.4:** Implement error handling and register in `main.rs`.

*   **P1.C.8:** **Standardized Error Responses.**
    *   **P1.C.8.1:** Define a common JSON error response structure (e.g., `{ "status": "error", "message": "..." }`).
    *   **P1.C.8.2:** Implement helpers or use Actix features for consistent error formatting.
    *   **P1.C.8.3:** **Pitfall:** Avoid leaking sensitive internal error details.

---
## Stub P1.D: Build & Basic Local Run

*   **P1.D.9:** **Setup `src-backend` Build & Run.**
    *   **P1.D.9.1:** Test `cargo build --manifest-path src-backend/Cargo.toml`.
    *   **P1.D.9.2:** Test `cargo run --manifest-path src-backend/Cargo.toml`.
    *   **P1.D.9.3:** Verify server starts and `/health` endpoint is accessible.

*   **P1.D.10:** **Test Converted API Endpoints Locally.**
    *   **P1.D.10.1:** Use `curl` or Postman to test `/api/wallets` and `/api/products`.
    *   **P1.D.10.2:** Verify responses and server logs.

*   **P1.D.11:** **Review & Refine Phase 1.**
    *   **P1.D.11.1:** Check for TODOs, placeholders.
    *   **P1.D.11.2:** Ensure logging is adequate for debugging.

---
**End of Phase 1** 