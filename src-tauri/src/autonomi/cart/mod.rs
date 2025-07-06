use crate::autonomi::access::fs::load_wallet_private_key;
use crate::commands::cart::models::Cart;
use autonomi::vault::derive_vault_key;
use autonomi::Client;

pub(crate) const REGRU_CART_DERIVIATION_INDEX: &'static str = "REGRU_CART_DERIVIATION_INDEX";

pub(crate) async fn get_cart_for_wallet(
    client: &Client,
    wallet_public_address: &str,
) -> color_eyre::Result<Cart, String> {
    let private_key = load_wallet_private_key(wallet_public_address).unwrap();

    let vault_key = derive_vault_key(&private_key).expect("Failed to derive vault key");
    let derived = vault_key.derive_child(REGRU_CART_DERIVIATION_INDEX.as_bytes());

    let scratchpad = client
        .scratchpad_get_from_public_key(&derived.public_key())
        .await
        .map_err(|e| "Cart does not exist")?;
    let data = scratchpad.decrypt_data(&derived).unwrap();

    let cart: Cart = serde_json::from_slice(&data.to_vec()).unwrap();
    Ok(cart)
}
