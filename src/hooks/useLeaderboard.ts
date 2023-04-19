import { useMemo, useState } from 'react';
import { config } from '../config';
import { useFetch } from './useFetch';
import { useLongPolling } from './useLongPolling';
import { LeaderboardResponse } from '../utils/type';

export const useLeaderboard = () => {
  const [data, setData] = useState<LeaderboardResponse>({
    allTime: [],
    currentMonth: [],
    currentWeek: [],
    preMonth: [],
    preWeek: [],
  });
  const [loading, setLoading] = useState(true);
  const { caller } = useFetch<{ data: LeaderboardResponse }>(`${config.baseUrl}/leaderboard`);

  useLongPolling(
    async (loadedTimes) => {
      setLoading(!loadedTimes);
      const res = await caller();
      if (res?.data) {
        setData(res.data);
      }
      setLoading(false);
    },
    {
      enabled: true,
      retriable: true,
      time: 60000,
    },
  );

  return useMemo(
    () => ({
      loading,
      data,
    }),
    [data, loading],
  );
};
