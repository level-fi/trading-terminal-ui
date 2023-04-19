import { ChainConfig } from '../utils/type';

// const DevConfig: ChainConfig = {
//   baseUrl: '',
//   baseExplorer: '',
//   priceEndpoint: '',
//   rpc: '',
//   tradingGraph: '',
//   tradeLens: '',
//   orderbook: '',
//   indexTokens: [],
//   collateralTokens: [],
// }

const ProdConfig: ChainConfig = {
  baseUrl: 'https://terminal-api.level.finance/v7',
  baseExplorer: 'https://bscscan.com',
  priceEndpoint: 'https://api.level.finance/prices',
  rpc: 'https://bsc-dataseed1.binance.org/',
  tradingGraph: 'https://api.thegraph.com/subgraphs/name/level-fi/levelfinancetrading',
  tradeLens: '0xE23779FAe98D5F5ce757822A3846e8Fe45598f1A',
  orderbook: '0xf584A17dF21Afd9de84F47842ECEAF6042b1Bb5b',
  pool: '0xA5aBFB56a78D2BD4689b25B8A77fd49Bb0675874',
  indexTokens: [
    {
      symbol: 'ETH',
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 2,
      threshold: 0.0001,
    },
    {
      symbol: 'BTC',
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      decimals: 18,
      fractionDigits: 5,
      priceFractionDigits: 2,
      threshold: 0.00001,
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

export const config = ProdConfig;
const tokens = config.indexTokens.concat(config.collateralTokens);
export const getTokenByAddress = (address: string) =>
  tokens.find((c) => c.address.toLowerCase() === address?.toLowerCase());
export const getTokenBySymbol = (symbol: string) =>
  tokens.find((c) => c.symbol.toLowerCase() === symbol?.toLowerCase());
export const VALUE_DECIMALS = 30;
export const FEE_DECIMALS = 10;
export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
