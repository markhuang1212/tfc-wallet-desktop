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

interface AccountDataStorage {
    accountName: string,
    accountType: 'bip44-master' | 'bip44-coin-type' | 'plain',

    accountBalance?: string
    coin: 'eth' | 'btc' | 'tfc' | 'usdt' // for non bip-44 account

    accountPath?: string // for bip44 sub-accounts
    subAccounts?: string

    privKey: string
    pubKey: string
}

interface AccountData {
    accountId: string, // the unique id for all accounts
    accountName: string,

    accountType: 'bip44-master' | 'bip44-coin-type' | 'plain',

    accountBalance?: bigint
    coinType?: Coin // for non bip-44 account

    accountPath?: string // for bip44 sub-accounts
    subAccounts?: AccountData[] // for bip44 accounts

    passPhrase: string[]
    privKey: string
    pubKey: string
}

export { AccountData, TxInfo, Coin }