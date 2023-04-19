import React from 'react';
import { Avatar } from '../../../components/Avatar';
import { ReactComponent as IconExplorer } from '../../../assets/icons/ic-explorer.svg';
import { formatCurrency, formatProfit } from '../../../utils/numbers';
import { profitColor, shortenAddress } from '../../../utils';
import { TraderDetail } from '../../../hooks/useTraderDetail';

interface TraderDetailPanelProps {
  item: TraderDetail;
  loading: boolean;
}
export const TraderDetailPanel: React.FC<TraderDetailPanelProps> = ({ item, loading }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between lg:items-center lg:bg-black lg:bg-op-54 lg:p-24px lg:rounded-10px">
      <div className="flex items-center bg-black bg-op-54 lg:bg-op-0 p-14px rounded-10px lg:p-0 p-14px lg:rounded-0">
        <Avatar size={64} wallet={item.wallet} />
        <div className="flex flex-col ml-18px">
          <label className="color-white text-18px font-700">
            <span className="hidden 2xl:block">{item.wallet}</span>
            <span className="hidden lg:inline 2xl:hidden">
              {shortenAddress(item.wallet, 15, 10)}
            </span>
            <span className="lg:hidden">{shortenAddress(item.wallet)}</span>
          </label>
          <a
            href={`https://leveller.me/${item.wallet}`}
            target="_blank"
            className="w-fit text-14px mt-13px color-#cdcdcd no-underline hover-op-75 flex items-centere"
          >
            View on Leveller <IconExplorer className="ml-8px" />
          </a>
        </div>
      </div>
      <div className="lg:flex items-center bg-black bg-op-54 lg:bg-op-0 rounded-10px lg:rounded-0 px-16px py-18px lg:p-0 mt-12px lg:mt-0">
        <div className="flex justify-between mb-18px lg:m-0 lg:flex-col lg:pl-20px lg:pr-40px lg:b-l-1px b-solid b-#2f2f2f">
          <label className="text-14px color-#adadab lg:mb-13px">Total Trading Volume</label>
          <label className="lg:text-16px text-14px font-700 color-white">
            {loading ? '-' : formatCurrency(item.volume)}
          </label>
        </div>
        <div className="flex justify-between mb-18px lg:m-0 lg:flex-col lg:pl-20px lg:pr-40px lg:b-l-1px b-solid b-#2f2f2f">
          <label className="text-14px color-#adadab lg:mb-13px">Open Interest</label>
          <label className="lg:text-16px text-14px font-700 color-white">
            {loading ? '-' : formatCurrency(item.openInterest)}
          </label>
        </div>
        <div className="flex justify-between mb-18px lg:m-0 lg:flex-col lg:pl-20px lg:pr-40px lg:b-l-1px b-solid b-#2f2f2f">
          <label className="text-14px color-#adadab lg:mb-13px">Net Profit</label>
          <label className={`lg:text-16px text-14px font-700 ${profitColor(item.netProfit)}`}>
            {loading ? '-' : formatProfit(item.netProfit)}
          </label>
        </div>
        <div className="flex justify-between lg:flex-col lg:pl-20px lg:b-l-1px b-solid b-#2f2f2f">
          <label className="text-14px color-#adadab lg:mb-13px">Total Fee Paid</label>
          <label className="lg:text-16px text-14px font-700 color-white">
            {loading ? '-' : formatCurrency(item.feePaid)}
          </label>
        </div>
      </div>
    </div>
  );
};
