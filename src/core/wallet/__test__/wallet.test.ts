import {CoinTypes, Wallet} from '..';
import * as bip39 from 'bip39';

describe('wallet', () => {
  test('should generate correct ETH address', () => {
    const mnemonic = 'myth like bonus scare over problem client ' +
      'lizard pioneer submit female collect';
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const wallet = new Wallet(seed);
    const addresses = [
      '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
      '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
    ];
    const privateKeys = [
      '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
      '6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1',
      '6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c',
    ];
    for (let i = 0; i < addresses.length; i++) {
      const addr = wallet.coins[CoinTypes.ETH.index].getAddress(i);
      expect(addr.path).toEqual(`m/44\'/60\'/0\'/0/${i}`);
      expect(addr.privateKey.toString('hex')).toEqual(privateKeys[i]);
      expect(addr.toString()).toEqual(addresses[i]);
    }
  });
});
