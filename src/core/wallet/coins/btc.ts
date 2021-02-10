import {Account} from '../coin-wallet';
import * as bitcoin from 'bitcoinjs-lib';

// eslint-disable-next-line require-jsdoc
export class BtcAccount extends Account {
  // eslint-disable-next-line require-jsdoc
  get address(): string {
    const key = bitcoin.ECPair.fromPrivateKey(this.privateKey);
    return bitcoin.payments.p2pkh({pubkey: key.publicKey}).address!;
  }

  // eslint-disable-next-line require-jsdoc
  get publicKey(): string {
    const key = bitcoin.ECPair.fromPrivateKey(this.privateKey);
    return key.publicKey.toString('hex');
  }

  // eslint-disable-next-line require-jsdoc
  get WIF(): string {
    const key = bitcoin.ECPair.fromPrivateKey(this.privateKey);
    return key.toWIF();
  }
}
