import React, { useState } from 'react';
import { NoData } from '../../../../components/NoData';
import { TokenSide } from '../../../../components/TokenSide';
import { formatCurrency } from '../../../../utils/numbers';
import { OrderType } from '../../../../utils/type';
import { useTradeOrders } from './hooks/useTradeOrders';
import { Loading } from '../../../../components/Loading';
import { chainLogos } from '../../../../utils/constant';
import { chainOptions } from '../../../positions/hooks/usePositionsConfig';
import { getChainConfig } from '../../../../config';
import { Dropdown } from '../../../../components/Dropdown';
import c from 'classnames';

interface TradeOrdersProps {
  wallet: string;
}
export const TradeOrders: React.FC<TradeOrdersProps> = ({ wallet }) => {
  const [chainId, setChainId] = useState<number>();

  const { items, loading } = useTradeOrders({
    wallet: wallet,
    page: 1,
    size: 999,
    chainId: chainId,
  });

  return (
    <div>
      <div
        className={c(
          'flex flex-col mb-20px xl:(flex-row items-center mb-10px)',
          '[&>div]:(grid grid-rows-[auto_auto] gap-y-10px items-center xl:(grid-cols-[auto_130px]))',
          '[&>div>label]:(text-12px mr-4px xl:(text-16px))',
        )}
      >
        <div>
          <label className="color-#cdcdcd">CHAIN:</label>
          <Dropdown
            defaultValue={chainOptions[0]}
            options={chainOptions}
            value={chainOptions.find((c) => c.value === chainId)}
            className="color-white uppercase"
            onChange={(item) => {
              setChainId(item.value);
            }}
          />
        </div>
      </div>
      {loading && !items.length ? (
        <div className="h-250px flex items-center justify-center">
          <div className="w-50% max-w-200px">
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
            <div className="hidden xl:table-row [&>.table-cell]:px-17px">
              <label className="table-cell text-14px color-#cdcdcd">Order Type</label>
              <label className="table-cell text-14px color-#cdcdcd">Type</label>
              <label className="table-cell text-14px color-#cdcdcd">Order</label>
              <label className="table-cell text-14px color-#cdcdcd">Trigger Condition</label>
              <label className="table-cell text-14px color-#cdcdcd">Mark Price</label>
              <label className="table-cell text-14px color-#cdcdcd">Chain</label>
            </div>
            {items.map((item, i) => (
              <div
                className="xl:table-row xl:h-56px [&>.vertical-middle]:px-17px [&:hover>.vertical-middle]:bg-#5E5E5E"
                key={i}
              >
                <div className="xl:hidden bg-#34343B p-14px rounded-10px mb-12px">
                  <div className="b-b-1px b-dashed b-#5E5E5E pb-10px flex justify-between">
                    <TokenSide
                      side={item.side}
                      size={'sm'}
                      symbol={item.indexToken.symbol}
                      chainId={item.chainId}
                    />
                  </div>
                  <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
                    <label className="color-#cdcdcd">Type</label>
                    <label className="color-white">{OrderType[item.type]}</label>
                  </div>
                  <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
                    <label className="color-#cdcdcd">Order</label>
                    <label className="color-white">{item.action}</label>
                  </div>
                  <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
                    <label className="color-#cdcdcd">Condition</label>
                    <label className="color-white">{item.triggerCondition}</label>
                  </div>
                  <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
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
                <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                  <label className="color-white">{formatCurrency(item.markPrice)}</label>
                </div>
                <div className="hidden xl:table-cell vertical-middle bg-#34343B rounded-r-10px">
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
