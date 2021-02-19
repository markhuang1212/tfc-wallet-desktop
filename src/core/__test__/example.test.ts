import {CoinWallet, EthAccount, Wallet, WalletJSON} from '../wallet';
import {CoinCode} from '../defines';
import {EthereumChain} from '../blockchain';
import {Endpoints} from '../blockchain/defines';
import {Chain, TransactionID, TxEvents} from '../blockchain/chain';
import {PromiEvent} from '@troubkit/tools';

describe('Examples for wallet', () => {
  test('Create wallet from mnemonic and get the first ETH account', () => {
    const mnemonic = 'myth like bonus scare over problem client ' +
      'lizard pioneer submit female collect';
    // create a universal wallet
    const wallet: Wallet = Wallet.fromMnemonic(mnemonic);
    // get the sub-wallet for Ethereum
    const coinWallet: CoinWallet<CoinCode.ETH> =
      wallet.getCoinWallet(CoinCode.ETH);
    // get first account, i.e., m/44'/60'/0'/0/0
    const acc0: EthAccount = coinWallet.getBip44Account(0);
    expect(acc0.address).toEqual('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
  });

  test('Create wallet from seed and ' +
    'import a standalone private key for Ethereum', () => {
    const seed = '0x12345678';
    // create a universal wallet
    const wallet: Wallet = Wallet.fromSeed(seed);
    // get the sub-wallet for Ethereum
    const coinWallet: CoinWallet<CoinCode.ETH> =
      wallet.getCoinWallet(CoinCode.ETH);

    const standalonePrivateKey: string =
      '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
    // import private key to the wallet
    coinWallet.addStandaloneAccounts(standalonePrivateKey);

    expect(coinWallet.standaloneAccounts).toHaveLength(1);

    // get standalone account by its index
    const acc0: EthAccount = coinWallet.getStandaloneAccount(0) as EthAccount;
    expect(acc0.privateKey.toString('hex'))
        .toEqual(standalonePrivateKey);
    expect(acc0.address).toEqual('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
  });

  test('Directly get Account using BIP44', () => {
    const seed = '0x12345678';
    const bip44Path = 'm/44\'/60\'/0\'/0/0';
    const account: EthAccount = Wallet.getAccount(seed, bip44Path);
    console.log(account.address);
  });

  test('Directly get Account using private key', () => {
    const privateKey = Buffer.from(
        '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
        'hex',
    );
    const account: EthAccount = Wallet.getAccount(CoinCode.ETH, privateKey);
    console.log(account.address);
  });

  test('Export wallet to JSON and retrieve wallet from a JSON', () => {
    const seed = '0x12345678';
    // create a universal wallet
    const wallet: Wallet = Wallet.fromSeed(seed);
    // get the sub-wallet for Ethereum
    const coinWallet: CoinWallet<CoinCode.ETH> =
      wallet.getCoinWallet(CoinCode.ETH);

    const standalonePrivateKey: string =
      '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
    // import private key to the wallet
    coinWallet.addStandaloneAccounts(standalonePrivateKey);

    // export the universal wallet to a JSON-serializable object
    const obj: WalletJSON = wallet.toJSON();
    console.log(JSON.stringify(obj, null, 2));

    // import the JSON object to create a wallet
    const importedWallet: Wallet = Wallet.fromJSON(obj) as Wallet;
    expect(importedWallet.getCoinWallet(CoinCode.ETH)
        .getStandaloneAccount(0)?.address)
        .toEqual('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
  });
});

describe('Examples for Blockchain', () => {
  const mnemonic = 'myth like bonus scare over problem client ' +
    'lizard pioneer submit female collect';
  const wallet: Wallet = Wallet.fromMnemonic(mnemonic);

  test('Get ETH balance of Ethereum account', async () => {
    const ethChain: Chain<CoinCode.ETH> =
      new EthereumChain(Endpoints[CoinCode.ETH].rinkeby);
    // get balance of an account
    const acc: EthAccount =
      wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0);
    const balance: BigInt = await ethChain.getBalance(acc);
    console.log('ETH balance of ' + acc.address + ': ' + balance.toString(10));
  });

  test('Get ERC20 balance of Ethereum account', async () => {
    const ethChain: EthereumChain =
      new EthereumChain(Endpoints[CoinCode.ETH].rinkeby);
    // get balance of ERC20
    const erc20ContractAddress = '0x401Ef2b876Db2608e4A353800BBaD1E3e3Ea8B46';
    const acc: EthAccount =
      wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0);
    const balance: BigInt = await ethChain.erc20BalanceOf(
        erc20ContractAddress,
        acc,
    );
    console.log('ERC20 balance of ' + acc.address + ': ' +
      balance.toString(10));
  });

  test('Transfer ETH', (done) => {
    const ethChain: EthereumChain =
      new EthereumChain(Endpoints[CoinCode.ETH].rinkeby);
    // the number of confirmation blocks needed to
    // consider a transaction is finalized
    ethChain.confirmationRequirement = 6;
    // transfer ETH
    const promiEvent: PromiEvent<TransactionID, TxEvents> = ethChain.transfer(
        wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0), // to
        BigInt('1'), // amount
        wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0), // from
    );
    // promiEvent emits events during the lifecycle of a transaction
    promiEvent
        .on('pending', (txHash) => {
          console.log('transaction ' + txHash + ' has been submitted');
        })
        .on('executed', (txHash) => {
          console.log('transaction ' + txHash + ' has been executed ' +
          'but not yet finalized');
        })
        .on('finalized', (txHash) => {
          console.log('transaction ' + txHash + ' has been finalized');
        })
        .on('error', (err) => {
          console.log('transaction error ' + err.message);
        });
    // promiEvent is also a promise that resolves when transaction is finalized
    promiEvent.then((txHash) => {
      console.log('transaction ' + txHash + ' has been finalized');
      done();
    }).catch((err) => {
      console.log('transaction error ' + err.message);
    });
  }, 9999999);

  test('Transfer ERC20', (done) => {
    const ethChain: EthereumChain =
      new EthereumChain(Endpoints[CoinCode.ETH].rinkeby);
    // the number of confirmation blocks needed to
    // consider a transaction is finalized
    ethChain.confirmationRequirement = 1;
    const erc20ContractAddress = '0x401Ef2b876Db2608e4A353800BBaD1E3e3Ea8B46';
    // transfer ERC20
    const promiEvent: PromiEvent<TransactionID, TxEvents> =
      ethChain.erc20Transfer(
          erc20ContractAddress,
          wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0), // to
          BigInt('1'), // amount
          wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0), // from
      );
    // promiEvent emits events during the lifecycle of a transaction
    promiEvent
        .on('pending', (txHash) => {
          console.log('transaction ' + txHash + ' has been submitted');
        })
        .on('executed', (txHash) => {
          console.log('transaction ' + txHash + ' has been executed ' +
          'but not yet finalized');
        })
        .on('finalized', (txHash) => {
          console.log('transaction ' + txHash + ' has been finalized');
        })
        .on('error', (err) => {
          console.log('transaction error ' + err.message);
        });
    // promiEvent is also a promise that resolves when transaction is finalized
    promiEvent.then((txHash) => {
      console.log('transaction ' + txHash + ' has been finalized');
      done();
    }).catch((err) => {
      console.log('transaction error ' + err.message);
    });
  }, 9999999);
});
