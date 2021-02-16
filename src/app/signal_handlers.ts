/**
 * The front-end (UI) communicate with the backend through
 * a set of signal handlers listed in this file.
 */

import { ipcMain } from 'electron'
import { AccountData, TxInfo } from '../Types'
import './RedisShared.ts'
import demo_data from './demo_data'

function getAccounts(): AccountData[] {
    return []
}

ipcMain.handle('get-accounts', async () => {
    return demo_data
})

ipcMain.handle('rename-account', async (event, accountId: string, newName: string) => {
    return true
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