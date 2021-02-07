import HDNode from 'hdkey';

/**
 * The root node in the hierarchical tree of BIP32 specification.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 */
export abstract class Bip32Root {
  readonly hdKey: HDNode;

  /**
   * Constructor
   * @param {Buffer} seed the seed to generate private keys
   * @param {string} index index of this root node
   */
  constructor(
    public readonly seed: Buffer,
    public readonly index: string,
  ) {
    this.hdKey = HDNode.fromMasterSeed(this.seed);
  }

  /**
   * Root path in the hierarchical tree
   */
  get path(): string {
    return this.index;
  }
}

/**
 * A node in the hierarchical tree of BIP32 specification.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 */
export abstract class Bip32Node {
  readonly hdKey: HDNode;

  /**
   * Constructor
   *
   * @param {Bip32Root | Bip32Node} parent the parent node in the tree
   * @param {string} index the index of current node.
   */
  protected constructor(
    public readonly parent: Bip32Node | Bip32Root,
    public readonly index: string,
  ) {
    this.index = this.index.trim();
    if (this.index.endsWith('/')) {
      this.index = this.index.slice(0, this.index.length - 1);
    }
    this.hdKey = this.master.hdKey.derive(this.path);
  }

  /**
   * Getter for the path of current node in the tree.
   */
  get path(): string {
    let p = this.parent.path.trim();
    if (!p.endsWith('/')) {
      p += '/';
    }
    p += this.index;
    return p;
  }

  /**
   * Getter for the master node
   */
  get master(): Bip32Root {
    let m: Bip32Node | Bip32Root = this;
    while (m instanceof Bip32Node) {
      m = m.parent;
    }
    return m;
  }
}

