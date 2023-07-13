import { useMemo } from 'react';
import {
  HistoryStatus,
  OrderType,
  Side,
  UpdateType,
  UseLeverageMessageConfig,
} from '../utils/type';
import { formatBigNumber } from '../utils/numbers';
import { VALUE_DECIMALS } from '../config';
import tradeHistoryPattern from '../assets/message/tradeHistory.json';

export const getMessage = (
  patternSource: object,
  key: string,
  replacement: Record<string, string>,
) => {
  if (!key || !patternSource) {
    return;
  }
  const splittedKey = key.split('.');
  let pattern: string | undefined;
  let source: any = patternSource;
  for (const key of splittedKey) {
    source = source[key];
    if (!source) {
      pattern = undefined;
      break;
    }
    if (typeof source !== 'string') {
      continue;
    }
    pattern = source;
  }
  if (!pattern) {
    return;
  }
  for (const key in replacement) {
    pattern = pattern.replaceAll(`%${key}%`, replacement[key]);
  }
  return `${pattern[0].toUpperCase()}${pattern.substring(1)}`;
};

export const useLeverageMessage = ({
  indexToken,
  type,
  updateType,
  size,
  status,
  side,
  triggerAboveThreshold,
  triggerPrice,
  executionPrice,
  liquidatedPrice,
  collateralValue,
}: UseLeverageMessageConfig) => {
  const key = useMemo(() => {
    let key = '';
    switch (type) {
      case OrderType.LIMIT:
        key = 'limit.leverage.';
        break;
      case OrderType.MARKET:
        key = 'market';
        if (size?.eq(0)) {
          switch (updateType) {
            case UpdateType.INCREASE:
              key += '.deposit.';
              break;
            case UpdateType.DECREASE:
              key += '.withdraw.';
              break;
          }
        } else {
          key += '.leverage.';
        }
        break;
      default:
        key = 'market.leverage.';
        break;
    }
    switch (status) {
      case HistoryStatus.OPEN:
        key += 'request';
        break;
      case HistoryStatus.FILLED:
        key += 'executed';
        break;
      case HistoryStatus.EXPIRED:
        key += 'expired';
        break;
      case HistoryStatus.CANCELLED:
        key += 'cancel';
        break;
      case HistoryStatus.LIQUIDATED:
        key += 'liquidated';
        break;
    }
    return key;
  }, [size, status, type, updateType]);
  const [action, actionInPast] = useMemo(() => {
    switch (updateType) {
      case UpdateType.INCREASE:
        if (size?.eq(0)) {
          return ['deposit', 'deposited'];
        }
        return ['increase', 'increased'];
      case UpdateType.DECREASE:
        if (size?.eq(0)) {
          return ['withdraw', 'withdrew'];
        }
        return ['decrease', 'decreased'];
      default:
        return ['', ''];
    }
  }, [size, updateType]);
  const indexPrice = useMemo(() => {
    if (!triggerPrice || !indexToken?.decimals) {
      return '';
    }
    return formatBigNumber(triggerPrice, VALUE_DECIMALS - indexToken.decimals, {
      fractionDigits: 2,
      currency: 'USD',
      keepTrailingZeros: true,
    });
  }, [indexToken?.decimals, triggerPrice]);
  const markPrice = useMemo(() => {
    if (!executionPrice || !indexToken?.decimals) {
      return '';
    }
    return formatBigNumber(executionPrice, VALUE_DECIMALS - indexToken.decimals, {
      fractionDigits: 2,
      currency: 'USD',
      keepTrailingZeros: true,
    });
  }, [indexToken?.decimals, executionPrice]);
  const liqPrice = useMemo(() => {
    if (!liquidatedPrice || !indexToken?.decimals) {
      return '';
    }
    return formatBigNumber(liquidatedPrice, VALUE_DECIMALS - indexToken.decimals, {
      fractionDigits: 2,
      currency: 'USD',
      keepTrailingZeros: true,
    });
  }, [indexToken?.decimals, liquidatedPrice]);
  return useMemo(() => {
    return getMessage(tradeHistoryPattern, key, {
      action: action,
      action_in_past: actionInPast,
      index_token: indexToken.symbol,
      side: side === Side.LONG ? 'LONG' : 'SHORT',
      size: formatBigNumber(
        size,
        VALUE_DECIMALS,
        {
          fractionDigits: 2,
          currency: 'USD',
        },
        0.01,
      ),
      collateral: formatBigNumber(
        collateralValue,
        VALUE_DECIMALS,
        {
          fractionDigits: 2,
          currency: 'USD',
        },
        0.01,
      ),
      price_condition: triggerAboveThreshold ? '≥' : '≤',
      index_price: indexPrice,
      mark_price: markPrice,
      liquidated_price: liqPrice,
    });
  }, [
    action,
    actionInPast,
    collateralValue,
    indexPrice,
    indexToken?.symbol,
    key,
    liqPrice,
    markPrice,
    side,
    size,
    triggerAboveThreshold,
  ]);
};
