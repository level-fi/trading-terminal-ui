import { getTokenByAddress } from '../../../../../config';
import {
  LeverageHistory,
  OrderType,
  QueryTradeHistoriesConfig,
  TradeHistoryResponse,
  UpdateType,
} from '../../../../../utils/type';
import { useQuery } from '@tanstack/react-query';
import { queryTradeHistories } from '../../../../../utils/queries';

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
  const { data, isInitialLoading } = useQuery(queryTradeHistories(config));
  const items = data ? data.data.slice(0, config.size).map(parse2LeverageHistory) : [];
  const pageInfo = data ? data.page : undefined;

  return {
    items,
    loading: isInitialLoading,
    pageInfo,
  };
};
