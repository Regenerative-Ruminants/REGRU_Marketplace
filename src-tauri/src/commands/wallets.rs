use alloy_primitives::U256;
use color_eyre::Result;
use crate::commands::models::{AvailableWallets, Wallet};

#[tauri::command]
pub async fn get_available_wallets() -> Result<AvailableWallets, String> {
    Ok(AvailableWallets {
        wallets: vec![Wallet {
            address: String::from("0x348561F82cA27B420FFe1d4CBF889B0bE3e94780"),
            token_balance:   U256::from(10).pow(U256::from(18)),
            gas_token_balance:  U256::from(10).pow(U256::from(18)),
            encrypted: false,
        }]
    })
}
