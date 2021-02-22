/**
 * Created by hm. Used in /app and /ui
 */

interface TxRequestInfo {
    sender_privKey: string,
    receiver_address: string,
    coinType: 'ETH' | 'BTC' | 'TFC',
    ercCoin?: 'ETH' | 'TFC' | 'USDT'
    amount: bigint
}

interface Coin {
    fullName: string
    abbrName: string
    identifier: number
}

interface AccountData {
    accountId: string, // the unique id for all accounts
    accountName: string,

    accountType: 'bip44-master' | 'plain',

    // accountBalance?: string // balance is cached
    // txs?: TxInfo[] // txs is cached
    coinType?: Coin // for plain account. Possible options: CoinBTC, CoinTFC, CoinETH, CoinUSDT

    subAccounts?: {
        accountType: 'bip44-sub-account'
        accountId: string,
        accountName: string
        coinType: Coin
        keys: {
            privKey: string
            pubKey: string
            address?: string
        }[]
    }[] // for bip44 accounts

    passPhrase: string[]
    privKey: string
    pubKey?: string
    address?: string
}

export { AccountData, TxRequestInfo, Coin }