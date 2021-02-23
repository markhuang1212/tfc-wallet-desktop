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

// interface Coin {
//     fullName: string
//     abbrName: string
//     identifier: number
// }

type Coin = 'ETH' | 'BTC' | 'TFC'
type Erc20Coin = 'ETH' | 'USDT' | 'TFC'

interface AccountDataPlain {
    accountId: string
    accountName: string

    accountType: 'plain'
    coinType: Coin

    privKey: string
    pubKey: string
    address: string
}

interface AccountDataBip44SubAccount {
    accountType: 'bip44-sub-account'
    accountId: string
    accountName: string
    coinType: Coin
    keys: {
        privKey: string
        pubKey: string
        address: string
    }[]
}

interface AccountDataBip44Master {
    accountId: string
    accountName: string
    accountType: 'bip44-master'
    subAccounts: AccountDataBip44SubAccount[]
    privKey: string
    passPhrase?: string
}

type AccountData = AccountDataBip44Master | AccountDataPlain

export { AccountData, TxRequestInfo, Coin, Erc20Coin, AccountDataBip44Master, AccountDataBip44SubAccount, AccountDataPlain }