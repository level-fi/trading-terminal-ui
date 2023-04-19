import { BigNumber, utils } from 'ethers';
// Format utils

export type FormatOption = {
  locale: string;
  compact: boolean;
  fractionDigits: number;
  keepTrailingZeros: boolean;
  significantDigits?: number;
  percentage?: boolean;
  currency?: string;
  thousandGrouping: boolean;
};

const defaultFormat: FormatOption = {
  locale: 'en-US',
  compact: false,
  keepTrailingZeros: false,
  fractionDigits: 3,
  percentage: false,
  currency: '',
  thousandGrouping: true,
};

/**
 * convert format option to Intl options
 */
const parseConfig = (fmt: FormatOption): Intl.NumberFormatOptions => {
  const ret: Intl.NumberFormatOptions = {
    maximumFractionDigits: fmt.fractionDigits,
  };

  if (fmt.compact) {
    ret.notation = 'compact';
  }
  if (fmt.keepTrailingZeros) {
    ret.minimumFractionDigits = fmt.fractionDigits;
  }

  if (fmt.significantDigits) {
    ret.minimumSignificantDigits = fmt.significantDigits;
    // ret.maximumFractionDigits = null;
  }

  if (fmt.percentage) {
    ret.style = 'percent';
  }

  if (fmt.currency) {
    ret.style = 'currency';
    ret.currency = fmt.currency;
    ret.minimumFractionDigits = fmt.keepTrailingZeros ? fmt.fractionDigits : 0;
  }

  if (fmt.thousandGrouping) {
    ret.useGrouping = fmt.thousandGrouping;
  }

  return ret;
};

const defaultFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 3,
  useGrouping: true,
});

/**
 * format fixed string to variours format
 * @param fixed fixed string number
 */
export const formatNumber = (input: number, options?: Partial<FormatOption>): string => {
  if (input == null || isNaN(input)) {
    return '';
  }
  let formatter: Intl.NumberFormat;
  if (!options) {
    formatter = defaultFormatter;
  } else {
    formatter = new Intl.NumberFormat(
      'en-US',
      parseConfig({
        ...defaultFormat,
        ...options,
      }),
    );
  }
  return formatter.format(input);
};

export const formatNumberWithThreshold = (
  input: number,
  options?: Partial<FormatOption>,
  threshold = 0.01,
): string => {
  if (input && threshold && Math.abs(input) < threshold) {
    return `${input > 0 ? '<' : '≈ -'}${formatNumber(threshold, {
      ...options,
      significantDigits: 1,
      compact: false,
    })}`;
  }
  return formatNumber(input, options);
};

export const formatCurrency = (input: number, fractionDigits?: number) => {
  return formatNumberWithThreshold(
    input,
    {
      currency: 'USD',
      fractionDigits: fractionDigits !== undefined ? fractionDigits : 2,
      keepTrailingZeros: true,
    },
    0.01,
  );
};

export const formatProfit = (input: number) => {
  return `${input > 0 ? '+' : ''}${formatCurrency(input)}`;
};

export const formatBigNumber = (
  input: BigNumber,
  decimals: number,
  option?: Partial<FormatOption>,
  threshold?: number,
  prefix?: string,
): string => {
  if (!input) {
    return '-';
  }
  let value = +utils.formatUnits(input, decimals);
  if (threshold && value > 0 && value < threshold) {
    return `<${prefix || ''}${formatNumber(threshold, {
      ...option,
      significantDigits: 1,
      compact: false,
    })}`;
  }
  if (value < 0) {
    value = Math.abs(value);
    prefix = `-${prefix || ''}`;
  }
  return `${prefix || ''}${formatNumber(value, option)}`;
};
