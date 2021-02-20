import {Chain, TransactionID, TxEvents} from '../chain';
import {CoinCode} from '../../defines';
import {AccountImplMapping} from '../../wallet/coins/defines';
import {PromiEvent} from '@troubkit/tools';
import axios, {AxiosResponse} from 'axios';

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
    return response.data;
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
      activeTFC: string,
      pendingTFC: string
    };
    return BigInt(response.activeTFC);
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
}
