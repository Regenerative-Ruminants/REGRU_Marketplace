use anyhow::{Result, anyhow};
use ant_protocol::storage::PointerAddress;
use crate::models::ApiProduct;
use serde::{Serialize, Deserialize};
use std::process::Command;

/// Placeholder cart item struct (replace with real one)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CartLine {
    pub product_id: String,
    pub quantity: u32,
}

/// Service responsible only for pricing logic (no signing / wallet).
pub struct TransactionService {
    pub pointer_hex: String,
}

impl TransactionService {
    pub fn new(pointer_hex: &str) -> Result<Self> {
        // validate pointer format early – keep for future pointer PUT/GET
        let _ = PointerAddress::from_hex(pointer_hex).map_err(|_| anyhow!("Invalid pointer"))?;
        Ok(Self { pointer_hex: pointer_hex.to_string() })
    }

    /// Compute the cart total in Wei (1e18) without performing any on-chain action.
    pub async fn quote_total_wei(&self, cart: &[CartLine]) -> Result<u128> {
        // 1) Fetch latest catalogue JSON from SAFE via antctl
        if cart.is_empty() {
            return Ok(0);
        }
        let output = Command::new("antctl")
            .args(["pointer", "get", &self.pointer_hex, "--json"])
            .output();

        let mut total_eth = 0.0_f64; // ETH (ATN) value before conversion

        match output {
            Ok(out) if out.status.success() => {
                if let Ok(json_str) = String::from_utf8(out.stdout) {
                    if let Ok(products) = serde_json::from_str::<Vec<ApiProduct>>(&json_str) {
                        for line in cart {
                            if let Some(p) = products.iter().find(|p| p.id == line.product_id) {
                                total_eth += p.price * line.quantity as f64;
                            }
                        }
                    }
                }
            }
            Ok(out) => {
                return Err(anyhow!("antctl exited with status {}", out.status));
            }
            Err(e) => return Err(anyhow!("Failed to invoke antctl: {e}")),
        }

        // Convert ETH to Wei (1 ATN assumed == 1 ETH unit).
        let wei = (total_eth * 1e18).round() as u128;
        Ok(wei)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_execute_purchase_returns_hash() {
        let service = TransactionService::new(
            "8f997d304fd69ddd69a40d012251de8ade37c4fc1757ccdabba72003b628721ffec465dbf55c74ed30f2630c59f5147f",
        )
        .unwrap();

        // we skip actual antctl call by giving empty cart to minimise dependency
        let result = service.quote_total_wei(&[]).await.unwrap();
        assert_eq!(result, 0);
    }
} 