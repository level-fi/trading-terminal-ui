import React, { useMemo } from 'react';
import ContentLoader from 'react-content-loader';

interface TableContentLoaderProps {
  header: HTMLDivElement;
  length: number;
  className: string;
  itemHeight: number;
}
export const TableContentLoader: React.FC<TableContentLoaderProps> = ({
  header,
  length,
  className,
  itemHeight,
}) => {
  const horizontalPoints = useMemo(() => {
    if (!header) {
      return [];
    }
    const x: number[] = [];
    const titleNodes = header.childNodes;
    const parentX = header.offsetLeft;
    for (let i = 0; i < titleNodes.length; i++) {
      const node = titleNodes[i];
      if (!node.childNodes.length) {
        continue;
      }
      const childX = (node.childNodes[0] as HTMLElement)?.offsetLeft;
      x.push(childX - parentX);
    }
    return x;
  }, [header]);
  return (
    <div>
      {[...new Array(length)].map((_, i) => (
        <div key={i} className={className}>
          <RowContentLoader
            horizontalPoints={horizontalPoints}
            width={header?.offsetWidth}
            height={itemHeight}
          />
        </div>
      ))}
    </div>
  );
};
interface RowContentLoaderProps {
  horizontalPoints: number[];
  width: number;
  height: number;
}
interface LoaderItem {
  x: number;
  width: number;
}
const RowContentLoader: React.FC<RowContentLoaderProps> = ({
  horizontalPoints,
  width,
  height,
}) => {
  const loaders = useMemo<LoaderItem[]>(() => {
    if (!horizontalPoints.length) {
      return [];
    }
    const results: LoaderItem[] = [];
    [...horizontalPoints, width].reduce((pre, cur) => {
      if (!pre || !cur) {
        return cur;
      }
      results.push({
        x: pre,
        width: (cur - pre) * (Math.random() * (1 - 0.7) + 0.7) - 20,
      });
      return cur;
    });
    return results;
  }, [horizontalPoints, width]);
  if (!loaders.length) {
    return <></>;
  }
  return (
    <ContentLoader
      speed={2}
      height="100%"
      width={'100%'}
      backgroundColor="#494949"
      foregroundColor="#9c9c9c"
    >
      {loaders.map(({ width, x }) => (
        <rect key={x} x={x} y={height / 2 - 10} width={width} height={20} rx={5} ry={5} />
      ))}
    </ContentLoader>
  );
};
