use crate::autonomi::access::fs::{get_wallet_file_names, load_wallet_private_key};
use ::autonomi::Network;
use ::autonomi::Wallet;
use color_eyre::eyre::Result;

pub fn get_wallets() -> Result<Vec<Wallet>> {
    let file_names = get_wallet_file_names().expect("Failed to get wallet file names");

    let wallets = file_names
        .iter()
        .map(|name| load_wallet_private_key(name).unwrap())
        .map(|key| Wallet::new_from_private_key(Network::ArbitrumSepoliaTest, &key).unwrap())
        .collect();

    Ok(wallets)
}
