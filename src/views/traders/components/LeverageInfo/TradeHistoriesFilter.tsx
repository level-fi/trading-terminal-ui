import DatePicker from 'react-datepicker';
import IconRefresh from '../../../../assets/icons/ic-refresh.svg';
import React from 'react';
import { chainOptions } from '../../../positions/hooks/usePositionsConfig';
import { chainLogos } from '../../../../utils/constant';
import { useScreenSize } from '../../../../hooks/useScreenSize';
import { Dropdown } from '../../../../components/Dropdown';
import c from 'classnames';

export const timeFilters = [
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
  timeFilter: number;
  onUpdateTimeFilter: (value: number) => void;
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
  const isMobile = useScreenSize('xl');
  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center justify-between -mx-5px">
        {timeFilters.map(({ label, value }, i) => {
          const active = timeFilter == value;
          const color = active ? 'color-black' : 'color-white';
          const bg = active ? 'bg-primary' : 'bg-#d9d9d9 bg-opacity-10';
          return (
            <div
              key={i}
              className={`${color} ${bg} text-12px w-82px h-32px mx-5px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
              onClick={() => {
                onUpdateTimeFilter(value);
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div
        className={c(
          'flex items-center mt-20px mb-10px',
          '[&_input]:(bg-transparent b-none color-#d8d8d8 outline-none w-98px text-14px)',
          'xl:([&_input]:w-112px [&_input]:text-16px h-auto ml-auto mr-20px mt-0 mb-0)',
        )}
      >
        <label className="text-14px xl:text-16px color-#cdcdcd mr-10px">From:</label>
        <DatePicker
          placeholderText="YYYY-MM-dd"
          selected={dateStart}
          onChange={(date: Date) => onUpdateDateStart(date)}
          dateFormat="yyyy-MM-dd"
          autoComplete="off"
        />
        <label className="text-14px xl:text-16px color-#cdcdcd mx-10px">To:</label>
        <DatePicker
          placeholderText="YYYY-MM-dd"
          selected={dateEnd}
          onChange={(date: Date) => onUpdateDateEnd(date)}
          dateFormat="yyyy-MM-dd"
          autoComplete="off"
        />
        <div
          onClick={onRefresh}
          className="flex ml-16px hover-op-75 [&:hover>*]:cursor-pointer"
        >
          <img src={IconRefresh} height={14} />
          <label className="hidden xl:block ml-8px text-14px color-#cdcdcd">Refresh</label>
        </div>
      </div>
      {isMobile ? (
        <div className="table text-right text-14px w-100% [&_.table-cell]:pb-10px">
          <div className="table-row">
            <label className="table-cell w-70px text-left color-#cdcdcd">Chain:</label>
            <div className="table-cell">
              <div className="flex justify-start w-100% -my-10px">
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
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center color-#cdcdcd text-14px font-700">
          {chainOptions.map(({ label, value }, i) => {
            const active = value === chainId;
            const color = active ? 'color-black' : 'color-white';
            const bg = active ? 'bg-primary' : 'bg-#d9d9d9 bg-opacity-10';
            return (
              <div
                key={i}
                className={`${color} ${bg} uppercase text-12px px-14px min-w-82px h-32px mx-5px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
                onClick={() => {
                  onUpdateChainId(value);
                }}
              >
                {chainLogos[value] && (
                  <img className="mr-10px" src={chainLogos[value]} width={16} height={16} />
                )}
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
