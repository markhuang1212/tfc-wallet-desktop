/**
 * The front-end (UI) communicate with the backend through
 * a set of signal handlers listed in this file.
 */

import { ipcMain } from 'electron'
import { AccountData, TxInfo } from '../Types'
import { v4 as uuidv4 } from 'uuid'
import './RedisShared.ts'
import { CoinTFC } from '../Const'

const demoData: AccountData[] = [
    {
        accountName: 'TFC Account',
        accountType: 'plain',
        coinType: CoinTFC,
        accountBalance: 1000n,
        accountId: uuidv4(),
        passPhrase: ['some', 'array'],
        privKey: 'privKey',
        pubKey: 'pubKey'
    }, {
        accountType: 'bip44-master',
        accountName: 'BIP-44 Account',
        accountId: uuidv4(),
        passPhrase: ['some', 'array'],
        privKey: 'privKey',
        pubKey: 'pubKey',
        subAccounts: [
            {
                accountName: 'BTC Account',
                accountType: 'bip44-coin-type',
                accountBalance: 5000n,
                accountId: uuidv4(),
                passPhrase: ['some', 'array'],
                privKey: 'privKey',
                pubKey: 'pubKey'
            },
            {
                accountName: 'ETH Account',
                accountType: 'bip44-coin-type',
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

ipcMain.handle('rename-account', async (event, accountId: string, newName: string) => {
    return true
})

ipcMain.handle('add-account', async (event, accountData: AccountData) => {

})

ipcMain.handle('remove-account', async (event, accountId: string) => {

})

ipcMain.handle('transfer-coin', async (async, txInfo: TxInfo) => {

})