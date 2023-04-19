import { useMemo, useState } from 'react';
import { config } from '../config';
import { PositionListItemResponse } from '../utils/type';
import { useFetchPage } from './useFetch';
import { useLongPolling } from './useLongPolling';

export interface UsePositionsConfig {
  sortBy: string;
  sortType: string;
  side?: number;
  status?: number;
  market?: string;
  page: number;
  size: number;
  setPage: (value: number) => void;
  wallet?: string;
}
export const usePositions = ({
  side,
  status,
  market,
  page,
  size,
  sortBy,
  sortType,
  wallet,
}: UsePositionsConfig) => {
  const [items, setItems] = useState<PositionListItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [silentLoad, setSilentLoad] = useState(false);
  const { loadPage, pageInfo } = useFetchPage<PositionListItemResponse>(
    `${config.baseUrl}/positions`,
  );

  useLongPolling(
    async (loadedTimes) => {
      setLoading(true);
      setSilentLoad(!!loadedTimes);

      const res = await loadPage(
        {
          sortBy,
          sortType,
          side,
          status,
          market,
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
      time: 15000,
      fireable: `${sortBy}_${sortType}_${side}_${status}_${market}_${page}_${size}_${wallet}`,
    },
  );

  return useMemo(
    () => ({
      items,
      pageInfo,
      loading,
      silentLoad,
    }),
    [items, pageInfo, loading, silentLoad],
  );
};
