import React, { useMemo } from 'react';
import { ReactComponent as IconGoFirst } from '../assets/icons/ic-go-first.svg';
import { ReactComponent as IconGoLast } from '../assets/icons/ic-go-last.svg';

export interface PaginationProps {
  total: number;
  current: number;
  onChange: (page: number) => void;
}
type PageItem = number | undefined;
export const Pagination: React.FC<PaginationProps> = ({ total, current, onChange }) => {
  const pages = useMemo(() => {
    let top: PageItem[] = [];
    let mid: PageItem[] = [];
    let last: PageItem[] = [];
    const margin = 3;
    const border = 1;

    if (total <= margin) {
      top = [...new Array(total)].map((_, i) => i + 1);
      mid = [];
      last = [];
    } else if (current < margin) {
      top = [...new Array(margin)].map((_, i) => i + 1);
      mid = [undefined];
      last = [total];
    } else if (current < margin + border) {
      top = [...new Array(margin + border)].map((_, i) => i + 1);
      mid = [undefined];
      last = [total];
    } else if (total - current < margin - 1) {
      top = [1];
      mid = [undefined];
      last = [...new Array(margin)].map((_, i) => total - margin + i + 1);
    } else if (total - current < margin + border - 1) {
      top = [1];
      mid = [undefined];
      last = [...new Array(margin + border)].map((_, i) => total - margin + i);
    } else {
      top = [1];

      const halfMargin = Math.floor(margin / 2);
      const items = [...new Array(margin)].map((_, i) => i - halfMargin + current);
      mid = [undefined, ...items, undefined];

      last = [total];
    }

    return top.concat(mid).concat(last);
  }, [total, current]);

  return (
    <div className="flex items-center bg-#2F3037 p-3px rounded-10px grid grid-cols-2 grid-gap-5px">
      <div
        className={`xl:w-39px w-32px h-30px flex items-center justify-center rounded-l-8px ${
          current == 1
            ? 'bg-#353538 cursor-not-allowed'
            : 'bg-#18181B [&:hover_svg_path]:fill-black cursor-pointer hover-bg-primary'
        }`}
        onClick={() => {
          if (current <= 1) {
            return;
          }
          onChange(1);
        }}
      >
        <IconGoFirst className="xl:h-12px h-10px" />
      </div>
      {pages.map((page, i) => {
        const active = page === current;
        const color = active ? 'color-primary' : 'color-#adabab';
        const border = active ? 'b-1px b-solid b-primary' : undefined;
        const hover = page
          ? 'cursor-pointer hover-bg-primary hover-color-black'
          : 'cursor-default';
        return (
          <div
            key={i}
            className={`bg-#18181B xl:min-w-39px min-w-32px h-30px px-8px flex items-center justify-center font-700 ${color} ${border} ${hover} xl:text-16px text-14px`}
            onClick={() => {
              if (!page) {
                return;
              }
              onChange(page);
            }}
          >
            {page || '...'}
          </div>
        );
      })}
      <div
        className={`xl:w-39px w-32px h-30px flex items-center justify-center rounded-r-8px ${
          current == total
            ? 'bg-#353538 cursor-not-allowed'
            : 'bg-#18181B hover-bg-primary cursor-pointer [&:hover_svg_path]:fill-black'
        }`}
        onClick={() => {
          onChange(total);
        }}
      >
        <IconGoLast className="xl:h-12px h-10px" />
      </div>
    </div>
  );
};
