import { useMemo, useState } from 'react';
import { config } from '../../../../../config';
import { useFetchPage } from '../../../../../hooks/useFetch';
import { useLongPolling } from '../../../../../hooks/useLongPolling';

export interface SwapHistory {
  createdAt: number;
  transactionHash: string;
  type: number;
  price: number;
  amountIn: number;
  amountOut: number;
  tokenIn: string;
  tokenOut: string;
  minAmountOut: number;
  valueIn: number;
  account: string;
  fee: number;
}

interface UseSwapHistoriesConfig {
  wallet: string;
  page: number;
  size: number;
}
export const useSwapHistories = ({ wallet, page, size }: UseSwapHistoriesConfig) => {
  const [items, setItems] = useState<SwapHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [silentLoad, setSilentLoad] = useState(false);
  const { loadPage, pageInfo } = useFetchPage<SwapHistory>(`${config.baseUrl}/swapHistories`);

  useLongPolling(
    async (loadedTimes) => {
      setLoading(true);
      setSilentLoad(!!loadedTimes);

      const res = await loadPage(
        {
          wallet,
        },
        page,
        size,
      );
      if (res?.data) {
        setItems(res.data);
      }
      setLoading(false);
    },
    {
      enabled: true,
      retriable: true,
      time: 60000,
      fireable: `${page}_${size}_${wallet}`,
    },
  );

  return useMemo(
    () => ({
      items,
      loading,
      silentLoad,
      pageInfo,
    }),
    [items, loading, silentLoad, pageInfo],
  );
};
