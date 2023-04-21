import React from 'react';
import { SwapHistories } from './SwapHistories';

interface SwapInfoProps {
  wallet: string;
}
export const SwapInfo: React.FC<SwapInfoProps> = ({ wallet }) => {
  return (
    <div>
      <div className="flex flex-col items-start xl:flex-row xl:items-center xl:justify-between">
        <label className="text-18px xl:text-20px mb-11px xl:mb-0 font-700 color-white ">
          SWAP
        </label>
      </div>
      <div className="mt-12px bg-black bg-op-54 rounded-10px xl:px-23px xl:py-18px p-14px">
        <SwapHistories wallet={wallet} />
      </div>
    </div>
  );
};
