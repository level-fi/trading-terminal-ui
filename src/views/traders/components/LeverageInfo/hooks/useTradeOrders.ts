import { chains, getTokenByAddress, VALUE_DECIMALS } from '../../../../../config';
import {
  ChainConfigToken,
  OrderType,
  QueryOrdersConfig,
  Side,
} from '../../../../../utils/type';
import { formatBigNumber } from '../../../../../utils/numbers';
import { useQueries } from '@tanstack/react-query';
import { queryBackendPrice, queryOrders } from '../../../../../utils/queries';
import { BigNumber } from 'ethers';

export interface LeverageOrder {
  side: Side;
  indexToken: ChainConfigToken;
  type: OrderType;
  action: string;
  triggerCondition: string;
  markPrice: number;
  chainId: number;
  timestamp: number;
}
const parseAction = (raw: any, indexToken: ChainConfigToken): string => {
  const size = formatBigNumber(
    raw.sizeChange,
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
  if (raw.updateType == 'INCREASE') {
    if (BigNumber.from(raw.sizeChange).eq(0)) {
      return `Deposit ${collateral} to ${indexToken.symbol} ${Side[raw.side]}`;
    }
    return `Increase ${indexToken.symbol} ${Side[raw.side]} by ${size}`;
  }
  if (BigNumber.from(raw.sizeChange).eq(0)) {
    return `Withdraw ${collateral} from ${indexToken.symbol} ${Side[raw.side]}`;
  }
  return `Decrease ${indexToken.symbol} ${Side[raw.side]} by ${size}`;
};
const parse2LeverageOrder = (raw: any, chainId: number): LeverageOrder | undefined => {
  const indexToken = getTokenByAddress(raw.market.id, chainId);
  if (!indexToken) {
    return undefined;
  }
  const triggerAboveThreshold = raw.triggerAboveThreshold;
  const triggerPrice = raw.price;

  return {
    indexToken: indexToken,
    side: raw.side,
    type: raw.type === 'MARKET' ? OrderType.MARKET : OrderType.LIMIT,
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
    chainId: chainId,
    timestamp: +raw.submissionTimestamp,
  };
};
export const useTradeOrders = (config: QueryOrdersConfig) => {
  const chainIds = config.chainId ? [config.chainId] : chains.map((c) => c.chainId);
  const queriesResponse = useQueries({
    queries: chainIds.map((c) => [queryOrders(c, config), queryBackendPrice(c)]).flat(),
  });
  const loading = queriesResponse.some((c) => c.isInitialLoading);
  const items: LeverageOrder[] = [];
  for (let i = 0; i < chainIds.length; i++) {
    const orders = queriesResponse[i * 2].data;
    const prices = queriesResponse[i * 2 + 1].data;
    if (!orders || !prices) {
      continue;
    }
    const rawOrders = (orders.data as []).map((c) => Object.assign({}, c));
    for (const order of rawOrders) {
      const parsed = parse2LeverageOrder(order, chainIds[i]);
      if (!parsed) {
        continue;
      }
      parsed.markPrice = prices?.[parsed.indexToken.symbol];
      items.push(parsed);
    }
  }
  return {
    items,
    loading,
  };
};
