interface Coin {
    index: number,
    index_hex: string,
    symbol: string
    name: string,
}

interface AccountData {
    accountId: string,
    accountType: 'bip44' | 'tfc' | 'eth' | 'btc' | 'erc20',
    accountName: string,
    accountBalance?: bigint

    accountPath?: string // for bip-44 sub-accounts
    coin?: Coin // for non bip-44 account
    subAccounts?: AccountData[] // for bip-44 account

    passPhrase: string[]
    privKey: string
    pubKey: string

    transactions?: TxInfo[]
}

interface TxInfo {
    from: string,
    to: string,
    amount: bigint
}

interface AppData {
    accounts: AccountData[]
}

export { Coin, AccountData, AppData, TxInfo }