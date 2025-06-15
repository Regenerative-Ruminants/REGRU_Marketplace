use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::Mutex;
use autonomi::Network;
use serde::{Deserialize, Serialize};
use tauri::api::path::app_data_dir;
use tauri::{AppHandle, State};

#[derive(Serialize, Deserialize)]
pub struct AppState {
    pub network: Network,
}

// Function to get the path to the state file
fn get_state_file_path(config: &tauri::Config) -> PathBuf {
    let app_data_dir = app_data_dir(config).expect("failed to get app data dir");
    app_data_dir.join("state.json")
}

// Function to save state to a file
fn save_state(state: &AppState, config: &tauri::Config) -> Result<(), String> {
    let file_path = get_state_file_path(config);
    let parent_dir = file_path
        .parent()
        .ok_or_else(|| "invalid state file path".to_string())?;
    fs::create_dir_all(parent_dir)
        .map_err(|e| format!("failed to create directory: {}", e))?;
    let serialized =
        serde_json::to_string(state).map_err(|e| format!("failed to serialize state: {}", e))?;
    fs::write(file_path.clone(), serialized)
        .map_err(|e| format!("failed to write state file: {}", e))?;
    
    println!("Saved state to {}", file_path.display());
    Ok(())
}


// Function to load state from a file
pub fn load_state(config: &tauri::Config) -> Result<AppState, String> {
    let file_path = get_state_file_path(config);
    if file_path.exists() {
        let mut file = File::open(&file_path)
            .map_err(|e| format!("failed to open state file: {}", e))?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)
            .map_err(|e| format!("failed to read state file: {}", e))?;
        let state: AppState = serde_json::from_str(&contents)
            .map_err(|e| format!("failed to deserialize state: {}", e))?;
        Ok(state)
    } else {
        Ok(AppState {
            network: Network::default(),
        })
    }
}


// Tauri command to access and modify state
#[tauri::command(rename_all = "snake_case")]
pub async fn set_network(
    state: State<'_, Mutex<AppState>>,
    app_handle: AppHandle,
    network: String,
) -> Result<String, String> {

    let config = app_handle.config();

    let matched_network = match network.as_str() {
        "mainnet" => Network::ArbitrumOne,
        "local" => Network::new(true).expect("Failed to connect to local network"),
        _ => return Err(format!("Unsupported network: {}", network))
    };


    let mut state = state.lock().unwrap();
    state.network = matched_network;
    
    save_state(&state, &config)?;
    
    Ok(format!("Updated network to {}", state.network))
}
