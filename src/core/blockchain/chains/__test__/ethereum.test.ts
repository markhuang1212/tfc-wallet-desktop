import {MockEthereum} from 'jasmine-eth-ts';
import {EthereumChain} from '../ethereum';
import {EthAccount, Wallet} from '../../../wallet';
import {CoinCode} from '../../../defines';

describe('EthereumChain', () => {
  let mockEth: MockEthereum;
  beforeEach(() => {
    mockEth = new MockEthereum();
  });

  test('should get balance correctly', async () => {
    // @ts-ignore
    const chain = new EthereumChain(mockEth.endpoint);
    const addr = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
    const bal = await chain.getBalance(addr);
    expect(bal).toEqual(BigInt('100000000000000000000'));
  });

  test('should transfer ETH correctly', async () => {
    const wallet = new Wallet(Buffer.from('0', 'hex'));
    const coinWallet = wallet.getCoinWallet(CoinCode.ETH);
    coinWallet.addStandaloneAccounts(
        Buffer.from(mockEth.predefinedPrivateKeys[0].slice(2), 'hex'),
    );
    // @ts-ignore
    const chain = new EthereumChain(mockEth.endpoint);
    const txHash = await chain.transfer(
        coinWallet.getBip44Account(0).address,
        BigInt(1),
        coinWallet.getStandaloneAccount(0) as EthAccount,
    );
    // eslint-disable-next-line max-len
    expect(txHash).toEqual('0x1f0b41628037ab39b24253cbbc08ed869ac586f43429a73cd634db7e81170cbd');
  });
});
