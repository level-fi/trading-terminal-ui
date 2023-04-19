import { useMemo, useState } from 'react';
import { config } from '../config';
import { TraderDetailResponse } from '../utils/type';
import { useFetch } from './useFetch';
import { useLongPolling } from './useLongPolling';

export interface TraderDetail {
  wallet: string;
  volume: number;
  netProfit: number;
  feePaid: number;
  openInterest: number;
  totalOpen: number;
  totalClosed: number;
}
export const useTraderDetail = (wallet: string) => {
  const [rawItem, setRawItem] = useState<TraderDetailResponse>();
  const [loading, setLoading] = useState(true);
  const { caller } = useFetch<{ data: TraderDetailResponse }>(
    `${config.baseUrl}/accounts/${wallet}`,
  );

  useLongPolling(
    async (loadedTimes) => {
      setLoading(!loadedTimes);
      const res = await caller();
      if (res?.data) {
        setRawItem(res.data);
      } else {
        setRawItem(undefined);
      }
      setLoading(false);
    },
    {
      enabled: true,
      retriable: true,
      time: 15000,
      fireable: !!wallet,
    },
  );

  return useMemo(
    () => ({
      item: {
        wallet: wallet,
        feePaid: rawItem?.totalFee || 0,
        volume: rawItem?.totalTrading || 0,
        netProfit: rawItem?.totalNetProfit || 0,
        totalClosed: rawItem?.totalClosed || 0,
        totalOpen: rawItem?.totalOpen || 0,
        openInterest: rawItem?.openInterest || 0,
      } as TraderDetail,
      loading,
    }),
    [
      loading,
      rawItem?.openInterest,
      rawItem?.totalClosed,
      rawItem?.totalFee,
      rawItem?.totalNetProfit,
      rawItem?.totalOpen,
      rawItem?.totalTrading,
      wallet,
    ],
  );
};
