# Phase 2: Frontend Shopping-Cart Integration with Backend API

This phase connects the existing UI cart logic to the real backend `/api/*` cart routes implemented earlier.

---

## Stub A: Wire Up Cart API Calls

Objective: Every add/remove/quantity change in the UI must call the corresponding backend route and update local state from the server’s authoritative response.

* **2-A-1** Investigate current cart helper functions in `src/app.ts`; list the exact lines that mutate `shoppingCart` locally.
* **2-A-2** Create `src/cartService.ts` abstraction wrapping `fetch('/api/cart', …)` calls (POST/PUT/DELETE/GET).
* **2-A-3** Refactor UI handlers to delegate to `cartService` and update the reactive state from the returned JSON.
* **2-A-4** Implement optimistic-UI spinner + error toast on failure.

### Mandatory Pause for Testing

* Automated: Write Playwright test “Cart API Sync” – add item, reload page, expect item persists (GET /cart).
* User test: You manually add an item, refresh the browser, verify the cart is identical.

---

## Stub B: Cart Badge & Sidebar Counts

Objective: Make the cart item-count badge and sidebar ‘My Buying’ indicators reflect backend totals.

* **2-B-1** Expose `/api/cart` total endpoint or reuse GET to compute count.
* **2-B-2** Attach an event-source (or polling) to keep the badge in sync when cart updates elsewhere (other tab).
* **2-B-3** Update Tailwind classes for dynamic badge visibility.

### Mandatory Pause for Testing

* Automated: Playwright test “Badge Updates on Add/Remove”.
* User test: Verify badge animates and zero-state hides correctly.

---

## Stub C: Error & Edge-Case Handling

Objective: Gracefully handle 404 (product removed), 409 (stock), and network errors.

* **2-C-1** Map HTTP status codes to human-readable toast messages.
* **2-C-2** Disable “Checkout” button when cart is empty or backend returns error.
* **2-C-3** Add resend logic for transient network failure (exponential backoff, max 3 attempts).

### Mandatory Pause for Testing

* Automated: Inject 404/409 via msw/mock and assert toast appears.
* User test: Disconnect network, add item, reconnect, ensure resend works.

---

Progress is tracked by checking off the serialized tasks above. Only after all pauses are approved do we proceed to Phase 3. 