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
      setAccountData(accountData)
    })
  }, [])

  const onSelectAccount = (index: number, subIndex?: number) => {
    if (subIndex === undefined) {
      setAccountDetailData({ ...accountData[index] })
    } else {
      setAccountDetailData({ ...accountData[index].subAccounts![subIndex] })
    }
  }

  const onImportAccount = async (
    format: 'mnemonic' | 'seed',
    type: 'bip44' | 'plain',
    coinType: 'ETH' | 'BTC' | 'TFC' | undefined,
    text: string) => {
    setIsImportingAccount(false)

    console.log(`${format} ${type} ${coinType} ${text}`)

    if (type === 'bip44') {
      if (format === 'mnemonic') {
        const mnemonic = text.split(' ')
        await ipcRenderer.invoke('create-bip44-account', mnemonic)
      }
      if (format === 'seed') {
        await ipcRenderer.invoke('create-bip44-account', text)
      }
    }
    
    if (type === 'plain') {
      if (format === 'mnemonic') {
        console.log('NOT supported')
        return
      }
      if (format === 'seed') {
        if (coinType === undefined) {
          console.log('invalid coin type')
          return
        }
        await ipcRenderer.invoke('create-plain-account', coinType, text)
      }
    }

    const newAccountData = await ipcRenderer.invoke('get-accounts')
    setAccountData(newAccountData)
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

    <AccountDetailView account={accountDetailData} onRename={(_) => { }} />

    <ImportAccountView visible={isImportingAccount}
      onCancel={() => setIsImportingAccount(false)}
      onImportAccount={onImportAccount} />
  </div>);
}

ReactDom.render(<App />, document.getElementById('app'));
