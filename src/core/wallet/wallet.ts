import HDNode from 'hdkey';
import {HDWallet} from './bip32';
import {
  CoinDefines, CoinCode,
} from './coins';
import {CoinWallet, CoinWalletJSON} from './coin-wallet';


export interface WalletJSON {
  seed: string,
  coinWallets: {
    [C in CoinCode]: CoinWalletJSON<C>
  }
}


// eslint-disable-next-line require-jsdoc
export class Wallet extends HDWallet {
  // @ts-ignore
  readonly coinWallets: {[C in CoinCode]: CoinWallet<C>} = {};

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
}

