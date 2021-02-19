import {Chain, TransactionID, TxEvents} from '../chain';
import {CoinCode} from '../../defines';
import {AccountImplMapping} from '../../wallet/coins/defines';
import {PromiEvent} from '@troubkit/tools';

// eslint-disable-next-line require-jsdoc
export class TfcChain extends Chain<CoinCode.TFC_BIP44> {
  // eslint-disable-next-line require-jsdoc
  async getBalance(accountOrAddress: AccountImplMapping[CoinCode.TFC_BIP44] | string)
    : Promise<BigInt> {
    return Promise.reject(new Error('unimplemented'));
  }

  // eslint-disable-next-line require-jsdoc
  transfer(
      recipient: string | AccountImplMapping[CoinCode.TFC_BIP44],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.TFC_BIP44],
  ): PromiEvent<TransactionID, TxEvents> {
    return PromiEvent.reject(
        new Error('unimplemented'),
    ) as unknown as PromiEvent<TransactionID, TxEvents>;
  }
}
