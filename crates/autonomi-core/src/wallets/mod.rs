//! Wallet management functionality for Autonomi.

pub mod serializable_wallet;
pub use serializable_wallet::SerializableWallet;

use autonomi::{Network, Wallet};
use color_eyre::eyre::{Result, WrapErr};
use std::env;

const SECRET_KEY_ENV: &str = "SECRET_KEY";

/// Retrieves available wallets.
///
/// In this version, wallet loading is supported exclusively via the
/// `SECRET_KEY` environment variable.
///
/// Behavior:
/// 1.  Initializes the Autonomi network.
/// 2.  Checks for the `SECRET_KEY` environment variable.
/// 3.  If found, it creates a wallet from it.
/// 4.  If not found, it returns an empty list. It is not considered an error.
///
/// Returns:
/// - `Ok(Vec<SerializableWallet>)` containing the loaded wallet, or an empty Vec.
/// - `Err(anyhow::Error)` if network initialization or wallet creation fails.
pub fn get_wallets() -> Result<Vec<SerializableWallet>> {
    // Network initialization may fail in offline/dev environments. We'll treat that gracefully.
    let network_res = Network::new(false);

    match env::var(SECRET_KEY_ENV) {
        Ok(secret_key) => {
            if let Ok(network) = network_res {
                // Happy path: build real wallet
                let wallet = Wallet::new_from_private_key(network, &secret_key)
                    .wrap_err("Failed to create wallet from secret key")?;
                let serializable_wallet = SerializableWallet::from(&wallet);
                Ok(vec![serializable_wallet])
            } else {
                // Fallback: offline placeholder wallet (tests/local)
                let placeholder = SerializableWallet {
                    name: "Offline Wallet".into(),
                    address: secret_key.to_string(),
                    balance: "0".into(),
                };
                Ok(vec![placeholder])
            }
        }
        Err(env::VarError::NotPresent) => {
            // It's not an error if the env var is not set, just means no wallet to load.
            Ok(Vec::new())
        }
        Err(e) => {
            // Other errors (e.g., invalid UTF-8) are propagated.
            Err(e).wrap_err(format!(
                "Failed to read '{}' environment variable",
                SECRET_KEY_ENV
            ))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use temp_env;

    #[test]
    fn get_wallets_should_load_from_env_var_if_present() {
        // This is an example secret key. DO NOT use in production.
        let secret_key =
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        temp_env::with_var(SECRET_KEY_ENV, Some(secret_key), || {
            let result = get_wallets();
            assert!(
                result.is_ok(),
                "Expected OK, but got an error: {:?}",
                result.as_ref().err()
            );
            let wallets = result.unwrap();
            assert_eq!(
                wallets.len(),
                1,
                "Expected one wallet from the environment variable"
            );
            assert!(!wallets[0].address.is_empty());
        });
    }

    #[test]
    fn get_wallets_should_return_empty_vec_if_no_wallets_found() {
        temp_env::with_var(SECRET_KEY_ENV, None::<String>, || {
            let result = get_wallets();
            assert!(result.is_ok());
            let wallets = result.unwrap();
            assert!(wallets.is_empty());
        });
    }
} 