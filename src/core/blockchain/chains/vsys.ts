import {Chain, TxEvents, TypedEventEmitter} from '../chain';
import {CoinCode} from '../../defines';
import {AccountImplMapping} from '../../wallet/coins/defines';

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
  ): TypedEventEmitter<TxEvents> {
    return new TypedEventEmitter<TxEvents>();
  }
}
