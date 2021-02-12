import { privateToPublic } from "ethereumjs-util";
import { Redis } from "ioredis";
import { AccountData } from "../Types";
import { RedisClientShared } from "./RedisShared";

const default_wallet_id = 'main-wallet'

class WalletController {

    client: Redis
    walletId: string
    private accounts: AccountData[]

    static shared = new WalletController(default_wallet_id, RedisClientShared)

    async loadWallet() {

        if (await this.client.type(`wallet:${this.walletId}`) !== 'set') {
            this.accounts = []
            return
        }

        const accountIds = await this.client.smembers(`wallet:${this.walletId}`)
        for (let accountId of accountIds) {
            await this.loadAccountById(accountId)
        }

    }

    /**
     * The following key is stored in redis (if applicable): 
     * accountName, accountType, accountBalance, coinType, accountPath, subAccounts, privKey, pubKey
     */
    async loadAccountById(id: string) {
        
        if (await this.client.type(`account:${id}`) !== 'hash') {
            return
        }

        const data = await this.client.hgetall(`account:${id}`)
        const account: AccountData = {
            accountId: id,
            accountName: data['accountName'],
            accountType: data['accountType'] as any,

            accountBalance: data['accountBalance'] ? BigInt(data['accountBalance']) : undefined,
            coinType: undefined, // to be assigned later
            accountPath: data['accountPath'],

            subAccounts: undefined,
            passPhrase: [], // to be assigned later
            privKey: data['privKey'],
            pubKey: data['pubKey']
        }

    }

    async addAccount(account: AccountData) {

    }

    async renameAccount(accountId: string, newName: string) {

    }

    async deleteAccount(accountId: string) {

    }

    async transfer(accountId: string, destination: string, amount: bigint) {

    }

    getAccounts() {
        return this.accounts as Readonly<AccountData[]>
    }

    constructor(walletId: string, redisClient: Redis) {
        this.client = redisClient
        this.walletId = walletId
        this.accounts = []
    }

}

export default WalletController