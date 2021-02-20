/**
 * Created by hm. Used in /app and /ui
 */

interface TxInfo {
    from: string
    to: string
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
        derivationPath: string
        accountName: string
        // accountBalance?: string
        coinType: Coin
        // txs?: TxInfo[]
        privKey: string
        pubKey: string
    }[] // for bip44 accounts

    passPhrase: string[]
    privKey: string
    pubKey: string
}

export { AccountData, TxInfo, Coin }