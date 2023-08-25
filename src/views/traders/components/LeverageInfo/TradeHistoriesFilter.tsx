import DatePicker from 'react-datepicker';
import IconRefresh from '../../../../assets/icons/ic-refresh.svg';
import React from 'react';
import { chainOptions } from '../../../positions/hooks/usePositionsConfig';
import { Dropdown } from '../../../../components/Dropdown';
import c from 'classnames';

export const timeFilters = [
  {
    label: 'all time',
    value: undefined,
  },
  {
    label: '1 Day',
    value: 1,
  },
  {
    label: '1 Week',
    value: 7,
  },
  {
    label: '1 Month',
    value: 30,
  },
  {
    label: '3 Months',
    value: 90,
  },
];
interface TradeHistoriesFilterProps {
  timeFilter: number | undefined;
  onUpdateTimeFilter: (value: number | undefined) => void;
  dateStart: Date;
  onUpdateDateStart: (value: Date) => void;
  dateEnd: Date;
  onUpdateDateEnd: (value: Date) => void;
  chainId: number;
  onUpdateChainId: (value: number) => void;
  onRefresh: () => void;
}
export const TradeHistoriesFilter: React.FC<TradeHistoriesFilterProps> = ({
  timeFilter,
  onUpdateTimeFilter,
  dateStart,
  onUpdateDateStart,
  dateEnd,
  onUpdateDateEnd,
  onRefresh,
  chainId,
  onUpdateChainId,
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
      <div
        className={c(
          'flex flex-col mb-20px xl:(flex-row items-center mb-0)',
          '[&>div]:(grid grid-rows-[auto_auto] gap-y-10px items-center xl:(grid-cols-[auto_130px]))',
          '[&>div>label]:(text-12px mr-4px xl:(text-16px))',
        )}
      >
        <div>
          <label className="color-#cdcdcd">CHAIN:</label>
          <Dropdown
            defaultValue={chainOptions[0]}
            options={chainOptions}
            value={chainOptions.find((c) => c.value === chainId)}
            className="color-white uppercase"
            onChange={(item) => {
              onUpdateChainId(item.value);
            }}
          />
        </div>
        <div className="mt-12px xl:(mt-0 ml-46px)">
          <label className="color-#cdcdcd">TIME:</label>
          <Dropdown
            defaultValue={timeFilters[0]}
            options={timeFilters}
            value={timeFilters.find((c) => c.value === timeFilter)}
            className="color-white uppercase"
            onChange={(item) => {
              onUpdateTimeFilter(item.value);
            }}
          />
        </div>
      </div>
      <div
        className={c(
          // 'flex items-center mb-10px',
          'grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-x-8px',
          '[&_input]:(bg-transparent b-none color-#d8d8d8 outline-none w-98px text-14px)',
          'xl:([&_input]:w-112px [&_input]:text-16px h-auto ml-auto mt-0 mb-0)',
        )}
      >
        <label className="text-14px xl:text-16px color-#cdcdcd">From:</label>
        <DatePicker
          placeholderText="YYYY-MM-dd"
          selected={dateStart}
          onChange={(date: Date) => onUpdateDateStart(date)}
          dateFormat="yyyy-MM-dd"
          autoComplete="off"
        />
        <label className="text-14px xl:text-16px color-#cdcdcd">To:</label>
        <DatePicker
          placeholderText="YYYY-MM-dd"
          selected={dateEnd}
          onChange={(date: Date) => onUpdateDateEnd(date)}
          dateFormat="yyyy-MM-dd"
          autoComplete="off"
        />
        <div onClick={onRefresh} className="flex hover-op-75 [&:hover>*]:cursor-pointer">
          <img src={IconRefresh} height={14} />
          <label className="hidden xl:block ml-8px text-14px color-#cdcdcd">Refresh</label>
        </div>
      </div>
    </div>
  );
};
