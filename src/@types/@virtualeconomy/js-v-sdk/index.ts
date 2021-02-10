declare module '@virtualeconomy/js-v-sdk' {
  export module constants {
    export const MAINNET_BYTE: number;
    export const TESTNET_BYTE: number;
  }

  // eslint-disable-next-line require-jsdoc
  export class Account {
    // eslint-disable-next-line camelcase
    network_byte: number;
    constructor(networkType: number);
    buildFromPrivateKey(privateKey: string): void;
    getAddress(): string;
    getPrivateKey(): string;
    getPublicKey(): string;
  }
}
