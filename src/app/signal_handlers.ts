/**
 * The front-end (UI) communicate with the backend through
 * a set of signal handlers listed in this file.
 */

import { ipcMain } from 'electron'
import { AccountData, TxInfo } from './Types'
import { v4 as uuidv4 } from 'uuid'

const demoData: AccountData[] = [
    {
        accountName: 'TFC Account',
        accountType: 'tfc',
        accountBalance: 1000n,
        accountId: uuidv4(),
        passPhrase: ['some', 'array'],
        privKey: 'privKey',
        pubKey: 'pubKey'
    }, {
        accountType: 'bip44',
        accountName: 'BIP-44 Account',
        accountId: uuidv4(),
        passPhrase: ['some', 'array'],
        privKey: 'privKey',
        pubKey: 'pubKey',
        subAccounts: [
            {
                accountName: 'BTC Account',
                accountType: 'btc',
                accountBalance: 5000n,
                accountId: uuidv4(),
                passPhrase: ['some', 'array'],
                privKey: 'privKey',
                pubKey: 'pubKey'
            },
            {
                accountName: 'ETH Account',
                accountType: 'eth',
                accountBalance: 5000n,
                accountId: uuidv4(),
                passPhrase: ['some', 'array'],
                privKey: 'privKey',
                pubKey: 'pubKey'
            }
        ]
    }
]

ipcMain.handle('get-accounts', async () => {
    return demoData
})

ipcMain.handle('add-account', async (event, accountData: AccountData) => {

})

ipcMain.handle('remove-account', async (event, accountId: string) => {

})

ipcMain.handle('transfer-coin', async (async, txInfo: TxInfo) => {

})