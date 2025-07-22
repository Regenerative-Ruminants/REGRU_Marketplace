# REGRU CLI – Operator Guide

This document explains how to build and use the internal‐only CLI that uploads product catalogues to Autonomi storage.

## 1. Building the binary

### Prerequisites
• Rust ≥ 1.78 installed (https://rustup.rs).  
• Windows build: no extra toolchain.  
• Linux build: GCC or clang toolchain.

### One-liner
```powershell
# From project root
scripts\build-cli.ps1   # Windows
```
```bash
# From project root
./scripts/build-cli.sh   # macOS / Linux
```
The script compiles a **release** binary and copies it to `bin/` (ignored by git).

## 2. Local dev-net workflow
```powershell
# Start local devnet (for example using docker-compose)
# export the funded genesis key
$Env:SECRET_KEY = "0xac0974bec39a17e36..."

# Upload the sample products file
bin\regru.exe --local import products --json cli\input\products.json
```
The CLI prints a products pointer address.  Put that address in `.env.dev` as `PRODUCTS_POINTER_ADDRESS` and restart the backend.

## 3. Staging / Production publish steps
1. Ensure you have the correct wallet key in your shell or CI secret store.  
2. Run the import command **without** `--local`.  
3. Copy the printed products pointer into the corresponding deployment environment variable (`PRODUCTS_POINTER_ADDRESS`).

## 4. Safety considerations
• The CLI never stores or transmits the private key server-side.  
• Binaries live in `bin/` which is not served by the web application and is ignored by git.  
• Operators run the CLI manually or via CI jobs that use environment secrets – not from within the web server process.

For full operator runbooks see the `cli_integration_plan/` phase files. 

## Windows build-tools troubleshooting
On some Windows machines the C compiler in older Visual Studio Build Tools crashes while compiling the `ring` crate (fatal error C1001 in `curve25519.c`).  If your `scripts\build-cli.ps1` run fails with that message:

1. Open **Visual Studio Installer** → *Modify* your Build Tools installation.  
2. Ensure **Desktop development with C++** and the latest **Windows 10/11 SDK** are selected, then *Update*.  
3. Open a fresh *Developer PowerShell for VS 2022* and rerun
   ```powershell
   scripts\build-cli.ps1
   ```

The build should now succeed and place `bin\regru.exe` in the project root. 