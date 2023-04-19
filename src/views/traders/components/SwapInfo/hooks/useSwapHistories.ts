import { useEffect, useMemo, useState } from 'react';
import { VALUE_DECIMALS, config, getTokenByAddress } from '../../../../../config';
import { ChainConfigToken, OrderType } from '../../../../../utils/type';
import { gql, GraphQLClient } from 'graphql-request';
import { BigNumber, utils } from 'ethers';

const GET_TRADE_HISTORIES = gql`
  query histories($owner: Bytes!, $skip: Int!, $first: Int!) {
    histories(
      skip: $skip
      first: $first
      where: { owner: $owner, updateType: SWAP, status: FILLED }
      orderBy: createdAtTimestamp
      orderDirection: desc
    ) {
      id
      createdAtTimestamp
      tx
      type
      triggerPrice
      executionPrice
      amountIn
      amountOut
      tokenIn
      tokenOut
      minAmountOut
    }
  }
`;

export interface SwapHistory {
  time: number;
  tokenIn: ChainConfigToken;
  tokenOut: ChainConfigToken;
  type: OrderType;
  amountIn: BigNumber;
  amountOut: BigNumber;
  minAmountOut: BigNumber;
  triggerPrice: BigNumber;
  executionPrice: BigNumber;
  transactionHash: string;
}
const parse2SwapHistory = (raw: any): SwapHistory | undefined => {
  const tokenIn = getTokenByAddress(raw.tokenIn);
  const tokenOut = getTokenByAddress(raw.tokenOut);
  if (!tokenIn || !tokenOut) {
    return undefined;
  }
  const amountIn = raw.amountIn && BigNumber.from(raw.amountIn);
  const amountOut = raw.amountOut && BigNumber.from(raw.amountOut);
  const executionPrice = amountOut
    .mul(utils.parseUnits('1', VALUE_DECIMALS))
    .div(amountIn)
    .div(utils.parseUnits('1', tokenOut.decimals));
  return {
    time: raw.createdAtTimestamp,
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    type:
      raw.type === 'MARKET'
        ? OrderType.MARKET
        : raw.type === 'LIMIT'
        ? OrderType.LIMIT
        : OrderType.MARKET,
    amountIn: amountIn,
    amountOut: amountOut,
    executionPrice: executionPrice,
    triggerPrice: raw.triggerPrice && BigNumber.from(raw.triggerPrice),
    minAmountOut: raw.minAmountOut && BigNumber.from(raw.minAmountOut),
    transactionHash: raw.tx,
  };
};
interface UseSwapHistoriesConfig {
  wallet: string;
  page: number;
  size: number;
}
const graphClient = new GraphQLClient(config.tradingGraph);
export const useSwapHistories = ({ wallet, page, size }: UseSwapHistoriesConfig) => {
  const [items, setItems] = useState<SwapHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { histories } = await graphClient.request<{ histories: any }>(
          GET_TRADE_HISTORIES,
          {
            owner: wallet?.toLowerCase(),
            skip: (page - 1) * size,
            first: size + 1,
          },
        );
        setHasNext(histories.length > size);
        setItems(histories.slice(0, size).map(parse2SwapHistory));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, size, wallet]);

  return useMemo(
    () => ({
      items,
      loading,
      hasNext,
    }),
    [items, loading, hasNext],
  );
};
