#!/usr/bin/env bash
set -euo pipefail

# Build the REGRU CLI release binary and stage it under bin/
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT_DIR/cli"

cargo build -p regru --release

mkdir -p "$ROOT_DIR/bin"
# Copy binary (Linux/macOS has no extension)
cp "target/release/regru"* "$ROOT_DIR/bin/" 2>/dev/null || true

echo "CLI binary staged in $ROOT_DIR/bin" 