import React from 'react';
import { Side } from '../utils/type';
import { TokenSymbol } from './TokenSymbol';
import { shortenAddress } from '../utils';

export interface TokenSideProps {
  symbol?: string;
  side?: Side;
  size?: 'md' | 'lg';
  address?: string;
}
const Size = {
  md: {
    symbol: 28,
    token: 'text-16px font-700',
    side: 'text-14px',
    spacer: 'ml-8px',
  },
  xl: {
    symbol: 44,
    token: 'text-24px font-700',
    side: 'text-16px',
    spacer: 'ml-13px',
  },
};
export const TokenSide: React.FC<TokenSideProps> = ({ address, side, symbol, size = 'md' }) => {
  return side !== undefined ? (
    <div className="flex items-center">
      <TokenSymbol symbol={symbol} size={Size[size].symbol} />
      <div className={Size[size].spacer}>
        <div className={`flex ${address ? 'flex-row items-end' : 'flex-col'}`}>
          <span className={`color-white ${Size[size].token}`}>{symbol?.toUpperCase()}/USD</span>
          <span
            className={`text-12px ${side === Side.LONG ? 'color-win' : 'color-loss'} ${
              Size[size].side
            } ${address ? 'ml-6px' : 'mt-6px'}`}
          >
            {Side[side]}
          </span>
        </div>
        {address && (
          <div className="text-10px color-#cdcdcd mt-6px">{shortenAddress(address)}</div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};
