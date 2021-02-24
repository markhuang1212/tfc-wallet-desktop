import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { AccountData, AccountDataBip44Master, AccountDataBip44SubAccount, AccountDataPlain, TxRequestInfo } from './../Types';
import AccountDetailView from './AccountDetailView';
import AccountListView from './AccountListView';
import ImportAccountView from './ImportAccountVIew';
import { ipcRenderer } from 'electron';
import '@fontsource/roboto'
import TransferView from './TransferView';
import SwapView from './SwapView';

function App() {
  const [isImportingAccount, setIsImportingAccount] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  const [accountData, setAccountData] = useState<AccountData[]>([])

  const [accountDetailData, setAccountDetailData] = useState<AccountData | AccountDataBip44SubAccount | undefined>(undefined)
  const [accountIndex, setAccountIndex] = useState(0)
  const [ercCoin, setErcCoin] = useState<'ETH' | 'TFC' | 'USDT'>('ETH')


  useEffect(() => {
    ipcRenderer.invoke('get-accounts').then(accountData => {
      setAccountData(accountData)
    })
  }, [])

  const onSelectAccount = (index: number, subIndex?: number) => {
    if (subIndex === undefined) {
      setAccountDetailData({ ...accountData[index] })
    } else {
      setAccountDetailData({ ...(accountData[index] as AccountDataBip44Master).subAccounts[subIndex] })
    }
  }

  const onRename = async (newName: string) => {
    const privKey = (accountDetailData as (AccountDataBip44Master | AccountDataPlain)).privKey
    const newAccountData = await ipcRenderer.invoke('rename-account', privKey, newName)
    setAccountData(newAccountData)
  }

  const onChooseErcCoin = (newCoin: 'ETH' | 'TFC' | 'USDT') => {
    setErcCoin(newCoin)
  }

  const onSwap = (destination: string, amount: string) => {
    if (accountDetailData) {
      let from_privKey = ''
      if (accountDetailData.accountType === 'bip44-sub-account') {
        from_privKey = accountDetailData.keys[accountIndex].privKey
      }
      if (accountDetailData.accountType === 'plain') {
        from_privKey = accountDetailData.privKey
      }
      ipcRenderer.invoke('swap-tfc', from_privKey, destination, BigInt(amount)).then((txHash: string) => {
        alert(`Swap Succeed! Transaction Hash: ${txHash}`)
      }).catch((e) => {
        console.error(e)
        alert(`Swap Failed.`)
      })
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
      coinType = account.coinType
    }
    if (account.accountType === 'bip44-sub-account') {
      sender = account.keys[accountIndex].privKey
      coinType = account.coinType
    }

    const txInfo: TxRequestInfo = {
      sender_privKey: sender,
      receiver_address: recipient,
      amount: BigInt(amount),
      coinType: coinType as any,
      ercCoin: ercCoin
    }

    ipcRenderer.invoke('transfer-coin', txInfo).then((txHash: string) => {
      alert(`Transfer submitted! Transaction Hash: ${txHash}. \n\n Please check the balance after a few minutes.`)
    }).catch(() => {
      alert(`Transfer Failed! Please try again later.`)
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

    <AccountDetailView
      account={accountDetailData}
      onStartTransfer={() => setIsTransferring(true)}
      onChooseIndex={onChooseAccountIndex}
      onChooseErcCoin={onChooseErcCoin}
      onStartSwap={() => setIsSwapping(true)}
      onRename={onRename} />

    <ImportAccountView visible={isImportingAccount}
      onCancel={() => setIsImportingAccount(false)}
      onImportAccount={onImportAccount} />

    <TransferView visible={isTransferring} onCancel={() => setIsTransferring(false)} onTransfer={onTransfer} />

    <SwapView visible={isSwapping} onCancel={() => setIsSwapping(false)} onSwap={onSwap} />

  </div>);
}

ReactDom.render(<App />, document.getElementById('app'));
