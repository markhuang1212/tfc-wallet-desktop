import Coin from "../core/Coin";

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

export default AccountData