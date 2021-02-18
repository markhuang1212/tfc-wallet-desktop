import {CoinCode} from '../defines';
import {AccountImplMapping} from '../wallet/coins/defines';
import {PromiEvent} from '@troubkit/tools';

export type TransactionID = string;

// eslint-disable-next-line require-jsdoc
export abstract class Chain<C extends CoinCode> {
  /* Configurations */
  confirmationRequirement: number = 0;

  /* View Methods */
  abstract getBalance(account: AccountImplMapping[C]): Promise<BigInt>;
  abstract getBalance(address: string): Promise<BigInt>;

  /* Transactional Methods */
  abstract transfer(
    recipient: string,
    amount: BigInt,
    sender: AccountImplMapping[C],
  ): PromiEvent<TransactionID, TxEvents>;
  abstract transfer(
    recipient: AccountImplMapping[C],
    amount: BigInt,
    sender: AccountImplMapping[C],
  ): PromiEvent<TransactionID, TxEvents>;
}

export type TxEvents = {
  pending: [TransactionID]
  executed: [TransactionID]
  finalized: [TransactionID]
  error: [Error]
}
