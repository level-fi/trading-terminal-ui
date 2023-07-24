import React, { useMemo } from 'react';
import { formatCurrency, formatProfit } from '../../../utils/numbers';
import { profitColor, unixToDate } from '../../../utils';
import { getTokenByAddress } from '../../../config';
import IconRight from '../../../assets/icons/ic-arrow-right.svg';
import { TokenSide } from '../../../components/TokenSide';
import { PositionStatus } from '../../../components/PositionStatus';
import { PositionItemContentLoader } from '../../../components/ContentLoader';
import { useScreenSize } from '../../../hooks/useScreenSize';
import c from 'classnames';

export interface PositionItemProps {
  id: string;
  loading?: boolean;
  side: number;
  indexToken: string;
  entryPrice: number;
  markPrice: number;
  size: number;
  netProfit: number;
  pnl: number;
  address: string;
  time: number;
  multipleAction: boolean;
  closed: boolean;
  chainId: number;
  cellClassName?: string;
  onClick?: (id: string) => void;
}

export const PositionItem: React.FC<PositionItemProps> = ({
  id,
  address,
  indexToken,
  entryPrice,
  markPrice,
  netProfit,
  pnl,
  size,
  side,
  time,
  closed,
  loading,
  cellClassName,
  chainId,
  onClick,
}) => {
  const token = useMemo(() => getTokenByAddress(indexToken || ''), [indexToken]);
  const isMobile = useScreenSize('xl');

  if (isMobile) {
    return (
      <div
        onClick={() => onClick(id)}
        className={c(
          `cursor-pointer block bg-#34343B`,
          'hover-bg-#5E5E5E hover-shadow',
          'b-1px b-solid b-#5E5E5E',
          'p-14px rounded-10px mb-12px',
        )}
      >
        <div>
          {loading && <PositionItemContentLoader />}
          <div
            className={`flex justify-between items-center b-b-1px b-dashed b-#5E5E5E pb-10px ${
              loading ? '[&>*]:invisible' : ''
            }`}
          >
            <div className="flex items-center">
              <TokenSide address={address} side={side} symbol={token?.symbol} chainId={chainId} />
            </div>
            <img src={IconRight} height={12} />
          </div>
          <div className={loading ? '[&>*>*:last-child]:invisible' : ''}>
            <div className="flex justify-between text-14px mt-14px">
              <span className="color-#cdcdcd">Size</span>
              <span className="color-white">{formatCurrency(size)}</span>
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <span className="color-#cdcdcd">Net Profit</span>
              <span className={profitColor(netProfit)}>{formatProfit(netProfit)}</span>
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <span className="color-#cdcdcd">Status</span>
              <div className="-my-3px">
                <PositionStatus closed={closed} />
              </div>
            </div>
            <div className="flex justify-between text-14px mt-14px">
              <span className="color-#cdcdcd">Time</span>
              <span className="color-white">{unixToDate(time)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(id)}
      className={c(
        `cursor-pointer relative no-underline table-row h-56px`,
        'bg-#34343B hover-bg-#5E5E5E hover-shadow',
        'b-1px b-solid b-#5E5E5E',
        'p-14px rounded-10px mb-12px',
        { 'xl:invisible': loading },
      )}
    >
      {/* desktop */}
      <div
        className={c(
          `table-cell b-y-1px b-l-1px b-solid b-#5e5e5e vertical-mid rounded-l-10px`,
          cellClassName,
        )}
      >
        <TokenSide address={address} side={side} symbol={token?.symbol} chainId={chainId} />
      </div>
      <div className={c(`table-cell b-y-1px b-solid b-#5e5e5e vertical-mid`, cellClassName)}>
        <span className="color-white">{formatCurrency(size)}</span>
      </div>
      <div className={c(`table-cell b-y-1px b-solid b-#5e5e5e vertical-mid`, cellClassName)}>
        <span className={profitColor(pnl)}>{formatProfit(pnl)}</span>
      </div>
      <div className={c('table-cell b-y-1px b-solid b-#5e5e5e vertical-mid', cellClassName)}>
        <span className={profitColor(netProfit)}>{formatProfit(netProfit)}</span>
      </div>
      <div className={c('table-cell b-y-1px b-solid b-#5e5e5e vertical-mid', cellClassName)}>
        <span className="color-white">
          {formatCurrency(entryPrice, token?.priceFractionDigits)}
        </span>
      </div>
      <div className={c('table-cell b-y-1px b-solid b-#5e5e5e vertical-mid', cellClassName)}>
        <span className="color-white">
          {formatCurrency(markPrice, token?.priceFractionDigits)}
        </span>
      </div>
      <div className={c('table-cell b-y-1px b-solid b-#5e5e5e vertical-mid', cellClassName)}>
        <PositionStatus closed={closed} />
      </div>
      <div className={c('table-cell b-y-1px b-solid b-#5e5e5e vertical-mid', cellClassName)}>
        <div className="flex flex-col 2xl:flex-row">
          <span className="color-white">{unixToDate(time, 'yyyy-MM-dd')}</span>
          <span className="color-#adadab mt-6px text-12px 2xl:(text-16px ml-10px mt-0 color-white text-16px)">
            {unixToDate(time, 'HH:mm:ss')}
          </span>
        </div>
      </div>
      <div
        className={c(
          `table-cell b-y-1px b-r-1px b-solid b-#5e5e5e vertical-mid rounded-r-10px`,
          cellClassName,
        )}
      >
        <img src={IconRight} height={12} />
      </div>
    </div>
  );
};
