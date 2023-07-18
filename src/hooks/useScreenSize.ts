import { useState, useLayoutEffect } from 'react';

export const breakPoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

const getTargetSize = (w: Window = window) => {
  if (!w.outerWidth) {
    return w.innerWidth;
  }
  return Math.min(w.outerWidth, w.innerWidth);
};

export const useScreenSize = (breakPoint: keyof typeof breakPoints) => {
  const size = parseInt(breakPoints[breakPoint].replace('px', ''), 10);
  const [onSize, setOnSize] = useState(size > getTargetSize());

  useLayoutEffect(() => {
    const resizeEvent: EventListener = (e: Event) => {
      const window = e.target as Window;
      setOnSize(size > getTargetSize(window));
    };
    addEventListener('resize', resizeEvent);
    return () => {
      removeEventListener('resize', resizeEvent);
    };
  }, [size]);

  return onSize;
};
