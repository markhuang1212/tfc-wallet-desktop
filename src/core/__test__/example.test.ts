import {CoinWallet, EthAccount, Wallet, WalletJSON} from '../wallet';
import {CoinCode} from '../defines';
import {EthereumChain, TfcChain, TransferRecord} from '../blockchain';
import {Chain, TransactionID, TxEvents} from '../blockchain/chain';
import {PromiEvent} from '@troubkit/tools';
import config from '../config';

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

  test('Set wallet mnemonic to a new one', ()=>{
    const oldMnemonic = 'dumb range venue feel three miss nominee ' +
      'punch bonus bubble stamp cook buyer legend water';
    const wallet = Wallet.fromMnemonic(oldMnemonic);
    const standalonePrivateKey: string =
      '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
    // import private key to the wallet
    wallet.getCoinWallet(CoinCode.ETH)
        .addStandaloneAccounts(standalonePrivateKey);
    expect(wallet.getCoinWallet(CoinCode.ETH).getStandaloneAccount(0)!.address)
        .toEqual('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
    expect(wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0).address)
        .toEqual('0xDe4bc9bd3DF3a13680dd9B4D14C1a48D01Ef25ca');

    // change mnemonic
    // (similar to change seed: wallet.seed = Buffer.from('0x12', 'hex') )
    wallet.mnemonic = 'valve minor tent finger smooth intact slam ' +
      'shoe slight solve sausage february wall soon huge';
    // standalone accounts is preserved
    expect(wallet.getCoinWallet(CoinCode.ETH).getStandaloneAccount(0)!.address)
        .toEqual('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
    // bip44 account is changed
    expect(wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0).address)
        .toEqual('0xEE615c350491fC0996Baa823328eaCb231067A1a');
  });
});

describe('Examples for Ethereum', () => {
  const mnemonic = 'myth like bonus scare over problem client ' +
    'lizard pioneer submit female collect';
  const wallet: Wallet = Wallet.fromMnemonic(mnemonic);

  test('Get ETH balance of Ethereum account', async () => {
    const ethChain: Chain<CoinCode.ETH> =
      new EthereumChain(config[CoinCode.ETH].rinkeby.endpoint);
    // get balance of an account
    const acc: EthAccount =
      wallet.getCoinWallet(CoinCode.ETH).getBip44Account(0);
    const balance: BigInt = await ethChain.getBalance(acc);
    console.log('ETH balance of ' + acc.address + ': ' + balance.toString(10));
  });

  test('Get ERC20 balance of Ethereum account', async () => {
    const ethChain: EthereumChain =
      new EthereumChain(config[CoinCode.ETH].rinkeby.endpoint);
    // get balance of ERC20
    const erc20ContractAddress =
      config[CoinCode.ETH].rinkeby.contracts.TFC_ERC20;
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
      new EthereumChain(config[CoinCode.ETH].rinkeby.endpoint);
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
      new EthereumChain(config[CoinCode.ETH].rinkeby.endpoint);
    // the number of confirmation blocks needed to
    // consider a transaction is finalized
    ethChain.confirmationRequirement = 1;
    const erc20ContractAddress =
      config[CoinCode.ETH].rinkeby.contracts.TFC_ERC20;
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

  test('Get list of ETH transfer records', async () => {
    const ethChain: EthereumChain =
      new EthereumChain(config[CoinCode.ETH].rinkeby.endpoint);
    const transferRecords: TransferRecord[] =
      await ethChain.getETHTransferRecordList(
          '0xD265C6c7487154803CdA1863A2ddeEcd76Ca2382', // account address
      );
    console.log(transferRecords);
  });
  test('Get list of ERC20 transfer records', async () => {
    const ethChain: EthereumChain =
      new EthereumChain(config[CoinCode.ETH].rinkeby.endpoint);
    const transferRecords: TransferRecord[] =
      await ethChain.getErc20TransferRecordList(
          '0x401Ef2b876Db2608e4A353800BBaD1E3e3Ea8B46', // ERC20 contract
          '0xD265C6c7487154803CdA1863A2ddeEcd76Ca2382', // account address
      );
    console.log(transferRecords);
  });
});

describe('Examples for TFC-Chain', () => {
  test('different cluster/blockchain', ()=>{
    const tfcOpenbiChain =
      new TfcChain(config[CoinCode.TFC_CHAIN]['openbi'].endpoint);
    const tfcBlockchainfsChain =
      new TfcChain(config[CoinCode.TFC_CHAIN]['blockchainfs'].endpoint);
    expect(tfcOpenbiChain).not.toBeNull();
    expect(tfcBlockchainfsChain).not.toBeNull();
  });

  test('get balance of TFC', async () => {
    const tfcChain: TfcChain =
      new TfcChain(config[CoinCode.TFC_CHAIN]['openbi'].endpoint);
    const tfcAccount = Wallet.getAccount(CoinCode.TFC_CHAIN, Buffer.from(
        '1374ded99e64cf8da7161e720f1e8e842bb1f44c0d061581299ec2e721419cf8',
        'hex',
    ));
    const balance: BigInt = await tfcChain.getBalance(tfcAccount);
    console.log('TFC balance of ' + tfcAccount.address + ': ' +
      balance.toString(10));
  });

  test('exchange TFC to TFC-ERC20', (done) => {
    const tfcChain: TfcChain =
      new TfcChain(config[CoinCode.TFC_CHAIN]['openbi'].endpoint);
    const tfcAccount = Wallet.getAccount(CoinCode.TFC_CHAIN, Buffer.from(
        '1374ded99e64cf8da7161e720f1e8e842bb1f44c0d061581299ec2e721419cf8',
        'hex',
    ));

    const ethAccount: EthAccount =
      Wallet.getAccount(CoinCode.ETH, Buffer.from(
          '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
          'hex',
      ));

    // The logic of exchange is:
    // 1. pay exchange transaction fee to a bridge address
    // 2. after the bridge receives the fee,
    // it will automatically mint TFC-ERC20 tokens for the Ethereum address
    const promiEvent = tfcChain.exchangeToErc20(
        tfcAccount,
        ethAccount,
        BigInt(1),
    );
    promiEvent.on('transactionFeePaying', (txHash) => {
      console.log('Paying exchange transaction fee...,' +
        ' transaction hash = ' + txHash);
    }).on('transactionFeePaid', (txHash) => {
      console.log('Exchange fee paid, waiting for process,' +
        ' transaction hash = ' + txHash);
    }).on('erc20Minting', () => {
      console.log('TFC-ERC20 mint transaction is submitted');
    }).on('erc20Minted', ()=>{
      console.log('TFC-ERC20 minted. Exchange finishes');
    });
    promiEvent.then(()=>{
      console.log('TFC-ERC20 minted. Exchange finishes');
      done();
    });
  });
});
