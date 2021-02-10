import * as ethUtil from 'ethereumjs-util';
import {Account} from '../account';


// eslint-disable-next-line require-jsdoc
export class EthAccount extends Account {
  // eslint-disable-next-line require-jsdoc
  get publicKey(): string {
    return ethUtil.privateToPublic(this.privateKey).toString('hex');
  }

  // eslint-disable-next-line require-jsdoc
  get address(): string {
    const addr = '0x' + ethUtil.publicToAddress(
        Buffer.from(this.publicKey, 'hex'),
    ).toString('hex');
    return ethUtil.toChecksumAddress(addr);
  }
}
