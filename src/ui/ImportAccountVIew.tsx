import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@material-ui/core'

interface ImportAccountViewProps {
  visible: boolean
  onCancel: () => any
  onImportAccount: (format: ImportAccountFormat, type: ImportAccountType, coinType: ImportAccountCoinType | undefined, text: string) => any
}

type ImportAccountFormat = 'mnemonic' | 'seed'
type ImportAccountType = 'bip44' | 'plain'
type ImportAccountCoinType = 'ETH' | 'BTC' | 'TFC'

function ImportAccountActionView(props: {
  onChange: (format: 'mnemonic' | 'seed', type: 'bip44' | 'plain', coinType: 'ETH' | 'BTC' | 'TFC' | undefined, text: string) => any
}) {

  const [format, setFormat] = useState<'mnemonic' | 'seed'>('mnemonic')
  const [accountType, setAccountType] = useState<'bip44' | 'plain'>('bip44')
  const [text, setText] = useState('')
  const [coinType, setCoinType] = useState<ImportAccountCoinType | ''>('TFC')

  const onChangeFormat = (e: any) => {
    setFormat(e.target.value)
    props.onChange(e.target.value, accountType, coinType !== '' ? coinType : undefined, text)
  }

  const onChangeAccountType = (e: any) => {
    setAccountType(e.target.value)
    props.onChange(format, e.target.value, coinType !== '' ? coinType : undefined, text)
  }

  const onChangeCoinType = (e: any) => {
    setCoinType(e.target.value)
    props.onChange(format, accountType, e.target.value !== '' ? e.target.value : undefined, text)
  }

  const onChangeTextInput = (e: any) => {
    setText(e.target.value)
    props.onChange(format, accountType, coinType !== '' ? coinType : undefined, e.target.value)
  }

  return (
    <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl>
        <FormLabel>Account Type</FormLabel>
        <RadioGroup value={accountType} onChange={onChangeAccountType}>
          <FormControlLabel value="bip44" control={<Radio />} label="BIP44 Account" />
          <FormControlLabel value="plain" control={<Radio />} label="Standalone Account" />
        </RadioGroup>
      </FormControl>
      <FormControl style={{ display: accountType === 'plain' ? 'block' : 'none' }}>
        <FormLabel>Coin Type</FormLabel>
        <RadioGroup value={coinType} onChange={onChangeCoinType}>
          <FormControlLabel value="ETH" control={<Radio />} label="ETH" />
          <FormControlLabel value="BTC" control={<Radio />} label="BTC" />
          <FormControlLabel value="TFC" control={<Radio />} label="TFC" />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Import Format</FormLabel>
        <RadioGroup value={format} onChange={onChangeFormat}>
          <FormControlLabel value="mnemonic" control={<Radio />} label="Mnemonic" disabled={accountType !== 'bip44'} />
          <FormControlLabel value="seed" control={<Radio />} label="Seed/Private Key" />
        </RadioGroup>
      </FormControl>
      <TextField label={format} value={text} onChange={onChangeTextInput}></TextField>
    </DialogContent>
  )
}

// eslint-disable-next-line require-jsdoc
function ImportAccountView(props: ImportAccountViewProps) {

  const [setting, setSetting] = useState<{
    format: ImportAccountFormat,
    type: ImportAccountType,
    coinType: ImportAccountCoinType | undefined,
    text: string
  }>({
    format: 'mnemonic',
    type: 'bip44',
    coinType: undefined,
    text: ''
  })

  const onChangeSetting = (format: 'mnemonic' | 'seed', type: 'bip44' | 'plain', coinType: 'ETH' | 'BTC' | 'TFC' | undefined, text: string) => {
    console.log(text)
    setSetting({
      format, type, text, coinType
    })
  }

  return (
    <Dialog open={props.visible} maxWidth="sm" fullWidth>
      <DialogTitle>Import Account</DialogTitle>
      <ImportAccountActionView onChange={onChangeSetting} />
      <DialogActions>
        <Button onClick={props.onCancel} color="primary">Back</Button>
        <Button onClick={() => props.onImportAccount(
          setting.format,
          setting.type,
          setting.coinType,
          setting.text)} color="primary">Import</Button>
      </DialogActions>
    </Dialog>
  )

}

export default ImportAccountView;
