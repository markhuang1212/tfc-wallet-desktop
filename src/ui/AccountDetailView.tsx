import { AccountData } from "./../Types";
import { AppBar, Button, Container, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ImportExport, Check } from '@material-ui/icons'
import { useEffect, useState } from "react";

const useStyle = makeStyles({
  container: {
    flex: 2
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  }
})

interface AccountDetailViewProps {
  account?: AccountData
  onRename?: (newName: string) => {}
}

function Bip44MasterAccountDetailViewContent(props: AccountDetailViewProps) {
  return null
}

function Bip44CoinAccountDetailViewContent(props: AccountDetailViewProps) {
  return null
}

function PlainAccountDetailViewContent(props: AccountDetailViewProps) {
  return null
}

function AccountDetailView(props: AccountDetailViewProps) {

  const classes = useStyle()
  const [accountName, setAccountName] = useState('')

  useEffect(() => {
    setAccountName(props.account?.accountName ?? '')
  }, [props.account])

  const changeAccountName = (event: any) => {
    setAccountName(event.target.value)
  }

  return (
    <div className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant='h6'>TFC Wallet</Typography>
          <span style={{ flex: 1 }}></span>
          {props.account && (<Button color="inherit">Transfer</Button>)}
          {props.account && (<Button color="inherit">Export</Button>)}
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        {props.account ?
          <div className={classes.content}>
            <div style={{ display: props.account?.accountType === 'plain' ? 'block' : 'none', marginTop: '24px' }}>
              <Typography variant="subtitle1">Balance</Typography>
              <Typography variant="h2">{props.account?.accountBalance?.toString()}</Typography>
            </div>
            <TextField style={{ marginTop: '24px' }}
              variant="outlined" value={accountName}
              onChange={changeAccountName}
              label="Account Name"
              InputProps={{
                endAdornment: props.account.accountName !== accountName ? (<IconButton color="primary"><Check></Check></IconButton>) : undefined
              }}>
            </TextField>
          </div> :
          <div>
            <Typography variant="h5" color="textSecondary" align="center" style={{ marginTop: '196px' }}>Select An Account</Typography>
          </div>
        }

      </Container>
    </div>
  );
}

export default AccountDetailView;
