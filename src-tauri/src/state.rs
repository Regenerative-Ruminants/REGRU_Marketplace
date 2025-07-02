use autonomi::{Client, Network};
use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use tauri::api::path::app_data_dir;

#[derive(Serialize, Deserialize)]
pub struct AppState {
    pub network: String,
    pub wallet: Option<String>,
}

impl AppState {
    pub(crate) fn to_network(&self) -> Network {
        match self.network.as_str() {
            "mainnet" => Network::ArbitrumOne,
            "testnet" => Network::ArbitrumSepoliaTest,
            "local" => Network::new(true).expect("Failed to connect to local network"),
            _ => panic!("Unsupported network: {}", self.network),
        }
    }
}

/// Function to get the path to the state file
pub(crate) fn get_state_file_path(config: &tauri::Config) -> PathBuf {
    let app_data_dir = app_data_dir(config).expect("failed to get app data dir");
    app_data_dir.join("state.json")
}

/// Function to save state to a file
pub(crate) fn save_state(state: &AppState, file_path: &PathBuf) -> Result<(), String> {
    let parent_dir = file_path
        .parent()
        .ok_or_else(|| "invalid state file path".to_string())?;
    fs::create_dir_all(parent_dir).map_err(|e| format!("failed to create directory: {}", e))?;
    let serialized =
        serde_json::to_string(state).map_err(|e| format!("failed to serialize state: {}", e))?;
    fs::write(file_path.clone(), serialized)
        .map_err(|e| format!("failed to write state file: {}", e))?;

    println!("Saved state to {}", file_path.display());
    Ok(())
}

/// Function to load state from a file
pub fn load_state(file_path: &PathBuf) -> Result<AppState, String> {
    if file_path.exists() {
        let mut file =
            File::open(&file_path).map_err(|e| format!("failed to open state file: {}", e))?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)
            .map_err(|e| format!("failed to read state file: {}", e))?;
        let state: AppState = serde_json::from_str(&contents)
            .map_err(|e| format!("failed to deserialize state: {}", e))?;
        Ok(state)
    } else {
        Ok(AppState {
            network: String::from("mainnet"),
            wallet: None,
        })
    }
}

#[cfg(test)]
mod tests {

    mod save_state {
        use crate::state::{save_state, AppState};
        use tempfile::env::temp_dir;

        #[test]
        fn test_save_state() {
            // Arrange
            let tmp_dir = temp_dir();
            let path = tmp_dir.join("state.json");

            let data = AppState {
                network: String::from("testnet"),
                wallet: Some(String::from("0x98204")),
            };

            // Act
            let result = save_state(&data, &path);

            // Assert
            assert!(result.is_ok());
        }
    }

    mod load_state {
        use crate::state::{load_state, AppState};
        use std::fs;
        use tempfile::env::temp_dir;

        #[test]
        fn test_load_state_file_not_found() {
            // Arrange
            let tmp_dir = temp_dir();
            let path = tmp_dir.join("missing-state-file.json");

            // Act
            let result = load_state(&path);

            // Assert
            assert!(result.is_ok());

            let state = result.unwrap();
            assert_eq!(state.network, String::from("mainnet"));
            assert_eq!(state.wallet, None);
        }

        #[test]
        fn test_load_state_file() {
            // Arrange
            let tmp_dir = temp_dir();
            let path = tmp_dir.join("state.json");

            let data = AppState {
                network: String::from("testnet"),
                wallet: Some(String::from("0x98204")),
            };

            let json_string =
                serde_json::to_string_pretty(&data).expect("Failed to serialize data to JSON");

            fs::write(path.clone(), json_string).unwrap();

            // Act
            let result = load_state(&path);

            // Assert
            assert!(result.is_ok());

            let state = result.unwrap();
            assert_eq!(state.network, String::from("testnet"));
            assert_eq!(state.wallet.unwrap(), String::from("0x98204"));
        }
    }
}
