import React from 'react';
import Select, { components } from 'react-select';
import IconDown from '../assets/icons/ic-down.svg';

interface DropdownProps<T> {
  defaultValue: T;
  value?: T;
  options: T[];
  onChange: (value: T) => void;
  className: string;
}
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={IconDown} height={5} />
    </components.DropdownIndicator>
  );
};

const CustomOption = (props) => {
  return (
    <div {...props.innerProps}>
      {props.data.customLabel ? (
        <div
          className={`${
            props.isSelected ? 'bg-#34343B' : 'op-60'
          } py-10px hover:op-100 px-10px`}
        >
          <div className={`text-14px color-white font-700`}>{props.data.customLabel.label}</div>
          {!!props.data.customLabel.subLabel && (
            <div className="mt-8px text-12px color-#cdcdcb font-200">
              {props.data.customLabel.subLabel}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`uppercase p-10px hover:op-100 ${
            props.isSelected ? 'bg-#34343B bg-op-20 color-white' : 'op-60 color-#cdcdcb'
          }`}
        >
          {props.children}
        </div>
      )}
    </div>
  );
};

export const Dropdown = <T,>({
  defaultValue,
  value,
  onChange,
  options,
  className,
}: DropdownProps<T>) => {
  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      options={options}
      isSearchable={false}
      unstyled={true}
      components={{ DropdownIndicator, Option: CustomOption }}
      menuPlacement="auto"
      menuPosition="fixed"
      className={className}
      classNames={{
        dropdownIndicator: () => 'ml-8px',
        menu: () =>
          'bg-black rounded-8px text-left important:w-auto min-w-100% overflow-hidden b-1px b-solid b-#5E5E5E whitespace-nowrap',
      }}
    />
  );
};
