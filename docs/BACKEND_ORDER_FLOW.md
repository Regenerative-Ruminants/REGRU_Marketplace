# Backend Order & Delivery Flow

Updated **2025-07-23**

## New Environment Variables
| Var | Purpose |
|-----|---------|
| `ORDER_DB_PATH` | Path to SQLite file that stores `order_details` (default `./orders.db`). |
| `SENDGRID_API_KEY` | API key with Mail Send permission. If unset, emails are skipped and a warning is logged. |
| `SENDGRID_SENDER` | Verified sender email (e.g. `orders@yourdomain.com`). |

## Endpoint Summary
| Method | Path | Body | Response |
|--------|------|------|----------|
| `POST` | `/api/checkout` | `{ buyer_wallet, items[] }` | Quote JSON with `order_id`, price, etc. |
| `POST` | `/api/checkout/confirm` | `{ order_id, tx_hash }` | `pending_confirm` or `404` if unknown. |
| `POST` | `/api/order/{order_id}/details` | `{ email, name, address }` | `saved` (and email sent asynchronously). |
| `GET`  | `/api/order/{order_id}` | — | `{ order, details|null }` |

## Database Schema (`orders.db`)
```sql
CREATE TABLE order_details(
  order_id   TEXT PRIMARY KEY,
  email      TEXT NOT NULL,
  name       TEXT NOT NULL,
  address    TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```
The file is auto-created on server start if it doesn’t exist.

## Email Payload
A minimal plain-text message is sent via SendGrid REST API:
```
Subject: Your REGRU receipt
Body:   Thank you for your purchase! Your order id is <order_id>.
```
HTML template will be added in a later iteration.

## Front-end Expectations
1. After `/details` returns `saved`, front-end may fetch `/order/{id}` to render a receipt page.
2. Delivery-info modal should POST to `/order/{id}/details` exactly once; subsequent calls overwrite the record. 