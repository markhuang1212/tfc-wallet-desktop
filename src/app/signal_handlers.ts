/**
 * The front-end (UI) communicate with the backend through
 * a set of signal handlers listed in this file.
 */

import { ipcMain } from 'electron'
import { TxInfo } from '../Types'
import WalletController from './WalletController'

ipcMain.handle('get-accounts', async () => {
    WalletController.shared.loadDemoData()
    return WalletController.shared.getAccounts()
})

ipcMain.handle('rename-account', async (_, accountId: string, newName: string) => {
    WalletController.shared.renameAccount(accountId, newName)
})

ipcMain.handle('rename-bip44-sub-account', async (_, accountId: string, subAccountId: string, newName: string) => {

})

ipcMain.handle('create-plain-account', async (event, privKey: string | string[]) => {

})

ipcMain.handle('create-bip44-account', async (event, privKey: string | string[]) => {

})

ipcMain.handle('create-bip44-sub-account', async (event, masterId: string, path: string) => {

})

ipcMain.handle('remove-account', async (event, accountId: string) => {

})

ipcMain.handle('transfer-coin', async (async, txInfo: TxInfo) => {

})