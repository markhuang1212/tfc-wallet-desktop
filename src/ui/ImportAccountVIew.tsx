import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation()

  const onChangeFormat = (e: any) => {
    setFormat(e.target.value)
    props.onChange(e.target.value, accountType, coinType !== '' ? coinType : undefined, text)
  }

  const onChangeAccountType = (e: any) => {
    if (e.target.value === 'plain') {
      setFormat('seed')
    }
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
        <FormLabel>{t('importAccount.accountTypeFieldText')}</FormLabel>
        <RadioGroup value={accountType} onChange={onChangeAccountType}>
          <FormControlLabel value="bip44" control={<Radio />} label={t('importAccount.bip44Account')} />
          <FormControlLabel value="plain" control={<Radio />} label={t('importAccount.standaloneAccount')} />
        </RadioGroup>
      </FormControl>
      <Typography variant="body2" style={{ marginBottom: '16px' }} color="textSecondary">
        {t('importAccount.accountTypeDescriptionText')}
      </Typography>
      <FormControl style={{ display: accountType === 'plain' ? 'block' : 'none' }}>
        <FormLabel>{t('importAccount.coinTypeFieldText')}</FormLabel>
        <RadioGroup value={coinType} onChange={onChangeCoinType}>
          <FormControlLabel value="ETH" control={<Radio />} label="ETH" />
          <FormControlLabel value="BTC" control={<Radio />} label="BTC" />
          <FormControlLabel value="TFC" control={<Radio />} label="TFC" />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel>{t('importAccount.formatFieldText')}</FormLabel>
        <RadioGroup value={format} onChange={onChangeFormat}>
          <FormControlLabel value="mnemonic" control={<Radio />} label={t('importAccount.formatMnemonic')} disabled={accountType !== 'bip44'} />
          <FormControlLabel value="seed" control={<Radio />} label={t('importAccount.formatSeed')} />
        </RadioGroup>
      </FormControl>
      <TextField
        label={format === 'mnemonic' ? t('importAccount.formatMnemonic') : t('importAccount.formatSeed')}
        value={text}
        onChange={onChangeTextInput}></TextField>
      <Typography variant="body2" style={{ marginBottom: '16px' }} color="textSecondary">
        {t('importAccount.createAccountTip')}
      </Typography>
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

  const { t } = useTranslation()

  const onChangeSetting = (format: 'mnemonic' | 'seed', type: 'bip44' | 'plain', coinType: 'ETH' | 'BTC' | 'TFC' | undefined, text: string) => {
    console.log(text)
    setSetting({
      format, type, text, coinType
    })
  }

  return (
    <Dialog open={props.visible} maxWidth="sm" fullWidth>
      <DialogTitle>{t('importAccount.importAccountTitle')}</DialogTitle>
      <ImportAccountActionView onChange={onChangeSetting} />
      <DialogActions>
        <Button onClick={props.onCancel} color="primary">{t('cancelButtonText')}</Button>
        <Button onClick={() => props.onImportAccount(
          setting.format,
          setting.type,
          setting.coinType,
          setting.text)} color="primary">{t('importAccount.importButtonText')}</Button>
      </DialogActions>
    </Dialog>
  )

}

export default ImportAccountView;
