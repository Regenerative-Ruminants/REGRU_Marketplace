# Phase 1: Backend Quote Response (`/api/checkout`)

Goal: Deliver a deterministic quote API that returns the exact data needed for the wallet transaction while persisting a new *AwaitingPayment* order in memory.

---

## Stub A: API Contract & Data Models

* **1-A-1** Define `QuoteResponse` TS/Rust schemas `{orderId,to,data,priceWei,chainId}`.
* **1-A-2** Add `OrderStatus::AwaitingPayment` variant and integrate with `Order` struct.
* **1-A-3** Generate UUID v4 for each order ID.
* **1-A-4** Persist order in `AppState.orders` with initial status.

### Mandatory Pause for Testing

Automated: Rust unit test asserts JSON shape & status = AwaitingPayment.  
User test: `curl -X POST /api/checkout` returns well-formed JSON, fields non-empty.

---

## Stub B: Pricing Logic & Pointer Read

* **1-B-1** Fetch latest catalogue pointer from config.
* **1-B-2** Calculate `priceWei` for cart items (server-side to avoid tampering).
* **1-B-3** Return constant `to` (receiver address) & optional `data` (0x for plain transfer).
* **1-B-4** Unit test with sample cart = 2 items, verifies sum.

### Mandatory Pause for Testing

Automated: Integration test hits `/api/checkout` with mock cart, validates sum matches fixtures.
User test: Hit endpoint via Postman; check price math against catalogue prices.

---

## Stub C: Error Handling & Validation

* **1-C-1** Return HTTP 400 if cart empty.
* **1-C-2** Return HTTP 422 if product IDs unknown.
* **1-C-3** Map internal errors to 5xx with `actix_web::error::ErrorInternalServerError`.

### Mandatory Pause for Testing

Automated: Unit tests cover 400 & 422 branches.  
User test: Submit invalid product ID; expect toast with error message.

---

## Stub D: Documentation & Environment Config

* **1-D-1** Update `docs/frontend_backend_communication.md` with new JSON contract.
* **1-D-2** Add `PAYMENT_RECEIVER` & `CHAIN_ID` keys to `.env_template.txt`.
* **1-D-3** Commit OpenAPI snippet for `/api/checkout`.

### Mandatory Pause for Testing

Automated: `cargo doc` passes; `rustdoc-json` extract matches schema.  
User test: Review rendered docs in browser, confirm examples compile.

---

Advance to Phase 2 only after all tasks 1-A-1 … 1-D-3 are complete **and** all tests above are green. 