import { useMemo, useState } from 'react';
import { config } from '../config';
import { TraderListItemResponse } from '../utils/type';
import { useFetchPage } from './useFetch';
import { useLongPolling } from './useLongPolling';

export interface UseTradersConfig {
  sortBy: string;
  sortType: string;
  from?: number;
  to?: number;
  duration?: number;
  page: number;
  size: number;
  setPage: (value: number) => void;
}
export const useTraders = ({
  from,
  to,
  duration,
  page,
  size,
  sortBy,
  sortType,
}: UseTradersConfig) => {
  const [items, setItems] = useState<TraderListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [silentLoad, setSilentLoad] = useState(false);
  const { loadPage, pageInfo } = useFetchPage<TraderListItemResponse>(
    `${config.baseUrl}/traders`,
  );

  useLongPolling(
    async (loadedTimes) => {
      setLoading(true);
      setSilentLoad(!!loadedTimes);
      const params = {
        sortBy,
        sortType,
        to,
      };
      if (duration) {
        params['from'] = Math.floor(Date.now() / 1000) - duration;
      } else {
        params['from'] = from;
      }
      const res = await loadPage(params, page, size);
      if (res?.data) {
        setItems(res.data);
      }
      setLoading(false);
      setSilentLoad(false);
    },
    {
      enabled: true,
      retriable: true,
      time: 15000,
      fireable: `${sortBy}_${sortType}_${page}_${size}_${from}_${to}_${duration}`,
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
