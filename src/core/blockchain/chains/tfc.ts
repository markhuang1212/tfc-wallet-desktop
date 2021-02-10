import {Chain, TransactionID} from '../chain';
import {CoinCode} from '../../defines';
import {AccountImplMapping} from '../../wallet/coins/defines';

// eslint-disable-next-line require-jsdoc
export class TfcChain extends Chain<CoinCode.TFC> {
  // eslint-disable-next-line require-jsdoc
  async getBalance(accountOrAddress: AccountImplMapping[CoinCode.TFC] | string)
    : Promise<BigInt> {
    return Promise.reject(new Error('unimplemented'));
  }

  // eslint-disable-next-line require-jsdoc
  async transfer(
      recipient: string | AccountImplMapping[CoinCode.TFC],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.TFC],
  ): Promise<TransactionID> {
    return Promise.reject(new Error('unimplemented'));
  }
}
