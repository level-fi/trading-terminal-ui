import { useSearchParams } from 'react-router-dom';
import {
  marketOptions,
  orderOptions,
  sideOptions,
  statusOptions,
  usePositionsConfigParsed,
} from '../hooks/usePositionsConfig';
import { Dropdown } from '../../../components/Dropdown';
import { useCallback } from 'react';

export const PositionFilter = () => {
  const [params, setParams] = useSearchParams();
  const config = usePositionsConfigParsed();
  const onUpdate = useCallback(
    (key, label, value) => {
      if (value === undefined) {
        params.delete(key);
      } else {
        params.set(key, label);
      }
      params.set('page', '1');
      setParams(params);
    },
    [params, setParams],
  );
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between">
      <div className="hidden lg:flex items-center">
        {/* <label className="color-#cdcdcd">STATUS:</label> */}
        {statusOptions.map(({ label, value }, i) => {
          const active = value === config.status;
          const color = active ? 'color-black' : 'color-white';
          const bg = active ? 'bg-primary' : 'bg-#d9d9d9 bg-opacity-10';
          return (
            <div
              key={i}
              className={`uppercase ${color} ${bg} w-90px h-32px mr-10px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
              onClick={() => {
                onUpdate('status', label, value);
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div className="hidden lg:flex items-center">
        <div className="flex items-center">
          <label className="color-#cdcdcd">MARKET:</label>
          {marketOptions.map(({ label, value }, i) => {
            const active = value?.toLowerCase() === config.market?.toLowerCase();
            const color = active ? 'color-black' : 'color-white';
            const bg = active ? 'bg-primary' : 'bg-#d9d9d9 bg-opacity-10';
            return (
              <div
                key={i}
                className={`uppercase ${color} ${bg} w-60px h-32px ml-10px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
                onClick={() => {
                  onUpdate('market', label, value);
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
        <div className="hidden lg:flex items-center ml-50px">
          <label className="color-#cdcdcd">SIDE:</label>
          {sideOptions.map(({ label, value, activeBg }, i) => {
            const active = value === config.side;
            const color = active ? 'color-black' : 'color-white';
            const bg = active ? activeBg : 'bg-#d9d9d9 bg-opacity-10';
            return (
              <div
                key={i}
                className={`uppercase ${color} ${bg} w-70px h-32px ml-10px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
                onClick={() => {
                  onUpdate('side', label, value);
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
      <div className="lg:hidden table text-right text-14px w-100%">
        <div className="table-row">
          <label className="table-cell text-left color-#cdcdcd mr-6px whitespace-nowrap pr-14px">
            Status:
          </label>
          <div className="table-cell w-100%">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={statusOptions[0]}
                options={statusOptions}
                className="color-white uppercase"
                onChange={(item) => {
                  onUpdate('status', item.label, item.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="table-row">
          <label className="table-cell text-left color-#cdcdcd mr-6px whitespace-nowrap pr-14px">
            Ordered by:
          </label>
          <div className="table-cell w-100%">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={orderOptions[0]}
                options={orderOptions}
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
          <label className="table-cell text-left color-#cdcdcd mr-6px">Market:</label>
          <div className="table-cell">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={marketOptions[0]}
                options={marketOptions}
                className="color-white uppercase"
                onChange={(item) => {
                  onUpdate('market', item.label, item.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="table-row">
          <label className="table-cell text-left color-#cdcdcd mr-6px">Side:</label>
          <div className="table-cell">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={sideOptions[0]}
                options={sideOptions}
                className="color-white uppercase"
                onChange={(item) => {
                  onUpdate('side', item.label, item.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
