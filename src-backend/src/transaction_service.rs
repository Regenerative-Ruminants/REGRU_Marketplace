use anyhow::{Result, anyhow};
use ant_protocol::storage::PointerAddress;
use autonomi_core::wallets::SerializableWallet;
use crate::models::ApiProduct;
use serde::{Serialize, Deserialize};

/// Placeholder cart item struct (replace with real one)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CartLine {
    pub product_id: String,
    pub quantity: u32,
}

pub struct TransactionService {
    /// Application hot-wallet loaded from SECRET_KEY
    pub app_wallet: SerializableWallet,
    /// Pointer address that contains all product metadata JSON
    pub all_products_pointer: PointerAddress,
    pub pointer_hex: String,
}

impl TransactionService {
    pub fn new(app_wallet: SerializableWallet, all_products_pointer_hex: &str) -> Result<Self> {
        let ptr_addr = PointerAddress::from_hex(all_products_pointer_hex)
            .map_err(|_| anyhow!("Failed to parse pointer hex"))?;
        Ok(Self { app_wallet, all_products_pointer: ptr_addr, pointer_hex: all_products_pointer_hex.to_string() })
    }

    /// Executes a purchase – WIP
    pub async fn execute_purchase(&self, cart: &[CartLine], buyer_wallet: &str) -> Result<String> {
        // Step 1) Resolve pointer -> fetch product catalog JSON
        let catalog_json = std::process::Command::new("antctl")
            .args(["pointer", "get", &self.pointer_hex, "--json"])
            .output();

        let mut total_price = 0.0_f64;
        match catalog_json {
            Ok(output) if output.status.success() => {
                if let Ok(json_str) = String::from_utf8(output.stdout) {
                    if let Ok(products) = serde_json::from_str::<Vec<ApiProduct>>(&json_str) {
                        for line in cart {
                            if let Some(p) = products.iter().find(|p| p.id == line.product_id) {
                                total_price += p.price * line.quantity as f64;
                            }
                        }
                    }
                }
            }
            Err(e) => log::warn!("Failed to fetch catalog for price calculation: {e}"),
            _ => log::warn!("antctl returned error status when fetching catalog"),
        }

        // Step 3) Build EVM tx via evmlib::wallet (stub)
        // For now, we simply log and return dummy tx hash
        log::info!("execute_purchase processed for {buyer_wallet} => {total_price}");
        Ok("0xDEADBEEF".into())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_execute_purchase_returns_hash() {
        let service = TransactionService::new(
            SerializableWallet {
                name: "Test".into(),
                address: "0xdead".into(),
                balance: "0".into(),
            },
            "8f997d304fd69ddd69a40d012251de8ade37c4fc1757ccdabba72003b628721ffec465dbf55c74ed30f2630c59f5147f",
        )
        .unwrap();

        // we skip actual antctl call by giving empty cart to minimise dependency
        let result = service.execute_purchase(&[], "0xuser").await.unwrap();
        assert_eq!(result, "0xDEADBEEF");
    }
} 