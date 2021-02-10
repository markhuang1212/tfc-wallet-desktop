import {CoinCode} from '../defines';
import {AccountImplMapping} from '../wallet/coins/defines';

export type TransactionID = string;

// eslint-disable-next-line require-jsdoc
export abstract class Chain<C extends CoinCode> {
  /* View Methods */
  abstract getBalance(account: AccountImplMapping[C]): Promise<BigInt>;
  abstract getBalance(address: string): Promise<BigInt>;

  /* Transactional Methods */
  abstract transfer(
    recipient: string,
    amount: BigInt,
    sender: AccountImplMapping[C],
  ): Promise<TransactionID>;
  abstract transfer(
    recipient: AccountImplMapping[C],
    amount: BigInt,
    sender: AccountImplMapping[C],
  ): Promise<TransactionID>;
}
