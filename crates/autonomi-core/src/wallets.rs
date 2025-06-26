use anyhow::Context;
use autonomi::{Network, Wallet};
use std::env;

const SECRET_KEY_ENV: &str = "SECRET_KEY";

/// Gets a list of available wallets.
///
/// This function is the core logic for wallet retrieval. Currently, it supports
/// loading a single wallet from a `SECRET_KEY` environment variable.
///
/// Behavior:
/// - Initializes the Autonomi network.
/// - Checks for the `SECRET_KEY` environment variable.
/// - If the variable is present, it attempts to create a wallet from it.
/// - If the variable is not present, it returns an empty list.
///
/// Returns:
/// - `Ok(Vec<Wallet>)` containing the loaded wallet, or an empty Vec if none is found.
/// - `Err(anyhow::Error)` if network initialization or wallet creation fails.
pub fn get_wallets() -> anyhow::Result<Vec<Wallet>> {
    let network = Network::new(false)?;

    match env::var(SECRET_KEY_ENV) {
        Ok(secret_key) => {
            let wallet = Wallet::new_from_private_key(network, &secret_key)
                .with_context(|| "Failed to create wallet from secret key")?;
            Ok(vec![wallet])
        }
        Err(env::VarError::NotPresent) => {
            // It's not an error if the env var is not set, just means no wallet to load.
            Ok(Vec::new())
        }
        Err(e) => {
            // Other errors (e.g., invalid UTF-8) are propagated.
            Err(e).with_context(|| format!("Failed to read '{}' environment variable", SECRET_KEY_ENV))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use temp_env;

    #[test]
    fn test_get_wallets_with_env_var() {
        temp_env::with_var(
            SECRET_KEY_ENV,
            Some("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"),
            || {
                let result = get_wallets();
                assert!(result.is_ok(), "Expected OK, but got an error: {:?}", result.as_ref().err());
                let wallets = result.unwrap();
                assert_eq!(wallets.len(), 1, "Expected one wallet when env var is set");
            },
        );
    }

    #[test]
    fn test_get_wallets_without_env_var() {
        temp_env::with_var(SECRET_KEY_ENV, None::<&str>, || {
            let wallets = get_wallets().unwrap();
            assert!(wallets.is_empty(), "Expected no wallets when env var is not set");
        });
    }

    #[test]
    fn test_get_wallets_with_invalid_env_var() {
        temp_env::with_var(SECRET_KEY_ENV, Some("invalid-key"), || {
            let result = get_wallets();
            assert!(result.is_err(), "Expected an error for an invalid secret key");
        });
    }
} 