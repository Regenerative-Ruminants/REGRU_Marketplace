# Phase 3: Frontend Checkout & Transaction Flow

With backend checkout endpoint live and cart API wired, we build end-to-end payment flow in the UI.

---

## Stub A: Checkout UI & Form Flow

* **3-A-1** Add “Checkout” CTA in cart panel; disable when cart empty.
* **3-A-2** Display order summary modal (items, total ANT, selected wallet address).
* **3-A-3** Hook modal “Confirm” → POST `/api/checkout` with `{wallet, items}`.
* **3-A-4** Show progress indicator (pending, tx hash link to explorer).

### Mandatory Pause for Testing

* Automated: Playwright script loads cart, clicks Checkout, mocks 200 response, asserts success screen.
* User test: Perform checkout on staging, copy tx hash, confirm in explorer.

---

## Stub B: Wallet Connect Enforcement

* **3-B-1** Reuse `walletService` state; block checkout if no active wallet.
* **3-B-2** Provide in-modal link/button to open wallet modal.
* **3-B-3** Listen for `walletService.onConnect` event to auto-populate address field.

### Mandatory Pause for Testing

* Automated: Simulate wallet disconnect midway, expect UI error.
* User: Disconnect wallet, attempt checkout → app must prompt to connect.

---

## Stub C: Transaction Error Handling & Receipt

* **3-C-1** Map backend error codes (e.g., `insufficient_funds`, `price_changed`) to toast & modal states.
* **3-C-2** On success, store receipt in `localStorage` and navigate to “My Purchases”.
* **3-C-3** Render receipt details (tx hash, block number, items).

### Mandatory Pause for Testing

* Automated: Mock error codes, assert UI path.
* User: Complete real micro-purchase of test product, verify receipt stored & viewable.

---

## Stub D: UX Polish

* **3-D-1** Ensure responsive modal, focus-trap, ESC closes.
* **3-D-2** Add loading skeletons for cart & receipt views.
* **3-D-3** A11y: ARIA roles, keyboard nav for modal buttons.

### Mandatory Pause for Testing

* Automated: run `npm run test:a11y` (axe) ensure <10 critical issues.
* User: Keyboard-only checkout flow.

---

Advance to Phase 4 only when all serialized tasks above are complete and testing pauses signed off. 