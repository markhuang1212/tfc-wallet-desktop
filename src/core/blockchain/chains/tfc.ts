import {Chain, TransactionID, TxEvents} from '../chain';
import {CoinCode} from '../../defines';
import {AccountImplMapping} from '../../wallet/coins/defines';
import {PromiEvent} from '@troubkit/tools';
import axios, {AxiosResponse} from 'axios';
import {EthAccount, TfcChainAccount} from '../../wallet';
import {EthereumChain} from './ethereum';
import {Endpoints} from '../defines';
import retryTimes = jest.retryTimes;

// eslint-disable-next-line require-jsdoc
export class TfcBip44Chain extends Chain<CoinCode.TFC_BIP44> {
  // eslint-disable-next-line require-jsdoc
  async getBalance(
      accountOrAddress: AccountImplMapping[CoinCode.TFC_BIP44] | string,
  ): Promise<BigInt> {
    return Promise.reject(new Error('unimplemented'));
  }

  // eslint-disable-next-line require-jsdoc
  transfer(
      recipient: string | AccountImplMapping[CoinCode.TFC_BIP44],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.TFC_BIP44],
  ): PromiEvent<TransactionID, TxEvents> {
    return PromiEvent.reject(
        new Error('unimplemented'),
    ) as unknown as PromiEvent<TransactionID, TxEvents>;
  }
}

// eslint-disable-next-line require-jsdoc
export class TfcChain extends Chain<CoinCode.TFC_CHAIN> {
  // eslint-disable-next-line require-jsdoc
  constructor(
    readonly endpoint: string,
  ) {
    super();
    // trim space and tailing slashes
    this.endpoint = endpoint.trim();
    while (this.endpoint.endsWith('/')) {
      this.endpoint = this.endpoint.slice(0, this.endpoint.length - 1);
    }
  }

  // eslint-disable-next-line require-jsdoc
  private static throwIfAPIError(resp: AxiosResponse): unknown {
    if (Math.floor(resp.status / 100) !== 2) {
      throw new Error('get balance API status is ' + resp.status);
    }
    const response = resp.data as {
      code: number,
      msg: string,
      data: unknown | null,
    };
    if (response.code !== 0) {
      throw new Error(`${response.msg}`);
    }
    return response;
  }

  // eslint-disable-next-line require-jsdoc
  async getBalance(
      accountOrAddress: AccountImplMapping[CoinCode.TFC_BIP44] | string,
  ): Promise<BigInt> {
    let address: string;
    if (typeof accountOrAddress === 'string') {
      address = accountOrAddress;
    } else {
      address = accountOrAddress.address;
    }
    const resp = await axios.get(`${this.endpoint}/balance/${address}`);
    const response = TfcChain.throwIfAPIError(resp) as {
      data: {
        activeTFC: string,
        pendingTFC: string
      }
    };
    return BigInt(response.data.activeTFC);
  }

  // eslint-disable-next-line require-jsdoc
  transfer(
      recipient: string | AccountImplMapping[CoinCode.TFC_BIP44],
      amount: BigInt,
      sender: AccountImplMapping[CoinCode.TFC_BIP44],
  ): PromiEvent<TransactionID, TxEvents> {
    return PromiEvent.reject(
        new Error('Transfer is not available on TFC-Chain'),
    ) as unknown as PromiEvent<TransactionID, TxEvents>;
  }

  /**
   * Exchange TFC to TFC-ERC20
   *
   * @param {string | TfcChainAccount} tfcAddressOrAccount the TFC account
   * @param {EthAccount} ethAccount the Ethereum account that receives TFC-ERC20
   * @param {BigInt} amount amount of TFC to exchange
   * @return {PromiEvent} a promievent
   */
  exchangeToErc20(
      tfcAddressOrAccount: string | TfcChainAccount,
      ethAccount: EthAccount,
      amount: BigInt,
  ): PromiEvent<void, {
    transactionFeePaying: [TransactionID];
    transactionFeePaid: [TransactionID];
    erc20Minting: [];
    erc20Minted: [];
  }> {
    let tfcAddress: string;
    if (typeof tfcAddressOrAccount === 'string') {
      tfcAddress = tfcAddressOrAccount;
    } else {
      tfcAddress = tfcAddressOrAccount.address;
    }
    return new PromiEvent(
        async (resolve, reject, emitter) => {
          try {
            const resp = await axios.post(`${this.endpoint}/v4/estimateTx`, {
              tfcAddr: tfcAddress,
              ercAddr: ethAccount.address,
              amount: amount.toString(10),
            });
            const result = TfcChain.throwIfAPIError(resp) as {
            bridgeAccount: string,
            requiredTransferAmount: string,
          };
            const ethChain = new EthereumChain(Endpoints[CoinCode.ETH].rinkeby);
            ethChain.confirmationRequirement = 6;
            // pay transaction fee for exchange
            ethChain.transfer(
                result.bridgeAccount,
                BigInt(result.requiredTransferAmount),
                ethAccount,
            ).on('pending', (txHash) => {
              emitter.emit('transactionFeePaying', txHash);
            }).on('executed', (txHash) => {
              emitter.emit('transactionFeePaid', txHash);
            }).on('finalized', async (txHash) => {
            // submit request to TFC-chain
              const resp = await axios.post(
                  `${this.endpoint}/v4/exchange/eth`,
                  {
                    tfcAddr: tfcAddress,
                    txHash: txHash,
                  },
              );
              TfcChain.throwIfAPIError(resp);
              emitter.emit('erc20Minting');

              // polling exchange status until success
              const checkSuccess = async (): Promise<boolean> => {
                const resp = await axios.get(
                    `${this.endpoint}/v4/pendingAmount/${tfcAddress}`,
                );
                const result = TfcChain.throwIfAPIError(resp) as {
                pendingAmount: string,
              };
                return BigInt(result.pendingAmount) === BigInt(0);
              };
              // periodically check mint status
              const interval = setInterval(async () => {
                if (await checkSuccess()) {
                  clearInterval(interval);
                  emitter.emit('erc20Minted');
                  resolve();
                }
              }, 1000);
            });
          } catch (e) {
            reject(e);
          }
        },
    );
  }

  // eslint-disable-next-line require-jsdoc
  async getExchangeRecords(
      tfcAddressOrAccount: string | TfcChainAccount,
  ): Promise<{
    txId: string,
    from: string,
    to: string,
    amount: BigInt,
    date: string,
  }[]> {
    let tfcAddress: string;
    if (typeof tfcAddressOrAccount === 'string') {
      tfcAddress = tfcAddressOrAccount;
    } else {
      tfcAddress = tfcAddressOrAccount.address;
    }
    const resp = await axios.get(`${this.endpoint}/statement/account`, {
      params: {
        address: tfcAddress,
        rewardType: 8,
      },
    });
    const result = TfcChain.throwIfAPIError(resp) as { data: {
      [dateString: string]: {
        txid: string,
        otherAddr: string,
        reward: string
      }[] | null
      }
    };
    const ret = [];
    for (const dateString of Object.keys(result.data)) {
      const temp = result.data[dateString];
      if (Array.isArray(temp)) {
        for (const record of temp) {
          ret.push({
            txId: record.txid,
            from: tfcAddress,
            to: record.otherAddr,
            amount: BigInt(record.reward),
            date: dateString,
          });
        }
      }
    }
    return ret;
  }
}
