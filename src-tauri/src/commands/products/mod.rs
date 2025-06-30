use crate::autonomi::access::client;
use crate::autonomi::products::get_product_by_id;
use crate::commands::products::models::Product;
use crate::state::AppState;
use autonomi::PointerAddress;
use std::sync::Mutex;
use tauri::State;

pub mod models;

/// Get a product by its Autonomi Pointer Address.
///
/// ## Arguments
///
/// * `address` - A PointerAddress hex string for the product to retrieve.
#[tauri::command(rename_all = "snake_case")]
pub async fn get_product(
    state: State<'_, Mutex<AppState>>,
    address: String,
) -> color_eyre::Result<Product, String> {
    let network = &state.lock().unwrap().network.clone();
    let client = client(network).await;

    let pointer_address = PointerAddress::from_hex(&address).unwrap();

    get_product_by_id(&client, &pointer_address).await
}
