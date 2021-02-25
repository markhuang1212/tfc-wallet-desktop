import { AccountData, AccountDataBip44SubAccount, AccountDataPlain, Erc20Coin, TfcChainEndpoint } from "./../Types";
import { AppBar, Button, Container, IconButton, InputLabel, FormControl, TextField, Toolbar, Typography, Select, MenuItem, FormControlLabel, InputAdornment, Input, OutlinedInput } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ImportExport, Check, Done } from '@material-ui/icons'
import { useEffect, useState } from "react";
import { ipcRenderer, Menu } from "electron";
import useBalance from "./useBalance";
import { useTranslation } from 'react-i18next'
import DescriptionText from "./DescriptionText";
import { TransferRecord } from "../core/blockchain";

interface AccountDetailViewProps {
  account?: AccountData | AccountDataBip44SubAccount
  onStartTransfer: () => any
  onChooseIndex: (newIndex: number) => any
  onChooseErcCoin: (newErcCoin: Erc20Coin) => any
  onChooseEndpoint: (newEndpoint: TfcChainEndpoint) => any
  onStartSwap: () => any
  onRename: (newName: string) => any
  onRemoveAccount: () => any
}

const useStyle = makeStyles({
  container: {
    flex: 2,
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '24px',
  }
})

function AccountDetailRename(props: { name: string, onRename: (newName: string) => any }) {

  const [name, setName] = useState(props.name)
  const { t } = useTranslation()

  const onChangeName = (e: any) => {
    setName(e.target.value)
  }

  useEffect(() => {
    setName(props.name)
  }, [props.name])

  return (
    <FormControl variant="outlined" style={{ margin: '16px 0px' }}>
      <InputLabel>{t('accountDetail.editAccountNameText')}</InputLabel>
      <OutlinedInput
        label={t('accountDetail.editAccountNameText')}
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
  const { t } = useTranslation()

  return (
    <div style={{ margin: '16px 0px' }}>
      <Typography variant="subtitle1">{t('accountDetail.balance')}</Typography>
      <Typography variant="h2">{props.balance}</Typography>
    </div>
  )
}

function AccountDetailChooseEndpoint(props: { endpoint: TfcChainEndpoint, onChoose: (newEndpoint: TfcChainEndpoint) => any }) {
  const { t } = useTranslation()
  const [endpoint, setEndpoint] = useState(props.endpoint)

  useEffect(() => {
    setEndpoint(props.endpoint)
  }, [props.endpoint])

  const onChoose = (e: any) => {
    setEndpoint(e.target.value)
    props.onChoose(e.target.value)
  }

  return (
    <div style={{ margin: '16px 0px' }}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>{t('accountDetail.chooseEndpointText')}</InputLabel>
        <Select label={t('accountDetail.chooseEndpointText')} value={endpoint} onChange={onChoose}>
          <MenuItem value="openbi">OpenBI</MenuItem>
          <MenuItem value="blockchainfs">BlockchainFs</MenuItem>
        </Select>
      </FormControl>
      <DescriptionText>{t('accountDetail.chooseEndpointDescription')}</DescriptionText>
    </div>
  )
}

function AccountDetailKeys(props: { privKey?: string, pubKey?: string, mnemonic?: string, address?: string }) {
  return (
    <div style={{ margin: '16px 0px' }}>
      {
        [[props.privKey, 'Private Key'],
        [props.pubKey, 'Public Key'],
        [props.mnemonic, 'Mnemonic'],
        [props.address, 'Address']].map(v => (
          v[0] && (
            <div style={{ margin: '8px 0px' }}>
              <Typography variant="overline" color="textSecondary" style={{ lineHeight: '0' }}>{v[1]}</Typography>
              <Typography style={{ overflowWrap: 'break-word' }}>{v[0]}</Typography>
            </div>
          )
        ))
      }
    </div>
  )
}

function AccountDetailChooseIndex(props: { index: number, onChoose: (newIndex: number) => any }) {
  const [index, setIndex] = useState(props.index)

  const onChangeIndex = (e: any) => {
    setIndex(e.target.value)
    props.onChoose(e.target.value)
  }

  const { t } = useTranslation()

  return (
    <div style={{ margin: '16px 0px' }} >
      <FormControl variant="outlined" fullWidth>
        <InputLabel>{t('accountDetail.chooseAccountIndexText')}</InputLabel>
        <Select value={index} onChange={onChangeIndex} label={t('accountDetail.chooseAccountIndexText')}>
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(v => (
              <MenuItem value={v} key={v}>{v}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <DescriptionText>{t('accountDetail.chooseAccountIndexDescription')}</DescriptionText>
    </div>
  )
}

function AccountDetailChooseCoin(props: { coin: Erc20Coin, onChoose: (newCoin: Erc20Coin) => any }) {

  const [coin, setCoin] = useState(props.coin)
  const { t } = useTranslation()

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
    <div style={{ margin: '16px 0px' }}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>ETH/ERC20 Coin</InputLabel>
        <Select label="ETH/ERC20 Coin" value={coin} onChange={onChoose}>
          <MenuItem value="ETH">ETH</MenuItem>
          <MenuItem value="USDT">USDT</MenuItem>
          <MenuItem value="TFC">TFC</MenuItem>
        </Select>
      </FormControl>
      <DescriptionText>{t('accountDetail.chooseErcCoinDescription')}</DescriptionText>
    </div>
  )
}

function AccountDetailFurtherAction(props: { onRemove: () => any, account: AccountData | AccountDataBip44SubAccount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px' }}>
      {props.account.accountType !== 'bip44-sub-account' && <Button onClick={props.onRemove}>
        <Typography color="error">Remove Account</Typography>
      </Button>}
    </div>
  )
}

function AccountDetailTxHistory(props: { history: TransferRecord[] }) {

}

function AccountDetailView(props: AccountDetailViewProps) {

  const classes = useStyle()
  const [ercCoin, setErcCoin] = useState<Erc20Coin>('ETH')
  const [balance, setBalance] = useState<bigint | undefined>(undefined)
  const [accountIndex, setAccountIndex] = useState(0)
  const [endpoint, setEndpoint] = useState<TfcChainEndpoint>('openbi')
  const { t } = useTranslation()

  useEffect(() => {
    setBalance(undefined)
    if (props.account && props.account.accountType === 'plain') {
      ipcRenderer.invoke('get-balance', props.account.privKey, props.account.coinType, ercCoin).then(balance => setBalance(balance))
    } else if (props.account && props.account.accountType === 'bip44-sub-account') {
      ipcRenderer.invoke('get-balance', props.account.keys[accountIndex].privKey, props.account.coinType, ercCoin).then(balance => setBalance(balance))
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

  const onChooseEndpoint = (newEndpoint: TfcChainEndpoint) => {
    setEndpoint(newEndpoint)
  }

  return (
    <div className={classes.container}>
      <AppBar position="fixed" style={{
        left: '280px',
        width: 'calc(100% - 280px)'
      }}>
        <Toolbar>
          <Typography variant='h6'>{t('productName')}</Typography>
          <span style={{ flex: 1 }}></span>
          {((props.account as AccountDataPlain | AccountDataBip44SubAccount | undefined)?.coinType === 'TFC') && <Button color="inherit" onClick={props.onStartSwap}>{t('swapButtonText')}</Button>}
          {(props.account && props.account.accountType !== 'bip44-master' && props.account.coinType !== 'TFC') && (<Button color="inherit" onClick={props.onStartTransfer}>{t('transferButtonText')}</Button>)}
          <Button color="inherit" onClick={() => location.reload()}>{t('refreshButtonText')}</Button>
        </Toolbar>
      </AppBar>
      <div style={{
        height: '100%',
        overflow: 'scroll',
      }}>
        <div style={{ height: '64px' }}></div>
        <Container maxWidth="sm">
          {props.account ?

            <div className={classes.content}>

              {(props.account.accountType === 'bip44-master' || props.account.accountType === 'plain') &&
                <AccountDetailRename name={props.account.accountName} onRename={props.onRename} />}

              {(props.account as AccountDataPlain | AccountDataBip44SubAccount).coinType === 'ETH' && <AccountDetailChooseCoin coin="ETH" onChoose={onChooseErcCoin} />}

              {props.account.accountType === 'bip44-sub-account' && <AccountDetailChooseIndex index={accountIndex} onChoose={onChooseIndex} />}

              {(props.account.accountType !== 'bip44-master' && props.account.coinType === 'TFC') && <AccountDetailChooseEndpoint endpoint={endpoint} onChoose={onChooseEndpoint} />}

              {balance !== undefined && <AccountDetailBalance balance={balance.toString()} />}

              <AccountDetailKeys
                pubKey={props.account.accountType === 'bip44-sub-account' ? props.account.keys[accountIndex].pubKey : (props.account as AccountDataPlain).pubKey}
                privKey={props.account.accountType === 'bip44-sub-account' ? props.account.keys[accountIndex].privKey : props.account.privKey}
                address={props.account.accountType === 'bip44-sub-account' ? props.account.keys[accountIndex].address : (props.account as AccountDataPlain).address}
                mnemonic={props.account.accountType === 'bip44-master' ? props.account.passPhrase : undefined} />

              <AccountDetailFurtherAction onRemove={props.onRemoveAccount} account={props.account} />

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
    </div>
  );
}

export default AccountDetailView;
