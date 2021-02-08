import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import AccountData from './AccountData';
import AccountDetailView from './AccountDetailView';
import AccountListView from './AccountListView';
import ImportAccountView from './ImportAccountVIew';
import { v4 as uuidv4 } from 'uuid'
import { ipcRenderer } from 'electron';

// const demoData: AccountData[] = [
//   {
//     accountName: 'TFC Account',
//     accountType: 'tfc',
//     accountBalance: 1000n,
//     accountId: uuidv4(),
//     passPhrase: ['some', 'array'],
//     privKey: 'privKey',
//     pubKey: 'pubKey'
//   }, {
//     accountType: 'bip44',
//     accountName: 'BIP-44 Account',
//     accountId: uuidv4(),
//     passPhrase: ['some', 'array'],
//     privKey: 'privKey',
//     pubKey: 'pubKey',
//     subAccounts: [
//       {
//         accountName: 'BTC Account',
//         accountType: 'btc',
//         accountBalance: 5000n,
//         accountId: uuidv4(),
//         passPhrase: ['some', 'array'],
//         privKey: 'privKey',
//         pubKey: 'pubKey'
//       },
//       {
//         accountName: 'ETH Account',
//         accountType: 'eth',
//         accountBalance: 5000n,
//         accountId: uuidv4(),
//         passPhrase: ['some', 'array'],
//         privKey: 'privKey',
//         pubKey: 'pubKey'
//       }
//     ]
//   }
// ]

// eslint-disable-next-line require-jsdoc
function App() {
  const [isImportingAccount, setIsImportingAccount] = useState(false)
  const [accountData, setAccountData] = useState<AccountData[]>([])
  const [selectedAccount, setSelectedAccount] = useState(undefined)
  const [accountDetailData, setAccountDetailData] = useState<AccountData | undefined>(undefined)

  useEffect(() => {
    ipcRenderer.invoke('get-accounts').then(accountData => setAccountData(accountData))
  })

  const onSelectAccount = (index: number, subIndex?: number) => {
    if (subIndex === undefined) {
      setAccountDetailData({ ...accountData[index] })
    } else {
      setAccountDetailData({ ...accountData[index].subAccounts![subIndex] })
    }
  }

  return (<div style={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0pt',
  }}>
    <AccountListView
      onImportAccount={() => { setIsImportingAccount(!isImportingAccount); }}
      accounts={accountData}
      onSelectAccount={onSelectAccount} />
    <AccountDetailView account={accountDetailData} />
    <ImportAccountView visible={isImportingAccount} />
  </div>);
}

ReactDom.render(<App />, document.getElementById('app'));
