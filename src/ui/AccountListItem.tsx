import { useState } from "react"
import { AccountData } from "./../Types"
import { ListItem, ListItemText } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import React from "react"

interface AccountListItemProps {
  account: AccountData
  isFocused: boolean
  onClick: (subAccountIndex?: number) => any
}

function AccountListItem(props: AccountListItemProps) {

  const [subAccountIndex, setSubAccountIndex] = useState(-1)

  return (
    <React.Fragment>
      <ListItem button
        style={{ padding: '8px 24px' }}
        selected={props.isFocused && subAccountIndex === -1}
        onClick={() => { props.onClick(); setSubAccountIndex(-1) }}>
        <ListItemText primary={props.account.accountName} secondary={props.account.coinType?.abbrName ?? 'bip44'} />
        {props.account.subAccounts && <ExpandMore />}
      </ListItem>
      {props.account.accountType === 'bip44-master' &&
        props.account.subAccounts!.map((account, i) => (
          <ListItem button
            style={{ padding: '8px 48px' }}
            key={account.accountId}
            onClick={() => { setSubAccountIndex(i); props.onClick(i) }}
            selected={props.isFocused && subAccountIndex === i}>
            <ListItemText primary={account.accountName} secondary={account.coinType?.abbrName} />
          </ListItem>
        ))
      }
    </React.Fragment>
  )
}

export default AccountListItem