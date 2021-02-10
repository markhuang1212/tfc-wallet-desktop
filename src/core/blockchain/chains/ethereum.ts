import {Chain, TransactionID} from '../chain';
import {CoinCode} from '../../defines';
import SDK from 'jasmine-eth-ts';
import BN from 'bn.js';
import {AccountImplMapping} from '../../wallet/coins/defines';

// eslint-disable-next-line require-jsdoc
export class EthereumChain extends Chain<CoinCode.ETH> {
  readonly jasmineSDK: SDK;

  // eslint-disable-next-line require-jsdoc
  constructor(endpoint: string) {
    super();
    this.jasmineSDK = new SDK(endpoint);
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
    const bal = await this.jasmineSDK.balanceOf(addr);
    return BigInt('0x' + bal.toString('hex'));
  }

  // eslint-disable-next-line require-jsdoc
  async transfer(
      recipient: string | AccountImplMapping[CoinCode.ETH],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.ETH],
  ): Promise<TransactionID> {
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
    const signedTx = await this.jasmineSDK.signSimpleTransaction(
        tx,
        addr,
        {from: sdkSender.web3Account},
    );
    return new Promise<TransactionID>((resolve, reject) => {
      this.jasmineSDK.web3.eth
          .sendSignedTransaction(signedTx.rawTransaction as string)
          .on('transactionHash', (hash)=>{
            resolve(hash);
          })
          .on('error', (e) => {
            reject(e);
          });
    });
  }
}
