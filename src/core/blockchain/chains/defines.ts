import {CoinCode} from '../../defines';
import {BitcoinChain} from './bitcoin';
import {EthereumChain} from './ethereum';
import {TfcBip44Chain, TfcChain} from './tfc';
import {VsysChain} from './vsys';

export type ChainImplMapping = {
  [CoinCode.BTC]: BitcoinChain,
  [CoinCode.ETH]: EthereumChain,
  [CoinCode.TFC_BIP44]: TfcBip44Chain,
  [CoinCode.VSYS]: VsysChain,
  [CoinCode.TFC_CHAIN]: TfcChain,
}

