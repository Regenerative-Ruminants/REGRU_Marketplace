use alloy_primitives::U256;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
pub struct Price {
    pub currency: String,
    pub amount: U256,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Product {
    pub uuid: Uuid,
    pub name: String,
    pub description: String,
    pub price: Price,
    pub image_address: String,
    pub tags: Vec<String>,
}
