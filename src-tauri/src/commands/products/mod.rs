use crate::autonomi::access::client;
use crate::autonomi::products::{get_product_by_id, get_product_list};
use crate::commands::products::models::Product;
use crate::state::AppState;
use alloy_primitives::address;
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

/// Get all products
#[tauri::command(rename_all = "snake_case")]
pub async fn get_all_products(
    state: State<'_, Mutex<AppState>>,
) -> color_eyre::Result<Vec<Product>, String> {
    let network = &state.lock().unwrap().network.clone();
    let client = client(network).await;

    let product_list_ptr = "974c445dc953ff66e273de57acbc067bdfd3610418b8a9a1fef73560da96ec4e1ca1060e8737fe681ebbf6081980a60d";
    let pointer_address = PointerAddress::from_hex(product_list_ptr).unwrap();

    get_product_list(&client, &pointer_address).await
}
