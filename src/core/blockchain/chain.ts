import {CoinCode} from '../defines';
import {AccountImplMapping} from '../wallet/coins/defines';
import {EventEmitter} from 'events';

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
  ): TypedEventEmitter<TxEvents>;
  abstract transfer(
    recipient: AccountImplMapping[C],
    amount: BigInt,
    sender: AccountImplMapping[C],
  ): TypedEventEmitter<TxEvents>;
}

export interface TypedEvents {
  [eventName: string]: any
}

// eslint-disable-next-line require-jsdoc
export class TypedEventEmitter<E extends TypedEvents> extends EventEmitter {
  // eslint-disable-next-line require-jsdoc
  on<K extends keyof E>(
      eventName: K extends string ? K : never,
      listener: (v: E[K]) => any,
  ): this {
    return super.on(eventName as string, listener);
  }

  // eslint-disable-next-line require-jsdoc
  emit<K extends keyof E>(
      eventName: K extends string ? K : never,
      args: E[K],
  ): boolean {
    return super.emit(eventName as string, args);
  }
}

export interface TxEvents {
  pending: TransactionID
  executed: TransactionID
  finalized: TransactionID
  error: Error
}
