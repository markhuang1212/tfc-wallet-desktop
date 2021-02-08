import { useState } from "react";
import { AccountData } from "./Types";
import AccountListItem from "./AccountListItem";
import { Divider, makeStyles, Toolbar, Typography, Button, List, Box } from "@material-ui/core";
import { getThemeProps } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({

}))

interface AccountListViewProps {
  accounts: AccountData[]
  onImportAccount: () => any
  onSelectAccount: (index: number, subIndex?: number) => any
}

function AccountListView(props: AccountListViewProps) {

  const [focusedItemIndex, setFocusedItemIndex] = useState(-1)
  const classes = useStyles()

  return (
    <div style={{
      // backgroundColor: 'lightgray',
      flex: 0,
      minWidth: '280px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Toolbar>
        <Typography variant="h6">My Accounts</Typography>
      </Toolbar>
      <Divider />

      <List>
        {props.accounts.map((account, i) =>
          <AccountListItem
            key={account.accountId}
            accountName={account.accountName}
            accountType={account.accountType}
            isFocused={focusedItemIndex === i}
            subAccounts={account.subAccounts}
            onClick={(subIndex) => { setFocusedItemIndex(i); props.onSelectAccount(i, subIndex) }} />
        )}
      </List>

      <div style={{ padding: '8px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Button onClick={props.onImportAccount} variant="contained">
          <Typography color="textPrimary">Create / Import</Typography>
        </Button>
      </div>
    </div>
  )
}

export default AccountListView;
