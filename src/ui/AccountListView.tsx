import { useEffect, useState } from "react";
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
  const { t } = useTranslation()

  useEffect(() => {
    setFocusedItemIndex(-1)
  }, [props.accounts])

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

      <List style={{ flex: 2, overflow: 'scroll' }}>
        {props.accounts.map((account, i) =>
          <AccountListItem
            key={account.accountId}
            account={account}
            isFocused={focusedItemIndex === i}
            onClick={(subIndex) => { setFocusedItemIndex(i); props.onSelectAccount(i, subIndex) }} />
        )}
      </List>

      <div style={{ display: 'flex', alignItems: 'stretch', flexDirection: 'column', backgroundColor: 'white' }}>
        <Divider />
        <div style={{ display: 'flex', margin: '16px', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Button onClick={props.onImportAccount} variant="contained" size="small">
            <Typography color="textPrimary">{t('createOrImportButtonText')}</Typography>
          </Button>
          <IconButton>
            <Settings />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default AccountListView;
