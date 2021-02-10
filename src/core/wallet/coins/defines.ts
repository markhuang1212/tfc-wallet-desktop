import {CoinCode} from '../../defines';
import {BtcAccount} from './btc';
import {EthAccount} from './eth';
import {TfcAccount} from './tfc';
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
  [CoinCode.TFC]: TfcAccount,
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
  [CoinCode.TFC]: {
    index: 599,
    hexa: '0x80000257',
    symbol: 'TFC',
    name: 'Turbo File Coin',
    AccountImpl: TfcAccount,
  },
  [CoinCode.VSYS]: {
    index: 360,
    hexa: '0x80000168',
    symbol: 'VSYS',
    name: 'V Systems',
    AccountImpl: VsysAccount,
  },
};
