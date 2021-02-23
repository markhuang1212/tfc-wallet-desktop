// eslint-disable-next-line require-jsdoc
import HDNode from 'hdkey';

// eslint-disable-next-line require-jsdoc
export class HDWallet {
  // eslint-disable-next-line require-jsdoc
  constructor(
    public hdNode: HDNode,
  ) {
  }

  // eslint-disable-next-line require-jsdoc
  protected deriveBip32Path(bip32Path: string): HDWallet {
    const node = this.hdNode.derive(bip32Path);
    return new HDWallet(node);
  }

  // eslint-disable-next-line require-jsdoc
  protected derivePrivateKey(bip32Path: string): Buffer {
    return this.deriveBip32Path(bip32Path).hdNode.privateKey;
  }

  // eslint-disable-next-line require-jsdoc
  get privateKey(): Buffer {
    return this.hdNode.privateKey;
  }
}
