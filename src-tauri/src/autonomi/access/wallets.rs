use crate::autonomi::access::fs::{get_wallet_file_names, load_wallet_private_key};
use ::autonomi::Network;
use ::autonomi::Wallet;
use color_eyre::eyre::{eyre, Context, Result};
use std::env;

const SECRET_KEY_ENV: &str = "SECRET_KEY";

pub fn get_wallets() -> Result<Vec<Wallet>> {
    let file_names = get_wallet_file_names().expect("Failed to get wallet file names");

    let wallets = file_names
        .iter()
        .map(|name| load_wallet_private_key(name).unwrap())
        .map(|key| {
            Wallet::new_from_private_key(Network::new(true).expect("Failed to load network"), &key)
                .unwrap()
        })
        .collect();

    Ok(wallets)
}

/// EVM wallet
pub fn load_wallet_from_env(network: &Network) -> Result<Wallet> {
    let secret_key =
        get_secret_key_from_env().wrap_err("The secret key is required to perform this action")?;
    let wallet = Wallet::new_from_private_key(network.clone(), &secret_key)
        .wrap_err("Failed to load EVM wallet from key")?;
    Ok(wallet)
}

/// EVM wallet private key
pub fn get_secret_key_from_env() -> Result<String> {
    env::var(SECRET_KEY_ENV).wrap_err(eyre!(
        "make sure you've provided the {SECRET_KEY_ENV} env var"
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    use temp_env;

    #[test]
    fn test_create_wallet_from_env_success() {
        // Arrange: Set a valid environment variable
        temp_env::with_var(
            SECRET_KEY_ENV,
            Some("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"),
            || {
                let network = Network::ArbitrumSepoliaTest;

                // Act
                let result = load_wallet_from_env(&network);

                // Assert
                assert!(result.is_ok());
                assert!(matches!(result, Ok(Wallet { .. })));
            },
        );
    }

    #[test]
    fn test_get_secret_key_from_env_success() {
        // Arrange: Set the environment variable
        temp_env::with_var(SECRET_KEY_ENV, Some("test_secret_key"), || {
            // Act
            let result = get_secret_key_from_env();

            // Assert
            assert!(result.is_ok());
            assert_eq!(result.unwrap(), "test_secret_key");
        });
    }

    #[test]
    fn test_get_secret_key_from_env_missing() {
        // Arrange: Ensure the environment variable is unset
        temp_env::with_var_unset(SECRET_KEY_ENV, || {
            // Act
            let result = get_secret_key_from_env();

            // Assert
            assert!(result.is_err());
            let error = result.unwrap_err();
            assert_eq!(
                error.to_string(),
                format!("make sure you've provided the {} env var", SECRET_KEY_ENV)
            );
        });
    }
}
