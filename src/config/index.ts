import { BaseConfig, ChainConfig } from '../utils/type';

export const baseConfig: BaseConfig = {
  baseUrl: 'https://terminal-api.level.finance/v8',
  priceEndpoint: 'https://api.level.finance/prices',
};

const subgraphQueryKey = 'c246be2f219f';
export const bscConfig: ChainConfig = {
  name: 'BNB',
  chainId: 56,
  baseExplorer: 'https://bscscan.com',
  rpc: 'https://bsc-dataseed1.binance.org/',
  tradingGraph: 'https://api.thegraph.com/subgraphs/name/level-fi/levelfinancetrading',
  pool: '0xA5aBFB56a78D2BD4689b25B8A77fd49Bb0675874',
  indexTokens: [
    {
      symbol: 'BTC',
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      decimals: 18,
      fractionDigits: 5,
      priceFractionDigits: 2,
      threshold: 0.00001,
    },
    {
      symbol: 'ETH',
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 2,
      threshold: 0.0001,
    },
    {
      symbol: 'BNB',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 2,
      threshold: 0.0001,
    },
    {
      symbol: 'BNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 2,
      threshold: 0.0001,
    },
    {
      symbol: 'CAKE',
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 4,
      threshold: 0.0001,
    },
  ],
  collateralTokens: [
    {
      symbol: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 3,
      threshold: 0.01,
    },
    {
      symbol: 'BUSD',
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 3,
      threshold: 0.01,
    },
  ],
};

export const arbConfig: ChainConfig = {
  name: 'ARB',
  chainId: 42161,
  baseExplorer: 'https://arbiscan.io',
  rpc: 'https://arb1.arbitrum.io/rpc/',
  tradingGraph: `https://subgraph.satsuma-prod.com/${subgraphQueryKey}/levelfinance/trading-arbitrum/api`,
  pool: '0x32B7bF19cb8b95C27E644183837813d4b595dcc6',
  indexTokens: [
    {
      symbol: 'BTC',
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      decimals: 8,
      fractionDigits: 5,
      priceFractionDigits: 2,
      threshold: 0.00001,
    },
    {
      symbol: 'ETH',
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 2,
      threshold: 0.0001,
    },
    {
      symbol: 'ETH',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 2,
      threshold: 0.0001,
    },
    {
      symbol: 'ARB',
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 4,
      threshold: 0.0001,
    },
  ],
  collateralTokens: [
    {
      symbol: 'USDT',
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      decimals: 6,
      fractionDigits: 2,
      priceFractionDigits: 3,
      threshold: 0.01,
    },
    {
      symbol: 'USDC',
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      decimals: 6,
      fractionDigits: 2,
      priceFractionDigits: 3,
      threshold: 0.01,
    },
  ],
};

export const chains = [bscConfig, arbConfig];
export const getChainConfig = (chainId: number): BaseConfig & ChainConfig => {
  const chainConfig = chains.find((c) => c.chainId === chainId);
  if (!chainConfig) {
    throw `missing config for chain ${chainId}`;
  }
  return {
    ...baseConfig,
    ...chainConfig,
  };
};
export const allTokens = chains
  .map((c) =>
    c.indexTokens.concat(c.collateralTokens).map((d) => ({
      ...d,
      chainId: c.chainId,
    })),
  )
  .flat();
export const getTokenByAddress = (address: string, chainId?: number) => {
  return allTokens.find(
    (c) =>
      c.address.toLowerCase() === address?.toLowerCase() &&
      (chainId ? c.chainId === chainId : true),
  );
};
export const getTokenBySymbol = (symbol: string, chainId?: number) => {
  return allTokens.find(
    (c) =>
      c.symbol.toLowerCase() === symbol?.toLowerCase() &&
      (chainId ? c.chainId === chainId : true),
  );
};
export const VALUE_DECIMALS = 30;
export const FEE_DECIMALS = 10;
export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
