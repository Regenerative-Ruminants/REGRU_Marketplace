pub mod models;

use crate::autonomi::access::client;
use crate::autonomi::access::fs::load_wallet_private_key;
use crate::autonomi::cart::{get_cart_for_wallet, REGRU_CART_DERIVIATION_INDEX};
use crate::commands::cart::models::{Cart, CartItem};
use crate::state::AppState;
use alloy_primitives::bytes::Bytes;
use autonomi::client::payment::PaymentOption;
use autonomi::vault::derive_vault_key;
use autonomi::Wallet;
use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;

/// Get cart.
///
/// Depends on:
/// - Cart being already created.
/// - Wallet set in the app state.
#[tauri::command(rename_all = "snake_case")]
pub async fn get_cart(state: State<'_, Mutex<AppState>>) -> color_eyre::Result<Cart, String> {
    let network = &state.lock().unwrap().network.clone();
    let client = client(network).await;
    let wallet = &state.lock().unwrap().wallet.clone();

    if wallet.is_none() {
        return Err("You must set a wallet using app state".to_string());
    }

    let cart = get_cart_for_wallet(&client, &wallet.clone().unwrap()).await?;
    Ok(cart)
}

/// Create cart.
///
/// Depends on:
/// - Wallet set in the app state.
#[tauri::command(rename_all = "snake_case")]
pub async fn create_cart(state: State<'_, Mutex<AppState>>) -> color_eyre::Result<Cart, String> {
    let network = &state.lock().unwrap().network.clone();
    let client = client(network).await;
    let wallet = &state.lock().unwrap().wallet.clone();

    if wallet.is_none() {
        return Err("You must set a wallet using app state".to_string());
    }

    let private_key = load_wallet_private_key(&wallet.clone().unwrap()).unwrap();
    let wallet = Wallet::new_from_private_key(client.evm_network().clone(), &private_key).unwrap();
    let payment_option = PaymentOption::Wallet(wallet);
    let vault_key = derive_vault_key(&private_key).expect("Failed to derive vault key");
    let derived = vault_key.derive_child(REGRU_CART_DERIVIATION_INDEX.as_bytes());

    let cart = Cart { items: vec![] };

    let json = serde_json::to_string(&cart).unwrap();
    let bytes = Bytes::from(json);

    client
        .scratchpad_create(&derived, 1, &bytes, payment_option)
        .await
        .expect("Failed to create cart");

    Ok(cart)
}

/// Update cart.
///
/// Depends on:
/// - Cart being already created.
/// - Wallet set in the app state.
#[tauri::command(rename_all = "snake_case")]
pub async fn update_cart(
    state: State<'_, Mutex<AppState>>,
    product_uuid: String,
    quantity: u32,
) -> color_eyre::Result<Cart, String> {
    let network = &state.lock().unwrap().network.clone();
    let client = client(network).await;
    let wallet = &state.lock().unwrap().wallet.clone();

    if wallet.is_none() {
        return Err("You must set a wallet using app state".to_string());
    }

    let wallet_public_address = &wallet.clone().unwrap();
    let private_key = load_wallet_private_key(wallet_public_address).unwrap();
    let vault_key = derive_vault_key(&private_key).expect("Failed to derive vault key");
    let derived = vault_key.derive_child(REGRU_CART_DERIVIATION_INDEX.as_bytes());

    let mut cart = get_cart_for_wallet(&client, wallet_public_address).await?;

    let uuid = Uuid::parse_str(&product_uuid).unwrap();

    let mut existing_product_updated = false;

    for item in cart.items.iter_mut() {
        if uuid == item.uuid {
            item.quantity = quantity;
            existing_product_updated = true;
        }
    }

    if !existing_product_updated {
        let new_item = CartItem { uuid, quantity };
        cart.items.push(new_item);
    };

    let json = serde_json::to_string(&cart).unwrap();
    let bytes = Bytes::from(json);

    client
        .scratchpad_update(&derived, 1, &bytes)
        .await
        .expect("Failed to update cart");

    Ok(cart)
}
