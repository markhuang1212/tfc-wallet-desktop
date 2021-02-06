export abstract class Bip44Root {
  get path(): string {
    return 'm/44\'';
  }
}

export abstract class Bip44Node {
  protected constructor(
    public readonly parent: Bip44Node | Bip44Root,
    public readonly index: string,
  ) {
    this.index = this.index.trim();
    if (this.index.endsWith('/')) {
      this.index = this.index.slice(0, this.index.length - 1);
    }
  }

  get path(): string {
    let p = this.parent.path.trim();
    if (!p.endsWith('/')) {
      p += '/';
    }
    p += this.index;
    return p;
  }
}

export abstract class Address extends Bip44Node {
  constructor(
    readonly seed: Buffer,
    change: Change, index: number) {
    super(change, `${index}`);
  }

  abstract get privateKey(): Buffer;

  abstract get publicKey(): Buffer;

  abstract toString(): string;
}

export class Change extends Bip44Node {
  constructor(
    readonly seed: Buffer,
    account: Account, index: number) {
    super(account, `${index}`);
  }

  getAddress(index: number): Address {
    const change = this.parent as Change;
    const coin = change.parent as Coin;
    return new coin.AddressImpl(this.seed, this, index);
  }
}

export class Account extends Bip44Node {
  constructor(
    readonly seed: Buffer,
    coin: Coin, index: number) {
    super(coin, `${index}'`);
  }

  getChange(index: number): Change {
    return new Change(this.seed, this, index);
  }

  getAddress(index: number): Address {
    const coin = this.parent as Coin;
    return new coin.AddressImpl(this.seed, this.getChange(0), index);
  }
}

export class Coin extends Bip44Node {
  constructor(
    readonly seed: Buffer,
    root: Bip44Root, coinType: number,
    readonly AddressImpl: new (s: Buffer, c: Change, i: number) => Address) {
    super(root, `${coinType}'`);
  }

  getAccount(index: number): Account {
    return new Account(this.seed, this, index);
  }

  getAddress(index: number): Address {
    return new this.AddressImpl(
        this.seed, this.getAccount(0).getChange(0), index,
    );
  }
}
