import { BigNumber } from 'ethers';
import { VALUE_DECIMALS } from '../../../../../config';
import { formatBigNumber, formatNumberWithThreshold } from '../../../../../utils/numbers';
import { ChainConfigToken } from '../../../../../utils/type';
import React from 'react';

interface SwapPriceProps {
  tokenIn: ChainConfigToken;
  tokenOut: ChainConfigToken;
  price: BigNumber | number;
  priceDirection: string;
}
export const SwapPrice: React.FC<SwapPriceProps> = ({
  tokenIn,
  tokenOut,
  price,
  priceDirection,
}) => {
  return (
    <label className="color-white">
      1 <label className="text-14px color-#adadab">{tokenIn?.symbol}</label> {priceDirection}{' '}
      {typeof price === 'number'
        ? formatNumberWithThreshold(
            price,
            {
              fractionDigits: 6,
            },
            tokenOut?.threshold,
          )
        : formatBigNumber(
            price,
            VALUE_DECIMALS - tokenOut?.decimals,
            { fractionDigits: 6 },
            tokenOut?.threshold,
          )}{' '}
      <label className="text-14px color-#adadab">{tokenOut?.symbol}</label>
    </label>
  );
};
