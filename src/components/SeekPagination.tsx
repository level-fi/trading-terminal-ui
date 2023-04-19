import React from 'react';
import { ReactComponent as IconGoFirst } from '../assets/icons/ic-go-first.svg';
import { ReactComponent as IconGoLast } from '../assets/icons/ic-go-last.svg';

export interface SeekPaginationProps {
  hasNext: boolean;
  current: number;
  onChange: (page: number) => void;
}
export const SeekPagination: React.FC<SeekPaginationProps> = ({
  hasNext,
  current,
  onChange,
}) => {
  if (current <= 1 && !hasNext) {
    return <></>;
  }

  return (
    <div className="flex items-center bg-#2F3037 p-3px rounded-10px grid grid-cols-2 grid-gap-5px">
      <div
        className={`w-39px h-30px flex items-center justify-center rounded-l-8px ${
          current == 1
            ? 'bg-#353538 cursor-not-allowed'
            : 'bg-#18181B [&:hover_svg_path]:fill-black cursor-pointer hover-bg-primary'
        }`}
        onClick={() => {
          if (current <= 1) {
            return;
          }
          onChange(current - 1);
        }}
      >
        <IconGoFirst height={12} />
      </div>
      <label className="color-#adabab px-10px">Page {current}</label>
      <div
        className={`w-39px h-30px flex items-center justify-center rounded-r-8px ${
          !hasNext
            ? 'bg-#353538 cursor-not-allowed'
            : 'bg-#18181B hover-bg-primary cursor-pointer [&:hover_svg_path]:fill-black'
        }`}
        onClick={() => {
          if (!hasNext) {
            return;
          }
          onChange(current + 1);
        }}
      >
        <IconGoLast height={12} />
      </div>
    </div>
  );
};
