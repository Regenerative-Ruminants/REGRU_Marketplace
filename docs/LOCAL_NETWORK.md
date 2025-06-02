# Running a Local Autonomi Network

This guide explains how to set up and run a single-node Autonomi network locally for development and testing purposes.

## Prerequisites

- Autonomi CLI installed (ensure `autonomi` command is in your PATH).
  See [Autonomi documentation](https://autonomi.com/docs) for installation instructions.

## 1. Starting the Local Network

To start a local Autonomi network, use the `autonomi local-network` command. It's recommended to run this from a dedicated script for consistency.

Create a script, for example, `scripts/start-local-autonomi.sh`:

```bash
#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting local Autonomi network..."

# Define a data directory for the local network
# This can be relative to your project or an absolute path
AUTONOMI_DATA_DIR="./.autonomi_local_data"
mkdir -p "$AUTONOMI_DATA_DIR"

# Start the local network. Adjust parameters as needed.
# --data-dir: Specifies where network data (chunks, state) is stored.
# --http-port: Port for the HTTP RPC interface (default: 8545 for mainnet, often different for local).
# --ws-port: Port for the WebSocket RPC interface.
# --faucet-key: A pre-funded key for the faucet (optional, useful for auto-minting).
# --mine: Enables mining on this node (necessary for a single-node network to process transactions).
autonomi local-network \
    --data-dir "$AUTONOMI_DATA_DIR" \
    --http-port 8645 \
    --ws-port 8646 \
    --mine \
    # --faucet-key <your_predefined_faucet_private_key_hex> # Optional

echo "Local Autonomi network started."
echo "HTTP RPC: http://localhost:8645"
echo "WS RPC: ws://localhost:8646"
echo "Data directory: $AUTONOMI_DATA_DIR"

# You might want to add a way to keep this script running or tail logs, e.g.:
# tail -f "$AUTONOMI_DATA_DIR/logs/node.log" 
# Or simply let it run in the foreground and Ctrl+C to stop.
```

**To run this script:**
```bash
chmod +x scripts/start-local-autonomi.sh
./scripts/start-local-autonomi.sh
```

## 2. Local Faucet (Auto-Minting)

The `autonomi local-network` command often has built-in faucet capabilities, especially if you provide a `--faucet-key` or if it defaults to a known development key. This means new accounts can be automatically funded with test ANT for development.

If you need a separate faucet script:

This typically involves using `autonomi wallet send` or interacting with a faucet contract if your local setup includes one.

Example `scripts/fund-account.sh` (requires a funded faucet account):
```bash
#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/fund-account.sh <recipient_address> [amount]"
  exit 1
fi

RECIPIENT_ADDRESS=$1
AMOUNT=${2:-1000} # Default to 1000 ANT

# Ensure your FAUCET_KEY_PATH points to a file with the private key of a funded account
# or that your `autonomi wallet send` is configured to use such a wallet by default.
FAUCET_WALLET_NAME="local_faucet"

echo "Funding account $RECIPIENT_ADDRESS with $AMOUNT ANT..."

# This command syntax might vary based on your Autonomi CLI version and wallet setup.
# You might need to specify --network http://localhost:8645
autonomi wallet send \
    --from-wallet "$FAUCET_WALLET_NAME" \
    --to "$RECIPIENT_ADDRESS" \
    --amount "$AMOUNT" \
    --network http://localhost:8645 # Assuming your local network RPC is here

echo "Funding request sent."
```

## 3. Tearing Down the Local Network

- To stop the local network, simply stop the `autonomi local-network` process (usually `Ctrl+C` in the terminal where it's running).
- To perform a clean teardown and remove all local network data (useful for resetting state):

Create `scripts/stop-local-autonomi.sh`:
```bash
#!/bin/bash
set -e

AUTONOMI_DATA_DIR="./.autonomi_local_data"

echo "Stopping local Autonomi network..."
# Attempt to gracefully stop if a PID file was created or using a kill command.
# This is highly dependent on how `autonomi local-network` runs.
# For simplicity, we often rely on Ctrl+C for foreground processes.

if [ -d "$AUTONOMI_DATA_DIR" ]; then
  echo "Removing local Autonomi network data from $AUTONOMI_DATA_DIR..."
  rm -rf "$AUTONOMI_DATA_DIR"
  echo "Local network data removed."
else
  echo "No local network data directory found at $AUTONOMI_DATA_DIR."
fi

echo "Local Autonomi network teardown complete."
```

**To run this script:**
```bash
chmod +x scripts/stop-local-autonomi.sh
./scripts/stop-local-autonomi.sh
```

## Important Considerations

- **Ports:** Ensure the HTTP and WS ports (e.g., 8645, 8646) do not conflict with other services running on your machine.
- **Data Persistence:** Data stored in the `--data-dir` will persist across restarts of the local network unless you explicitly delete it (e.g., using the teardown script).
- **Genesis/Chain ID:** Local networks usually have a distinct chain ID and genesis block. Ensure your application is configured to connect to this specific network.
- **Autonomi Version:** Ensure your Autonomi CLI version is compatible with the features you intend to use.

Refer to the official Autonomi documentation for the most up-to-date commands and options for `autonomi local-network`. 