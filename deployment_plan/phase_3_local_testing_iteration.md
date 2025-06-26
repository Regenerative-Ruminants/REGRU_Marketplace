# Phase 3: Local End-to-End Testing & Iteration

**Goal:** Thoroughly test the integrated frontend (using `fetch`) and Actix backend running locally to ensure core functionality works as expected before attempting deployment.

---
## Stub P3.A: Local Development Environment Setup

*   **P3.A.1:** **Run Backend Server.**
    *   **P3.A.1.1:** Terminal 1: `cd src-backend/`.
    *   **P3.A.1.2:** Ensure `src-backend/.env` is configured for local Autonomi network and any other local needs.
    *   **P3.A.1.3:** Run `cargo run --manifest-path Cargo.toml` (or `cargo watch -x run`).
    *   **P3.A.1.4:** Verify Actix server starts (e.g., listening on `http://127.0.0.1:8000`).

*   **P3.A.2:** **Run Frontend Development Server.**
    *   **P3.A.2.1:** Terminal 2: Project root.
    *   **P3.A.2.2:** Run `pnpm dev` (or equivalent). (e.g., starts on `http://localhost:5173`).
    *   **P3.A.2.3:** **CORS Configuration in Actix Backend:**
        *   If frontend dev server origin (`http://localhost:5173`) differs from backend API origin (`http://127.0.0.1:8000`), configure CORS in `src-backend/src/main.rs`.
        *   Add `actix-cors` crate.
        *   Configure `Cors` middleware in Actix `App` to allow frontend origin, necessary methods (GET, POST, etc.), and headers.
            '''rust
            // src-backend/src/main.rs (inside HttpServer::new closure)
            // use actix_cors::Cors;
            // let cors = Cors::default()
            //      .allowed_origin("http://localhost:5173") // Your frontend dev server
            //      .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            //      .allowed_headers(vec![actix_web::http::header::CONTENT_TYPE, actix_web::http::header::ACCEPT])
            //      .supports_credentials() // If you plan to use cookies/auth headers
            //      .max_age(3600);
            // App::new().wrap(cors) // Add as one of the first .wrap() calls
            //     // ... other middleware and services
            '''
        *   **Pitfall:** Incorrect CORS setup is common. Check browser console for CORS errors.

---
## Stub P3.B: Functional Testing

*   **P3.B.3:** **Test Wallet Functionality.**
    *   **P3.B.3.1:** Open app in browser (frontend dev server URL).
    *   **P3.B.3.2:** Trigger wallets modal.
    *   **P3.B.3.3:** Verify wallets are fetched from Actix backend via HTTP and displayed.
    *   **P3.B.3.4:** Check browser console and Actix server logs for errors.

*   **P3.B.4:** **Test Product Listing & Client-Side Filtering/Search.**
    *   **P3.B.4.1:** Navigate to "All Products".
    *   **P3.B.4.2:** Verify products are fetched from Actix backend.
    *   **P3.B.4.3:** Test existing client-side filters and search. If they were meant to become server-side, this is where you'd note the discrepancy for future work or adapt the API call.
    *   **P3.B.4.4:** Check console and server logs.

*   **P3.B.5:** **Test Edge Cases and Error Conditions.**
    *   **P3.B.5.1:** Simulate backend errors (e.g., Autonomi client returns error) to test frontend display.
    *   **P3.B.5.2:** Test with empty API responses (no wallets, no products).

---
## Stub P3.C: Debugging and Iteration

*   **P3.C.6:** **Backend Debugging (Rust/Actix).**
    *   **P3.C.6.1:** Use `log::debug!`, `println!` (for quick checks), or a proper debugger.
    *   **P3.C.6.2:** Check Actix server logs carefully.

*   **P3.C.7:** **Frontend Debugging (TypeScript).**
    *   **P3.C.7.1:** Browser developer tools (Network, Console, Debugger).
    *   **P3.C.7.2:** `console.log` statements, debugger breakpoints.

*   **P3.C.8:** **Iterate and Fix.**
    *   **P3.C.8.1:** Address bugs found in either frontend or backend.
    *   **P3.C.8.2:** Re-run local servers, re-test.
    *   **P3.C.8.3:** Commit changes frequently to `web-deployment` branch.

---
## Stub P3.D: Prepare for Deployment

*   **P3.D.9:** **Final Local Sanity Check.**
    *   **P3.D.9.1:** Converted features are stable locally.
    *   **P3.D.9.2:** Remove temporary debugging code.
    *   **P3.D.9.3:** `.env` file for backend has production-like placeholders/structure.

*   **P3.D.10:** **Confirm Build Processes.**
    *   **P3.D.10.1:** `cargo build --manifest-path src-backend/Cargo.toml --release` completes.
    *   **P3.D.10.2:** `pnpm build` (frontend) completes, outputs to `dist/`.

---
**End of Phase 3** 