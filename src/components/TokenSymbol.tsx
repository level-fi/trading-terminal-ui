import BTC from '../assets/tokens/BTC.png';
import ETH from '../assets/tokens/ETH.png';
import BNB from '../assets/tokens/BNB.svg';
import BUSD from '../assets/tokens/BUSD.png';
import USDT from '../assets/tokens/USDT.png';
import CAKE from '../assets/tokens/CAKE.png';
import ARB from '../assets/tokens/ARB.svg';
import USDC from '../assets/tokens/USDC.svg';
import defaultToken from '../assets/tokens/NO_NAME.png';
import React from 'react';
import { chainLogos } from '../utils/constant';
import c from 'classnames';

const logo: { [key: string]: string } = {
  DEFAULT: defaultToken,
  USDT: USDT,
  BUSD: BUSD,
  ETH: ETH,
  BTC: BTC,
  WBNB: BNB,
  BNB: BNB,
  CAKE: CAKE,
  ARB: ARB,
  USDC: USDC,
};

export interface TokenSymbolProps {
  symbol?: string;
  size?: number;
  chainId?: number;
}

export const TokenSymbol: React.FC<TokenSymbolProps> = ({ symbol, size = 32, chainId }) => {
  return (
    <div className="relative">
      <img
        className="block"
        src={!symbol ? logo.DEFAULT : logo[symbol] || logo.DEFAULT}
        height={size}
        width={size}
      />
      {chainLogos[chainId] && (
        <div
          style={{
            height: size / 2,
            width: size / 2,
          }}
          className={c(
            'rd-999px bg-#040404',
            'absolute -right-6px -bottom-3px z-2',
            'flex items-center justify-center',
          )}
        >
          <img height={size / 3} width={size / 3} className="block" src={chainLogos[chainId]} />
        </div>
      )}
    </div>
  );
};
