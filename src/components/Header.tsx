import './Header.scss';
import { ReactComponent as IconExplorer } from '../assets/icons/ic-explorer.svg';
import { ReactComponent as IconTrader } from '../assets/icons/ic-trader.svg';
import { ReactComponent as IconLeaderboard } from '../assets/icons/ic-leaderboard.svg';
import { ReactComponent as IconPosition } from '../assets/icons/ic-position.svg';
import { ReactComponent as IconLive } from '../assets/icons/ic-live.svg';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../assets/imgs/level.svg';
import IconBar from '../assets/icons/ic-bar.svg';
import { useState } from 'react';

export const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const location = useLocation();

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
    <div className="overflow-hidden relative lg:static lg:overflow-visible">
      <div
        className="header-bg z-1 absolute top-0 left-0 w-100% h-331px op-20 lg:op-100"
        data-zone={location.pathname.split('/')[1]}
      ></div>
      <div className="relative z-2 flex justify-between items-center px-18px py-15px flex lg:px-30px lg:py-25px">
        <div className="flex items-center lg:w-150px">
          <img
            src={IconBar}
            height={16}
            className="mr-16px lg:hidden hover-op-75"
            onClick={() => {
              toggleMenu(true);
            }}
          />
          <NavLink to={'/'} className={'cursor-pointer'}>
            <img src={Logo} className="h-28px lg:h-34px" />
          </NavLink>
        </div>
        <div className="header-nav-link text-center hidden lg:block">
          <NavLink
            to={'/'}
            className={
              'mr-36px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
            }
          >
            <label className="text-16px font-400 cursor-inherit">Leaderboard</label>
          </NavLink>
          <NavLink
            to={'/traders'}
            className={
              'mr-36px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
            }
          >
            <label className="text-16px font-400 cursor-inherit">Traders</label>
          </NavLink>
          <NavLink
            to={'/positions?status=open'}
            className={
              'mr-36px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
            }
          >
            <label className="text-16px font-400 cursor-inherit">Positions</label>
          </NavLink>
          <NavLink
            to={'/live'}
            className={
              'mr-36px no-underline [&.active>label]:color-primary color-white hover-opacity-75 hover:color-primary [&.active_svg_path]:fill-primary [&_svg_path]:hover:fill-primary'
            }
          >
            <label className="text-16px font-400 cursor-inherit">Live</label>
          </NavLink>
        </div>
        <div className="lg:w-150px flex justify-end items-center">
          <a
            href="https://app.level.finance/"
            className="color-primary flex items-center font-700 no-underline hover-opacity-75 [&>_svg_path]:fill-primary lg:text-16px text-14px"
          >
            Go to App
            <IconExplorer height={14} className={'ml-9px'} />
          </a>
        </div>
      </div>
      {/* mobile */}
      <div className="lg:hidden">
        {menuVisible && (
          <div
            onClick={() => {
              toggleMenu(false);
            }}
            className="fixed top-0 left-0 h-100% w-100% bg-black bg-op-20 z-1002"
          ></div>
        )}
        <div
          className="fixed top-0 left-0 h-100% w-300px bg-#34343B z-1001 menu"
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
