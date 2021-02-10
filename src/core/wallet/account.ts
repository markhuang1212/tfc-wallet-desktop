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
