import { Avatar } from '../../../components/Avatar';
import React from 'react';
import { formatCurrency, formatProfit } from '../../../utils/numbers';
import { profitColor, shortenAddress } from '../../../utils';
import { NavLink } from 'react-router-dom';
import IconRight from '../../../assets/icons/ic-arrow-right.svg';
import { TraderItemContentLoader } from '../../../components/ContentLoader';

export interface TraderItemProps {
  rank: number;
  address: string;
  win: number;
  loss: number;
  volume: number;
  netProfit: number;
  loading?: boolean;
}

export const TraderItem: React.FC<TraderItemProps> = ({
  address,
  loss,
  netProfit,
  rank,
  volume,
  win,
  loading,
}) => {
  return (
    <NavLink
      to={`/traders/${address}`}
      state={{ from: 'trader-list' }}
      className="relative no-underline block xl:table-row xl:h-56px bg-#34343B hover-bg-#5E5E5E hover-shadow b-1px b-solid b-#5E5E5E p-14px rounded-10px mb-12px"
    >
      <div className="xl:hidden">
        {loading && <TraderItemContentLoader />}
        <div
          className={`flex justify-between items-center b-b-1px b-dashed b-#5E5E5E pb-10px ${
            loading ? '[&>*]:invisible' : ''
          }`}
        >
          <div className="flex items-center">
            <Avatar wallet={address} size={32} />
            <span className="font-500 color-white ml-8px">{shortenAddress(address)}</span>
          </div>
          <span className={`text-24px font-800 trader-item-rank color-#adadab`}>{rank}</span>
        </div>
        <div className={loading ? '[&>*>*:last-child]:invisible' : ''}>
          <div className="flex justify-between text-14px mt-14px">
            <span className="color-#cdcdcd">Trading Volume</span>
            <span className="color-white">{formatCurrency(volume)}</span>
          </div>
          <div className="flex justify-between text-14px mt-14px">
            <span className="color-#cdcdcd">Net Profit</span>
            <span className={profitColor(netProfit)}>{formatProfit(netProfit)}</span>
          </div>
          <div className="flex justify-between text-14px mt-14px">
            <span className="color-#cdcdcd">Win/Loss</span>
            <span className="color-white">
              {win}/{loss}
            </span>
          </div>
        </div>
      </div>
      {/* desktop */}
      <div className="hidden xl:table-cell b-y-1px b-l-1px b-solid b-#5e5e5e vertical-mid px-24px rounded-l-10px">
        <span className={`text-31px font-800 trader-item-rank color-#adadab`}>{rank}</span>
      </div>
      <div className="hidden xl:table-cell b-y-1px b-solid b-#5e5e5e vertical-mid px-24px">
        <div className="flex items-center">
          <Avatar wallet={address} size={32} />
          <span className="mx-11px font-500 text-16px color-white leading-22px flex-1 b-solid b-#5E5E5E">
            {address}
          </span>
        </div>
      </div>
      <div className="hidden xl:table-cell b-y-1px b-solid b-#5e5e5e vertical-mid px-24px">
        <span className="color-white">
          {win}/{loss}
        </span>
      </div>
      <div className="hidden xl:table-cell b-y-1px b-solid b-#5e5e5e vertical-mid px-24px">
        <span className="color-white">{formatCurrency(volume)}</span>
      </div>
      <div className="hidden xl:table-cell b-y-1px b-solid b-#5e5e5e vertical-mid px-24px">
        <span className={profitColor(netProfit)}>{formatProfit(netProfit)}</span>
      </div>
      <div className="hidden xl:table-cell b-y-1px b-r-1px b-solid b-#5e5e5e vertical-mid px-24px rounded-r-10px">
        <img src={IconRight} height={12} />
      </div>
    </NavLink>
  );
};
