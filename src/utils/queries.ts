import { QueryClient, QueryObserverOptions } from '@tanstack/react-query';
import { baseConfig, bscConfig, getChainConfig, getTokenBySymbol } from '../config';
import z from 'zod';
import {
  BackendPriceResponseSchema,
  LeaderboardResponse,
  LeaderboardResponseSchema,
  MultiChainStatsResponseSchema,
  PositionDetailResponse,
  PositionDetailResponseSchema,
  PositionListItemResponse,
  PositionListItemResponseSchema,
  QueryOrdersConfig,
  QueryPositionsConfig,
  QuerySwapHistoriesConfig,
  QueryTradeHistoriesConfig,
  QueryTradersConfig,
  Stats,
  SwapHistoriesResponse,
  SwapHistoriesResponseSchema,
  TradeHistoriesResponse,
  TradeHistoriesResponseSchema,
  TraderDetailResponse,
  TraderDetailResponseSchema,
  TraderListItemResponse,
  TraderListItemResponseSchema,
  UpdateType,
} from './type';
import { BigNumber, Contract, providers } from 'ethers';
import PoolV1 from '../abis/PoolV1.json';
import PoolV2 from '../abis/PoolV2.json';
import { GraphQLClient, gql } from 'graphql-request';
import { endOfDay, startOfDay } from 'date-fns';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
      refetchInterval: 60000,
    },
  },
});

export const queryBackendPrice = (
  chainId: number,
): QueryObserverOptions<Record<string, number>> => {
  return {
    queryKey: ['chain', chainId, 'back_end_prices'],
    enabled: !!chainId,
    queryFn: async () => {
      const chainConfig = getChainConfig(chainId);
      const endpoint = chainConfig.priceEndpoint;
      const res = await fetch(`${endpoint}?chain=${chainId}`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = z.array(BackendPriceResponseSchema).parse(await res.json());
      const results: Record<string, number> = {};

      for (const item of parsed) {
        const token = getTokenBySymbol(item.token, chainId);
        if (!token) {
          continue;
        }
        results[item.token] = +item.price;
      }
      return results;
    },
    refetchInterval: 30000,
  };
};

// TODO
export const queryStats = (chainId: number): QueryObserverOptions<Stats[]> => {
  return {
    queryKey: ['chain', chainId, 'stats'],
    enabled: !!chainId,
    queryFn: async () => {
      const baseUrl = baseConfig.baseUrl;

      const url = new URL(`${baseUrl}/stats`);
      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = MultiChainStatsResponseSchema.parse(await res.json());

      return parsed.map((item) => ({
        prices: item.data.data.prices || [],
        openInterest: {
          long: item.data.data.openInterest.long,
          short: item.data.data.openInterest.short,
        },
        chainId: +item.chainId,
      }));
    },
    refetchInterval: 15000,
  };
};

export const queryPositions = (
  config: QueryPositionsConfig,
): QueryObserverOptions<PositionListItemResponse> => {
  return {
    queryKey: ['positions', config],
    queryFn: async () => {
      const baseUrl = baseConfig.baseUrl;

      const url = new URL(`${baseUrl}/positions`);
      url.searchParams.append('sortBy', config.sortBy);
      url.searchParams.append('sortType', config.sortType);
      if (config.market !== undefined) {
        url.searchParams.append('market', config.market);
      }
      if (config.wallet !== undefined) {
        url.searchParams.append('wallet', config.wallet);
      }
      if (config.side !== undefined) {
        url.searchParams.append('side', config.side.toString());
      }
      if (config.status !== undefined) {
        url.searchParams.append('status', config.status.toString());
      }
      if (config.chainId !== undefined) {
        url.searchParams.append('chainId', config.chainId.toString());
      }
      if (config.page !== undefined) {
        url.searchParams.append('page', config.page.toString());
      }
      if (config.size !== undefined) {
        url.searchParams.append('size', config.size.toString());
      }

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = PositionListItemResponseSchema.parse(await res.json());
      return parsed;
    },
    refetchInterval: 15000,
  };
};

export const queryTraders = (
  config: QueryTradersConfig,
): QueryObserverOptions<TraderListItemResponse> => {
  return {
    queryKey: ['traders', config],
    queryFn: async () => {
      const baseUrl = baseConfig.baseUrl;

      const url = new URL(`${baseUrl}/traders`);
      url.searchParams.append('sortBy', config.sortBy);
      url.searchParams.append('sortType', config.sortType);
      if (config.chainId !== undefined) {
        url.searchParams.append('chainId', config.chainId.toString());
      }
      if (config.to !== undefined) {
        url.searchParams.append('to', config.to.toString());
      }
      if (config.duration) {
        const from = Math.floor(Date.now() / 1000) - config.duration;
        url.searchParams.append('from', from.toString());
      } else if (config.from) {
        url.searchParams.append('from', config.from.toString());
      }
      if (config.page !== undefined) {
        url.searchParams.append('page', config.page.toString());
      }
      if (config.size !== undefined) {
        url.searchParams.append('size', config.size.toString());
      }

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = TraderListItemResponseSchema.parse(await res.json());
      return parsed;
    },
    refetchInterval: 15000,
  };
};

export const queryLeaderboard = (): QueryObserverOptions<LeaderboardResponse> => {
  return {
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const baseUrl = baseConfig.baseUrl;
      const res = await fetch(`${baseUrl}/leaderboard`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = LeaderboardResponseSchema.parse(await res.json());
      return parsed;
    },
    refetchInterval: 60000,
  };
};

export const queryPosition = (
  id: string,
  closed: boolean,
): QueryObserverOptions<PositionDetailResponse> => {
  return {
    queryKey: ['positions', id],
    enabled: !!id,
    queryFn: async () => {
      const baseUrl = baseConfig.baseUrl;
      const res = await fetch(`${baseUrl}/entries/${id}`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = PositionDetailResponseSchema.parse(await res.json());
      return parsed;
    },
    staleTime: closed ? Infinity : 60000,
    refetchInterval: closed ? Infinity : 15000,
  };
};

export const queryTrader = (wallet: string): QueryObserverOptions<TraderDetailResponse> => {
  return {
    queryKey: ['traders', wallet],
    enabled: !!wallet,
    queryFn: async () => {
      const baseUrl = baseConfig.baseUrl;
      const res = await fetch(`${baseUrl}/accounts/${wallet}`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = TraderDetailResponseSchema.parse(await res.json());
      return parsed;
    },
    refetchInterval: 15000,
  };
};

export const queryMaintainMargin = (chainId: number): QueryObserverOptions<BigNumber> => {
  return {
    queryKey: ['chain', chainId, 'maintain_margin'],
    enabled: !!chainId,
    queryFn: async () => {
      const chainConfig = getChainConfig(chainId);
      const isV1 = chainConfig.chainId === bscConfig.chainId;
      const abi = isV1 ? PoolV1 : PoolV2;
      const contract = new Contract(
        chainConfig.pool,
        abi,
        new providers.JsonRpcProvider(chainConfig.rpc),
      );
      return contract.maintenanceMargin();
    },
    staleTime: Infinity,
    refetchInterval: Infinity,
  };
};

export const queryLiquidationFee = (chainId: number): QueryObserverOptions<BigNumber> => {
  return {
    queryKey: ['chain', chainId, 'liquidation_fee'],
    enabled: !!chainId,
    queryFn: async () => {
      const chainConfig = getChainConfig(chainId);
      const isV1 = chainConfig.chainId === bscConfig.chainId;
      const abi = isV1 ? PoolV1 : PoolV2;
      const contract = new Contract(
        chainConfig.pool,
        abi,
        new providers.JsonRpcProvider(chainConfig.rpc),
      );
      if (isV1) {
        const [, liq] = await contract.fee();
        return liq;
      }
      return contract.liquidationFee();
    },
    staleTime: Infinity,
    refetchInterval: Infinity,
  };
};

export const queryTradeHistories = (
  config: QueryTradeHistoriesConfig,
): QueryObserverOptions<TradeHistoriesResponse> => {
  return {
    queryKey: ['trade_histories', config],
    enabled: !!config.wallet,
    queryFn: async () => {
      const baseUrl = baseConfig.baseUrl;

      const url = new URL(`${baseUrl}/tradeHistories`);
      url.searchParams.append('wallet', config.wallet);
      url.searchParams.append(
        'start',
        Math.max(0, Math.floor(startOfDay(config.start).getTime() / 1000)).toString(),
      );
      url.searchParams.append(
        'end',
        Math.floor(endOfDay(config.end).getTime() / 1000).toString(),
      );
      url.searchParams.append('page', config.page.toString());
      url.searchParams.append('size', config.size.toString());
      if (config.chainId !== undefined) {
        url.searchParams.append('chainId', config.chainId.toString());
      }

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = TradeHistoriesResponseSchema.parse(await res.json());
      return parsed;
    },
    refetchInterval: 60000,
  };
};

const GET_ORDERS = gql`
  query orders($owner: Bytes!, $skip: Int!, $first: Int!, $now: Int!) {
    orders(
      skip: $skip
      first: $first
      orderBy: submissionTimestamp
      orderDirection: desc
      where: { owner: $owner, updateType_not: SWAP, status: "OPEN" }
      or: [{ type: "LIMIT" }, { type: "MARKET", expiresAt_gte: $now }]
    ) {
      sizeChange
      collateralValue
      updateType
      side
      market {
        id
      }
      type
      triggerAboveThreshold
      price
      submissionTimestamp
    }
  }
`;

export const queryOrders = (
  chainId: number,
  config: QueryOrdersConfig,
): QueryObserverOptions<{
  data: any[];
  page: number;
}> => {
  return {
    queryKey: ['chain', chainId, 'wallet', config.wallet, 'orders'],
    enabled: !!chainId && !!config.wallet,
    queryFn: async () => {
      const chainConfig = getChainConfig(chainId);
      const graphClient = new GraphQLClient(chainConfig.tradingGraph);
      const { orders } = await graphClient.request<{ orders: any }>(GET_ORDERS, {
        owner: config.wallet.toLowerCase(),
        skip: (config.page - 1) * config.size,
        first: config.size + 1,
        now: Math.floor(Date.now() / 1000),
      });
      return {
        data: orders,
        page: config.page,
      };
    },
    refetchInterval: 60000,
  };
};

export const querySwapHistories = (
  config: QuerySwapHistoriesConfig,
): QueryObserverOptions<SwapHistoriesResponse> => {
  return {
    queryKey: ['swap_histories', config],
    queryFn: async () => {
      const baseUrl = baseConfig.baseUrl;

      const url = new URL(`${baseUrl}/swapHistories`);
      url.searchParams.append('wallet', config.wallet);
      url.searchParams.append('page', config.page.toString());
      url.searchParams.append('size', config.size.toString());
      if (config.chainId !== undefined) {
        url.searchParams.append('chainId', config.chainId.toString());
      }

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const parsed = SwapHistoriesResponseSchema.parse(await res.json());
      return parsed;
    },
    refetchInterval: 60000,
  };
};
