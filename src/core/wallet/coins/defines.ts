import {EthAccount} from './eth';
import {Account} from '../coin-wallet';
import {TfcAccount} from './tfc';
import {VsysAccount} from './vsys';
import {BtcAccount} from './btc';

export interface CoinType<T extends Account> {
  index: number,
  hexa: string,
  symbol: string
  name: string,
  AccountImpl: new (privateKey: Buffer) => T,
}

export const CoinTypes = {
  BTC: 0,
  ETH: 60,
  TFC: 599,
  VSYS: 360,
};

/**
 * Definitions of CoinTypes
 */
export const CoinDefines: { [coinType: number]: CoinType<Account> } = {
  [CoinTypes.BTC]: {
    index: 0,
    hexa: '0x80000000',
    symbol: 'BTC',
    name: 'Bitcoin',
    AccountImpl: BtcAccount,
  },
  [CoinTypes.ETH]: {
    index: 60,
    hexa: '0x8000003c',
    symbol: 'ETH',
    name: 'Ether',
    AccountImpl: EthAccount,
  },
  [CoinTypes.TFC]: {
    index: 599,
    hexa: '0x80000257',
    symbol: 'TFC',
    name: 'Turbo File Coin',
    AccountImpl: TfcAccount,
  },
  [CoinTypes.VSYS]: {
    index: 360,
    hexa: '0x80000168',
    symbol: 'VSYS',
    name: 'V Systems',
    AccountImpl: VsysAccount,
  },
};

