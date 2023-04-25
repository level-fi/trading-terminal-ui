import { getTokenByAddress } from '../config';
import IconInterest from '../assets/icons/ic-interest.svg';
import IconPriceDown from '../assets/icons/ic-price-down.svg';
import IconPriceUp from '../assets/icons/ic-price-up.svg';
import { formatCurrency } from '../utils/numbers';
import { useStats } from '../context/StatsProvider';

export const Footer = () => {
  const stats = useStats();

  return stats ? (
    <div className="h-41px">
      <div className="hide-scroll fixed bottom-0 left-0 h-41px w-100% px-14px lg:px-43px bg-black z-999 flex justify-between items-center overflow-x-auto">
        <div className="-mx-9px flex items-center">
          {stats?.prices?.map((c, i) => {
            const token = getTokenByAddress(c.address);
            return (
              <div
                key={i}
                className={`px-9px b-r-1px b-solid b-#545454 flex items-center leading-16px ${
                  i + 1 === stats?.prices?.length ? 'lg:b-r-none' : ''
                }`}
              >
                <span className={`color-white text-12px`}>{token?.symbol}</span>
                <span
                  className={`${c.change >= 0 ? 'color-win' : 'color-loss'} text-12px ml-5px`}
                >
                  {formatCurrency(c.price, token.priceFractionDigits)}
                </span>
                <img
                  src={c.change >= 0 ? IconPriceUp : IconPriceDown}
                  className="h-9px ml-12px mr-4px"
                />
                <span className={`text-12px ${c.change >= 0 ? 'color-win' : 'color-loss'}`}>
                  {c.change.toFixed(2)}%
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
