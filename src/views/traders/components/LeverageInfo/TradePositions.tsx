import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NoData } from '../../../../components/NoData';
import { Loading } from '../../../../components/Loading';
import { PositionItem } from '../../../positions/components/PositionItem';
import { TableContentLoader } from '../../../../components/TableContentLoader';
import { PositionStatus } from '../../../../utils/type';
import { Pagination } from '../../../../components/Pagination';
import { chainOptions, statusOptions } from '../../../positions/hooks/usePositionsConfig';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryPositions } from '../../../../utils/queries';
import { chainLogos } from '../../../../utils/constant';

interface TradePositionsProps {
  wallet: string;
  totalOpen: number;
  totalClosed: number;
  setTotalPositions: (value: number) => void;
}
export const TradePositions: React.FC<TradePositionsProps> = ({
  wallet,
  totalOpen,
  totalClosed,
  setTotalPositions,
}) => {
  const [params, setParams] = useSearchParams();
  const headerRef = useRef<HTMLDivElement>();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PositionStatus>();
  const [chainId, setChainId] = useState<number>();
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
  const items = data ? data.data : [];
  const pageInfo = data ? data.page : undefined;

  useEffect(() => {
    setTotalPositions(data?.page?.totalItems);
  }, [data?.page?.totalItems, setTotalPositions]);

  const getTotalInfo = useCallback(
    (status?: PositionStatus) => {
      let total;
      switch (status) {
        case PositionStatus.OPEN:
          total = totalOpen;
          break;
        case PositionStatus.CLOSE:
        case PositionStatus.LIQUIDATED:
          total = totalClosed;
          break;
      }
      if (!total) {
        return;
      }
      return ` (${total})`;
    },
    [totalClosed, totalOpen],
  );

  return (
    <div>
      <div className="flex flex-col xl:(flex-row justify-between)">
        <div className="flex mb-12px xl:mb-0 w-100% xl:w-auto items-center color-#cdcdcd text-14px font-700">
          {statusOptions.map(({ label, value }, i) => {
            const active = value === status;
            const color = active ? 'color-black' : 'color-white';
            const bg = active ? 'bg-primary' : 'bg-#d9d9d9 bg-opacity-10';
            return (
              <div
                key={i}
                className={`${color} ${bg} uppercase text-12px px-14px min-w-82px h-32px mx-5px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
                onClick={() => {
                  setStatus(value);
                }}
              >
                {label}
                {getTotalInfo(value)}
              </div>
            );
          })}
        </div>
        <div className="flex mb-12px xl:mb-0 w-100% xl:w-auto items-center color-#cdcdcd text-14px font-700">
          {chainOptions.map(({ label, value }, i) => {
            const active = value === chainId;
            const color = active ? 'color-black' : 'color-white';
            const bg = active ? 'bg-primary' : 'bg-#d9d9d9 bg-opacity-10';
            return (
              <div
                key={i}
                className={`${color} ${bg} uppercase text-12px px-14px min-w-82px h-32px mx-5px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
                onClick={() => {
                  setChainId(value);
                }}
              >
                {chainLogos[value] && (
                  <img className="mr-6px" src={chainLogos[value]} width={12} height={12} />
                )}
                {label}
              </div>
            );
          })}
        </div>
      </div>
      {isInitialLoading && !items.length ? (
        <div className="h-250px flex items-center justify-center">
          <div className="w-300px">
            <Loading />
          </div>
        </div>
      ) : !items.length ? (
        <div className="h-250px flex justify-center items-center">
          <NoData />
        </div>
      ) : (
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
                closed={item.status !== PositionStatus.OPEN}
                multipleAction={!!item.historiesCount}
                loading={isInitialLoading}
                cellClassName="px-17px"
                onClick={(id) => {
                  params.set('position_id', id);
                  setParams(params);
                }}
                chainId={item.chainId}
              />
            ))}
          </div>
          {isInitialLoading && !!items.length && (
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
      )}
      {pageInfo?.total > 1 && (
        <div className="flex justify-end pt-8px">
          <Pagination current={pageInfo.current} total={pageInfo.total} onChange={setPage} />
        </div>
      )}
    </div>
  );
};
