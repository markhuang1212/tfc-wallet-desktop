import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { AccountData } from './../Types';
import AccountDetailView from './AccountDetailView';
import AccountListView from './AccountListView';
import ImportAccountView from './ImportAccountVIew';
import { ipcRenderer } from 'electron';
import '@fontsource/roboto'

function App() {
  const [isImportingAccount, setIsImportingAccount] = useState(false)
  const [accountData, setAccountData] = useState<AccountData[]>([])
  const [accountDetailData, setAccountDetailData] = useState<AccountData | undefined | Required<AccountData>['subAccounts'][0]>(undefined)

  useEffect(() => {
    ipcRenderer.invoke('get-accounts').then(accountData => {
      console.log(accountData)
      setAccountData(accountData)
    })
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

    <ImportAccountView visible={isImportingAccount}
      onCancel={() => setIsImportingAccount(false)}
      onCreateAccount={() => { }}
      onImportAccount={() => { }} />
  </div>);
}

ReactDom.render(<App />, document.getElementById('app'));
