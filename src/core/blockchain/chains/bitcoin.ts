import {Chain, TxEvents, TypedEventEmitter} from '../chain';
import {CoinCode} from '../../defines';
import {AccountImplMapping} from '../../wallet/coins/defines';

// eslint-disable-next-line require-jsdoc
export class BitcoinChain extends Chain<CoinCode.BTC> {
  // eslint-disable-next-line require-jsdoc
  async getBalance(accountOrAddress: AccountImplMapping[CoinCode.ETH] | string)
    : Promise<BigInt> {
    return Promise.reject(new Error('unimplemented'));
  }

  // eslint-disable-next-line require-jsdoc
  transfer(
      recipient: string | AccountImplMapping[CoinCode.ETH],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.ETH],
  ): TypedEventEmitter<TxEvents> {
    return new TypedEventEmitter<TxEvents>();
  }
}
