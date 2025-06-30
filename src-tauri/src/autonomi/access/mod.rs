use autonomi::Client;

pub mod fs;
pub mod wallets;

pub(crate) async fn client(network: &str) -> Client {
    match network {
        "mainnet" => Client::init().await.unwrap(),
        "testnet" => Client::init_alpha().await.unwrap(),
        "local" => Client::init_local().await.unwrap(),
        _ => panic!("Unsupported network: {}", network),
    }
}
