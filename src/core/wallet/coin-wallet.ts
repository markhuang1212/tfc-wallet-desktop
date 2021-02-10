
import {HDWallet} from './bip32';
import HDNode from 'hdkey';
import {CoinDefines} from './coins';

// eslint-disable-next-line require-jsdoc
export abstract class Account {
  // eslint-disable-next-line require-jsdoc
  constructor(
    readonly _privateKey: Buffer,
  ) {
  }

  // eslint-disable-next-line require-jsdoc
  get privateKey(): Buffer {
    return this._privateKey;
  }

  abstract get publicKey(): string;

  abstract get address(): string;
}


export interface CoinWalletJSON {
  coinType: number,
  hdNode: {
    xpriv: string;
    xpub: string
  },
  standalonePrivateKeys: string[],
}

// eslint-disable-next-line require-jsdoc
export class CoinWallet<AccountT extends Account> extends HDWallet {
  private readonly standalonePrivateKeys: Buffer[];

  // eslint-disable-next-line require-jsdoc
  constructor(
    public readonly hdNode: HDNode,
    public readonly coinType: number,
    ...standalonePrivateKeys: Buffer[]
  ) {
    super(hdNode);
    this.standalonePrivateKeys = standalonePrivateKeys;
  }

  /* The method that defines the keyPair strategy for each coin */
  // eslint-disable-next-line require-jsdoc
  privateKeyToAccount(privateKey: Buffer): AccountT {
    return new CoinDefines[this.coinType].AccountImpl(privateKey) as AccountT;
  }

  /* Standalone account methods*/

  // eslint-disable-next-line require-jsdoc
  getStandaloneAccount(index: number): AccountT | undefined {
    const privateKey = this.standalonePrivateKeys[index];
    if (!privateKey) {
      return undefined;
    }
    return this.privateKeyToAccount(privateKey);
  }

  // eslint-disable-next-line require-jsdoc
  get standaloneAccounts(): AccountT[] {
    return this.standalonePrivateKeys
        .map((k) => this.privateKeyToAccount(k));
  }

  // eslint-disable-next-line require-jsdoc
  addStandaloneAccounts(...accountsOrPrivateKeys: (AccountT | Buffer)[]) {
    for (const accountOrPrivateKey of accountsOrPrivateKeys) {
      if (Buffer.isBuffer(accountOrPrivateKey)) {
        this.standalonePrivateKeys.push(accountOrPrivateKey);
      } else {
        this.standalonePrivateKeys.push(accountOrPrivateKey.privateKey);
      }
    }
  }

  /* Serialization methods */

  // eslint-disable-next-line require-jsdoc
  toJSON(): CoinWalletJSON {
    return {
      coinType: this.coinType,
      hdNode: this.hdNode.toJSON(),
      standalonePrivateKeys: this.standalonePrivateKeys
          .map((k) => k.toString('hex')),
    };
  }

  // eslint-disable-next-line require-jsdoc
  static fromJSON(obj: CoinWalletJSON)
    : CoinWallet<Account> | undefined {
    if (!obj) {
      return undefined;
    }
    const hdNode = HDNode.fromJSON(obj['hdNode']);
    const standalonePrivateKeys = obj['standalonePrivateKeys'];
    const coinType = obj['coinType'];
    if (Array.isArray(standalonePrivateKeys)) {
      return new CoinWallet<Account>(
          hdNode,
          coinType,
          ...standalonePrivateKeys.map((k) => Buffer.from(k, 'hex')),
      );
    } else {
      return undefined;
    }
  }

  /* convenient methods */

  // eslint-disable-next-line require-jsdoc
  deriveHDAccount(bip32Path: string): AccountT {
    const node = this.deriveBip32Path(bip32Path);
    return this.privateKeyToAccount(node.privateKey);
  }

  // eslint-disable-next-line require-jsdoc
  getBip44Account(index: number): AccountT {
    return this.deriveHDAccount(`m/0'/0/${index}`);
  }
}
