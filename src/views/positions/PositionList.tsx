import { useSearchParams } from 'react-router-dom';
import { Pagination } from '../../components/Pagination';
import { SortableTitle } from '../../components/SortableTitle';
import { usePositions } from '../../hooks/usePositions';
import { PositionFilter } from './components/PositionFilter';
import { usePositionsConfigParsed } from './hooks/usePositionsConfig';
import { Loading } from '../../components/Loading';
import { PositionItem } from './components/PositionItem';
import { PositionStatus } from '../../utils/type';
import { useRef } from 'react';
import { TableContentLoader } from '../../components/TableContentLoader';
import { PositionDetailModal } from './PositionDetailModal';

export const PositionList = () => {
  const [params, setParams] = useSearchParams();
  const config = usePositionsConfigParsed();
  const { items, pageInfo, loading, silentLoad } = usePositions(config);
  const headerRef = useRef<HTMLDivElement>();

  return (
    <div className="mx-14px xl:mx-60px my-20px pb-35px">
      <div className="mb-24px">
        <PositionFilter />
      </div>
      {loading && !silentLoad && !items.length ? (
        <div className="flex items-center justify-center">
          <div className="w-300px my-50px">
            <Loading />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="xl:table w-100% xl:border-spacing-y-12px">
            <div ref={headerRef} className={`hidden xl:table-row`}>
              <div className="table-cell 2xl:px-24px xl:px-17px">
                <label className="color-#cdcdcd">Position</label>
              </div>
              <div className="table-cell 2xl:px-24px xl:px-17px">
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
              <div className="table-cell 2xl:px-24px xl:px-17px">
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
              <div className="table-cell 2xl:px-24px xl:px-17px">
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
              <div className="table-cell 2xl:px-24px xl:px-17px">
                <label className="color-#cdcdcd whitespace-nowrap">Entry Price</label>
              </div>
              <div className="table-cell 2xl:px-24px xl:px-17px">
                <label className="color-#cdcdcd whitespace-nowrap">Mark Price</label>
              </div>
              <div className="table-cell 2xl:px-24px xl:px-17px">
                <label className="color-#cdcdcd">Status</label>
              </div>
              <div className="table-cell 2xl:px-24px xl:px-17px">
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
              <span className="table-cell 2xl:px-24px xl:px-17px w-1px"></span>
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
                closed={item.status !== PositionStatus.OPEN}
                multipleAction={!!item.historiesCount}
                loading={loading && !silentLoad}
                cellClassName="2xl:px-24px xl:px-17px"
                onClick={(id) => {
                  params.set('position_id', id);
                  setParams(params);
                }}
              />
            ))}
          </div>
          {loading && !silentLoad && !!items.length && (
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
          <Pagination
            current={pageInfo.current}
            total={pageInfo.total}
            onChange={config.setPage}
          />
        </div>
      )}
      <PositionDetailModal />
    </div>
  );
};
