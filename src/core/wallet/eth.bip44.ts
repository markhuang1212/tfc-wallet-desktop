import KeyPair, {hdkey} from 'ethereumjs-wallet';
import {Address, Change} from './bip44';

export class EthAddress extends Address {
  private keyPair: KeyPair;

  constructor(seed: Buffer, change: Change, index: number) {
    super(seed, change, index);
    const hdWallet = hdkey.fromMasterSeed(this.seed);
    this.keyPair = hdWallet.derivePath(this.path).getWallet();
  }

  get privateKey(): Buffer {
    return this.keyPair.getPrivateKey();
  }

  get publicKey(): Buffer {
    return this.keyPair.getPublicKey();
  }

  toString(): string {
    return this.keyPair.getChecksumAddressString();
  }
}
