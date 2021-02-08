import { AccountData } from "./Types";
import { AppBar, Button, Container, TextField, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ImportExport } from '@material-ui/icons'
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
            <div style={{ display: props.account?.accountType === 'bip44' ? 'none' : 'block', marginTop: '24px'}}>
              <Typography variant="subtitle1">Balance</Typography>
              <Typography variant="h2">{props.account?.accountBalance?.toString()}</Typography>
            </div>
            <TextField style={{marginTop: '24px'}} variant="outlined" value={accountName} onChange={changeAccountName} label="Account Name" />
          </div> :
          <div>
            Select An Account
          </div>
        }

      </Container>
    </div>
  );
}

export default AccountDetailView;
