import { BigNumber } from 'ethers';
import z from 'zod';

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

export const PageInfoSchema = z.object({
  totalItems: z.number(),
  total: z.number(),
  current: z.number(),
  size: z.number(),
});
export type PageInfo = z.infer<typeof PageInfoSchema>;

export const TraderListItemResponseSchema = z.object({
  data: z.array(
    z.object({
      account: z.string(),
      netProfit: z.number(),
      volume: z.number(),
      win: z.number(),
      lost: z.number(),
      fee: z.number(),
    }),
  ),
  page: PageInfoSchema,
});
export type TraderListItemResponse = z.infer<typeof TraderListItemResponseSchema>;

export const PositionListItemResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      account: z.string(),
      side: z.nativeEnum(Side),
      entry: z.number(),
      pnl: z.number(),
      netProfit: z.number(),
      indexToken: z.string(),
      collateralToken: z.string(),
      mark: z.number(),
      size: z.number(),
      collateral: z.number(),
      status: z.nativeEnum(PositionStatus),
      historiesCount: z.number(),
      time: z.number(),
      chainId: z.number(),
    }),
  ),
  page: PageInfoSchema,
});
export type PositionListItemResponse = z.infer<typeof PositionListItemResponseSchema>;

export const PositionDetailHistoryResponseSchema = z.object({
  account: z.string(),
  collateralToken: z.string(),
  indexToken: z.string(),
  collateral: z.number(),
  size: z.number(),
  borrowIndex: z.number(),
  side: z.nativeEnum(Side),
  entryPrice: z.number(),
  markPrice: z.number(),
  fee: z.number(),
  event: z.nativeEnum(PlaceOrderEvent),
  rawEvent: z.nativeEnum(RawPlaceOrderEvent),
  receivedAt: z.number(),
  transactionHash: z.string(),
  isCloseAll: z.boolean().optional(),
});
export type PositionDetailHistoryResponse = z.infer<typeof PositionDetailHistoryResponseSchema>;

export const PositionDetailResponseSchema = z.object({
  data: z.object({
    entryPrice: z.number(),
    collateral: z.number(),
    size: z.number(),
    markPrice: z.number(),
    netProfit: z.number(),
    netValue: z.number(),
    fee: z.number(),
    status: z.nativeEnum(PositionStatus),
    histories: z.array(PositionDetailHistoryResponseSchema),
    openOn: z.number().optional(),
    pnl: z.number(),
    realizedPnl: z.number(),
    closedAt: z.number().optional(),
    closeFee: z.number(),
    borrowFee: z.number(),
    openTx: z.object({
      logIndex: z.number(),
      transactionHash: z.string(),
    }),
    chainId: z.number(),
  }),
  id: z.string(),
});
export type PositionDetailResponse = z.infer<typeof PositionDetailResponseSchema>;

export const TraderDetailResponseSchema = z.object({
  data: z.object({
    totalPnl: z.number(),
    totalNetProfit: z.number(),
    totalFee: z.number(),
    totalTrading: z.number(),
    totalClosed: z.number(),
    totalOpen: z.number(),
    openInterest: z.number(),
  }),
});
export type TraderDetailResponse = z.infer<typeof TraderDetailResponseSchema>;

export const LeaderboardItemSchema = z.object({
  wallet: z.string(),
  volume: z.number(),
});
export type LeaderboardItem = z.infer<typeof LeaderboardItemSchema>;

export const LeaderboardResponseSchema = z.object({
  data: z.object({
    allTime: z.array(LeaderboardItemSchema),
    currentWeek: z.array(LeaderboardItemSchema),
    currentMonth: z.array(LeaderboardItemSchema),
    preWeek: z.array(LeaderboardItemSchema),
    preMonth: z.array(LeaderboardItemSchema),
  }),
});
export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;

export const BackendPriceResponseSchema = z.object({
  time: z.number(),
  price: z.string(),
  token: z.string(),
});
export type BackendPriceResponse = z.infer<typeof BackendPriceResponseSchema>;

export interface PriceInfoResponse {
  address: string;
  price: number;
  change: number;
}
export interface Stats {
  prices: PriceInfoResponse[];
  openInterest: {
    long: number;
    short: number;
  };
}

export interface QueryPositionsConfig {
  chainId?: number;
  sortBy: string;
  sortType: string;
  side?: number;
  status?: number;
  market?: string;
  page: number;
  size: number;
  wallet?: string;
}

export interface QueryTradersConfig {
  chainId?: number;
  sortBy: string;
  sortType: string;
  from?: number;
  to?: number;
  duration?: number;
  page: number;
  size: number;
}

export interface ChainConfigToken {
  symbol: string;
  address: string;
  decimals: number;
  fractionDigits: number;
  priceFractionDigits: number;
  threshold: number;
}

export interface BaseConfig {
  baseUrl: string;
  priceEndpoint: string;
}

export interface ChainConfig {
  chainId: number;
  baseExplorer: string;
  rpc: string;
  tradingGraph: string;
  pool: string;
  indexTokens: ChainConfigToken[];
  collateralTokens: ChainConfigToken[];
}

export interface UseLeverageMessageConfig {
  indexToken: ChainConfigToken;
  type: OrderType;
  updateType: UpdateType;
  size: BigNumber;
  status: HistoryStatus;
  side: Side;
  triggerAboveThreshold: boolean;
  triggerPrice: BigNumber;
  executionPrice: BigNumber;
  liquidatedPrice: BigNumber;
  collateralValue: BigNumber;
}

export interface QueryTradeHistoriesConfig {
  end: number;
  start: number;
  wallet: string;
  page: number;
  size: number;
}

export interface LeverageHistory {
  time: number;
  indexToken: ChainConfigToken;
  side: Side;
  messageConfig: UseLeverageMessageConfig;
  transactionHash: string;
}

export interface QueryOrdersConfig {
  wallet: string;
  page: number;
  size: number;
}

export type LeverageOrder = {
  side: Side;
  indexToken: ChainConfigToken;
  type: OrderType;
  action: string;
  triggerCondition: string;
  markPrice: number;
};

export interface QuerySwapHistoriesConfig {
  wallet: string;
  page: number;
  size: number;
  chainId?: number;
}

export const SwapHistoryResponseSchema = z.object({
  createdAt: z.number(),
  transactionHash: z.string(),
  type: z.string(),
  amountIn: z.number(),
  amountOut: z.number(),
  tokenIn: z.string(),
  tokenOut: z.string(),
  valueIn: z.number(),
  account: z.string(),
  fee: z.number(),
});

export const SwapHistoriesResponseSchema = z.object({
  data: z.array(SwapHistoryResponseSchema),
  page: PageInfoSchema,
});
export type SwapHistoriesResponse = z.infer<typeof SwapHistoriesResponseSchema>;
