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
import { useScreenSize } from '../../../../hooks/useScreenSize';
import { Dropdown } from '../../../../components/Dropdown';
interface TradeOrdersProps {
  wallet: string;
}
export const TradeOrders: React.FC<TradeOrdersProps> = ({ wallet }) => {
  const [chainId, setChainId] = useState<number>();

  const isMobile = useScreenSize('xl');
  const { items, loading } = useTradeOrders({
    wallet: wallet,
    page: 1,
    size: 999,
    chainId: chainId,
  });

  return (
    <div>
      {isMobile ? (
        <div className="table text-right text-14px w-100% [&_.table-cell]:pb-10px mb-10px">
          <div className="table-row">
            <label className="table-cell w-70px text-left color-#cdcdcd">Chain:</label>
            <div className="table-cell">
              <div className="flex justify-start w-100% -my-10px">
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
          </div>
        </div>
      ) : (
        <div className="flex flex-row mb-10px">
          <div className="flex items-center color-#cdcdcd text-14px font-700">
            <label className="color-#cdcdcd mr-6px">CHAIN:</label>
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
      {loading && !items.length ? (
        <div className="h-250px flex items-center justify-center">
          <div className="w-300px">
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
                      size={'md'}
                      symbol={item.indexToken.symbol}
                      chainId={item.chainId}
                    />
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
