import AccountTransaction from "./AccountTransaction"

abstract class AccountAbstract {

    abstract pubKey: any
    abstract privKey: any

    abstract getAccountBalance(): Promise<bigint>

    abstract getAccountTransactionHistory(): Promise<AccountTransaction[]>

    abstract transfer(to: string, amount: number): Promise<boolean>

}

export default AccountAbstract