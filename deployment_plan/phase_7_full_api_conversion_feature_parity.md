# Phase 7: Full API Conversion & Feature Parity

**Goal:** Convert all remaining Tauri `invoke` commands to Actix HTTP endpoints and adapt the frontend to use them, achieving full feature parity between the desktop application's core Autonomi-related functionalities and the web application.

---
## Stub P7.A: Identify Remaining Tauri Commands

*   **P7.A.1:** **Audit `src/app.ts` (and other frontend files):**
    *   **P7.A.1.1:** Systematically search for all occurrences of `invoke(`.
    *   **P7.A.1.2:** List each unique command name and its associated arguments.
*   **P7.A.2:** **Audit Rust Backend (`src-tauri/src/commands/` or similar):**
    *   **P7.A.2.1:** List all functions marked with `#[tauri::command]`.
    *   **P7.A.2.2:** Cross-reference with the list from `app.ts` to ensure all invoked commands are identified.
*   **P7.A.3:** **Prioritize Conversion:**
    *   **P7.A.3.1:** Group commands by functionality (e.g., cart management, user profile, order submission).
    *   **P7.A.3.2:** Decide on an order for conversion, potentially based on user workflow or complexity.

---
## Stub P7.B: Iterative API Endpoint Conversion (Backend - Actix)

*For each remaining Tauri command or logical group of commands:*

*   **P7.B.4:** **Design HTTP Endpoint:**
    *   **P7.B.4.1:** Determine appropriate HTTP method (GET, POST, PUT, DELETE).
    *   **P7.B.4.2:** Define URL path (e.g., `/api/cart`, `/api/orders`).
    *   **P7.B.4.3:** Specify request payload structure (JSON body for POST/PUT) and query/path parameters.
    *   **P7.B.4.4:** Define expected success and error response structures (JSON).
*   **P7.B.5:** **Implement Actix Handler:**
    *   **P7.B.5.1:** Create/update relevant handler module in `src-backend/src/handlers/`.
    *   **P7.B.5.2:** Write the Actix handler function, taking necessary extractors (`web::Json`, `web::Query`, `web::Path`, `web::Data<AppState>`).
    *   **P7.B.5.3:** Call the corresponding business logic from `autonomi-core` (or the refactored logic that was originally in the Tauri command).
    *   **P7.B.5.4:** Implement robust error mapping to HTTP responses.
    *   **P7.B.5.5:** Add input validation for request data.
*   **P7.B.6:** **Register Handler:** Add the new route to `src-backend/src/main.rs`.
*   **P7.B.7:** **Unit/Integration Tests (Backend):**
    *   **P7.B.7.1:** Write tests for the new Actix handler and the underlying business logic in `autonomi-core`.
    *   **P7.B.7.2:** Mock dependencies (like Autonomi client calls) where appropriate for unit tests.

---
## Stub P7.C: Iterative Frontend Adaptation

*For each newly converted API endpoint:*

*   **P7.C.8:** **Update Frontend API Service (`apiService.ts`):**
    *   **P7.C.8.1:** Add new functions to `apiService.ts` to call the new Actix endpoints, using the generic `fetchApi` wrapper.
    *   **P7.C.8.2:** Define TypeScript interfaces for request payloads and response data.
*   **P7.C.9:** **Modify UI Logic (`src/app.ts` and components):**
    *   **P7.C.9.1:** Replace the `invoke` call with the new `apiService` function call.
    *   **P7.C.9.2:** Adapt data handling, UI updates, and error display based on the HTTP API's behavior.
*   **P7.C.10:** **Local E2E Testing:**
    *   **P7.C.10.1:** Manually test the full user flow involving the newly converted feature in a local development environment (both frontend and backend running).
    *   **P7.C.10.2:** Use browser developer tools to inspect requests/responses.

---
## Stub P7.D: State Management Considerations

*   **P7.D.11:** **Review Client-Side State:**
    *   **P7.D.11.1:** As more functionality moves to server-side APIs, review how client-side state (e.g., `shoppingCart` in `app.ts`) is managed.
    *   **P7.D.11.2:** Determine if any state currently held only on the client should be synchronized with or fully managed by the backend (e.g., persisting shopping cart to Autonomi or a server-side session).
    *   **P7.D.11.3:** This might involve creating new API endpoints (e.g., POST `/api/cart/items`).
*   **P7.D.12:** **Data Consistency:**
    *   **P7.D.12.1:** Consider potential data consistency issues if the same data can be modified through different paths or is cached on the client.
    *   **P7.D.12.2:** Implement strategies for cache invalidation or data re-fetching when necessary.

---
## Stub P7.E: Completion and Parity Check

*   **P7.E.13:** **Verify All Commands Converted:** Ensure no `invoke` calls remain for core Autonomi-related features.
*   **P7.E.14:** **Feature Parity Testing:** Systematically test all user stories and features that were present in the desktop version to ensure they work correctly in the web version via the Actix API.
*   **P7.E.15:** **Update Documentation (if any):** Reflect API changes if internal API documentation exists.

---
**End of Phase 7** 