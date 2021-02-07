import { useState } from "react"
import AccountData from "./AccountData"

interface AccountListItemProps {
  accountName: string
  accountType: AccountData['accountType']
  isFocused: boolean
  subAccounts?: {
    accountName: string
    accountType: AccountData['accountType']
  }[]
  onClick?: (subAccountIndex?: number) => any
}

function AccountListItem(props: AccountListItemProps) {
  const [subAccountIndex, setSubAccountIndex] = useState(-1)
  return (
    <div style={{
      display: 'flex',
      justifyItems: 'stretch',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        padding: '8px',
        alignItems: 'center',
        backgroundColor: props.isFocused && subAccountIndex === -1 ? 'gray' : 'inherit'
      }} onClick={() => { props.onClick ? props.onClick() : undefined; setSubAccountIndex(-1) }}>
        <span style={{ fontSize: '12pt' }}>{props.accountName}</span>
        <span style={{ flex: 1 }}></span>
        <span style={{
          fontSize: '10pt',
          border: '0.5px solid gray',
          borderRadius: '4px',
          padding: '2px'
        }}>{props.accountType}</span>
      </div>
      {props.accountType == 'bip44' &&
        props.subAccounts!.map((account, i) => (
          <div style={{
            display: 'flex',
            padding: '8px 8px 8px 24px',
            alignItems: 'center',
            backgroundColor: subAccountIndex === i ? 'gray' : 'inherit'
          }}
            onClick={() => { setSubAccountIndex(i); props.onClick ? props.onClick(i) : undefined }}>
            <span style={{ fontSize: '12pt' }}>{account.accountName}</span>
            <span style={{ flex: 1 }}></span>
            <span style={{
              fontSize: '10pt',
              border: '0.5px solid gray',
              borderRadius: '4px',
              padding: '2px'
            }}>{account.accountType}</span>
          </div>
        ))
      }
    </div>
  )
}

export default AccountListItem