import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { AccountData, TxRequestInfo } from './../Types';
import AccountDetailView from './AccountDetailView';
import AccountListView from './AccountListView';
import ImportAccountView from './ImportAccountVIew';
import { ipcRenderer } from 'electron';
import '@fontsource/roboto'
import TransferView from './TransferView';

function App() {
  const [isImportingAccount, setIsImportingAccount] = useState(false)
  const [accountData, setAccountData] = useState<AccountData[]>([])
  const [accountDetailData, setAccountDetailData] = useState<AccountData | undefined | Required<AccountData>['subAccounts'][0]>(undefined)
  const [accountIndex, setAccountIndex] = useState(0)
  const [ercCoin, setErcCoin] = useState<'ETH' | 'TFC' | 'USDT'>('ETH')
  const [isTransferring, setIsTransferring] = useState(false)

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

  const onChooseErcCoin = (newCoin: 'ETH' | 'TFC' | 'USDT') => {
    setErcCoin(newCoin)
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

  const onChooseAccountIndex = (newIndex: number) => {
    setAccountIndex(newIndex)
  }

  const onTransfer = (recipient: string, amount: string) => {
    setIsTransferring(false)
    if (accountDetailData === undefined || accountDetailData.accountType === 'bip44-master') {
      return
    }

    const account = { ...accountDetailData }
    let sender = ''
    let coinType = ''
    if (account.accountType === 'plain') {
      sender = account.privKey
      coinType = account.coinType!.abbrName
    }
    if (account.accountType === 'bip44-sub-account') {
      sender = account.keys[accountIndex].privKey
      coinType = account.coinType!.abbrName
    }

    const txInfo: TxRequestInfo = {
      sender_privKey: sender,
      receiver_address: recipient,
      amount: BigInt(amount),
      coinType: coinType as any,
      ercCoin: ercCoin
    }

    ipcRenderer.invoke('transfer-coin', txInfo).then((txHash:string) => {
      alert(`Transfer submitted! Transaction Hash: ${txHash}. \n\n Please check the balance after a few minutes.`)
    }).catch(() => {
      console.log('transfer failed.')
    })

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

    <AccountDetailView account={accountDetailData}
      onStartTransfer={() => setIsTransferring(true)}
      onChooseIndex={onChooseAccountIndex}
      onChooseErcCoin={onChooseErcCoin} />

    <ImportAccountView visible={isImportingAccount}
      onCancel={() => setIsImportingAccount(false)}
      onImportAccount={onImportAccount} />

    <TransferView visible={isTransferring} onCancel={() => setIsTransferring(false)} onTransfer={onTransfer} />

  </div>);
}

ReactDom.render(<App />, document.getElementById('app'));
