import { format, fromUnixTime } from 'date-fns';

export const shortenAddress = (address: string, firstLength?: number, lastLength?: number) => {
  if (address && address.length > 0) {
    return `${address.substring(0, firstLength || 6)}...${address.substring(
      address.length - (lastLength || 4),
      address.length,
    )}`;
  }
};

export const profitColor = (input?: number) => {
  return !input ? 'color-white' : input > 0 ? 'color-win' : 'color-loss';
};

export const unixToDate = (unix: number, formatter = 'yyyy-MM-dd HH:mm:ss'): string => {
  return unix ? format(fromUnixTime(unix), formatter) : null;
};

export const getUTCDate = (input: Date) => {
  return new Date(
    input.getUTCFullYear(),
    input.getUTCMonth(),
    input.getUTCDate(),
    input.getUTCHours(),
    input.getUTCMinutes(),
    input.getUTCSeconds(),
  );
};
