import {Chain, TransactionID, TxEvents} from '../chain';
import {CoinCode} from '../../defines';
import BN from 'bn.js';
import {AccountImplMapping} from '../../wallet/coins/defines';
import Web3 from 'web3';
import Web3Core from 'web3-core';
import {ContractSendMethod} from 'web3-eth-contract';
import {PromiEvent} from '@troubkit/tools';
import axios, {AxiosResponse} from 'axios';

// eslint-disable-next-line require-jsdoc
export class EthereumChain extends Chain<CoinCode.ETH> {
  readonly web3: Web3;

  // etherscan is only available for public chain
  etherscan: EtherscanProvider | undefined;

  // eslint-disable-next-line require-jsdoc
  constructor(endpoint: string) {
    super();
    this.web3 = new Web3(endpoint);
  }

  // eslint-disable-next-line require-jsdoc
  private feedTxEvents(
      eventEmitter: PromiEvent<TransactionID, TxEvents>,
      resolve: (value: TransactionID | PromiseLike<TransactionID>) => void,
      reject: (reason?: unknown) => void,
      signedTx: string,
  ) {
    this.web3.eth
        .sendSignedTransaction(signedTx)
        .on('transactionHash', (hash)=>{
          eventEmitter.emit('pending', hash);
        })
        .on('receipt', (receipt)=>{
          eventEmitter.emit('executed', receipt.transactionHash);
          if (this.confirmationRequirement == 0) {
            eventEmitter.emit('finalized', receipt.transactionHash);
            resolve(receipt.transactionHash);
          }
        })
        .on('confirmation', (confirmationNumber, receipt)=>{
          if (confirmationNumber === this.confirmationRequirement) {
            eventEmitter.emit('finalized', receipt.transactionHash);
            resolve(receipt.transactionHash);
          }
        })
        .on('error', (e) => {
          eventEmitter.emit('error', e);
          reject(e);
        });
  }

  // eslint-disable-next-line require-jsdoc
  async getBalance(accountOrAddress: AccountImplMapping[CoinCode.ETH] | string)
    : Promise<BigInt> {
    let addr;
    if (typeof accountOrAddress === 'string') {
      addr = accountOrAddress;
    } else {
      addr = accountOrAddress.address;
    }
    const bal = await this.web3.eth.getBalance(addr);
    return BigInt(bal.toString());
  }

  // eslint-disable-next-line require-jsdoc
  private async buildContractInvocationTransaction(
      contractMethodCall: ContractSendMethod,
      contractAddress: string,
      from: Web3Core.Account,
  ): Promise<Web3Core.TransactionConfig> {
    const gasLimit =
      await contractMethodCall.estimateGas({from: from.address});
    return {
      from: from.address,
      to: contractAddress,
      data: contractMethodCall.encodeABI(),
      gas: gasLimit,
    };
  }

  // eslint-disable-next-line require-jsdoc
  private async signTransaction(
      transaction: Web3Core.TransactionConfig,
      from: Web3Core.Account,
  ): Promise<Web3Core.SignedTransaction> {
    if (!transaction.gasPrice) {
      transaction.gasPrice = await this.web3.eth.getGasPrice();
    }
    if (!transaction.gas) {
      transaction.gas = await this.web3.eth.estimateGas(transaction);
    }
    if (!transaction.nonce) {
      transaction.nonce = await this.web3.eth
          .getTransactionCount(from.address, 'pending');
    }
    if (!transaction.chainId) {
      transaction.chainId = await this.web3.eth.getChainId();
    }
    if (!transaction.value) {
      transaction.value = 0;
    }
    return await from.signTransaction(transaction);
  }

  // eslint-disable-next-line require-jsdoc
  transfer(
      recipient: string | AccountImplMapping[CoinCode.ETH],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.ETH],
  ): PromiEvent<TransactionID, TxEvents> {
    let addr: string;
    if (typeof recipient === 'string') {
      addr = recipient;
    } else {
      addr = recipient.address;
    }
    const sdkSender = this.web3.eth.accounts
        .privateKeyToAccount(sender.privateKey.toString('hex'));
    const tx = {
      to: addr,
      value: new BN(amount.toString(10)),
      from: sender.address,
    };
    return new PromiEvent<TransactionID, TxEvents>(
        (resolve, reject, emitter) => {
          this.signTransaction(
              tx,
              sdkSender,
          ).then((signedTx) => {
            this.feedTxEvents(
                emitter,
                resolve,
                reject,
                signedTx.rawTransaction as string,
            );
          });
        },
    );
  }

  // eslint-disable-next-line require-jsdoc
  async erc20BalanceOf(
      erc20Address: string,
      accountOrAddress: AccountImplMapping[CoinCode.ETH] | string,
  ): Promise<BigInt> {
    const abi = require('erc-20-abi');
    const token = new this.web3.eth.Contract(abi, erc20Address);
    let addr;
    if (typeof accountOrAddress === 'string') {
      addr = accountOrAddress;
    } else {
      addr = accountOrAddress.address;
    }
    const bal = await token.methods.balanceOf(addr).call();
    return BigInt(bal);
  }

  // eslint-disable-next-line require-jsdoc
  erc20Transfer(
      erc20Address: string,
      recipient: string | AccountImplMapping[CoinCode.ETH],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.ETH],
  ): PromiEvent<TransactionID, TxEvents> {
    const abi = require('erc-20-abi');
    const token = new this.web3.eth.Contract(abi, erc20Address);
    let addr;
    if (typeof recipient === 'string') {
      addr = recipient;
    } else {
      addr = recipient.address;
    }
    const contractInvocation =
      token.methods.transfer(addr, amount.toString(10));
    const sdkSender = this.web3.eth.accounts
        .privateKeyToAccount(sender.privateKey.toString('hex'));
    return new PromiEvent<TransactionID, TxEvents>(
        async (resolve, reject, emitter) => {
          try {
            const tx = await this.buildContractInvocationTransaction(
                contractInvocation,
                erc20Address,
                sdkSender,
            );
            this.signTransaction(
                tx,
                sdkSender,
            ).then((signedTx) => {
              this.feedTxEvents(
                  emitter,
                  resolve,
                  reject,
                signedTx.rawTransaction as string,
              );
            });
          } catch (e) {
            reject(e);
          }
        },
    );
  }

  // eslint-disable-next-line require-jsdoc
  private async initializeEtherscan() {
    if (this.etherscan) {
      return;
    }
    const networkMap = {
      1: 'https://api.etherscan.io/api',
      4: 'https://api-rinkeby.etherscan.io/api',
    };
    // get networkId
    const networkId = await this.web3.eth.net.getId();
    if (networkId in networkMap) {
      this.etherscan = new EtherscanProvider(
          networkMap[networkId as 1 | 4],
          '6FTP6N6HH43PTTJ89P9VKKKZWRMV4NH245',
      );
    } else {
      throw new Error('Etherscan is not available on current network');
    }
  }

  /**
   * Get a list of transactions from account.
   * Transactions are sorted from latest to earliest.
   *
   * @param {string | EthAccount} account the account to get transactions
   */
  async getETHTransferRecordList(
      account: string | AccountImplMapping[CoinCode.ETH],
  ): Promise<TransferRecord[]> {
    let address: string;
    if (typeof account === 'string') {
      address = account;
    } else {
      address = account.address;
    }
    await this.initializeEtherscan();
    const txs = await this.etherscan!.getListOfNormalTransactionsByAddress(
        address,
        BigInt(0),
        'latest',
        'desc',
    );
    return txs
        .map((tx) => {
          return {
            txHash: tx.hash,
            tokenAddress: undefined,
            from: tx.from,
            to: tx.to,
            amount: BigInt(tx.value),
            confirmations: tx.confirmations,
          };
        })
        .filter((tx) => tx.amount > 0);
  }

  /**
   * Get a list of ERC20 transactions from account.
   * Transactions are sorted from latest to earliest.
   *
   * @param {string} erc20ContractAddress
   * @param {string | EthAccount} account the account to get transactions
   */
  async getErc20TransferRecordList(
      erc20ContractAddress: string,
      account: string | AccountImplMapping[CoinCode.ETH],
  ): Promise<TransferRecord[]> {
    let address: string;
    if (typeof account === 'string') {
      address = account;
    } else {
      address = account.address;
    }
    await this.initializeEtherscan();
    const txs = await this.etherscan!.getListOfErc20TransferEventsByAddress(
        address,
        BigInt(0),
        'latest',
        'desc',
    );
    return txs
        .filter((tx) =>
          this.web3.utils.toChecksumAddress(tx.contractAddress) ===
          this.web3.utils.toChecksumAddress(erc20ContractAddress))
        .map((tx) => {
          return {
            txHash: tx.hash,
            tokenAddress: undefined,
            from: tx.from,
            to: tx.to,
            amount: BigInt(tx.value),
            confirmations: tx.confirmations,
          };
        });
  }
}

interface EtherscanTransaction {
  blockNumber: BigInt,
  blockHash: string,
  hash: string,
  from: string,
  to: string,
  value: string,
  // eslint-disable-next-line camelcase
  txrecipient_status: boolean,
  confirmations: number,
  contractAddress: string,
}

export interface TransferRecord {
  txHash: string,

  // if tokenAddress is undefined, the transfer is about ETH.
  // otherwise tokenAddress is the address of ERC20 token being transferred
  tokenAddress: string | undefined,

  from: string,
  to: string,
  amount: BigInt,

  // the number of confirmations this transfer transaction has
  confirmations: number,
}

// eslint-disable-next-line require-jsdoc
class EtherscanProvider {
  // eslint-disable-next-line require-jsdoc
  constructor(
    readonly url: string,
    readonly apiKey: string,
  ) {
  }

  // eslint-disable-next-line require-jsdoc
  private static throwIfAPIError(resp: AxiosResponse): unknown {
    if (Math.floor(resp.status / 100) !== 2) {
      throw new Error('Etherscan API HTTP error with code ' + resp.status);
    }
    const data = resp.data as {
      status: string,
      message: string,
      result: string | unknown
    };
    if (data.status !== '1') {
      throw new Error(`${data.message}: ${data.result as string}`);
    }
    return data.result;
  }

  // eslint-disable-next-line require-jsdoc
  async getListOfNormalTransactionsByAddress(
      address: string,
      startBlock: BigInt,
      endBlock: BigInt | 'latest',
      sort: 'asc' | 'desc',
  ): Promise<EtherscanTransaction[]> {
    const resp = await axios.get(this.url, {
      params: {
        apikey: this.apiKey,
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: startBlock.toString(10),
        endblock: endBlock.toString(10),
        sort: sort,
      },
    });
    return EtherscanProvider
        .throwIfAPIError(resp) as EtherscanTransaction[];
  }

  // eslint-disable-next-line require-jsdoc
  async getListOfErc20TransferEventsByAddress(
      address: string,
      startBlock: BigInt,
      endBlock: BigInt | 'latest',
      sort: 'asc' | 'desc',
  ): Promise<EtherscanTransaction[]> {
    const resp = await axios.get(this.url, {
      params: {
        apikey: this.apiKey,
        module: 'account',
        action: 'tokentx',
        address: address,
        startblock: startBlock.toString(10),
        endblock: endBlock.toString(10),
        sort: sort,
      },
    });
    return EtherscanProvider
        .throwIfAPIError(resp) as EtherscanTransaction[];
  }
}
