import AccountTransaction from "./AccountTransaction"

/**
 * The Base class for all kinds of accounts, e.g. AccountTFC, AccountERC, etc.
 * Provides interfaces for the basic functionality of crypto-currency account.
 */
abstract class AccountAbstract {

    abstract pubKey: any
    abstract privKey: any

    abstract getAccountBalance(): Promise<bigint>

    abstract getAccountTransactionHistory(): Promise<AccountTransaction[]>

    abstract transfer(to: string, amount: number): Promise<boolean>

}

export default AccountAbstract