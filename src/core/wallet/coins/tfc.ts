import {EthAccount} from './eth';
import {Account} from '../account';
import {ec as EC} from 'elliptic';
import crypto from 'crypto';
import base58 from 'bs58';

// eslint-disable-next-line require-jsdoc
export class TfcBip44Account extends EthAccount {
}

// eslint-disable-next-line require-jsdoc
export class TfcChainAccount extends Account {
  // eslint-disable-next-line require-jsdoc
  constructor(privateKey: Buffer) {
    super(privateKey);
  }

  // eslint-disable-next-line require-jsdoc
  private static hashPubKey(pubKey: Buffer): Buffer {
    const sha256Hash = crypto.createHash('sha256')
        .update(pubKey)
        .digest();
    return crypto.createHash('ripemd160')
        .update(sha256Hash)
        .digest();
  }

  // eslint-disable-next-line require-jsdoc
  private static checksum(payload: Buffer): Buffer {
    const firstSHA = crypto.createHash('sha256')
        .update(payload)
        .digest();
    const secondSHA=crypto.createHash('sha256')
        .update(firstSHA)
        .digest();
    const addressChecksumLen = 4;
    return secondSHA.slice(0, addressChecksumLen);
  }


  // eslint-disable-next-line require-jsdoc
  get address(): string {
    const ec = new EC('p256');
    const key = ec.keyFromPrivate(this.privateKey);
    const wiredPubKey = Buffer.concat([
      Buffer.from(
          key.getPublic().getX().toString('hex'),
          'hex',
      ),
      Buffer.from(
          key.getPublic().getY().toString('hex'),
          'hex',
      ),
    ]);
    const hashedPubKey = TfcChainAccount.hashPubKey(wiredPubKey);
    const version = Buffer.from([0]);
    const versionedPayload = Buffer.concat([version, hashedPubKey]);
    const checksum = TfcChainAccount.checksum(versionedPayload);
    const fullPayload = Buffer.concat([versionedPayload, checksum]);
    return base58.encode(fullPayload);
  }

  // eslint-disable-next-line require-jsdoc
  get publicKey(): string {
    // tfc-chain uses p256 elliptic curve
    const ec = new EC('p256');
    const key = ec.keyFromPrivate(this.privateKey);
    return key.getPublic('hex');
  }
}
