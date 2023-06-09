import './TopTrader.scss';
import img1st from '../../../assets/imgs/1st.svg';
import img2st from '../../../assets/imgs/2st.svg';
import img3st from '../../../assets/imgs/3st.svg';
import { shortenAddress } from '../../../utils';
import { formatCurrency } from '../../../utils/numbers';
import { NavLink } from 'react-router-dom';
import {
  TopTraderContentLoader,
  TopTraderContentLoaderMobile,
} from '../../../components/ContentLoader';
import { Tier1 } from '../../../components/Tier1';
import { Tier2 } from '../../../components/Tier2';
import React from 'react';
import { LeaderboardItem } from '../../../utils/type';

interface TopTraderProps {
  items: LeaderboardItem[];
  loading: boolean;
}
export const TopTrader: React.FC<TopTraderProps> = ({ items, loading }) => {
  return (
    <div className="flex justify-center mx-auto my-0 mt-20px">
      <div className="tier-info">
        <Tier2 wallet={items?.[1]?.wallet} />
        {loading ? (
          <>
            <div className="block xl:hidden">
              <TopTraderContentLoaderMobile />
            </div>
            <div className="hidden xl:block">
              <TopTraderContentLoader />
            </div>
          </>
        ) : (
          <>
            <NavLink
              to={`/traders/${items?.[1]?.wallet}`}
              state={{ from: 'leaderboard' }}
              className="no-underline hover:color-#ffffffc4 font-600 text-10px xl:text-16px color-#fff pb-8px"
            >
              {shortenAddress(items?.[1]?.wallet)}
            </NavLink>
            <p className="font-700 text-12px xl:text-18px color-#FFD339 pb-15px">
              {formatCurrency(items?.[1]?.volume, 0)}
            </p>
          </>
        )}
        <div className="w-145px xl:w-210px h-66px xl:h-96px mr--30px xl:mr--50px">
          <img src={img2st} className="w-100% h-100%" />
        </div>
      </div>
      <div className="tier-info">
        <Tier1 wallet={items?.[0]?.wallet} />
        {loading ? (
          <>
            <div className="block xl:hidden">
              <TopTraderContentLoaderMobile />
            </div>
            <div className="hidden xl:block">
              <TopTraderContentLoader />
            </div>
          </>
        ) : (
          <>
            <NavLink
              to={`/traders/${items?.[0]?.wallet}`}
              state={{ from: 'leaderboard' }}
              className="no-underline hover:color-#ffffffc4 font-600 text-10px xl:text-16px color-#fff pb-8px"
            >
              {shortenAddress(items?.[0]?.wallet)}
            </NavLink>
            <p className="font-700 text-12px xl:text-18px color-#FFD339 pb-15px">
              {formatCurrency(items?.[0]?.volume, 0)}
            </p>
          </>
        )}
        <div className="w-130px xl:w-190px h-94px xl:h-137px z-1 tier-shadow">
          <img src={img1st} className="w-100% h-100%" />
        </div>
      </div>
      <div className="tier-info">
        <Tier2 wallet={items?.[2]?.wallet} />
        {loading ? (
          <>
            <div className="block xl:hidden">
              <TopTraderContentLoaderMobile />
            </div>
            <div className="hidden xl:block">
              <TopTraderContentLoader />
            </div>
          </>
        ) : (
          <>
            <NavLink
              to={`/traders/${items?.[2]?.wallet}`}
              state={{ from: 'leaderboard' }}
              className="no-underline hover:color-#ffffffc4 font-600 text-10px xl:text-16px color-#fff pb-8px"
            >
              {shortenAddress(items?.[2]?.wallet)}
            </NavLink>
            <p className="font-700 text-12px xl:text-18px color-#FFD339 pb-15px">
              {formatCurrency(items?.[2]?.volume, 0)}
            </p>
          </>
        )}
        <div className="w-135px xl:w-205px h-52px xl:h-78px ml--30px lf:ml--50px">
          <img src={img3st} className="w-100% h-100%" />
        </div>
      </div>
    </div>
  );
};
