import { getTokenByAddress } from '../../../../../config';
import {
  LeverageHistory,
  OrderType,
  QueryTradeHistoriesConfig,
  TradeHistoriesResponse,
  TradeHistoryResponse,
  UpdateType,
} from '../../../../../utils/type';
import { useQuery } from '@tanstack/react-query';
import { queryTradeHistories } from '../../../../../utils/queries';
import { useState, useEffect } from 'react';

const parse2LeverageHistory = (raw: TradeHistoryResponse): LeverageHistory | undefined => {
  const indexToken = getTokenByAddress(raw.indexToken, raw.chainId);
  if (!indexToken) {
    return;
  }
  return {
    time: raw.createdAt,
    indexToken: indexToken,
    messageConfig: {
      indexToken: indexToken,
      type:
        raw.type === 'MARKET'
          ? OrderType.MARKET
          : raw.type === 'LIMIT'
          ? OrderType.LIMIT
          : OrderType.MARKET,
      updateType: raw.updateType === 'INCREASE' ? UpdateType.INCREASE : UpdateType.DECREASE,
      size: raw.size,
      status: raw.status,
      side: raw.side,
      triggerAboveThreshold: raw.triggerAboveThreshold,
      triggerPrice: raw.triggerPrice,
      executionPrice: raw.executionPrice,
      liquidatedPrice: raw.liquidatedPrice,
      collateralValue: raw.collateralValue,
    },
    side: raw.side,
    transactionHash: raw.transactionHash,
    chainId: raw.chainId,
  };
};
export const useTradeHistories = (config: QueryTradeHistoriesConfig) => {
  const [response, setResponse] = useState<TradeHistoriesResponse>();
  const { data, isInitialLoading } = useQuery(queryTradeHistories(config));

  useEffect(() => {
    if (isInitialLoading) {
      return;
    }
    setResponse(data);
  }, [data, isInitialLoading]);
  const items = response ? response.data.slice(0, config.size).map(parse2LeverageHistory) : [];
  const pageInfo = response ? response.page : undefined;

  return {
    items,
    loading: isInitialLoading,
    pageInfo,
  };
};
