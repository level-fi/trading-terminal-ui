import { ChainConfigToken } from '../../../../../utils/type';
import React from 'react';
import { TokenSymbol } from '../../../../../components/TokenSymbol';
import { formatNumberWithThreshold } from '../../../../../utils/numbers';

interface SwapAmountProps {
  token: ChainConfigToken;
  size: number;
  amount: number;
}
export const SwapAmount: React.FC<SwapAmountProps> = ({ amount, size, token }) => {
  return (
    <div className="flex items-center">
      <TokenSymbol symbol={token?.symbol} size={size} />
      <label className="color-white ml-8px">
        {formatNumberWithThreshold(
          amount,
          {
            fractionDigits: token?.fractionDigits,
          },
          token?.threshold,
        )}
        <label className="text-14px color-#adadab ml-8px">{token?.symbol}</label>
      </label>
    </div>
  );
};
