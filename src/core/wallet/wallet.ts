import HDNode from 'hdkey';
import {HDWallet} from './bip32';
import {CoinCode} from '../defines';
import {CoinWallet, CoinWalletJSON} from './coin-wallet';
import * as bip39 from 'bip39';
import {AccountImplMapping, CoinDefines} from './coins/defines';
import {Account} from './account';

type Bytes = string | Buffer;

export interface WalletJSON {
  seed: string,
  coinWallets: {
    [C in CoinCode]: CoinWalletJSON<C>
  }
}


// eslint-disable-next-line require-jsdoc
export class Wallet extends HDWallet {
  // @ts-ignore
  readonly coinWallets: { [C in CoinCode]: CoinWallet<C> } = {};

  // eslint-disable-next-line require-jsdoc
  constructor(
    public readonly seed: Buffer,
    coinWallets: { [C in CoinCode]?: CoinWalletJSON<C> } = {},
  ) {
    super(HDNode.fromMasterSeed(seed).derive('m/44\''));
    for (const coinName in CoinCode) {
      if (!CoinCode.hasOwnProperty(coinName)) {
        continue;
      }
      const coinType = CoinCode[coinName] as unknown as CoinCode;
      if (!CoinDefines.hasOwnProperty(coinType)) {
        continue;
      }
      const wallet = CoinWallet.fromJSON(coinWallets[coinType]);
      if (wallet) {
        // @ts-ignore
        this.coinWallets[coinType] = wallet as CoinWallet<typeof coinType>;
      } else {
        // @ts-ignore
        this.coinWallets[coinType] = new CoinWallet<typeof coinType>(
            this.hdNode.derive(`m/${coinType}'`),
            coinType,
        );
      }
    }
  }

  // eslint-disable-next-line require-jsdoc
  getCoinWallet<C extends CoinCode>(coinType: C)
    : CoinWallet<C> {
    return this.coinWallets[coinType] as unknown as CoinWallet<C>;
  }

  // eslint-disable-next-line require-jsdoc
  toJSON(): WalletJSON {
    // @ts-ignore
    const obj: { [C in CoinCode]: CoinWalletJSON<C> } = {};
    for (const coinIndex in this.coinWallets) {
      if (!this.coinWallets.hasOwnProperty(coinIndex)) {
        continue;
      }
      // @ts-ignore
      obj[coinIndex] = this.coinWallets[coinIndex].toJSON();
    }
    return {
      seed: this.seed.toString('hex'),
      coinWallets: obj,
    };
  }

  // eslint-disable-next-line require-jsdoc
  static fromJSON(obj: WalletJSON): Wallet | undefined {
    if (!obj) {
      return undefined;
    }
    return new Wallet(Buffer.from(obj.seed, 'hex'), obj.coinWallets);
  }

  /* Convenient static methods */
  // eslint-disable-next-line require-jsdoc
  static fromMnemonic(mnemonic: string): Wallet {
    const privateKey = Wallet.mnemonicToPrivateKey(mnemonic);
    return new Wallet(privateKey);
  }

  // eslint-disable-next-line require-jsdoc
  static fromSeed(seed: Bytes): Wallet {
    let s: Buffer;
    if (typeof seed === 'string') {
      seed = seed.trim();
      if (seed.startsWith('0x')) {
        seed = seed.slice(2);
      }
      const hexRegex = /^([0-9A-Fa-f][0-9A-Fa-f])+$/g;
      if (hexRegex.test(seed)) {
        s = Buffer.from(seed, 'hex');
      } else {
        s = Wallet.mnemonicToPrivateKey(seed);
      }
    } else if (Buffer.isBuffer(seed)) {
      s = seed;
    } else {
      throw new Error('seed is not hex string or buffer');
    }
    return new Wallet(s);
  }

  getAccount(bip44Path: string): Account;

  getAccount<C extends CoinCode>(coinCode: C): AccountImplMapping[C];

  getAccount<C extends CoinCode>(coinCode: C, bip32Path: string)
    : AccountImplMapping[C];

  // eslint-disable-next-line require-jsdoc
  getAccount(...args: any[]): Account {
    if (args.length < 1) {
      throw new Error('account derive path is not specified');
    }
    let coinWallet: CoinWallet<CoinCode>;
    if (args.length >= 1) {
      const arg0 = args[0];
      if (typeof arg0 === 'string') {
        const coinCode = Wallet.getCoinCodeFromBip44Path(arg0);
        coinWallet = this.getCoinWallet(coinCode);
      } else {
        coinWallet = this.getCoinWallet(arg0 as CoinCode);
      }
    }

    if (args.length >= 2) {
      const arg1 = args[1];
      return coinWallet!.deriveHDAccount(arg1);
    } else {
      return coinWallet!.getBip44Account(0);
    }
  }


  static getAccount(seed: Bytes, bip44Path: string): Account;

  static getAccount<C extends CoinCode>
  (seed: Bytes, coinCode: C, bip32Path: string)
    : AccountImplMapping[C];

  // eslint-disable-next-line require-jsdoc
  static getAccount(seed: Bytes, ...args: any[]): Account {
    const wallet = Wallet.fromSeed(seed);
    // @ts-ignore
    return wallet.getAccount(...args);
  }


  /* Static helper methods */

  // eslint-disable-next-line require-jsdoc
  static isValidBip32Path(path: string): boolean {
    const testRegex = /^m(\/[0-9]+'?)+\/?$/;
    return testRegex.test(path.trim());
  }

  // eslint-disable-next-line require-jsdoc
  static getCoinCodeFromBip44Path(bip44Path: string): CoinCode {
    const testRegex = /^m\/44'\/([0-9]+)'(\/[0-9]+'?)+\/?$/;
    const matches = bip44Path.trim().match(testRegex);
    if (!matches) {
      throw new Error(bip44Path + ' is not valid bip44 path');
    }
    let coinCode;
    try {
      coinCode = parseInt(matches[1]);
    } catch (e) {
      throw new Error(bip44Path + 'is not valid bip44 path: ' + e.message);
    }
    if (!(coinCode in CoinCode)) {
      throw new Error(`coin code '${coinCode}' is not supported`);
    }
    return coinCode as CoinCode;
  }

  // eslint-disable-next-line require-jsdoc
  static mnemonicToPrivateKey(mnemonic: string): Buffer {
    return bip39.mnemonicToSeedSync(mnemonic);
  }
}

