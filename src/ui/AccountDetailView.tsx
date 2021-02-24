import { AccountData, AccountDataBip44SubAccount, AccountDataPlain } from "./../Types";
import { AppBar, Button, Container, IconButton, InputLabel, FormControl, TextField, Toolbar, Typography, Select, MenuItem, FormControlLabel, InputAdornment, Input, OutlinedInput } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ImportExport, Check, Done } from '@material-ui/icons'
import { useEffect, useState } from "react";
import { ipcRenderer, Menu } from "electron";
import useBalance from "./useBalance";
import { useTranslation } from 'react-i18next'

interface AccountDetailViewProps {
  account?: AccountData | AccountDataBip44SubAccount
  onStartTransfer: () => any
  onChooseIndex: (newIndex: number) => any
  onChooseErcCoin: (newErcCoin: 'ETH' | 'TFC' | 'USDT') => any
  onStartSwap: () => any
  onRename: (newName: string) => any
}

const useStyle = makeStyles({
  container: {
    flex: 2
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '24px'
  }
})

function AccountDetailRename(props: { name: string, onRename: (newName: string) => any }) {

  const [name, setName] = useState(props.name)

  const onChangeName = (e: any) => {
    setName(e.target.value)
  }

  useEffect(() => {
    setName(props.name)
  }, [props.name])

  return (
    <FormControl variant="outlined" style={{ margin: '16px 0px' }}>
      <InputLabel>Account Name</InputLabel>
      <OutlinedInput
        label="Account Name"
        value={name}
        onChange={onChangeName}
        endAdornment={
          <InputAdornment position="end" style={{ visibility: name !== props.name ? 'visible' : 'hidden' }}>
            <IconButton onClick={() => props.onRename(name)}><Done color="action"></Done></IconButton>
          </InputAdornment>
        } />
    </FormControl>
  )
}

function AccountDetailBalance(props: { balance: string }) {
  return (
    <div style={{ margin: '16px 0px' }}>
      <Typography variant="subtitle1">Balance</Typography>
      <Typography variant="h2">{props.balance}</Typography>
    </div>
  )
}

function AccountDetailKeys(props: { privKey?: string, pubKey?: string, mnemonic?: string, address?: string }) {
  return (
    <div style={{ margin: '16px 0px' }}>
      {props.privKey && <Typography style={{ overflowWrap: 'break-word' }}>Private Key: {props.privKey}</Typography>}
      {props.pubKey && <Typography style={{ overflowWrap: 'break-word' }}>Public Key: {props.pubKey}</Typography>}
      {props.address && <Typography style={{ overflowWrap: 'break-word' }}>Address: {props.address}</Typography>}
      {props.mnemonic && <Typography>Mnemonic: {props.mnemonic}</Typography>}
    </div>
  )
}

function AccountDetailChooseIndex(props: { index: number, onChoose: (newIndex: number) => any }) {
  const [index, setIndex] = useState(props.index)

  const onChangeIndex = (e: any) => {
    setIndex(e.target.value)
    props.onChoose(e.target.value)
  }

  return (
    <FormControl variant="outlined" style={{ margin: '16px 0px' }}>
      <InputLabel>Account Index</InputLabel>
      <Select value={index} onChange={onChangeIndex} label="Account Index">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(v => (
            <MenuItem value={v} key={v}>{v}</MenuItem>
          ))
        }
      </Select>

    </FormControl>
  )
}

type Erc20Coin = 'ETH' | 'USDT' | 'TFC'
function AccountDetailChooseCoin(props: { coin: Erc20Coin, onChoose: (newCoin: Erc20Coin) => any }) {

  const [coin, setCoin] = useState(props.coin)

  const onChoose = (e: any) => {
    if (coin !== e.target.value) {
      setCoin(e.target.value)
      props.onChoose(e.target.value)
    }
  }

  useEffect(() => {
    setCoin(props.coin)
  }, [props.coin])

  return (
    <FormControl variant="outlined" style={{ margin: '16px 0px' }}>
      <InputLabel>ETH/ERC20 Coin</InputLabel>
      <Select label="ETH/ERC20 Coin" value={coin} onChange={onChoose}>
        <MenuItem value="ETH">ETH</MenuItem>
        <MenuItem value="USDT">USDT</MenuItem>
        <MenuItem value="TFC">TFC</MenuItem>
      </Select>
    </FormControl>
  )
}

function AccountDetailFurtherAction(props: { onRemove: () => any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px' }}>
      <Button onClick={props.onRemove}>
        <Typography color="error">Remove Account</Typography>
      </Button>
    </div>
  )
}

function AccountDetailView(props: AccountDetailViewProps) {

  const classes = useStyle()
  const [ercCoin, setErcCoin] = useState<'ETH' | 'TFC' | 'USDT'>('ETH')
  const [balance, setBalance] = useState<bigint | undefined>(undefined)
  const [accountIndex, setAccountIndex] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    if (props.account && props.account.accountType === 'plain') {
      ipcRenderer.invoke('get-balance', props.account.privKey, props.account.coinType, ercCoin).then(balance => setBalance(balance))
    } else if (props.account && props.account.accountType === 'bip44-sub-account') {
      ipcRenderer.invoke('get-balance', props.account.keys[accountIndex].privKey, props.account.coinType, ercCoin).then(balance => setBalance(balance))
    } else {
      setBalance(undefined)
    }
  }, [props.account, accountIndex, ercCoin])

  const onChooseErcCoin = (coin: 'ETH' | 'TFC' | 'USDT') => {
    setErcCoin(coin)
    props.onChooseErcCoin(coin)
  }

  const onChooseIndex = (newIndex: number) => {
    setAccountIndex(newIndex)
    props.onChooseIndex(newIndex)
  }

  return (
    <div className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant='h6'>{t('productName')}</Typography>
          <span style={{ flex: 1 }}></span>
          {((props.account as AccountDataPlain | AccountDataBip44SubAccount | undefined)?.coinType === 'TFC') && <Button color="inherit" onClick={props.onStartSwap}>Swap</Button>}
          {(props.account && props.account.accountType !== 'bip44-master' && props.account.coinType !== 'TFC') && (<Button color="inherit" onClick={props.onStartTransfer}>Transfer</Button>)}
          <Button color="inherit" onClick={() => location.reload()}>{t('refreshButtonText')}</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        {props.account ?

          <div className={classes.content}>

            {(props.account.accountType === 'bip44-master' || props.account.accountType === 'plain') &&
              <AccountDetailRename name={props.account.accountName} onRename={props.onRename} />}

            {(props.account as AccountDataPlain | AccountDataBip44SubAccount).coinType === 'ETH' && <AccountDetailChooseCoin coin="ETH" onChoose={onChooseErcCoin} />}

            {props.account.accountType === 'bip44-sub-account' && <AccountDetailChooseIndex index={accountIndex} onChoose={onChooseIndex} />}

            {balance !== undefined && <AccountDetailBalance balance={balance.toString()} />}

            <AccountDetailKeys
              pubKey={props.account.accountType === 'bip44-sub-account' ? props.account.keys[accountIndex].pubKey : (props.account as AccountDataPlain).pubKey}
              privKey={props.account.accountType === 'bip44-sub-account' ? props.account.keys[accountIndex].privKey : props.account.privKey}
              address={props.account.accountType === 'bip44-sub-account' ? props.account.keys[accountIndex].address : (props.account as AccountDataPlain).address} />

            <AccountDetailFurtherAction onRemove={() => { }} />

          </div>

          :

          <div>
            <Typography variant="h5" color="textSecondary" align="center" style={{ marginTop: '196px' }}>
              {t('selectAccountTip')}
            </Typography>
            <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: '16px' }}>
              {t('createOrImportAccountTip')}
            </Typography>
          </div>

        }
      </Container>
    </div>
  );
}

export default AccountDetailView;
