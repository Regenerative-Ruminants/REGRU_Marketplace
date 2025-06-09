use color_eyre::{
    eyre::{eyre, Context, Result},
    Section,
};
use std::io::Read;
use std::path::PathBuf;

const ENCRYPTED_PRIVATE_KEY_EXT: &str = ".encrypted";

/// Get the local data dir for storing client data
///
/// # Returns
///
/// `PathBuf` - local data dir
///
#[allow(dead_code)]
pub fn get_client_data_dir_path() -> Result<PathBuf> {
    let os_data_dir = dirs_next::data_dir()
        .ok_or_else(|| eyre!("Failed to obtain data dir, your OS might not be supported."))?;
    let data_dir = create_client_data_dir(os_data_dir)?;
    Ok(data_dir)
}

/// Get the local data dir for storing wallets
///
/// # Returns
///
/// `PathBuf` - wallets data dir
///
#[allow(dead_code)]
pub fn get_wallets_dir_path() -> Result<PathBuf> {
    let client_data = get_client_data_dir_path()?;
    let wallets_dir = create_wallets_dir(client_data)?;
    Ok(wallets_dir)
}

pub fn get_wallet_file_names() -> Result<Vec<String>> {
    let wallets_dir = get_wallets_dir_path()?;
    let wallet_files = std::fs::read_dir(wallets_dir)
        .map_err(|e| eyre!("Failed to read wallets folder: {e}"))?
        .filter_map(Result::ok)
        .filter_map(|dir_entry| dir_entry.file_name().into_string().ok())
        .collect();

    Ok(wallet_files)
}

pub fn is_wallet_file_encrypted(wallet_file: &str) -> bool {
    wallet_file.ends_with(ENCRYPTED_PRIVATE_KEY_EXT)
}

pub fn get_wallet_public_address(wallet_file: &str) -> String {
    if wallet_file.ends_with(ENCRYPTED_PRIVATE_KEY_EXT) {
        return wallet_file.replace(ENCRYPTED_PRIVATE_KEY_EXT, "");
    }
    String::from(wallet_file)
}

/// Loads the private key (hex-encoded) from disk.
///
/// If the private key file is encrypted, the function will prompt for the decryption password in the CLI.
pub fn load_wallet_private_key(wallet_filename: &str) -> Result<String> {
    let wallets_dir = get_wallets_dir_path()?;

    let is_encrypted = is_wallet_file_encrypted(wallet_filename);

    if is_encrypted {
        panic!("Encrypted wallets are not supported yet");
    }

    let file_path = wallets_dir.join(wallet_filename);

    let mut file =
        std::fs::File::open(&file_path).map_err(|e| eyre!("Private key file not found: {e}"))?;

    let mut buffer = String::new();
    file.read_to_string(&mut buffer)
        .map_err(|_| eyre!("Invalid private key file"))?;

    Ok(buffer)
}

fn create_client_data_dir(data_dir: PathBuf) -> Result<PathBuf> {
    let dir = data_dir.join("autonomi/client");
    std::fs::create_dir_all(dir.as_path())
        .wrap_err("Failed to create data dir")
        .with_suggestion(|| {
            format!("make sure you have the correct permissions to access the data dir: {dir:?}")
        })?;
    Ok(dir)
}

fn create_wallets_dir(client_data_dir: PathBuf) -> Result<PathBuf> {
    let dir = client_data_dir.join("wallets");
    std::fs::create_dir_all(dir.as_path())
        .wrap_err("Failed to create wallets dir")
        .with_suggestion(|| {
            format!("make sure you have the correct permissions to access the data dir: {dir:?}")
        })?;
    Ok(dir)
}

#[cfg(test)]
mod tests {
    use super::{
        create_client_data_dir, create_wallets_dir, get_client_data_dir_path, get_wallets_dir_path,
    };
    use tempfile::env::temp_dir;

    #[test]
    fn test_get_client_data_dir() {
        // Act
        let data_dir = get_client_data_dir_path().unwrap();

        // Assert
        assert!(data_dir.exists());
        assert!(
            data_dir.to_string_lossy().contains("autonomi/client"),
            "PathBuf {:?} should contain '{}'",
            data_dir,
            "autonomi/client"
        );
    }

    #[test]
    fn test_create_client_data_dir() {
        // Arrange
        let tmp_dir = temp_dir();

        // Act
        create_client_data_dir(tmp_dir.clone()).unwrap();

        // Assert
        assert!(tmp_dir.join("autonomi/client").exists());
    }

    #[test]
    fn test_get_wallets_dir() {
        // Act
        let wallets_dir = get_wallets_dir_path().unwrap();

        // Assert
        assert!(wallets_dir.exists());
        assert!(
            wallets_dir.to_string_lossy().contains("wallets"),
            "PathBuf {:?} should contain '{}'",
            wallets_dir,
            "wallets"
        );
    }

    #[test]
    fn test_create_wallets_dir() {
        // Arrange
        let tmp_dir = temp_dir();

        // Act
        create_wallets_dir(tmp_dir.clone()).unwrap();

        // Assert
        assert!(tmp_dir.join("wallets").exists());
    }
}
