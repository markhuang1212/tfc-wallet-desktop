import { useState } from "react";
import AccountData from "./AccountData";
import AccountListItem from "./AccountListItem";

interface AccountListViewProps {
  accounts: AccountData[]
  onImportAccount: () => any
  onSelectAccount: (index: number, subIndex?: number) => any
}

function AccountListView(props: AccountListViewProps) {

  const [focusedItemIndex, setFocusedItemIndex] = useState(-1)

  return (
    <div style={{
      backgroundColor: 'lightgray',
      flex: 1,
      minWidth: '256px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        display: 'flex',
        borderBottom: 'solid 1px gray',
        padding: '8px',
      }}>
        <span>My Accounts</span>
        <span style={{ flex: 1 }}></span>
      </header>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {props.accounts.map((account, i) =>
          <AccountListItem
            key={account.accountId}
            accountName={account.accountName}
            accountType={account.accountType}
            isFocused={focusedItemIndex === i}
            subAccounts={account.subAccounts}
            onClick={(subIndex) => { setFocusedItemIndex(i); props.onSelectAccount(i, subIndex) }} />
        )}
      </div>

      <div style={{ padding: '8px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <button onClick={props.onImportAccount}>Import/Create</button>
      </div>
    </div>
  )
}

export default AccountListView;
