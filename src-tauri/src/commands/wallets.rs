use autonomi_core::wallets as core_wallets;
use serde::Serialize;

/// A serializable representation of a wallet, suitable for sending to the frontend.
#[derive(Serialize, Debug, Clone)]
pub struct SerializableWallet {
    /// The wallet address, typically as a hexadecimal string.
    address: String,
    // Add other fields here if needed from autonomi::Wallet that should be exposed to frontend
}

/// Tauri command to get a list of available wallets.
///
/// Behavior:
/// - Delegates to `autonomi_core::wallets::get_wallets()` for the core logic.
///
/// Returns:
/// - `Ok(Vec<SerializableWallet>)` on success, containing a list of wallets (or an empty list).
/// - `Err(String)` if an error occurs during wallet loading or network initialization.
#[tauri::command]
pub fn get_available_wallets() -> Result<Vec<SerializableWallet>, String> {
    core_wallets::get_wallets()
        .map_err(|e| format!("{:?}", e)) // Convert anyhow::Error to String
        .map(|wallets| { // Convert Vec<autonomi::Wallet> to Vec<SerializableWallet>
            wallets.into_iter().map(|wallet| {
                let address_str = wallet.address().to_string();
                SerializableWallet {
                    address: address_str,
                }
            }).collect()
        })
}

// Keeping tests to ensure the command layer still wires up correctly,
// but detailed logic tests are in autonomi-core.
#[cfg(test)]
mod tests {
    use super::*;
    use temp_env;

    const SECRET_KEY_ENV_FOR_TEST: &str = "SECRET_KEY";

    #[test]
    #[ignore = "requires a local Autonomi node and relies on core logic"]
    fn test_get_available_wallets_with_env_var_integration() {
        temp_env::with_var(
            SECRET_KEY_ENV_FOR_TEST,
            Some("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"),
            || {
                let result = get_available_wallets();
                assert!(result.is_ok(), "Expected OK, but got an error: {:?}", result.as_ref().err());
                let wallets = result.unwrap();
                assert_eq!(wallets.len(), 1, "Expected one wallet when env var is set");
                assert!(!wallets[0].address.is_empty(), "Wallet address should not be empty");
            },
        );
    }
} 