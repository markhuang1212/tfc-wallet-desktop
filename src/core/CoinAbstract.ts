import Transaction from "./Transaction";

abstract class CoinAbstract {

    abstract coin_precision: number

    abstract getAccountBalance(account: Account): Promise<number>

    abstract getAccountTransactionHistory(account: Account): Promise<Transaction[]>

    abstract transfer(from: Account, to: Account, amount: number): Promise<Boolean>

}

export default CoinAbstract