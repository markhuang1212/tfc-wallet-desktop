import {CoinCode} from '../../defines';
import {BtcAccount} from './btc';
import {EthAccount} from './eth';
import {TfcBip44Account, TfcChainAccount} from './tfc';
import {VsysAccount} from './vsys';

export interface CoinType<T extends CoinCode> {
  index: number,
  hexa: string,
  symbol: string,
  name: string,
  AccountImpl: new (privateKey: Buffer) => AccountImplMapping[T],
}

export type AccountImplMapping = {
  [CoinCode.BTC]: BtcAccount,
  [CoinCode.ETH]: EthAccount,
  [CoinCode.TFC_BIP44]: TfcBip44Account,
  [CoinCode.TFC_CHAIN]: TfcChainAccount,
  [CoinCode.VSYS]: VsysAccount,
}

/**
 * Definitions of CoinTypes
 */
export const CoinDefines: {
  [T in CoinCode]: CoinType<T>
} = {
  [CoinCode.BTC]: {
    index: 0,
    hexa: '0x80000000',
    symbol: 'BTC',
    name: 'Bitcoin',
    AccountImpl: BtcAccount,
  },
  [CoinCode.ETH]: {
    index: 60,
    hexa: '0x8000003c',
    symbol: 'ETH',
    name: 'Ether',
    AccountImpl: EthAccount,
  },
  [CoinCode.TFC_BIP44]: {
    index: 599,
    hexa: '0x80000257',
    symbol: 'TFC',
    name: 'Turbo File Coin',
    AccountImpl: TfcBip44Account,
  },
  [CoinCode.TFC_CHAIN]: {
    index: 995,
    hexa: '0x800003e3',
    symbol: 'TFC-Chain',
    name: 'Turbo File Coin',
    AccountImpl: TfcChainAccount,
  },
  [CoinCode.VSYS]: {
    index: 360,
    hexa: '0x80000168',
    symbol: 'VSYS',
    name: 'V Systems',
    AccountImpl: VsysAccount,
  },

};
