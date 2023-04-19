import { useEffect, useMemo, useState } from 'react';
import { config, getTokenByAddress } from '../config';
import {
  ChainConfigToken,
  EntryResponse,
  PlaceOrderEvent,
  PositionResponse,
  RawPlaceOrderEvent,
  Side,
} from '../utils/type';
import { useFetch } from './useFetch';
import { useLongPolling } from './useLongPolling';

export interface PositionHistory {
  time: number;
  action: string;
  collateral: number;
  size: number;
  paidFee: number;
  executedPrice: number;
  transactionHash: string;
}
export interface Position {
  indexToken: ChainConfigToken | undefined;
  collateralToken: ChainConfigToken | undefined;
  entryPrice: number;
  markPrice: number;
  size: number;
  collateral: number;
  paidFee: number;
  netValue: number;
  netProfit: number;
  realizedPnl: number;
  pnl: number;
  wallet: string;
  histories: PositionHistory[];
  openTx: {
    logIndex: number;
    transactionHash: string;
  };
  side: Side;
  borrowFee: number;
  closeFee: number;
  closedAt: number;
}
const parseAction = (
  rawEvent: RawPlaceOrderEvent,
  event: PlaceOrderEvent,
  isCloseAll: boolean,
) => {
  switch (rawEvent) {
    case RawPlaceOrderEvent.LIQUIDATE:
      return 'liquidate';
    case RawPlaceOrderEvent.INCREASE:
      return event === PlaceOrderEvent.OPEN ? 'open' : 'deposit collateral';
    case RawPlaceOrderEvent.DECREASE:
      return event === PlaceOrderEvent.CLOSE
        ? isCloseAll
          ? 'close'
          : 'partial close'
        : 'withdraw collateral';
  }
};
export const usePosition = (id: string) => {
  const [rawItem, setRawItem] = useState<PositionResponse>();
  const { caller, loading } = useFetch<EntryResponse>(`${config.baseUrl}/entries/${id}`);
  const [silentLoad, setSilentLoad] = useState(false);

  useEffect(() => {
    setRawItem(undefined);
  }, [id]);

  const enabled = useMemo(() => {
    if (!rawItem) {
      return true;
    }
    const generatedId = `${rawItem?.openTx?.transactionHash}${rawItem?.openTx?.logIndex}`;
    return generatedId == id ? !rawItem.closedAt : true;
  }, [id, rawItem]);

  useLongPolling(
    async (loadedTimes) => {
      setSilentLoad(!!loadedTimes);
      const res = await caller();
      if (res) {
        setRawItem(res.data);
      } else {
        setRawItem(undefined);
      }
      setSilentLoad(false);
    },
    {
      enabled: id && enabled,
      retriable: true,
      time: 15000,
      fireable: `${id}`,
    },
  );

  return useMemo(() => {
    const position = rawItem
      ? ({
          indexToken: getTokenByAddress(rawItem.histories?.[0]?.indexToken || ''),
          collateralToken: getTokenByAddress(rawItem.histories?.[0]?.collateralToken || ''),
          entryPrice: rawItem.entryPrice,
          markPrice: rawItem.markPrice,
          liqPrice: 0,
          size: rawItem.size,
          collateral: rawItem.collateral,
          paidFee: rawItem.fee,
          netProfit: rawItem.netProfit,
          netValue: rawItem.netValue,
          wallet: rawItem.histories?.[0]?.account || '',
          side: rawItem.histories?.[0]?.side,
          borrowFee: rawItem.borrowFee,
          closeFee: rawItem.closeFee,
          closedAt: rawItem.closedAt,
          pnl: rawItem.pnl,
          realizedPnl: rawItem.realizedPnl,
          openTx: {
            logIndex: rawItem.openTx.logIndex,
            transactionHash: rawItem.openTx.transactionHash,
          },
          histories: rawItem.histories
            ?.map((c) => ({
              action: parseAction(c.rawEvent, c.event, !!c.isCloseAll),
              collateral: c.collateral,
              executedPrice: c.markPrice,
              paidFee: c.fee,
              size: c.size,
              time: c.receivedAt,
              transactionHash: c.transactionHash,
            }))
            .reverse(),
        } as Position)
      : undefined;
    return {
      item: position,
      loading,
      silentLoad,
    };
  }, [rawItem, loading, silentLoad]);
};
