//! A serializable representation of a wallet, suitable for sending over the network.

use autonomi::Wallet;
use serde::Serialize;

/// A wallet representation that can be safely serialized and sent to clients.
///
/// It extracts only the necessary, non-sensitive information from the core `Wallet` type.
#[derive(Serialize, Debug, Clone)]
pub struct SerializableWallet {
    /// The public address of the wallet.
    pub address: String,
}

impl From<&Wallet> for SerializableWallet {
    fn from(wallet: &Wallet) -> Self {
        Self {
            address: wallet.address().to_string(),
        }
    }
} 