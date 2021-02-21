import { AccountData } from "./../Types";
import { AppBar, Button, Container, IconButton, InputLabel, FormControl, TextField, Toolbar, Typography, Select, MenuItem, FormControlLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ImportExport, Check } from '@material-ui/icons'
import { useEffect, useState } from "react";
import { ipcRenderer, Menu } from "electron";
import useBalance from "./useBalance";

interface AccountDetailViewProps {
  account?: AccountData | Required<AccountData>['subAccounts'][number]
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

function AccountDetailBalance(props: { balance: string }) {
  return (
    <div>
      <Typography variant="subtitle1">Balance</Typography>
      <Typography variant="h2">{props.balance}</Typography>
    </div>
  )
}

function AccountDetailKeys(props: { privKey?: string, pubKey?: string, mnemonic?: string }) {
  return (
    <div style={{ marginTop: '24px' }}>
      {props.pubKey && <Typography>Private Key: {props.privKey}</Typography>}
      {props.privKey && <Typography>Public Key: {props.pubKey}</Typography>}
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
    <FormControl variant="outlined" style={{ marginTop: '24px' }}>
      <InputLabel>Account Index</InputLabel>
      <Select value={index} onChange={onChangeIndex}>
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
    <FormControl variant="outlined">
      <InputLabel>ETH/ERC20 Coin</InputLabel>
      <Select value={coin} onChange={onChoose}>
        <MenuItem value="ETH">ETH</MenuItem>
        <MenuItem value="USDT">USDT</MenuItem>
        <MenuItem value="TFC">TFC</MenuItem>
      </Select>
    </FormControl>
  )
}

function AccountDetailView(props: AccountDetailViewProps) {

  const classes = useStyle()
  const [accountName, setAccountName] = useState('')
  const [ercCoin, setErcCoin] = useState<'ETH' | 'TFC' | 'USDT'>('ETH')
  const [balance, setBalance] = useState<bigint | undefined>(undefined)
  const [accountIndex, setAccountIndex] = useState(0)

  useEffect(() => {
    if (props.account && props.account.accountType === 'plain') {
      ipcRenderer.invoke('get-balance', props.account.privKey, props.account.coinType!.abbrName, ercCoin).then(balance => setBalance(balance))
    } else if (props.account && props.account.accountType === 'bip44-sub-account') {
      ipcRenderer.invoke('get-balance', props.account.keys[accountIndex].privKey, props.account.coinType!.abbrName, ercCoin).then(balance => setBalance(balance))
    }
  }, [props.account, accountIndex])

  const onChooseErcCoin = (coin: 'ETH' | 'TFC' | 'USDT') => {
    setErcCoin(coin)
  }

  const onChooseIndex = (newIndex: number) => {
    console.log(newIndex)
    setAccountIndex(newIndex)
  }

  return (
    <div className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant='h6'>TFC Wallet</Typography>
          <span style={{ flex: 1 }}></span>
          {props.account && (<Button color="inherit">Transfer</Button>)}
          <Button color="inherit" onClick={() => location.reload()}>Refresh</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        {props.account ?
          <div className={classes.content}>
            {props.account.coinType?.abbrName == 'ETH' && <AccountDetailChooseCoin coin="ETH" onChoose={onChooseErcCoin} />}
            {props.account.accountType === 'bip44-sub-account' && <AccountDetailChooseIndex index={accountIndex} onChoose={onChooseIndex} />}
            {balance !== undefined && <AccountDetailBalance balance={balance.toString()} />}
            <AccountDetailKeys
              pubKey={props.account.accountType === 'bip44-sub-account' ? props.account.keys[accountIndex].pubKey : props.account.pubKey}
              privKey={props.account.accountType === 'bip44-sub-account' ? props.account.keys[accountIndex].privKey : props.account.privKey} />
          </div> :
          <div>
            <Typography variant="h5" color="textSecondary" align="center" style={{ marginTop: '196px' }}>Select An Account</Typography>
          </div>
        }
      </Container>
    </div>
  );
}

export default AccountDetailView;
