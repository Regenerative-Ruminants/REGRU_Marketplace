//! A serializable representation of a wallet, suitable for sending over the network.

use autonomi::Wallet;
use serde::{Serialize, Deserialize};

/// A wallet representation that can be safely serialized and sent to clients.
///
/// It extracts only the necessary, non-sensitive information from the core `Wallet` type.
#[derive(Debug, Serialize, Deserialize)]
pub struct SerializableWallet {
    pub name: String,
    /// The public address of the wallet.
    pub address: String,
    pub balance: String,
}

impl From<&Wallet> for SerializableWallet {
    fn from(wallet: &Wallet) -> Self {
        let address = wallet.address();
        Self {
            name: "My Test Wallet".to_string(), // Placeholder
            address: format!("{address:?}"),
            balance: "0.123 ETH".to_string(),   // Placeholder
        }
    }
} 