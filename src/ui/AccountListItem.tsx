import AccountData from "./AccountData"

interface AccountListItemProps {
  accountName: string
  accountType: AccountData['accountType']
  isFocused: boolean
  onClick?: (subAccountIndex?: number) => any
}

function AccountListItem(props: AccountListItemProps) {
  return (
    <div style={{
      display: 'flex',
      padding: '8px',
      alignItems: 'center',
      backgroundColor: props.isFocused ? 'gray' : 'inherit'
    }} onClick={() => { props.onClick ? props.onClick() : undefined }}>
      <span style={{ fontSize: '12pt' }}>{props.accountName}</span>
      <span style={{ flex: 1 }}></span>
      <span style={{
        fontSize: '10pt',
        border: '0.5px solid gray',
        borderRadius: '4px',
        padding: '2px'
      }}>{props.accountType}</span>
    </div>
  )
}

export default AccountListItem