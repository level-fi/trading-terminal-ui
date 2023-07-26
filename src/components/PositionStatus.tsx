import React, { useMemo } from 'react';
import { PositionStatus as Status } from '../utils/type';

const Size = {
  md: 'xl:(h-24px text-14px) h-18px text-12px font-400 px-7px rounded-6px',
  sm: 'xl:text-12px text-10px font-400 px-6px rounded-4px',
};
interface PositionStatusProps {
  status: Status;
  size?: keyof typeof Size;
}
export const PositionStatus: React.FC<PositionStatusProps> = ({ status, size = 'md' }) => {
  const [content, color, border, bg] = useMemo(() => {
    switch (status) {
      case Status.CLOSE:
        return ['closed', 'color-#cdcdcd', 'b-#cdcdcd', 'bg-#cdcdcd'];
      case Status.LIQUIDATED:
        return ['liquidated', 'color-loss', 'b-loss', 'bg-loss'];
      case Status.OPEN:
        return ['open', 'color-win', 'b-win', 'bg-win'];
    }
    return [];
  }, [status]);
  return (
    <span className={`${Size[size]} b-1px b-solid ${color} ${border} ${bg} bg-op-9 uppercase`}>
      {content}
    </span>
  );
};
