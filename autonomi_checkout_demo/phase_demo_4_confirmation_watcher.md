# Phase 4: Confirmation Watcher & Pointer Update

Goal: Replace stub watcher with real receipt polling, update catalogue pointer on success, and push SSE to frontend.

---

## Stub A: ethers-rs RPC Integration

* **4-A-1** Add `ethers = {version = "^2", features=["rustls"]}` to `Cargo.toml`.
* **4-A-2** In watcher, create `Provider<Http>::new(rpc_url)` with timeout.
* **4-A-3** Poll `eth_getTransactionReceipt(txHash)` every 3 s until `receipt.status == 1`.
* **4-A-4** Persist blockNumber + gasUsed into `Order`.

### Mandatory Pause for Testing

Automated: Mock provider returns success on 3rd poll; integration test asserts status transition.
User: Real tx on Piccadilly confirms; order flips within ~5 s.

---

## Stub B: Pointer Update & Inventory Sync

* **4-B-1** On confirmation, run `antctl pointer put` with updated stock JSON.
* **4-B-2** Capture new pointer hash; write to `AppState.current_catalogue_pointer`.
* **4-B-3** Handle `antctl` errors with back-off; max 3 retries.

### Mandatory Pause for Testing

Automated: Integration test mocks `antctl` binary; asserts exit 0 & pointer captured.
User: Verify new pointer resolves via gateway.

---

## Stub C: SSE Broadcast & Frontend Listener

* **4-C-1** Add `/api/events` SSE endpoint if not present.
* **4-C-2** Emit `orderConfirmed` with `{orderId,pointer}` payload.
* **4-C-3** Frontend listens, refreshes stock & shows receipt screen.

### Mandatory Pause for Testing

Automated: Playwright waits for SSE, checks UI receipt render.
User: Complete purchase, see UI auto-update without refresh.

---

## Stub D: Resilience & Observability

* **4-D-1** Add structured logs (`tracing`) around RPC & pointer calls.
* **4-D-2** Push Prometheus gauge `checkout_confirm_pending` (optional).
* **4-D-3** Graceful shutdown: cancel watcher tasks on SIGTERM.

### Mandatory Pause for Testing

Automated: Kill server mid-poll; verify no zombie tasks via log.
User: Observe metrics endpoint; gauge drops after confirm.

---

Advance to Phase 5 after tasks 4-A-1 … 4-D-3 are ✅ and tests green. 