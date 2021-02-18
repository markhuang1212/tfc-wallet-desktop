import {Chain, TransactionID, TxEvents} from '../chain';
import {CoinCode} from '../../defines';
import {AccountImplMapping} from '../../wallet/coins/defines';
import {PromiEvent} from '@troubkit/tools';

// eslint-disable-next-line require-jsdoc
export class VsysChain extends Chain<CoinCode.VSYS> {
  // eslint-disable-next-line require-jsdoc
  async getBalance(accountOrAddress: AccountImplMapping[CoinCode.VSYS] | string)
    : Promise<BigInt> {
    return Promise.reject(new Error('unimplemented'));
  }

  // eslint-disable-next-line require-jsdoc
  transfer(
      recipient: string | AccountImplMapping[CoinCode.VSYS],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.VSYS],
  ): PromiEvent<TransactionID, TxEvents> {
    return PromiEvent.reject(
        new Error('unimplemented'),
    ) as unknown as PromiEvent<TransactionID, TxEvents>;
  }
}
