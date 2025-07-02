use crate::commands::products::models::Product;
use autonomi::{Bytes, ChunkAddress, Client, PointerAddress};
use std::sync::Arc;

/// Pointer Address for all products
///
/// ### Note
///
/// The address is deterministic based on the wallet address that uploaded the products.
/// This address is based on the the testnet wallet 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266.
/// TODO update this for the mainnet
pub const ALL_PRODUCTS_PTR: &'static str = "974c445dc953ff66e273de57acbc067bdfd3610418b8a9a1fef73560da96ec4e1ca1060e8737fe681ebbf6081980a60d";

pub(crate) async fn get_product_by_id(
    client: &Client,
    address: &PointerAddress,
) -> color_eyre::Result<Product, String> {
    let pointer = client.pointer_get(address).await.unwrap();
    let xorname = pointer.target().xorname();

    let chunk_address = ChunkAddress::new(xorname);
    let chunk = client.chunk_get(&chunk_address).await.unwrap();
    let bytes = chunk.value();
    let result = String::from_utf8(bytes.to_vec()).unwrap();
    let product: Product = serde_json::from_str(&result).unwrap();
    Ok(product)
}

pub(crate) async fn get_product_list(
    client: &Client,
    address: &PointerAddress,
) -> color_eyre::Result<Vec<Product>, String> {
    let pointer = client
        .pointer_get(address)
        .await
        .map_err(|e| e.to_string())?;
    let xorname = pointer.target().xorname();

    let chunk_address = ChunkAddress::new(xorname);
    let chunk = client
        .chunk_get(&chunk_address)
        .await
        .map_err(|e| e.to_string())?;
    let bytes = chunk.value();
    let result = String::from_utf8(bytes.to_vec()).map_err(|e| e.to_string())?;

    let client_arc = Arc::new(client.clone());

    let futures: Vec<_> = result
        .lines()
        .filter_map(|line| PointerAddress::from_hex(line).ok())
        .map(move |ptr| {
            let client_clone_for_future = Arc::clone(&client_arc);

            tokio::spawn(async move { get_product_by_id(&client_clone_for_future, &ptr).await })
        })
        .collect();

    let results = futures::future::join_all(futures).await;

    let mut products = Vec::new();
    for res_handle in results {
        match res_handle {
            Ok(product_result) => match product_result {
                Ok(product) => products.push(product),
                Err(e) => return Err(format!("Failed to fetch a product: {}", e)),
            },
            Err(join_err) => {
                return Err(format!(
                    "A product fetching task failed to complete: {}",
                    join_err
                ));
            }
        }
    }

    Ok(products)
}
