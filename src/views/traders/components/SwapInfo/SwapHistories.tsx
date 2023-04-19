import React, { useRef } from 'react';
import { usePagination } from '../../../../hooks/usePagination';
import { useSwapHistories } from './hooks/useSwapHistories';
import { NoData } from '../../../../components/NoData';
import { SeekPagination } from '../../../../components/SeekPagination';
import { ReactComponent as IconExplorer } from '../../../../assets/icons/ic-explorer.svg';
import { VALUE_DECIMALS, config as chainConfig } from '../../../../config';
import { OrderType } from '../../../../utils/type';
import { utils } from 'ethers';
import { Loading } from '../../../../components/Loading';
import { SwapPrice } from './components/SwapPrice';
import { SwapAmount } from './components/SwapAmount';
import { unixToDate } from '../../../../utils';
import { TableContentLoader } from '../../../../components/TableContentLoader';

interface SwapHistoriesProps {
  wallet: string;
}
export const SwapHistories: React.FC<SwapHistoriesProps> = ({ wallet }) => {
  const headerRef = useRef<HTMLDivElement>();
  const config = usePagination({
    pageKey: 'sw_page',
    sizeKey: 'sw_size',
  });
  const { items, loading, hasNext } = useSwapHistories({
    page: config.page,
    size: config.size,
    wallet: wallet,
  });

  if (!items.length && !loading) {
    return (
      <div className="h-250px flex justify-center items-center">
        <NoData />
      </div>
    );
  }

  if (loading && !items.length) {
    return (
      <div className="h-250px flex items-center justify-center">
        <div className="w-300px">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <div className="lg:table w-100% lg:border-spacing-y-12px">
          <div ref={headerRef} className="hidden lg:table-row [&>.table-cell]:px-17px">
            <div className="table-cell">
              <label className="text-14px color-#cdcdcd">Time</label>
            </div>
            <div className="table-cell">
              <label className="text-14px color-#cdcdcd">Type</label>
            </div>
            <div className="table-cell">
              <label className="text-14px color-#cdcdcd">From</label>
            </div>
            <div className="table-cell">
              <label className="text-14px color-#cdcdcd">To</label>
            </div>
            <div className="table-cell">
              <label className="text-14px color-#cdcdcd">Price</label>
            </div>
            <span></span>
          </div>
          {items.map((item, i) => (
            <div
              className="lg:table-row lg:h-56px [&>.vertical-middle]:px-15px [&>.vertical-middle]:py-12px no-underline [&:hover>.vertical-middle]:bg-#5E5E5E"
              key={i}
            >
              <div className="lg:hidden bg-#34343B p-14px rounded-10px mb-12px">
                <div className="flex justify-between text-14px">
                  <span className="color-#cdcdcd">Type</span>
                  <span className="color-white">{OrderType[item.type]}</span>
                </div>
                <div className="flex justify-between items-center text-14px mt-14px">
                  <span className="color-#cdcdcd">From</span>
                  <div className="-my-3px">
                    <SwapAmount amount={item.amountIn} size={20} token={item.tokenIn} />
                  </div>
                </div>
                <div className="flex justify-between items-center text-14px mt-14px">
                  <span className="color-#cdcdcd">To (Min receive)</span>
                  <div className="-my-3px">
                    <SwapAmount amount={item.amountOut} size={20} token={item.tokenOut} />
                  </div>
                </div>
                <div className="flex justify-between text-14px mt-14px">
                  <span className="color-#cdcdcd">Price</span>
                  <SwapPrice
                    tokenIn={item.tokenIn}
                    tokenOut={item.tokenOut}
                    price={item.amountOut
                      .mul(utils.parseUnits('1', VALUE_DECIMALS))
                      .div(item.amountIn)
                      .div(utils.parseUnits('1', item.tokenOut.decimals))}
                    priceDirection="="
                  />
                </div>
                <div className="flex justify-between text-14px mt-14px">
                  <span className="color-#cdcdcd">Time</span>
                  <span className="color-white">{unixToDate(item.time)}</span>
                </div>
                <div className="mt-16px pt-14px b-t-1px b-dashed b-#5E5E5E">
                  <a
                    href={`${chainConfig.baseExplorer}/tx/${item.transactionHash}`}
                    target="_blank"
                    rel="noreferer"
                    className="[&:hover_svg_path]:fill-primary color-#ADABAB no-underline flex justify-end text-14px"
                  >
                    View
                    <IconExplorer className="ml-8px" />
                  </a>
                </div>
              </div>

              <div className="hidden lg:table-cell vertical-middle bg-#34343B rounded-l-10px">
                <span className="color-white">{unixToDate(item.time)}</span>
              </div>
              <div className="hidden lg:table-cell vertical-middle bg-#34343B">
                <span className="color-white">{OrderType[item.type]}</span>
              </div>
              <div className="hidden lg:table-cell vertical-middle bg-#34343B">
                <SwapAmount size={32} token={item.tokenIn} amount={item.amountIn} />
              </div>
              <div className="hidden lg:table-cell vertical-middle bg-#34343B">
                <SwapAmount size={32} token={item.tokenOut} amount={item.amountOut} />
              </div>
              <div className="hidden lg:table-cell vertical-middle bg-#34343B">
                <SwapPrice
                  tokenIn={item.tokenIn}
                  tokenOut={item.tokenOut}
                  price={item.amountOut
                    .mul(utils.parseUnits('1', VALUE_DECIMALS))
                    .div(item.amountIn)
                    .div(utils.parseUnits('1', item.tokenOut.decimals))}
                  priceDirection="="
                />
              </div>
              <span className="hidden lg:table-cell vertical-middle bg-#34343B rounded-r-10px w-1%">
                <IconExplorer />
              </span>
            </div>
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
      <div className="flex justify-end pt-8px">
        <SeekPagination current={config.page} hasNext={hasNext} onChange={config.setPage} />
      </div>
    </div>
  );
};
