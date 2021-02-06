import AccountAbstract from './AccountAbstract';

// eslint-disable-next-line require-jsdoc
class AccountTFC extends AccountAbstract {
  pubKey: any;

  privKey: any;

  // eslint-disable-next-line require-jsdoc
  async getAccountBalance() {
    return 0n;
  }

  // eslint-disable-next-line require-jsdoc
  async getAccountTransactionHistory() {
    return [];
  }

  // eslint-disable-next-line require-jsdoc
  async transfer(to: string, amount: number) {
    return false;
  }

  // eslint-disable-next-line require-jsdoc
  constructor(privKey: any, pubKey: any) {
    super();
    this.privKey = privKey;
    this.pubKey = pubKey;
  }
}

export default AccountTFC;
