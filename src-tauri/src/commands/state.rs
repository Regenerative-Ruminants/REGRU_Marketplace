use crate::state::{get_state_file_path, save_state, AppState};
use std::sync::Mutex;
use tauri::{AppHandle, State};

/// Modify app state to set the current network
///
/// ``network`` should be one of ``mainnet``, ``testnet`` or ``local``
#[tauri::command(rename_all = "snake_case")]
pub async fn set_network(
    state: State<'_, Mutex<AppState>>,
    app_handle: AppHandle,
    network: String,
) -> Result<String, String> {
    let config = app_handle.config();

    let mut state = state.lock().unwrap();
    state.network = network;

    let path = get_state_file_path(&config);
    save_state(&state, &path)?;

    Ok(format!("Updated network to {}", state.network))
}

/// Modify app state to set the current network
#[tauri::command(rename_all = "snake_case")]
pub async fn set_wallet(
    state: State<'_, Mutex<AppState>>,
    app_handle: AppHandle,
    wallet: String,
) -> Result<String, String> {
    let config = app_handle.config();

    let mut state = state.lock().unwrap();
    state.wallet = Some(wallet.clone());

    let path = get_state_file_path(&config);
    save_state(&state, &path)?;

    Ok(format!("Updated wallet to {:?}", state.wallet))
}

/// Get app state
#[tauri::command(rename_all = "snake_case")]
pub async fn get_app_state(state: State<'_, Mutex<AppState>>) -> Result<AppState, String> {
    let state = state.lock().unwrap();

    let network = state.network.clone();
    let wallet = state.wallet.clone();

    Ok(AppState { network, wallet })
}
