import { useLeaderboard } from '../../hooks/useLeaderboard';
import { LeaderboardBox } from './conponents/LeaderboardBox';
import { TopTrader } from './conponents/TopTrader';

export const Leaderboard = () => {
  const { data, loading } = useLeaderboard();
  return (
    <div className="mx-14px xl:mx-60px my-20px">
      <TopTrader items={data.allTime} loading={loading} />
      <LeaderboardBox
        currentMonth={data.currentMonth}
        currentWeek={data.currentWeek}
        loading={loading}
        preMonth={data.preMonth}
        preWeek={data.preWeek}
      />
    </div>
  );
};
