import {HDWallet} from './bip32';
import HDNode from 'hdkey';
import {CoinCode} from '../defines';
import {AccountImplMapping, CoinDefines} from './coins/defines';

export interface CoinWalletJSON<C extends CoinCode> {
  coinType: C,
  hdNode: {
    xpriv: string;
    xpub: string
  },
  standalonePrivateKeys: string[],
}

// eslint-disable-next-line require-jsdoc
export class CoinWallet<C extends CoinCode> extends HDWallet {
  private readonly standalonePrivateKeys: Buffer[];

  // eslint-disable-next-line require-jsdoc
  constructor(
      hdNode: HDNode,
    public readonly coinCode: C,
    ...standalonePrivateKeys: Buffer[]
  ) {
    super(hdNode);
    this.standalonePrivateKeys = standalonePrivateKeys;
  }

  /* The method that defines the keyPair strategy for each coin */
  // eslint-disable-next-line require-jsdoc
  privateKeyToAccount(privateKey: Buffer): AccountImplMapping[C] {
    return new CoinDefines[this.coinCode]
        .AccountImpl(privateKey) as AccountImplMapping[C];
  }

  // eslint-disable-next-line require-jsdoc
  static privateKeyToAccount<C extends CoinCode>(
      coinCode: CoinCode,
      privateKey: Buffer,
  ): AccountImplMapping[C] {
    return new CoinDefines[coinCode]
        .AccountImpl(privateKey) as AccountImplMapping[C];
  }

  /* Standalone account methods*/

  // eslint-disable-next-line require-jsdoc
  getStandaloneAccount(index: number): AccountImplMapping[C] | undefined {
    const privateKey = this.standalonePrivateKeys[index];
    if (!privateKey) {
      return undefined;
    }
    return this.privateKeyToAccount(privateKey);
  }

  // eslint-disable-next-line require-jsdoc
  get standaloneAccounts(): AccountImplMapping[C][] {
    return this.standalonePrivateKeys
        .map((k) => this.privateKeyToAccount(k));
  }

  // eslint-disable-next-line require-jsdoc
  addStandaloneAccounts(
      ...accountsOrPrivateKeys: (AccountImplMapping[C] | Buffer | string)[]
  ): void {
    for (let accountOrPrivateKey of accountsOrPrivateKeys) {
      if (Buffer.isBuffer(accountOrPrivateKey)) {
        this.standalonePrivateKeys.push(accountOrPrivateKey);
      } else if (typeof accountOrPrivateKey === 'string') {
        accountOrPrivateKey = accountOrPrivateKey.trim();
        if (accountOrPrivateKey.startsWith('0x')) {
          accountOrPrivateKey = accountOrPrivateKey.slice(2);
        }
        this.standalonePrivateKeys.push(
            Buffer.from(accountOrPrivateKey, 'hex'),
        );
      } else {
        this.standalonePrivateKeys.push(accountOrPrivateKey.privateKey);
      }
    }
  }

  /* Serialization methods */

  // eslint-disable-next-line require-jsdoc
  toJSON(): CoinWalletJSON<C> {
    return {
      coinType: this.coinCode,
      hdNode: this.hdNode.toJSON(),
      standalonePrivateKeys: this.standalonePrivateKeys
          .map((k) => k.toString('hex')),
    };
  }

  // eslint-disable-next-line require-jsdoc
  static fromJSON<C extends CoinCode>(obj: CoinWalletJSON<C> | undefined)
    : CoinWallet<C> | undefined {
    if (!obj) {
      return undefined;
    }
    const hdNode = HDNode.fromJSON(obj['hdNode']);
    const standalonePrivateKeys = obj['standalonePrivateKeys'];
    const coinType = obj['coinType'];
    if (Array.isArray(standalonePrivateKeys)) {
      return new CoinWallet<C>(
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
  deriveHDAccount(bip32Path: string): AccountImplMapping[C] {
    const node = this.deriveBip32Path(bip32Path);
    return this.privateKeyToAccount(node.privateKey);
  }

  // eslint-disable-next-line require-jsdoc
  getBip44Account(index: number): AccountImplMapping[C] {
    return this.deriveHDAccount(`m/0'/0/${index}`);
  }
}
