# Autonomi Checkout Demo Plan

This directory contains the **demo-focused, serialized task plan** for delivering a working Autonomi-powered checkout flow on the REGRU marketplace in time for the live demo.

## File naming

`phase_demo_<N>_<slug>.md` where **N** is the phase number (1–6) and *slug* is a short description.

## Numbering scheme

Each phase is broken into **stubs** labelled **A, B, C …**.  Within a stub, every actionable item is a *serialized task* numbered sequentially:

```
<N>-<Stub>-<##>
```

*Example:* `3-B-7` → *Phase 3*, stub **B**, task **7**.

## Testing cadence

Every stub ends with a **Mandatory Pause for Testing** section that spells out both automated checks (integration / Playwright) and the **manual user validation** the product owner must perform before we advance.

## Phases

1. Backend quote response (`/api/checkout`)
2. Frontend wallet flow
3. Checkout confirm endpoint (`/api/checkout/confirm`)
4. Confirmation watcher & pointer update
5. End-to-end test suite
6. Build & deploy pipeline tweaks

---

> All tasks in these files are treated as production-critical.  No code proceeds to `main` until its associated checklist items are ✅ completed and tests pass. 