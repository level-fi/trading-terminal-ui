import { NavLink, useSearchParams } from 'react-router-dom';
import { usePosition } from '../../hooks/usePosition';
import { formatBigNumber, formatCurrency, formatProfit } from '../../utils/numbers';
import { PositionHistories } from './components/PositionHistories';
import {
  PositionDetailInfoContentLoader,
  PositionDetailPriceContentLoader,
} from '../../components/ContentLoader';
import { profitColor, shortenAddress } from '../../utils';
import { useLiqPrice } from '../../hooks/useLiqPrice';
import { VALUE_DECIMALS } from '../../config';
import { Moddal } from '../../components/Modal';
import { useCallback, useMemo } from 'react';
import IconX from '../../assets/icons/ic-x.svg';
import { TokenSymbol } from '../../components/TokenSymbol';
import { Side } from '../../utils/type';
import { PositionStatus } from '../../components/PositionStatus';
import { Tooltip } from '../../components/Tooltip';

export const PositionDetailModal = () => {
  const [params, setParams] = useSearchParams();
  const id = useMemo(() => params.get('position_id'), [params]);
  const { item, loading, silentLoad } = usePosition(id);
  const liqPrice = useLiqPrice({
    rawBorrowFee: item?.borrowFee,
    rawCloseFee: item?.closeFee,
    rawSize: item?.size,
    rawCollateralValue: item?.collateral,
    rawEntry: item?.entryPrice,
    decimals: item?.indexToken.decimals,
    side: item?.side,
  });

  const closeModal = useCallback(() => {
    params.delete('position_id');
    setParams(params);
  }, [params, setParams]);

  return (
    <Moddal visible={!!id} close={closeModal}>
      <div>
        <div className="flex justify-between items-start">
          {loading && !silentLoad ? (
            <div></div>
          ) : (
            <div className="flex items-center">
              <div className="hidden lg:block">
                <TokenSymbol symbol={item?.indexToken.symbol} size={56} />
              </div>
              <div className="lg:hidden">
                <TokenSymbol symbol={item?.indexToken.symbol} size={40} />
              </div>
              <div className="flex flex-col ml-8px lg:ml-17px">
                <div>
                  <span className="font-700 lg:text-20px text-16px color-white">
                    {item?.indexToken.symbol}/USD
                  </span>
                  <span
                    className={`ml-4px lg:ml-8px font-400 lg:text-16px text-14px ${
                      item?.side === Side.LONG ? 'color-win' : 'color-loss'
                    }`}
                  >
                    {Side[item?.side]}
                  </span>
                </div>
                <div className="mt-8px color-#cdcdcd lg:text-14px text-12px">
                  Wallet:{' '}
                  <NavLink
                    to={`/traders/${item?.wallet}`}
                    className="color-white b-b-1px b-white b-solid no-underline hover-op-54"
                  >
                    <span className="hidden lg:inline">{item?.wallet}</span>
                    <span className="lg:hidden">{shortenAddress(item?.wallet)}</span>
                  </NavLink>
                </div>
              </div>
            </div>
          )}
          <div
            onClick={closeModal}
            className="bg-white bg-op-54 hover:bg-op-70 cursor-pointer [&:hover_img]:op-100 p-8px rounded-99 lg:-mt-10px lg:-mr-10px"
          >
            <img src={IconX} height={12} width={12} className="block op-54" />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row mt-20px mb-16px -mx-10px lg:min-w-800px">
          <div className="rounded-10px bg-black bg-op-54 px-20px py-18px relative flex-1 mx-10px">
            {loading && !silentLoad && (
              <div className="absolute top-0 left-0 h-100% w-100%">
                <PositionDetailPriceContentLoader />
              </div>
            )}
            {[
              {
                title: 'Status',
                value: <PositionStatus closed={!!item?.closedAt} size="md" />,
              },
              {
                title: 'Size',
                value: item ? formatCurrency(item.size) : '',
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
                value: item
                  ? formatBigNumber(liqPrice, VALUE_DECIMALS - item.indexToken.decimals, {
                      fractionDigits: item.indexToken.priceFractionDigits,
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
                    className={`font-700 ${valueColor} ${
                      loading && !silentLoad ? 'invisible' : ''
                    }`}
                  >
                    {value}
                  </label>
                </div>
              ))}
          </div>
          <div className="rounded-10px bg-black bg-op-54 px-23px py-18px relative flex-1 mx-10px mt-16px lg:mt-0">
            {loading && !silentLoad && (
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
                title: 'Paid Fees',
                value: item ? formatCurrency(item.paidFee) : '',
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
                  className={`font-700 ${valueColor} ${
                    loading && !silentLoad ? 'invisible' : ''
                  }`}
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
                    loading && !silentLoad ? 'invisible' : ''
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
                  className={`font-700 color-white ${
                    loading && !silentLoad ? 'invisible' : ''
                  }`}
                >
                  {item ? formatCurrency(item.netValue) : ''}
                </label>
              </div>
            </div>
          </div>
        </div>
        {item?.histories?.length && (
          <div className="rounded-10px bg-black bg-op-54 p-10px">
            <PositionHistories items={item.histories} loading={loading && !silentLoad} />
          </div>
        )}
      </div>
    </Moddal>
  );
};
