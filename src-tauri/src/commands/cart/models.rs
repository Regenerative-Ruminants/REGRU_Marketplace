use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
pub struct CartItem {
    pub uuid: Uuid,
    pub quantity: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Cart {
    pub items: Vec<CartItem>,
}
