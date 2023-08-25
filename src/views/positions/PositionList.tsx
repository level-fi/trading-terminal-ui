import { useSearchParams } from 'react-router-dom';
import { Pagination } from '../../components/Pagination';
import { SortableTitle } from '../../components/SortableTitle';
import { PositionFilter } from './components/PositionFilter';
import { usePositionsConfigParsed } from './hooks/usePositionsConfig';
import { Loading } from '../../components/Loading';
import { PositionItem } from './components/PositionItem';
import { PositionListItemResponse } from '../../utils/type';
import { useEffect, useRef, useState } from 'react';
import { TableContentLoader } from '../../components/TableContentLoader';
import { PositionDetailModal } from './PositionDetailModal';
import { useQuery } from '@tanstack/react-query';
import { queryPositions } from '../../utils/queries';

export const PositionList = () => {
  const [params, setParams] = useSearchParams();
  const { config, setPage } = usePositionsConfigParsed();
  const [response, setResponse] = useState<PositionListItemResponse>();
  const { data, isInitialLoading } = useQuery(queryPositions(config));
  const headerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (isInitialLoading) {
      return;
    }
    setResponse(data);
  }, [data, isInitialLoading]);
  const items = response ? response.data : [];
  const pageInfo = response ? response.page : undefined;

  return (
    <div className="px-14px py-15px md:(px-30px py-25px) relative">
      <div className="mb-24px flex flex-col xl:(mb-24px flex-row items-center justify-between)">
        <div className="color-white font-800 text-20px mb-12px xl:(text-28px mb-0)">
          POSITIONS
        </div>
        <PositionFilter />
      </div>
      {isInitialLoading && !items.length ? (
        <div className="flex items-center justify-center">
          <div className="w-50% max-w-200px my-50px">
            <Loading />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="xl:table w-100% xl:border-spacing-y-12px">
            <div
              ref={headerRef}
              className={`hidden xl:table-row [&>*]:(table-cell) xl:([&>*]:px-17px)`}
            >
              <div>
                <label className="color-#cdcdcd">Position</label>
              </div>
              <div>
                <SortableTitle
                  valueKey="size"
                  onChange={(key, value) => {
                    params.set('sort', key);
                    params.set('order', value);
                    setParams(params);
                  }}
                  value={config.sortBy === 'size' ? config.sortType : undefined}
                  className="color-#cdcdcd"
                >
                  Size
                </SortableTitle>
              </div>
              <div>
                <SortableTitle
                  valueKey="pnl"
                  onChange={(key, value) => {
                    params.set('sort', key);
                    params.set('order', value);
                    setParams(params);
                  }}
                  value={config.sortBy === 'pnl' ? config.sortType : undefined}
                  className="color-#cdcdcd"
                >
                  PnL
                </SortableTitle>
              </div>
              <div>
                <SortableTitle
                  valueKey="netProfit"
                  onChange={(key, value) => {
                    params.set('sort', key);
                    params.set('order', value);
                    setParams(params);
                  }}
                  value={config.sortBy === 'netProfit' ? config.sortType : undefined}
                  className="color-#cdcdcd whitespace-nowrap"
                >
                  Net Profit
                </SortableTitle>
              </div>
              <div>
                <label className="color-#cdcdcd whitespace-nowrap">Entry Price</label>
              </div>
              <div>
                <label className="color-#cdcdcd whitespace-nowrap">Mark Price</label>
              </div>
              <div>
                <label className="color-#cdcdcd">Status</label>
              </div>
              <div>
                <label className="color-#cdcdcd">Chain</label>
              </div>
              <div>
                <SortableTitle
                  valueKey="time"
                  onChange={(key, value) => {
                    params.set('sort', key);
                    params.set('order', value);
                    setParams(params);
                  }}
                  value={config.sortBy === 'time' ? config.sortType : undefined}
                  className="color-#cdcdcd whitespace-nowrap"
                >
                  Last Updated
                </SortableTitle>
              </div>
              <span className="w-1px"></span>
            </div>
            {items.map((item, i) => (
              <PositionItem
                key={i}
                id={item.id}
                address={item.account}
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
                chainId={item.chainId}
                loading={isInitialLoading}
                cellClassName="xl:px-17px"
                onClick={(id) => {
                  params.set('position_id', id);
                  setParams(params);
                }}
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
        <div className="flex justify-center pt-8px">
          <Pagination current={pageInfo.current} total={pageInfo.total} onChange={setPage} />
        </div>
      )}
      <PositionDetailModal />
    </div>
  );
};
