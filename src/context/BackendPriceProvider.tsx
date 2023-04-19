import React, { createContext, useContext, useMemo, useState } from 'react';
import { config } from '../config';
import { useFetch } from '../hooks/useFetch';
import { useLongPolling } from '../hooks/useLongPolling';

interface PriceDataResponse {
  token: string;
  price: number;
  time: number;
}
type PriceData = {
  [key: string]: number;
};
interface ContextData {
  prices: PriceData;
  setEnable: (value: boolean) => void;
}
const BackendPriceContext = createContext<ContextData>({
  prices: {},
  setEnable: () => {},
});
export const BackendPriceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [items, setItems] = useState<PriceData>({});
  const [enabled, setEnabled] = useState(false);
  const { caller } = useFetch<PriceDataResponse[]>(config.priceEndpoint);
  useLongPolling(
    async () => {
      const res = await caller();
      if (!res) {
        return;
      }
      const items: PriceData = {};
      for (const item of res) {
        items[item.token] = item.price;
      }
      setItems(items);
    },
    {
      enabled: enabled,
      time: 30000,
      retriable: true,
    },
  );
  return (
    <BackendPriceContext.Provider
      value={{
        prices: items,
        setEnable: setEnabled,
      }}
    >
      {children}
    </BackendPriceContext.Provider>
  );
};
export const useBackendPrices = () => {
  const context = useContext(BackendPriceContext);
  return useMemo(() => context.prices, [context.prices]);
};
export const useEnableBackendPriceFetcher = () => {
  const context = useContext(BackendPriceContext);
  return useMemo(() => context.setEnable, [context.setEnable]);
};
