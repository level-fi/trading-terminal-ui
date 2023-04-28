import { useSearchParams } from 'react-router-dom';
import { Pagination } from '../../components/Pagination';
import { SortableTitle } from '../../components/SortableTitle';
import { useTraders } from '../../hooks/useTraders';
import { TraderItem } from './components/TraderItem';
import { useTradersConfigParsed } from './hooks/useTradersConfig';
import { TraderFilter } from './components/TraderFilter';
import { Loading } from '../../components/Loading';
import { TableContentLoader } from '../../components/TableContentLoader';
import { useRef } from 'react';

export const TraderList = () => {
  const [params, setParams] = useSearchParams();
  const config = useTradersConfigParsed();
  const { items, pageInfo, loading, silentLoad } = useTraders({
    ...config,
    duration: config.duration,
  });
  const headerRef = useRef<HTMLDivElement>();

  return (
    <div className="mx-14px xl:mx-60px my-20px pb-35px relative">
      <div className="mb-16px xl:mb-24px">
        <div className="color-white font-800 text-20px mb-16px mt-4px xl:hidden">TRADERS</div>
        <TraderFilter />
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
              <div className="table-cell px-24px">
                <label className="color-#cdcdcd">#</label>
              </div>
              <div className="table-cell px-24px">
                <label className="color-#cdcdcd">Address</label>
              </div>
              <div className="table-cell px-24px">
                <label className="color-#cdcdcd">Win/Loss</label>
              </div>
              <div className="table-cell px-24px">
                <SortableTitle
                  valueKey="volume"
                  onChange={(key, value) => {
                    params.set('sort', key);
                    params.set('order', value);
                    setParams(params);
                  }}
                  value={config.sortBy === 'volume' ? config.sortType : undefined}
                  className="color-#cdcdcd"
                >
                  Trading Volume
                </SortableTitle>
              </div>
              <div className="table-cell px-24px">
                <SortableTitle
                  valueKey="fee"
                  onChange={(key, value) => {
                    params.set('sort', key);
                    params.set('order', value);
                    setParams(params);
                  }}
                  value={config.sortBy === 'fee' ? config.sortType : undefined}
                  className="color-#cdcdcd"
                >
                  Fees Paid
                </SortableTitle>
              </div>
              <div className="table-cell px-24px">
                <SortableTitle
                  valueKey="netProfit"
                  onChange={(key, value) => {
                    params.set('sort', key);
                    params.set('order', value);
                    setParams(params);
                  }}
                  value={config.sortBy === 'netProfit' ? config.sortType : undefined}
                  className="color-#cdcdcd"
                >
                  Net Profit
                </SortableTitle>
              </div>
              <span className="table-cell px-24px w-1px"></span>
            </div>
            {items.map((item, i) => (
              <TraderItem
                key={i}
                address={item?.account}
                volume={item?.volume}
                win={item?.win}
                loss={item?.lost}
                netProfit={item?.netProfit}
                fee={item?.fee}
                rank={(pageInfo.current - 1) * config.size + i + 1}
                loading={loading && !silentLoad}
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
    </div>
  );
};
