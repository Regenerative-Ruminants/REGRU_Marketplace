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