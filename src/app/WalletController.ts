import { AccountData } from "../Types";
import { app } from 'electron'
import path from 'path'
import PersistentStorageController from "./PersistentStorageController";
import v8 from 'v8'
import { v4 as uuidv4 } from 'uuid'
import { Wallet, WalletJSON } from "../core/wallet";
import { CoinCode } from "../core/defines";

interface WalletInfo {
    passphrase?: string
    accountAliases: {
        [key: string]: string
    }
}

/**
 * This class is responsible for providing the interface for getting,
 * editing and saving the data of the Wallet App.
 */
class WalletController {

    wallet: Wallet
    info: WalletInfo

    data_temp: AccountData[] = []

    private walletPsc: PersistentStorageController<WalletJSON>
    private infoPsc: PersistentStorageController<WalletInfo>

    static shared = new WalletController()

    loadDemoData() {
        this.wallet = Wallet.fromSeed('0x123456789')
        this.walletPsc.object = this.wallet.toJSON()
        this.walletPsc.saveSync()
    }

    loadWallet(mnemonic: string[]): void;
    loadWallet(seed: string): void;
    loadWallet(arg: any) {
        if (typeof arg === 'string') {
            this.wallet.seed = Buffer.from(arg, 'hex')
        } else if (typeof arg === 'object') {
            arg = (arg as string[]).join(' ')
            this.wallet.mnemonic = arg
            this.info.passphrase = arg
        } else {
            throw Error('Invalid argument')
        }
        this.infoPsc.object = this.info
        this.infoPsc.save()
        this.walletPsc.object = this.wallet.toJSON()
        this.walletPsc.save()
    }

    loadStandaloneAccount(coinType: 'ETH' | 'BTC' | 'TFC', privKey: string) {
        if (coinType === 'BTC') {
            this.wallet.getCoinWallet(CoinCode.BTC).addStandaloneAccounts(privKey)
        } else if (coinType === 'ETH') {
            this.wallet.getCoinWallet(CoinCode.ETH).addStandaloneAccounts(privKey)
        } else if (coinType === 'TFC') {
            this.wallet.getCoinWallet(CoinCode.TFC_CHAIN).addStandaloneAccounts(privKey)
        }
        this.walletPsc.object = this.wallet.toJSON()
        this.walletPsc.save()
    }

    removeBip44Account() {
        this.wallet.seed = Buffer.from('12345678', 'hex')
    }

    removeStandaloneAccount(addr: string) {
        [this.wallet.coinWallets['0'],
        this.wallet.coinWallets['360'],
        this.wallet.coinWallets['599'],
        this.wallet.coinWallets['60'],
        this.wallet.coinWallets['995']].forEach(cw => {
            // cw.standaloneAccounts = cw.standaloneAccounts.filter(account => account.address !== addr)
        })
    }

    renameAccount(privKey: string, newName: string) {
        this.info.accountAliases[privKey] = newName
        this.infoPsc.object = this.info
        this.infoPsc.save()
        const account = this.data_temp.find(account => account.privKey === privKey)
        if (account) {
            account.accountName = newName
        }
        return this.data_temp
    }

    getAccounts() {
        const data: AccountData[] = []

        if (this.wallet.seed.toString('hex') !== '12345678') {
            data.push({
                accountType: 'bip44-master',
                accountId: uuidv4(),
                accountName: this.info.accountAliases[this.wallet.privateKey.toString('hex')] ?? 'Main Account',
                subAccounts: [
                    {
                        accountId: uuidv4(),
                        accountName: 'ETH/ERC20',
                        accountType: 'bip44-sub-account',
                        keys: (() => {
                            let keys: { privKey: string, pubKey: string, address: string }[] = []
                            for (let i = 0; i < 10; i++) {
                                keys.push({
                                    privKey: this.wallet.coinWallets['60'].getBip44Account(i).privateKey.toString('hex'),
                                    pubKey: this.wallet.coinWallets['60'].getBip44Account(i).publicKey,
                                    address: this.wallet.coinWallets['60'].getBip44Account(i).address
                                })
                            }
                            return keys
                        })(),
                        coinType: 'ETH',
                    }, {
                        accountId: uuidv4(),
                        accountName: 'TFC',
                        accountType: 'bip44-sub-account',
                        keys: (() => {
                            let keys: { privKey: string, pubKey: string, address: string }[] = []
                            for (let i = 0; i < 10; i++) {
                                keys.push({
                                    privKey: this.wallet.coinWallets['599'].getBip44Account(i).privateKey.toString('hex'),
                                    pubKey: this.wallet.coinWallets['599'].getBip44Account(i).publicKey,
                                    address: this.wallet.coinWallets['599'].getBip44Account(i).address
                                })
                            }
                            return keys
                        })(),
                        coinType: 'TFC'
                    }
                ],
                privKey: this.wallet.privateKey.toString('hex'),
                passPhrase: 'pass phrase'
            })
        }

        this.wallet.getCoinWallet(CoinCode.BTC).standaloneAccounts.forEach(account => {
            data.push({
                accountId: uuidv4(),
                accountName: this.info.accountAliases[account.privateKey.toString('hex')] ?? 'Account',
                accountType: 'plain',
                privKey: account.privateKey.toString('hex'),
                pubKey: account.publicKey,
                address: account.address,
                coinType: 'BTC'
            })
        })

        this.wallet.getCoinWallet(CoinCode.ETH).standaloneAccounts.forEach(account => {
            data.push({
                accountId: uuidv4(),
                accountName: this.info.accountAliases[account.privateKey.toString('hex')] ?? 'Account',
                accountType: 'plain',
                privKey: account.privateKey.toString('hex'),
                address: account.address,
                pubKey: account.publicKey,
                coinType: 'ETH'
            })
        })

        this.wallet.getCoinWallet(CoinCode.TFC_CHAIN).standaloneAccounts.forEach(account => {
            data.push({
                accountId: uuidv4(),
                accountName: this.info.accountAliases[account.privateKey.toString('hex')] ?? 'Account',
                accountType: 'plain',
                address: account.address,
                privKey: account.privateKey.toString('hex'),
                pubKey: account.publicKey,
                coinType: 'TFC'
            })
        })

        this.data_temp = data
        return data
    }

    constructor() {

        this.walletPsc = new PersistentStorageController(path.join(app.getPath('userData'), 'wallet.json'))
        this.walletPsc.loadSync()
        if (this.walletPsc.object) {
            this.wallet = Wallet.fromJSON(this.walletPsc.getObjectCopy()!)!
        } else {
            this.wallet = Wallet.fromSeed('0x12345678')
        }

        this.infoPsc = new PersistentStorageController(path.join(app.getPath('userData'), 'info.json'))
        this.infoPsc.loadSync()
        if (this.infoPsc.object) {
            this.info = this.infoPsc.getObjectCopy()!
        } else {
            this.info = {
                passphrase: undefined,
                accountAliases: {

                }
            }
            this.infoPsc.object = this.info
            this.infoPsc.save()
        }

    }

}

export default WalletController