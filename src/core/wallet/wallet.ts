import HDNode from 'hdkey';
import {HDWallet} from './bip32';
import {
  CoinDefines, CoinTypes,
} from './coins';
import {Account, CoinWallet, CoinWalletJSON} from './coin-wallet';


export interface WalletJSON {
  seed: string,
  coinWallets: {
    [coinIndex: number]: CoinWalletJSON,
  }
}


// eslint-disable-next-line require-jsdoc
export class Wallet extends HDWallet {
  readonly coinWallets: Record<number, CoinWallet<Account>> = {};

  // eslint-disable-next-line require-jsdoc
  constructor(
    public readonly seed: Buffer,
    coinWallets: {[coinIndex: number]: CoinWalletJSON} = {},
  ) {
    super(HDNode.fromMasterSeed(seed).derive('m/44\''));
    for (const coinName in CoinTypes) {
      if (!CoinTypes.hasOwnProperty(coinName)) {
        continue;
      }
      // @ts-ignore
      const coinType = CoinTypes[coinName];
      if (!CoinDefines.hasOwnProperty(coinType)) {
        continue;
      }
      const wallet = CoinWallet.fromJSON(coinWallets[coinType]);
      if (wallet) {
        this.coinWallets[coinType] = wallet;
      } else {
        this.coinWallets[coinType] = new CoinWallet(
            this.hdNode.derive(`m/${coinType}'`),
            coinType,
        );
      }
    }
  }

  // eslint-disable-next-line require-jsdoc
  getCoinWallet(coinType: number): CoinWallet<Account> | undefined {
    return this.coinWallets[coinType];
  }

  // eslint-disable-next-line require-jsdoc
  isValidBip44Path(path: string): boolean {
    try {
      this.hdNode.derive(path);
      return true;
    } catch (e) {
      return false;
    }
  }

  // eslint-disable-next-line require-jsdoc
  toJSON(): WalletJSON {
    const obj: {[coinIndex: number]: CoinWalletJSON} = {};
    for (const coinIndex in this.coinWallets) {
      if (!this.coinWallets.hasOwnProperty(coinIndex)) {
        continue;
      }
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
}

