use alloy_primitives::U256;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Wallet {
    pub address: String,
    pub token_balance: U256,
    pub gas_token_balance: U256,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AvailableWallets {
    pub wallets: Vec<Wallet>,
}
