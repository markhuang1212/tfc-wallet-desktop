import { useState } from "react"
import { AccountData } from "./Types"
import { ListItem, ListItemText } from '@material-ui/core'
import React from "react"

interface AccountListItemProps {
  accountName: string
  accountType: AccountData['accountType']
  isFocused: boolean
  subAccounts?: {
    accountName: string
    accountType: AccountData['accountType']
    accountId: string
  }[]
  onClick: (subAccountIndex?: number) => any
}

function AccountListItem(props: AccountListItemProps) {

  const [subAccountIndex, setSubAccountIndex] = useState(-1)

  return (
    <React.Fragment>
      <ListItem button
        selected={props.isFocused && subAccountIndex === -1}
        onClick={() => { props.onClick(); setSubAccountIndex(-1) }}>
        <ListItemText primary={props.accountName} secondary={props.accountType} />
      </ListItem>
      {props.accountType == 'bip44' &&
        props.subAccounts!.map((account, i) => (
          <ListItem button
            style={{ paddingLeft: '32px' }}
            key={account.accountId}
            onClick={() => { setSubAccountIndex(i); props.onClick(i) }}
            selected={props.isFocused && subAccountIndex === i}>
            <ListItemText primary={account.accountName} secondary={account.accountType} />
          </ListItem>
        ))
      }
    </React.Fragment>
  )
}

export default AccountListItem