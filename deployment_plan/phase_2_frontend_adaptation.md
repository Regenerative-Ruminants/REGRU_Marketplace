# Phase 2: Frontend Adaptation

**Goal:** Modify the existing TypeScript frontend (`src/app.ts`) to communicate with the new Actix backend via HTTP (`fetch` API) instead of Tauri's `invoke` mechanism for the initially converted API endpoints.

---
## Stub P2.A: API Service Layer in Frontend

*   **P2.A.1:** **Create/Update API Service Module (`apiService.ts`).**
    *   **P2.A.1.1:** In `src/`, create `apiService.ts` to centralize API calls.
    *   **P2.A.1.2:** Define `API_BASE_URL = '/api'`.
    *   **P2.A.1.3:** Implement a generic `fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T>` wrapper:
        *   Prepends `API_BASE_URL` to the endpoint.
        *   Handles basic `fetch` options.
        *   Checks `response.ok`.
        *   Attempts to parse JSON from error responses for messages.
        *   Throws a structured error on HTTP failure.
        *   Parses successful JSON response.
        '''typescript
        // src/apiService.ts (conceptual)
        const API_BASE_URL = '/api';

        export class ApiError extends Error {
            constructor(message: string, public status?: number, public errorData?: any) {
                super(message);
                this.name = 'ApiError';
            }
        }

        export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // Ignore if response body is not JSON or empty
                }
                throw new ApiError(
                    errorData?.message || `HTTP error! Status: ${response.status}`,
                    response.status,
                    errorData
                );
            }
            // Handle cases where response might be empty for 204 No Content etc.
            if (response.status === 204 || response.headers.get("content-length") === "0") {
                return undefined as T; // Or handle as per API design
            }
            return response.json() as Promise<T>;
        }
        '''

---
## Stub P2.B: Modifying Core Frontend Logic

*   **P2.B.2:** **Update Wallet Fetching Logic.**
    *   **P2.B.2.1:** In `src/app.ts` (e.g., `openWalletsModal`), replace `invoke("get_available_wallets")` with `fetchApi<Wallet[]>('/wallets')`. (Define `Wallet` interface based on Rust struct).
    *   **P2.B.2.2:** Update UI rendering and error handling for this call.
        '''typescript
        // Example in openWalletsModal
        // import { fetchApi, ApiError } from './apiService';
        // import type { Wallet } from './yourTypeDefinitions'; // Make sure Wallet type is defined

        // async function openWalletsModal(): Promise<void> {
        //    // ...
        //    try {
        //        const wallets = await fetchApi<Wallet[]>('/wallets');
        //        walletModalResults.textContent = JSON.stringify(wallets, null, 2);
        //    } catch (error) {
        //        console.error("Error fetching wallets via API:", error);
        //        const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
        //        walletModalResults.textContent = `Error fetching wallets: ${errorMessage}`;
        //    }
        // }
        '''

*   **P2.B.3:** **Update Product Fetching Logic.**
    *   **P2.B.3.1:** In `navigateTo` (for "browse_all_products"), replace `invoke` for products with `fetchApi<Product[]>('/products?category=...')`. (Define `Product` interface).
    *   **P2.B.3.2:** Construct query parameters dynamically.
    *   **P2.B.3.3:** Update UI rendering (`renderProductGrid`) and error handling.
        '''typescript
        // Example in navigateTo for browse_all_products
        // import { fetchApi, ApiError } from './apiService';
        // import type { Product } from './yourTypeDefinitions';

        // if (viewId === "browse_all_products") {
        //     try {
        //         const queryParams = new URLSearchParams();
        //         if (activeFilters.category) queryParams.append('category', activeFilters.category);
        //         // Add other params: currentSearchTerm, currentSortOption to queryParams
        //         // Note: Decide if search/sort is backend or frontend. If backend, pass params.
        //
        //         const products = await fetchApi<Product[]>(`/products?${queryParams.toString()}`);
        //
        //         // If search/sort is still frontend, apply it here to 'products'
        //         // let processedProducts = applyFrontendSearchAndSort(products, currentSearchTerm, currentSortOption);
        //         // renderProductGrid(processedProducts);
        //         renderProductGrid(products); // If backend handles search/sort
        //
        //     } catch (error) {
        //         console.error("Error fetching products:", error);
        //         const Emsg = error instanceof ApiError ? error.message : "Failed to load products.";
        //         if (productsGridContainer) productsGridContainer.innerHTML = `<p class="col-span-full text-center p-8 text-red-500">${Emsg}</p>`;
        //     }
        // }
        '''
    *   **P2.B.3.4:** **Critical Decision:** Determine if search and sort logic (currently in `navigateTo`) should remain client-side after fetching all/filtered products, or if these parameters should be passed to the backend API for server-side processing. For initial conversion, keeping it client-side might be simpler, then optimize to server-side.

---
## Stub P2.C: Type Definitions and Error Handling

*   **P2.C.4:** **Align TypeScript Interfaces.**
    *   **P2.C.4.1:** Define/update TypeScript interfaces (`Product`, `Wallet`, etc. in a `types.ts` or similar) to accurately match the JSON structures returned by the Actix API. Pay attention to Rust types like `Option<T>` (becomes `T | null` or `T | undefined`) and date/time formats.
    *   **P2.C.4.2:** Use these types in `fetchApi` calls and in UI components.

*   **P2.C.5:** **Enhance Frontend Error Handling Display.**
    *   **P2.C.5.1:** Implement user-friendly display for errors from `fetchApi` (e.g., toast notifications, inline messages).
    *   **P2.C.5.2:** Use the `ApiError` class to potentially display more specific messages or handle specific status codes if needed.

---
## Stub P2.D: Build and Initial Check

*   **P2.D.6:** **Frontend Build.**
    *   **P2.D.6.1:** Run `pnpm build` (or your frontend build command).
    *   **P2.D.6.2:** Ensure the build completes without errors.

*   **P2.D.7:** **Review Changes.**
    *   **P2.D.7.1:** Check that `invoke` calls for converted endpoints are fully replaced.
    *   **P2.D.7.2:** Verify TypeScript types are consistent.
    *   **P2.D.7.3:** Confirm basic error display is in place.

---
**End of Phase 2** 