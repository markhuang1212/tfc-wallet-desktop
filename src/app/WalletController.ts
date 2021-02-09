import { Redis } from "ioredis";
import { RedisClientShared } from "./RedisShared";
import Wallet from "./Wallet";

const default_wallet_id = 'main-wallet-1'

class WalletController {

    client: Redis
    walletId: string
    private wallet?: Wallet

    static shared = new WalletController(default_wallet_id, RedisClientShared)

    async loadWallet() {

        if (await this.client.type(`wallet:${this.walletId}`) !== 'hash') {
            this.wallet = {
                walletId: this.walletId,
                accounts: []
            }
        }

    }

    async addAccount(account: Account) {

    }

    async renameAccount(accountId: string, newName: string) {

    }

    async deleteAccount(accountId: string) {

    }

    async transfer(accountId: string, destination: string, amount: bigint) {

    }

    getWallet() {
        return this.wallet as Readonly<Wallet>
    }

    constructor(walletId: string, redisClient: Redis) {
        this.client = redisClient
        this.walletId = walletId
    }

}

export default WalletController