import { ipcMain } from 'electron'
import Coin from '../core/Coin'

interface TxInfo {
    from: string,
    to: string,
    amount: bigint
}

interface AccountData {
    accountId: string,
    accountType: 'bip44' | 'tfc' | 'eth' | 'btc' | 'erc20',
    accountName: string,
    accountBalance?: bigint

    coin?: Coin // for non bip-44 account
    subAccounts?: AccountData[] // for bip-44 account

    passPhrase: string[]
    privKey: string
    pubKey: string
}

ipcMain.handle('get-accounts', async () => {

})

ipcMain.handle('add-account', async (event, accountData: AccountData) => {

})

ipcMain.handle('remove-account', async (event, accountId: string) => {

})

ipcMain.handle('transfer-coin', async (async, txInfo: TxInfo) => {

})