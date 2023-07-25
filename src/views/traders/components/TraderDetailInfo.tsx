import React from 'react';
import { Avatar } from '../../../components/Avatar';
import { ReactComponent as IconExplorer } from '../../../assets/icons/ic-explorer.svg';
import { formatCurrency, formatProfit } from '../../../utils/numbers';
import { profitColor, shortenAddress } from '../../../utils';
import { TraderDetailResponse } from '../../../utils/type';
import c from 'classnames';
import { Tooltip } from '../../../components/Tooltip';
import { chainLogos } from '../../../utils/constant';

interface TraderDetailPanelProps {
  wallet: string;
  item: TraderDetailResponse;
  loading: boolean;
}
export const TraderDetailPanel: React.FC<TraderDetailPanelProps> = ({
  wallet,
  item,
  loading,
}) => {
  return (
    <div className="flex flex-col xl:flex-row justify-between xl:items-center xl:bg-black xl:bg-op-54 xl:p-24px xl:rounded-10px">
      <div className="flex items-center bg-black bg-op-54 xl:bg-op-0 p-14px rounded-10px xl:p-0 p-14px xl:rounded-0">
        <Avatar size={64} wallet={wallet} />
        <div className="flex flex-col ml-18px">
          <label className="color-white text-18px font-700">
            <span className="hidden 2xl:block">{wallet}</span>
            <span className="hidden xl:inline 2xl:hidden">
              {shortenAddress(wallet, 15, 10)}
            </span>
            <span className="xl:hidden">{shortenAddress(wallet)}</span>
          </label>
          <a
            href={`https://leveller.me/${wallet}`}
            target="_blank"
            className="w-fit text-14px mt-13px color-#cdcdcd no-underline hover-op-75 flex items-centere"
          >
            View on Leveller <IconExplorer className="ml-8px" />
          </a>
        </div>
      </div>
      <div className="xl:flex items-center bg-black bg-op-54 xl:bg-op-0 rounded-10px xl:rounded-0 px-16px py-18px xl:p-0 mt-12px xl:mt-0">
        <div className="flex justify-between mb-18px xl:(m-0 flex-col pl-20px pr-40px b-l-1px b-solid b-#2f2f2f items-start)">
          <label className="text-14px color-#adadab xl:mb-13px">Total Trading Volume</label>
          <label
            className={c(
              'xl:text-16px text-14px font-700 color-white b-b-1px b-b-dashed pb-4px',
              loading || !item?.data?.totalTrading
                ? 'b-b-transparent'
                : 'b-b-#D8D8D8 cursor-pointer',
            )}
          >
            {loading ? (
              '-'
            ) : item?.data?.totalTrading ? (
              <Tooltip
                place="bottom"
                options={{ offset: 20 }}
                content={
                  <div className="text-13px font-400">
                    {(item?.data?.byChains?.volumes || []).map((c) => (
                      <div key={c.chainId} className="flex items-center py-5px">
                        <img
                          src={chainLogos[c.chainId]}
                          width={18}
                          height={18}
                          className="mr-10px"
                        />
                        {formatCurrency(c.value)}
                      </div>
                    ))}
                  </div>
                }
              >
                {formatCurrency(item?.data?.totalTrading)}
              </Tooltip>
            ) : (
              formatCurrency(item?.data?.totalTrading)
            )}
          </label>
        </div>
        <div className="flex justify-between mb-18px xl:(m-0 flex-col pl-20px pr-40px b-l-1px b-solid b-#2f2f2f items-start)">
          <label className="text-14px color-#adadab xl:mb-13px">Open Interest</label>
          <label
            className={c(
              'xl:text-16px text-14px font-700 color-white b-b-1px b-b-dashed pb-4px',
              loading || !item?.data?.openInterest
                ? 'b-b-transparent'
                : 'b-b-#D8D8D8 cursor-pointer',
            )}
          >
            {loading ? (
              '-'
            ) : item?.data?.openInterest ? (
              <Tooltip
                place="bottom"
                options={{ offset: 20 }}
                content={
                  <div className="text-13px font-400">
                    {(item?.data?.byChains?.openInterest || []).map((c) => (
                      <div key={c.chainId} className="flex items-center py-5px">
                        <img
                          src={chainLogos[c.chainId]}
                          width={18}
                          height={18}
                          className="mr-10px"
                        />
                        {formatCurrency(c.value)}
                      </div>
                    ))}
                  </div>
                }
              >
                {formatCurrency(item.data.openInterest)}
              </Tooltip>
            ) : (
              formatCurrency(item?.data?.openInterest)
            )}
          </label>
        </div>
        <div className="flex justify-between mb-18px xl:(m-0 flex-col pl-20px pr-40px b-l-1px b-solid b-#2f2f2f items-start)">
          <label className="text-14px color-#adadab xl:mb-13px">Net Profit</label>
          <label
            className={c(
              'xl:text-16px text-14px font-700 b-b-1px b-b-dashed pb-4px',
              profitColor(item?.data?.totalNetProfit),
              loading || !item?.data?.totalNetProfit ? '!b-b-transparent' : 'cursor-pointer',
            )}
          >
            {loading ? (
              '-'
            ) : item?.data?.totalNetProfit ? (
              <Tooltip
                place="bottom"
                options={{ offset: 20 }}
                content={
                  <div className="text-13px font-400">
                    {(item?.data?.byChains?.netProfit || []).map((c) => (
                      <div key={c.chainId} className="flex items-center py-5px">
                        <img
                          src={chainLogos[c.chainId]}
                          width={18}
                          height={18}
                          className="mr-10px"
                        />
                        {formatProfit(c.value)}
                      </div>
                    ))}
                  </div>
                }
              >
                {formatProfit(item.data.totalNetProfit)}
              </Tooltip>
            ) : (
              formatProfit(item?.data?.totalNetProfit)
            )}
          </label>
        </div>
        <div className="flex justify-between xl:flex-col xl:pl-20px xl:b-l-1px b-solid b-#2f2f2f">
          <label className="text-14px color-#adadab xl:mb-13px">Total Fees Paid</label>
          <label
            className={c(
              'xl:text-16px text-14px font-700 color-white b-b-1px b-b-dashed pb-4px',
              loading || !item?.data?.totalFee
                ? 'b-b-transparent'
                : 'b-b-#D8D8D8 cursor-pointer',
            )}
          >
            {loading ? (
              '-'
            ) : item?.data?.totalFee ? (
              <Tooltip
                place="bottom"
                options={{ offset: 20 }}
                content={
                  <div className="text-13px font-400">
                    {(item?.data?.byChains?.fee || []).map((c) => (
                      <div key={c.chainId} className="flex items-center py-5px">
                        <img
                          src={chainLogos[c.chainId]}
                          width={18}
                          height={18}
                          className="mr-10px"
                        />
                        {formatCurrency(c.value)}
                      </div>
                    ))}
                  </div>
                }
              >
                {formatCurrency(item.data.totalFee)}
              </Tooltip>
            ) : (
              formatCurrency(item?.data?.totalFee)
            )}
          </label>
        </div>
      </div>
    </div>
  );
};
