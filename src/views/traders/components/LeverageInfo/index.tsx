import React, { useState } from 'react';
import { TradeOrders } from './TradeOrders';
import { TradeHistories } from './TradeHistories';
import { TradePositions } from './TradePositions';
import { PositionDetailModal } from '../../../positions/PositionDetailModal';

interface LeverageInfoProps {
  wallet: string;
}
export const LeverageInfo: React.FC<LeverageInfoProps> = ({ wallet }) => {
  const [totalPositions, setTotalPositions] = useState(0);
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div className="flex flex-col items-start xl:flex-row xl:items-center xl:justify-between">
        <label className="text-18px xl:text-20px mb-11px xl:mb-0 font-700 color-white ">
          TRADING
        </label>
        <div className="flex items-center color-#cdcdcd text-14px font-700 b-1px b-solid b-white b-op-20% h-42px rounded-10px [&>.active]:color-primary">
          <div
            onClick={() => setTab(0)}
            className={`cursor-pointer hover-op-75 px-17px py-2px ${tab == 0 && 'active'}`}
          >
            POSITIONS{totalPositions ? ` (${totalPositions})` : ''}
          </div>
          <div
            onClick={() => setTab(1)}
            className={`cursor-pointer hover-op-75 px-17px py-2px b-l-1px b-solid b-#595861 ${
              tab == 1 && 'active'
            }`}
          >
            ORDERS
          </div>
          <div
            onClick={() => setTab(2)}
            className={`cursor-pointer hover-op-75 px-17px py-2px b-l-1px b-solid b-#595861 ${
              tab == 2 && 'active'
            }`}
          >
            HISTORY
          </div>
        </div>
      </div>
      <div className="mt-12px bg-black bg-op-54 rounded-10px xl:px-23px xl:py-18px p-14px">
        {tab == 0 ? (
          <TradePositions wallet={wallet} setTotalPositions={setTotalPositions} />
        ) : tab == 1 ? (
          <TradeOrders wallet={wallet} />
        ) : (
          <TradeHistories wallet={wallet} />
        )}
      </div>
      <PositionDetailModal />
    </div>
  );
};
