import { QueryClient, QueryObserverOptions } from '@tanstack/react-query';
import { baseConfig, getChainConfig, getTokenBySymbol } from '../config';
import z from 'zod';
import {
  BackendPriceResponseSchema,
  LeaderboardResponse,
  LeaderboardResponseSchema,
  PositionDetailResponse,
  PositionDetailResponseSchema,
  PositionListItemResponse,
  PositionListItemResponseSchema,
  QueryPositionsConfig,
  QueryTradersConfig,
  Stats,
  TraderDetailResponse,
  TraderDetailResponseSchema,
  TraderListItemResponse,
  TraderListItemResponseSchema,
} from './type';

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
export const queryStats = (chainId: number): QueryObserverOptions<Stats> => {
  return {
    queryKey: ['chain', chainId, 'stats'],
    enabled: !!chainId,
    queryFn: () => {
      return {
        prices: [],
        openInterest: {
          long: 0,
          short: 0,
        },
      };
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
      url.searchParams.append('market', config.market);
      url.searchParams.append('wallet', config.wallet);
      url.searchParams.append('side', config.side?.toString());
      url.searchParams.append('status', config.status?.toString());
      url.searchParams.append('chainId', config.chainId?.toString());
      url.searchParams.append('page', config.page?.toString());
      url.searchParams.append('size', config.size?.toString());

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
      url.searchParams.append('chainId', config.chainId?.toString());
      url.searchParams.append('to', config.to?.toString());
      if (config.duration) {
        const from = Math.floor(Date.now() / 1000) - config.duration;
        url.searchParams.append('from', from.toString());
      } else {
        url.searchParams.append('from', config.from?.toString());
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
  };
};
