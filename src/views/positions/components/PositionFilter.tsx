import { useSearchParams } from 'react-router-dom';
import {
  chainOptions,
  getMarketOptions,
  orderOptions,
  sideOptions,
  statusOptions,
  usePositionsConfigParsed,
} from '../hooks/usePositionsConfig';
import { Dropdown } from '../../../components/Dropdown';
import { useCallback } from 'react';
import { useScreenSize } from '../../../hooks/useScreenSize';
import c from 'classnames';
import { chainLogos } from '../../../utils/constant';

export const PositionFilter = () => {
  const [params, setParams] = useSearchParams();
  const { config } = usePositionsConfigParsed();
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
  const marketOptions = getMarketOptions(config.chainId);
  const isMobile = useScreenSize('xl');

  if (isMobile) {
    return (
      <div className="table text-right text-14px w-100%">
        <div className="table-row">
          <label className="table-cell text-left color-#cdcdcd mr-6px whitespace-nowrap pr-14px">
            Status:
          </label>
          <div className="table-cell w-100%">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={statusOptions[1]}
                options={statusOptions}
                value={statusOptions.find((c) => c.value === config.status)}
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
                defaultValue={orderOptions[6]}
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
          <label className="table-cell text-left color-#cdcdcd mr-6px">Chain:</label>
          <div className="table-cell">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={chainOptions[0]}
                options={chainOptions}
                value={chainOptions.find((c) => c.value === config.chainId)}
                className="color-white uppercase"
                onChange={(item) => {
                  params.delete('market');
                  onUpdate('chain', item.label, item.value);
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
                value={marketOptions.find((c) => c.value === config.market)}
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
                value={sideOptions.find((c) => c.value === config.side)}
                className="color-white uppercase"
                onChange={(item) => {
                  onUpdate('side', item.label, item.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mx-auto flex items-center mb-25px text-16px font-700 b-1px b-solid b-white b-op-20% h-46px rounded-10px color-white [&>.active]:color-primary w-360px max-w-100%">
        {statusOptions.map(({ label, value }, i) => {
          const active = value === config.status;
          return (
            <div
              onClick={() => onUpdate('status', label, value)}
              className={c(
                'uppercase cursor-pointer hover-op-75 flex-1 text-center leading-30px',
                {
                  active: active,
                  'b-l-1px b-solid b-#595861': i,
                },
              )}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div className="flex 2xl:(flex-row items-center justify-between [&>div>label:first-child]:w-auto) xl:(flex-col items-start [&>div]:py-6px [&>div>label:first-child]:w-70px [&>div>div:nth-child(2)]:w-60px)">
        <div className="flex items-center">
          <label className="color-#cdcdcd">CHAIN:</label>
          {chainOptions.map(({ label, value }, i) => {
            const active = value === config.chainId;
            const color = active ? 'color-black' : 'color-white';
            const bg = active ? 'bg-primary' : 'bg-#d9d9d9 bg-opacity-10';
            return (
              <div
                key={i}
                className={`uppercase ${color} ${bg} px-14px h-32px ml-10px rounded-10px flex items-center justify-center font-700 cursor-pointer hover-opacity-75`}
                onClick={() => {
                  params.delete('market');
                  onUpdate('chain', label, value);
                }}
              >
                {chainLogos[value] && (
                  <img src={chainLogos[value]} height={18} width={18} className="mr-10px" />
                )}
                {label}
              </div>
            );
          })}
        </div>
        <div className="flex items-center 2xl:(ml-auto)">
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
        <div className="flex items-center 2xl:(ml-48px)">
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
    </div>
  );
};
