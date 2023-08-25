import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  orderOptions,
  timeFilterOptions,
  useTradersConfigParsed,
} from '../hooks/useTradersConfig';
import { Dropdown } from '../../../components/Dropdown';
import c from 'classnames';
import { useScreenSize } from '../../../hooks/useScreenSize';

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
  const isMobile = useScreenSize('xl');

  return (
    <div
      className={c(
        'grid [&>div]:(grid grid-cols-[90px_auto] items-center xl:(grid-cols-[auto_130px])) [&>div>label]:(text-12px mr-4px xl:(text-16px))',
        'gap-y-8px',
      )}
    >
      <div>
        <label className="color-#cdcdcd">TIME:</label>
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
      {isMobile && (
        <div>
          <label className="color-#cdcdcd">ORDERED BY:</label>
          <Dropdown
            defaultValue={orderOptions[0]}
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
