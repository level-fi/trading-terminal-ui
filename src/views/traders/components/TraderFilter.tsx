import { utils } from 'ethers';
import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import IconSearch from '../../../assets/icons/ic-search.svg';
import {
  orderOptions,
  timeFilterOptions,
  useTradersConfigParsed,
} from '../hooks/useTradersConfig';
import { Dropdown } from '../../../components/Dropdown';

export const TraderFilter = () => {
  const [params, setParams] = useSearchParams();
  const config = useTradersConfigParsed();
  const [searchContent, setSearchContent] = useState('');

  const navigate = useNavigate();
  const search = useCallback(
    (content: string) => {
      setSearchContent('');
      if (!utils.isAddress(content)) {
        return;
      }
      navigate(`/traders/${content}`);
    },
    [navigate],
  );
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
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
      <div className="bg-black bg-op-90 rounded-10px flex items-center lg:w-424px">
        <img src={IconSearch} className="h-14px mr-8px ml-20px" />
        <input
          type="text"
          placeholder="Enter or paste an address"
          className="text-14px bg-transparent border-none flex-1 outline-none color-white"
          value={searchContent}
          onChange={(event) => {
            setSearchContent(event?.target?.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              search((event.target as any).value);
            }
          }}
        />
        <button
          onClick={() => search(searchContent)}
          disabled={!searchContent}
          className="text-14px lg:text-16px bg-primary border-none outline-none h-36px w-76px lg:w-94px m-3px rounded-8px font-700 hover-cursor-pointer hover-bg-opacity-75 disabled-hover-bg-opacity-100 disabled-bg-#706E6A disabled-text-black disabled-hover-cursor-not-allowed"
        >
          SEARCH
        </button>
      </div>
      <div className="hidden lg:block">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <label className="color-#cdcdcd lg:block hidden">TIME:</label>
          <label className="color-#cdcdcd lg:hidden">TIME</label>
          <div className="flex items-center lg:mt-0 lg:ml-0 mt-13px -ml-10px">
            {timeFilterOptions.map(({ label, value }, index) => {
              const active = value === config.duration?.toString();
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
      <div className="lg:hidden table text-right mt-16px text-14px">
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
          <label className="table-cell text-left color-#cdcdcd mr-6px">Time:</label>
          <div className="table-cell">
            <div className="flex justify-start w-100%">
              <Dropdown
                defaultValue={timeFilterOptions[0]}
                options={timeFilterOptions}
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
