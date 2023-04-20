import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePagination } from '../../../hooks/usePagination';
import { UseTradersConfig } from '../../../hooks/useTraders';

export const timeFilterOptions = [
  {
    label: 'all',
    value: undefined,
  },
  {
    label: '24h',
    value: 86400,
  },
  {
    label: '7d',
    value: 604800,
  },
  {
    label: '1m',
    value: 2592000,
  },
];
export const orderOptions = [
  {
    label: 'Net Profit (High → Low)',
    customLabel: {
      label: 'Net Profit',
      subLabel: 'High → Low',
    },
    value: {
      sortBy: 'netProfit',
      sortType: 'desc',
    },
  },
  {
    label: 'Net Profit (Low → High)',
    customLabel: {
      label: 'Net Profit',
      subLabel: 'Low → High',
    },
    value: {
      sortBy: 'netProfit',
      sortType: 'asc',
    },
  },
  {
    label: 'Trading Volume (High → Low)',
    customLabel: {
      label: 'Trading Volume',
      subLabel: 'High → Low',
    },
    value: {
      sortBy: 'volume',
      sortType: 'desc',
    },
  },
  {
    label: 'Trading Volume (Low → High)',
    customLabel: {
      label: 'Trading Volume',
      subLabel: 'Low → High',
    },
    value: {
      sortBy: 'volume',
      sortType: 'asc',
    },
  },
];
export const useTradersConfigParsed = () => {
  const [params] = useSearchParams();
  const { page, size, setPage } = usePagination();

  const sortBy = useMemo(() => params.get('sort') || 'volume', [params]);
  const sortType = useMemo(() => {
    const raw = params.get('order');
    if (raw) {
      return raw;
    }
    return 'desc';
  }, [params]);
  const duration = useMemo(() => {
    const raw = timeFilterOptions.find(
      (c) => c.label === params.get('duration')?.toLowerCase(),
    )?.value;
    return raw;
  }, [params]);

  return useMemo<UseTradersConfig>(
    () => ({
      duration: duration,
      page: page,
      size: size,
      sortBy: sortBy,
      sortType: sortType,
      setPage,
    }),
    [page, size, sortBy, sortType, duration, setPage],
  );
};
