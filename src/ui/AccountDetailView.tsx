import { AccountData } from "./../Types";
import { AppBar, Button, Container, IconButton, InputLabel, FormControl, TextField, Toolbar, Typography, Select, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ImportExport, Check } from '@material-ui/icons'
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
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

function AccountDetailRename(props: { accountName: string, onRename: (newName: string) => any }) {
  const [accountName, setAccountName] = useState('')

  useEffect(() => {
    setAccountName(props.accountName)
  }, [props.accountName])

  const changeAccountName = (e: any) => {
    setAccountName(e.target.value)
  }

  return (
    <div>
      <TextField style={{ marginTop: '24px' }}
        variant="outlined" value={accountName}
        onChange={changeAccountName}
        label="Account Name"
        InputProps={{
          endAdornment: (<IconButton color="primary" style={{
            visibility: props.accountName !== accountName ? 'visible' : 'hidden'
          }}><Check></Check></IconButton>)
        }}>
      </TextField>
    </div>
  )
}

function AccountDetailKeys(props: { privKey?: string, pubKey?: string, mnemonic?: string }) {
  return (
    <div style={{ paddingTop: '24px' }}>
      {props.pubKey && <Typography>Private Key: {props.privKey}</Typography>}
      {props.privKey && <Typography>Public Key: {props.pubKey}</Typography>}
      {props.mnemonic && <Typography>Mnemonic: {props.mnemonic}</Typography>}
    </div>
  )
}

function AccountDetailChooseIndex(props: { index: number, onChoose: (newIndex: number) => any }) {
  const [index, setIndex] = useState(props.index)
  useEffect(() => {
    setIndex(props.index)
  }, [props.index])
  return null
}

type Erc20Coin = 'ETH' | 'USDT' | 'TFC'
function AccountDetailChooseCoin(props: { coin: Erc20Coin, onChoose: (newCoin: Erc20Coin) => any }) {

  const [coin, setCoin] = useState(props.coin)

  const onChoose = (e: any) => {
    if (coin !== e.target.value) {
      setCoin(e.target.value)
      onChoose(e.target.value)
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
  const balance = (props.account && props.account.accountType !== 'bip44-master') ?
    useBalance(props.account.privKey, props.account.coinType!.abbrName as any, ercCoin) : 0n

  const onChooseErcCoin = (coin: 'ETH' | 'TFC' | 'USDT') => {
    setErcCoin(coin)
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
            {balance && <AccountDetailBalance balance={balance.toString()} />}
            <AccountDetailKeys pubKey={props.account.pubKey} privKey={props.account.privKey} />
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
