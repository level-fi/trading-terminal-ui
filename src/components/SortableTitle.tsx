import React, { useCallback } from 'react';
import { ReactComponent as IconDown } from '../assets/icons/ic-down.svg';
import './SortableTitle.scss';

export interface SortableTitleProps {
  children: string;
  value?: string;
  valueKey: string;
  onChange: (key: string, value: string) => void;
  className: string;
}
export const SortableTitle: React.FC<SortableTitleProps> = ({
  children,
  className,
  value,
  valueKey,
  onChange,
}) => {
  const sort = useCallback(() => {
    if (!value || value === 'asc') {
      onChange(valueKey, 'desc');
      return;
    }
    onChange(valueKey, 'asc');
  }, [onChange, value, valueKey]);
  return (
    <div
      className="flex items-center sortable-title-container [&>*]:cursor-pointer hover-opacity-75"
      onClick={sort}
    >
      <label className={className}>{children}</label>
      <div className="flex flex-col items-center justify-center ml-5px">
        <IconDown
          width={12}
          height={6}
          className={`${value === 'asc' ? 'active' : ''} rotate-180`}
        />
        <IconDown
          width={12}
          height={6}
          className={`${value === 'desc' ? 'active' : ''} mt-3px`}
        />
      </div>
    </div>
  );
};
