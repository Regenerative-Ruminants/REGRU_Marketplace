# Frontend-Backend Communication

This document outlines the communication flow between the frontend (Vite/TypeScript) and the backend (Actix/Rust) for the Regenerative Marketplace application.

## System Architecture Overview

The application follows a standard client-server model:

-   **Frontend (Client):** A single-page application built with TypeScript and the Vite development server. It is responsible for rendering the user interface and making API calls to the backend. It runs on `http://localhost:1420`.
-   **Backend (Server):** A Rust-based API built with the Actix web framework. It handles business logic, interacts with the blockchain network (via `autonomi-core`), and serves data to the frontend. It runs on `http://localhost:8000`.

To handle cross-origin requests during development, the Vite server is configured to proxy any requests to `/api/*` to the backend server.

## Data Flow: Displaying Wallets

The primary example of frontend-backend communication is the wallet display feature. Here is a step-by-step breakdown of how data flows from a local configuration file to the end user's screen.

### 1. Backend Configuration

The backend requires a `SECRET_KEY` and an `EVM_NETWORK` to function. This is configured in a `.env` file located in the `src-backend` directory:

```
# src-backend/.env

SECRET_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
EVM_NETWORK=arbitrum-sepolia-test
```

When the backend server starts, the `dotenv` crate loads these variables into the environment.

### 2. API Request from Frontend

When the user opens the wallet modal in the UI, the frontend executes the following TypeScript code:

```typescript
// src/app.ts

const response = await fetch('/api/wallets');
const wallets = await response.json();
```

The `fetch` call sends a `GET` request to `/api/wallets`. The Vite proxy forwards this to `http://localhost:8000/api/wallets`.

### 3. Backend Processing

The backend's Actix router directs the request to a handler function that performs the following actions:

1.  **Reads the `SECRET_KEY`** from the environment.
2.  Uses the `autonomi-core` library to **cryptographically derive the public wallet address** from the secret key.
3.  Constructs a `SerializableWallet` object containing the address, along with placeholder data for the name and balance.
4.  **Serializes this object into a JSON response** and sends it back to the frontend.

### 4. UI Rendering

The frontend receives the JSON payload, which looks like this:

```json
[
    {
        "name": "My Test Wallet",
        "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "balance": "0.123 ETH"
    }
]
```

It then dynamically generates HTML to display this information in the wallet modal, resulting in the final view that the user sees.

## Visual Data Flow Diagram

*(Please insert the screenshot of the diagram here)*

--- 