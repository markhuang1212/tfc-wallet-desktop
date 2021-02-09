type AccountType = 'bip44' | 'non-bip44'

abstract class Account {

    accountName: string
    accountType: AccountType
    privKey: string
    pubKey: string

    constructor(type: AccountType, accountName: string, privKey: string, pubKey: string) {
        this.accountType = type
        this.privKey = privKey
        this.pubKey = pubKey
        this.accountName = accountName
    }

}

export default Account