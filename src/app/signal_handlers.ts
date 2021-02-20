/**
 * The front-end (UI) communicate with the backend through
 * a set of signal handlers listed in this file.
 */

import { ipcMain } from 'electron'
import { TxInfo } from '../Types'
import WalletController from './WalletController'

ipcMain.handle('get-accounts', async () => {
    // WalletController.shared.loadDemoData()
    return WalletController.shared.getAccounts()
})

ipcMain.handle('get-balance', async (_, accountId: string, ercCoin?: 'ETH' | 'TFC' | 'USDT') => {

})

ipcMain.handle('create-plain-account', async (event, coinType: 'BTC' | 'ETH' | 'TFC', privKey: string) => {
    WalletController.shared.loadStandaloneAccount(coinType, privKey)
})

ipcMain.handle('create-bip44-account', async (event, privKey: string | string[]) => {
    if (typeof privKey === 'string') {

    } else if (typeof privKey === 'object') {

    }
})

ipcMain.handle('remove-plain-account', async (event, accountId: string) => {

})

ipcMain.handle('transfer-coin', async (event, accountId: string, txInfo: TxInfo) => {

})