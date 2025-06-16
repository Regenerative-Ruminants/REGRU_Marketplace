pub mod models;

use super::wallets::models::{AvailableWallets, Wallet};
use crate::autonomi::access::wallets::{get_wallets, load_wallet_from_env};
use crate::state::AppState;
use color_eyre::Result;
use futures::future::join_all;
use std::sync::Mutex;
use tauri::State;

/// Get a list of wallets stored on the device
/// If `SECRET_KEY` exists in the ENV, then only that wallet is returned.
#[tauri::command(rename_all = "snake_case")]
pub async fn get_available_wallets(
    state: State<'_, Mutex<AppState>>,
) -> Result<AvailableWallets, String> {
    let network = &state.lock().unwrap().to_network();
    // First try loading a wallet from ENV
    if let Ok(wallet) = load_wallet_from_env(network) {
        return Ok(AvailableWallets {
            wallets: vec![Wallet::from_evm_wallet(&wallet).await],
        });
    }

    let wallets = join_all(
        get_wallets(network)
            .expect("Failed to load wallets")
            .iter()
            .map(Wallet::from_evm_wallet)
            .collect::<Vec<_>>(),
    )
    .await;

    Ok(AvailableWallets { wallets })
}
