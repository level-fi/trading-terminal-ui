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
          className={`hover:(op-75 [&>div:first-child]:(c-primary)) px-12px py-10px lg:(py-12px px-17px) cursor-pointer`}
        >
          <div
            className={`text-14px lg:(text-16px) font-700 ${
              props.isSelected ? 'c-primary' : 'c-#fff'
            }`}
          >
            {props.data.customLabel.label}
          </div>
          {!!props.data.customLabel.subLabel && (
            <div
              className={`mt-8px text-12px ${
                props.isSelected ? 'c-primary' : 'color-#cdcdcb'
              } font-200`}
            >
              {props.data.customLabel.subLabel}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`uppercase text-14px px-12px py-10px hover:(cursor-pointer c-primary op-75) lg:(px-17px py-12px text-16px) ${
            props.isSelected ? 'c-primary' : 'c-#fff'
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
      openMenuOnClick
      classNames={{
        container: () => 'px-10px bg-#d9d9d9 bg-op-15 rd-10px',
        indicatorsContainer: () => 'pl-8px',
        dropdownIndicator: ({ selectProps }) =>
          `ease-linear duration-125 transition-transform ${
            selectProps.menuIsOpen ? 'rotate-180deg' : ''
          } [&_img]:(w-9px)`,
        control: () => '-mx-10px px-10px !min-h-32px !flex-row !flex-nowrap',
        valueContainer: () => '!overflow-visible',
        singleValue: () => '!overflow-visible !text-clip text-14px xl:text-16px',
        menu: () =>
          'bg-#565663 rounded-10px text-left important:w-auto min-w-100% overflow-hidden whitespace-nowrap py-6px mt-2px shadow-[0_10px_15px_0_rgba(0,0,0,0.26)] transition-all duration-200 ease-linear',
      }}
    />
  );
};
