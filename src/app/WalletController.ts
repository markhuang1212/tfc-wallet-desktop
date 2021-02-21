import { AccountData } from "../Types";
import { app } from 'electron'
import path from 'path'
import PersistentStorageController from "./PersistentStorageController";
import v8 from 'v8'
import { v4 as uuidv4 } from 'uuid'
import { Wallet, WalletJSON } from "../core/wallet";
import { CoinBTC, CoinETH, CoinTFC } from "../Const";
import { CoinCode } from "../core/defines";

interface WalletInfo {
    passphrase?: string[]
    accountIndexes: {
        [key in 'ETH' | 'BTC' | 'TFC']: number
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

    async transfer(accountId: string, destination: string, amount: bigint) {

    }

    loadDemoData() {
        this.wallet = Wallet.fromSeed('0x123456789')
        this.walletPsc.object = this.wallet.toJSON()
        this.walletPsc.saveSync()
    }

    loadWallet(mnemonic: string[]): void;
    loadWallet(seed: string): void;
    loadWallet(arg: any) {
        if (typeof arg === 'string') {
            this.wallet = Wallet.fromSeed(arg)
        } else if (typeof arg === 'object') {
            arg = (arg as string[]).join(' ')
            this.wallet = Wallet.fromMnemonic(arg)
        } else {
            throw Error('Invalid argument')
        }
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

    getAccounts() {
        const data: AccountData[] = []

        if (this.wallet.seed.toString('hex') !== '12345678') {
            data.push({
                accountType: 'bip44-master',
                accountId: uuidv4(),
                accountName: 'Main Account',
                subAccounts: [
                    {
                        accountId: uuidv4(),
                        accountName: 'ETH/ERC20',
                        accountType: 'bip44-sub-account',
                        keys: (() => {
                            let keys: { privKey: string, pubKey: string }[] = []
                            for (let i = 0; i < 10; i++) {
                                keys.push({
                                    privKey: this.wallet.coinWallets['60'].getBip44Account(i).privateKey.toString('hex'),
                                    pubKey: this.wallet.coinWallets['60'].getBip44Account(i).publicKey
                                })
                            }
                            return keys
                        })(),
                        coinType: CoinETH,
                    }, {
                        accountId: uuidv4(),
                        accountName: 'TFC',
                        accountType: 'bip44-sub-account',
                        keys: (() => {
                            let keys: { privKey: string, pubKey: string }[] = []
                            for (let i = 0; i < 10; i++) {
                                keys.push({
                                    privKey: this.wallet.coinWallets['599'].getBip44Account(i).privateKey.toString('hex'),
                                    pubKey: this.wallet.coinWallets['599'].getBip44Account(i).publicKey
                                })
                            }
                            return keys
                        })(),
                        coinType: CoinTFC
                    }
                ],
                privKey: this.wallet.privateKey.toString('hex'),
                passPhrase: ['pass phrase']
            })
        }

        this.wallet.getCoinWallet(CoinCode.BTC).standaloneAccounts.forEach(account => {
            data.push({
                accountId: uuidv4(),
                accountName: 'Account',
                accountType: 'plain',
                // accountBalance: '0',
                privKey: account.privateKey.toString('hex'),
                pubKey: account.publicKey,
                passPhrase: ['pass', 'phrase'],
                coinType: CoinBTC
            })
        })

        this.wallet.getCoinWallet(CoinCode.ETH).standaloneAccounts.forEach(account => {
            data.push({
                accountId: uuidv4(),
                accountName: 'Account',
                accountType: 'plain',
                // accountBalance: '0',
                privKey: account.privateKey.toString('hex'),
                pubKey: account.publicKey,
                passPhrase: ['pass', 'phrase'],
                coinType: CoinETH
            })
        })

        this.wallet.getCoinWallet(CoinCode.TFC_CHAIN).standaloneAccounts.forEach(account => {
            data.push({
                accountId: uuidv4(),
                accountName: 'Account',
                accountType: 'plain',
                // accountBalance: '0',
                privKey: account.privateKey.toString('hex'),
                pubKey: account.publicKey,
                passPhrase: ['pass', 'phrase'],
                coinType: CoinBTC
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
                passphrase: [],
                accountIndexes: {
                    'BTC': 0,
                    'ETH': 0,
                    'TFC': 0
                }
            }
        }

    }

}

export default WalletController