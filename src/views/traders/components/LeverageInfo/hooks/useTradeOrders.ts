import { getTokenByAddress, VALUE_DECIMALS } from '../../../../../config';
import {
  ChainConfigToken,
  OrderType,
  QueryOrdersConfig,
  Side,
  UpdateType,
} from '../../../../../utils/type';
import { formatBigNumber } from '../../../../../utils/numbers';
import { useQueries } from '@tanstack/react-query';
import { queryBackendPrice, queryOrders } from '../../../../../utils/queries';

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
export const useTradeOrders = (chainId: number, config: QueryOrdersConfig) => {
  const [
    { data: orders, isInitialLoading: orderLoading },
    { data: prices, isInitialLoading: priceLoading },
  ] = useQueries({
    queries: [queryOrders(chainId, config), queryBackendPrice(chainId)],
  });
  const rawOrders = orders ? orders.data : [];
  const items: LeverageOrder[] = [];
  for (const order of rawOrders) {
    const parsed = parse2LeverageOrder(order);
    if (!parsed) {
      continue;
    }
    items.push(parsed);
  }

  return {
    items: items.map((item) => ({
      ...item,
      markPrice: prices?.[item.indexToken.symbol],
    })),
    loading: orderLoading || priceLoading,
  };
};
