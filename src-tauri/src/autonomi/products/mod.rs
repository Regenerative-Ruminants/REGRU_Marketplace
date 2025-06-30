use crate::commands::products::models::Product;
use autonomi::{ChunkAddress, Client, PointerAddress};

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
