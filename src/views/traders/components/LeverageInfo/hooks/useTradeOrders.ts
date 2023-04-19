import { Contract, providers } from 'ethers';
import { config, getTokenByAddress, VALUE_DECIMALS } from '../../../../../config';
import TradeLensAbi from '../../../../../abis/TradeLens.json';
import { useLongPolling } from '../../../../../hooks/useLongPolling';
import { ChainConfigToken, OrderType, Side, UpdateType } from '../../../../../utils/type';
import { useMemo, useState } from 'react';
import { formatBigNumber } from '../../../../../utils/numbers';
import { useBackendPrices } from '../../../../../context/BackendPriceProvider';

export interface UseOrdersConfig {
  wallet: string;
}
export interface LeverageOrder {
  side: Side;
  indexToken: ChainConfigToken;
  type: OrderType;
  action: string;
  triggerCondition: string;
  markPrice: number;
}
const parseAction = (raw: any, indexToken: ChainConfigToken): string => {
  const size = formatBigNumber(
    raw.size,
    VALUE_DECIMALS,
    {
      currency: 'USD',
      fractionDigits: 2,
      keepTrailingZeros: true,
    },
    0.01,
  );
  const collateral = formatBigNumber(
    raw.collateralValue,
    VALUE_DECIMALS,
    {
      currency: 'USD',
      fractionDigits: 2,
      keepTrailingZeros: true,
    },
    0.01,
  );
  if (raw.updateType == UpdateType.INCREASE) {
    if (raw.size?.eq(0)) {
      return `Deposit ${collateral} to ${indexToken.symbol} ${Side[raw.side]}`;
    }
    return `Increase ${indexToken.symbol} ${Side[raw.side]} by ${size}`;
  }
  if (raw.size?.eq(0)) {
    return `Withdraw ${collateral} from ${indexToken.symbol} ${Side[raw.side]}`;
  }
  return `Decrease ${indexToken.symbol} ${Side[raw.side]} by ${size}`;
};
const parse2LeverageOrder = (raw: any): LeverageOrder | undefined => {
  const indexToken = getTokenByAddress(raw.indexToken);
  if (!indexToken) {
    return undefined;
  }
  const triggerAboveThreshold = raw.triggerAboveThreshold;
  const triggerPrice = raw.triggerPrice;

  return {
    indexToken: indexToken,
    side: raw.side,
    type: raw.isMarket ? OrderType.MARKET : OrderType.LIMIT,
    markPrice: 0,
    action: parseAction(raw, indexToken),
    triggerCondition: `Mark Price ${triggerAboveThreshold ? '≥' : '≤'} ${formatBigNumber(
      triggerPrice,
      VALUE_DECIMALS - indexToken.decimals,
      {
        currency: 'USD',
        fractionDigits: 2,
        keepTrailingZeros: true,
      },
      0.01,
    )}`,
  };
};
const contract = new Contract(
  config.tradeLens,
  TradeLensAbi,
  new providers.JsonRpcProvider(config.rpc),
);
export const useTradeOrders = ({ wallet }: UseOrdersConfig) => {
  const [items, setItems] = useState<LeverageOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [silentLoad, setSilentLoad] = useState(false);
  const prices = useBackendPrices();

  useLongPolling(
    async (loadedTimes) => {
      setLoading(true);
      setSilentLoad(!!loadedTimes);

      try {
        const raw = await contract.getAllLeverageOrders(config.orderbook, wallet);
        const rawOrders: [] = raw?.[0] || [];
        if (!rawOrders?.length) {
          return;
        }
        const items: LeverageOrder[] = [];
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
      items: items.map((item) => ({
        ...item,
        markPrice: prices[item.indexToken.symbol],
      })),
      silentLoad,
      loading,
    }),
    [items, loading, prices, silentLoad],
  );
};
