export interface Erc20Token {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
}

export const DEV_ANT_PICCADILLY: Erc20Token = {
  address: '0x8F1F739F2546a03Ee9aFf68597d86179398d891F', // QA test token
  symbol: 'tANT',
  decimals: 18,
};

export const ANT_ARBITRUM: Erc20Token = {
  address: '0xa78d8321B20c4Ef90eCd72f2588AA985A4BDb684', // Official Autonity token on Arbitrum One
  symbol: 'ANT',
  decimals: 18,
}; 