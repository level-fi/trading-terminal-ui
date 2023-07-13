import { useQuery } from '@tanstack/react-query';
import { LeaderboardBox } from './components/LeaderboardBox';
import { TopTrader } from './components/TopTrader';
import { queryLeaderboard } from '../../utils/queries';

export const Leaderboard = () => {
  const { data, isInitialLoading } = useQuery(queryLeaderboard());
  const items = data ? data.data : undefined;
  return (
    <div className="mx-14px xl:mx-60px my-20px">
      <TopTrader items={items?.allTime || []} loading={isInitialLoading} />
      <LeaderboardBox
        currentMonth={items?.currentMonth || []}
        currentWeek={items?.currentWeek || []}
        loading={isInitialLoading}
        preMonth={items?.preMonth || []}
        preWeek={items?.preWeek || []}
      />
    </div>
  );
};
