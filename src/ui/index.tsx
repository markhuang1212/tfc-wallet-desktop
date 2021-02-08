import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { AccountData } from './Types';
import AccountDetailView from './AccountDetailView';
import AccountListView from './AccountListView';
import ImportAccountView from './ImportAccountVIew';
import { ipcRenderer } from 'electron';
import '@fontsource/roboto'

function App() {
  const [isImportingAccount, setIsImportingAccount] = useState(false)
  const [accountData, setAccountData] = useState<AccountData[]>([])
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

  const handleImport = (action: any) => {
    setIsImportingAccount(false)
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

    <ImportAccountView visible={isImportingAccount} onFinish={handleImport} />
  </div>);
}

ReactDom.render(<App />, document.getElementById('app'));
