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

  /**
   * TFC-Chain has an irregular Private Key encoding format,
   * which is a combination of PEM, DER and HEX.
   *
   * This method creates a TFC-Chain account
   * from a TFC-Chain specially encoded private key.
   *
   * @param {string} privateKey
   * @return {TfcChainAccount}
   */
  static fromTfcEncodedPrivateKey(privateKey: string): TfcChainAccount {
    const pem = Buffer.from(privateKey, 'hex').toString('ascii');
    const matcherRegex =
      /-----BEGIN PRIVATE KEY-----\n([\s\S]+)\n-----END PRIVATE KEY-----/m;
    const matches = matcherRegex[Symbol.match](pem);
    if (!matches) {
      throw new Error('Invalid hex PEM');
    }
    const base64EncodedPayload = matches[1];
    const hexPayload =
      Buffer.from(base64EncodedPayload, 'base64').toString('hex');
    // eslint-disable-next-line max-len
    const regex = /^30770201010420([0-9a-zA-Z]+)A00A06082A8648CE3D030107A144034200([0-9a-zA-Z]+$)/i;
    const keyMatches = regex[Symbol.match](hexPayload);
    if (!keyMatches) {
      throw new Error('Invalid hex PEM');
    }
    const key = keyMatches[1];
    return new TfcChainAccount(Buffer.from(key, 'hex'));
  }
}
