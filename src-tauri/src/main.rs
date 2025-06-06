#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod autonomi;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    autonomi::access::fs::get_client_data_dir_path()
        .expect("Failed to initialize client data directory; application cannot start.");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
