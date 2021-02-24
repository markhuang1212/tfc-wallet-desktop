import { useState } from "react";
import { AccountData } from "./../Types";
import AccountListItem from "./AccountListItem";
import { Divider, makeStyles, Toolbar, Typography, Button, List, Box, Icon, IconButton } from "@material-ui/core";
import { Settings } from '@material-ui/icons'
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({

}))

interface AccountListViewProps {
  accounts: AccountData[]
  onImportAccount: () => any
  onSelectAccount: (index: number, subIndex?: number) => any
}

function AccountListView(props: AccountListViewProps) {

  const [focusedItemIndex, setFocusedItemIndex] = useState(-1)
  const {t} = useTranslation()

  return (
    <div style={{
      flex: 0,
      minWidth: '280px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Toolbar>
        <Typography variant="h6">{t('accountListTitle')}</Typography>
      </Toolbar>
      <Divider />

      <List style={{ flex: 2 }}>
        {props.accounts.map((account, i) =>
          <AccountListItem
            key={account.accountId}
            account={account}
            isFocused={focusedItemIndex === i}
            onClick={(subIndex) => { setFocusedItemIndex(i); props.onSelectAccount(i, subIndex) }} />
        )}
      </List>

      <div style={{ padding: '24px', display: 'flex', justifyContent: "space-evenly", flexDirection: 'row' }}>
        <Button onClick={props.onImportAccount} variant="contained" size="small">
          <Typography color="textPrimary">{t('createOrImportButtonText')}</Typography>
        </Button>
        <IconButton><Settings /></IconButton>
      </div>
    </div>
  )
}

export default AccountListView;
