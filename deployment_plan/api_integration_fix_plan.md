# **Phase 1: Backend Service Configuration (`src-backend/src/main.rs`)**

### **Objective**
Align the Actix Web server configuration with the pre-existing route definitions in `api.rs` to ensure correct API endpoint registration.

### **Root Cause of Previous Failure**
A critical misinterpretation of the backend structure led to two errors:
1.  **Redundant Path Prefixing:** The `HttpServer` in `main.rs` was incorrectly configured to use `web::scope("/api")`. This was redundant because handlers in `api.rs` already define their full paths with the `#[get("/api/...")]` attribute, resulting in malformed routes (e.g., `/api/api/products`).
2.  **Typographical Error:** A typo was introduced (`get_product__id_handler` instead of `get_product_by_id_handler`), causing a compilation failure.

### **Action Items**
Modify `src-backend/src/main.rs` to directly register each service from the `api` module without a wrapping scope.

**Current (Incorrect) Code:**
```rust
// ...
        App::new()
            //...
            .service(
                web::scope("/api")
                    .service(api::health_check)
                    .service(api::get_wallets_handler)
                    .service(api::get_all_products_handler)
                    .service(api::get_product__id_handler) // <-- Typo
                    .service(api::create_cart_handler)
                    .service(api::get_cart_handler)
                    .service(api::update_cart_handler)
            )
// ...
```

**Target (Correct) Code:**
```rust
// ...
        App::new()
            //...
            .service(api::health_check)
            .service(api::get_wallets_handler)
            .service(api::get_all_products_handler)
            .service(api::get_product_by_id_handler) // <-- Corrected
            .service(api::create_cart_handler)
            .service(api::get_cart_handler)
            .service(api::update_cart_handler)
// ...
```

### **Verification**
1.  After editing, navigate to the workspace root in the terminal.
2.  Run `cargo check --bin src-backend` to ensure the file compiles without errors.
3.  Start the server (`$env:EVM_NETWORK=... cargo run --bin src-backend`).
4.  In a separate terminal, run `curl http://127.0.0.1:8000/api/products`. The command must return a `200 OK` status and a JSON array of products.

---

# **Phase 2: Frontend Application Entry Point (`src/main.ts`)**

### **Objective**
Ensure the application's core logic waits for asynchronous data-fetching operations to complete before proceeding, preventing UI rendering race conditions.

### **Root Cause of Previous Failure**
The `DOMContentLoaded` event listener invoked `initializeApp()` but did not `await` its promise resolution. Because `initializeApp` contains an async `fetch` call, the JavaScript event loop continued execution, attempting to render the UI before any product data had been retrieved. This resulted in a blank page, as the rendering functions had no data to work with when they were (or weren't) called.

### **Action Items**
In `src/main.ts`, refactor the `DOMContentLoaded` listener to be `async` and to `await` the `initializeApp` function call.

**Current (Incorrect) Code:**
```typescript
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeHamburgerMenu();
});
```

**Target (Correct) Code:**
```typescript
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeApp();
        initializeHamburgerMenu();
    } catch (error) {
        console.error("Fatal error during application initialization:", error);
        // Display a fallback error message in the main content area
        const container = document.getElementById('products-grid-container');
        if (container) {
            container.innerHTML = `<p>Error: Application failed to load.</p>`;
        }
    }
});
```

### **Verification**
1.  Run the frontend dev server (`npm run dev`).
2.  Open the browser and its developer console to the 'Console' tab.
3.  The log `"Initializing application..."` from `app.ts` must appear.
4.  Switch to the 'Network' tab. A request to `/api/products` must be visible with a `200` status code. The console must be free of any errors related to race conditions or uncaught promises.

---

# **Phase 3: Frontend Rendering and Type Cohesion (`src/app.ts`)**

### **Objective**
Fix all broken UI rendering by (A) aligning rendering function logic with the target HTML and CSS, and (B) ensuring TypeScript types are available across modules.

### **Root Cause of Previous Failure**
This was a multi-part failure caused by a lack of diligence:
1.  **Element ID Mismatch:** The `renderSidebar` function attempted to find an element with ID `sidebar-nav`, but the actual ID in `index.html` is `sidebar-nav-container`. This resulted in a blank sidebar menu.
2.  **CSS Class Mismatch:** The `renderApiProductCard` function generated HTML with class names (e.g., `product-content`, `product-tags`) that did not exist in `index.css`. The correct classes were more specific (e.g., `product-card-content`). This caused the product grid to render as unstyled, raw text.
3.  **Missing Type Exports:** Interfaces like `SidebarNavSection`, which are defined in `app.ts` but required by `main.ts` for its logic, were not exported. This caused TypeScript compilation to fail.

### **Action Items**
Perform three corrections within `src/app.ts`:

1.  **Export Interfaces:** Add the `export` keyword to shared type definitions.
    ```typescript
    // Add 'export' before each interface needed externally
    export interface ApiProduct { /* ... */ }
    export interface SidebarNavItem { /* ... */ }
    export interface SidebarNavSection { /* ... */ }
    ```

2.  **Correct Sidebar Target ID:**
    ```typescript
    // In renderSidebar()
    const navContainer = document.getElementById('sidebar-nav-container'); // Changed from 'sidebar-nav'
    ```

3.  **Correct Product Card CSS Classes:**
    ```html
    <!-- In renderApiProductCard() template string -->
    <div class="product-card-content"> <!-- Changed from product-content -->
        <h3 class="product-title">${product.name}</h3>
        <div class="product-card-tags">${tagsHTML}</div> <!-- Changed from product-tags -->
        <!-- ... -->
    </div>
    ```

### **Verification**
1.  After editing, the Vite dev server (`npm run dev`) must compile without any TypeScript errors.
2.  Upon loading `http://localhost:1420/`, the left sidebar must render correctly with all navigation items.
3.  The main content area must display a grid of fully styled product cards, identical in appearance to the original design. There should be no unstyled text.

---

# **Final System Test**

### **Procedure**
1.  Ensure no old `node` or `src-backend.exe` processes are running.
2.  In one terminal, start the corrected backend server.
3.  In a second terminal, start the corrected frontend server.
4.  Open a web browser to `http://localhost:1420/`.

### **Expected Outcome**
The application loads without errors in the console. The UI is fully intact, with a functional sidebar and a styled grid of products loaded from the backend. The user experience is identical to the pre-revert state, but the data pipeline is now correctly wired to the backend API. 