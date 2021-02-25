/**
 * Created by hm. Used in /app and /ui
 */

export interface TxRequestInfo {
    sender_privKey: string,
    receiver_address: string,
    coinType: 'ETH' | 'BTC' | 'TFC',
    ercCoin?: 'ETH' | 'TFC' | 'USDT'
    amount: bigint
}

export interface SwapRequestInfo {
    from_privKey: string,
    to_privKey: string,
    from_endpoint: string
}

export type Coin = 'ETH' | 'BTC' | 'TFC'
export type Erc20Coin = 'ETH' | 'USDT' | 'TFC'
export type TfcChainEndpoint = 'openbi' | 'blockchainfs'

export interface AccountDataPlain {
    accountId: string
    accountName: string

    accountType: 'plain'
    coinType: Coin

    privKey: string
    pubKey: string
    address: string
}

export interface AccountDataBip44SubAccount {
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

export interface AccountDataBip44Master {
    accountId: string
    accountName: string
    accountType: 'bip44-master'
    subAccounts: AccountDataBip44SubAccount[]
    privKey: string
    passPhrase?: string
}

export type AccountData = AccountDataBip44Master | AccountDataPlain
