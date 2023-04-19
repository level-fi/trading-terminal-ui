import { useEffect, useMemo, useState } from 'react';
import { config, getTokenByAddress } from '../../../../../config';
import { ChainConfigToken, OrderType, Side, UpdateType } from '../../../../../utils/type';
import { gql, GraphQLClient } from 'graphql-request';
import { UseLeverageMessageConfig } from '../../../../../hooks/useMessage';
import { BigNumber } from 'ethers';
import { endOfDay, startOfDay } from 'date-fns';

const GET_TRADE_HISTORIES = gql`
  query histories($owner: Bytes!, $start: Int, $end: Int, $skip: Int!, $first: Int!) {
    histories(
      skip: $skip
      first: $first
      where: {
        owner: $owner
        createdAtTimestamp_gte: $start
        createdAtTimestamp_lte: $end
        updateType_not: SWAP
      }
      orderBy: createdAtTimestamp
      orderDirection: desc
    ) {
      id
      createdAtTimestamp
      tx
      status
      side
      updateType
      size
      collateralValue
      triggerAboveThreshold
      triggerPrice
      executionPrice
      liquidatedPrice
      liquidatedFeeValue
      borrowFeeValue
      closeFeeValue
      pnl
      type
      collateralToken
      market {
        id
        indexToken {
          id
          decimals
        }
      }
    }
  }
`;

export interface UseTradeHistoriesConfig {
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
const graphClient = new GraphQLClient(config.tradingGraph);
export const useTradeHistories = ({
  end,
  start,
  wallet,
  page,
  size,
}: UseTradeHistoriesConfig) => {
  const [items, setItems] = useState<LeverageHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loadedPage, setLoadedPage] = useState(page);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { histories } = await graphClient.request<{ histories: any }>(
          GET_TRADE_HISTORIES,
          {
            owner: wallet?.toLowerCase(),
            start: Math.floor(startOfDay(start).getTime() / 1000),
            end: Math.floor(endOfDay(end).getTime() / 1000),
            skip: (page - 1) * size,
            first: size + 1,
          },
        );
        setLoadedPage(page);
        setHasNext(histories.length > size);
        setItems(histories.slice(0, size).map(parse2LeverageHistory));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [end, page, size, start, wallet]);

  return useMemo(
    () => ({
      items,
      loading,
      hasNext,
      loadedPage,
    }),
    [items, loading, hasNext, loadedPage],
  );
};
