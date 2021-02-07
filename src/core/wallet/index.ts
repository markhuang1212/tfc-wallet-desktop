import {Bip32Root} from './bip32';
import {Address, Change, Coin} from './wallet';
import KeyPair, {hdkey} from 'ethereumjs-wallet';

export interface CoinType {
  index: number,
  hexa: string,
  symbol: string
  name: string,
}

/**
 * Definitions of CoinTypes
 */
export class CoinTypes {
  static readonly ETH: CoinType = {
    index: 60,
    hexa: '0x8000003c',
    symbol: 'ETH',
    name: 'Ether',
  };
}

/**
 * ETH Address derivation implementation
 */
export class EthAddress extends Address {
  private keyPair: KeyPair;

  /**
   * Constructor
   *
   * @param {Change} change the parent Change node
   * @param {number} index the index of current address node
   */
  constructor(change: Change, index: number) {
    super(change, index);
    const hdWallet = hdkey.fromMasterSeed(this.master.seed);
    this.keyPair = hdWallet.derivePath(this.path).getWallet();
  }

  /**
   * Getter for private key.
   */
  get privateKey(): Buffer {
    return this.keyPair.getPrivateKey();
  }

  /**
   * Getter for public key.
   */
  get publicKey(): Buffer {
    return this.keyPair.getPublicKey();
  }

  /**
   * Getter for address as hex string.
   * @return {string}
   */
  toString(): string {
    return this.keyPair.getChecksumAddressString();
  }
}


/**
 * Enhanced BIP44 wallet, with support for independent private keys.
 */
export class Wallet extends Bip32Root {
  readonly coins: { [coinIndex: number]: Coin } = {};

  /**
   * Constructor
   *
   * @param {Buffer} seed the seed to generate private keys using BIP32
   */
  constructor(
      seed: Buffer,
  ) {
    super(seed, 'm/44\'');
    this.coins = {
      [CoinTypes.ETH.index]: new Coin(this, CoinTypes.ETH.index, EthAddress),
    };
  }

  /**
   * Get Coin using its coin_type index.
   *
   * @param {number} coinType the index of the coin_type
   * @return {Coin}
   */
  getCoin(coinType: number): Coin {
    return this.coins[coinType];
  }
}
