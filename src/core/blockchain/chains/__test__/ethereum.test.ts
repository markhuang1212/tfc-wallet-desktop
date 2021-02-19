import SDK, {MockEthereum, TFC} from 'jasmine-eth-ts';
import {EthereumChain} from '../ethereum';
import {EthAccount, Wallet} from '../../../wallet';
import {CoinCode} from '../../../defines';
import BN from 'bn.js';
import {Endpoints} from '../../defines';

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

  test('should transfer ETH correctly', (done) => {
    const wallet = new Wallet(Buffer.from('0', 'hex'));
    const coinWallet = wallet.getCoinWallet(CoinCode.ETH);
    coinWallet.addStandaloneAccounts(
        Buffer.from(mockEth.predefinedPrivateKeys[0].slice(2), 'hex'),
    );
    // @ts-ignore
    const chain = new EthereumChain(mockEth.endpoint);
    const txEvents = chain.transfer(
        coinWallet.getBip44Account(0).address,
        BigInt(1),
      coinWallet.getStandaloneAccount(0) as EthAccount,
    );
    txEvents.on('pending', (txHash) => {
      expect(txHash).toEqual(
          '0x1f0b41628037ab39b24253cbbc08ed869ac586f43429a73cd634db7e81170cbd',
      );
    });
    txEvents.on('finalized', async () => {
      const balance = await chain.getBalance(coinWallet.getBip44Account(0));
      expect(balance).toEqual(BigInt(1));
      done();
    });
  });
});

describe('Ethereum ERC20', () => {
  let mockEth: MockEthereum;
  let tfcErc20: TFC;
  const wallet = Wallet.fromMnemonic(
      'myth like bonus scare over problem client ' +
    'lizard pioneer submit female collect');
  const ethWallet = wallet.getCoinWallet(CoinCode.ETH);
  // Jasmine Test Account 1
  ethWallet.addStandaloneAccounts(
      '96ca1b47bd2f7b6c1a3018e6038be291c9f5ff9556e5200f677c295693a31c60',
  );
  // Jasmine Test Account 2
  ethWallet.addStandaloneAccounts(
      '1a2ea9dbd802477439749f673e890ed6e7bc95b58f2702bfb1d6c5ffdc150035',
  );

  beforeEach(async () => {
    mockEth = new MockEthereum();
    // deploy TFC
    const sdk = new SDK(mockEth.endpoint);
    const deployer = sdk.retrieveAccount(mockEth.predefinedPrivateKeys[0]);
    const addr = await sdk.deployTFC(deployer);
    tfcErc20 = sdk.getTFC(addr);
    await tfcErc20
        .mint(deployer.address, new BN('1000000000000000000'), deployer);
  });

  test('should get ERC20 balance correctly', async () => {
    // @ts-ignore
    const chain = new EthereumChain(mockEth.endpoint);
    const addr = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
    const bal = await chain.erc20BalanceOf(tfcErc20.address, addr);
    expect(bal.toString(10))
        .toEqual((await tfcErc20.balanceOf(addr)).toString(10));
  });

  test('should transfer erc20', (done)=>{
    const wallet = new Wallet(Buffer.from('0', 'hex'));
    const coinWallet = wallet.getCoinWallet(CoinCode.ETH);
    coinWallet.addStandaloneAccounts(mockEth.predefinedPrivateKeys[0]);
    // @ts-ignore
    const chain = new EthereumChain(mockEth.endpoint);
    chain.erc20Transfer(
        tfcErc20.address,
        coinWallet.getBip44Account(0),
        BigInt('1'),
        coinWallet.getStandaloneAccount(0) as EthAccount,
    ).on('finalized', async (txHash) => {
      const bal = await chain.erc20BalanceOf(
          tfcErc20.address,
          coinWallet.getBip44Account(0),
      );
      expect(bal.toString()).toEqual(BigInt(1).toString());
      done();
    }).on('error', (e) =>{
      throw e;
    });
  });

  test('should get ETH transfer records', async ()=>{
    const chain = new EthereumChain(Endpoints[CoinCode.ETH].rinkeby);
    const records =
      await chain.getETHTransferRecordList(ethWallet.getStandaloneAccount(0)!);
    expect(records.length).toBeGreaterThan(0);
  });

  test('should get ERC20 transfer records', async ()=>{
    const chain = new EthereumChain(Endpoints[CoinCode.ETH].rinkeby);
    const records =
      await chain.getErc20TransferRecordList(
          // TFC-ERC20 contract on rinkeby
          '0x401Ef2b876Db2608e4A353800BBaD1E3e3Ea8B46',
          ethWallet.getStandaloneAccount(1)!,
      );
    expect(records.length).toBeGreaterThan(0);
  });
});
