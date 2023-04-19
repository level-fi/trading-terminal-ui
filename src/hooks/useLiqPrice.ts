import { BigNumber, Contract, providers } from 'ethers';
import { FEE_DECIMALS, VALUE_DECIMALS, config } from '../config';
import PoolAbi from '../abis/Vault.json';
import { useEffect, useMemo, useState } from 'react';
import { Side } from '../utils/type';
import { parseUnits } from 'ethers/lib/utils';

interface UseLiqPriceConfig {
  decimals: number;
  rawEntry: number;
  side: Side;
  rawSize: number;
  rawCollateralValue: number;
  rawCloseFee: number;
  rawBorrowFee: number;
}

let liquidationFee: BigNumber;
let maintainMargin: BigNumber;
const contract = new Contract(config.pool, PoolAbi, new providers.JsonRpcProvider(config.rpc));

const max = (a: BigNumber, b: BigNumber) => (a && b ? (a.gt(b) ? a : b) : null);
const min = (a: BigNumber, b: BigNumber) => (a && b ? (a.lt(b) ? a : b) : null);
export const useLiqPrice = ({
  decimals,
  rawBorrowFee,
  rawCloseFee,
  rawCollateralValue,
  rawEntry,
  rawSize,
  side,
}: UseLiqPriceConfig) => {
  const [margin, setMargin] = useState(maintainMargin);
  const [liq, setLiq] = useState(liquidationFee);
  const borrowFee = useMemo(() => {
    if (rawBorrowFee === undefined) {
      return;
    }
    return parseUnits(rawBorrowFee.toString(), VALUE_DECIMALS);
  }, [rawBorrowFee]);
  const positionFee = useMemo(() => {
    if (rawCloseFee === undefined) {
      return;
    }
    return parseUnits(rawCloseFee.toString(), VALUE_DECIMALS);
  }, [rawCloseFee]);
  const collateralValue = useMemo(() => {
    if (rawCollateralValue === undefined) {
      return;
    }
    return parseUnits(rawCollateralValue.toString(), VALUE_DECIMALS);
  }, [rawCollateralValue]);
  const entryPrice = useMemo(() => {
    if (rawEntry === undefined) {
      return;
    }
    return parseUnits(rawEntry.toString(), VALUE_DECIMALS - decimals);
  }, [decimals, rawEntry]);
  const size = useMemo(() => {
    if (rawSize === undefined) {
      return;
    }
    return parseUnits(rawSize.toString(), VALUE_DECIMALS);
  }, [rawSize]);

  useEffect(() => {
    if (maintainMargin && liquidationFee) {
      setMargin(maintainMargin);
      setLiq(liquidationFee);
      return;
    }
    const fetch = async () => {
      const [margin, [, liq]] = await Promise.all([
        contract.maintenanceMargin(),
        contract.fee(),
      ]);
      maintainMargin = margin;
      liquidationFee = liq;

      setMargin(maintainMargin);
      setLiq(liquidationFee);
    };
    fetch();
  }, []);

  const liqPrice = useMemo(() => {
    if (
      !collateralValue ||
      !size ||
      !entryPrice ||
      size.eq(0) ||
      !margin ||
      !positionFee ||
      !liq ||
      !borrowFee
    ) {
      return;
    }
    // collateral in here is collateral after close and open fee
    // if is open position order -> sub close fee to get
    const isLong = side === Side.LONG;
    const maintainSize = size.mul(margin).div(parseUnits('1', FEE_DECIMALS));
    const liqPriceByMargin = entryPrice
      .mul(size.sub(collateralValue.sub(maintainSize).mul(isLong ? 1 : -1)))
      .div(size);
    const totalFee = liq.add(borrowFee).add(positionFee);
    const liqPriceByLiqFee = entryPrice
      .mul(size.sub(collateralValue.sub(totalFee).mul(isLong ? 1 : -1)))
      .div(size);
    const liqPrice = isLong
      ? max(liqPriceByLiqFee, liqPriceByMargin)
      : min(liqPriceByLiqFee, liqPriceByMargin);
    return liqPrice.gt(0) ? liqPrice : undefined;
  }, [borrowFee, collateralValue, entryPrice, liq, margin, positionFee, side, size]);

  return useMemo(() => liqPrice, [liqPrice]);
};
