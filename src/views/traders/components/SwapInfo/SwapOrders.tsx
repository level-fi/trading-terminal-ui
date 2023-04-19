import React from 'react';
import { NoData } from '../../../../components/NoData';
import { useSwapOrders } from './hooks/useSwapOrders';
import { Loading } from '../../../../components/Loading';
import { SwapAmount } from './components/SwapAmount';
import { SwapPrice } from './components/SwapPrice';
interface SwapOrdersProps {
  wallet: string;
}
export const SwapOrders: React.FC<SwapOrdersProps> = ({ wallet }) => {
  const { items, loading, silentLoad } = useSwapOrders({ wallet });

  if (!items.length && (!loading || silentLoad)) {
    return (
      <div className="h-250px flex justify-center items-center">
        <NoData />
      </div>
    );
  }

  if (loading && !silentLoad && !items.length) {
    return (
      <div className="h-250px flex items-center justify-center">
        <div className="w-300px">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:table w-100% lg:border-spacing-y-12px">
      <div className="hidden lg:table-row [&>.table-cell]:px-17px">
        <label className="table-cell text-14px color-#cdcdcd">From</label>
        <label className="table-cell text-14px color-#cdcdcd">To (Min receive)</label>
        <label className="table-cell text-14px color-#cdcdcd">Trigger Price</label>
        <label className="table-cell text-14px color-#cdcdcd">Mark Price</label>
      </div>
      {items.map((item, i) => (
        <div
          className="lg:table-row [&>.vertical-middle]:px-15px [&>.vertical-middle]:py-12px"
          key={i}
        >
          <div className="lg:hidden bg-#34343B p-14px rounded-10px mb-12px">
            <div className="flex justify-between items-center text-14px">
              <label className="color-#cdcdcd">From</label>
              <div className="-my-3px">
                <SwapAmount amount={item.amountIn} size={20} token={item.tokenIn} />
              </div>
            </div>
            <div className="flex justify-between items-center text-14px mt-14px">
              <label className="color-#cdcdcd">To (Min receive)</label>
              <div className="-my-3px">
                <SwapAmount amount={item.minAmountOut} size={20} token={item.tokenOut} />
              </div>
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <label className="color-#cdcdcd">Trigger Price</label>
              <SwapPrice
                tokenIn={item.tokenIn}
                tokenOut={item.tokenOut}
                price={item.price}
                priceDirection="≥"
              />
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <label className="color-#cdcdcd">Mark Price</label>
              <SwapPrice
                tokenIn={item.tokenIn}
                tokenOut={item.tokenOut}
                price={item.markPrice}
                priceDirection="="
              />
            </div>
          </div>

          <div className="hidden lg:table-cell vertical-middle bg-#34343B rounded-l-10px">
            <SwapAmount amount={item.amountIn} size={32} token={item.tokenIn} />
          </div>
          <div className="hidden lg:table-cell vertical-middle bg-#34343B">
            <SwapAmount amount={item.minAmountOut} size={32} token={item.tokenOut} />
          </div>
          <div className="hidden lg:table-cell vertical-middle bg-#34343B">
            <SwapPrice
              tokenIn={item.tokenIn}
              tokenOut={item.tokenOut}
              price={item.price}
              priceDirection="≥"
            />
          </div>
          <div className="hidden lg:table-cell vertical-middle bg-#34343B rounded-r-10px">
            <SwapPrice
              tokenIn={item.tokenIn}
              tokenOut={item.tokenOut}
              price={item.markPrice}
              priceDirection="="
            />
          </div>
        </div>
      ))}
    </div>
  );
};
