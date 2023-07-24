import bnb from '../assets/icons/chains/bnb.svg';
import arb from '../assets/icons/chains/arb.png';
import { arbConfig, bscConfig } from '../config';

export const chainLogos = {
  [bscConfig.chainId]: bnb,
  [arbConfig.chainId]: arb,
};
