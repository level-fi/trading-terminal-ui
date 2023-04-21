import React, { useMemo } from 'react';

const Size = {
  md: 'xl:leading-22px xl:text-16px xl:font-800 leading-18px text-14px font-400 px-7px rounded-7px',
  sm: 'leading-1 xl:text-14px text-12px font-400 px-6px rounded-5px',
};
interface PositionStatusProps {
  closed: boolean;
  size?: keyof typeof Size;
}
export const PositionStatus: React.FC<PositionStatusProps> = ({ closed, size = 'md' }) => {
  const [color, border, bg] = useMemo(
    () =>
      closed ? ['color-#cdcdcd', 'b-#cdcdcd', 'bg-#cdcdcd'] : ['color-win', 'b-win', 'bg-win'],
    [closed],
  );
  return (
    <span className={`${Size[size]} b-1px b-solid ${color} ${border} ${bg} bg-op-9 uppercase`}>
      {closed ? 'closed' : 'open'}
    </span>
  );
};
