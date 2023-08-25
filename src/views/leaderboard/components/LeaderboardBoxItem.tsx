import './LeaderboardBoxItem.scss';
import { shortenAddress } from '../../../utils';
import { formatCurrency } from '../../../utils/numbers';
import { Avatar } from '../../../components/Avatar';
import { NavLink } from 'react-router-dom';
import { LeaderBoardContentLoader } from '../../../components/ContentLoader';
import { LeaderboardItem } from '../../../utils/type';

type LeaderboardBoxItemProps = {
  loading: boolean;
  title: string;
  traders: LeaderboardItem[];
};

export const LeaderboardBoxItem: React.FC<LeaderboardBoxItemProps> = ({
  loading,
  title,
  traders,
}) => {
  return (
    <div>
      <div className="pb-20px font-800 text-18px xl:text-22px color-#fff">{title}</div>
      {loading ? (
        <LeaderBoardContentLoader />
      ) : (
        <div>
          {traders.map((trader, index) => (
            <NavLink
              key={index}
              to={`/traders/${trader.wallet}`}
              state={{ from: 'leaderboard' }}
              className={`no-underline trader-item ${
                index === 0 ? 'trader-item-highlight' : ''
              } flex items-center mb-16px p-x-15px xl:p-x-25px p-y-10px xl:p-y-15px color-#fff`}
            >
              <div
                className={`tier-1 font-800 text-16px xl:text-32px mr-10px xl:mr-32px bg-clip-text tier-${
                  index + 1
                }`}
              >
                {index + 1}
              </div>
              <Avatar wallet={trader.wallet} size={30} />
              <div className="ml-9px font-normal xl:font-500 text-14px xl:text-16px">
                <span className="inline xl:hidden xl:hidden">
                  {shortenAddress(trader.wallet)}
                </span>
                <span className="hidden xl:inline xl:hidden">
                  {shortenAddress(trader.wallet)}
                </span>
                <span className="hidden xl:inline 2xl:hidden">
                  {shortenAddress(trader.wallet, 12, 8)}
                </span>
                <span className="hidden xl:hidden 2xl:inline">
                  {shortenAddress(trader.wallet, 20, 10)}
                </span>
              </div>
              <div className="ml-auto font-800 text-14px xl:text-20px color-#ffd339">
                {formatCurrency(trader.volume, 0)}
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
