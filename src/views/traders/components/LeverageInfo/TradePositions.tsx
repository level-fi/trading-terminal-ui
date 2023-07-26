import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NoData } from '../../../../components/NoData';
import { Loading } from '../../../../components/Loading';
import { PositionItem } from '../../../positions/components/PositionItem';
import { TableContentLoader } from '../../../../components/TableContentLoader';
import { PositionListItemResponse, PositionStatus } from '../../../../utils/type';
import { Pagination } from '../../../../components/Pagination';
import { chainOptions, statusOptions } from '../../../positions/hooks/usePositionsConfig';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryPositions } from '../../../../utils/queries';
import { chainLogos } from '../../../../utils/constant';
import { useScreenSize } from '../../../../hooks/useScreenSize';
import { Dropdown } from '../../../../components/Dropdown';

interface TradePositionsProps {
  wallet: string;
  totalOpen: number;
  totalClosed: number;
  totalLiquidated: number;
  setTotalPositions: (value: number) => void;
}
export const TradePositions: React.FC<TradePositionsProps> = ({
  wallet,
  totalOpen,
  totalClosed,
  totalLiquidated,
  setTotalPositions,
}) => {
  const [params, setParams] = useSearchParams();
  const headerRef = useRef<HTMLDivElement>();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PositionStatus>();
  const [chainId, setChainId] = useState<number>();
  const [response, setResponse] = useState<PositionListItemResponse>();
  const isMobile = useScreenSize('xl');

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
          total = totalClosed;
          break;
        case PositionStatus.LIQUIDATED:
          total = totalLiquidated;
          break;
      }
      if (!total) {
        return;
      }
      return ` (${total})`;
    },
    [totalClosed, totalLiquidated, totalOpen],
  );

  return (
    <div>
      {isMobile ? (
        <div className="table text-right text-14px w-100% [&_.table-cell]:pb-10px mb-10px">
          <div className="table-row">
            <label className="table-cell text-left color-#cdcdcd mr-6px whitespace-nowrap pr-14px">
              Status:
            </label>
            <div className="table-cell w-100%">
              <div className="flex justify-start w-100% -my-10px">
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
          </div>
          <div className="table-row">
            <label className="table-cell text-left color-#cdcdcd mr-6px">Chain:</label>
            <div className="table-cell">
              <div className="flex justify-start w-100% -my-10px">
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
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-between mb-10px">
          <div className="flex items-center color-#cdcdcd text-14px font-700">
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
                    setPage(1);
                  }}
                >
                  {label}
                  {getTotalInfo(value)}
                </div>
              );
            })}
          </div>
          <div className="flex items-center color-#cdcdcd text-14px font-700">
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
                    setPage(1);
                  }}
                >
                  {chainLogos[value] && (
                    <img className="mr-10px" src={chainLogos[value]} width={16} height={16} />
                  )}
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {items.length ? (
        <div className="relative">
          <div className="xl:table w-100% xl:border-spacing-y-12px">
            <div ref={headerRef} className="hidden xl:table-row [&>.table-cell]:px-17px">
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Position</span>
              </div>
              <div className="table-cell ">
                <span className="text-14px color-#cdcdcd">Chain</span>
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
          <div className="w-300px">
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
