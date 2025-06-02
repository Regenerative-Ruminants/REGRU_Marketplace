# Autonomi Wallet Management

This document outlines how to generate, encrypt, and use Autonomi wallet keys for different environments (local, testnet, mainnet).

## 1. Generating Wallet Keys

Autonomi wallet keys can be generated using the `autonomi wallet create` command.

```bash
# Create a new wallet (key pair)
autonomi wallet create --name my_local_wallet
autonomi wallet create --name my_test_wallet
autonomi wallet create --name my_prod_wallet
```

This command will typically output:
- The wallet's public address.
- The private key (keep this extremely secure!).
- The path to the keystore file if it saves it (behavior might vary).

**Store the private key securely. Do not commit it directly to your repository.**

For this project, we expect key files to be stored (encrypted) in the `wallets/` directory (which is git-ignored):
- `wallets/local.key`
- `wallets/test.key`
- `wallets/prod.key`

These files should contain the **raw private key string**. 

## 2. Encrypting Keys with `age`

To securely manage these private key files, especially for CI/CD or shared environments, we use `age` encryption.

**`age`** is a simple, modern, and secure file encryption tool. You can find installation instructions at [age-encryption.org](https://age-encryption.org/).

### a. Generate an `age` key pair:

This key pair will be used to encrypt and decrypt your wallet files. The private key part of *this* `age` key is what you'll use in CI (e.g., as `TAURI_PRIVATE_KEY_B64`).

```bash
age-keygen -o age_key.txt
```
This will create `age_key.txt` containing both the public and private `age` keys.
- The public key starts with `age1...`.
- The private key starts with `AGE-SECRET-KEY-1...`.

**Securely store `age_key.txt` (especially the private key part). This is your master key for decrypting wallets.**

### b. Encrypt a wallet key file:

Let's say your raw Autonomi private key is in `wallets/local.key`.

```bash
# Get your age public key from age_key.txt
AGE_PUBLIC_KEY="$(grep -o 'age1[a-zA-Z0-9]*' age_key.txt)"

# Encrypt the wallet key
age -r "$AGE_PUBLIC_KEY" -o wallets/local.key.age wallets/local.key
```

Now you have `wallets/local.key.age`, which is the encrypted version. You can delete the unencrypted `wallets/local.key` after verifying encryption, or manage it carefully locally.

Repeat for `test.key` and `prod.key`.

## 3. Loading Keys in the Application (via Environment Variables)

In your Tauri application (Rust backend), and especially in CI environments, you will load the *decrypted* Autonomi private keys via environment variables. The `age`-encrypted files are primarily for storage and secure transfer.

### a. Decrypting in CI/Build Environment:

The CI environment needs the **`age` private key** (from `age_key.txt`) to decrypt the wallet files. This `age` private key is often provided as a CI secret (e.g., `TAURI_PRIVATE_KEY_B64` if it's base64 encoded).

Example decryption step in a CI script:

```bash
# Assume AGE_CI_SECRET_KEY holds the raw age private key string
# or TAURI_PRIVATE_KEY_B64 holds it base64 encoded

if [ -n "$TAURI_PRIVATE_KEY_B64" ]; then
  echo "$TAURI_PRIVATE_KEY_B64" | base64 -d > temp_age_key.txt
  AGE_CI_SECRET_KEY_FILE="temp_age_key.txt"
elif [ -n "$AGE_CI_SECRET_KEY" ]; then
  echo "$AGE_CI_SECRET_KEY" > temp_age_key.txt
  AGE_CI_SECRET_KEY_FILE="temp_age_key.txt"
else
  echo "Error: Age private key not found in environment variables."
  exit 1
fi

# Decrypt the wallet (e.g., local.key.age)
age -d -i "$AGE_CI_SECRET_KEY_FILE" wallets/local.key.age > decrypted_local_key.txt

# Now, the content of decrypted_local_key.txt is the raw Autonomi private key.
# This can be set as another environment variable for the application to use.
export AUTONOMI_LOCAL_WALLET_PK=$(cat decrypted_local_key.txt)

rm temp_age_key.txt decrypted_local_key.txt # Clean up
```

### b. Using the Private Key in Rust:

Your Rust application would then read `AUTONOMI_LOCAL_WALLET_PK` (or similar for test/prod) from the environment.

```rust
use std::env;
use autonomi::types::PrivateKey; // Example, actual type might differ

fn load_wallet_from_env(var_name: &str) -> Result<PrivateKey, String> {
    let pk_hex = env::var(var_name)
        .map_err(|e| format!("Failed to read env var {}: {}", var_name, e))?;
    // Assuming Autonomi crate provides a way to create a wallet/signer from a private key hex string
    PrivateKey::from_hex(&pk_hex) // This is a placeholder, adapt to autonomi crate specifics
        .map_err(|e| format!("Failed to parse private key from {}: {}", var_name, e))
}

fn main() {
    // ...
    match load_wallet_from_env("AUTONOMI_LOCAL_WALLET_PK") {
        Ok(wallet) => {
            println!("Local wallet loaded successfully.");
            // Use the wallet with Autonomi client
        }
        Err(e) => {
            eprintln!("Error loading local wallet: {}", e);
        }
    }
    // ...
}
```

## Environment-Specific Wallet Usage

Your application should select the correct wallet and network flag based on the current environment (e.g., build profile, environment variable):

- **Local Development:** 
  - Key: Loaded from `AUTONOMI_LOCAL_WALLET_PK` (derived from `wallets/local.key.age`).
  - Network Flag: None (defaults to localhost for Autonomi client).
- **Testnet:**
  - Key: Loaded from `AUTONOMI_TEST_WALLET_PK` (derived from `wallets/test.key.age`).
  - Network Flag: `--testnet` passed to Autonomi client/commands.
- **Production (Mainnet):**
  - Key: Loaded from `AUTONOMI_PROD_WALLET_PK` (derived from `wallets/prod.key.age`).
  - Network Flag: `--mainnet` (or default if client points to mainnet) passed to Autonomi client/commands.

Always handle private keys with extreme care. Ensure that unencrypted private keys are not logged or exposed unnecessarily. 