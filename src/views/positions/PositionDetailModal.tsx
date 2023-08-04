import { NavLink, useSearchParams } from 'react-router-dom';
import { formatBigNumber, formatCurrency, formatProfit } from '../../utils/numbers';
import { PositionHistories } from './components/PositionHistories';
import {
  PositionDetailInfoContentLoader,
  PositionDetailPriceContentLoader,
} from '../../components/ContentLoader';
import { profitColor, shortenAddress } from '../../utils';
import { useLiqPrice } from '../../hooks/useLiqPrice';
import { VALUE_DECIMALS, getChainConfig, getTokenByAddress } from '../../config';
import { Moddal } from '../../components/Modal';
import { useCallback, useMemo } from 'react';
import IconX from '../../assets/icons/ic-x.svg';
import { TokenSymbol } from '../../components/TokenSymbol';
import { Side } from '../../utils/type';
import { PositionStatus } from '../../components/PositionStatus';
import { Tooltip } from '../../components/Tooltip';
import { useQuery } from '@tanstack/react-query';
import { queryPosition } from '../../utils/queries';
import { chainLogos } from '../../utils/constant';

export const PositionDetailModal = () => {
  const [params, setParams] = useSearchParams();
  const id = useMemo(() => params.get('position_id'), [params]);
  const { data, isInitialLoading } = useQuery(queryPosition(id, false));

  const item = data ? data.data : undefined;
  const indexToken = getTokenByAddress(item?.histories?.[0]?.indexToken, item?.chainId);
  const chainConfig = item ? getChainConfig(item.chainId) : undefined;
  const side = item?.histories?.[0]?.side;
  const wallet = item?.histories?.[0]?.account;

  const liqPrice = useLiqPrice({
    rawBorrowFee: item?.borrowFee,
    rawCloseFee: item?.closeFee,
    rawSize: item?.size,
    rawCollateralValue: item?.collateral,
    rawEntry: item?.entryPrice,
    decimals: indexToken?.decimals,
    side: side,
    chainId: item?.chainId,
  });
  const leverage = useMemo(() => {
    if (!item?.netValue || !item?.size) {
      return;
    }
    return item.size / item.netValue;
  }, [item?.netValue, item?.size]);

  const closeModal = useCallback(() => {
    params.delete('position_id');
    setParams(params);
  }, [params, setParams]);

  return (
    <Moddal visible={!!id} close={closeModal}>
      <div>
        <div className="flex justify-between items-start">
          {isInitialLoading ? (
            <div></div>
          ) : (
            <div className="flex items-center">
              <div className="hidden xl:block">
                <TokenSymbol symbol={indexToken?.symbol} size={56} />
              </div>
              <div className="xl:hidden">
                <TokenSymbol symbol={indexToken?.symbol} size={40} />
              </div>
              <div className="flex flex-col ml-17px">
                <div className="flex items-end">
                  <div className="font-700 xl:text-20px text-16px color-white">
                    {indexToken?.symbol}/USD
                  </div>
                  <div
                    className={`ml-4px xl:ml-8px font-400 xl:text-16px text-14px ${
                      side === Side.LONG ? 'color-win' : 'color-loss'
                    }`}
                  >
                    {Side[side]}
                  </div>
                </div>
                <div className="mt-8px color-#cdcdcd xl:text-14px text-12px">
                  Wallet:{' '}
                  <NavLink
                    to={`/traders/${wallet}`}
                    className="color-white b-b-1px b-white b-solid no-underline hover-op-54"
                  >
                    <span className="hidden xl:inline">{wallet}</span>
                    <span className="xl:hidden">{shortenAddress(wallet)}</span>
                  </NavLink>
                </div>
              </div>
            </div>
          )}
          <div
            onClick={closeModal}
            className="bg-white bg-op-54 hover:bg-op-70 cursor-pointer [&:hover_img]:op-100 p-8px rounded-99 xl:-mt-10px xl:-mr-10px"
          >
            <img src={IconX} height={12} width={12} className="block op-54" />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row mt-20px mb-16px -mx-10px xl:min-w-800px">
          <div className="rounded-10px bg-black bg-op-54 px-20px py-18px relative flex-1 mx-10px">
            {isInitialLoading && (
              <div className="absolute top-0 left-0 h-100% w-100%">
                <PositionDetailPriceContentLoader />
              </div>
            )}
            {[
              {
                title: 'Chain',
                value: (
                  <div className="flex items-center text-white">
                    {chainLogos[chainConfig?.chainId] && (
                      <img
                        src={chainLogos[chainConfig?.chainId]}
                        width={14}
                        height={14}
                        className="mr-6px"
                      />
                    )}
                    {chainConfig?.name}
                  </div>
                ),
              },
              {
                title: 'Status',
                value: <PositionStatus status={item?.status} size="md" />,
              },
              {
                title: 'Size',
                value: item ? formatCurrency(item.size) : '',
              },
              {
                title: 'Leverage',
                value: leverage ? `${leverage.toFixed(2)}x` : '',
              },
              {
                title: 'Entry Price',
                value: item ? formatCurrency(item.entryPrice) : '',
              },
              {
                title: item?.closedAt ? 'Exit Price' : 'Mark Price',
                value: item ? formatCurrency(item.markPrice) : '',
              },
              {
                title: 'Liquidation Price',
                value: indexToken
                  ? formatBigNumber(liqPrice, VALUE_DECIMALS - indexToken?.decimals, {
                      fractionDigits: indexToken?.priceFractionDigits,
                      keepTrailingZeros: true,
                      currency: 'USD',
                    })
                  : '',
                valueColor: 'color-primary',
                hide: !item || !!item.closedAt,
              },
            ]
              .filter((c) => !c.hide)
              .map(({ title, value, valueColor = 'color-white' }, index) => (
                <div
                  key={index}
                  className={`text-14px flex items-center justify-between leading-21px ${
                    index ? 'mt-14px' : ''
                  }`}
                >
                  <label className="color-#cdcdcd">{title}</label>
                  <label
                    className={`font-700 ${valueColor} ${isInitialLoading ? 'invisible' : ''}`}
                  >
                    {value}
                  </label>
                </div>
              ))}
          </div>
          <div className="rounded-10px bg-black bg-op-54 px-23px py-18px relative flex-1 mx-10px mt-16px xl:mt-0">
            {isInitialLoading && (
              <div className="absolute top-0 left-0 h-100% w-100%">
                <PositionDetailInfoContentLoader />
              </div>
            )}
            {[
              {
                title: 'Collateral Value',
                value: item ? formatCurrency(item.collateral) : '',
              },
              {
                title: 'PnL',
                value: item ? formatProfit(item.pnl) : '',
                valueColor: profitColor(item?.pnl),
              },
              {
                title: 'Fees Paid',
                value: item ? formatCurrency(item.fee) : '',
              },
              {
                title: 'Borrow Fee',
                value: item ? formatCurrency(item.borrowFee) : '',
              },
            ].map(({ title, value, valueColor = 'color-white' }, index) => (
              <div
                key={index}
                className={`text-14px flex items-center justify-between leading-21px ${
                  index ? 'mt-14px' : ''
                }`}
              >
                <label className="color-#cdcdcd">{title}</label>
                <label
                  className={`font-700 ${valueColor} ${isInitialLoading ? 'invisible' : ''}`}
                >
                  {value}
                </label>
              </div>
            ))}
            <div className="b-t-1px b-dashed b-#5E5E5E mt-16px pt-16px">
              <div className={`text-14px flex items-center justify-between leading-21px`}>
                <div className="flex items-center">
                  <span className="color-#cdcdcd mr-4px">Net Profit</span>
                  <Tooltip content="Realized PnL + PnL - Close Fee - Borrow Fee" />
                </div>
                <label
                  className={`font-700 ${profitColor(item?.netProfit)} ${
                    isInitialLoading ? 'invisible' : ''
                  }`}
                >
                  {item ? formatProfit(item.netProfit) : ''}
                </label>
              </div>
              <div
                className={`text-14px flex items-center justify-between leading-21px mt-14px`}
              >
                <div className="flex items-center">
                  <span className="color-#cdcdcd mr-4px">Net Value</span>
                  <Tooltip content="Collateral Value + PnL - Close Fee - Borrow Fee" />
                </div>
                <label
                  className={`font-700 color-white ${isInitialLoading ? 'invisible' : ''}`}
                >
                  {item ? formatCurrency(item.netValue) : ''}
                </label>
              </div>
            </div>
          </div>
        </div>
        {item?.histories?.length && (
          <div className="rounded-10px bg-black bg-op-54 p-10px">
            <PositionHistories items={item.histories} chainId={item.chainId} />
          </div>
        )}
      </div>
    </Moddal>
  );
};
