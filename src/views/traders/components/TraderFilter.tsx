import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  orderOptions,
  timeFilterOptions,
  useTradersConfigParsed,
} from '../hooks/useTradersConfig';
import { Dropdown } from '../../../components/Dropdown';

export const TraderFilter = () => {
  const [params, setParams] = useSearchParams();
  const { config } = useTradersConfigParsed();

  const onUpdateTime = useCallback(
    (label, value) => {
      if (value === undefined) {
        params.delete('duration');
      } else {
        params.set('duration', label);
      }
      params.set('page', '1');
      setParams(params);
    },
    [params, setParams],
  );

  return (
    <div className="flex flex-col xl:flex-row xl:justify-end xl:items-center">
      <div className="hidden xl:block">
        <div className="flex flex-col xl:flex-row xl:items-center">
          <label className="color-#cdcdcd xl:block hidden">TIME:</label>
          <label className="color-#cdcdcd xl:hidden">TIME</label>
          <div className="flex items-center xl:mt-0 xl:ml-0 mt-13px -ml-10px">
            {timeFilterOptions.map(({ label, value }, index) => {
              const active = value === config.duration;
              const color = active ? 'color-black' : 'color-white';
              const bg = active ? 'bg-primary' : 'bg-#d9d9d9 bg-opacity-10';
              return (
                <div
                  key={index}
                  className={`uppercase ${color} ${bg} w-60px h-32px ml-10px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
                  onClick={() => {
                    onUpdateTime(label, value);
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="xl:hidden table text-right text-14px">
        <div className="table-row">
          <label className="table-cell text-left color-#cdcdcd mr-6px whitespace-nowrap pr-14px">
            Ordered by:
          </label>
          <div className="table-cell w-100%">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={orderOptions[0]}
                options={orderOptions}
                value={orderOptions.find(
                  (c) =>
                    c.value.sortBy === config.sortBy && c.value.sortType === config.sortType,
                )}
                className="color-white"
                onChange={(item) => {
                  params.set('sort', item.value.sortBy);
                  params.set('order', item.value.sortType);
                  setParams(params);
                }}
              />
            </div>
          </div>
        </div>
        <div className="table-row">
          <label className="table-cell text-left color-#cdcdcd mr-6px">Time:</label>
          <div className="table-cell">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={timeFilterOptions[0]}
                options={timeFilterOptions}
                value={timeFilterOptions.find((c) => c.value === config.duration)}
                className="color-white uppercase"
                onChange={(item) => {
                  onUpdateTime(item.label, item.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
