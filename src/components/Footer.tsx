import { bscConfig, getTokenByAddress } from '../config';
import IconInterest from '../assets/icons/ic-interest.svg';
import IconPriceDown from '../assets/icons/ic-price-down.svg';
import IconPriceUp from '../assets/icons/ic-price-up.svg';
import { formatCurrency } from '../utils/numbers';
import { useQuery } from '@tanstack/react-query';
import { queryStats } from '../utils/queries';
import { useMemo } from 'react';
import { ChainConfigToken, PriceInfoResponse } from '../utils/type';

export const Footer = () => {
  const { data: stats } = useQuery(queryStats(bscConfig.chainId));
  const prices = useMemo(() => {
    const results: Record<string, { price: PriceInfoResponse; token: ChainConfigToken }> = {};
    const response = stats?.prices || [];
    for (const item of response) {
      const token = getTokenByAddress(item.address);
      results[token.symbol] = {
        price: item,
        token,
      };
    }
    return Object.entries(results);
  }, [stats?.prices]);

  return stats ? (
    <div className="h-41px">
      <div className="hide-scroll fixed bottom-0 left-0 h-41px w-100% px-14px lg:px-43px bg-black z-999 flex justify-between items-center overflow-x-auto">
        <div className="-mx-9px flex items-center">
          {prices.map(([symbol, { price, token }], i) => {
            return (
              <div
                key={i}
                className={`px-9px b-r-1px b-solid b-#545454 flex items-center leading-16px ${
                  i + 1 === prices.length ? 'lg:b-r-none' : ''
                }`}
              >
                <span className={`color-white text-12px`}>{symbol}</span>
                <span
                  className={`${
                    price.change >= 0 ? 'color-win' : 'color-loss'
                  } text-12px ml-5px`}
                >
                  {formatCurrency(price.price, token.priceFractionDigits)}
                </span>
                <img
                  src={price.change >= 0 ? IconPriceUp : IconPriceDown}
                  className="h-9px ml-12px mr-4px"
                />
                <span className={`text-12px ${price.change >= 0 ? 'color-win' : 'color-loss'}`}>
                  {price.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center ml-9px pl-9px">
          <img src={IconInterest} className="h-15px" />
          <span className="color-white text-12px ml-8px whitespace-nowrap">Open Interest:</span>
          <span className="text-12px font-500 color-white ml-8px color-win">LONG</span>
          <span className="font-700 color-white text-12px ml-4px">
            {formatCurrency(stats?.openInterest?.long, 0)}
          </span>
          <span className="text-12px font-500 color-white ml-8px whitespace-nowrap color-loss ml-9px pl-9px b-l-1px b-solid b-#545454">
            SHORT
          </span>
          <span className="font-700 color-white text-12px ml-4px">
            {formatCurrency(stats?.openInterest?.short, 0)}
          </span>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-100% h-41px flex justify-between z-1000 pointer-events-none lg:hidden">
        <div className="h-100% w-64px bg-gradient-to-r from-black"></div>
        <div className="h-100% w-64px bg-gradient-to-l from-black"></div>
      </div>
    </div>
  ) : undefined;
};
