import {Chain, TxEvents, TypedEventEmitter} from '../chain';
import {CoinCode} from '../../defines';
import BN from 'bn.js';
import {AccountImplMapping} from '../../wallet/coins/defines';
import Web3 from 'web3';
import SDK from 'jasmine-eth-ts';

// eslint-disable-next-line require-jsdoc
export class EthereumChain extends Chain<CoinCode.ETH> {
  readonly web3: Web3;
  readonly jasmineSDK: SDK;

  // eslint-disable-next-line require-jsdoc
  constructor(endpoint: string) {
    super();
    this.web3 = new Web3(endpoint);
    this.jasmineSDK = new SDK(endpoint);
  }

  // eslint-disable-next-line require-jsdoc
  private feedTxEvents(
      eventEmitter: TypedEventEmitter<TxEvents>,
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
          }
        })
        .on('confirmation', (confirmationNumber, receipt)=>{
          if (confirmationNumber === this.confirmationRequirement) {
            eventEmitter.emit('finalized', receipt.transactionHash);
          }
        })
        .on('error', (e) => {
          eventEmitter.emit('error', e);
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
  transfer(
      recipient: string | AccountImplMapping[CoinCode.ETH],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.ETH],
  ): TypedEventEmitter<TxEvents> {
    let addr;
    if (typeof recipient === 'string') {
      addr = recipient;
    } else {
      addr = recipient.address;
    }
    const sdkSender = this.jasmineSDK
        .retrieveAccount(sender.privateKey.toString('hex'));
    const tx = {
      to: addr,
      value: new BN(amount.toString(10)),
      from: sender.address,
    };
    const emitter = new TypedEventEmitter<TxEvents>();
    this.jasmineSDK.signSimpleTransaction(
        tx,
        addr,
        {from: sdkSender.web3Account},
    ).then((signedTx) => {
      this.feedTxEvents(emitter, signedTx.rawTransaction as string);
    });
    return emitter;
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
  ): TypedEventEmitter<TxEvents> {
    const abi = require('erc-20-abi');
    const token = new this.web3.eth.Contract(abi, erc20Address);
    let addr;
    if (typeof recipient === 'string') {
      addr = recipient;
    } else {
      addr = recipient.address;
    }
    const tx = token.methods.transfer(addr, amount.toString(10));
    const sdkSender = this.jasmineSDK
        .retrieveAccount(sender.privateKey.toString('hex'));
    const emitter = new TypedEventEmitter<TxEvents>();
    this.jasmineSDK.signContractTransaction(
        tx,
        erc20Address,
        {from: sdkSender.web3Account},
    ).then((signedTx) => {
      this.feedTxEvents(emitter, signedTx.rawTransaction as string);
    });
    return emitter;
  }
}
