use crate::autonomi::access::client;
use crate::autonomi::products::{get_product_by_id, get_product_list, ALL_PRODUCTS_PTR};
use crate::commands::products::models::Product;
use crate::state::AppState;
use autonomi::data::DataAddress;
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

    let pointer_address = PointerAddress::from_hex(ALL_PRODUCTS_PTR).unwrap();

    get_product_list(&client, &pointer_address).await
}

/// Get a product image
///
/// ## Arguments
///
/// * `address` - A DataAddress hex string for the product image to retrieve.
#[tauri::command(rename_all = "snake_case")]
pub async fn get_product_image(
    state: State<'_, Mutex<AppState>>,
    address: String,
) -> color_eyre::Result<Vec<u8>, String> {
    let network = &state.lock().unwrap().network.clone();
    let client = client(network).await;

    let data_address = DataAddress::from_hex(&address).map_err(|_| "Invalid data address")?;
    let bytes = client
        .data_get_public(&data_address)
        .await
        .map_err(|e| format!("Failed to get public data: {}", e))?;

    Ok(bytes.to_vec())
}
