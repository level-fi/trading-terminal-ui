import React from 'react';
import { formatCurrency } from '../../../utils/numbers';
import { ReactComponent as IconExplorer } from '../../../assets/icons/ic-explorer.svg';
import { unixToDate } from '../../../utils';
import {
  PlaceOrderEvent,
  PositionDetailHistoryResponse,
  RawPlaceOrderEvent,
} from '../../../utils/type';
import { getChainConfig } from '../../../config';

export interface PositionHistoriesProps {
  items: PositionDetailHistoryResponse[];
  chainId: number;
}
const parseAction = (
  rawEvent: RawPlaceOrderEvent,
  event: PlaceOrderEvent,
  isCloseAll: boolean,
) => {
  switch (rawEvent) {
    case RawPlaceOrderEvent.LIQUIDATE:
      return 'liquidate';
    case RawPlaceOrderEvent.INCREASE:
      return event === PlaceOrderEvent.OPEN ? 'open' : 'deposit collateral';
    case RawPlaceOrderEvent.DECREASE:
      return event === PlaceOrderEvent.CLOSE
        ? isCloseAll
          ? 'close'
          : 'partial close'
        : 'withdraw collateral';
  }
};
export const PositionHistories: React.FC<PositionHistoriesProps> = ({ items, chainId }) => {
  items.sort((a, b) => (a.receivedAt > b.receivedAt ? -1 : 1));
  const chainConfig = getChainConfig(chainId);
  return (
    <div className={`xl:table w-100% xl:border-spacing-y-12px`}>
      <div className="hidden xl:table-row items-end mb-15px">
        <label className="text-12px table-cell pl-13px pr-20px color-#cdcdcd">Time</label>
        <label className="text-12px table-cell px-20px color-#cdcdcd">Action</label>
        <label className="text-12px table-cell px-20px color-#cdcdcd whitespace-nowrap">
          Collateral Value
        </label>
        <label className="text-12px table-cell px-20px color-#cdcdcd">Size</label>
        <label className="text-12px table-cell px-20px color-#cdcdcd whitespace-nowrap">
          Fees Paid
        </label>
        <label className="text-12px table-cell px-20px color-#cdcdcd whitespace-nowrap">
          Executed Price
        </label>
        <span className="table-cell pr-13px pl-20px w-1px"></span>
      </div>
      {items.map((item, i) => (
        <a
          href={`${chainConfig.baseExplorer}/tx/${item.transactionHash}`}
          target="_blank"
          key={i}
          className="xl:table-row-group cursor-pointer no-underline"
        >
          <div className={`xl:hidden p-14px rounded-10px ${i && 'mt-12px'} bg-#34343B`}>
            <div className="flex justify-between text-12px xl:(text-14px)">
              <span className="color-#cdcdcd">Time</span>
              <span className="color-white">{unixToDate(item.receivedAt)}</span>
            </div>
            <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
              <span className="color-#cdcdcd">Action</span>
              <span className="color-white uppercase">
                {parseAction(item.rawEvent, item.event, !!item.isCloseAll)}
              </span>
            </div>
            <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
              <span className="color-#cdcdcd">Collateral Value</span>
              <span className="color-white">{formatCurrency(item.collateral)}</span>
            </div>
            <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
              <span className="color-#cdcdcd">Size</span>
              <span className="color-white">{formatCurrency(item.size)}</span>
            </div>
            <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
              <span className="color-#cdcdcd">Fees Paid</span>
              <span className="color-white">{formatCurrency(item.fee)}</span>
            </div>
            <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
              <span className="color-#cdcdcd">Executed Price</span>
              <span className="color-white">{formatCurrency(item.markPrice)}</span>
            </div>
            <div className="mt-16px pt-14px b-t-1px b-dashed b-#5E5E5E text-12px xl:(text-14px) flex items-center justify-end">
              <span className="color-#ADABAB">View</span>
              <IconExplorer className="ml-8px w-12px" />
            </div>
          </div>
          <div className={'hidden xl:table-row bg-#34343B hover-bg-#5E5E5E'}>
            <span className="color-white table-cell vertical-middle py-19px pl-13px pr-20px text-14px leading-22px rounded-l-10px whitespace-nowrap">
              {unixToDate(item.receivedAt)}
            </span>
            <span className="color-white table-cell vertical-middle py-19px px-20px text-14px leading-22px uppercase whitespace-nowrap">
              {parseAction(item.rawEvent, item.event, !!item.isCloseAll)}
            </span>
            <span className="color-white table-cell vertical-middle py-19px px-20px text-14px leading-22px">
              {formatCurrency(item.collateral)}
            </span>
            <span className="color-white table-cell vertical-middle py-19px px-20px text-14px leading-22px">
              {formatCurrency(item.size)}
            </span>
            <span className="color-white table-cell vertical-middle py-19px px-20px text-14px leading-22px">
              {formatCurrency(item.fee)}
            </span>
            <span className="color-white table-cell vertical-middle py-19px px-20px text-14px leading-22px">
              {formatCurrency(item.markPrice)}
            </span>
            <span className="table-cell vertical-middle py-19px pr-13px pl-20px w-1px rounded-r-10px">
              <IconExplorer />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
};
