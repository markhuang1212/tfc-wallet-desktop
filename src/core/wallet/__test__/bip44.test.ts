import {Bip44Node, Bip44Root} from '../bip44';

describe('bip44 tree structure', () => {
  // eslint-disable-next-line require-jsdoc
  class Root extends Bip44Root {
  }

  // eslint-disable-next-line require-jsdoc
  class InnerNode extends Bip44Node {
    // eslint-disable-next-line require-jsdoc
    constructor(parent: Bip44Node | Bip44Root, index: string) {
      super(parent, index);
    }
  }

  test('should derive path correctly', () => {
    const root = new Root();
    const purpose = new InnerNode(root, '60\'');
    expect(purpose.path).toEqual('m/44\'/60\'');
    const account = new InnerNode(purpose, '0\'');
    expect(account.path).toEqual('m/44\'/60\'/0\'');
  });
});
