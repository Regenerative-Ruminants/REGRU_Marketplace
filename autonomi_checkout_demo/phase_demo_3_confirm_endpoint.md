# Phase 3: Confirm Endpoint & Order Lifecycle

Goal: Accept the wallet `txHash`, move order to *PendingConfirm*, and spawn the confirmation watcher.

---

## Stub A: Endpoint Definition

* **3-A-1** Implement `POST /api/checkout/confirm` → accepts `{orderId,txHash}`.
* **3-A-2** Validate `orderId` exists & status = AwaitingPayment.
* **3-A-3** Store `txHash`, flip status to *PendingConfirm*.
* **3-A-4** Return 202 Accepted with `{status:"pending"}`.

### Mandatory Pause for Testing

Automated: Integration test posts valid data → expect 202 & map update.  
User: Post via curl; response matches.

---

## Stub B: Validation & Error Codes

* **3-B-1** Return 404 if order missing.
* **3-B-2** Return 409 if status ≠ AwaitingPayment (duplicate confirm).
* **3-B-3** Return 422 if `txHash` invalid hex.

### Mandatory Pause for Testing

Automated: Unit tests cover 404/409/422.  
User: Try duplicate confirm, expect toast error.

---

## Stub C: Watcher Task (Stub Implementation)

* **3-C-1** Spawn Tokio task per order with 3×8 s loop (current stub).
* **3-C-2** Simulate success → set status to *Confirmed*.
* **3-C-3** Log transition for observability.

### Mandatory Pause for Testing

Automated: Integration test waits 25 s, asserts status = Confirmed.  
User: Observe logs in backend terminal → see transition.

---

## Stub D: Documentation & SSE Contract

* **3-D-1** Document new endpoint in OpenAPI.
* **3-D-2** Draft SSE event format `orderConfirmed:{orderId}` (spec only – will wire in Phase 4).

### Mandatory Pause for Testing

Automated: `cargo check --all-features` passes.  
User: Review docs; approve SSE event name.

---

Advance to Phase 4 when tasks 3-A-1 … 3-D-2 are ✅ and tests pass. 