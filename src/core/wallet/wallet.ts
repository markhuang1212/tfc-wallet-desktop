import {Bip32Node, Bip32Root} from './bip32';

/**
 * Representation of Coin level in BIP44
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 */
export class Coin extends Bip32Node {
  /**
   * Constructor
   *
   * @param {Bip32Root} root the BIP44 root node "m/44'"
   * @param {number} coinType number of the coin type
   * @param {AddressClass} AddressClass the class that
   * defines the algorithm to generate address from BIP32 HDKey
   */
  constructor(
      root: Bip32Root, coinType: number,
    readonly AddressClass: new (c: Change, i: number) => Address) {
    super(root, `${coinType}'`);
  }

  /**
   * Get the Account level Node defined in BIP44
   *
   * @param {number} index index of the account node
   * @return {Account}
   */
  getAccount(index: number): Account {
    return new Account(this, index);
  }

  /**
   * Get the Address level node defined in BIP44 using Account 0 and Change 0
   *
   * @param {number} index index of the address node
   * @return {Address}
   */
  getAddress(index: number): Address {
    return new this.AddressClass(
        this.getAccount(0).getChange(0), index,
    );
  }
}

/**
 * Representation of Account level node in BIP44.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 */
export class Account extends Bip32Node {
  /**
   * Constructor
   *
   * @param {Coin} coin the parent Coin node
   * @param {number} index the index of current account node
   */
  constructor(
      coin: Coin, index: number) {
    super(coin, `${index}'`);
  }

  /**
   * Get the Change level Node defined in BIP44
   *
   * @param {number} index index of the change node
   * @return {Change}
   */
  getChange(index: number): Change {
    return new Change(this, index);
  }

  /**
   * Get the Address level node defined in BIP44 using Change 0
   *
   * @param {number} index index of the address node
   * @return {Address}
   */
  getAddress(index: number): Address {
    const coin = this.parent as Coin;
    return new coin.AddressClass(this.getChange(0), index);
  }
}

/**
 * Representation of Change level node in BIP44.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 */
export class Change extends Bip32Node {
  /**
   * Constructor
   *
   * @param {Account} account the parent Account node
   * @param {number} index the index of current change node
   */
  constructor(
      account: Account, index: number) {
    super(account, `${index}`);
  }

  /**
   * Get the Address level node defined in BIP44.
   *
   * @param {number} index index of the address node
   * @return {Address}
   */
  getAddress(index: number): Address {
    const change = this.parent as Change;
    const coin = change.parent as Coin;
    return new coin.AddressClass(this, index);
  }
}

/**
 * Representation of Address level node in BIP44.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 */
export abstract class Address extends Bip32Node {
  /**
   * Constructor
   *
   * @param {Change} change the parent Change node
   * @param {number} index the index of current address node
   */
  protected constructor(
      change: Change, index: number) {
    super(change, `${index}`);
  }

  abstract get privateKey(): Buffer;

  abstract get publicKey(): Buffer;

  abstract toString(): string;
}
