import { BigNumber, Contract, providers } from 'ethers';
import { config, getTokenByAddress } from '../../../../../config';
import TradeLensAbi from '../../../../../abis/TradeLens.json';
import { useLongPolling } from '../../../../../hooks/useLongPolling';
import { ChainConfigToken } from '../../../../../utils/type';
import { useMemo, useState } from 'react';
import { useBackendPrices } from '../../../../../context/BackendPriceProvider';

export interface UseOrdersConfig {
  wallet: string;
}
export interface SwapOrder {
  tokenOut: ChainConfigToken;
  tokenIn: ChainConfigToken;
  amountIn: BigNumber;
  amountOut: BigNumber;
  minAmountOut: BigNumber;
  price: BigNumber;
  markPrice: number;
}
const parse2LeverageOrder = (raw: any): SwapOrder | undefined => {
  const tokenIn = getTokenByAddress(raw.tokenIn);
  const tokenOut = getTokenByAddress(raw.tokenOut);
  if (!tokenIn || !tokenOut) {
    return undefined;
  }

  return {
    tokenOut: tokenOut,
    tokenIn: tokenIn,
    amountIn: raw.amountIn,
    amountOut: raw.amountOut,
    minAmountOut: raw.minAmountOut,
    price: raw.price,
    markPrice: 0,
  };
};
const contract = new Contract(
  config.tradeLens,
  TradeLensAbi,
  new providers.JsonRpcProvider(config.rpc),
);
export const useSwapOrders = ({ wallet }: UseOrdersConfig) => {
  const [items, setItems] = useState<SwapOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [silentLoad, setSilentLoad] = useState(false);
  const prices = useBackendPrices();

  useLongPolling(
    async (loadedTimes) => {
      setLoading(true);
      setSilentLoad(!!loadedTimes);

      try {
        const raw = await contract.getAllSwapOrders(config.orderbook, wallet);
        const rawOrders: [] = raw?.[0] || [];
        if (!rawOrders?.length) {
          return;
        }
        const items: SwapOrder[] = [];
        for (const order of rawOrders) {
          const parsed = parse2LeverageOrder(order);
          if (!parsed) {
            continue;
          }
          items.push(parsed);
        }
        setItems(items);
      } finally {
        setLoading(false);
      }
    },
    {
      enabled: true,
      retriable: true,
      time: 15000,
      fireable: !!wallet && wallet,
    },
  );

  return useMemo(
    () => ({
      items: items.map((item) => {
        const priceTokenIn = prices[item.tokenIn.symbol];
        const priceTokenOut = prices[item.tokenOut.symbol];
        return {
          ...item,
          markPrice:
            priceTokenIn && priceTokenOut && priceTokenOut > 0
              ? priceTokenIn / priceTokenOut
              : 0,
        };
      }),
      silentLoad,
      loading,
    }),
    [items, loading, prices, silentLoad],
  );
};
