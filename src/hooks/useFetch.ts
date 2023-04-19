import { useCallback, useMemo, useState } from 'react';

export interface BaseResponse<T> {
  data: T;
  message: string;
}

export interface PageInfo {
  totalItems: number;
  total: number;
  current: number;
  size: number;
}

interface BasePageResponse<T> extends BaseResponse<T> {
  page: PageInfo;
}

export interface QueryParam {
  [key: string]: string | number | undefined;
}

const fetcher = async <T>(url: string, query?: QueryParam) => {
  const queryParams = !query
    ? ''
    : `?${Object.entries(query)
        .filter((c) => c[1] !== undefined)
        .map((c) => c.join('='))
        .join('&')}`;
  const response = await fetch(`${url}${queryParams}`);
  const data = await response.json();
  return data as T;
};

export const useFetch = <T>(url: string) => {
  const [loading, setLoading] = useState(false);
  const caller = useCallback(
    async (query?: QueryParam) => {
      setLoading(true);
      try {
        const data = await fetcher(url, query);
        return data as T;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
      return undefined;
    },
    [url],
  );
  return useMemo(
    () => ({
      loading: loading,
      caller,
    }),
    [caller, loading],
  );
};

export const useFetchPage = <T>(url: string) => {
  const [page, setPage] = useState<PageInfo>();
  const { caller: rawCaller, loading } = useFetch<BasePageResponse<T[]>>(url);
  const loadPage = useCallback(
    async (query?: QueryParam, page: string | number = 1, size: string | number = 10) => {
      query = {
        ...(query || {}),
        size,
        page,
      };
      const response = await rawCaller(query);
      if (!response) {
        return undefined;
      }
      setPage(response.page);
      return response;
    },
    [rawCaller],
  );
  const nextPage = useCallback(
    (query?: QueryParam) => loadPage(query, page?.current ? page.current + 1 : 1, page?.size),
    [loadPage, page],
  );
  const prevPage = useCallback(
    (query?: QueryParam) => loadPage(query, page?.current ? page.current - 1 : 1, page?.size),
    [loadPage, page],
  );
  return useMemo(
    () => ({
      loading,
      loadPage,
      nextPage,
      prevPage,
      pageInfo: page,
    }),
    [loadPage, loading, nextPage, page, prevPage],
  );
};
