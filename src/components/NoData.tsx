import React from 'react';
import IconNoData from '../assets/icons/ic-no-data.svg';

export const NoData: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <img src={IconNoData} className={'h-60px'} />
      <label className="color-#adabab mt-20px">No records found</label>
    </div>
  );
};
