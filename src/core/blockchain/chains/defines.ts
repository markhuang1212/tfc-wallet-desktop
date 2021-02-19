import {CoinCode} from '../../defines';
import {BitcoinChain} from './bitcoin';
import {EthereumChain} from './ethereum';
import {TfcChain} from './tfc';
import {VsysChain} from './vsys';

export type ChainImplMapping = {
  [CoinCode.BTC]: BitcoinChain,
  [CoinCode.ETH]: EthereumChain,
  [CoinCode.TFC_BIP44]: TfcChain,
  [CoinCode.VSYS]: VsysChain,
}

