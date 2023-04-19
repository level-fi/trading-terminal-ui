import React, { useMemo, useRef, useState } from 'react';
import { TradeHistoriesFilter } from './TradeHistoriesFilter';
import { UseTradeHistoriesConfig, useTradeHistories } from './hooks/useTradeHistories';
import { NoData } from '../../../../components/NoData';
import { TokenSide } from '../../../../components/TokenSide';
import { ReactComponent as IconExplorer } from '../../../../assets/icons/ic-explorer.svg';
import { config as chainConfig } from '../../../../config';
import { UseLeverageMessageConfig, useLeverageMessage } from '../../../../hooks/useMessage';
import { SeekPagination } from '../../../../components/SeekPagination';
import { Loading } from '../../../../components/Loading';
import { unixToDate } from '../../../../utils';
import { TableContentLoader } from '../../../../components/TableContentLoader';

interface TradeHistoriesProps {
  wallet: string;
}
const Action: React.FC<UseLeverageMessageConfig> = (config) => {
  const message = useLeverageMessage(config);
  return <>{message}</>;
};
export const TradeHistories = ({ wallet }: TradeHistoriesProps) => {
  const [page, setPage] = useState(1);
  const [dateStart, setDateStart] = useState<Date>();
  const [dateEnd, setDateEnd] = useState<Date>();
  const [timeFilter, setTimeFilter] = useState<number>();
  const headerRef = useRef<HTMLDivElement>();

  const config = useMemo<UseTradeHistoriesConfig>(() => {
    const now = Date.now();
    if (timeFilter) {
      return {
        end: now,
        start: now - timeFilter * 86400000,
        page: page,
        size: 10,
        wallet: wallet,
      };
    }
    return {
      end: dateEnd?.getTime() || now,
      start: dateStart?.getTime() || 0,
      page: page,
      size: 10,
      wallet: wallet,
    };
  }, [dateEnd, dateStart, page, timeFilter, wallet]);
  const { items, loading, hasNext, loadedPage } = useTradeHistories(config);

  return (
    <div>
      <TradeHistoriesFilter
        dateStart={dateStart}
        dateEnd={dateEnd}
        timeFilter={timeFilter}
        onUpdateDateStart={(value) => {
          setTimeFilter(undefined);
          setDateStart(value);
          setPage(1);
        }}
        onUpdateDateEnd={(value) => {
          setTimeFilter(undefined);
          setDateEnd(value);
          setPage(1);
        }}
        onUpdateTimeFilter={(value) => {
          setDateStart(undefined);
          setDateEnd(undefined);
          setTimeFilter(value);
          setPage(1);
        }}
        onRefresh={() => {
          setDateStart(undefined);
          setDateEnd(undefined);
          setTimeFilter(undefined);
          setPage(1);
        }}
      />
      {!items.length && !loading ? (
        <div className="h-250px flex justify-center items-center">
          <NoData />
        </div>
      ) : loading && !items.length ? (
        <div className="h-250px flex items-center justify-center">
          <div className="w-300px">
            <Loading />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="lg:table w-100% lg:border-spacing-y-12px mt-14px lg:mt-0">
            <div ref={headerRef} className="hidden lg:table-row [&>.table-cell]:px-17px">
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Action Time</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Market</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Action</label>
              </div>
              <span className="table-cell"></span>
            </div>
            {items.map((item, i) => (
              <a
                href={`${chainConfig.baseExplorer}/tx/${item.transactionHash}`}
                target="_blank"
                className="lg:table-row lg:h-56px [&>.vertical-middle]:px-14px cursor-pointer no-underline [&:hover>.vertical-middle]:bg-#5E5E5E [&:hover_svg_path]:fill-primary"
                key={i}
              >
                <div className="lg:hidden p-14px rounded-10px mb-12px bg-#34343B">
                  <div className="b-b-1px b-dashed b-#5E5E5E pb-10px flex justify-between items-center">
                    <TokenSide side={item.side} size={'md'} symbol={item.indexToken.symbol} />
                    <a
                      href={`${chainConfig.baseExplorer}/tx/${item.transactionHash}`}
                      target="_blank"
                      className="[&:hover_svg_path]:fill-primary"
                    >
                      <IconExplorer height={16} width={16} />
                    </a>
                  </div>
                  <div className="flex justify-between text-14px mt-14px">
                    <span className="color-white leading-22px">
                      <Action {...item.messageConfig} />
                    </span>
                  </div>
                  <div className="flex justify-between text-14px mt-14px">
                    <span className="color-#cdcdcd">{unixToDate(item.time)}</span>
                  </div>
                </div>
                <div className="hidden lg:table-cell vertical-middle bg-#34343B rounded-l-10px">
                  <span className="color-white">{unixToDate(item.time)}</span>
                </div>
                <div className="hidden lg:table-cell vertical-middle bg-#34343B">
                  <TokenSide side={item.side} size={'md'} symbol={item.indexToken.symbol} />
                </div>
                <div className="hidden lg:table-cell vertical-middle bg-#34343B">
                  <span className="color-white">
                    <Action {...item.messageConfig} />
                  </span>
                </div>
                <span className="hidden lg:table-cell vertical-middle bg-#34343B rounded-r-10px w-1%">
                  <IconExplorer />
                </span>
              </a>
            ))}
          </div>
          {loading && !!items.length && (
            <div className="hidden lg:block absolute bottom-0 left-0 w-100%">
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
      <div className="flex justify-end pt-8px">
        <SeekPagination current={loadedPage} hasNext={hasNext} onChange={setPage} />
      </div>
    </div>
  );
};
