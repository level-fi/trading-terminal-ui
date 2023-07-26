import React from 'react';
import { Side } from '../utils/type';
import { TokenSymbol } from './TokenSymbol';
import { shortenAddress } from '../utils';
import { chainLogos } from '../utils/constant';
import { getChainConfig } from '../config';
import c from 'classnames';

export interface TokenSideProps {
  symbol?: string;
  side?: Side;
  size?: 'md' | 'lg';
  address?: string;
  chainId?: number;
}
const Size = {
  md: {
    symbol: 32,
    token: 'text-16px font-700',
    side: 'text-14px',
    spacer: 'ml-10px',
  },
  xl: {
    symbol: 44,
    token: 'text-24px font-700',
    side: 'text-16px',
    spacer: 'ml-14px',
  },
};
export const TokenSide: React.FC<TokenSideProps> = ({
  address,
  side,
  symbol,
  size = 'md',
  chainId,
}) => {
  const isVertical = !!address;
  return side !== undefined ? (
    <div className="flex items-center">
      <TokenSymbol symbol={symbol} size={Size[size].symbol} />
      <div className={Size[size].spacer}>
        <div className={c('flex items-start')}>
          <div
            className={c('flex', isVertical ? 'flex-row items-end' : 'flex-col items-start')}
          >
            <div className={`color-white ${Size[size].token}`}>{symbol?.toUpperCase()}/USD</div>
            <div
              className={`text-12px ${side === Side.LONG ? 'color-win' : 'color-loss'} ${
                Size[size].side
              } ${isVertical ? 'ml-6px' : 'mt-6px'}`}
            >
              {Side[side]}
            </div>
          </div>
          {chainId && (
            <div className="text-12px font-400 flex items-center text-white bg-#D9D9D9 bg-op-10 py-4px px-8px rd-999px ml-8px -my-4px">
              {chainLogos[chainId] && (
                <img src={chainLogos[chainId]} width={14} height={14} className="mr-6px" />
              )}
              {getChainConfig(chainId).name}
            </div>
          )}
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
