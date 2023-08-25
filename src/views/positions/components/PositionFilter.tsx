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

  return (
    <div
      className={c(
        'grid [&>div]:(grid grid-rows-2 items-center xl:(grid-rows-1 grid-cols-[auto_130px])) [&>div>label]:(text-12px mr-4px xl:(text-16px))',
        'gap-y-8px',
        'xl:(grid-cols-[repeat(4,auto)] gap-x-46px)',
      )}
    >
      <div>
        <label className="color-#cdcdcd">STATUS:</label>
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
      <div>
        <label className="color-#cdcdcd">CHAIN:</label>
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
      <div>
        <label className="color-#cdcdcd">MARKET:</label>
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
      <div>
        <label className="color-#cdcdcd">SIDE:</label>
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
      {isMobile && (
        <div>
          <label className="color-#cdcdcd">ORDERED BY:</label>
          <Dropdown
            defaultValue={orderOptions[6]}
            options={orderOptions}
            value={orderOptions.find(
              (c) => c.value.sortBy === config.sortBy && c.value.sortType === config.sortType,
            )}
            className="color-white"
            onChange={(item) => {
              params.set('sort', item.value.sortBy);
              params.set('order', item.value.sortType);
              setParams(params);
            }}
          />
        </div>
      )}
    </div>
  );
};
