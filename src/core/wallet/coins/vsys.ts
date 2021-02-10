import {Account} from '../account';
import vsys from '@virtualeconomy/js-v-sdk';

const base58 = require('base-58');

// eslint-disable-next-line require-jsdoc
export class VsysAccount extends Account {
  private readonly vsysAcc: vsys.Account

  // eslint-disable-next-line require-jsdoc
  constructor(privateKey: Buffer) {
    super(privateKey);
    this.vsysAcc = new vsys.Account(vsys.constants.MAINNET_BYTE);
    const key = base58.encode(privateKey);
    this.vsysAcc.buildFromPrivateKey(key);
  }

  // eslint-disable-next-line require-jsdoc
  get networkType(): number {
    return this.vsysAcc.network_byte;
  }

  // eslint-disable-next-line require-jsdoc
  set networkType(value: number) {
    if (value !== this.networkType) {
      this.vsysAcc.network_byte = value;
      const key = base58.encode(this.privateKey);
      this.vsysAcc.buildFromPrivateKey(key);
    }
  }

  // eslint-disable-next-line require-jsdoc
  get address(): string {
    return this.vsysAcc.getAddress();
  }

  // eslint-disable-next-line require-jsdoc
  get publicKey(): string {
    return this.vsysAcc.getAddress();
  }
};
