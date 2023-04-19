import React from 'react';
import { ReactComponent as LoadingIcon } from '../assets/imgs/loading.svg';
export const Loading = () => {
  return <LoadingIcon />;
};

export const BlurLoading = () => {
  return (
    <div className="absolute top-0 left-0 w-100% h-100% flex justify-center items-center">
      <div className="w-300px">
        <Loading />
      </div>
    </div>
  );
};
