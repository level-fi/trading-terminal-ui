import { useEffect, useRef } from 'react';

export const useLongPolling = (
  callback: (loaded?: number) => Promise<unknown>,
  opts: { time: number; retriable: boolean; enabled: boolean; fireable?: any },
) => {
  const callbackRef = useRef<(() => unknown) | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);
  const failedTimes = useRef(0);
  const loadedTimes = useRef(0);

  useEffect(() => {
    callbackRef.current = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (!opts.enabled) {
        return;
      }
      callback(loadedTimes.current)
        .then(() => {
          failedTimes.current = 0;
        })
        .catch(() => {
          failedTimes.current += 1;
        })
        .finally(() => {
          loadedTimes.current += 1;
          const timeout = opts.retriable ? opts.time * (failedTimes.current + 1) : opts.time;
          timeoutRef.current = setTimeout(() => {
            if (!callbackRef.current) {
              return;
            }
            callbackRef.current();
          }, timeout);
        });
    };
  }, [callback, opts.enabled, opts.retriable, opts.time]);

  useEffect(() => {
    if (!callbackRef.current) {
      return () => {};
    }
    loadedTimes.current = 0;
    callbackRef.current();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (callbackRef.current) {
        callbackRef.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.enabled, opts.retriable, opts.time, opts.fireable]);
};
