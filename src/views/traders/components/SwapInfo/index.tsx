import React from 'react';
import { SwapHistories } from './SwapHistories';

interface SwapInfoProps {
  wallet: string;
}
export const SwapInfo: React.FC<SwapInfoProps> = ({ wallet }) => {
  return (
    <div>
      <div className="flex flex-col items-start lg:flex-row lg:items-center lg:justify-between">
        <label className="text-18px lg:text-20px mb-11px lg:mb-0 font-700 color-white ">
          SWAP
        </label>
      </div>
      <div className="mt-12px bg-black bg-op-54 rounded-10px lg:px-23px lg:py-18px p-14px">
        <SwapHistories wallet={wallet} />
      </div>
    </div>
  );
};
