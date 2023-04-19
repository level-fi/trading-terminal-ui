import React from 'react';
import { LeaderboardBoxItem } from './LeaderboardBoxItem';
import { LeaderboardItem } from '../../../utils/type';

interface LeaderboardBoxProps {
  loading: boolean;
  currentMonth: LeaderboardItem[];
  currentWeek: LeaderboardItem[];
  preMonth: LeaderboardItem[];
  preWeek: LeaderboardItem[];
}
export const LeaderboardBox: React.FC<LeaderboardBoxProps> = ({
  currentMonth,
  currentWeek,
  loading,
  preMonth,
  preWeek,
}) => {
  return (
    <div className="container grid grid-cols-1 lg:grid-cols-2 grid-rows-2 grid-rows-1 lg:grid-rows-2 gap-x-0px lg:gap-x-86px gap-y-25px lg:gap-y-25px m-x-auto mt-40px lg:mt-50px mb-20px px-15px lg:px-0px pb-0px lg:pb-20px">
      {!loading && !currentMonth?.length ? undefined : (
        <LeaderboardBoxItem title="This Month" traders={currentMonth} loading={loading} />
      )}
      {!loading && !currentWeek?.length ? undefined : (
        <LeaderboardBoxItem title="This Week" traders={currentWeek} loading={loading} />
      )}
      {!loading && !preMonth?.length ? undefined : (
        <LeaderboardBoxItem title="Last Month" traders={preMonth} loading={loading} />
      )}
      {!loading && !preWeek?.length ? undefined : (
        <LeaderboardBoxItem title="Last Week" traders={preWeek} loading={loading} />
      )}
    </div>
  );
};
