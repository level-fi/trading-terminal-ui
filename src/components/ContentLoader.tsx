import React from 'react';
import ContentLoader from 'react-content-loader';

export const TopTraderContentLoader = () => {
  return (
    <ContentLoader
      speed={2}
      height="55"
      width={'100'}
      backgroundColor="#47362d"
      foregroundColor="#6a5347"
    >
      <rect x="20" y="0" rx="5" ry="5" width="60" height="10" />
      <rect x="0" y="24" rx="5" ry="5" width="100" height="12" />
    </ContentLoader>
  );
};

export const TopTraderContentLoaderMobile = () => {
  return (
    <ContentLoader
      speed={2}
      height="42"
      width={'80'}
      backgroundColor="#47362d"
      foregroundColor="#6a5347"
    >
      <rect x="10" y="0" rx="5" ry="5" width="60" height="8" />
      <rect x="0" y="18" rx="5" ry="5" width="80" height="10" />
    </ContentLoader>
  );
};

export const LeaderBoardContentLoader = () => {
  return (
    <ContentLoader
      speed={2}
      height="221px"
      width={'100%'}
      backgroundColor="#24242a"
      foregroundColor="#2a2a33"
    >
      <rect
        x="15"
        y="0"
        rx="5"
        ry="5"
        style={{
          width: `calc(100% - 15px)`,
          transform: 'skew(-15deg)',
        }}
        height="63"
      />
      <rect
        x="35"
        y="78"
        rx="5"
        ry="5"
        style={{
          width: `calc(100% - 15px)`,
          transform: 'skew(-15deg)',
        }}
        height="63"
      />
      <rect
        x="55"
        y="156"
        rx="5"
        ry="5"
        style={{
          width: `calc(100% - 15px)`,
          transform: 'skew(-15deg)',
        }}
        height="63"
      />
    </ContentLoader>
  );
};

export const PositionDetailPriceContentLoader = () => {
  return (
    <ContentLoader
      speed={1}
      height={'100%'}
      width={'100%'}
      backgroundColor="#313131"
      foregroundColor="#c2c2c2"
    >
      <rect
        height={22}
        width={'20%'}
        rx={5}
        ry={5}
        x={`80%`}
        y={18}
        style={{ transform: 'translateX(-20px)' }}
      />
      <rect
        height={21}
        width={'30%'}
        rx={5}
        ry={5}
        x={`70%`}
        y={54}
        style={{ transform: 'translateX(-20px)' }}
      />
      <rect
        height={21}
        width={'17%'}
        rx={5}
        ry={5}
        x={`83%`}
        y={89}
        style={{ transform: 'translateX(-20px)' }}
      />
      <rect
        height={21}
        width={'17%'}
        rx={5}
        ry={5}
        x={`83%`}
        y={124}
        style={{ transform: 'translateX(-20px)' }}
      />
      <rect
        height={21}
        width={'23%'}
        rx={5}
        ry={5}
        x={`77%`}
        y={159}
        style={{ transform: 'translateX(-20px)' }}
      />
    </ContentLoader>
  );
};

export const PositionDetailInfoContentLoader = () => {
  return (
    <ContentLoader
      speed={1}
      height={'100%'}
      width={'100%'}
      backgroundColor="#313131"
      foregroundColor="#c2c2c2"
    >
      <rect
        height={21}
        width={'50%'}
        rx={5}
        ry={5}
        x={`50%`}
        y={18}
        style={{ transform: 'translateX(-20px)' }}
      />
      <rect
        height={21}
        width={'30%'}
        rx={5}
        ry={5}
        x={`70%`}
        y={54}
        style={{ transform: 'translateX(-20px)' }}
      />
      <rect
        height={21}
        width={'40%'}
        rx={5}
        ry={5}
        x={`60%`}
        y={89}
        style={{ transform: 'translateX(-20px)' }}
      />
      <rect
        height={21}
        width={'22%'}
        rx={5}
        ry={5}
        x={`78%`}
        y={143}
        style={{ transform: 'translateX(-20px)' }}
      />
      <rect
        height={21}
        width={'30%'}
        rx={5}
        ry={5}
        x={`70%`}
        y={178}
        style={{ transform: 'translateX(-20px)' }}
      />
    </ContentLoader>
  );
};

interface RectLoaderProps {
  height?: number;
}
export const RectLoader: React.FC<RectLoaderProps> = ({ height = 21 }) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#24242a"
      foregroundColor="#2a2a33"
      width={'100%'}
      height={height}
    >
      <rect height={height} width={'100%'} rx={5} ry={5} />
    </ContentLoader>
  );
};

export const PositionItemContentLoader = () => {
  return (
    <div className="absolute top-0 left-0 h-100% w-100%">
      <ContentLoader
        speed={2}
        height="100%"
        width={'100%'}
        backgroundColor="#494949"
        foregroundColor="#9c9c9c"
      >
        <rect x={14} y={14} height={32} width={32} rx={16} ry={16} />
        <rect x={50} y={13} height={16} width={110} rx={5} ry={5} />
        <rect x={50} y={35} height={10} width={80} rx={5} ry={5} />
        <rect
          x={'60%'}
          y={70}
          height={15}
          rx={5}
          ry={5}
          width={'40%'}
          style={{ transform: 'translateX(-14px)' }}
        />
        <rect
          x={'70%'}
          y={98}
          height={15}
          rx={5}
          ry={5}
          width={'30%'}
          style={{ transform: 'translateX(-14px)' }}
        />
        <rect
          x={'85%'}
          y={126}
          height={15}
          rx={5}
          ry={5}
          width={'15%'}
          style={{ transform: 'translateX(-14px)' }}
        />
        <rect
          x={'50%'}
          y={154}
          height={15}
          rx={5}
          ry={5}
          width={'50%'}
          style={{ transform: 'translateX(-14px)' }}
        />
      </ContentLoader>
    </div>
  );
};

export const TraderItemContentLoader = () => {
  return (
    <div className="absolute top-0 left-0 h-100% w-100%">
      <ContentLoader
        speed={2}
        height="100%"
        width={'100%'}
        backgroundColor="#494949"
        foregroundColor="#9c9c9c"
      >
        <rect x={14} y={14} height={32} width={32} rx={12} ry={12} />
        <rect x={54} y={20} height={16} width={130} rx={5} ry={5} />
        <rect
          x={'90%'}
          y={20}
          height={20}
          width={'10%'}
          rx={5}
          ry={5}
          style={{ transform: 'translateX(-14px)' }}
        />
        <rect
          x={'60%'}
          y={71}
          height={15}
          rx={5}
          ry={5}
          width={'40%'}
          style={{ transform: 'translateX(-14px)' }}
        />
        <rect
          x={'70%'}
          y={99}
          height={15}
          rx={5}
          ry={5}
          width={'30%'}
          style={{ transform: 'translateX(-14px)' }}
        />
        <rect
          x={'80%'}
          y={127}
          height={15}
          rx={5}
          ry={5}
          width={'20%'}
          style={{ transform: 'translateX(-14px)' }}
        />
      </ContentLoader>
    </div>
  );
};
