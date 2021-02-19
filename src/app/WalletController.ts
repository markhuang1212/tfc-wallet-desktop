import { AccountData } from "../Types";
import demo_data from './demo_data'
import PersistentStorageController from "./PersistentStorageController";
import v8 from 'v8'

const default_wallet_id = 'main-wallet'

/**
 * This class is responsible for providing the interface for getting,
 * editing and saving the data of the Wallet App.
 */
class WalletController {


    walletId: string
    private psc: PersistentStorageController<AccountData[]>

    static shared = new WalletController(default_wallet_id, PersistentStorageController.shared as any)

    loadWalletSync() {
        this.psc.loadSync()
    }

    getAccountById(id: string) {
        const account = this.psc.getObjectCopy().find(account => account.accountId === id)
        return v8.deserialize(v8.serialize(account)) as AccountData | undefined
    }

    addAccountToWallet(account: AccountData) {
        if (this.psc.object)
            this.psc.object.push(v8.deserialize(v8.serialize(account)))
        else
            this.psc.object = [v8.deserialize(v8.serialize(account))]
        this.psc.saveSync()
    }

    renameAccount(accountId: string, newName: string) {
        if (this.psc.object) {
            const account = this.psc.object.find(account => account.accountId === accountId)
            if (account)
                account.accountName = newName
        }
    }

    renameSubAccount(accountId: string, subAccountId: string, newName: string) {

    }

    loadDemoData() {
        this.psc.object = v8.deserialize(v8.serialize(demo_data))
        this.psc.saveSync()
    }

    deleteAccount(accountId: string) {
        if (this.psc.object) {
            this.psc.object = this.psc.object.filter(account => account.accountId !== accountId)
            this.psc.saveSync()
        }
    }

    deleteSubAccount(accountId: string, subAccountId: string) {

    }

    async transfer(accountId: string, destination: string, amount: bigint) {

    }

    getPassphraseFromPrivKey(privKey: string) {
        return ['sample', 'pass', 'phrase']
    }

    getAccounts() {
        return this.psc.getObjectCopy()
    }

    createPlainAccount() {

    }

    createBipAccount() {

    }

    createSubAccount() {

    }

    constructor(walletId: string, psc: PersistentStorageController<AccountData[]>) {
        this.walletId = walletId
        this.psc = psc
    }

}

export default WalletController