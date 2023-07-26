import { useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ReactComponent as IconGoBack } from '../../assets/icons/ic-go-back.svg';
import { TraderDetailPanel } from './components/TraderDetailInfo';
import { LeverageInfo } from './components/LeverageInfo';
import { SwapInfo } from './components/SwapInfo';
import { useQuery } from '@tanstack/react-query';
import { queryTrader } from '../../utils/queries';

export const TraderDetail = () => {
  const { wallet } = useParams();
  const { data, isInitialLoading } = useQuery(queryTrader(wallet));
  const navigate = useNavigate();
  const location = useLocation();
  const goBack = useCallback(() => {
    if (location?.state?.from) {
      navigate(-1);
      return;
    }
    navigate('/traders', { replace: true });
  }, [location?.state?.from, navigate]);

  return (
    <div className="mx-14px xl:mx-60px mt-20px pb-30px">
      <div className="flex justify-start">
        <span
          onClick={goBack}
          className="flex items-center color-primary font-500 cursor-pointer hover-opacity-75"
        >
          <IconGoBack height={12} className={'mr-8px'} />
          Back to list
        </span>
      </div>
      <div className="mt-15px">
        <TraderDetailPanel item={data} wallet={wallet} loading={isInitialLoading} />
      </div>
      <div className="mt-32px">
        <LeverageInfo
          wallet={wallet}
          totalOpen={data?.data?.totalOpen}
          totalClosed={data?.data?.totalClosed}
          totalLiquidated={data?.data?.totalLiquidated}
        />
      </div>
      <div className="mt-32px">
        <SwapInfo wallet={wallet} />
      </div>
    </div>
  );
};
