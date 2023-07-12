import { useQuery } from '@tanstack/react-query';
import { LeaderboardBox } from './components/LeaderboardBox';
import { TopTrader } from './components/TopTrader';
import { queryLeaderboard } from '../../utils/queries';

export const Leaderboard = () => {
  const { data, isInitialLoading } = useQuery(queryLeaderboard());
  return (
    <div className="mx-14px xl:mx-60px my-20px">
      <TopTrader items={data.allTime} loading={isInitialLoading} />
      <LeaderboardBox
        currentMonth={data.currentMonth}
        currentWeek={data.currentWeek}
        loading={isInitialLoading}
        preMonth={data.preMonth}
        preWeek={data.preWeek}
      />
    </div>
  );
};
