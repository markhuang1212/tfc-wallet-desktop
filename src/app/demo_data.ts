import { CoinBTC, CoinETH, CoinTFC } from "../Const";
import { AccountData } from "../Types";
import { v4 as uuidv4 } from 'uuid'

const demo_data: AccountData[] = [
    {
        accountName: 'TFC Account',
        accountType: 'plain',
        coinType: CoinTFC,
        // accountBalance: '1000',
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
                accountType: 'bip44-sub-account',
                coinType: CoinBTC,
                // accountBalance: '5000',
                accountId: uuidv4(),
                privKey: 'privKey',
                pubKey: 'pubKey',
                derivationPath: '0/0/0/0/0'
            },
            {
                derivationPath: '0/0/0/0/0',
                accountName: 'ETH Account',
                accountType: 'bip44-sub-account',
                // accountBalance: '5000',
                coinType: CoinETH,
                accountId: uuidv4(),
                privKey: 'privKey',
                pubKey: 'pubKey'
            }
        ]
    }
]

export default demo_data