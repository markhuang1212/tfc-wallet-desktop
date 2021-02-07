import {Bip32Node, Bip32Root} from '../bip32';
import HDNode = require('hdkey');

describe('bip44 tree structure', () => {
  // eslint-disable-next-line require-jsdoc
  class Root extends Bip32Root {
  }

  // eslint-disable-next-line require-jsdoc
  class InnerNode extends Bip32Node {
    // eslint-disable-next-line require-jsdoc
    constructor(parent: Bip32Node | Bip32Root, index: string) {
      super(parent, index);
    }
  }

  test('should derive path correctly', () => {
    const root = new Root(Buffer.from('123', 'hex'), 'm/44\'');
    const purpose = new InnerNode(root, '60\'');
    expect(purpose.path).toEqual('m/44\'/60\'');
    const account = new InnerNode(purpose, '0\'');
    expect(account.path).toEqual('m/44\'/60\'/0\'');
  });

  test('should derive hdKey correctly', ()=>{
    const root = new Root(Buffer.from('123', 'hex'), 'm');
    const child = new InnerNode(root, '0');
    const key = HDNode.fromMasterSeed(Buffer.from('123', 'hex'));
    const derived = key.derive('m/0');
    expect(child.hdKey.privateKey.toString())
        .toEqual(derived.privateKey.toString());
  });
});
