import DatePicker from 'react-datepicker';
import IconRefresh from '../../../../assets/icons/ic-refresh.svg';
import React from 'react';

export const timeFilters = [
  {
    title: '1 Day',
    value: 1,
  },
  {
    title: '1 Week',
    value: 7,
  },
  {
    title: '1 Month',
    value: 30,
  },
  {
    title: '3 Months',
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
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center justify-between -mx-5px">
        {timeFilters.map(({ title, value }, i) => {
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
              {title}
            </div>
          );
        })}
      </div>
      <div className="flex items-center mt-14px xl:mt-0 [&_input]:bg-transparent [&_input]:b-none [&_input]:color-#d8d8d8 [&_input]:outline-none xl:[&_input]:w-112px [&_input]:w-98px xl:[&_input]:text-16px [&_input]:text-14px">
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
    </div>
  );
};
