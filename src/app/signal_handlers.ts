/**
 * The front-end (UI) communicate with the backend through
 * a set of signal handlers listed in this file.
 */

import { ipcMain } from 'electron'
import { TxRequestInfo } from '../Types'
import AccountFunctionsProvider from './AccountFunctionsProvider'
import WalletController from './WalletController'

ipcMain.handle('load-demo-data', async () => {
    WalletController.shared.loadDemoData()
})

ipcMain.handle('get-accounts', async () => {
    return WalletController.shared.getAccounts()
})

ipcMain.handle('get-transactions', async (_, pubKey: string, coinType: 'ETH' | 'BTC' | 'TFC', ercCoin?: 'ETH' | 'TFC') => {
    const txs = await AccountFunctionsProvider.shared.getTransactions(pubKey, coinType, ercCoin)
    return txs
})

ipcMain.handle('get-balance', async (_, privKey: string, coinType: 'ETH' | 'BTC' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') => {
    const balance = await AccountFunctionsProvider.shared.getBalance(privKey, coinType, ercCoin)
    return balance
})

ipcMain.handle('create-plain-account', async (event, coinType: 'BTC' | 'ETH' | 'TFC', privKey: string) => {
    WalletController.shared.loadStandaloneAccount(coinType, privKey)
})

ipcMain.handle('create-bip44-account', async (event, privKey: string | string[]) => {
    if (typeof privKey === 'string') {
        WalletController.shared.loadWallet(privKey)
    } else if (typeof privKey === 'object') {
        WalletController.shared.loadWallet(privKey)
    }
})

ipcMain.handle('remove-plain-account', async (event, accountId: string) => {

})

ipcMain.handle('transfer-coin', async (event, txInfo: TxRequestInfo) => {
    const txHash = await AccountFunctionsProvider.shared.transfer(txInfo)
    return txHash
})