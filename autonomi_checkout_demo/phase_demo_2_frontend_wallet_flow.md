# Phase 2: Frontend Wallet Flow

Goal: Let users initiate a wallet transaction from the cart, sign & send it on Autonity Piccadilly, and notify the backend of the `txHash`.

---

## Stub A: Checkout CTA & Order-Summary Modal

* **2-A-1** Add "Checkout" button to cart panel; disabled if cart empty.
* **2-A-2** Create order-summary modal (items, total ATN, wallet address).
* **2-A-3** On modal open, call `/api/checkout` to obtain `{orderId,to,data,priceWei,chainId}`.
* **2-A-4** Display loading spinner while waiting for response.

### Mandatory Pause for Testing

Automated: Playwright opens cart, verifies button enabled only with items.  
User test: Verify modal data reflects latest cart & wallet address.

---

## Stub B: Wallet Network Guard & Connect Workflow

* **2-B-1** Detect if `walletService.networkId !== 1319`; prompt chain switch.
* **2-B-2** If wallet not connected, show link to open wallet modal.
* **2-B-3** Listen for `walletService.onConnect` → auto-populate address.

### Mandatory Pause for Testing

Automated: Simulate wrong chain → expect switch prompt.  
User: Disconnect wallet, click Checkout → prompted to connect.

---

## Stub C: Transaction Send & Backend Confirm

* **2-C-1** Build `tx = {to,data,value:priceWei,chainId}` and call `wallet.sendTransaction(tx)`.
* **2-C-2** On success, capture `txHash` and POST `/api/checkout/confirm` with `{orderId,txHash}`.
* **2-C-3** Show pending state with link to explorer.

### Mandatory Pause for Testing

Automated: Stub wallet provider returns fake `0xdead…`; Playwright asserts `/confirm` called.
User: Perform real small ATN transfer; backend responds 200.

---

## Stub D: Error Handling & UX Polish

* **2-D-1** Map backend 4xx/5xx codes to toasts (insufficient_funds, price_changed).
* **2-D-2** ESC closes modal, focus trap, ARIA attributes.
* **2-D-3** Responsive design for mobile Safari.

### Mandatory Pause for Testing

Automated: Axe accessibility scan < 10 critical issues.  
User: Keyboard-only checkout flow passes.

---

Advance to Phase 3 after tasks 2-A-1 … 2-D-3 are ✅ and tests pass. 