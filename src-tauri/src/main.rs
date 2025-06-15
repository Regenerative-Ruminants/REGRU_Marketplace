#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod autonomi;
mod state;
mod commands;

use std::sync::Mutex;
use tauri::Manager;
use commands::wallets::get_available_wallets;
use state::set_network;
use crate::state::{load_state, AppState};

fn main() {
    autonomi::access::fs::get_client_data_dir_path()
        .expect("Failed to initialize client data directory; application cannot start.");

    tauri::Builder::default()
        .manage(Mutex::new(AppState { network: Default::default() }))
        .setup(|app| {
            // Load state from file on startup
            let state = load_state(&app.config()).unwrap();
            app.manage(Mutex::new(state)); // Initialize managed state
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_available_wallets, set_network])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
