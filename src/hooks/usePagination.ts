import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UsePaginationConfig {
  page?: number;
  size?: number;
  pageKey?: string;
  sizeKey?: string;
}
export const usePagination = (config?: UsePaginationConfig) => {
  const [params, setParams] = useSearchParams();
  const page = useMemo(() => {
    const raw = params.get(config?.pageKey || 'page');
    const parsed = parseInt(raw || '');
    if (!raw || isNaN(parsed)) {
      return config?.page || 1;
    }
    return parsed;
  }, [config?.page, config?.pageKey, params]);
  const size = useMemo(() => {
    const raw = params.get(config?.sizeKey || 'size');
    const parsed = parseInt(raw || '');
    if (!raw || isNaN(parsed)) {
      return config?.size || 10;
    }
    return parsed;
  }, [config?.size, config?.sizeKey, params]);
  const setPage = useCallback(
    (value: number | string) => {
      params.set(config?.pageKey || 'page', value.toString());
      setParams(params);
    },
    [config?.pageKey, params, setParams],
  );
  return useMemo(
    () => ({
      page,
      size,
      setPage: setPage,
    }),
    [page, size, setPage],
  );
};
