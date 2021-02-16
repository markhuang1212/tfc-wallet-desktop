import { CoinBTC, CoinETH, CoinTFC } from "../Const";
import { AccountData } from "../Types";
import { v4 as uuidv4 } from 'uuid'

const demo_data: AccountData[] = [
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
                coinType: CoinBTC,
                accountBalance: 5000n,
                accountId: uuidv4(),
                passPhrase: ['some', 'array'],
                privKey: 'privKey',
                pubKey: 'pubKey',
            },
            {
                accountName: 'ETH Account',
                accountType: 'bip44-coin-type',
                accountBalance: 5000n,
                coinType: CoinETH,
                accountId: uuidv4(),
                passPhrase: ['some', 'array'],
                privKey: 'privKey',
                pubKey: 'pubKey'
            }
        ]
    }
]

export default demo_data