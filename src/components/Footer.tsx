import { bscConfig, getTokenByAddress } from '../config';
import IconInterest from '../assets/icons/ic-interest.svg';
import IconPriceDown from '../assets/icons/ic-price-down.svg';
import IconPriceUp from '../assets/icons/ic-price-up.svg';
import { formatCurrency } from '../utils/numbers';
import { useQuery } from '@tanstack/react-query';
import { queryStats } from '../utils/queries';
import { useMemo } from 'react';
import { ChainConfigToken, PriceInfoResponse } from '../utils/type';
import { Tooltip } from './Tooltip';
import { chainLogos } from '../utils/constant';
import c from 'classnames';

export const Footer = () => {
  const { data: stats } = useQuery(queryStats(bscConfig.chainId));

  const [summarizedPrices, priceByChains] = useMemo(() => {
    if (!stats) {
      return [];
    }

    const summarizedPrices: Record<
      string,
      { price: PriceInfoResponse; token: ChainConfigToken }
    > = {};
    const priceByChains: Record<number, Record<string, PriceInfoResponse>> = {};

    for (const { chainId, prices } of stats) {
      if (!priceByChains[chainId]) {
        priceByChains[chainId] = {};
      }
      for (const item of prices) {
        const token = getTokenByAddress(item.address, chainId);
        summarizedPrices[token.symbol] = {
          price: item,
          token,
        };
        priceByChains[chainId][token.symbol] = item;
      }
    }
    return [Object.entries(summarizedPrices), Object.entries(priceByChains)];
  }, [stats]);

  const totalLong = stats
    ? stats.reduce((total, c) => total + c.openInterest.long, 0)
    : undefined;
  const totalShort = stats
    ? stats.reduce((total, c) => total + c.openInterest.short, 0)
    : undefined;

  return stats ? (
    <div className="h-41px">
      <div className="hide-scroll fixed bottom-0 left-0 h-41px w-100% px-14px xl:px-43px bg-black z-999 flex justify-between items-center overflow-x-auto">
        <div className="-mx-9px flex items-center">
          {summarizedPrices.map(([symbol, { price, token }], i) => {
            return (
              <div
                key={i}
                className={`px-9px b-r-1px b-solid b-#545454 flex items-center leading-16px ${
                  i + 1 === summarizedPrices.length ? 'xl:b-r-none' : ''
                }`}
              >
                <div className={`color-white text-12px`}>{symbol}</div>
                <div
                  className={c(
                    'b-b-1px b-b-dashed b-b-op-50 pb-1px -mb-2px ml-8px',
                    price.change >= 0 ? 'b-b-win' : 'b-b-loss',
                  )}
                >
                  <Tooltip
                    place="top"
                    content={
                      <div className="font-400">
                        {priceByChains.map(
                          ([chainId, prices]) =>
                            prices[symbol] && (
                              <div key={chainId} className="flex items-center py-5px">
                                <img
                                  src={chainLogos[chainId]}
                                  width={16}
                                  height={16}
                                  className="mr-10px"
                                />
                                <PriceInfo price={prices[symbol]} token={token} />
                              </div>
                            ),
                        )}
                      </div>
                    }
                  >
                    <PriceInfo price={price} token={token} />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center ml-9px pl-9px">
          <img src={IconInterest} className="h-15px" />
          <span className="color-white text-12px ml-8px whitespace-nowrap">Open Interest:</span>
          <span className="text-12px font-500 color-white ml-8px color-win">LONG</span>
          <span className="font-700 color-white text-12px ml-4px b-b-1px b-b-dashed b-b-#ADABAB b-b-op-75 pb-2px -mb-3px">
            <Tooltip
              place="top"
              content={
                <div className="font-400">
                  {(stats || []).map((c) => (
                    <div key={c.chainId} className="flex items-center py-5px">
                      <img
                        src={chainLogos[c.chainId]}
                        width={16}
                        height={16}
                        className="mr-10px"
                      />
                      {formatCurrency(c.openInterest.long, 0)}
                    </div>
                  ))}
                </div>
              }
            >
              {formatCurrency(totalLong, 0)}
            </Tooltip>
          </span>
          <span className="text-12px font-500 color-white ml-8px whitespace-nowrap color-loss ml-9px pl-9px b-l-1px b-solid b-#545454">
            SHORT
          </span>
          <span className="font-700 color-white text-12px ml-4px b-b-1px b-b-dashed b-b-#ADABAB b-b-op-75 pb-2px -mb-3px">
            <Tooltip
              place="top"
              content={
                <div className="font-400">
                  {(stats || []).map((c) => (
                    <div key={c.chainId} className="flex items-center py-5px">
                      <img
                        src={chainLogos[c.chainId]}
                        width={16}
                        height={16}
                        className="mr-10px"
                      />
                      {formatCurrency(c.openInterest.short, 0)}
                    </div>
                  ))}
                </div>
              }
            >
              {formatCurrency(totalShort, 0)}
            </Tooltip>
          </span>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-100% h-41px flex justify-between z-1000 pointer-events-none xl:hidden">
        <div className="h-100% w-64px bg-gradient-to-r from-black"></div>
        <div className="h-100% w-64px bg-gradient-to-l from-black"></div>
      </div>
    </div>
  ) : undefined;
};

type PriceInfoProps = {
  price: PriceInfoResponse;
  token: ChainConfigToken;
};
export const PriceInfo = ({ price, token }: PriceInfoProps) => {
  return (
    <div className="flex items-center leading-16px whitespace-nowrap">
      <span className={`${price.change >= 0 ? 'color-win' : 'color-loss'} text-12px`}>
        {formatCurrency(price.price, token.priceFractionDigits)}
      </span>
      <img
        src={price.change >= 0 ? IconPriceUp : IconPriceDown}
        className="h-8px ml-8px mr-4px"
      />
      <span className={`text-10px ${price.change >= 0 ? 'color-win' : 'color-loss'}`}>
        {price.change.toFixed(2)}%
      </span>
    </div>
  );
};
