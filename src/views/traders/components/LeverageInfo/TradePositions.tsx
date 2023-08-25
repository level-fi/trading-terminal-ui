import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NoData } from '../../../../components/NoData';
import { Loading } from '../../../../components/Loading';
import { PositionItem } from '../../../positions/components/PositionItem';
import { TableContentLoader } from '../../../../components/TableContentLoader';
import { PositionListItemResponse, PositionStatus } from '../../../../utils/type';
import { Pagination } from '../../../../components/Pagination';
import {
  chainOptions,
  statusOptions as baseStatusOptions,
} from '../../../positions/hooks/usePositionsConfig';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryPositions, queryTrader } from '../../../../utils/queries';
import { Dropdown } from '../../../../components/Dropdown';
import c from 'classnames';

interface TradePositionsProps {
  wallet: string;
  setTotalPositions: (value: number) => void;
}
export const TradePositions: React.FC<TradePositionsProps> = ({
  wallet,
  setTotalPositions,
}) => {
  const [params, setParams] = useSearchParams();
  const headerRef = useRef<HTMLDivElement>();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PositionStatus>();
  const [chainId, setChainId] = useState<number>();
  const [response, setResponse] = useState<PositionListItemResponse>();

  const { data: trader, refetch: refetchTrader } = useQuery(queryTrader(wallet));
  const { data, isInitialLoading } = useQuery(
    queryPositions({
      page: page,
      size: 10,
      sortBy: 'time',
      sortType: 'desc',
      wallet: wallet,
      status: status,
      chainId: chainId,
    }),
  );

  useEffect(() => {
    if (isInitialLoading) {
      return;
    }
    setResponse(data);
  }, [data, isInitialLoading]);
  const items = response ? response.data : [];
  const pageInfo = response ? response.page : undefined;

  const totalOpen = useMemo(
    () => trader?.data?.byChains?.totalOpen || [],
    [trader?.data?.byChains?.totalOpen],
  );
  const totalClosed = useMemo(
    () => trader?.data?.byChains?.totalClosed || [],
    [trader?.data?.byChains?.totalClosed],
  );
  const totalLiquidated = useMemo(
    () => trader?.data?.byChains?.totalLiquidated || [],
    [trader?.data?.byChains?.totalLiquidated],
  );

  const getTotal = useCallback(
    (status?: PositionStatus) => {
      let total = 0;
      switch (status) {
        case PositionStatus.OPEN:
          if (chainId) {
            total = totalOpen.find((c) => c.chainId === chainId)?.value;
          } else {
            total = totalOpen.reduce((a, b) => a + b.value, 0);
          }
          break;
        case PositionStatus.CLOSE:
          if (chainId) {
            total = totalClosed.find((c) => c.chainId === chainId)?.value;
          } else {
            total = totalClosed.reduce((a, b) => a + b.value, 0);
          }
          break;
        case PositionStatus.LIQUIDATED:
          if (chainId) {
            total = totalLiquidated.find((c) => c.chainId === chainId)?.value;
          } else {
            total = totalLiquidated.reduce((a, b) => a + b.value, 0);
          }
          break;
      }
      return total;
    },
    [chainId, totalClosed, totalLiquidated, totalOpen],
  );

  const total = useMemo(
    () =>
      getTotal(PositionStatus.OPEN) +
      getTotal(PositionStatus.CLOSE) +
      getTotal(PositionStatus.LIQUIDATED),
    [getTotal],
  );

  useEffect(() => {
    setTotalPositions(total);
  }, [setTotalPositions, total]);

  useEffect(() => {
    if (!data) {
      return;
    }
    let fromTrader = 0;
    if (!status) {
      fromTrader = total;
    } else {
      fromTrader = getTotal(status);
    }
    if (fromTrader === data.page.totalItems) {
      return;
    }
    refetchTrader();
  }, [data, getTotal, refetchTrader, status, total]);

  const statusOptions = baseStatusOptions.map((c) => {
    const total = getTotal(c.value);
    return {
      label: c.label,
      customLabel: {
        label: c.label,
        subLabel: total && `Total: ${total}`,
      },
      value: c.value,
    };
  });

  return (
    <div>
      <div
        className={c(
          'flex flex-col mb-20px xl:(flex-row items-center mb-10px)',
          '[&>div]:(grid grid-cols-[60px_auto] gap-y-10px items-center xl:(grid-cols-[auto_130px]))',
          '[&>div>label]:(text-12px mr-4px xl:(text-16px))',
        )}
      >
        <div>
          <label className="color-#cdcdcd">CHAIN:</label>
          <Dropdown
            defaultValue={chainOptions[0]}
            options={chainOptions}
            value={chainOptions.find((c) => c.value === chainId)}
            className="color-white uppercase"
            onChange={(item) => {
              setChainId(item.value);
              setPage(1);
            }}
          />
        </div>
        <div className="mt-12px xl:(mt-0 ml-46px)">
          <label className="color-#cdcdcd">STATUS:</label>
          <Dropdown
            defaultValue={statusOptions[1]}
            options={statusOptions}
            value={statusOptions.find((c) => c.value === status)}
            className="color-white uppercase"
            onChange={(item) => {
              setStatus(item.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      {items.length ? (
        <div className="relative">
          <div className="xl:table w-100% xl:border-spacing-y-12px">
            <div ref={headerRef} className="hidden xl:table-row [&>.table-cell]:px-17px">
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Position</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Size</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">PnL</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Net Profit</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Entry Price</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Mark Price</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Status</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Chain</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Last Updated</span>
              </div>
              <span className="w-1px"></span>
            </div>
            {items.map((item, i) => (
              <PositionItem
                key={i}
                id={item.id}
                address={undefined}
                entryPrice={item.entry}
                indexToken={item.indexToken}
                markPrice={item.mark}
                netProfit={item.netProfit}
                pnl={item.pnl}
                side={item.side}
                size={item.size}
                time={item.time}
                status={item.status}
                multipleAction={!!item.historiesCount}
                loading={isInitialLoading}
                cellClassName="xl:px-5px 2xl:px-17px"
                onClick={(id) => {
                  params.set('position_id', id);
                  setParams(params);
                }}
                chainId={item.chainId}
              />
            ))}
          </div>
          {isInitialLoading && (
            <div className="hidden xl:block absolute bottom-0 left-0 w-100%">
              <TableContentLoader
                className="h-56px mb-12px bg-#34343B b-1px b-solid b-#5E5E5E rounded-10px"
                header={headerRef.current}
                length={items.length}
                itemHeight={56}
              />
            </div>
          )}
        </div>
      ) : isInitialLoading ? (
        <div className="h-250px flex items-center justify-center">
          <div className="w-50% max-w-200px">
            <Loading />
          </div>
        </div>
      ) : (
        <div className="h-250px flex justify-center items-center">
          <NoData />
        </div>
      )}
      {pageInfo?.total > 1 && (
        <div className="flex justify-end pt-8px">
          <Pagination current={pageInfo.current} total={pageInfo.total} onChange={setPage} />
        </div>
      )}
    </div>
  );
};
