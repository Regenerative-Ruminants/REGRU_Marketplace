use std::sync::Mutex;
use autonomi_core::wallets::serializable_wallet::SerializableWallet;
use crate::models::{Product, Cart};

/// Represents the shared state of our application.
pub struct AppState {
    pub wallets: Mutex<Vec<SerializableWallet>>,
    pub products: Mutex<Vec<Product>>,
    pub carts: Mutex<Vec<Cart>>,
} 