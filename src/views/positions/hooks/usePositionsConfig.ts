/* @unocss-include */
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PositionStatus, QueryPositionsConfig, Side } from '../../../utils/type';
import { chains, getChainConfig, getTokenBySymbol } from '../../../config';
import { usePagination } from '../../../hooks/usePagination';

export const statusOptions = [
  {
    label: 'all',
    value: undefined,
  },
  {
    label: 'open',
    value: PositionStatus.OPEN,
  },
  {
    label: 'closed',
    value: PositionStatus.CLOSE,
  },
];
export const getMarketOptions = (chainId?: number) => {
  const results = [
    {
      label: 'all',
      value: undefined,
    },
  ];
  const tokens = chainId
    ? getChainConfig(chainId).indexTokens.map((c) => c.symbol)
    : chains.map((c) => c.indexTokens.map((c) => c.symbol)).flat();
  results.push(
    ...tokens
      .filter((c, index) => index === tokens.indexOf(c))
      .map((c) => ({
        label: c.toLowerCase(),
        value: c,
      })),
  );
  return results;
};
export const chainOptions = [
  {
    label: 'all',
    value: undefined,
  },
  ...chains.map((c) => ({
    label: c.name.toLowerCase(),
    value: c.chainId,
  })),
];
export const sideOptions = [
  {
    label: 'all',
    value: undefined,
    activeBg: 'bg-primary',
  },
  {
    label: 'long',
    value: Side.LONG,
    activeBg: 'bg-win',
  },
  {
    label: 'short',
    value: Side.SHORT,
    activeBg: 'bg-loss',
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
    label: 'Size (High → Low)',
    customLabel: {
      label: 'Size',
      subLabel: 'High → Low',
    },
    value: {
      sortBy: 'size',
      sortType: 'desc',
    },
  },
  {
    label: 'Size (Low → High)',
    customLabel: {
      label: 'Size',
      subLabel: 'Low → High',
    },
    value: {
      sortBy: 'size',
      sortType: 'asc',
    },
  },
  {
    label: 'PnL (High → Low)',
    customLabel: {
      label: 'PnL',
      subLabel: 'High → Low',
    },
    value: {
      sortBy: 'pnl',
      sortType: 'desc',
    },
  },
  {
    label: 'PnL (Low → High)',
    customLabel: {
      label: 'PnL',
      subLabel: 'Low → High',
    },
    value: {
      sortBy: 'pnl',
      sortType: 'asc',
    },
  },
  {
    label: 'Last Updated (New → Old)',
    customLabel: {
      label: 'Last Updated',
      subLabel: 'New → Old',
    },
    value: {
      sortBy: 'time',
      sortType: 'desc',
    },
  },
  {
    label: 'Last Updated (Old → New)',
    customLabel: {
      label: 'Last Updated',
      subLabel: 'Old → New',
    },
    value: {
      sortBy: 'time',
      sortType: 'asc',
    },
  },
];
export const usePositionsConfigParsed = () => {
  const [params] = useSearchParams();
  const { page, size, setPage } = usePagination();

  const sortBy = useMemo(() => params.get('sort') || 'time', [params]);
  const sortType = useMemo(() => {
    const raw = params.get('order');
    if (raw) {
      return raw;
    }
    return 'desc';
  }, [params]);
  const side = useMemo(() => {
    const raw = sideOptions.find((c) => c.label === params.get('side')?.toLowerCase());
    return raw?.value;
  }, [params]);
  const status = useMemo(() => {
    const raw = statusOptions.find((c) => c.label === params.get('status')?.toLowerCase());
    return raw?.value;
  }, [params]);
  const chainId = useMemo(() => {
    const raw = chainOptions.find((c) => c.label === params.get('chain')?.toLowerCase());
    return raw?.value;
  }, [params]);
  const market = useMemo(() => {
    const marketOptions = getMarketOptions(chainId);
    const raw = marketOptions.find((c) => c.label === params.get('market')?.toLowerCase());
    return raw?.label;
  }, [chainId, params]);

  return useMemo(
    () => ({
      config: {
        from: 0,
        page: page,
        size: size,
        sortBy: sortBy,
        sortType: sortType,
        side: side,
        status: status,
        market: market,
        chainId: chainId,
      } as QueryPositionsConfig,
      setPage,
    }),
    [page, size, sortBy, sortType, side, status, market, chainId, setPage],
  );
};
