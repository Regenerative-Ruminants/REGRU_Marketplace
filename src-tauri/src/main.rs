#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod autonomi;
mod commands;
mod state;

use crate::state::{get_state_file_path, load_state};
use commands::products::get_product;
use commands::state::{get_app_state, set_network, set_wallet};
use commands::wallets::get_available_wallets;
use std::sync::Mutex;
use tauri::Manager;

fn main() {
    autonomi::access::fs::get_client_data_dir_path()
        .expect("Failed to initialize client data directory; application cannot start.");

    tauri::Builder::default()
        .setup(|app| {
            // Load state from file on startup
            let path = get_state_file_path(&app.config());
            let state = load_state(&path).unwrap();
            app.manage(Mutex::new(state)); // Initialize managed state
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_available_wallets,
            set_network,
            set_wallet,
            get_app_state,
            get_product
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
