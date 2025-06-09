use crate::autonomi::access::wallets::get_wallets;
use crate::commands::models::{AvailableWallets, Wallet};
use color_eyre::Result;
use futures::future::join_all;

#[tauri::command(rename_all = "snake_case")]
pub async fn get_available_wallets() -> Result<AvailableWallets, String> {
    let ant_wallets = get_wallets().expect("Failed to load wallets");

    let wallet_futures: Vec<_> = ant_wallets
        .iter()
        .map(|wallet| async move {
            let (token_balance, gas_token_balance) =
                tokio::join!(wallet.balance_of_tokens(), wallet.balance_of_gas_tokens(),);
            Wallet {
                address: wallet.address().to_string(),
                token_balance: token_balance.unwrap(),
                gas_token_balance: gas_token_balance.unwrap(),
            }
        })
        .collect();

    let wallets = join_all(wallet_futures).await;

    Ok(AvailableWallets { wallets })
}
