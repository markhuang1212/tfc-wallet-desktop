/**
 * The front-end (UI) communicate with the backend through
 * a set of signal handlers listed in this file.
 */

import { ipcMain } from 'electron'
import { TxRequestInfo } from '../Types'
import AccountFunctionsProvider from './AccountFunctionsProvider'
import WalletController from './WalletController'

ipcMain.handle('load-demo-data', async () => {
    console.log('Receive signal: load-demo-data')
    WalletController.shared.loadDemoData()
})

ipcMain.handle('get-accounts', async () => {
    console.log('Receive signal: get-accounts')
    return WalletController.shared.getAccounts()
})

ipcMain.handle('get-transactions', async (_, pubKey: string, coinType: 'ETH' | 'BTC' | 'TFC', ercCoin?: 'ETH' | 'TFC') => {
    console.log(`Receive signal: get-transactions, pubKey: ${pubKey}, coinType: ${coinType}, ercCoin: ${ercCoin}`)
    const txs = await AccountFunctionsProvider.shared.getTransactions(pubKey, coinType, ercCoin)
    return txs
})

ipcMain.handle('rename-account', (_, privKey: string, newName: string) => {
    console.log(`Receive signal: rename-account, privKey: ${privKey}, newName: ${newName}`)
    return WalletController.shared.renameAccount(privKey, newName)
})

ipcMain.handle('get-balance', async (_, privKey: string, coinType: 'ETH' | 'BTC' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') => {
    console.log(`Receive signal: get-balance, privKey: ${privKey}, coinType: ${coinType}, ercCoin: ${ercCoin}`)
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

ipcMain.handle('remove-plain-account', async (event, account_addr: string) => {

})

ipcMain.handle('swap-tfc', async (_, from_privKey: string, to_privKey: string, amount: bigint) => {
    console.log(`Receive signal: swap TFC, from: ${from_privKey}, to_privKey: ${to_privKey}, amount: ${amount} `)
    const txHash = await AccountFunctionsProvider.shared.swapTfc(from_privKey, to_privKey, amount)
    return txHash
})

ipcMain.handle('transfer-coin', async (event, txInfo: TxRequestInfo) => {
    console.log(`Receive signal: transfer coin, from: ${txInfo.sender_privKey}, to: ${txInfo.receiver_address}, amount: ${txInfo.amount}, coinType: ${txInfo.coinType}, ercCoin: ${txInfo.ercCoin}`)
    const txHash = await AccountFunctionsProvider.shared.transfer(txInfo)
    return txHash
})