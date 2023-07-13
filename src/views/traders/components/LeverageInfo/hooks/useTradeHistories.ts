import { getTokenByAddress } from '../../../../../config';
import {
  LeverageHistory,
  OrderType,
  QueryTradeHistoriesConfig,
  UpdateType,
} from '../../../../../utils/type';
import { BigNumber } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import { queryTradeHistories } from '../../../../../utils/queries';

const parse2LeverageHistory = (raw: any): LeverageHistory | undefined => {
  const indexToken = getTokenByAddress(raw.market?.indexToken?.id);
  if (!indexToken) {
    return;
  }
  return {
    time: raw.createdAtTimestamp,
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
      size: raw.size && BigNumber.from(raw.size),
      status: raw.status,
      side: raw.side,
      triggerAboveThreshold: raw.triggerAboveThreshold,
      triggerPrice: raw.triggerPrice && BigNumber.from(raw.triggerPrice),
      executionPrice: raw.executionPrice && BigNumber.from(raw.executionPrice),
      liquidatedPrice: raw.liquidatedPrice && BigNumber.from(raw.liquidatedPrice),
      collateralValue: raw.collateralValue && BigNumber.from(raw.collateralValue),
    },
    side: raw.side,
    transactionHash: raw.tx,
  };
};
export const useTradeHistories = (chainId: number, config: QueryTradeHistoriesConfig) => {
  const { data, isInitialLoading } = useQuery(queryTradeHistories(chainId, config));
  const items = data ? data.data.slice(0, config.size).map(parse2LeverageHistory) : [];
  const hasNext = data ? data.data.length > config.size : false;
  const loadedPage = data ? data.page : config.page;

  return {
    items,
    loading: isInitialLoading,
    hasNext,
    loadedPage,
  };
};
