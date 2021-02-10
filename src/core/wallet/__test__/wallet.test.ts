import {Wallet} from '../wallet';
import * as bip39 from 'bip39';
import {CoinCode} from '../coins';

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
      const account = wallet.coinWallets[CoinCode.ETH]
          .deriveHDAccount(`M/0\'/0/${i}`);
      expect(account.privateKey.toString('hex')).toEqual(privateKeys[i]);
      expect(account.address).toEqual(addresses[i]);
    }
  });

  test('should be able to add standalone account', () => {
    const wallet = new Wallet(Buffer.from('1234', 'hex'));
    const privateKey =
      '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
    const address = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
    wallet.getCoinWallet(CoinCode.ETH)
        ?.addStandaloneAccounts(Buffer.from(privateKey, 'hex'));
    const acc = wallet.getCoinWallet(CoinCode.ETH)
        ?.getStandaloneAccount(0);
    expect(acc?.address).toEqual(address);
    expect(wallet.getCoinWallet(CoinCode.ETH)?.standaloneAccounts)
        .toHaveLength(1);
  });

  test('should serialize & deserialize accounts', () => {
    const wallet = new Wallet(Buffer.from('1234', 'hex'));
    const privateKey =
      '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
    const address = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
    wallet.getCoinWallet(CoinCode.ETH)
        ?.addStandaloneAccounts(Buffer.from(privateKey, 'hex'));
    const json = wallet.toJSON();
    const recoveredWallet = Wallet.fromJSON(json);
    expect(recoveredWallet).not.toBeUndefined();
    expect(wallet.getCoinWallet(CoinCode.ETH)
        ?.getStandaloneAccount(0)
        ?.address,
    ).toEqual(address);
  });

  test('should check valid bip32 path', () => {
    let path = 'abcdefdskjf';
    expect(Wallet.isValidBip32Path(path)).toBeFalsy();
    path = '0/1/2/3';
    expect(Wallet.isValidBip32Path(path)).toBeFalsy();
    path = 'm/0/1/2/3';
    expect(Wallet.isValidBip32Path(path)).toBeTruthy();
    path = 'm/0\'/1\'/2\'/3/';
    expect(Wallet.isValidBip32Path(path)).toBeTruthy();
  });

  test('should get coin code from bip44 path', () => {
    let path = 'm/44\'/0/1/2';
    expect(() => Wallet.getCoinCodeFromBip44Path(path)).toThrow('is not valid');
    path = 'm/44\'/0\'/0/0';
    expect(Wallet.getCoinCodeFromBip44Path(path)).toBe(CoinCode.BTC);
    path = 'm/44\'/999\'/0';
    expect(() => Wallet.getCoinCodeFromBip44Path(path))
        .toThrow('not supported');
  });

  test('should get account from static methods', ()=>{
    const mnemonic = 'myth like bonus scare over problem client ' +
      'lizard pioneer submit female collect';
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const wallet = new Wallet(seed);
    const acc0 = wallet.getCoinWallet(CoinCode.BTC).getBip44Account(0);
    const bip44Path = 'm/44\'/0\'/0\'/0/0';
    expect(Wallet.getAccount(mnemonic, bip44Path).address)
        .toEqual(acc0.address);
    expect(Wallet.getAccount(seed, bip44Path).address)
        .toEqual(acc0.address);
    expect(Wallet.getAccount(seed.toString('hex'), CoinCode.BTC, 'm/0\'/0/0').address)
        .toEqual(acc0.address);
  });
});
