import React, { useMemo, useRef, useState } from 'react';
import { TradeHistoriesFilter } from './TradeHistoriesFilter';
import { useTradeHistories } from './hooks/useTradeHistories';
import { NoData } from '../../../../components/NoData';
import { TokenSide } from '../../../../components/TokenSide';
import { ReactComponent as IconExplorer } from '../../../../assets/icons/ic-explorer.svg';
import { useLeverageMessage } from '../../../../hooks/useMessage';
import { Loading } from '../../../../components/Loading';
import { unixToDate } from '../../../../utils';
import { TableContentLoader } from '../../../../components/TableContentLoader';
import { QueryTradeHistoriesConfig, UseLeverageMessageConfig } from '../../../../utils/type';
import { Pagination } from '../../../../components/Pagination';
import { getChainConfig } from '../../../../config';
import { chainLogos } from '../../../../utils/constant';

interface TradeHistoriesProps {
  wallet: string;
}
const Action: React.FC<UseLeverageMessageConfig> = (config) => {
  const message = useLeverageMessage(config);
  return <>{message}</>;
};
export const TradeHistories = ({ wallet }: TradeHistoriesProps) => {
  const [chainId, setChainId] = useState<number>();
  const [page, setPage] = useState(1);
  const [dateStart, setDateStart] = useState<Date>();
  const [dateEnd, setDateEnd] = useState<Date>();
  const [timeFilter, setTimeFilter] = useState<number>();
  const headerRef = useRef<HTMLDivElement>();

  const config = useMemo<QueryTradeHistoriesConfig>(() => {
    const now = Date.now();
    if (timeFilter) {
      return {
        end: now,
        start: now - timeFilter * 86400000,
        page: page,
        size: 10,
        wallet: wallet,
        chainId: chainId,
      };
    }
    return {
      end: dateEnd?.getTime() || now,
      start: dateStart?.getTime() || 0,
      page: page,
      size: 10,
      wallet: wallet,
      chainId: chainId,
    };
  }, [chainId, dateEnd, dateStart, page, timeFilter, wallet]);
  const { items, loading, pageInfo } = useTradeHistories(config);

  return (
    <div>
      <div className="mb-10px">
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
          chainId={chainId}
          onUpdateChainId={(value) => {
            setDateStart(undefined);
            setDateEnd(undefined);
            setTimeFilter(undefined);
            setChainId(value);
            setPage(1);
          }}
        />
      </div>
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
          <div className="xl:table w-100% xl:border-spacing-y-12px">
            <div ref={headerRef} className="hidden xl:table-row [&>.table-cell]:px-17px">
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Action Time</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Market</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Chain</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Action</label>
              </div>
              <span className="table-cell"></span>
            </div>
            {items.map((item, i) => {
              const chainConfig = getChainConfig(item.chainId);
              return (
                <a
                  href={`${chainConfig.baseExplorer}/tx/${item.transactionHash}`}
                  target="_blank"
                  className="xl:table-row xl:h-56px [&>.vertical-middle]:px-14px cursor-pointer no-underline [&:hover>.vertical-middle]:bg-#5E5E5E [&:hover_svg_path]:fill-primary"
                  key={i}
                >
                  <div className="xl:hidden p-14px rounded-10px mb-12px bg-#34343B">
                    <div className="b-b-1px b-dashed b-#5E5E5E pb-10px flex justify-between items-center">
                      <TokenSide
                        side={item.side}
                        size={'md'}
                        symbol={item.indexToken.symbol}
                        chainId={item.chainId}
                      />
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
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B rounded-l-10px">
                    <span className="color-white">{unixToDate(item.time)}</span>
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <TokenSide side={item.side} size={'md'} symbol={item.indexToken.symbol} />
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <div className="flex items-center">
                      <img
                        src={chainLogos[item.chainId]}
                        width={18}
                        height={18}
                        className="mr-10px"
                      />
                      <span className="color-white whitespace-nowrap">
                        {getChainConfig(item.chainId).name}
                      </span>
                    </div>
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <span className="color-white">
                      <Action {...item.messageConfig} />
                    </span>
                  </div>
                  <span className="hidden xl:table-cell vertical-middle bg-#34343B rounded-r-10px w-1%">
                    <IconExplorer />
                  </span>
                </a>
              );
            })}
          </div>
          {loading && !!items.length && (
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
