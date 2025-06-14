use ::autonomi::Wallet as AutonomiWallet;
use alloy_primitives::U256;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct Wallet {
    pub address: String,
    pub token_balance: U256,
    pub gas_token_balance: U256,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AvailableWallets {
    pub wallets: Vec<Wallet>,
}

impl Wallet {
    pub async fn from_evm_wallet(wallet: &AutonomiWallet) -> Self {
        let (token_balance, gas_token_balance) =
            tokio::join!(wallet.balance_of_tokens(), wallet.balance_of_gas_tokens(),);

        Wallet {
            address: wallet.address().to_string(),
            token_balance: token_balance.unwrap(),
            gas_token_balance: gas_token_balance.unwrap(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ::autonomi::Wallet as AutonomiWallet;
    use alloy_primitives::U256;
    use autonomi::Network;
    use tokio;

    #[tokio::test]
    async fn test_mapping_wallet_types() {
        // Arrange
        let wallet = AutonomiWallet::new_with_random_wallet(Network::ArbitrumSepoliaTest);

        // Act
        let result = Wallet::from_evm_wallet(&wallet).await;

        // Assert
        let expected = Wallet {
            address: wallet.address().to_string(),
            token_balance: U256::from(0),
            gas_token_balance: U256::from(0),
        };
        assert_eq!(result, expected);
    }
}
