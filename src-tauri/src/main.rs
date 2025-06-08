#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod autonomi;
mod commands;

use commands::wallets::get_available_wallets;

fn main() {
    autonomi::access::fs::get_client_data_dir_path()
        .expect("Failed to initialize client data directory; application cannot start.");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_available_wallets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
