export interface Network {
  chainId: number; // decimal chain id
  chainIdHex: string; // hex string with 0x prefix
  name: string;
  currency: string; // native currency symbol
  explorerUrl: string;
  rpcUrls: string[];
}

export const AUTONITY_PICCADILLY_TESTNET: Network = {
  chainId: 65100004,
  chainIdHex: '0x03e158e4',
  name: 'Autonity Piccadilly (Tiber) Testnet',
  currency: 'ATN',
  explorerUrl: 'https://piccadilly.autonity.org',
  rpcUrls: ['https://autonity.rpc.web3cdn.network/testnet', 'https://autonity-piccadilly.rpc.subquery.network/public', 'https://rpc.piccadilly.autonity.org'],
};

export const ARBITRUM_ONE: Network = {
  chainId: 42161,
  chainIdHex: '0xa4b1',
  name: 'Arbitrum One',
  currency: 'ETH',
  explorerUrl: 'https://arbiscan.io',
  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
};

// Placeholder – to be filled once Autonity publishes mainnet params.
export const AUTONITY_MAINNET_PLACEHOLDER: Network = {
  chainId: 0,
  chainIdHex: '0x0',
  name: 'Autonity Mainnet (TBA)',
  currency: 'ATN',
  explorerUrl: 'https://mainnet.autonity.org',
  rpcUrls: [''],
}; 