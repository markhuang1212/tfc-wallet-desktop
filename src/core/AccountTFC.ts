import AccountAbstract from "./AccountAbstract";

class AccountTFC extends AccountAbstract {

    pubKey: any;

    privKey: any;

    async getAccountBalance() {
        return 0n
    }

    async getAccountTransactionHistory() {
        return []
    }

    async transfer(to: string, amount: number) {
        return false
    }

    constructor(privKey: any, pubKey: any) {
        super()
        this.privKey = privKey
        this.pubKey = pubKey
    }

}

export default AccountTFC