import React from 'react';
import { NoData } from '../../../../components/NoData';
import { TokenSide } from '../../../../components/TokenSide';
import { formatCurrency } from '../../../../utils/numbers';
import { OrderType } from '../../../../utils/type';
import { useTradeOrders } from './hooks/useTradeOrders';
import { Loading } from '../../../../components/Loading';
import { bscConfig } from '../../../../config';
interface TradeOrdersProps {
  wallet: string;
}
export const TradeOrders: React.FC<TradeOrdersProps> = ({ wallet }) => {
  const { items, loading } = useTradeOrders(bscConfig.chainId, {
    wallet: wallet,
    page: 1,
    size: 999,
  });

  if (loading && !items.length) {
    return (
      <div className="h-250px flex items-center justify-center">
        <div className="w-300px">
          <Loading />
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="h-250px flex justify-center items-center">
        <NoData />
      </div>
    );
  }

  return (
    <div className="xl:table w-100% xl:border-spacing-y-12px">
      <div className="hidden xl:table-row [&>.table-cell]:px-17px">
        <label className="table-cell text-14px color-#cdcdcd">Order Type</label>
        <label className="table-cell text-14px color-#cdcdcd">Type</label>
        <label className="table-cell text-14px color-#cdcdcd">Order</label>
        <label className="table-cell text-14px color-#cdcdcd">Trigger Condition</label>
        <label className="table-cell text-14px color-#cdcdcd">Mark Price</label>
      </div>
      {items.map((item, i) => (
        <div
          className="xl:table-row xl:h-56px [&>.vertical-middle]:px-17px [&:hover>.vertical-middle]:bg-#5E5E5E"
          key={i}
        >
          <div className="xl:hidden bg-#34343B p-14px rounded-10px mb-12px">
            <div className="b-b-1px b-dashed b-#5E5E5E pb-10px flex justify-between">
              <TokenSide side={item.side} size={'md'} symbol={item.indexToken.symbol} />
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <label className="color-#cdcdcd">Type</label>
              <label className="color-white">{OrderType[item.type]}</label>
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <label className="color-#cdcdcd">Order</label>
              <label className="color-white">{item.action}</label>
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <label className="color-#cdcdcd">Condition</label>
              <label className="color-white">{item.triggerCondition}</label>
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <label className="color-#cdcdcd">Mark Price</label>
              <label className="color-white">{formatCurrency(item.markPrice)}</label>
            </div>
          </div>

          <div className="hidden xl:table-cell vertical-middle bg-#34343B rounded-l-10px">
            <TokenSide side={item.side} size={'md'} symbol={item.indexToken.symbol} />
          </div>
          <div className="hidden xl:table-cell vertical-middle bg-#34343B">
            <label className="color-white">{OrderType[item.type]}</label>
          </div>
          <div className="hidden xl:table-cell vertical-middle bg-#34343B">
            <label className="color-white">{item.action}</label>
          </div>
          <div className="hidden xl:table-cell vertical-middle bg-#34343B">
            <label className="color-white">{item.triggerCondition}</label>
          </div>
          <div className="hidden xl:table-cell vertical-middle bg-#34343B rounded-r-10px">
            <label className="color-white">{formatCurrency(item.markPrice)}</label>
          </div>
        </div>
      ))}
    </div>
  );
};
