import React, { createContext, useContext, useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { ETH_ADDRESS, config } from '../config';
import { useLongPolling } from '../hooks/useLongPolling';

interface PriceInfoResponse {
  address: string;
  price: number;
  change: number;
}
interface ContextData {
  prices: PriceInfoResponse[];
  openInterest: {
    long: number;
    short: number;
  };
}
const StatsContext = createContext<ContextData>({
  prices: [],
  openInterest: {
    long: 0,
    short: 0,
  },
});
export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<ContextData>();
  const { caller } = useFetch<{ data: ContextData }>(`${config.baseUrl}/stats`);
  useLongPolling(
    async () => {
      const res = await caller();
      if (!res?.data) {
        return;
      }
      setStats({
        openInterest: res.data.openInterest,
        prices: res.data.prices.filter(
          (c) => c.address.toLowerCase() !== ETH_ADDRESS.toLowerCase(),
        ),
      });
    },
    {
      enabled: true,
      time: 15000,
      retriable: true,
    },
  );
  return <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>;
};
export const useStats = () => {
  const context = useContext(StatsContext);
  return useMemo(() => context, [context]);
};
