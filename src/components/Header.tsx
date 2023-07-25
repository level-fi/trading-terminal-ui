import './Header.scss';
import { ReactComponent as IconExplorer } from '../assets/icons/ic-explorer.svg';
import { ReactComponent as IconTrader } from '../assets/icons/ic-trader.svg';
import { ReactComponent as IconLeaderboard } from '../assets/icons/ic-leaderboard.svg';
import { ReactComponent as IconPosition } from '../assets/icons/ic-position.svg';
import { ReactComponent as IconLive } from '../assets/icons/ic-live.svg';
import IconSearch from '../assets/icons/ic-search.svg';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/imgs/level.svg';
import IconBar from '../assets/icons/ic-bar.svg';
import { useCallback, useState } from 'react';
import { utils } from 'ethers';
import c from 'classnames';

export const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchContent, setSearchContent] = useState('');
  const location = useLocation();

  const navigate = useNavigate();
  const search = useCallback(
    (content: string) => {
      setSearchContent('');
      if (!utils.isAddress(content?.toLowerCase())) {
        return;
      }
      navigate(`/traders/${content}`);
    },
    [navigate],
  );

  const toggleMenu = (visible: boolean) => {
    setMenuVisible(visible);
    const body = document.body || document.querySelector('body');
    if (body) {
      if (visible) {
        body.classList.add('no-scroll');
      } else {
        body.classList.remove('no-scroll');
      }
    }
  };

  return (
    <div className="overflow-hidden relative xl:static xl:overflow-visible">
      <div
        className="header-bg z-1 absolute top-0 left-0 w-100% h-331px op-20 xl:op-100"
        data-zone={location.pathname.split('/')[1]}
      ></div>
      <div
        className={c(
          'relative z-2',
          'grid grid-cols-[auto_auto] grid-rows-2 items-center',
          'px-18px py-15px',
          'md:(px-30px py-25px flex justify-between)',
        )}
      >
        <div className="flex items-center order-1">
          <img
            src={IconBar}
            height={16}
            className="mr-16px xl:hidden hover-op-75"
            onClick={() => {
              toggleMenu(true);
            }}
          />
          <NavLink to={'/'} className={'cursor-pointer'}>
            <img src={Logo} className="h-28px xl:h-34px" />
          </NavLink>
        </div>
        {/* menu */}
        <div className="header-nav-link hidden xl:block ml-24px order-2">
          <NavLink
            to={'/'}
            className={
              'mx-24px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
            }
          >
            <label className="text-16px font-400 cursor-inherit">Leaderboard</label>
          </NavLink>
          <NavLink
            to={'/traders'}
            className={
              'mx-24px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
            }
          >
            <label className="text-16px font-400 cursor-inherit">Traders</label>
          </NavLink>
          <NavLink
            to={'/positions?status=open'}
            className={
              'mx-24px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
            }
          >
            <label className="text-16px font-400 cursor-inherit">Positions</label>
          </NavLink>
          <NavLink
            to={'/live'}
            className={
              'mx-24px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
            }
          >
            <label className="text-16px font-400 cursor-inherit">Live</label>
          </NavLink>
        </div>
        {/* search */}
        <form className="ml-auto mr-40px mt-10px order-4 col-span-2 w-100% md:(w-424px order-3 mt-0)">
          <div className="bg-black bg-op-45 rounded-10px flex items-center">
            <img src={IconSearch} className="h-14px mr-8px ml-20px" />
            <input
              type="text"
              placeholder="Enter or paste an address"
              className="text-14px bg-transparent border-none flex-1 outline-none color-white"
              value={searchContent}
              onChange={(event) => {
                setSearchContent(event?.target?.value);
              }}
            />
            <button
              type="submit"
              onClick={() => search(searchContent)}
              disabled={!searchContent}
              className="text-14px xl:text-16px bg-primary border-none outline-none h-36px w-76px xl:w-94px m-3px rounded-8px font-700 hover-cursor-pointer hover-bg-opacity-75 disabled-hover-bg-opacity-100 disabled-bg-#706E6A disabled-text-black disabled-hover-cursor-not-allowed"
            >
              SEARCH
            </button>
          </div>
        </form>
        {/* go to app */}
        <div className="flex items-center justify-end order-3 md:order-4">
          <a
            href="https://app.level.finance/"
            className="color-primary flex items-center font-700 no-underline hover-opacity-75 [&>_svg_path]:fill-primary xl:text-16px text-14px"
          >
            Go to App
            <IconExplorer height={14} className={'ml-9px'} />
          </a>
        </div>
      </div>
      {/* mobile */}
      <div className="xl:hidden">
        {menuVisible && (
          <div
            onClick={() => {
              toggleMenu(false);
            }}
            className="fixed top-0 left-0 h-100% w-100% bg-black bg-op-20 z-1002"
          ></div>
        )}
        <div
          className="fixed top-0 left-0 h-100% w-300px bg-#34343B z-1003 menu"
          data-visible={menuVisible}
        >
          <div className="menu-bg w-100% h-100%" data-zone={location.pathname.split('/')[1]}>
            <div className="flex flex-col h-100% px-24px">
              <NavLink
                onClick={() => {
                  toggleMenu(false);
                }}
                to={'/'}
                className={
                  'flex items-center py-12px pt-50px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
                }
              >
                <IconLeaderboard className="mr-12px w-18px" />
                <label className="text-16px font-400 cursor-inherit">Leaderboard</label>
              </NavLink>
              <NavLink
                onClick={() => {
                  toggleMenu(false);
                }}
                to={'/traders'}
                className={
                  'flex items-center py-12px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
                }
              >
                <IconTrader className="mr-12px w-18px" />
                <label className="text-16px font-400 cursor-inherit">Traders</label>
              </NavLink>
              <NavLink
                onClick={() => {
                  toggleMenu(false);
                }}
                to={'/positions?status=open'}
                className={
                  'flex items-center py-12px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
                }
              >
                <IconPosition className="mr-12px w-18px" />
                <label className="text-16px font-400 cursor-inherit">Positions</label>
              </NavLink>
              <NavLink
                onClick={() => {
                  toggleMenu(false);
                }}
                to={'/live'}
                className={
                  'flex items-center py-12px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
                }
              >
                <IconLive className="mr-12px w-18px" />
                <label className="text-16px font-400 cursor-inherit">Live</label>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
