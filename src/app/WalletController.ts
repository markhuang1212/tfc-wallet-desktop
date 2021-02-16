import { privateToPublic } from "ethereumjs-util";
import { Redis } from "ioredis";
import { AccountData } from "../Types";
import demo_data from './demo_data'
import { CoinBTC, CoinETH, CoinTFC } from "../Const";
import { v4 as uuidv4 } from 'uuid'

const default_wallet_id = 'main-wallet'

/**
 * This class is responsible for providing the interface for getting,
 * editing and saving the data of the Wallet App.
 */
class WalletController {

    walletId: string
    private accounts: AccountData[]

    static shared = new WalletController(default_wallet_id)

    async loadWallet() {

    }

    /**
     * The following key is stored in redis (if applicable): 
     * accountName, accountType, accountBalance, coinType, accountPath, subAccounts, privKey, pubKey
     */
    async loadAccountById(id: string) {

    }

    async addAccountToWallet(account: AccountData) {

    }

    async renameAccount(accountId: string, newName: string) {

    }

    async loadDemoData() {
        
    }

    async deleteAccount(accountId: string) {
        
    }

    async transfer(accountId: string, destination: string, amount: bigint) {

    }

    getPassphraseFromPrivKey(privKey: string) {
        return ['sample', 'pass', 'phrase']
    }

    getAccounts() {
        return this.accounts as Readonly<AccountData[]>
    }

    constructor(walletId: string) {
        this.walletId = walletId
        this.accounts = []
    }

}

export default WalletController