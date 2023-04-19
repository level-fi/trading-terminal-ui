export interface TraderListItemResponse {
  account: string;
  netProfit: number;
  volume: number;
  win: number;
  lost: number;
  pnl: number;
}

export interface PositionListItemResponse {
  id: string;
  account: string;
  side: Side;
  entry: number;
  pnl: number;
  netProfit: number;
  indexToken: string;
  collateralToken: string;
  mark: number;
  size: number;
  collateral: number;
  status: PositionStatus;
  historiesCount: number;
  time: number;
}

export interface PositionHistoryResponse {
  account: string;
  collateralToken: string;
  indexToken: string;
  collateral: number;
  size: number;
  borrowIndex: number;
  side: Side;
  entryPrice: number;
  markPrice: number;
  fee: number;
  event: PlaceOrderEvent;
  rawEvent: RawPlaceOrderEvent;
  receivedAt: number;
  transactionHash: string;
  isCloseAll?: boolean;
}

export interface PositionResponse {
  entryPrice: number;
  collateral: number;
  size: number;
  markPrice: number;
  netProfit: number;
  netValue: number;
  fee: number;
  status: PositionStatus;
  histories: PositionHistoryResponse[];
  openOn: number;
  pnl: number;
  realizedPnl: number;
  closedAt?: number;
  closeFee: number;
  borrowFee: number;
  openTx: {
    logIndex: number;
    transactionHash: string;
  };
}

export interface EntryResponse {
  data: PositionResponse;
  id: string;
}

export enum RawPlaceOrderEvent {
  INCREASE = 'increase',
  DECREASE = 'decrease',
  LIQUIDATE = 'liquidate',
}

export enum PlaceOrderEvent {
  OPEN,
  DEPOSIT,
  WITHDRAW,
  CLOSE,
}

export enum Side {
  LONG,
  SHORT,
}

export enum PositionStatus {
  OPEN,
  CLOSE,
  LIQUIDATED,
}

export enum OrderType {
  MARKET,
  LIMIT,
}

export enum UpdateType {
  INCREASE,
  DECREASE,
  SWAP,
}

export enum HistoryStatus {
  OPEN = 'OPEN',
  CANCELLED = 'CANCELLED',
  FILLED = 'FILLED',
  EXPIRED = 'EXPIRED',
  LIQUIDATED = 'LIQUIDATED',
}

export interface ChainConfigToken {
  symbol: string;
  address: string;
  decimals: number;
  fractionDigits: number;
  priceFractionDigits: number;
  threshold: number;
}

export interface ChainConfig {
  baseUrl: string;
  priceEndpoint: string;
  baseExplorer: string;
  rpc: string;
  tradingGraph: string;
  tradeLens: string;
  orderbook: string;
  pool: string;
  indexTokens: ChainConfigToken[];
  collateralTokens: ChainConfigToken[];
}

export interface TraderDetailResponse {
  totalPnl: number;
  totalNetProfit: number;
  totalFee: number;
  totalTrading: number;
  totalClosed: number;
  totalOpen: number;
  openInterest: number;
}

export interface LeaderboardItem {
  wallet: string;
  volume: number;
}

export interface LeaderboardResponse {
  allTime: LeaderboardItem[];
  currentWeek: LeaderboardItem[];
  currentMonth: LeaderboardItem[];
  preWeek: LeaderboardItem[];
  preMonth: LeaderboardItem[];
}
